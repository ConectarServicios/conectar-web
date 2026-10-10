import assert from "node:assert/strict";
import test from "node:test";

const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL ?? "http://127.0.0.1:3000";

async function request(path, redirect = "follow") {
  return fetch(new URL(path, baseUrl), { redirect });
}

function robotsDirectives(html) {
  const metas = [...html.matchAll(/<meta name="(?:robots|googlebot)" content="([^"]+)"/g)];
  assert.ok(metas.length, "Missing robots metadata");
  return metas.flatMap((match) => match[1].split(/,\s*/));
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
    const response = await request(path);
    assert.equal(response.status, 200);
    const directives = robotsDirectives(await response.text());
    assert.ok(directives.includes(path === "/" ? "index" : "noindex"));
    assert.ok(directives.includes("follow"));
    assert.ok(!directives.includes(path === "/" ? "noindex" : "index"));
    assert.ok(!directives.includes("nofollow"));
    if (path === "/") assert.equal(response.headers.get("x-robots-tag"), null);
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
    if (path === "/") {
      assert.equal(canonical[1], "https://conectarservicios.com.ar/");
    }
  }
});

test("sitemap contains only the canonical home", async () => {
  const response = await request("/sitemap.xml");
  assert.equal(response.status, 200);
  const urls = [...(await response.text()).matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => match[1]);
  assert.deepEqual(urls, ["https://conectarservicios.com.ar/"]);
});

test("robots.txt allows crawlers to read noindex on every internal page", async () => {
  const response = await request("/robots.txt");
  assert.equal(response.status, 200);
  const text = await response.text();
  assert.match(text, /User-Agent: \*/);
  assert.match(text, /Allow: \/(?:\r?\n|$)/);
  assert.doesNotMatch(text, /^Disallow:\s*\S+/m);
  assert.match(text, /Sitemap: https:\/\/conectarservicios\.com\.ar\/sitemap\.xml/);
});

for (const path of ["/auth/login", "/auth/unauthorized", "/auth/set-password", "/admin", "/admin/news/__seo-test__/edit"]) {
  test(`${path} remains noindex, follow including after an access redirect`, async () => {
    const response = await request(path);
    assert.equal(response.status, 200);
    const directives = robotsDirectives(await response.text());
    assert.ok(directives.includes("noindex"));
    assert.ok(directives.includes("follow"));
    assert.ok(!directives.includes("index"));
    assert.ok(!directives.includes("nofollow"));
  });
}

for (const path of ["/author/admin", "/software", "/Software", "/servicios/software", "/servicios/software-tecnologia/__inexistente__"]) {
  test(`${path} returns HTTP 404 without redirecting`, async () => {
    const response = await request(path, "manual");
    assert.equal(response.status, 404);
    assert.equal(response.headers.get("location"), null);
    assert.match(await response.text(), /Página no encontrada/);
  });
}

test("the existing Software compatibility route keeps its permanent redirect", async () => {
  const response = await request("/servicios/software-tecnologia", "manual");
  assert.equal(response.status, 308);
  const target = new URL(response.headers.get("location"), baseUrl);
  assert.equal(target.pathname, "/servicios");
  assert.equal(target.hash, "#seguridad-gestionada");
});

for (const section of ["noticias", "eventos", "promociones"]) {
  test(`published dynamic ${section} pages inherit noindex, follow`, async (t) => {
    const listing = await request(`/${section}`);
    assert.equal(listing.status, 200);
    const paths = new Set([...((await listing.text()).matchAll(new RegExp(`href="(/${section}/[^"#?]+)"`, "g")))].map((match) => match[1]));
    if (!paths.size) return t.skip(`No published ${section} available`);
    for (const path of paths) {
      const response = await request(path);
      assert.equal(response.status, 200);
      const directives = robotsDirectives(await response.text());
      assert.ok(directives.includes("noindex"), path);
      assert.ok(directives.includes("follow"), path);
      assert.ok(!directives.includes("index"), path);
      assert.ok(!directives.includes("nofollow"), path);
    }
  });
}
