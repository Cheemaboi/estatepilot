"use client";

import { useMemo, useState } from "react";
import { FavoriteButton } from "@/components/features/favorite-button";
import { PropertyCard } from "@/components/public/property-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SelectMenu } from "@/components/ui/select-menu";
import type { FeaturedProperty } from "@/lib/mock-properties";
import { getSmartMatches } from "@/lib/smart-matching";

const examples = [
  "Ocean view, private, six bedrooms, outdoor entertaining, calm design",
  "City penthouse near restaurants with terraces and low maintenance",
  "Warm villa with a pool, office, guest space, and family scale",
];

const mustHaveOptions = [
  "Ocean view",
  "Private",
  "Pool",
  "Office",
  "Guest space",
  "City access",
];

type SmartFinderExperienceProps = {
  properties: FeaturedProperty[];
};

function getConfidenceLabel(score: number) {
  if (score >= 90) return "Excellent fit";
  if (score >= 78) return "Strong fit";
  if (score >= 65) return "Good lead";

  return "Explore";
}

export function SmartFinderExperience({ properties }: SmartFinderExperienceProps) {
  const [query, setQuery] = useState(
    "Ocean view, private, six bedrooms, outdoor entertaining, calm design",
  );
  const [budget, setBudget] = useState("6");
  const [timeline, setTimeline] = useState("90");
  const [mustHaves, setMustHaves] = useState<string[]>(["Ocean view", "Private"]);
  const [submittedQuery, setSubmittedQuery] = useState(query);

  const enrichedQuery = `${submittedQuery} ${mustHaves.join(" ")}`;
  const matches = useMemo(
    () =>
      getSmartMatches({
        properties,
        query: enrichedQuery,
        budget,
        timeline,
      }),
    [budget, enrichedQuery, properties, timeline],
  );
  const topMatch = matches[0];

  function toggleMustHave(signal: string) {
    setMustHaves((current) =>
      current.includes(signal)
        ? current.filter((item) => item !== signal)
        : [...current, signal],
    );
  }

  function runMatch() {
    setSubmittedQuery(query);
  }

  return (
    <div className="grid gap-8">
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card variant="glass" className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-luxury-accent">
                Smart brief
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                Turn a plain-language brief into ranked homes.
              </h2>
            </div>
            <Button className="shrink-0 px-6" onClick={runMatch} type="button">
              Match
            </Button>
          </div>

          <label className="mt-6 grid gap-2 text-sm font-medium text-white/78">
            <span>Describe what matters</span>
            <textarea
              className="min-h-36 w-full resize-y rounded-[24px] border border-white/14 bg-public-bg/58 px-5 py-4 text-sm leading-6 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition placeholder:text-white/45 focus:border-luxury-accent focus:bg-public-bg/72 focus:outline-none"
              onChange={(event) => setQuery(event.target.value)}
              value={query}
            />
          </label>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <SelectMenu
              label="Timeline"
              onChange={setTimeline}
              options={[
                { label: "30d", value: "30" },
                { label: "90d", value: "90" },
                { label: "Flexible", value: "flexible" },
              ]}
              value={timeline}
            />
            <SelectMenu
              label="Budget"
              onChange={setBudget}
              options={[
                { label: "$3M", value: "3" },
                { label: "$6M", value: "6" },
                { label: "$9M", value: "9" },
                { label: "$12M", value: "12" },
              ]}
              value={budget}
            />
          </div>

          <div className="mt-5">
            <p className="text-sm font-medium text-white/78">Must-haves</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {mustHaveOptions.map((signal) => {
                const isActive = mustHaves.includes(signal);

                return (
                  <button
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "border-luxury-accent bg-luxury-accent text-public-bg"
                        : "border-white/12 bg-white/[0.06] text-white/72 hover:border-luxury-accent/50 hover:text-white"
                    }`}
                    key={signal}
                    onClick={() => toggleMustHave(signal)}
                    type="button"
                  >
                    {signal}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 grid gap-2">
            {examples.map((example) => (
              <button
                className="rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-3 text-left text-sm leading-6 text-white/72 transition hover:border-luxury-accent/45 hover:bg-white/[0.08] hover:text-white"
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
          <Card variant="glass" className="overflow-hidden p-5 sm:p-6">
            <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-luxury-accent">
                  Live readout
                </p>
                <div className="mt-4 rounded-[24px] border border-white/12 bg-public-bg/62 p-5 backdrop-blur-xl">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="text-sm font-semibold text-luxury-accent">
                        {getConfidenceLabel(topMatch.score)}
                      </p>
                      <h3 className="mt-2 text-3xl font-semibold text-white">
                        {topMatch.property.title}
                      </h3>
                      <p className="mt-2 text-sm text-white/66">
                        {topMatch.property.location}
                      </p>
                    </div>
                    <div className="grid size-20 place-items-center rounded-full border border-luxury-accent/45 bg-luxury-accent/12 text-xl font-semibold text-luxury-accent">
                      {topMatch.score}%
                    </div>
                  </div>
                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-luxury-accent"
                      style={{ width: `${topMatch.score}%` }}
                    />
                  </div>
                  <div className="mt-5 grid gap-2">
                    {topMatch.reasons.map((reason) => (
                      <p
                        className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm leading-6 text-white/74"
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
              </div>
              <PropertyCard property={topMatch.property} />
            </div>
          </Card>
        ) : null}
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-luxury-accent">
          Recommended matches
        </p>
        <h2 className="mt-3 max-w-2xl text-4xl font-semibold text-white">
          Ranked locally from your brief, must-haves, budget, and timeline.
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {matches.map((match) => (
            <div className="grid gap-3" key={match.property.slug}>
              <div className="flex items-center justify-between rounded-full border border-white/12 bg-public-bg/62 px-4 py-2 text-sm text-white/72 backdrop-blur-md">
                <span>{match.score}% fit</span>
                <span>{getConfidenceLabel(match.score)}</span>
              </div>
              <PropertyCard property={match.property} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
