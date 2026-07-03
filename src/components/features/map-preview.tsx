"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { FeaturedProperty } from "@/lib/mock-properties";
import { getMapboxStaticImageUrl, hasMapboxToken } from "@/lib/mapbox";

type MapPreviewProps = {
  properties: FeaturedProperty[];
  title?: string;
  description?: string;
};

const pointPositions = [
  "left-[18%] top-[30%]",
  "left-[58%] top-[44%]",
  "left-[72%] top-[24%]",
  "left-[35%] top-[68%]",
];

function getMarketLabel(property: FeaturedProperty) {
  return property.location.split(",")[0] ?? property.location;
}

export function MapPreview({
  properties,
  title = "Market map preview",
  description = "Mapbox-ready location surface with a polished demo fallback.",
}: MapPreviewProps) {
  const [activeSlug, setActiveSlug] = useState(properties[0]?.slug ?? "");
  const activeProperty = useMemo(
    () =>
      properties.find((property) => property.slug === activeSlug) ??
      properties[0],
    [activeSlug, properties],
  );
  const mapboxImageUrl = useMemo(
    () => getMapboxStaticImageUrl(properties),
    [properties],
  );

  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-[28px] border border-white/12 bg-[radial-gradient(circle_at_28%_22%,rgba(216,189,134,0.18),transparent_26%),linear-gradient(145deg,rgba(22,36,29,0.96),rgba(7,18,13,0.96))] p-5">
      {mapboxImageUrl ? (
        <>
          <Image
            alt="Mapbox map showing EstatePilot listing locations"
            className="object-cover opacity-80 saturate-[0.85]"
            fill
            sizes="(min-width: 1024px) 400px, 100vw"
            src={mapboxImageUrl}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,18,13,0.28),rgba(7,18,13,0.66))]" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.11)_1px,transparent_1px)] [background-size:42px_42px]" />
          <div className="absolute inset-x-5 top-[42%] h-px bg-luxury-accent/15" />
          <div className="absolute bottom-[26%] left-0 right-0 h-px rotate-[-10deg] bg-white/10" />
        </>
      )}
      <div className="relative z-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-luxury-accent">
          {title}
        </p>
        <p className="mt-3 max-w-sm text-sm leading-6 text-white/70">
          {description}
        </p>
        <p className="mt-3 w-fit rounded-full border border-white/12 bg-public-bg/58 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/68 backdrop-blur-md">
          {hasMapboxToken() && mapboxImageUrl ? "Mapbox live" : "Demo map fallback"}
        </p>
      </div>

      {properties.length ? (
        <>
          {properties.slice(0, 4).map((property, index) => {
            const isActive = activeProperty?.slug === property.slug;

            return (
              <button
                className={`absolute ${pointPositions[index]} z-10 rounded-full border px-3 py-2 text-xs font-semibold shadow-[0_16px_34px_rgba(0,0,0,0.32)] backdrop-blur-xl transition hover:-translate-y-0.5 ${
                  isActive
                    ? "border-luxury-accent bg-luxury-accent text-public-bg"
                    : "border-white/20 bg-public-bg/68 text-white hover:border-luxury-accent/70"
                }`}
                key={property.slug}
                onClick={() => setActiveSlug(property.slug)}
                type="button"
              >
                {getMarketLabel(property)}
              </button>
            );
          })}

          {activeProperty ? (
            <div className="absolute inset-x-4 bottom-4 z-20 rounded-[24px] border border-white/14 bg-public-bg/72 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.34)] backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-luxury-accent">
                    Active pin
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-white">
                    {activeProperty.title}
                  </h3>
                  <p className="mt-1 text-sm text-white/66">
                    {activeProperty.location}
                  </p>
                </div>
                <p className="shrink-0 text-base font-semibold text-luxury-accent">
                  {activeProperty.price}
                </p>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-white/68">
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-2 py-2">
                  <span className="block font-semibold text-white">
                    {activeProperty.beds}
                  </span>
                  Beds
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-2 py-2">
                  <span className="block font-semibold text-white">
                    {activeProperty.baths}
                  </span>
                  Baths
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-2 py-2">
                  <span className="block font-semibold text-white">
                    {activeProperty.tag}
                  </span>
                  Signal
                </div>
              </div>
              <Link
                className="mt-4 inline-flex min-h-10 items-center rounded-full border border-luxury-accent/50 px-4 text-sm font-semibold text-luxury-accent transition hover:bg-luxury-accent hover:text-public-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-luxury-accent"
                href={`/properties/${activeProperty.slug}`}
              >
                View property
              </Link>
            </div>
          ) : null}
        </>
      ) : (
        <div className="relative z-10 mt-20 rounded-[24px] border border-white/12 bg-public-bg/70 p-5 text-center backdrop-blur-xl">
          <p className="text-lg font-semibold text-white">No mapped matches</p>
          <p className="mt-2 text-sm leading-6 text-white/64">
            Adjust filters to bring matching homes back onto the preview.
          </p>
        </div>
      )}
    </div>
  );
}
