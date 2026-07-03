import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FavoriteButton } from "@/components/features/favorite-button";
import { MapPreview } from "@/components/features/map-preview";
import { InputField } from "@/components/ui/field";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { PublicShell } from "@/components/public/public-shell";
import { PropertyCard } from "@/components/public/property-card";
import { PropertyAssistant } from "@/components/smart/property-assistant";
import { Section } from "@/components/ui/section";
import { featuredProperties } from "@/lib/mock-properties";
import { getPropertyBySlug, getPublicProperties } from "@/lib/supabase/data";
import { createInquiry } from "@/app/properties/[slug]/actions";

type PropertyDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    message?: string;
  }>;
};

export function generateStaticParams() {
  return featuredProperties.map((property) => ({
    slug: property.slug,
  }));
}

export default async function PropertyDetailPage({
  params,
  searchParams,
}: PropertyDetailPageProps) {
  const { slug } = await params;
  const { message } = await searchParams;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const relatedProperties = (await getPublicProperties()).filter(
    (item) => item.slug !== slug,
  );

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
            <div className="mt-6">
              <FavoriteButton slug={property.slug} label="Save property" />
            </div>
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
                <dt className="text-white/56">Beds</dt>
                <dd className="mt-1 font-semibold text-white">{property.beds}</dd>
              </div>
              <div>
                <dt className="text-white/56">Baths</dt>
                <dd className="mt-1 font-semibold text-white">{property.baths}</dd>
              </div>
              <div>
                <dt className="text-white/56">Area</dt>
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
          <MapPreview
            properties={[property]}
            title="Location intelligence"
            description="Map-ready placement for neighborhood, commute, and private-tour context."
          />
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
                className="rounded-2xl border border-luxury-accent/25 bg-public-bg/55 p-4 text-white shadow-[0_14px_34px_rgba(0,0,0,0.22)] backdrop-blur-md"
                key={amenity}
              >
                <span className="mr-2 text-luxury-accent">•</span>
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
              This local assistant gives rule-based guidance now and keeps the
              interface ready for an AI model later.
            </p>
            <PropertyAssistant property={property} />
          </Card>
        </div>
        <Card variant="glass" className="h-fit p-6">
          <h2 className="text-2xl font-semibold text-white">Request a tour</h2>
          <p className="mt-2 text-sm leading-6 text-public-muted">
            {property.agent.name}, {property.agent.role}
          </p>
          <p className="mt-1 text-sm text-luxury-accent">{property.agent.phone}</p>
          {message ? (
            <p className="mt-4 rounded-2xl border border-luxury-accent/25 bg-public-bg/50 p-3 text-sm text-public-muted">
              {message}
            </p>
          ) : null}
          <form action={createInquiry} className="mt-6 grid gap-4">
            <input name="slug" type="hidden" value={property.slug} />
            <InputField label="Name" name="full_name" placeholder="Your name" required />
            <InputField
              label="Email"
              name="email"
              placeholder="you@example.com"
              type="email"
              required
            />
            <InputField label="Phone" name="phone" placeholder="+1 (555) 010-0000" />
            <InputField label="Preferred date" name="preferred_date" type="date" />
            <InputField label="Preferred time" name="preferred_time" type="time" />
            <SegmentedControl
              label="Tour format"
              name="tour_format"
              options={[
                { label: "Private", value: "private" },
                { label: "Video", value: "video" },
                { label: "Advisor", value: "advisor" },
              ]}
            />
            <label className="grid gap-2 text-sm font-medium text-white/78">
              <span>Message</span>
              <textarea
                className="min-h-28 w-full rounded-[24px] border border-white/12 bg-white/10 px-4 py-3 text-sm text-white transition placeholder:text-white/45 focus:border-luxury-accent focus:bg-white/14 focus:outline-none"
                name="message"
                placeholder="Tell us what you would like to see."
              />
            </label>
            <Button type="submit" className="mt-2">
              Send inquiry
            </Button>
          </form>
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
