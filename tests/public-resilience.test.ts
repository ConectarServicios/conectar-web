import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { createClient } from "@supabase/supabase-js";
import { createServerTransport } from "../src/lib/supabase/server-transport.ts";
import { createPublicCache, PUBLIC_CACHE_POLICY } from "../src/lib/supabase/public-cache.ts";

const require = createRequire(import.meta.url);
const budgets = { publicRead: 100, auth: 150, adminRead: 200, write: 300, upload: 400, invitation: 400 };

// Execute real public modules with the real SDK. Unknown imports fail closed;
// all HTTP is injected, so neither cookies nor production can be accessed.
function fixture(fetchImpl: typeof fetch, configured = true, now = Date.now) {
  const modules = new Map<string, Record<string, unknown>>();
  const publicCache = createPublicCache({ now, report() {} });
  function load(file: string): Record<string, unknown> {
    if (modules.has(file)) return modules.get(file)!;
    const exports: Record<string, unknown> = {};
    modules.set(file, exports);
    runInNewContext(ts.transpileModule(readFileSync(file, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    }).outputText, {
      exports, console: { error() {}, warn() {} }, Date, Number,
      require(id: string) {
        if (id === "server-only") return {};
        if (id === "./public-cache.ts" || id === "@/lib/supabase/public-cache") return { publicCache, PUBLIC_CACHE_POLICY };
        if (id === "@supabase/supabase-js") return { createClient };
        if (id === "@/lib/supabase/config") return { getSupabaseConfig() {
          if (!configured) throw new Error("missing configuration");
          return { url: "https://fixture.invalid", publishableKey: "public-fixture-key" };
        } };
        if (id === "@/lib/supabase/server-transport") return { createServerTransport: () => createServerTransport({ budgets, fetchImpl, diagnostic() {} }) };
        if (id === "next/navigation") return { unstable_rethrow(error: unknown) { if (error === navigation) throw error; } };
        if (id === "react") return { cache: <T>(fn: T) => fn };
        if (id === "@/lib/supabase/server") return { createClient() { throw new Error("Public reads must never use the session client"); } };
        if (id.startsWith("@/")) return load(`src/${id.slice(2)}.ts`);
        return require(id);
      },
    });
    return exports;
  }
  return load;
}
const navigation = new Error("navigation sentinel");
type Result = { data: unknown; unavailable: boolean };
type Loader = (...args: unknown[]) => Promise<Result>;
const contentLoaders = [
  ["news", "getPublicNews"], ["news", "getPublicFeaturedAlert"], ["news", "getPublicNewsDetail"],
  ["events", "getPublicEvents"], ["events", "getUpcomingPublicEvents"], ["events", "getPublicEvent"],
  ["promotions", "getPublicPromotions"], ["promotions", "getPublicPromotion"],
  ["faqs", "getPublicFaqs"], ["faqs", "getFeaturedFaqs"],
  ["conectar-play", "getPlaySettings"], ["conectar-play", "getPlayPlans"],
  ["conectar-play", "getPlayPacks"], ["conectar-play", "getPlayFaqs"],
] as const;

test("public client has no Auth/session and sends only anonymous headers with no persistent cache", async () => {
  const requests: { url: string; headers: Headers; cache?: RequestCache }[] = [];
  const load = fixture(async (url, init) => {
    requests.push({ url: String(url), headers: new Headers(init?.headers), cache: init?.cache });
    return Response.json([]);
  });
  const client = await (load("src/lib/supabase/public.ts").createPublicClient as () => Promise<ReturnType<typeof createClient>>)();
  assert.throws(() => client.auth.getSession(), /accessToken option/);
  await client.from("news").select("title");
  assert.equal(requests.length, 1);
  assert.match(requests[0].url, /\/rest\/v1\/news/);
  assert.equal(requests[0].headers.get("authorization"), "Bearer public-fixture-key");
  assert.equal(requests[0].headers.get("cookie"), null);
  assert.equal(requests[0].cache, "no-store");
});

for (const scenario of ["unreachable", "slow", "server-error", "missing-config"] as const) {
  test(`all public content loaders survive ${scenario}, without accumulated waits`, async () => {
    let requests = 0;
    let cancelled = 0;
    const load = fixture(async (_url, init) => {
      requests++;
      if (scenario === "unreachable") throw new TypeError("connection failed");
      if (scenario === "slow") return new Promise((_, reject) => init?.signal?.addEventListener("abort", () => { cancelled++; reject(init.signal?.reason); }, { once: true }));
      return Response.json({ message: "unavailable" }, { status: 503 });
    }, scenario !== "missing-config");
    // Transpile before timing: test budgets measure HTTP, not compiler startup.
    const loaders = contentLoaders.map(([file, name]) => load(`src/lib/supabase/${file}.ts`)[name] as Loader);
    const started = Date.now();
    const results = await Promise.all(loaders.map(fn => fn("fixture")));
    assert.ok(results.every(result => result.unavailable));
    assert.ok(results.every(result => result.data === null || Array.isArray(result.data) && !result.data.length));
    assert.ok(Date.now() - started < 1500, "independent reads should finish together");
    assert.equal(requests, scenario === "missing-config" ? 0 : contentLoaders.length);
    if (scenario === "slow") assert.equal(cancelled, requests);
  });
}

test("partial errors preserve successful sections and only editorial data can reuse a confirmed copy", async () => {
  let failing = false;
  const urls: URL[] = [];
  const load = fixture(async input => {
    const url = new URL(String(input)); urls.push(url);
    if (failing || url.pathname.endsWith("/promotions")) return Response.json({}, { status: 503 });
    return Response.json([{ id: "fixture", title: "Public fixture", slug: "fixture", content: "Fixture", created_at: "2026-01-01T00:00:00Z", published_at: "2026-01-01T00:00:00Z", status: "published", featured: false, excerpt: null, cover_image: null, category: null, author_id: null, content_module: null, alert_ends_at: null }]);
  });
  const news = load("src/lib/supabase/news.ts").getPublicNews as Loader;
  const promotions = load("src/lib/supabase/promotions.ts").getPublicPromotions as Loader;
  const [first, failed] = await Promise.all([news(3), promotions("home", 3)]);
  assert.equal(first.unavailable, false);
  assert.equal(failed.unavailable, true);
  assert.equal((first.data as unknown[]).length, 1);
  failing = true;
  assert.equal((await news(3)).unavailable, false, "a confirmed editorial copy remains available within its short fresh period");
  assert.equal(urls[0].searchParams.get("status"), "eq.published");
  assert.match(urls[0].searchParams.get("published_at") ?? "", /^lte\./);
  assert.equal(urls[0].searchParams.get("limit"), "3");
  assert.equal(urls[1].searchParams.get("active"), "eq.true");
  assert.match(urls[1].searchParams.getAll("or").join(" "), /starts_at.*ends_at/);
});

test("publication, active, temporal and placement filters remain on all relevant requests", async () => {
  const urls: URL[] = [];
  const load = fixture(async input => { urls.push(new URL(String(input))); return Response.json([]); });
  for (const [file, name, args] of [
    ["news", "getPublicNewsDetail", ["sample"]], ["news", "getPublicFeaturedAlert", []],
    ["events", "getPublicEvent", ["sample"]], ["events", "getUpcomingPublicEvents", [3]],
    ["promotions", "getPublicPromotion", ["sample"]], ["promotions", "getPublicPromotions", ["home", 3]],
    ["faqs", "getFeaturedFaqs", [6]], ["conectar-play", "getPlayPlans", []],
  ] as const) {
    await (load(`src/lib/supabase/${file}.ts`)[name] as Loader)(...args);
  }
  for (const url of urls) {
    if (/\/(news|events)$/.test(url.pathname)) assert.equal(url.searchParams.get("status"), "eq.published");
    else assert.equal(url.searchParams.get("active"), "eq.true");
  }
  assert.match(urls[1].searchParams.get("or") ?? "", /alert_ends_at.gt/);
  assert.match(urls[3].searchParams.get("or") ?? "", /ends_at.gte/);
  assert.equal(urls[5].searchParams.get("placements"), "cs.{home}");
});

test("configuration/contact/mesh outages expose no invented commercial data", async () => {
  const load = fixture(async () => { throw new TypeError("offline"); });
  const settings = load("src/lib/supabase/site-settings.ts");
  const installation = await (settings.getPublicInstallationConfiguration as () => Promise<{price: unknown; installmentPrice: unknown}>)();
  assert.equal(installation.price, null);
  assert.equal(installation.installmentPrice, null);
  const contact = await (load("src/lib/supabase/contact-information.ts").getPublicContactInformation as Loader)();
  assert.equal(contact.data, null);
  const mesh = await (load("src/lib/supabase/mesh-pricing.ts").getPublicMeshPricing as () => Promise<unknown[]>)();
  assert.equal(mesh.length, 0);
});

test("public fallback preserves Next navigation/rendering signals", async () => {
  const read = fixture(async () => Response.json([]))("src/lib/supabase/public-read.ts").publicRead as (name: string, fallback: null, fn: () => Promise<never>) => Promise<unknown>;
  await assert.rejects(read("fixture", null, async () => { throw navigation; }), error => error === navigation);
});

const newsFixture = { id: "fixture", title: "Confirmed fixture", slug: "fixture", content: "Fixture", created_at: "2026-01-01T00:00:00Z", published_at: "2026-01-01T00:00:00Z", status: "published", featured: false, excerpt: null, cover_image: null, category: null, author_id: null, content_module: null, alert_ends_at: null };

test("real news loader supports warm outage, hard expiry, confirmed unpublication and recovery", async () => {
  let clock = Date.now(); let mode = "healthy"; let calls = 0;
  const load = fixture(async () => {
    calls++;
    if (mode === "offline") return Response.json({}, { status: 503 });
    return Response.json(mode === "unpublished" ? [] : [newsFixture]);
  }, true, () => clock);
  const news = load("src/lib/supabase/news.ts").getPublicNews as Loader;
  assert.equal((await news(3)).unavailable, false);
  mode = "offline"; clock += 16_000;
  assert.equal((await news(3)).unavailable, false);
  assert.equal(calls, 2, "stale copies first attempt a bounded refresh");
  clock += 120_000;
  assert.equal((await news(3)).unavailable, true);
  mode = "healthy";
  assert.equal((await news(3)).unavailable, false);
  mode = "unpublished"; clock += 16_000;
  assert.equal(((await news(3)).data as unknown[]).length, 0);
  mode = "offline"; clock += 16_000;
  assert.equal(((await news(3)).data as unknown[]).length, 0);
});

test("real loaders refuse cached content after a known RLS/authorization denial", async () => {
  let clock = Date.now(); let status = 200;
  const load = fixture(async () => status === 200 ? Response.json([newsFixture]) : Response.json({ code: "42501" }, { status }), true, () => clock);
  const news = load("src/lib/supabase/news.ts").getPublicNews as Loader;
  assert.equal((await news(3)).unavailable, false);
  status = 403; clock += 16_000;
  assert.equal((await news(3)).unavailable, true);
  status = 503;
  assert.equal((await news(3)).unavailable, true, "a known denial must have purged the older copy");
});

test("expired upcoming events disappear even from a still-fresh snapshot", async () => {
  let clock = Date.now(); let calls = 0;
  const event = { id: "fixture", title: "Fixture", slug: "fixture", summary: "Fixture", description: "Fixture", created_at: new Date(clock).toISOString(), status: "published", featured: false, image_path: null, location: null, address: null, button_text: null, button_url: null, starts_at: new Date(clock + 1000).toISOString(), ends_at: new Date(clock + 2000).toISOString() };
  const load = fixture(async () => { calls++; return Response.json([event]); }, true, () => clock);
  const events = load("src/lib/supabase/events.ts").getUpcomingPublicEvents as Loader;
  assert.equal(((await events(3)).data as unknown[]).length, 1);
  clock += 3000;
  assert.equal(((await events(3)).data as unknown[]).length, 0);
  assert.equal(calls, 1);
});

test("commercial Play prices and promotions never fall back to an older success", async () => {
  let offline = false;
  const load = fixture(async () => offline ? Response.json({}, { status: 503 }) : Response.json([{ promotional_price: 123, starts_at: null, ends_at: null }]));
  const plans = load("src/lib/supabase/conectar-play.ts").getPlayPlans as Loader;
  const offers = load("src/lib/supabase/promotions.ts").getPublicPromotions as Loader;
  assert.equal((await plans()).unavailable, false);
  assert.equal((await offers("home")).unavailable, false);
  offline = true;
  assert.equal((await plans()).unavailable, true);
  assert.equal((await offers("home")).unavailable, true);
});

test("FAQ and public contact retain only validated copies and stop at the five-minute bound", async () => {
  let clock = Date.now(); let offline = false;
  const contact = { id: "fixture", phone: null, whatsapp: "5493493123456", commercial_email: "fixture@example.invalid", address: "Fixture", business_hours: null, guard_hours: null };
  const faq = { id: "fixture", question: "Fixture?", answer: "Fixture.", category: "General", active: true, featured: true, display_order: 0, created_at: new Date(clock).toISOString(), updated_at: new Date(clock).toISOString() };
  const load = fixture(async input => offline ? Response.json({}, { status: 503 }) : Response.json([String(input).includes("/faqs") ? faq : contact]), true, () => clock);
  const faqs = load("src/lib/supabase/faqs.ts").getPublicFaqs as Loader;
  const contacts = load("src/lib/supabase/contact-information.ts").getPublicContactInformation as Loader;
  assert.equal((await faqs()).unavailable, false);
  assert.equal((await contacts()).unavailable, false);
  offline = true; clock += 31_000;
  assert.equal((await faqs()).unavailable, false);
  assert.equal(((await contacts()).data as { whatsapp: string }).whatsapp, contact.whatsapp);
  clock += 300_000;
  assert.equal((await faqs()).unavailable, true);
  assert.equal((await contacts()).data, null);
});
