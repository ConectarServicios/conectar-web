import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { once } from "node:events";

// This suite builds and starts its own Next server with fake credentials and a
// loopback-only Supabase fixture. It never uses .env.local's backend or accounts.
const backendPort = 43181;
const appPort = 43182;
const base = `http://127.0.0.1:${appPort}`;
const env = {
  ...process.env,
  NEXT_PUBLIC_SUPABASE_URL: `http://127.0.0.1:${backendPort}`,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "public-fixture-key",
  NEXT_TELEMETRY_DISABLED: "1",
};
let mode = "unreachable";
let next;
let logs = "";
const calls = [];
const publicTables = new Set(["news", "events", "promotions", "plans", "site_settings", "contact_information", "faqs", "conectar_play_settings", "conectar_play_plans", "conectar_play_packs", "conectar_play_faqs", "social_links", "mesh_pricing"]);
const article = { id: "fixture", title: "Noticia pública simulada", slug: "fixture", excerpt: "Contenido aislado de prueba", content: "Texto simulado", cover_image: null, category: "Institucional", status: "published", featured: false, published_at: "2026-01-01T12:00:00Z", alert_ends_at: null, content_module: null, author_id: null, created_at: "2026-01-01T12:00:00Z" };
const backend = createServer((req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${backendPort}`);
  calls.push({ path: url.pathname, headers: req.headers, method: req.method });
  if (url.pathname.startsWith("/auth/")) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ code: "invalid_credentials", message: "Fixture authentication failure" }));
    return;
  }
  if (mode === "unreachable") return req.socket.destroy();
  if (mode === "slow") return; // Real transport deadline must close this socket.
  if (mode === "server-error" || mode === "partial" && url.pathname.endsWith("/faqs")) {
    res.writeHead(503, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Fixture unavailable" }));
    return;
  }
  let rows = [];
  if (url.pathname.endsWith("/plans")) rows = [{ id: "plan-fixture", name: "Plan simulado de prueba", slug: "plan-fixture", speed_mbps: 555, upload_speed_mbps: 555, description: "Fixture aislado", regular_price: 54321, promotional_price: null, promotion_label: null, promotion_start: null, promotion_end: null, featured: false, active: true, display_order: 0, plan_features: [] }];
  if (url.pathname.endsWith("/news") && url.searchParams.get("featured") !== "eq.true") {
    if (!url.searchParams.has("slug") || url.searchParams.get("slug") === "eq.fixture") rows = [article];
  }
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(rows));
});

async function startNext(args) {
  const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", ...args], { env, windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
  child.stdout.on("data", data => { logs += data; });
  child.stderr.on("data", data => { logs += data; });
  return child;
}

before(async () => {
  backend.listen(backendPort, "127.0.0.1");
  await once(backend, "listening");
  const build = await startNext(["build"]);
  const [code] = await once(build, "exit");
  assert.equal(code, 0, `Isolated build failed:\n${logs}`);
  logs = "";
  next = await startNext(["start", "--hostname", "127.0.0.1", "--port", String(appPort)]);
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${base}/robots.txt`);
      if (res.ok) return;
    } catch {}
    if (next.exitCode != null) throw new Error(`Next exited:\n${logs}`);
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  throw new Error(`Next did not start:\n${logs}`);
}, { timeout: 180000 });

after(async () => {
  if (next && next.exitCode == null) {
    const closed = once(next, "exit");
    next.kill();
    await closed;
  }
  backend.closeAllConnections();
  await new Promise(resolve => backend.close(resolve));
});

const paths = ["/", "/corporativo", "/quienes-somos", "/servicios", "/conectar-play", "/noticias", "/eventos", "/promociones", "/preguntas-frecuentes", "/noticias/fixture", "/eventos/fixture", "/promociones/fixture"];
const encode = value => Buffer.from(JSON.stringify(value)).toString("base64url");
const expiredToken = `${encode({ alg: "HS256", typ: "JWT" })}.${encode({ sub: "00000000-0000-4000-8000-000000000001", aud: "authenticated", exp: 1 })}.Zml4dHVyZQ`;
const cookie = `sb-127-auth-token=base64-${encode({ access_token: expiredToken, refresh_token: "fixture-refresh", expires_at: 1, expires_in: 1, token_type: "bearer", user: { id: "00000000-0000-4000-8000-000000000001" } })}`;

for (const scenario of ["unreachable", "slow", "server-error"]) {
  test(`cold public routes survive ${scenario}, with and without session cookies`, { timeout: 30000 }, async () => {
    mode = scenario;
    calls.length = 0;
    const started = Date.now();
    const results = await Promise.all(paths.flatMap(path => [false, true].map(async withCookies => {
      const response = await fetch(`${base}${path}`, { headers: withCookies ? { Cookie: cookie } : {}, signal: AbortSignal.timeout(12000) });
      assert.equal(response.status, 200, path);
      assert.equal(response.headers.get("set-cookie"), null, "public pages must never refresh a session");
      const html = await response.text();
      assert.match(html, /<title>/, path);
      assert.match(html, /name="description"/, path);
      assert.match(html, /<footer/, path);
      assert.doesNotMatch(html, /NEXT_HTTP_ERROR_FALLBACK;500|"digest":"\d|Application error:|Internal Server Error/, path);
      if (path === "/") {
        assert.match(html, /Los planes no están disponibles temporalmente/);
        assert.match(html, /id="cobertura"/);
        assert.match(html, /rel="canonical" href="https:\/\/conectarservicios.com.ar\/"/);
      }
      if (/^\/(noticias|eventos|promociones)\/fixture$/.test(path)) assert.match(html, /Contenido no disponible temporalmente/);
      return html;
    })));
    assert.equal(results.length, paths.length * 2);
    assert.ok(Date.now() - started < 10000, "public reads must not accumulate per-section deadlines");
    assert.ok(calls.length, "fixture must actually receive HTTP requests");
    for (const call of calls) {
      assert.equal(call.method, "GET");
      assert.ok(publicTables.has(call.path.split("/").at(-1)), `Unexpected private/Auth request: ${call.path}`);
      assert.equal(call.headers.cookie, undefined);
      assert.equal(call.headers.authorization, "Bearer public-fixture-key");
    }
  });
}

test("partial errors do not hide healthy news, metadata or the rest of Hogar", async () => {
  mode = "partial";
  const response = await fetch(base);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Noticia pública simulada/);
  assert.match(html, /Las preguntas frecuentes no están disponibles temporalmente/);
  assert.match(html, /href="\/noticias\/fixture"/);
  assert.match(html, /id="planes"/);
  assert.match(html, /id="cobertura"/);
  const detail = await fetch(`${base}/noticias/fixture`).then(res => res.text());
  assert.match(detail, /Noticia pública simulada/);
  assert.match(detail, /property="og:type" content="article"/);
  assert.match(detail, /rel="canonical"[^>]+\/noticias\/fixture/);
});

test("restored backend recovers without a cached outage; truly absent content stays not-found", async () => {
  mode = "healthy";
  const html = await fetch(`${base}/noticias`).then(res => res.text());
  assert.match(html, /Noticia pública simulada/);
  assert.doesNotMatch(html, /Las noticias no están disponibles temporalmente/);
  const missing = await fetch(`${base}/noticias/missing`);
  const body = await missing.text();
  assert.ok(missing.status === 404 || /noindex/.test(body));
  assert.doesNotMatch(body, /Contenido no disponible temporalmente/);
});

test("Hogar streams its shell and Conectar Play avoids serial query deadlines", { timeout: 10000 }, async () => {
  mode = "slow";
  const started = Date.now();
  const play = fetch(`${base}/conectar-play`, { signal: AbortSignal.timeout(8000) }).then(response => response.text());
  const response = await fetch(base, { signal: AbortSignal.timeout(8000) });
  const reader = response.body.getReader();
  await reader.read();
  const firstChunkMs = Date.now() - started;
  assert.ok(firstChunkMs < 2000, `First chunk waited for Supabase: ${firstChunkMs} ms`);
  while (!(await reader.read()).done) { /* Consume all streamed sections. */ }
  assert.match(await play, /Los planes de Conectar Play no están disponibles temporalmente/);
  assert.ok(Date.now() - started < 5500, "section budgets should run in parallel");
});

test("public routes also survive a completely closed backend TCP port", { timeout: 15000 }, async () => {
  backend.closeAllConnections();
  await new Promise(resolve => backend.close(resolve));
  try {
    await Promise.all(paths.map(async path => {
      const response = await fetch(`${base}${path}`, { signal: AbortSignal.timeout(10000) });
      assert.equal(response.status, 200, path);
      assert.match(await response.text(), /<footer/);
    }));
  } finally {
    backend.listen(backendPort, "127.0.0.1");
    await once(backend, "listening");
  }
});

test("private administration remains closed with missing or invalid/expired sessions", { timeout: 15000 }, async () => {
  calls.length = 0;
  for (const headers of [{}, { Cookie: cookie }]) {
    const response = await fetch(`${base}/admin`, { redirect: "manual", headers, signal: AbortSignal.timeout(10000) });
    assert.equal(response.status, 307);
    assert.equal(new URL(response.headers.get("location"), base).pathname, "/auth/login");
  }
  assert.ok(calls.some(call => call.path.startsWith("/auth/")), "expired fixture must exercise the real failing Auth endpoint");
  assert.doesNotMatch(logs, /uncaughtException|unhandledRejection|Hydration failed/);
});

test("warm editorial content survives an outage while commercial prices disappear; concurrent reads share one refresh", { timeout: 30000 }, async () => {
  mode = "healthy";
  const warmHome = await fetch(base).then(response => response.text());
  assert.match(warmHome, /Plan simulado de prueba/);
  assert.match(warmHome, /Noticia pública simulada/);
  await fetch(`${base}/noticias`).then(response => response.text());
  await new Promise(resolve => setTimeout(resolve, 16000));
  mode = "unreachable"; calls.length = 0;
  const copies = await Promise.all(Array.from({ length: 10 }, () => fetch(`${base}/noticias`).then(response => response.text())));
  assert.ok(copies.every(html => html.includes("Noticia pública simulada")));
  assert.equal(calls.filter(call => call.path.endsWith("/news")).length, 1);
  const offlineHome = await fetch(base).then(response => response.text());
  assert.match(offlineHome, /Noticia pública simulada/);
  assert.match(offlineHome, /Los planes no están disponibles temporalmente/);
  assert.doesNotMatch(offlineHome, /Plan simulado de prueba|54\.321/);
});

test("a real Node server restart clears the cache and cold failures remain renderable", { timeout: 20000 }, async () => {
  const stopped = once(next, "exit"); next.kill(); await stopped;
  next = await startNext(["start", "--hostname", "127.0.0.1", "--port", String(appPort)]);
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    try { if ((await fetch(`${base}/robots.txt`)).ok) { ready = true; break; } } catch { /* Server is starting. */ }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.ok(ready);
  const response = await fetch(`${base}/noticias`);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Las noticias no están disponibles temporalmente/);
  assert.doesNotMatch(html, /Noticia pública simulada/);
});
