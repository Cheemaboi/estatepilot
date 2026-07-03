import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputField } from "@/components/ui/field";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { PublicShell } from "@/components/public/public-shell";
import { PropertyCard } from "@/components/public/property-card";
import { MapPreview } from "@/components/features/map-preview";
import { Section } from "@/components/ui/section";
import { getPublicProperties } from "@/lib/supabase/data";

const filters = ["Verified", "New this week", "Private tours", "Water views"];

export default async function ListingsPage() {
  const properties = await getPublicProperties();

  return (
    <PublicShell>
      <Section className="pb-12 pt-32 lg:pt-40">
        <div className="max-w-4xl">
          <Badge variant="luxury">Public listings</Badge>
          <h1 className="mt-6 text-5xl font-semibold leading-tight text-white sm:text-7xl">
            Browse premium homes with room to compare.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-public-muted">
            A static listings shell with search, filters, sorting, cards, and a
            map-inspired panel ready for later data and map integrations.
          </p>
        </div>
      </Section>
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-5 pb-24 sm:px-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-10">
        <div>
          <Card variant="glass" className="p-5">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)_auto] xl:items-end">
              <InputField
                label="Search"
                placeholder="City, neighborhood, lifestyle"
                type="search"
              />
              <SegmentedControl
                label="Listing type"
                name="listing_type"
                options={[
                  { label: "All", value: "all" },
                  { label: "Estate", value: "estate" },
                  { label: "Villa", value: "villa" },
                  { label: "Penthouse", value: "penthouse" },
                ]}
              />
              <Button type="button" className="h-12 px-8">
                Refine
              </Button>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {[...filters, "Price high", "Newest", "Best match"].map((filter) => (
                <button
                  className="rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/72 transition hover:border-luxury-accent/50 hover:text-white"
                  key={filter}
                  type="button"
                >
                  {filter}
                </button>
              ))}
            </div>
          </Card>
          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            {properties.map((property) => (
              <PropertyCard key={property.slug} property={property} />
            ))}
          </div>
        </div>
        <Card
          variant="glass"
          className="sticky top-6 hidden h-fit overflow-hidden p-4 lg:block"
        >
          <MapPreview
            properties={properties}
            title="Map integration surface"
            description="A provider-ready map area for location search, pins, and neighborhood filtering."
          />
        </Card>
      </section>
    </PublicShell>
  );
}
