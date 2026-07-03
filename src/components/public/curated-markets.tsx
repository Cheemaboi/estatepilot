import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Section, SectionHeading } from "@/components/ui/section";
import { curatedMarkets } from "@/lib/mock-properties";

export function CuratedMarkets() {
  return (
    <Section id="markets" className="pt-4">
      <SectionHeading
        eyebrow="Explore by lifestyle"
        title="Curated markets for buyers who know the feeling first."
      >
        <p>
          Browse the public experience by aspiration before filters take over:
          coast, city, privacy, and arrival.
        </p>
      </SectionHeading>
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {curatedMarkets.map((market) => (
          <Card
            key={market.name}
            className="group overflow-hidden p-3 transition duration-300 hover:-translate-y-1 hover:border-luxury-accent/45"
          >
            <div className="relative aspect-[16/11] overflow-hidden rounded-[22px]">
              <Image
                src={market.image}
                alt={`${market.name} market`}
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-public-bg/85 via-public-bg/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="inline-flex rounded-full border border-luxury-accent/35 bg-public-bg/55 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#f3dca3] shadow-[0_10px_30px_rgba(0,0,0,0.24)] backdrop-blur-md">
                  {market.count}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white">
                  {market.name}
                </h3>
                <p className="mt-1 text-sm text-white/68">{market.location}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
