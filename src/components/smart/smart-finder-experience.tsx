"use client";

import { useMemo, useState } from "react";
import { FavoriteButton } from "@/components/features/favorite-button";
import { PropertyCard } from "@/components/public/property-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputField, SelectField } from "@/components/ui/field";
import type { FeaturedProperty } from "@/lib/mock-properties";
import { getSmartMatches } from "@/lib/smart-matching";

const examples = [
  "A quiet ocean-view home with space for extended family",
  "A city penthouse near restaurants with private outdoor space",
  "A warm villa with a pool, office, and low-maintenance grounds",
];

type SmartFinderExperienceProps = {
  properties: FeaturedProperty[];
};

export function SmartFinderExperience({ properties }: SmartFinderExperienceProps) {
  const [query, setQuery] = useState(
    "I want a private home near the water with entertaining space, four bedrooms, and a calm design language.",
  );
  const [budget, setBudget] = useState("6");
  const [timeline, setTimeline] = useState("90");
  const [submittedQuery, setSubmittedQuery] = useState(query);

  const matches = useMemo(
    () =>
      getSmartMatches({
        properties,
        query: submittedQuery,
        budget,
        timeline,
      }),
    [budget, properties, submittedQuery, timeline],
  );

  const topMatch = matches[0];

  return (
    <div>
      <Card variant="glass" className="p-5 sm:p-7">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_220px_220px_auto] lg:items-end">
          <label className="grid gap-2 text-sm font-medium text-white/78">
            <span>Describe what you want</span>
            <textarea
              className="min-h-32 w-full rounded-[26px] border border-white/12 bg-white/10 px-5 py-4 text-sm leading-6 text-white transition placeholder:text-white/45 focus:border-luxury-accent focus:bg-white/14 focus:outline-none"
              onChange={(event) => setQuery(event.target.value)}
              value={query}
            />
          </label>
          <SelectField
            label="Timeline"
            onChange={(event) => setTimeline(event.target.value)}
            value={timeline}
          >
            <option value="30">30 days</option>
            <option value="90">90 days</option>
            <option value="flexible">Flexible</option>
          </SelectField>
          <InputField
            label="Budget"
            onChange={(event) => setBudget(event.target.value)}
            placeholder="$6M"
            value={budget}
          />
          <Button
            className="h-12 px-8"
            onClick={() => setSubmittedQuery(query)}
            type="button"
          >
            Match
          </Button>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {examples.map((example) => (
            <button
              className="rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-left text-sm text-white/72 transition hover:border-luxury-accent/50 hover:text-white"
              key={example}
              onClick={() => {
                setQuery(example);
                setSubmittedQuery(example);
              }}
              type="button"
            >
              {example}
            </button>
          ))}
        </div>
      </Card>
      {topMatch ? (
        <Card variant="glass" className="mt-8 p-5 sm:p-7">
          <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-luxury-accent">
                Best match
              </p>
              <h2 className="mt-3 text-4xl font-semibold text-white">
                {topMatch.property.title}
              </h2>
              <p className="mt-3 text-public-muted">
                {topMatch.score}% lifestyle fit based on your description.
              </p>
              <div className="mt-5 grid gap-2">
                {topMatch.reasons.map((reason) => (
                  <p
                    className="rounded-2xl border border-white/12 bg-white/[0.06] px-4 py-3 text-sm text-white/74"
                    key={reason}
                  >
                    {reason}
                  </p>
                ))}
              </div>
              <div className="mt-5">
                <FavoriteButton slug={topMatch.property.slug} label="Save match" />
              </div>
            </div>
            <PropertyCard property={topMatch.property} />
          </div>
        </Card>
      ) : null}
      <div className="mt-12">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-luxury-accent">
          Recommended matches
        </p>
        <h2 className="mt-3 text-4xl font-semibold text-white">
          Ranked from your natural-language search.
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {matches.map((match) => (
            <div className="grid gap-3" key={match.property.slug}>
              <div className="flex items-center justify-between rounded-full border border-white/12 bg-public-bg/55 px-4 py-2 text-sm text-white/72 backdrop-blur-md">
                <span>{match.score}% fit</span>
                <FavoriteButton slug={match.property.slug} />
              </div>
              <PropertyCard property={match.property} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
