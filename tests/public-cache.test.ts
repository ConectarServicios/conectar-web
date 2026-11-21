import assert from "node:assert/strict";
import test from "node:test";
import { createPublicCache, PUBLIC_CACHE_POLICY, type PublicCacheDomain } from "../src/lib/supabase/public-cache.ts";
import { validNews, validFaq, validDetail, validList } from "../src/lib/supabase/public-cache-validation.ts";

type Result = { data: string[]; unavailable: boolean; allowStale?: boolean };
const absent: Result = { data: [], unavailable: true, allowStale: true };
const confirmed: Result = { data: ["confirmed"], unavailable: false };
const options = { domain: "news" as const, key: "list", policy: PUBLIC_CACHE_POLICY.editorial, valid: (value: Result) => !value.unavailable };
function setup(limits = {}) {
  let time = 1_000_000;
  const cache = createPublicCache({ now: () => time, report() {}, ...limits });
  return { cache, advance: (ms: number) => { time += ms; } };
}

test("first successful read is copied, reused while fresh and coalesced across concurrent requests", async () => {
  const { cache } = setup();
  let calls = 0;
  const load = async () => { calls++; await Promise.resolve(); return confirmed; };
  const results = await Promise.all(Array.from({ length: 40 }, () => cache.read(options, absent, load)));
  assert.equal(calls, 1);
  results[0].data[0] = "mutated by a consumer";
  assert.equal(results[1].data[0], "confirmed");
  assert.deepEqual(await cache.read(options, absent, load), confirmed);
  assert.equal(calls, 1);
});

test("failed refresh uses a previous success only until its original absolute deadline", async () => {
  const { cache, advance } = setup();
  await cache.read(options, absent, async () => confirmed);
  advance(16_000);
  assert.deepEqual(await cache.read(options, absent, async () => absent), confirmed);
  for (let i = 0; i < 20; i++) {
    advance(5000);
    await cache.read(options, absent, async () => absent);
  }
  advance(5000);
  assert.deepEqual(await cache.read(options, absent, async () => absent), absent);
});

test("cold failure never becomes valid content or a negative cache entry", async () => {
  const { cache } = setup();
  assert.deepEqual(await cache.read(options, absent, async () => absent), absent);
  assert.deepEqual(await cache.read(options, absent, async () => confirmed), confirmed);
});

test("known authorization/RLS denials and malformed results purge rather than reuse old content", async () => {
  const { cache, advance } = setup();
  await cache.read(options, absent, async () => confirmed);
  await cache.read({ ...options, key: "another-list" }, absent, async () => confirmed);
  advance(16_000);
  assert.deepEqual(await cache.read(options, absent, async () => ({ ...absent, allowStale: false })), absent);
  assert.deepEqual(await cache.read(options, absent, async () => absent), absent);
  assert.deepEqual(await cache.read({ ...options, key: "another-list" }, absent, async () => absent), absent);
});

test("a confirmed empty result replaces old content and cannot resurrect it during an outage", async () => {
  const { cache, advance } = setup();
  await cache.read(options, absent, async () => confirmed);
  advance(16_000);
  const empty = { data: [], unavailable: false };
  assert.deepEqual(await cache.read(options, absent, async () => empty), empty);
  advance(16_000);
  assert.deepEqual(await cache.read(options, absent, async () => absent), empty);
});

test("recovery replaces the last confirmed value instead of extending an outage indefinitely", async () => {
  const { cache, advance } = setup();
  await cache.read(options, absent, async () => confirmed);
  advance(16_000);
  await cache.read(options, absent, async () => absent);
  advance(5000);
  const updated = { data: ["updated"], unavailable: false };
  assert.deepEqual(await cache.read(options, absent, async () => updated), updated);
});

test("confirmed invalidation discards snapshots and prevents an older in-flight read from repopulating them", async () => {
  const { cache } = setup();
  let resolve!: (value: Result) => void;
  const old = cache.read(options, absent, () => new Promise(done => { resolve = done; }));
  cache.invalidate("news");
  const updated = { data: ["updated"], unavailable: false };
  assert.deepEqual(await cache.read(options, absent, async () => updated), updated);
  resolve(confirmed);
  assert.deepEqual(await old, absent);
  assert.deepEqual(await cache.read(options, absent, async () => absent), updated);
});

test("invalidation also wins between refresh completion and delivery to coalesced waiters", async () => {
  const { cache } = setup();
  let resolve!: (value: Result) => void;
  const one = cache.read(options, absent, () => new Promise(done => { resolve = done; }));
  const two = cache.read(options, absent, async () => confirmed);
  resolve(confirmed);
  cache.invalidate("news");
  assert.deepEqual(await one, absent);
  assert.deepEqual(await two, absent);
});

test("an invalidation of another domain does not affect an independent read", async () => {
  const { cache } = setup();
  await cache.read(options, absent, async () => confirmed);
  cache.invalidate("faqs");
  assert.deepEqual(await cache.read(options, absent, async () => absent), confirmed);
});

test("known temporal visibility is reapplied on fresh hits and fallback responses", async () => {
  const { cache, advance } = setup();
  let visible = true;
  const temporal = { ...options, visible: (value: Result) => ({ ...value, data: visible ? value.data : [] }) };
  await cache.read(temporal, absent, async () => confirmed);
  visible = false;
  assert.deepEqual((await cache.read(temporal, absent, async () => confirmed)).data, []);
  advance(16_000);
  assert.deepEqual((await cache.read(temporal, absent, async () => absent)).data, []);
});

for (const domain of ["plans", "promotions", "mesh", "settings", "play"] as PublicCacheDomain[]) {
  test(`${domain} cannot retain prices/offers even if a caller supplies a permissive TTL`, async () => {
    const { cache } = setup();
    const live = { ...options, domain, key: "prices" };
    await cache.read(live, absent, async () => confirmed);
    assert.deepEqual(await cache.read(live, absent, async () => absent), absent);
  });
}

test("the live-only policy still coalesces pending requests, but never reuses a finished request", async () => {
  const { cache } = setup();
  let calls = 0;
  const live = { ...options, domain: "plans" as const };
  await Promise.all(Array.from({ length: 25 }, () => cache.read(live, absent, async () => { calls++; return confirmed; })));
  assert.equal(calls, 1);
  await cache.read(live, absent, async () => { calls++; return absent; });
  assert.equal(calls, 2);
});

test("entry limits, oversize payloads and a clock rollback fail safely", async () => {
  const { cache, advance } = setup({ maxEntries: 1, maxEntryBytes: 200 });
  await cache.read(options, absent, async () => confirmed);
  await cache.read({ ...options, key: "another" }, absent, async () => confirmed);
  assert.deepEqual(await cache.read(options, absent, async () => absent), absent);
  const oversized = { data: ["x".repeat(500)], unavailable: false };
  await cache.read(options, absent, async () => oversized);
  assert.deepEqual(await cache.read(options, absent, async () => absent), absent);
  await cache.read(options, absent, async () => confirmed);
  advance(-1);
  assert.deepEqual(await cache.read(options, absent, async () => absent), absent);
});

test("process-local state is deliberately lost on restart; a new instance remains available without a copy", async () => {
  const first = setup().cache;
  await first.read(options, absent, async () => confirmed);
  const restarted = setup().cache;
  assert.deepEqual(await restarted.read(options, absent, async () => absent), absent);
});

test("malformed, inactive, draft and failed responses cannot be stored as confirmed public rows", () => {
  const faq = { id: "faq", question: "Question", answer: "Answer", active: true, display_order: 0 };
  assert.equal(validList({ data: [faq], unavailable: false }, validFaq), true);
  assert.equal(validList({ data: [{ ...faq, active: false }], unavailable: false }, validFaq), false);
  assert.equal(validList({ data: [faq], unavailable: true }, validFaq), false);
  assert.equal(validDetail({ data: { status: "draft" }, unavailable: false }, validNews), false);
  assert.equal(validDetail({ data: null, unavailable: false }, validNews), true);
});
