import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PublicShell } from "@/components/public/public-shell";
import { SmartFinderExperience } from "@/components/smart/smart-finder-experience";
import { Section } from "@/components/ui/section";
import { getPublicProperties } from "@/lib/supabase/data";

const prompts = [
  "A quiet ocean-view home with space for extended family",
  "A city penthouse near restaurants with private outdoor space",
  "A warm villa with a pool, office, and low-maintenance grounds",
];

export default async function SmartFinderPage() {
  const properties = await getPublicProperties();

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
              Describe what you want in plain language and EstatePilot will rank
              homes with a local matching engine that is ready for a later AI API.
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
        <SmartFinderExperience properties={properties} />
      </section>
    </PublicShell>
  );
}
