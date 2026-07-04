"use client";

import { useMemo, useSyncExternalStore } from "react";
import { PropertyCard } from "@/components/public/property-card";
import type { FeaturedProperty } from "@/lib/mock-properties";

const storageKey = "estatepilot:saved-properties";

function readSaved() {
  try {
    return JSON.parse(window.localStorage.getItem(storageKey) ?? "[]") as string[];
  } catch {
    return [];
  }
}

function subscribe(callback: () => void) {
  window.addEventListener("estatepilot:favorites-updated", callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("estatepilot:favorites-updated", callback);
    window.removeEventListener("storage", callback);
  };
}

function getSavedSnapshot() {
  return readSaved().join("|");
}

type SavedPropertiesPanelProps = {
  initialSavedSlugs?: string[];
  properties: FeaturedProperty[];
};

export function SavedPropertiesPanel({
  initialSavedSlugs = [],
  properties,
}: SavedPropertiesPanelProps) {
  const savedSnapshot = useSyncExternalStore(subscribe, getSavedSnapshot, () => "");
  const localSavedSlugs = useMemo(
    () => savedSnapshot.split("|").filter(Boolean),
    [savedSnapshot],
  );
  const savedSlugs = useMemo(
    () => Array.from(new Set([...initialSavedSlugs, ...localSavedSlugs])),
    [initialSavedSlugs, localSavedSlugs],
  );

  const savedProperties = useMemo(
    () => properties.filter((property) => savedSlugs.includes(property.slug)),
    [properties, savedSlugs],
  );

  if (!savedProperties.length) {
    return (
      <div className="rounded-[28px] border border-white/12 bg-white/[0.06] p-6 text-public-muted">
        Save homes from listings, recommendations, or detail pages and they will
        appear here on this device.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {savedProperties.map((property) => (
        <PropertyCard key={property.slug} initialSaved property={property} />
      ))}
    </div>
  );
}
