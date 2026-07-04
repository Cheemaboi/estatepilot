import { ListingsExplorer, type ListingFilters } from "@/components/public/listings-explorer";
import { PublicShell } from "@/components/public/public-shell";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";
import { getPublicProperties } from "@/lib/supabase/data";

type ListingsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getStringParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key];

  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const [properties, params] = await Promise.all([
    getPublicProperties(),
    searchParams ?? Promise.resolve({}),
  ]);
  const initialFilters: ListingFilters = {
    q: getStringParam(params, "q"),
    type: getStringParam(params, "type") || "all",
    budget: getStringParam(params, "budget") || "all",
    beds: getStringParam(params, "beds") || "all",
    lifestyle: getStringParam(params, "lifestyle") || "all",
    sort: getStringParam(params, "sort") || "best",
  };

  return (
    <PublicShell>
      <Section className="pb-12 pt-32 lg:pt-40">
        <div className="max-w-4xl">
          <Badge variant="luxury">Public listings</Badge>
          <h1 className="mt-6 text-5xl font-semibold leading-tight text-white sm:text-7xl">
            Browse premium homes with room to compare.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-public-muted">
            Search by location, lifestyle, property type, budget, and bedrooms.
            The interface is connected to local mock data, Supabase-ready data
            loading, and Mapbox live location previews.
          </p>
        </div>
      </Section>
      <ListingsExplorer initialFilters={initialFilters} properties={properties} />
    </PublicShell>
  );
}
