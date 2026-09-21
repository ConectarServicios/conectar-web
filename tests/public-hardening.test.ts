import assert from "node:assert/strict";
import test from "node:test";

import { isExternalPublicUrl, normalizePublicNavigationUrl } from "../src/lib/utils/public-navigation-url.ts";
import { isAllowedContactNumber } from "../src/lib/validations/contact-information.ts";
import { buildCoverageWhatsAppUrl, checkCoverage } from "../src/lib/coverage/service.ts";
import { notConfiguredCoverageProvider } from "../src/lib/coverage/not-configured-provider.ts";
import { validateCoverageAddress } from "../src/lib/coverage/validation.ts";
import { clearGeocodingCacheForTests, geocodeAddress } from "../src/lib/coverage/google-geocoder.ts";
import { createGeoCoverageProvider } from "../src/lib/coverage/geo-provider.ts";
import { geometryContainsPoint, type CoverageFeatureCollection, type CoverageGeometry } from "../src/lib/coverage/geojson.ts";
import { createCoveragePostHandler } from "../src/lib/coverage/route-handler.ts";

test("normalizes legacy public destinations without breaking internal URLs", () => {
  assert.equal(normalizePublicNavigationUrl("#contacto"), "/hogar#contacto");
  assert.equal(normalizePublicNavigationUrl("/corporativo#contacto"), "/corporativo#contacto");
  assert.equal(normalizePublicNavigationUrl("not a url"), "#");
});

test("detects external HTTP URLs case-insensitively and rejects unsafe protocols", () => {
  const external = normalizePublicNavigationUrl("HTTPS://example.com/oferta");
  assert.equal(isExternalPublicUrl(external), true);
  assert.equal(normalizePublicNavigationUrl("javascript:alert(1)"), "#");
  assert.equal(isExternalPublicUrl("/servicios"), false);
});

test("accepts plausible Argentine contact numbers and rejects malformed values", () => {
  assert.equal(isAllowedContactNumber("+54 9 11 1234-5678"), true);
  assert.equal(isAllowedContactNumber(""), false);
  assert.equal(isAllowedContactNumber("123"), false);
  assert.equal(isAllowedContactNumber("1".repeat(16)), false);
});

test("coverage validation trims a normal address and rejects an empty one", () => {
  assert.deepEqual(validateCoverageAddress("   "), {
    valid: false,
    message: "Ingresá tu dirección para continuar.",
  });
  assert.deepEqual(validateCoverageAddress("  Av. Belgrano 123  "), {
    valid: true,
    address: "Av. Belgrano 123",
  });
});

test("temporary coverage provider never claims geographic availability", async () => {
  const result = await checkCoverage("Av. Belgrano 123", notConfiguredCoverageProvider);
  assert.equal(result.status, "not-configured");
  assert.equal(result.address, "Av. Belgrano 123");
});

test("coverage WhatsApp CTA uses a valid dynamic number and includes the address", () => {
  const url = buildCoverageWhatsAppUrl("+54 9 3493 123456", "Av. Belgrano 123");
  assert.ok(url);
  assert.match(url, /^https:\/\/wa\.me\/5493493123456\?text=/);
  assert.match(decodeURIComponent(url), /Av\. Belgrano 123/);
  assert.equal(buildCoverageWhatsAppUrl("123", "Av. Belgrano 123"), null);
});

const overlappingZones: CoverageFeatureCollection = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { name: "PROXIMA_COBERTURA_CENTRO" }, geometry: { type: "Polygon", coordinates: [[[0, 0], [3, 0], [3, 3], [0, 3], [0, 0]]] } },
    { type: "Feature", properties: { name: "NO_COBERTURA_TEST" }, geometry: { type: "Polygon", coordinates: [[[1, 1], [2, 1], [2, 2], [1, 2], [1, 1]]] } },
  ],
};

test("point-in-polygon includes borders, excludes holes, and supports MultiPolygon", () => {
  const polygon: Extract<CoverageGeometry, { type: "Polygon" }> = { type: "Polygon", coordinates: [[[0, 0], [4, 0], [4, 4], [0, 4], [0, 0]], [[1, 1], [2, 1], [2, 2], [1, 2], [1, 1]]] };
  assert.equal(geometryContainsPoint(polygon, [0, 2]), true);
  assert.equal(geometryContainsPoint(polygon, [1.5, 1.5]), false);
  assert.equal(geometryContainsPoint({ type: "MultiPolygon", coordinates: [polygon.coordinates, [[[10, 10], [11, 10], [11, 11], [10, 11], [10, 10]]]] }, [10.5, 10.5]), true);
});

test("geo provider applies unavailable, upcoming, available, and overlap priority", async () => {
  const at = (longitude: number, latitude: number) => createGeoCoverageProvider(
    async () => ({ outcome: "resolved", longitude, latitude, isSunchales: true }), overlappingZones);
  assert.equal((await at(1.5, 1.5).checkCoverage({ address: "A" })).status, "unavailable");
  assert.deepEqual(await at(0.5, 0.5).checkCoverage({ address: "A" }), { address: "A", status: "review", reason: "upcoming" });
  assert.equal((await at(5, 5).checkCoverage({ address: "A" })).status, "available");
  assert.deepEqual(await createGeoCoverageProvider(async () => ({ outcome: "resolved", longitude: 1, latitude: 1, isSunchales: false }), overlappingZones).checkCoverage({ address: "A" }), { address: "A", status: "unavailable", reason: "outside-service-area" });
});

function googleResponse(payload: unknown, ok = true) {
  return async () => new Response(JSON.stringify(payload), { status: ok ? 200 : 500 });
}

const validGoogleResult = {
  status: "OK",
  results: [{
    formatted_address: "Av. Independencia 123, Sunchales, Santa Fe, Argentina",
    types: ["street_address"],
    geometry: { location: { lat: -30.94, lng: -61.56 }, location_type: "ROOFTOP" },
    address_components: [
      { long_name: "Sunchales", types: ["locality"] },
      { long_name: "Santa Fe", short_name: "SF", types: ["administrative_area_level_1"] },
      { long_name: "Argentina", short_name: "AR", types: ["country"] },
    ],
  }],
};

test("Google geocoder validates Sunchales and handles safe failure outcomes", async () => {
  clearGeocodingCacheForTests();
  assert.deepEqual(await geocodeAddress("Uno 123", { apiKey: "key", fetchImpl: googleResponse(validGoogleResult) }), { outcome: "resolved", latitude: -30.94, longitude: -61.56, isSunchales: true });
  clearGeocodingCacheForTests();
  assert.deepEqual(await geocodeAddress("Dos 123", { apiKey: "key", fetchImpl: googleResponse({ status: "ZERO_RESULTS", results: [] }) }), { outcome: "ambiguous" });
  clearGeocodingCacheForTests();
  const wrongCity = structuredClone(validGoogleResult);
  wrongCity.results[0].address_components[0].long_name = "Rafaela";
  assert.deepEqual(await geocodeAddress("Tres 123", { apiKey: "key", fetchImpl: googleResponse(wrongCity) }), { outcome: "resolved", latitude: -30.94, longitude: -61.56, isSunchales: false });
  clearGeocodingCacheForTests();
  assert.deepEqual(await geocodeAddress("Cuatro 123", { apiKey: "key", fetchImpl: googleResponse({}, false) }), { outcome: "error" });
  assert.deepEqual(await geocodeAddress("Cinco 123", { apiKey: "" }), { outcome: "not-configured" });
});

test("coverage route validates input, returns results, and contains provider errors", async () => {
  const valid = createCoveragePostHandler({ async checkCoverage({ address }) { return { address, status: "available" }; } });
  assert.equal((await valid(new Request("http://localhost", { method: "POST", body: "{}" }))).status, 400);
  const response = await valid(new Request("http://localhost", { method: "POST", body: JSON.stringify({ address: "Mitre 123" }) }));
  assert.deepEqual(await response.json(), { address: "Mitre 123", status: "available" });
  const failing = createCoveragePostHandler({ async checkCoverage() { throw new Error("private failure"); } });
  const fallback = await failing(new Request("http://localhost", { method: "POST", body: JSON.stringify({ address: "Mitre 123" }) }));
  assert.deepEqual(await fallback.json(), { address: "Mitre 123", status: "review", reason: "geocoding-error" });
});

test("client coverage component never references the server geocoding key", async () => {
  const source = await import("node:fs/promises").then(({ readFile }) => readFile("src/components/public/coverage-section.tsx", "utf8"));
  assert.doesNotMatch(source, /GOOGLE_GEOCODING_API_KEY|google-geocoder|geo-provider/);
});
