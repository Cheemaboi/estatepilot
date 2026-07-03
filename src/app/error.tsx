"use client";

import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className="grid min-h-screen place-items-center bg-public-bg px-5 py-16 text-foreground">
      <Card variant="glass" className="max-w-2xl p-8 text-center sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-luxury-accent">
          Something went wrong
        </p>
        <h1 className="mt-5 text-4xl font-semibold text-white sm:text-5xl">
          EstatePilot could not load this view.
        </h1>
        <p className="mt-5 text-base leading-7 text-public-muted">
          Try again, or return to the public listings while we keep the
          experience stable.
        </p>
        {error.digest ? (
          <p className="mt-4 text-xs text-white/45">Error ID: {error.digest}</p>
        ) : null}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={reset} type="button">
            Try again
          </Button>
          <ButtonLink href="/listings" variant="secondary">
            Browse listings
          </ButtonLink>
        </div>
      </Card>
    </main>
  );
}
