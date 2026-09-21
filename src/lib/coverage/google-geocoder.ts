export type GeocodingResult =
  | { outcome: "resolved"; latitude: number; longitude: number; isSunchales: boolean }
  | { outcome: "ambiguous" }
  | { outcome: "not-configured" }
  | { outcome: "error" };

type GoogleComponent = { long_name?: unknown; short_name?: unknown; types?: unknown };
type GoogleResult = {
  address_components?: unknown;
  formatted_address?: unknown;
  geometry?: { location?: { lat?: unknown; lng?: unknown }; location_type?: unknown };
  partial_match?: unknown;
  types?: unknown;
};

type GoogleResponse = { status?: unknown; results?: unknown };
type CacheEntry = { expiresAt: number; value: GeocodingResult };

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 6_000;

function normalizedAddress(address: string) {
  return address.trim().toLocaleLowerCase("es-AR").replace(/\s+/g, " ");
}

function componentMatches(components: GoogleComponent[], type: string, values: string[]) {
  return components.some((component) => {
    if (!Array.isArray(component.types) || !component.types.includes(type)) return false;
    const names = [component.long_name, component.short_name]
      .filter((value): value is string => typeof value === "string")
      .map((value) => value.toLocaleLowerCase("es-AR"));
    return values.some((value) => names.includes(value));
  });
}

function parseResult(value: unknown): GeocodingResult {
  if (!value || typeof value !== "object") return { outcome: "ambiguous" };
  const result = value as GoogleResult;
  const components = Array.isArray(result.address_components)
    ? result.address_components.filter((item): item is GoogleComponent => Boolean(item && typeof item === "object"))
    : [];
  const latitude = result.geometry?.location?.lat;
  const longitude = result.geometry?.location?.lng;
  const resultTypes = Array.isArray(result.types) ? result.types : [];
  const sufficientlyPrecise = result.partial_match !== true &&
    ["ROOFTOP", "RANGE_INTERPOLATED", "GEOMETRIC_CENTER"].includes(String(result.geometry?.location_type)) &&
    resultTypes.some((type) => ["street_address", "premise", "subpremise"].includes(String(type)));

  if (typeof result.formatted_address !== "string" || typeof latitude !== "number" ||
      typeof longitude !== "number" || !sufficientlyPrecise || components.length === 0) {
    return { outcome: "ambiguous" };
  }

  const isSunchales = componentMatches(components, "locality", ["sunchales"]) &&
    componentMatches(components, "administrative_area_level_1", ["santa fe", "sf"]) &&
    componentMatches(components, "country", ["argentina", "ar"]);

  return { outcome: "resolved", latitude, longitude, isSunchales };
}

export async function geocodeAddress(
  address: string,
  options: { apiKey?: string; fetchImpl?: typeof fetch } = {},
): Promise<GeocodingResult> {
  const apiKey = options.apiKey ?? process.env.GOOGLE_GEOCODING_API_KEY;
  if (!apiKey) return { outcome: "not-configured" };

  const cacheKey = normalizedAddress(address);
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("address", `${address}, Sunchales, Santa Fe, Argentina`);
  url.searchParams.set("region", "ar");
  url.searchParams.set("language", "es");
  url.searchParams.set("key", apiKey);

  let value: GeocodingResult;
  try {
    const response = await (options.fetchImpl ?? fetch)(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) return { outcome: "error" };
    const payload = await response.json() as GoogleResponse;
    if (payload.status === "ZERO_RESULTS") value = { outcome: "ambiguous" };
    else if (payload.status !== "OK" || !Array.isArray(payload.results)) value = { outcome: "error" };
    else value = parseResult(payload.results[0]);
  } catch {
    return { outcome: "error" };
  }

  cache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, value });
  return value;
}

export function clearGeocodingCacheForTests() {
  cache.clear();
}
