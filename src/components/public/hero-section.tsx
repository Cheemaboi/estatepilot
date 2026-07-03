import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function HeroSection() {
  return (
    <section className="relative min-h-[760px] overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2200&q=85"
        alt="Modern luxury home overlooking a pool at dusk"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,17,13,0.94)_0%,rgba(8,17,13,0.73)_42%,rgba(8,17,13,0.22)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(216,189,134,0.18),transparent_34%)]" />
      <div className="relative z-10 mx-auto flex min-h-[760px] max-w-7xl items-end px-5 pb-16 pt-36 sm:px-8 lg:px-10 lg:pb-24">
        <div className="grid w-full gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div className="max-w-4xl">
            <Badge variant="luxury">Curated luxury real estate</Badge>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.98] text-white sm:text-7xl lg:text-8xl">
              Find the address that changes the room.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/74 sm:text-xl">
              EstatePilot pairs cinematic property discovery with the operational
              backbone modern agencies need to move premium listings faster.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#search">Start searching</ButtonLink>
              <ButtonLink href="#featured" variant="secondary">
                View featured homes
              </ButtonLink>
            </div>
          </div>
          <Card variant="glass" className="max-w-sm p-6">
            <p className="text-sm uppercase tracking-[0.22em] text-luxury-accent">
              Market signal
            </p>
            <div className="mt-5 grid grid-cols-2 gap-5">
              <div>
                <p className="text-3xl font-semibold text-white">$2.8B</p>
                <p className="mt-1 text-sm text-white/62">Curated inventory</p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-white">48h</p>
                <p className="mt-1 text-sm text-white/62">
                  Private tour window
                </p>
              </div>
            </div>
            <div className="mt-6 rounded-3xl border border-white/12 bg-black/20 p-4">
              <p className="text-sm leading-6 text-white/70">
                Smart matching, agent-ready workflows, and premium presentation
                are designed to live in one product.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
