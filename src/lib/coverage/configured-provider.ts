import { readFileSync } from "node:fs";
import { join } from "node:path";

import { createGeoCoverageProvider } from "./geo-provider.ts";
import { geocodeAddress } from "./google-geocoder.ts";
import type { CoverageFeatureCollection } from "./geojson.ts";

const coverageData = JSON.parse(readFileSync(
  join(process.cwd(), "src/data/coverage/cobertura-conectar-sunchales.geojson"),
  "utf8",
)) as CoverageFeatureCollection;

export const geoCoverageProvider = createGeoCoverageProvider(
  geocodeAddress,
  coverageData,
);
