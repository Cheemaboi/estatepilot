import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";

export function CtaSection() {
  return (
    <Section id="contact" className="pt-4">
      <Card
        variant="glass"
        className="relative overflow-hidden px-6 py-12 sm:px-10 lg:px-14"
      >
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[linear-gradient(120deg,transparent,rgba(216,189,134,0.2))] lg:block" />
        <div className="relative max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-luxury-accent">
            Private client launch
          </p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Launch the public experience with a brand that feels complete.
          </h2>
          <p className="mt-5 text-lg leading-8 text-public-muted">
            EstatePilot combines luxury listings, smart search, location
            exploration, inquiry capture, and an agency dashboard in one
            polished product.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#featured">Explore homes</ButtonLink>
            <ButtonLink href="#search" variant="secondary">
              Refine search
            </ButtonLink>
          </div>
        </div>
      </Card>
    </Section>
  );
}
