"use client";

import { useMemo, useState } from "react";
import { MapPreview } from "@/components/features/map-preview";
import { PropertyCard } from "@/components/public/property-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputField } from "@/components/ui/field";
import { SelectMenu } from "@/components/ui/select-menu";
import type { FeaturedProperty } from "@/lib/mock-properties";

export type ListingFilters = {
  q: string;
  type: string;
  budget: string;
  beds: string;
  lifestyle: string;
  sort: string;
};

type ListingsExplorerProps = {
  initialFilters: ListingFilters;
  properties: FeaturedProperty[];
  savedSlugs?: string[];
};

const typeOptions = [
  { label: "All", value: "all" },
  { label: "Estate", value: "estate" },
  { label: "Villa", value: "villa" },
  { label: "Penthouse", value: "penthouse" },
];

const budgetOptions = [
  { label: "Any", value: "all" },
  { label: "Under $4M", value: "under-4" },
  { label: "$4M-$7M", value: "4-7" },
  { label: "$7M+", value: "7-plus" },
];

const bedOptions = [
  { label: "Any", value: "all" },
  { label: "3+", value: "3" },
  { label: "5+", value: "5" },
];

const lifestyleOptions = [
  { label: "Any", value: "all" },
  { label: "Water", value: "waterfront" },
  { label: "Private", value: "private" },
  { label: "City", value: "city" },
  { label: "Family", value: "family" },
];

const sortOptions = [
  { label: "Best", value: "best" },
  { label: "Price", value: "price-desc" },
  { label: "Beds", value: "beds-desc" },
];

function parsePriceValue(price: string) {
  const match = price.replaceAll(",", "").match(/(\d+(?:\.\d+)?)/);

  return match ? Number(match[1]) : 0;
}

function getPropertyText(property: FeaturedProperty) {
  return [
    property.title,
    property.location,
    property.price,
    property.tag,
    property.type,
    property.description,
    property.amenities.join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

function matchesBudget(property: FeaturedProperty, budget: string) {
  const price = parsePriceValue(property.price);

  if (budget === "under-4") return price < 4;
  if (budget === "4-7") return price >= 4 && price <= 7;
  if (budget === "7-plus") return price >= 7;

  return true;
}

function matchesLifestyle(property: FeaturedProperty, lifestyle: string) {
  const text = getPropertyText(property);

  if (lifestyle === "waterfront") {
    return ["ocean", "water", "coastal", "cliffside"].some((term) =>
      text.includes(term),
    );
  }

  if (lifestyle === "private") {
    return ["private", "quiet", "courtyard", "wing", "estate"].some((term) =>
      text.includes(term),
    );
  }

  if (lifestyle === "city") {
    return ["city", "skyline", "new york", "restaurant", "penthouse"].some(
      (term) => text.includes(term),
    );
  }

  if (lifestyle === "family") {
    return property.beds >= 5 || ["guest", "family", "pavilion"].some((term) => text.includes(term));
  }

  return true;
}

function filterProperties(properties: FeaturedProperty[], filters: ListingFilters) {
  const query = filters.q.trim().toLowerCase();

  return properties
    .filter((property) => {
      const text = getPropertyText(property);
      const matchesQuery = query
        ? query.split(/\s+/).every((token) => text.includes(token))
        : true;
      const matchesType =
        filters.type === "all" || property.type.toLowerCase().includes(filters.type);
      const matchesBeds =
        filters.beds === "all" || property.beds >= Number(filters.beds);

      return (
        matchesQuery &&
        matchesType &&
        matchesBudget(property, filters.budget) &&
        matchesBeds &&
        matchesLifestyle(property, filters.lifestyle)
      );
    })
    .sort((a, b) => {
      if (filters.sort === "price-desc") {
        return parsePriceValue(b.price) - parsePriceValue(a.price);
      }

      if (filters.sort === "beds-desc") {
        return b.beds - a.beds;
      }

      return 0;
    });
}

export function ListingsExplorer({
  initialFilters,
  properties,
  savedSlugs = [],
}: ListingsExplorerProps) {
  const [filters, setFilters] = useState(initialFilters);
  const [activeMapSlug, setActiveMapSlug] = useState(
    properties[0]?.slug ?? "",
  );
  const filteredProperties = useMemo(
    () => filterProperties(properties, filters),
    [filters, properties],
  );
  const resolvedMapSlug = useMemo(() => {
    if (filteredProperties.some((property) => property.slug === activeMapSlug)) {
      return activeMapSlug;
    }

    return filteredProperties[0]?.slug ?? "";
  }, [activeMapSlug, filteredProperties]);

  function updateFilter(key: keyof ListingFilters, value: string) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function resetFilters() {
    setFilters({
      q: "",
      type: "all",
      budget: "all",
      beds: "all",
      lifestyle: "all",
      sort: "best",
    });
  }

  return (
    <section className="mx-auto grid w-full max-w-7xl gap-6 px-5 pb-24 sm:px-8 lg:grid-cols-[minmax(0,1fr)_520px] lg:px-10">
      <div>
        <Card variant="glass" className="p-4 sm:p-5">
          <div className="grid gap-5">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
              <InputField
                className="bg-public-bg/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                label="Search listings"
                onChange={(event) => updateFilter("q", event.target.value)}
                placeholder="City, neighborhood, amenity, lifestyle"
                type="search"
                value={filters.q}
              />
              <Button className="h-12 px-8" onClick={resetFilters} type="button" variant="secondary">
                Clear
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_0.72fr_1fr]">
              <SelectMenu
                label="Type"
                onChange={(value) => updateFilter("type", value)}
                options={typeOptions}
                value={filters.type}
              />
              <SelectMenu
                label="Budget"
                onChange={(value) => updateFilter("budget", value)}
                options={budgetOptions}
                value={filters.budget}
              />
              <SelectMenu
                label="Beds"
                onChange={(value) => updateFilter("beds", value)}
                options={bedOptions}
                value={filters.beds}
              />
              <SelectMenu
                label="Lifestyle"
                onChange={(value) => updateFilter("lifestyle", value)}
                options={lifestyleOptions}
                value={filters.lifestyle}
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
              <div>
                <Badge variant="muted">
                  {filteredProperties.length} of {properties.length} homes
                </Badge>
                <p className="mt-2 text-sm text-public-muted">
                  Filters update instantly as you narrow the collection.
                </p>
              </div>
              <div className="w-full sm:w-56">
                <SelectMenu
                  label="Sort"
                  onChange={(value) => updateFilter("sort", value)}
                  options={sortOptions}
                  value={filters.sort}
                />
              </div>
            </div>
          </div>
        </Card>

        {filteredProperties.length ? (
          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            {filteredProperties.map((property) => (
              <PropertyCard
                initialSaved={savedSlugs.includes(property.slug)}
                isMapActive={property.slug === resolvedMapSlug}
                key={property.slug}
                onShowOnMap={() => setActiveMapSlug(property.slug)}
                property={property}
              />
            ))}
          </div>
        ) : (
          <Card variant="surface" className="mt-6 p-8 text-center">
            <p className="text-2xl font-semibold text-white">No homes match that search yet.</p>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-public-muted">
              Try a broader location, lower the budget filter, or clear the lifestyle signal.
            </p>
            <Button className="mt-6" onClick={resetFilters} type="button">
              Reset filters
            </Button>
          </Card>
        )}
      </div>
      <Card
        variant="glass"
        className="sticky top-6 hidden h-fit overflow-hidden p-3 lg:block"
      >
        <MapPreview
          activeSlug={resolvedMapSlug}
          onActiveSlugChange={setActiveMapSlug}
          properties={filteredProperties}
          title="Interactive map preview"
          description="Pins, active property details, and routing stay in sync with the selected listing."
        />
      </Card>
    </section>
  );
}
