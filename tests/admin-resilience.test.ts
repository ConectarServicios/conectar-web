import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createClient } from "@supabase/supabase-js";
import { createServerTransport } from "../src/lib/supabase/server-transport.ts";
import { SupabaseOperationError, administrativeRead, operationErrorState, operationErrorCode, operationNoticeMessage } from "../src/lib/supabase/operation-error.ts";
import { invalidateAfterConfirmedMutation, invalidatePublicContent, publicCache, PUBLIC_CACHE_POLICY, type PublicCacheDomain } from "../src/lib/supabase/public-cache.ts";
import { successful } from "../src/lib/supabase/public-cache-validation.ts";

const require = createRequire(import.meta.url);
const budgets = { publicRead: 60, auth: 100, adminRead: 140, write: 80, upload: 100, invitation: 120 };
type ActionResult = { message?: string; success?: boolean };
type Action = (...args: unknown[]) => Promise<ActionResult>;

// Execute the real action/page source. Only I/O, UI leaves and validation fixtures
// are injected. Unknown imports fail closed: these tests cannot reach production.
function load(file: string, dependencies: Record<string, unknown>) {
  const exports: Record<string, unknown> = {};
  const output = ts.transpileModule(readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  runInNewContext(output, {
    exports, File, FormData, URL, Date, Number, console: { error() {} },
    require(id: string) {
      if (id in dependencies) return dependencies[id];
      if (id === "@/lib/supabase/public-cache") return { invalidatePublicContent, invalidateAfterConfirmedMutation };
      if (id === "@/lib/supabase/public-read") return { publicRead() { throw new Error("Administrative reads must never use public cache fallbacks"); } };
      if (id === "@/lib/supabase/public-cache-validation") return {};
      if (id === "@/lib/supabase/public") return { createPublicClient() { throw new Error("Administrative reads must not use the public client"); } };
      if (id === "react/jsx-runtime") return require(id);
      if (id === "node:crypto") return { randomUUID };
      if (id === "@/lib/supabase/operation-error") return { administrativeRead, operationErrorState, operationErrorCode };
      if (id === "@/components/admin/admin-page-header") return { AdminPageHeader: () => createElement("h1", null, "Admin") };
      if (id === "next/navigation") return { redirect: (url: string) => { throw new Error(`REDIRECT:${url}`); }, notFound: () => { throw new Error("NOT_FOUND"); }, unstable_rethrow() {} };
      throw new Error(`Unmocked import: ${id}`);
    },
  });
  return exports;
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

const settleBatch = () => new Promise<void>(resolve => setImmediate(resolve));
type BatchResult = { error: null | { code: string } };
type BatchRow = Record<string, unknown>;
type BatchRead = { data: BatchRow[]; error: null };

// Real public loaders + real cache + real actions. Only the database boundary is
// controlled. Each mutation and read can settle independently, in either order.
function batchFixture(domain: "settings" | "mesh") {
  invalidatePublicContent(domain);
  let database: BatchRow[] = domain === "settings"
    ? [{ key: "internet_installation_price", value: 100 }, { key: "internet_installation_installment_count", value: 2 }, { key: "internet_installation_installment_price", value: 50 }]
    : [{ id: "rental", mode: "rental", equipment_count: 1, price: 100 }, { id: "purchase", mode: "purchase", equipment_count: 1, price: 50 }];
  const reads: { pending: ReturnType<typeof deferred<BatchRead>>; snapshot: BatchRow[] }[] = [];
  const writes: { pending: ReturnType<typeof deferred<BatchResult>>; apply: () => void }[] = [];
  const invalidated: PublicCacheDomain[] = [];
  const publicClient = { from() {
    const pending = deferred<BatchRead>();
    reads.push({ pending, snapshot: structuredClone(database) });
    const query = {
      select() { return query; }, in() { return query; }, eq() { return query; }, order() { return query; },
      then: pending.promise.then.bind(pending.promise),
    };
    return query;
  } };
  const admin = {
    auth: { getUser: async () => ({ data: { user: { id: "fixture" } }, error: null }) },
    from(table: string) {
      if (table === "profiles") return { select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { active: true, role: "admin" }, error: null }) }) }) };
      assert.equal(table, domain === "settings" ? "site_settings" : "mesh_pricing");
      return {
        upsert(rows: BatchRow[]) {
          const pending = deferred<BatchResult>();
          writes.push({ pending, apply() {
            for (const row of rows) {
              database = database.filter(old => domain === "settings" ? old.key !== row.key : old.mode !== row.mode || old.equipment_count !== row.equipment_count);
              database.push({ ...row });
            }
          } });
          return pending.promise;
        },
        delete() {
          const pending = deferred<BatchResult>();
          const filters: Record<string, unknown> = {};
          writes.push({ pending, apply() {
            database = database.filter(row => !Object.entries(filters).every(([key, value]) => Array.isArray(value) ? value.includes(row[key]) : row[key] === value));
          } });
          const query = {
            in(key: string, value: unknown[]) { filters[key] = value; return query; },
            eq(key: string, value: unknown) { filters[key] = value; return query; },
            then: pending.promise.then.bind(pending.promise),
          };
          return query;
        },
      };
    },
  };
  const cacheDependency = {
    publicCache, PUBLIC_CACHE_POLICY,
    async invalidateAfterConfirmedMutation(group: PublicCacheDomain, mutation: PromiseLike<BatchResult>) {
      const result = await invalidateAfterConfirmedMutation(group, mutation);
      if (result.error === null) invalidated.push(group);
      return result;
    },
  };
  const publicRead = load("src/lib/supabase/public-read.ts", { "./public-cache.ts": { publicCache } });
  const dependencies = {
    "@/lib/supabase/public-cache": cacheDependency,
    "@/lib/supabase/public-read": publicRead,
    "@/lib/supabase/public-cache-validation": { successful },
    "@/lib/supabase/public": { createPublicClient: async () => publicClient },
    "@/lib/supabase/server": { createClient: async () => admin },
    "react": { cache: <T>(fn: T) => fn },
    "next/cache": { revalidatePath() {} },
  };
  const settings = domain === "settings" ? load("src/lib/supabase/site-settings.ts", dependencies) : null;
  const mesh = domain === "mesh" ? load("src/lib/supabase/mesh-pricing.ts", dependencies) : null;
  const actions = load(`src/app/admin/${domain}/actions.ts`, {
    ...dependencies,
    "@/lib/supabase/site-settings": settings,
    "@/lib/validations/site-settings": { parseInternetSettings: () => ({ values: { internetInstallationPrice: 200, internetInstallationInstallmentCount: null, internetInstallationInstallmentPrice: null }, fieldErrors: {} }) },
  });
  const form = new FormData();
  // Four configured rentals and one cleared purchase make exactly two Mesh writes.
  if (domain === "mesh") for (let count = 1; count <= 4; count++) form.set(`rental_${count}`, "200");
  const action = () => (actions[domain === "settings" ? "saveInternetSettings" : "saveMeshPricing"] as Action)({}, form);
  const read = () => ((settings ?? mesh)![domain === "settings" ? "getPublicInstallationConfiguration" : "getPublicMeshPricing"] as () => Promise<unknown>)();
  const finishRead = (index: number) => reads[index].pending.resolve({ data: reads[index].snapshot, error: null });
  const confirm = (index: number) => { writes[index].apply(); writes[index].pending.resolve({ error: null }); };
  const fail = (index: number, uncertain: boolean) => {
    if (uncertain) writes[index].pending.reject(new SupabaseOperationError("APP_WRITE_UNCERTAIN", true));
    else writes[index].pending.resolve({ error: { code: "42501" } });
  };
  return { action, read, finishRead, confirm, fail, reads, writes, invalidated };
}

for (const domain of ["settings", "mesh"] as const) {
  for (const confirmedIndex of [0, 1]) for (const uncertain of [false, true]) for (const confirmsFirst of [true, false]) {
    test(`${domain}: write ${confirmedIndex + 1} confirms ${confirmsFirst ? "before" : "after"} ${uncertain ? "uncertain" : "rejected"} peer; old public reads are fenced`, async () => {
      const fixture = batchFixture(domain);
      const earlier = fixture.read();
      await settleBatch();
      assert.equal(fixture.reads.length, 1);
      const action = fixture.action();
      await settleBatch();
      assert.equal(fixture.writes.length, 2);
      if (!confirmsFirst) fixture.fail(1 - confirmedIndex, uncertain);
      await settleBatch();
      fixture.confirm(confirmedIndex);
      await settleBatch();
      assert.deepEqual(fixture.invalidated, [domain], "confirmation must invalidate before waiting for its peer");
      const later = fixture.read();
      await settleBatch();
      assert.equal(fixture.reads.length, 2, "a new visit must not share the old generation");
      fixture.finishRead(1);
      const current = await later;
      if (confirmsFirst) fixture.fail(1 - confirmedIndex, uncertain);
      const state = await action;
      assert.notEqual(state.success, true);
      if (uncertain) assert.match(state.message ?? "", /No pudimos confirmar/);
      fixture.finishRead(0);
      const old = await earlier;
      if (domain === "settings") {
        assert.equal((old as { price: unknown }).price, null);
        assert.equal((current as { price: unknown; installmentPrice: unknown })[confirmedIndex === 0 ? "price" : "installmentPrice"], confirmedIndex === 0 ? 200 : null);
      } else {
        assert.equal((old as unknown[]).length, 0);
        const rows = current as { mode: string; price: number }[];
        if (confirmedIndex === 0) assert.equal(rows.find(row => row.mode === "rental")?.price, 200);
        else assert.equal(rows.some(row => row.mode === "purchase"), false);
      }
      const newest = fixture.read();
      await settleBatch(); fixture.finishRead(2);
      assert.deepEqual(await newest, current, "a late old reply must not reintroduce the old price");
      assert.equal(fixture.writes.length, 2, "no retries or compensating mutations");
      assert.deepEqual(fixture.invalidated, [domain], "failed/uncertain peers do not invalidate");
    });
  }
  test(`${domain}: no confirmed writes means no invalidation, replay or fabricated success`, async () => {
    const fixture = batchFixture(domain);
    const earlier = fixture.read(); await settleBatch();
    const action = fixture.action(); await settleBatch();
    fixture.fail(0, true); fixture.fail(1, true);
    assert.notEqual((await action).success, true);
    const later = fixture.read(); await settleBatch();
    assert.equal(fixture.reads.length, 1, "without confirmation the generation must remain unchanged");
    fixture.finishRead(0);
    assert.deepEqual(await later, await earlier);
    assert.deepEqual(fixture.invalidated, []);
    assert.equal(fixture.writes.length, 2);
  });
  test(`${domain}: each confirmed write fences its own older readers when the whole batch succeeds`, async () => {
    const fixture = batchFixture(domain);
    const first = fixture.read(); await settleBatch();
    const action = fixture.action(); await settleBatch();
    fixture.confirm(0); await settleBatch();
    const between = fixture.read(); await settleBatch();
    assert.equal(fixture.reads.length, 2);
    fixture.confirm(1); await settleBatch();
    assert.equal((await action).success, true);
    assert.deepEqual(fixture.invalidated, [domain, domain]);
    const after = fixture.read(); await settleBatch();
    assert.equal(fixture.reads.length, 3);
    fixture.finishRead(2); await after;
    fixture.finishRead(1); fixture.finishRead(0);
    for (const old of await Promise.all([first, between])) {
      if (domain === "settings") assert.equal((old as { price: unknown }).price, null);
      else assert.equal((old as unknown[]).length, 0);
    }
    assert.equal(fixture.writes.length, 2);
  });
}

function fixtureClient(mode: "lost" | "timeout" | "success" | "rejected" | "upload-lost" | "read-lost" | "cleanup-lost") {
  const calls: { method: string; path: string }[] = [];
  const transport = createServerTransport({ budgets, diagnostic() {}, fetchImpl: async (input, init) => {
    const path = new URL(String(input)).pathname;
    const method = init?.method ?? "GET";
    calls.push({ method, path });
    if (path.endsWith("/profiles") && method === "GET") {
      if (mode === "read-lost") throw new TypeError("lost authorization lookup reply");
      return Response.json([{ id: "user", active: true, role: "super_admin" }]);
    }
    if (path.startsWith("/storage/")) {
      if (mode === "cleanup-lost" && method === "DELETE") throw new TypeError("lost cleanup reply after confirmed content write");
      if (mode === "upload-lost" && method === "POST") throw new TypeError("lost upload reply");
      return Response.json({ Key: "fixture" });
    }
    if (mode === "cleanup-lost" && method === "GET") return Response.json({ id: "saved", cover_image: "old.png", image_path: "old.png", slug: "old" });
    if (mode === "lost") throw new TypeError("lost reply after simulated commit");
    if (mode === "timeout") return new Promise((_, reject) => init?.signal?.addEventListener("abort", () => reject(init.signal?.reason), { once: true }));
    if (mode === "rejected") return Response.json({ code: "23505", message: "duplicate" }, { status: 409 });
    return Response.json({ id: "saved" });
  } });
  const raw = transport.construct(() => createClient("https://audit.invalid", "fixture", {
    db: { retry: false }, global: { fetch: transport.fetch }, auth: { persistSession: false, autoRefreshToken: false, skipAutoInitialize: true },
  }));
  const bounded = transport.bind(raw);
  const client = new Proxy(bounded, { get(target, property, receiver) {
    if (property === "auth") return { getUser: async () => ({ data: { user: { id: "user" } }, error: null }) };
    return Reflect.get(target, property, receiver);
  } });
  return { client, calls };
}

for (const [folder, fn, parse, validate, field, bucket] of [
  ["news", "saveNews", "parseNewsForm", "validateNewsImage", "cover_image", "NEWS_BUCKET"],
  ["events", "saveEvent", "parseEventForm", "validateEventImage", "image", "EVENTS_BUCKET"],
  ["promotions", "savePromotion", "parsePromotionForm", "validatePromotionImage", "image", "PROMOTIONS_BUCKET"],
]) {
  for (const mode of ["lost", "timeout", "upload-lost"] as const) {
    test(`${folder}: ${mode} is caught by the real Server Action without cleanup or success`, async () => {
      const { client, calls } = fixtureClient(mode);
      let revalidations = 0;
      const action = load(`src/app/admin/${folder}/actions.ts`, {
        "@/lib/supabase/server": { createClient: async () => client },
        "next/cache": { revalidatePath() { revalidations++; } },
        [`@/lib/supabase/${folder}`]: { [bucket]: "fixture-images" },
        [`@/lib/validations/${folder}`]: { [parse]: () => ({ data: { title: "fixture", slug: "fixture", status: "published" }, errors: {} }), [validate]: () => null },
      })[fn] as Action;
      const form = new FormData();
      form.set(field, new File(["fixture"], "fixture.png", { type: "image/png" }));
      const result = await action({}, form);
      assert.notEqual(result.success, true);
      assert.match(result.message ?? "", /No pudimos confirmar/);
      assert.match(result.message ?? "", /antes de volver a intentar/);
      assert.equal(revalidations, 0);
      assert.equal(calls.filter(call => call.method === "DELETE").length, 0, "never delete an image after an uncertain write");
      assert.equal(calls.filter(call => call.path.endsWith(`/${folder}`) && call.method === "POST").length, mode === "upload-lost" ? 0 : 1);
    });
  }
}

test("definite validation rejection can still compensate its unused uploaded image", async () => {
  const { client, calls } = fixtureClient("rejected");
  const action = load("src/app/admin/news/actions.ts", {
    "@/lib/supabase/server": { createClient: async () => client }, "next/cache": { revalidatePath() {} },
    "@/lib/supabase/news": { NEWS_BUCKET: "fixture-images" },
    "@/lib/validations/news": { parseNewsForm: () => ({ data: { title: "fixture", slug: "fixture" }, errors: {} }), validateNewsImage: () => null },
  }).saveNews as Action;
  const form = new FormData(); form.set("cover_image", new File(["fixture"], "fixture.png", { type: "image/png" }));
  const result = await action({}, form);
  assert.match(result.message ?? "", /slug/);
  assert.equal(calls.filter(call => call.method === "DELETE").length, 1);
});

test("RPC timeout becomes safe form state; successful redirects are not swallowed", async () => {
  for (const mode of ["timeout", "success"] as const) {
    const { client } = fixtureClient(mode);
    const action = load("src/app/admin/plans/actions.ts", {
      "@/lib/supabase/server": { createClient: async () => client }, "next/cache": { revalidatePath() {} },
      "@/lib/validations/plans": { parsePlanForm: () => ({ data: {}, features: [] }) },
    }).savePlan as Action;
    if (mode === "timeout") assert.match((await action({}, new FormData())).message ?? "", /No pudimos confirmar/);
    else await assert.rejects(action({}, new FormData()), /REDIRECT:.*success=created/);
  }
});

test("unknown profile write does not compensate by deleting the invited Auth account", async () => {
  const operation = new SupabaseOperationError("APP_WRITE_UNCERTAIN", true);
  let deleted = 0;
  const action = load("src/app/admin/users/actions.ts", {
    "next/cache": { revalidatePath() {} },
    "@/lib/auth/require-super-admin": { requireSuperAdmin: async () => ({ user: { id: "user" }, supabase: { from: () => ({ insert: async () => { throw operation; } }) } }) },
    "@/lib/supabase/admin": { createAdminClient: () => ({ auth: { admin: {
      inviteUserByEmail: async () => ({ data: { user: { id: "invited" } }, error: null }),
      deleteUser: async () => { deleted++; return { error: null }; },
    } } }) },
    "@/lib/utils/site-url": { getSiteUrl: () => new URL("https://fixture.invalid") },
    "@/lib/validations/admin-users": { isUuid: () => true, parseUserForm: () => ({ data: { email: "fixture@example.invalid", fullName: "Fixture", role: "editor" } }) },
  }).inviteAdminUser as Action;
  assert.match((await action({}, new FormData())).message ?? "", /No pudimos confirmar/);
  assert.equal(deleted, 0);
});

test("failed authorization reads are reported as unavailable and never reach mutations", async () => {
  const { client, calls } = fixtureClient("read-lost");
  const action = load("src/app/admin/plans/actions.ts", {
    "@/lib/supabase/server": { createClient: async () => client }, "next/cache": { revalidatePath() {} },
    "@/lib/validations/plans": { parsePlanForm: () => ({ data: {}, features: [] }) },
  }).savePlan as Action;
  const result = await action({}, new FormData());
  assert.match(result.message ?? "", /servicio no respondió/);
  assert.notEqual(result.success, true);
  assert.ok(calls.every(call => call.method === "GET"));
  await assert.rejects(administrativeRead(Promise.resolve({ error: { status: 0 } })), { code: "APP_UNAVAILABLE" });
  const denied = await administrativeRead(Promise.resolve({ error: { status: 401 } }));
  assert.equal(denied.error.status, 401, "genuine authorization denials keep their original meaning");
});

test("super-admin authorization preserves roles while distinguishing network outages", async () => {
  for (const role of ["super_admin", "editor", "inactive", "outage"]) {
    const authorization = load("src/lib/auth/require-super-admin.ts", {
      "server-only": {},
      "@/lib/supabase/server": { createClient: async () => ({
        auth: { getUser: async () => ({ data: { user: { id: "user" } }, error: null }) },
        from: () => ({ select() { return this; }, eq() { return this; }, maybeSingle: async () => role === "outage"
          ? { data: null, error: { code: "APP_TIMEOUT" }, status: 0 }
          : { data: { active: role !== "inactive", role: role === "inactive" ? "super_admin" : role }, error: null, status: 200 } }),
      }) },
    }).requireSuperAdmin as () => Promise<unknown>;
    if (role === "outage") await assert.rejects(authorization(), { code: "APP_UNAVAILABLE" });
    else if (role === "super_admin") assert.ok(await authorization());
    else assert.equal(await authorization(), null);
  }
});

test("administrative settings use the admin budget and never return defaults on failure", async () => {
  const modes: unknown[] = [];
  const query = { select() { return this; }, in() { return this; }, eq: async () => ({ data: null, error: { code: "APP_TIMEOUT" } }) };
  const loaded = load("src/lib/supabase/site-settings.ts", {
    react: { cache: (fn: unknown) => fn },
    "@/lib/supabase/server": { createClient: async (mode?: string) => { modes.push(mode); return { from: () => query }; } },
  });
  const result = await (loaded.getAdminSiteConfiguration as () => Promise<{ data: unknown; unavailable: boolean }>)();
  assert.equal(result.unavailable, true); assert.equal(result.data, null);
  assert.deepEqual(modes, [undefined], "default server client uses adminRead, not publicRead");
});

test("failed Mesh reads remain unavailable rather than a valid empty array", async () => {
  const query = { select() { return this; }, order() { return this; }, then(resolve: (value: unknown) => unknown) { return Promise.resolve(resolve({ data: null, error: { code: "APP_TIMEOUT" } })); } };
  const loaded = load("src/lib/supabase/mesh-pricing.ts", { react: { cache: (fn: unknown) => fn }, "@/lib/supabase/server": { createClient: async () => ({ from: () => query }) } });
  const result = await (loaded.getAdminMeshPricing as () => Promise<{ data: unknown; unavailable: boolean }>)();
  assert.equal(result.unavailable, true); assert.equal(result.data, null);
});

test("failed settings page does not render editable fallback values", async () => {
  const deniedRead = { data: null, error: { code: "APP_TIMEOUT" } };
  const query = { select() { return this; }, eq() { return this; }, maybeSingle: async () => deniedRead };
  const loaded = load("src/app/admin/settings/page.tsx", {
    "@/lib/supabase/server": { createClient: async () => ({ auth: { getUser: async () => ({ data: { user: { id: "user" } } }) }, from: () => query }) },
    "@/lib/supabase/site-settings": { getAdminSiteConfiguration: async () => ({ data: null, unavailable: true }) },
    "@/components/admin/settings/settings-forms": { IdentitySettingsForm: () => createElement("form"), InternetSettingsForm: () => createElement("form"), SeoSettingsForm: () => createElement("form") },
    "@/components/admin/admin-operation-notice": { AdminReadError: () => createElement("p", { role: "alert" }, "No pudimos cargar los datos") },
  });
  const html = renderToStaticMarkup(await (loaded.default as () => Promise<ReturnType<typeof createElement>>)());
  assert.match(html, /role="alert"/); assert.doesNotMatch(html, /<form/);
});

test("Contact, Mesh and Play pages block forms after failed reads", async () => {
  const failure = { data: null, error: { code: "APP_TIMEOUT" } };
  const query = { select() { return this; }, eq() { return this; }, order() { return this; }, maybeSingle: async () => failure,
    then(resolve: (value: unknown) => unknown) { return Promise.resolve(resolve(failure)); } };
  const server = { createClient: async () => ({ auth: { getUser: async () => ({ data: { user: { id: "user" } } }) }, from: () => query }) };
  const notice = { AdminReadError: () => createElement("p", { role: "alert" }, "No pudimos cargar los datos"), AdminOperationNotice: () => null };
  for (const [path, dependencies] of [
    ["src/app/admin/contact/page.tsx", { "@/components/admin/contact/contact-information-form": { ContactInformationForm: () => createElement("form") } }],
    ["src/app/admin/mesh/page.tsx", { "@/lib/supabase/mesh-pricing": { getAdminMeshPricing: async () => ({ data: null, unavailable: true }) }, "@/components/admin/mesh/mesh-pricing-form": { MeshPricingForm: () => createElement("form") } }],
    ["src/app/admin/conectar-play/page.tsx", { "@/components/admin/conectar-play/conectar-play-delete-button": {}, "@/components/admin/conectar-play/conectar-play-forms": {} }],
  ] as const) {
    const loaded = load(path, { "@/lib/supabase/server": server, "@/components/admin/admin-operation-notice": notice, ...dependencies });
    const html = renderToStaticMarkup(await (loaded.default as (props: unknown) => Promise<ReturnType<typeof createElement>>)({ searchParams: Promise.resolve({}) }));
    assert.match(html, /role="alert"/, path); assert.doesNotMatch(html, /<form/, path);
  }
});

test("unexpected failures and navigation signals are not hidden by the safe action boundary", () => {
  assert.throws(() => operationErrorState(new Error("programming failure")), /programming failure/);
  assert.throws(() => operationErrorCode(new Error("REDIRECT")), /REDIRECT/);
  assert.equal(operationNoticeMessage("unknown"), null);
});

for (const [folder, fn, parse, validate, field, bucket] of [
  ["news", "saveNews", "parseNewsForm", "validateNewsImage", "cover_image", "NEWS_BUCKET"],
  ["events", "saveEvent", "parseEventForm", "validateEventImage", "image", "EVENTS_BUCKET"],
  ["promotions", "savePromotion", "parsePromotionForm", "validatePromotionImage", "image", "PROMOTIONS_BUCKET"],
]) {
  for (const mode of ["success", "lost", "cleanup-lost"] as const) {
    test(folder + ": " + mode + " invalidates only after a confirmed write, before optional cleanup", async () => {
      const domain = folder as PublicCacheDomain;
      invalidatePublicContent(domain);
      const cached = { domain, key: "action-fixture", policy: PUBLIC_CACHE_POLICY.editorial, valid: (value: { unavailable: boolean }) => !value.unavailable };
      const absent = { data: [], unavailable: true, allowStale: true };
      const confirmed = { data: ["old"], unavailable: false };
      await publicCache.read(cached, absent, async () => confirmed);
      const { client } = fixtureClient(mode);
      let invalidations = 0;
      const action = load("src/app/admin/" + folder + "/actions.ts", {
        "@/lib/supabase/public-cache": { invalidatePublicContent(value: PublicCacheDomain) { invalidations++; invalidatePublicContent(value); } },
        "@/lib/supabase/server": { createClient: async () => client },
        "next/cache": { revalidatePath() {} },
        ["@/lib/supabase/" + folder]: { [bucket]: "fixture-images" },
        ["@/lib/validations/" + folder]: { [parse]: () => ({ data: { title: "fixture", slug: "fixture", status: "published" }, errors: {} }), [validate]: () => null },
      })[fn] as Action;
      const form = new FormData();
      if (mode === "cleanup-lost") {
        form.set("id", "existing");
        form.set(field, new File(["fixture"], "fixture.png", { type: "image/png" }));
      }
      try { await action({}, form); } catch (error) { assert.match(String(error), /REDIRECT:/); }
      const result = await publicCache.read(cached, absent, async () => absent);
      assert.equal(invalidations, mode === "lost" ? 0 : 1);
      assert.deepEqual(result, mode === "lost" && domain !== "promotions" ? confirmed : absent);
    });
  }
}
