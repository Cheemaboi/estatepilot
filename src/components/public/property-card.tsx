import Image from "next/image";
import Link from "next/link";
import { FavoriteButton } from "@/components/features/favorite-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { FeaturedProperty } from "@/lib/mock-properties";

type PropertyCardProps = {
  property: FeaturedProperty;
  isMapActive?: boolean;
  onShowOnMap?: () => void;
};

export function PropertyCard({
  property,
  isMapActive = false,
  onShowOnMap,
}: PropertyCardProps) {
  return (
    <Card
      className={`group h-full overflow-hidden p-3 transition duration-300 hover:-translate-y-1 ${
        isMapActive ? "border-luxury-accent/55 shadow-[0_18px_48px_rgba(216,189,134,0.12)]" : "hover:border-luxury-accent/45"
      }`}
    >
      <div className="relative">
        <Link
          href={`/properties/${property.slug}`}
          className="block focus-visible:rounded-[22px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-luxury-accent"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-[22px]">
            <Image
              src={property.image}
              alt={`${property.title} in ${property.location}`}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute left-4 top-4 rounded-full bg-public-bg/35 p-1 shadow-[0_14px_30px_rgba(0,0,0,0.26)] backdrop-blur-xl">
              <Badge variant="luxury">{property.tag}</Badge>
            </div>
          </div>
        </Link>
        <div className="absolute right-4 top-4">
          <FavoriteButton slug={property.slug} propertyTitle={property.title} />
        </div>
      </div>
      <div className="p-4">
        <Link
          href={`/properties/${property.slug}`}
          className="block focus-visible:rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-luxury-accent"
        >
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
        </Link>
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
        {onShowOnMap ? (
          <div className="mt-5 flex items-center gap-3">
            <Button className="px-4" onClick={onShowOnMap} type="button" variant="secondary">
              Show on map
            </Button>
            <p className="text-xs uppercase tracking-[0.14em] text-white/45">
              {isMapActive ? "Selected on map" : "Sync with map"}
            </p>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
