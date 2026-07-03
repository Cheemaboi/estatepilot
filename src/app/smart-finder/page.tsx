import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputField, SelectField } from "@/components/ui/field";
import { PublicShell } from "@/components/public/public-shell";
import { PropertyCard } from "@/components/public/property-card";
import { Section } from "@/components/ui/section";
import { featuredProperties } from "@/lib/mock-properties";

const prompts = [
  "A quiet ocean-view home with space for extended family",
  "A city penthouse near restaurants with private outdoor space",
  "A warm villa with a pool, office, and low-maintenance grounds",
];

export default function SmartFinderPage() {
  return (
    <PublicShell>
      <Section className="pb-12 pt-32 lg:pt-40">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
          <div>
            <Badge variant="luxury">AI property finder UI</Badge>
            <h1 className="mt-6 text-5xl font-semibold leading-tight text-white sm:text-7xl">
              Describe the life. EstatePilot frames the search.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-public-muted">
              This is the presentational Smart Finder shell. It shows the future
              natural-language search surface without calling any AI API yet.
            </p>
          </div>
          <Card variant="glass" className="p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-luxury-accent">
              Suggested prompts
            </p>
            <div className="mt-5 grid gap-3">
              {prompts.map((prompt) => (
                <div
                  className="rounded-2xl border border-white/12 bg-white/[0.06] p-4 text-sm leading-6 text-white/74"
                  key={prompt}
                >
                  {prompt}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Section>
      <section className="mx-auto w-full max-w-7xl px-5 pb-24 sm:px-8 lg:px-10">
        <Card variant="glass" className="p-5 sm:p-7">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_220px_220px_auto] lg:items-end">
            <label className="grid gap-2 text-sm font-medium text-white/78">
              <span>Describe what you want</span>
              <textarea
                className="min-h-32 w-full rounded-[26px] border border-white/12 bg-white/10 px-5 py-4 text-sm leading-6 text-white transition placeholder:text-white/45 focus:border-luxury-accent focus:bg-white/14 focus:outline-none"
                placeholder="I want a private home near the water with entertaining space, four bedrooms, and a calm design language."
              />
            </label>
            <SelectField label="Timeline" defaultValue="90">
              <option value="30">30 days</option>
              <option value="90">90 days</option>
              <option value="flexible">Flexible</option>
            </SelectField>
            <InputField label="Budget" placeholder="$2M - $6M" />
            <Button type="button" className="h-12 px-8">
              Match
            </Button>
          </div>
        </Card>
        <div className="mt-12">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-luxury-accent">
                Recommended matches
              </p>
              <h2 className="mt-3 text-4xl font-semibold text-white">
                Static recommendations for the first AI surface.
              </h2>
            </div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.slug} property={property} />
            ))}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
