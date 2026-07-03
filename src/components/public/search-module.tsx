"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputField } from "@/components/ui/field";
import { SegmentedControl } from "@/components/ui/segmented-control";

const typeOptions = [
  { label: "Any", value: "all" },
  { label: "Estate", value: "estate" },
  { label: "Villa", value: "villa" },
  { label: "Penthouse", value: "penthouse" },
];

const budgetOptions = [
  { label: "Any", value: "all" },
  { label: "Under $4M", value: "under-4" },
  { label: "$4M-$7M", value: "4-7" },
  { label: "$7M+", value: "7-plus" },
];

const bedOptions = [
  { label: "Any", value: "all" },
  { label: "3+", value: "3" },
  { label: "5+", value: "5" },
];

const lifestyleOptions = [
  { label: "Any", value: "all" },
  { label: "Water", value: "waterfront" },
  { label: "Private", value: "private" },
  { label: "City", value: "city" },
  { label: "Family", value: "family" },
];

export function SearchModule() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [budget, setBudget] = useState("all");
  const [beds, setBeds] = useState("all");
  const [lifestyle, setLifestyle] = useState("all");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();

    if (query.trim()) params.set("q", query.trim());
    if (type !== "all") params.set("type", type);
    if (budget !== "all") params.set("budget", budget);
    if (beds !== "all") params.set("beds", beds);
    if (lifestyle !== "all") params.set("lifestyle", lifestyle);

    router.push(`/listings${params.size ? `?${params.toString()}` : ""}`);
  }

  return (
    <section id="search" className="relative z-10 -mt-12 px-5 sm:px-8 lg:px-10">
      <Card
        variant="glass"
        className="mx-auto max-w-6xl p-4 sm:p-5 lg:p-6"
        aria-label="Property search"
      >
        <form className="grid gap-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <InputField
              className="bg-public-bg/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
              label="Location or keyword"
              name="location"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Malibu, ocean view, penthouse, private estate"
              type="search"
              value={query}
            />
            <Button className="h-12 px-8 sm:min-w-40" type="submit">
              Search
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.1fr_1.1fr_0.7fr_1.2fr]">
            <SegmentedControl
              label="Property type"
              name="property_type"
              onChange={setType}
              options={typeOptions}
              value={type}
            />
            <SegmentedControl
              label="Budget"
              name="budget"
              onChange={setBudget}
              options={budgetOptions}
              value={budget}
            />
            <SegmentedControl
              label="Beds"
              name="beds"
              onChange={setBeds}
              options={bedOptions}
              value={beds}
            />
            <SegmentedControl
              label="Lifestyle"
              name="lifestyle"
              onChange={setLifestyle}
              options={lifestyleOptions}
              value={lifestyle}
            />
          </div>
        </form>
      </Card>
    </section>
  );
}
