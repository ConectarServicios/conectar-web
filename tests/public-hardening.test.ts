import assert from "node:assert/strict";
import test from "node:test";

import { isExternalPublicUrl, normalizePublicNavigationUrl } from "../src/lib/utils/public-navigation-url.ts";
import { isAllowedContactNumber } from "../src/lib/validations/contact-information.ts";
import { buildCoverageWhatsAppUrl, checkCoverage } from "../src/lib/coverage/service.ts";
import { notConfiguredCoverageProvider } from "../src/lib/coverage/not-configured-provider.ts";
import { validateCoverageAddress } from "../src/lib/coverage/validation.ts";

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
