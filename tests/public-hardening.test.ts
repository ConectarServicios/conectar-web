import assert from "node:assert/strict";
import test from "node:test";

import { isExternalPublicUrl, normalizePublicNavigationUrl } from "../src/lib/utils/public-navigation-url.ts";
import { isAllowedContactNumber } from "../src/lib/validations/contact-information.ts";

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
