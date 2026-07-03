import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { FeaturedProperty } from "@/lib/mock-properties";

type PropertyCardProps = {
  property: FeaturedProperty;
};

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group block focus-visible:rounded-[28px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-luxury-accent"
    >
      <Card className="h-full overflow-hidden p-3 transition duration-300 group-hover:-translate-y-1 group-hover:border-luxury-accent/45">
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
        </div>
      </Card>
    </Link>
  );
}
