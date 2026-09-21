export type Position = readonly [longitude: number, latitude: number];
export type PolygonCoordinates = readonly (readonly Position[])[];

export type CoverageGeometry =
  | { type: "Polygon"; coordinates: PolygonCoordinates }
  | { type: "MultiPolygon"; coordinates: readonly PolygonCoordinates[] };

export type CoverageFeature = {
  type: "Feature";
  properties: Record<string, unknown> | null;
  geometry: CoverageGeometry | null;
};

export type CoverageFeatureCollection = {
  type: "FeatureCollection";
  features: readonly CoverageFeature[];
};

function pointOnSegment(point: Position, start: Position, end: Position) {
  const cross = (point[1] - start[1]) * (end[0] - start[0]) -
    (point[0] - start[0]) * (end[1] - start[1]);
  if (Math.abs(cross) > 1e-10) return false;

  return point[0] >= Math.min(start[0], end[0]) - 1e-10 &&
    point[0] <= Math.max(start[0], end[0]) + 1e-10 &&
    point[1] >= Math.min(start[1], end[1]) - 1e-10 &&
    point[1] <= Math.max(start[1], end[1]) + 1e-10;
}

function pointInRing(point: Position, ring: readonly Position[]) {
  let inside = false;

  for (let current = 0, previous = ring.length - 1; current < ring.length; previous = current++) {
    const a = ring[current];
    const b = ring[previous];
    if (pointOnSegment(point, a, b)) return true;

    if (
      (a[1] > point[1]) !== (b[1] > point[1]) &&
      point[0] < ((b[0] - a[0]) * (point[1] - a[1])) / (b[1] - a[1]) + a[0]
    ) inside = !inside;
  }

  return inside;
}

function pointInPolygon(point: Position, polygon: PolygonCoordinates) {
  if (!polygon[0] || !pointInRing(point, polygon[0])) return false;
  return polygon.slice(1).every((hole) => !pointInRing(point, hole));
}

export function geometryContainsPoint(geometry: CoverageGeometry, point: Position) {
  if (geometry.type === "Polygon") return pointInPolygon(point, geometry.coordinates);
  return geometry.coordinates.some((polygon) => pointInPolygon(point, polygon));
}

export function getCoverageZoneName(feature: CoverageFeature) {
  const name = feature.properties?.name ?? feature.properties?.Name ?? feature.properties?.NOMBRE;
  return typeof name === "string" ? name.trim().toUpperCase() : "";
}

export function pointIsInNamedZone(
  collection: CoverageFeatureCollection,
  point: Position,
  prefix: "NO_COBERTURA" | "PROXIMA_COBERTURA",
) {
  return collection.features.some((feature) =>
    feature.geometry !== null &&
    getCoverageZoneName(feature).startsWith(prefix) &&
    geometryContainsPoint(feature.geometry, point));
}

export function hasRecognizedCoverageZones(collection: CoverageFeatureCollection) {
  return collection.features.some((feature) => {
    const name = getCoverageZoneName(feature);
    return feature.geometry !== null &&
      (name.startsWith("NO_COBERTURA") || name.startsWith("PROXIMA_COBERTURA"));
  });
}
