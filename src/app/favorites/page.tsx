import { Badge } from "@/components/ui/badge";
import { PublicShell } from "@/components/public/public-shell";
import { SavedPropertiesPanel } from "@/components/features/saved-properties-panel";
import { Section } from "@/components/ui/section";
import { getPublicProperties } from "@/lib/supabase/data";

export default async function FavoritesPage() {
  const properties = await getPublicProperties();

  return (
    <PublicShell>
      <Section className="pb-12 pt-32 lg:pt-40">
        <Badge variant="luxury">Saved homes</Badge>
        <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-tight text-white sm:text-7xl">
          Keep a private shortlist while you explore.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-public-muted">
          Favorites are saved locally on this device for now. The Supabase
          `saved_properties` table is ready for account-based saves later.
        </p>
      </Section>
      <section className="mx-auto w-full max-w-7xl px-5 pb-24 sm:px-8 lg:px-10">
        <SavedPropertiesPanel properties={properties} />
      </section>
    </PublicShell>
  );
}
