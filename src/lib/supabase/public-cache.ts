export const PUBLIC_CACHE_POLICY = {
  editorial: { freshMs: 15_000, maxAgeMs: 120_000 },
  information: { freshMs: 30_000, maxAgeMs: 300_000 },
  live: { freshMs: 0, maxAgeMs: 0 },
} as const;

export type PublicCacheDomain = "news" | "events" | "faqs" | "play" | "contact" | "social" | "settings" | "plans" | "promotions" | "mesh";
export type PublicCacheOptions<T> = {
  domain: PublicCacheDomain;
  key: string;
  policy: { freshMs: number; maxAgeMs: number };
  valid: (value: T) => boolean;
  // Reapply temporal visibility rules on every response, including cache hits.
  visible?: (value: T, now: number) => T;
};
type Entry = { json: string; confirmedAt: number; retryAfter: number; bytes: number; domain: PublicCacheDomain };
type Outcome = { value: unknown; validUntil: number };
type Flight = { generation: number; promise: Promise<Outcome> };

/** Process-local JSON snapshots only. No disk, credentials, sessions or Next Data Cache. */
export function createPublicCache({ now = Date.now, maxEntries = 128, maxBytes = 8 * 1024 * 1024, maxEntryBytes = 256 * 1024,
  report = (domain: PublicCacheDomain, ageMs: number) => console.warn(JSON.stringify({ event: "public_cache_fallback", domain, ageMs })),
} = {}) {
  const entries = new Map<string, Entry>();
  const pending = new Map<string, Flight>();
  const generations = new Map<PublicCacheDomain, number>();
  let bytes = 0;
  const generation = (domain: PublicCacheDomain) => generations.get(domain) ?? 0;
  function remove(key: string) {
    const entry = entries.get(key);
    if (entry) bytes -= entry.bytes;
    entries.delete(key);
  }
  function invalidate(domain: PublicCacheDomain) {
    generations.set(domain, generation(domain) + 1);
    for (const [key, entry] of entries) if (entry.domain === domain) remove(key);
    // Waiters on an old flight receive their unavailable fallback, never old data.
    // A subsequent read may immediately start a new generation.
  }
  async function read<T>(options: PublicCacheOptions<T>, fallback: T, load: () => Promise<T>): Promise<T> {
    const { domain, valid, visible = value => value } = options;
    // A caller cannot accidentally retain prices, offers or mixed settings by
    // passing a more permissive policy. These domains only share active reads.
    const mayStore = ["news", "events", "faqs", "contact", "social"].includes(domain)
      && !(domain === "news" && options.key === "alert") || domain === "play" && options.key === "faqs";
    const policy = mayStore ? options.policy : PUBLIC_CACHE_POLICY.live;
    const key = JSON.stringify([domain, options.key]);
    const version = generation(domain);
    const copy = (value: T) => generation(domain) === version ? visible(structuredClone(value), now()) : fallback;
    const finish = (outcome: Outcome) => now() < outcome.validUntil ? copy(outcome.value as T) : fallback;
    const snapshot = () => {
      const entry = entries.get(key);
      if (!entry) return null;
      const age = now() - entry.confirmedAt;
      if (age < 0 || age >= policy.maxAgeMs) { remove(key); return null; }
      const value = JSON.parse(entry.json) as T;
      return valid(value) ? { entry, age, value } : null;
    };
    const cached = snapshot();
    if (cached && (cached.age < policy.freshMs || now() < cached.entry.retryAfter)) return copy(cached.value);
    const existing = pending.get(key);
    if (existing?.generation === version) return finish(await existing.promise);

    const unavailable = { value: fallback, validUntil: Infinity };
    const flight: Flight = { generation: version, promise: Promise.resolve(unavailable) };
    flight.promise = (async () => {
      const result = await load();
      if (generation(domain) !== version) return unavailable;
      if (valid(result)) {
        // Store only confirmed, validated results. Successful empty results replace
        // earlier content, so a confirmed unpublication never resurrects it.
        remove(key);
        if (policy.maxAgeMs > 0 && key.length <= 1024) {
          const json = JSON.stringify(result);
          const size = json.length * 2;
          if (size <= maxEntryBytes && size <= maxBytes) {
            while (entries.size && (entries.size >= maxEntries || bytes + size > maxBytes)) remove(entries.keys().next().value!);
            if (maxEntries > 0) {
              entries.set(key, { json, bytes: size, confirmedAt: now(), retryAfter: 0, domain });
              bytes += size;
            }
          }
        }
        return { value: result, validUntil: Infinity };
      }
      // A known denial (401/403/RLS), malformed response or unknown error must
      // not serve an old copy. Only explicitly transient failures allow fallback.
      if (!result || typeof result !== "object" || !("allowStale" in result) || result.allowStale !== true) {
        invalidate(domain);
        return unavailable;
      }
      const previous = snapshot();
      if (!previous) return unavailable;
      previous.entry.retryAfter = now() + 5000;
      report(domain, previous.age);
      return { value: previous.value, validUntil: previous.entry.confirmedAt + policy.maxAgeMs };
    })();
    // Bound bookkeeping even when requests contain many different slugs.
    if (pending.size < maxEntries || pending.has(key)) pending.set(key, flight);
    try { return finish(await flight.promise); }
    finally { if (pending.get(key) === flight) pending.delete(key); }
  }
  return { read, invalidate };
}

// Next bundles Server Actions and RSC separately. Share one registry within the
// Node process so a confirmed action invalidates reads from either bundle.
const registry = globalThis as typeof globalThis & { __conectarPublicCacheV1?: ReturnType<typeof createPublicCache> };
export const publicCache = registry.__conectarPublicCacheV1 ??= createPublicCache();

export function invalidatePublicContent(domain: PublicCacheDomain) {
  publicCache.invalidate(domain);
}

/** Fence old reads as soon as this write confirms, even if another batch member fails. */
export async function invalidateAfterConfirmedMutation<T extends { error: unknown }>(domain: PublicCacheDomain, mutation: PromiseLike<T>): Promise<T> {
  const result = await mutation;
  if (result.error === null) invalidatePublicContent(domain);
  return result;
}
