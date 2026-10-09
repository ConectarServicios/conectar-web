import assert from "node:assert/strict";
import test from "node:test";

const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL ?? "http://127.0.0.1:3000";

async function request(path, redirect = "follow") {
  return fetch(new URL(path, baseUrl), { redirect });
}

test("legacy Hogar permanently redirects to the root", async () => {
  const response = await request("/hogar", "manual");
  assert.equal(response.status, 308);
  assert.equal(new URL(response.headers.get("location"), baseUrl).pathname, "/");
});

test("root renders Hogar without a redirect", async () => {
  const response = await request("/", "manual");
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("location"), null);
  assert.match(await response.text(), /id="cobertura"/);
});

for (const path of [
  "/",
  "/corporativo",
  "/quienes-somos",
  "/servicios",
  "/conectar-play",
  "/noticias",
  "/eventos",
  "/promociones",
  "/preguntas-frecuentes",
]) {
  test(`${path} responds successfully`, async () => {
    assert.equal((await request(path)).status, 200);
  });
}

test("public pages expose coherent segment, institutional, and contact destinations", async () => {
  const [home, corporate, services, institutional] = await Promise.all([
    request("/").then((response) => response.text()),
    request("/corporativo").then((response) => response.text()),
    request("/servicios").then((response) => response.text()),
    request("/quienes-somos").then((response) => response.text()),
  ]);
  assert.match(home, /href="\/corporativo"/);
  assert.match(home, /aria-current="page"[^>]*href="\/"/);
  assert.match(corporate, /aria-current="page"[^>]*href="\/corporativo"/);
  assert.doesNotMatch(home, /href="\/hogar(?:["#])/);
  assert.match(home, /href="\/#contacto"/);
  assert.match(corporate, /href="\/"/);
  assert.match(corporate, /href="\/corporativo#contacto"/);
  assert.match(services, /href="\/#contacto"/);
  assert.match(services, /href="\/corporativo#contacto"/);
  assert.match(home, /href="\/quienes-somos"/);
  assert.match(home, /id="cobertura"/);
  assert.match(home, /¿Conectar llega a tu domicilio\?/);
  assert.match(home, /name="address"/);
  assert.match(home, /¿Necesitás ayuda o querés contratar\?/);
  assert.match(corporate, /¿Necesitás ayuda o querés contratar\?/);
  assert.doesNotMatch(home, /id="quienes-somos"/);
  assert.match(institutional, /Quiénes somos/);
  assert.doesNotMatch(institutional, /aria-current="page"[^>]*href="(?:\/|\/corporativo)"/);
});

test("unknown route renders the public 404", async () => {
  const response = await request("/__ruta-inexistente__");
  assert.equal(response.status, 404);
  assert.match(await response.text(), /Página no encontrada/);
});

test("home and corporate canonicals use their canonical paths", async () => {
  for (const path of ["/", "/corporativo"]) {
    const html = await request(path).then((response) => response.text());
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/);
    assert.ok(canonical, `Missing canonical for ${path}`);
    assert.equal(new URL(canonical[1]).pathname, path);
  }
});

test("sitemap includes the root and excludes legacy Hogar", async () => {
  const response = await request("/sitemap.xml");
  assert.equal(response.status, 200);
  const urls = [...(await response.text()).matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => new URL(match[1]));
  assert.ok(urls.some((url) => url.pathname === "/"));
  assert.ok(urls.some((url) => url.pathname === "/corporativo"));
  assert.ok(urls.every((url) => url.pathname !== "/hogar"));
});
