import assert from "node:assert/strict";
import test from "node:test";

const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL ?? "http://127.0.0.1:3000";

async function request(path, redirect = "follow") {
  return fetch(new URL(path, baseUrl), { redirect });
}

test("root redirects to Hogar", async () => {
  const response = await request("/", "manual");
  assert.ok([307, 308].includes(response.status));
  assert.equal(new URL(response.headers.get("location"), baseUrl).pathname, "/hogar");
});

for (const path of [
  "/hogar",
  "/corporativo",
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

test("public pages expose coherent segment and contact destinations", async () => {
  const [home, corporate, services] = await Promise.all([
    request("/hogar").then((response) => response.text()),
    request("/corporativo").then((response) => response.text()),
    request("/servicios").then((response) => response.text()),
  ]);
  assert.match(home, /href="\/corporativo"/);
  assert.match(home, /href="\/hogar#contacto"/);
  assert.match(corporate, /href="\/hogar"/);
  assert.match(corporate, /href="\/corporativo#contacto"/);
  assert.match(services, /href="\/hogar#contacto"/);
  assert.match(services, /href="\/corporativo#contacto"/);
});

test("unknown route renders the public 404", async () => {
  const response = await request("/__ruta-inexistente__");
  assert.equal(response.status, 404);
  assert.match(await response.text(), /Página no encontrada/);
});
