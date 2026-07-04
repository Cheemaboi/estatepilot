"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { StatusPill } from "@/components/dashboard/status-pill";
import { InputField } from "@/components/ui/field";

type PropertyRow = {
  agent: string;
  image?: string;
  inquiries: number;
  market: string;
  name: string;
  price: string;
  slug?: string;
  status: string;
};

type PropertiesBoardProps = {
  properties: PropertyRow[];
};

const statusFilters = ["All", "Live", "Review", "Draft", "Archived"];

function parsePriceValue(price: string) {
  const match = price.replaceAll(",", "").match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : 0;
}

function matchesQuery(property: PropertyRow, query: string) {
  if (!query) return true;

  const text = [property.name, property.market, property.agent, property.price, property.status]
    .join(" ")
    .toLowerCase();

  return query.split(/\s+/).every((term) => text.includes(term));
}

export function PropertiesBoard({ properties }: PropertiesBoardProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [market, setMarket] = useState("All");
  const [sort, setSort] = useState("inquiries");
  const [activeProperty, setActiveProperty] = useState(properties[0] ?? null);

  const markets = useMemo(
    () => ["All", ...new Set(properties.map((property) => property.market))],
    [properties],
  );

  const filteredProperties = useMemo(() => {
    return properties
      .filter((property) => {
        const matchesStatus = status === "All" || property.status === status;
        const matchesMarket = market === "All" || property.market === market;
        return matchesStatus && matchesMarket && matchesQuery(property, query.trim().toLowerCase());
      })
      .slice()
      .sort((a, b) => {
        if (sort === "price") {
          return parsePriceValue(b.price) - parsePriceValue(a.price);
        }

        if (sort === "name") {
          return a.name.localeCompare(b.name);
        }

        return b.inquiries - a.inquiries;
      });
  }, [market, properties, query, sort, status]);

  const resolvedActive =
    filteredProperties.find((property) => property.name === activeProperty?.name) ??
    filteredProperties[0] ??
    properties[0] ??
    null;

  const marketTotals = useMemo(() => {
    return filteredProperties.reduce<Record<string, number>>((acc, property) => {
      acc[property.market] = (acc[property.market] ?? 0) + 1;
      return acc;
    }, {});
  }, [filteredProperties]);

  const statusTotals = useMemo(() => {
    return filteredProperties.reduce<Record<string, number>>((acc, property) => {
      acc[property.status] = (acc[property.status] ?? 0) + 1;
      return acc;
    }, {});
  }, [filteredProperties]);

  const totalInquiries = filteredProperties.reduce(
    (sum, property) => sum + property.inquiries,
    0,
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_420px]">
      <DashboardCard className="overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-black/5 px-5 py-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-dashboard-text">Property inventory</h2>
            <p className="mt-1 text-sm text-dashboard-muted">
              Search, segment, and review listings with a live operational snapshot.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:w-full lg:max-w-3xl">
            <InputField
              label="Search properties"
              placeholder="Name, market, agent, status"
              variant="dashboard"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <SelectChip
              label="Sort"
              onChange={setSort}
              options={[
                { label: "Inquiries", value: "inquiries" },
                { label: "Price", value: "price" },
                { label: "Name", value: "name" },
              ]}
              value={sort}
            />
            <button
              className="h-12 rounded-full border border-black/8 px-4 text-sm font-semibold text-dashboard-muted transition hover:border-green-accent hover:text-deep-green"
              onClick={() => {
                setQuery("");
                setStatus("All");
                setMarket("All");
                setSort("inquiries");
              }}
              type="button"
            >
              Reset
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 border-b border-black/5 px-5 py-4">
          {statusFilters.map((filter) => {
            const isActive = filter === status;

            return (
              <button
                className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-green-accent text-white"
                    : "border border-black/8 text-dashboard-muted hover:border-green-accent hover:text-deep-green"
                }`}
                key={filter}
                onClick={() => setStatus(filter)}
                type="button"
              >
                {filter}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2 border-b border-black/5 px-5 py-4">
          {markets.map((item) => {
            const isActive = item === market;

            return (
              <button
                className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-green-accent/12 text-deep-green"
                    : "border border-black/8 text-dashboard-muted hover:border-green-accent hover:text-deep-green"
                }`}
                key={item}
                onClick={() => setMarket(item)}
                type="button"
              >
                {item}
              </button>
            );
          })}
        </div>
        <div className="grid gap-3 border-b border-black/5 px-5 py-4 sm:grid-cols-3">
          <SummaryStat label="Visible listings" value={String(filteredProperties.length)} />
          <SummaryStat label="Total inquiries" value={String(totalInquiries)} />
          <SummaryStat label="Active markets" value={String(Object.keys(marketTotals).length)} />
        </div>
        <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProperties.map((property) => {
            const isSelected = resolvedActive?.name === property.name;

            return (
              <button
                className={`overflow-hidden rounded-[24px] border text-left transition ${
                  isSelected
                    ? "border-green-accent bg-green-accent/6 shadow-[0_18px_34px_rgba(63,125,88,0.12)]"
                    : "border-black/5 bg-dashboard-bg hover:border-green-accent/35 hover:shadow-[0_18px_34px_rgba(26,39,31,0.06)]"
                }`}
                key={property.name}
                onClick={() => setActiveProperty(property)}
                type="button"
              >
                <div className="relative h-44 bg-dashboard-bg">
                  {property.image ? (
                    <Image
                      alt={property.name}
                      className="object-cover"
                      fill
                      sizes="(min-width: 1280px) 320px, (min-width: 768px) 45vw, 100vw"
                      src={property.image}
                    />
                  ) : null}
                </div>
                <div className="grid gap-3 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-dashboard-text">
                        {property.name}
                      </h3>
                      <p className="mt-1 text-sm text-dashboard-muted">
                        {property.market} | {property.agent}
                      </p>
                    </div>
                    <StatusPill status={property.status} />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-2xl font-semibold text-deep-green">{property.price}</p>
                    <p className="text-sm text-dashboard-muted">
                      {property.inquiries} inquiries
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
          {!filteredProperties.length ? (
            <div className="rounded-2xl border border-black/5 bg-white p-6 text-sm text-dashboard-muted md:col-span-2 xl:col-span-3">
              No properties match the current filters.
            </div>
          ) : null}
        </div>
      </DashboardCard>

      <div className="grid gap-6">
        <DashboardCard className="overflow-hidden">
          {resolvedActive ? (
            <div>
              <div className="relative min-h-[240px]">
                {resolvedActive.image ? (
                  <Image
                    alt={resolvedActive.name}
                    className="object-cover"
                    fill
                    sizes="420px"
                    src={resolvedActive.image}
                  />
                ) : null}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,20,15,0.08),rgba(11,20,15,0.68))]" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-luxury-accent">
                    Selected property
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold">{resolvedActive.name}</h3>
                  <p className="mt-1 text-sm text-white/72">
                    {resolvedActive.market} | {resolvedActive.agent}
                  </p>
                </div>
              </div>
              <div className="grid gap-4 p-5">
                <div className="grid grid-cols-3 gap-3">
                  <SummaryTile label="Price" value={resolvedActive.price} />
                  <SummaryTile label="Status" value={resolvedActive.status} />
                  <SummaryTile label="Inquiries" value={String(resolvedActive.inquiries)} />
                </div>
                <div className="rounded-2xl bg-dashboard-bg p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-dashboard-muted">
                    Market breakdown
                  </p>
                  <div className="mt-4 grid gap-3">
                    {Object.entries(marketTotals).map(([entryMarket, count]) => (
                      <div key={entryMarket}>
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <span className="font-semibold text-dashboard-text">{entryMarket}</span>
                          <span className="text-dashboard-muted">{count} listings</span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                          <div
                            className="h-full rounded-full bg-green-accent"
                            style={{
                              width: `${Math.max(
                                14,
                                (count / Math.max(filteredProperties.length, 1)) * 100,
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl bg-dashboard-bg p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-dashboard-muted">
                    Quick actions
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      className="rounded-full bg-green-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-deep-green"
                      href={
                        resolvedActive.slug
                          ? `/dashboard/properties/${resolvedActive.slug}`
                          : "#"
                      }
                    >
                      Open listing
                    </Link>
                    <button
                      className="rounded-full border border-black/8 px-4 py-2 text-sm font-semibold text-dashboard-muted transition hover:border-green-accent hover:text-deep-green"
                      onClick={() => setStatus("Review")}
                      type="button"
                    >
                      Move to review
                    </button>
                    <button
                      className="rounded-full border border-black/8 px-4 py-2 text-sm font-semibold text-dashboard-muted transition hover:border-green-accent hover:text-deep-green"
                      type="button"
                    >
                      Add note
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 text-sm text-dashboard-muted">
              Choose a property to inspect the split preview.
            </div>
          )}
        </DashboardCard>

        <DashboardCard className="p-5">
          <h2 className="text-lg font-semibold text-dashboard-text">Operational snapshot</h2>
          <p className="mt-1 text-sm text-dashboard-muted">
            Current approval balance across the filtered inventory.
          </p>
          <div className="mt-4 grid gap-3">
            {Object.entries(statusTotals).map(([entryStatus, count]) => (
              <div className="rounded-2xl bg-dashboard-bg p-4" key={entryStatus}>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-dashboard-text">{entryStatus}</p>
                  <p className="text-sm text-dashboard-muted">{count} listings</p>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-green-accent"
                    style={{
                      width: `${Math.max(
                        14,
                        (count / Math.max(filteredProperties.length, 1)) * 100,
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}

function SelectChip({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-dashboard-muted">
      <span>{label}</span>
      <select
        className="h-12 w-full rounded-full border border-black/10 bg-white px-4 text-sm text-dashboard-text outline-none transition focus:border-green-accent"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-dashboard-bg p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-dashboard-muted">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-dashboard-text">{value}</p>
    </div>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-dashboard-bg px-3 py-3 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-dashboard-muted">
        {label}
      </p>
      <p className="mt-1 text-base font-semibold text-dashboard-text">{value}</p>
    </div>
  );
}
