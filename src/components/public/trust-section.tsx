import { Card } from "@/components/ui/card";
import { Section, SectionHeading } from "@/components/ui/section";
import { propertyStats } from "@/lib/mock-properties";

export function TrustSection() {
  return (
    <Section id="agents" className="pt-4">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <SectionHeading
          eyebrow="Advisor-led search"
          title="Luxury presentation with an agency operating model behind it."
        >
          <p>
            The public site is designed to feel editorial and selective, while
            the product foundation stays ready for the clean operational
            dashboard planned next.
          </p>
        </SectionHeading>
        <Card variant="glass" className="p-6 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {propertyStats.map((stat) => (
              <div
                className="rounded-[24px] border border-white/10 bg-white/[0.06] p-5"
                key={stat.label}
              >
                <p className="text-3xl font-semibold text-white">{stat.value}</p>
                <p className="mt-2 text-sm leading-6 text-public-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-[24px] border border-luxury-accent/20 bg-luxury-accent/10 p-5">
            <p className="text-sm leading-7 text-white/76">
              Every visible surface stays buyer-facing and premium in this
              phase. Admin workflows, lead management, and live listing data
              remain intentionally out of scope until later phases.
            </p>
          </div>
        </Card>
      </div>
    </Section>
  );
}
