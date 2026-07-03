import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputField, SelectField } from "@/components/ui/field";
import { PublicShell } from "@/components/public/public-shell";
import { PropertyCard } from "@/components/public/property-card";
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
            <div className="grid gap-4 md:grid-cols-[1fr_0.7fr_0.7fr_auto] md:items-end">
              <InputField
                label="Search"
                placeholder="City, neighborhood, lifestyle"
                type="search"
              />
              <SelectField label="Type" defaultValue="all">
                <option value="all">All homes</option>
                <option value="estate">Estate</option>
                <option value="penthouse">Penthouse</option>
              </SelectField>
              <SelectField label="Sort" defaultValue="featured">
                <option value="featured">Featured</option>
                <option value="price-high">Price high</option>
                <option value="newest">Newest</option>
              </SelectField>
              <Button type="button" className="h-12 px-8">
                Refine
              </Button>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {filters.map((filter) => (
                <span
                  className="rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-sm text-white/72"
                  key={filter}
                >
                  {filter}
                </span>
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
          className="sticky top-6 hidden h-[720px] overflow-hidden p-6 lg:block"
        >
          <div className="flex h-full flex-col justify-between rounded-[24px] border border-white/12 bg-[radial-gradient(circle_at_30%_20%,rgba(216,189,134,0.25),transparent_24%),linear-gradient(145deg,rgba(255,255,255,0.12),rgba(255,255,255,0.03))] p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-luxury-accent">
                Map preview
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                West Coast, Austin, and Manhattan signals.
              </h2>
            </div>
            <div className="grid gap-3">
              {properties.map((property) => (
                <div
                  className="rounded-2xl border border-white/12 bg-public-bg/50 p-4"
                  key={property.slug}
                >
                  <p className="font-semibold text-white">{property.location}</p>
                  <p className="mt-1 text-sm text-public-muted">
                    {property.price} · {property.type}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>
    </PublicShell>
  );
}
