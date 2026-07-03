import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputField } from "@/components/ui/field";
import { PublicShell } from "@/components/public/public-shell";
import { PropertyCard } from "@/components/public/property-card";
import { Section } from "@/components/ui/section";
import { featuredProperties } from "@/lib/mock-properties";

type PropertyDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return featuredProperties.map((property) => ({
    slug: property.slug,
  }));
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const { slug } = await params;
  const property = featuredProperties.find((item) => item.slug === slug);

  if (!property) {
    notFound();
  }

  const relatedProperties = featuredProperties.filter((item) => item.slug !== slug);

  return (
    <PublicShell>
      <Section className="pb-10 pt-32 lg:pt-40">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <Badge variant="luxury">{property.tag}</Badge>
            <h1 className="mt-6 text-5xl font-semibold leading-tight text-white sm:text-7xl">
              {property.title}
            </h1>
            <p className="mt-5 text-xl text-public-muted">{property.location}</p>
          </div>
          <Card variant="glass" className="p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-luxury-accent">
              Asking price
            </p>
            <p className="mt-3 text-5xl font-semibold text-white">
              {property.price}
            </p>
            <dl className="mt-6 grid grid-cols-3 gap-3 text-sm">
              <div>
                <dt className="text-white/42">Beds</dt>
                <dd className="mt-1 font-semibold text-white">{property.beds}</dd>
              </div>
              <div>
                <dt className="text-white/42">Baths</dt>
                <dd className="mt-1 font-semibold text-white">{property.baths}</dd>
              </div>
              <div>
                <dt className="text-white/42">Area</dt>
                <dd className="mt-1 font-semibold text-white">{property.area}</dd>
              </div>
            </dl>
          </Card>
        </div>
      </Section>
      <section className="mx-auto grid w-full max-w-7xl gap-4 px-5 pb-20 sm:px-8 lg:grid-cols-[1.25fr_0.75fr] lg:px-10">
        <div className="relative min-h-[420px] overflow-hidden rounded-[30px] border border-white/12">
          <Image
            src={property.gallery[0]}
            alt={`${property.title} main gallery`}
            fill
            priority
            sizes="(min-width: 1024px) 65vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {property.gallery.slice(1).map((image) => (
            <div
              className="relative min-h-[202px] overflow-hidden rounded-[30px] border border-white/12"
              key={image}
            >
              <Image
                src={image}
                alt={`${property.title} secondary gallery`}
                fill
                sizes="(min-width: 1024px) 35vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
          <Card variant="glass" className="p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-luxury-accent">
              Location preview
            </p>
            <p className="mt-3 text-2xl font-semibold text-white">
              Market context without live maps yet
            </p>
            <p className="mt-3 text-sm leading-6 text-public-muted">
              Map integration arrives later; this shell preserves the placement
              and content hierarchy for the detail page.
            </p>
          </Card>
        </div>
      </section>
      <Section className="grid gap-8 pt-0 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div>
          <h2 className="text-4xl font-semibold text-white">Property story</h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-public-muted">
            {property.description}
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {property.amenities.map((amenity) => (
              <div
                className="rounded-2xl border border-white/12 bg-white/[0.06] p-4 text-white"
                key={amenity}
              >
                {amenity}
              </div>
            ))}
          </div>
          <Card variant="glass" className="mt-8 p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-luxury-accent">
              AI assistant entry
            </p>
            <p className="mt-3 text-2xl font-semibold text-white">
              Ask what makes this home fit your lifestyle.
            </p>
            <p className="mt-3 text-sm leading-6 text-public-muted">
              Presentational only for this phase, ready for a later AI
              recommendation flow.
            </p>
            <ButtonLink href="/smart-finder" className="mt-5">
              Open Smart Finder
            </ButtonLink>
          </Card>
        </div>
        <Card variant="glass" className="h-fit p-6">
          <h2 className="text-2xl font-semibold text-white">Request a tour</h2>
          <p className="mt-2 text-sm leading-6 text-public-muted">
            {property.agent.name}, {property.agent.role}
          </p>
          <p className="mt-1 text-sm text-luxury-accent">{property.agent.phone}</p>
          <div className="mt-6 grid gap-4">
            <InputField label="Name" placeholder="Your name" />
            <InputField label="Email" placeholder="you@example.com" type="email" />
            <InputField label="Preferred date" type="date" />
            <Button type="button" className="mt-2">
              Send inquiry
            </Button>
          </div>
        </Card>
      </Section>
      <Section className="pt-0">
        <h2 className="text-4xl font-semibold text-white">Related properties</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {relatedProperties.map((related) => (
            <PropertyCard key={related.slug} property={related} />
          ))}
        </div>
      </Section>
    </PublicShell>
  );
}
