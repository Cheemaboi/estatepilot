import type { FeaturedProperty } from "@/lib/mock-properties";

type MapPoint = {
  latitude: number;
  longitude: number;
  zoom: number;
};

const mapPointsBySlug: Record<string, MapPoint> = {
  "crescent-garden-villa": { latitude: 30.2672, longitude: -97.7431, zoom: 11.8 },
  "glass-ridge-estate": { latitude: 34.0259, longitude: -118.7798, zoom: 11.5 },
  "hudson-penthouse": { latitude: 40.7831, longitude: -73.9712, zoom: 12.2 },
};

const mapPointsByMarket: Record<string, MapPoint> = {
  austin: { latitude: 30.2672, longitude: -97.7431, zoom: 11.8 },
  malibu: { latitude: 34.0259, longitude: -118.7798, zoom: 11.5 },
  "new york": { latitude: 40.7831, longitude: -73.9712, zoom: 12.2 },
};

export function hasMapboxToken() {
  return Boolean(process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN);
}

export function getMapPoint(property: FeaturedProperty) {
  const market = property.location.split(",")[0]?.toLowerCase() ?? "";

  return mapPointsBySlug[property.slug] ?? mapPointsByMarket[market] ?? null;
}

export function getMapboxStaticImageUrl(properties: FeaturedProperty[]) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const points = properties
    .map((property, index) => ({
      label: String(index + 1),
      point: getMapPoint(property),
    }))
    .filter((item): item is { label: string; point: MapPoint } => Boolean(item.point));

  if (!token || points.length === 0) {
    return null;
  }

  const overlay = points
    .slice(0, 4)
    .map(
      ({ label, point }) =>
        `pin-s-${label}+d8bd86(${point.longitude.toFixed(5)},${point.latitude.toFixed(5)})`,
    )
    .join(",");
  const camera =
    points.length === 1
      ? `${points[0].point.longitude.toFixed(5)},${points[0].point.latitude.toFixed(5)},${points[0].point.zoom},0,45`
      : "auto";

  return `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/${overlay}/${camera}/800x520@2x?access_token=${token}`;
}
