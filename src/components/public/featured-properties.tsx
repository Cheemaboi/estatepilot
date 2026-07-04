import { ButtonLink } from "@/components/ui/button";
import { PropertyCard } from "@/components/public/property-card";
import { Section, SectionHeading } from "@/components/ui/section";
import type { FeaturedProperty } from "@/lib/mock-properties";

type FeaturedPropertiesProps = {
  properties: FeaturedProperty[];
};

export function FeaturedProperties({ properties }: FeaturedPropertiesProps) {
  return (
    <Section id="featured">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Featured homes"
          title="Homes selected for presence, privacy, and architectural pull."
        >
          <p>
            Curated listings presented in a compact editorial grid with a clean
            path into the property pages.
          </p>
        </SectionHeading>
        <ButtonLink href="#contact" variant="secondary" className="w-fit">
          Request private list
        </ButtonLink>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard key={property.title} property={property} />
        ))}
      </div>
    </Section>
  );
}
