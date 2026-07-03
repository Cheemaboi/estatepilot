import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Section, SectionHeading } from "@/components/ui/section";
import { featuredProperties } from "@/lib/mock-properties";

export function FeaturedProperties() {
  return (
    <Section id="featured">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Featured portfolio"
          title="Homes selected for presence, privacy, and architectural pull."
        >
          <p>
            Static showcase data for now, structured so the cards can later be
            connected to Supabase without changing the public visual system.
          </p>
        </SectionHeading>
        <ButtonLink href="#contact" variant="secondary" className="w-fit">
          Request private list
        </ButtonLink>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {featuredProperties.map((property) => (
          <Card
            key={property.title}
            className="group overflow-hidden p-3 transition duration-300 hover:-translate-y-1 hover:border-luxury-accent/45"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-[22px]">
              <Image
                src={property.image}
                alt={`${property.title} in ${property.location}`}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute left-4 top-4">
                <Badge variant="luxury">{property.tag}</Badge>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {property.title}
                  </h3>
                  <p className="mt-1 text-sm text-public-muted">
                    {property.location}
                  </p>
                </div>
                <p className="text-lg font-semibold text-luxury-accent">
                  {property.price}
                </p>
              </div>
              <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-5 text-sm text-white/72">
                <div>
                  <dt className="text-white/42">Beds</dt>
                  <dd className="mt-1 font-semibold text-white">
                    {property.beds}
                  </dd>
                </div>
                <div>
                  <dt className="text-white/42">Baths</dt>
                  <dd className="mt-1 font-semibold text-white">
                    {property.baths}
                  </dd>
                </div>
                <div>
                  <dt className="text-white/42">Area</dt>
                  <dd className="mt-1 font-semibold text-white">
                    {property.area}
                  </dd>
                </div>
              </dl>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
