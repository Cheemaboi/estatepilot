import { PublicShell } from "@/components/public/public-shell";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";

export default function NotFound() {
  return (
    <PublicShell>
      <Section className="grid min-h-[70vh] place-items-center pb-16 pt-32 text-center lg:pt-40">
        <Card variant="glass" className="max-w-2xl p-8 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-luxury-accent">
            404
          </p>
          <h1 className="mt-5 text-4xl font-semibold text-white sm:text-5xl">
            This address does not match an active listing.
          </h1>
          <p className="mt-5 text-base leading-7 text-public-muted">
            The page may have moved, or the listing may no longer be available.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/listings">Browse listings</ButtonLink>
            <ButtonLink href="/" variant="secondary">
              Return home
            </ButtonLink>
          </div>
        </Card>
      </Section>
    </PublicShell>
  );
}
