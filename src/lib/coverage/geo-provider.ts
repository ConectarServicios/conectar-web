import type { CoverageProvider, CoverageResult } from "../../types/coverage.ts";
import type { GeocodingResult } from "./google-geocoder.ts";
import { hasRecognizedCoverageZones, pointIsInNamedZone, type CoverageFeatureCollection } from "./geojson.ts";

type Geocoder = (address: string) => Promise<GeocodingResult>;

export function createGeoCoverageProvider(
  geocoder: Geocoder,
  zones: CoverageFeatureCollection,
): CoverageProvider {
  return {
    async checkCoverage({ address }): Promise<CoverageResult> {
      // Never claim coverage if the exceptional-zone dataset was not packaged.
      if (!hasRecognizedCoverageZones(zones)) {
        return { address, status: "not-configured", reason: "missing-configuration" };
      }
      const location = await geocoder(address);
      if (location.outcome === "not-configured") {
        return { address, status: "not-configured", reason: "missing-configuration" };
      }
      if (location.outcome === "ambiguous") {
        return { address, status: "review", reason: "ambiguous" };
      }
      if (location.outcome === "error") {
        return { address, status: "review", reason: "geocoding-error" };
      }
      if (!location.isSunchales) {
        return { address, status: "unavailable", reason: "outside-service-area" };
      }

      const point = [location.longitude, location.latitude] as const;
      if (pointIsInNamedZone(zones, point, "NO_COBERTURA")) {
        return { address, status: "unavailable" };
      }
      if (pointIsInNamedZone(zones, point, "PROXIMA_COBERTURA")) {
        return { address, status: "review", reason: "upcoming" };
      }
      return { address, status: "available" };
    },
  };
}
