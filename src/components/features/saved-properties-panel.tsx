"use client";

import { useEffect, useMemo, useState } from "react";
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

type SavedPropertiesPanelProps = {
  properties: FeaturedProperty[];
};

export function SavedPropertiesPanel({ properties }: SavedPropertiesPanelProps) {
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);

  useEffect(() => {
    function syncSaved() {
      setSavedSlugs(readSaved());
    }

    syncSaved();
    window.addEventListener("estatepilot:favorites-updated", syncSaved);
    window.addEventListener("storage", syncSaved);

    return () => {
      window.removeEventListener("estatepilot:favorites-updated", syncSaved);
      window.removeEventListener("storage", syncSaved);
    };
  }, []);

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
        <PropertyCard key={property.slug} property={property} />
      ))}
    </div>
  );
}
