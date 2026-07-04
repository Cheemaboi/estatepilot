"use client";

import Image from "next/image";
import Link from "next/link";
import mapboxgl from "mapbox-gl";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FeaturedProperty } from "@/lib/mock-properties";
import { getMapPoint, getMapboxStaticImageUrl, hasMapboxToken } from "@/lib/mapbox";

type MapPreviewProps = {
  properties: FeaturedProperty[];
  title?: string;
  description?: string;
  activeSlug?: string;
  onActiveSlugChange?: (slug: string) => void;
};

function getMarketLabel(property: FeaturedProperty) {
  return property.location.split(",")[0] ?? property.location;
}

export function MapPreview({
  properties,
  title = "Market map preview",
  description = "Mapbox-backed location surface with interactive listings and pins.",
  activeSlug,
  onActiveSlugChange,
}: MapPreviewProps) {
  const [internalSlug, setInternalSlug] = useState(properties[0]?.slug ?? "");
  const [mapReady, setMapReady] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN?.trim();

  const selectedSlug = activeSlug ?? internalSlug;
  const setSelectedSlug = onActiveSlugChange ?? setInternalSlug;

  const resolvedSlug = useMemo(() => {
    if (properties.some((property) => property.slug === selectedSlug)) {
      return selectedSlug;
    }

    return properties[0]?.slug ?? "";
  }, [properties, selectedSlug]);

  const activeProperty = useMemo(
    () => properties.find((property) => property.slug === resolvedSlug) ?? properties[0],
    [properties, resolvedSlug],
  );

  const activePoint = useMemo(
    () => (activeProperty ? getMapPoint(activeProperty) : null),
    [activeProperty],
  );

  const mapEntries = useMemo(
    () =>
      properties
        .map((property, index) => ({
          point: getMapPoint(property),
          property,
          label: String(index + 1),
        }))
        .filter(
          (
            entry,
          ): entry is {
            label: string;
            point: NonNullable<ReturnType<typeof getMapPoint>>;
            property: FeaturedProperty;
          } => Boolean(entry.point),
        ),
    [properties],
  );

  const backdropUrl = useMemo(
    () => getMapboxStaticImageUrl(mapEntries.map((entry) => entry.property)),
    [mapEntries],
  );

  useEffect(() => {
    if (!token || !mapContainerRef.current || !activePoint || mapRef.current) {
      return;
    }

    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      center: [activePoint.longitude, activePoint.latitude],
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      zoom: activePoint.zoom,
    });

    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");
    map.addControl(new mapboxgl.FullscreenControl(), "top-right");
    map.on("load", () => {
      map.resize();
      setMapReady(true);
    });
    requestAnimationFrame(() => map.resize());
    mapRef.current = map;

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, [activePoint, token]);

  useEffect(() => {
    if (!mapReady || !mapRef.current || !activePoint) {
      return;
    }

    mapRef.current.flyTo({
      center: [activePoint.longitude, activePoint.latitude],
      essential: true,
      speed: 1.2,
      zoom: activePoint.zoom,
    });
  }, [activePoint, mapReady]);

  useEffect(() => {
    if (!mapReady || !mapRef.current) {
      return;
    }

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    mapEntries.forEach(({ label, point, property }) => {
      const isActive = property.slug === resolvedSlug;
      const element = document.createElement("button");
      element.type = "button";
      element.setAttribute("aria-label", `Show ${property.title}`);
      element.className = [
        "grid h-11 w-11 place-items-center rounded-full border text-xs font-semibold shadow-[0_18px_36px_rgba(0,0,0,0.3)] backdrop-blur-md transition",
        isActive
          ? "border-luxury-accent bg-luxury-accent text-public-bg"
          : "border-white/25 bg-public-bg/82 text-white hover:border-luxury-accent/80",
      ].join(" ");
      element.textContent = label;
      element.addEventListener("click", () => {
        setSelectedSlug(property.slug);
      });

      const marker = new mapboxgl.Marker({ anchor: "center", element })
        .setLngLat([point.longitude, point.latitude])
        .addTo(mapRef.current as mapboxgl.Map);

      markersRef.current.push(marker);
    });
  }, [mapEntries, mapReady, resolvedSlug, setSelectedSlug]);

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-luxury-accent">
            {title}
          </p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-white/70">
            {description}
          </p>
        </div>
        <p className="rounded-full border border-white/12 bg-public-bg/58 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/68 backdrop-blur-md">
          {hasMapboxToken() ? "Mapbox live" : "Map preview"}
        </p>
      </div>

      <div className="relative h-[460px] overflow-hidden rounded-[28px] border border-white/12 bg-[radial-gradient(circle_at_28%_22%,rgba(216,189,134,0.18),transparent_26%),linear-gradient(145deg,rgba(22,36,29,0.96),rgba(7,18,13,0.96))]">
        {token ? (
          <>
            {backdropUrl ? (
              <Image
                alt="Mapbox map preview backdrop"
                aria-hidden="true"
                className="pointer-events-none object-cover opacity-55 saturate-75"
                fill
                sizes="(min-width: 1024px) 520px, 100vw"
                src={backdropUrl}
              />
            ) : null}
            <div
              ref={mapContainerRef}
              className="absolute inset-0 z-10"
              style={{ height: "100%", width: "100%" }}
            />
            {!mapReady ? (
              <div className="absolute inset-0 z-20 grid place-items-center bg-public-bg/60 text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
                Loading map
              </div>
            ) : null}
            <div className="absolute left-4 top-4 z-30 max-w-[62%] rounded-[20px] border border-white/12 bg-public-bg/78 px-3 py-2 backdrop-blur-md">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-luxury-accent">
                Selected listing
              </p>
              <p className="mt-1 truncate text-sm font-semibold text-white">
                {activeProperty.title}
              </p>
              <p className="text-[11px] uppercase tracking-[0.14em] text-white/60">
                {activeProperty.location} | {activeProperty.price}
              </p>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 grid place-items-center p-8">
            <div className="max-w-sm rounded-[24px] border border-white/12 bg-public-bg/72 p-5 text-center backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-luxury-accent">
                Map preview
              </p>
              <p className="mt-3 text-sm leading-6 text-white/70">
                Add a public Mapbox token to enable pan, zoom, and pin interaction.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
        {mapEntries.map(({ property }) => {
          const isActive = property.slug === resolvedSlug;

          return (
            <button
              className={`shrink-0 rounded-[20px] border px-4 py-3 text-left transition ${
                isActive
                  ? "border-luxury-accent bg-luxury-accent text-public-bg"
                  : "border-white/12 bg-white/[0.06] text-white/72 hover:border-luxury-accent/60 hover:text-white"
              }`}
              key={property.slug}
              onClick={() => setSelectedSlug(property.slug)}
              type="button"
            >
              <span className="block text-sm font-semibold">{property.title}</span>
              <span
                className={`mt-1 block text-[11px] uppercase tracking-[0.14em] ${
                  isActive ? "text-public-bg/82" : "text-white/54"
                }`}
              >
                {getMarketLabel(property)} | {property.price}
              </span>
            </button>
          );
        })}
      </div>

      {activeProperty ? (
        <div className="rounded-[24px] border border-white/14 bg-public-bg/84 p-5 shadow-[0_18px_48px_rgba(0,0,0,0.34)] backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs uppercase tracking-[0.2em] text-luxury-accent">
              Active pin
            </p>
            <span className="rounded-full border border-white/12 bg-white/[0.06] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/68">
              {activeProperty.location}
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-semibold leading-tight text-white">
              {activeProperty.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-white/66">
              {getMarketLabel(activeProperty)} view with neighborhood, commute,
              and private-tour context.
            </p>
            <p className="mt-3 text-2xl font-semibold text-luxury-accent">
              {activeProperty.price}
            </p>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <span className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-2 text-center text-xs font-semibold text-white">
              {activeProperty.beds} beds
            </span>
            <span className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-2 text-center text-xs font-semibold text-white">
              {activeProperty.baths} baths
            </span>
            <span className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-2 text-center text-xs font-semibold text-white">
              {activeProperty.area}
            </span>
          </div>
          <Link
            className="mt-4 inline-flex min-h-10 w-fit items-center rounded-full border border-luxury-accent/50 px-4 text-sm font-semibold text-luxury-accent transition hover:bg-luxury-accent hover:text-public-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-luxury-accent"
            href={`/properties/${activeProperty.slug}`}
          >
            View property
          </Link>
        </div>
      ) : null}
    </div>
  );
}
