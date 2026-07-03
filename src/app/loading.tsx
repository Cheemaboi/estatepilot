import { PublicShell } from "@/components/public/public-shell";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";

export default function Loading() {
  return (
    <PublicShell>
      <Section className="min-h-[70vh] pb-16 pt-32 lg:pt-40">
        <Card variant="glass" className="mx-auto max-w-4xl p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-luxury-accent">
            Loading EstatePilot
          </p>
          <div className="mt-8 grid gap-4">
            <div className="h-12 max-w-2xl animate-pulse rounded-full bg-white/10" />
            <div className="h-12 max-w-xl animate-pulse rounded-full bg-white/[0.07]" />
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="h-44 animate-pulse rounded-[24px] bg-white/[0.07]" />
              <div className="h-44 animate-pulse rounded-[24px] bg-white/[0.07]" />
              <div className="h-44 animate-pulse rounded-[24px] bg-white/[0.07]" />
            </div>
          </div>
        </Card>
      </Section>
    </PublicShell>
  );
}
