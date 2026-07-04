"use client";

import { useMemo, useState } from "react";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { StatusPill } from "@/components/dashboard/status-pill";
import { InputField } from "@/components/ui/field";

type PropertyRow = {
  name: string;
  market: string;
  agent: string;
  price: string;
  status: string;
  inquiries: number;
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
  const [activeProperty, setActiveProperty] = useState(properties[0] ?? null);

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesStatus = status === "All" || property.status === status;
      return matchesStatus && matchesQuery(property, query.trim().toLowerCase());
    });
  }, [properties, query, status]);

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

  const selectedPrice = resolvedActive ? parsePriceValue(resolvedActive.price) : 0;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.75fr)]">
      <DashboardCard className="overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-black/5 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-dashboard-text">Property list</h2>
            <p className="mt-1 text-sm text-dashboard-muted">
              Search and filter the active inventory.
            </p>
          </div>
          <div className="w-full md:max-w-sm">
            <InputField
              label="Search properties"
              placeholder="Name, market, agent, status"
              variant="dashboard"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
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
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className="bg-dashboard-bg text-xs uppercase tracking-[0.12em] text-dashboard-muted">
              <tr>
                {["Property", "Market", "Agent", "Price", "Status", "Inquiries"].map((header) => (
                  <th className="px-5 py-3 font-semibold" key={header}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredProperties.map((property) => {
                const isSelected = resolvedActive?.name === property.name;

                return (
                  <tr
                    className={`cursor-pointer transition ${isSelected ? "bg-green-accent/6" : "hover:bg-dashboard-bg/70"}`}
                    key={property.name}
                    onClick={() => setActiveProperty(property)}
                  >
                    <td className="px-5 py-4 font-semibold text-dashboard-text">
                      {property.name}
                    </td>
                    <td className="px-5 py-4 text-dashboard-muted">{property.market}</td>
                    <td className="px-5 py-4 text-dashboard-muted">{property.agent}</td>
                    <td className="px-5 py-4 text-dashboard-muted">{property.price}</td>
                    <td className="px-5 py-4">
                      <StatusPill status={property.status} />
                    </td>
                    <td className="px-5 py-4 text-dashboard-muted">{property.inquiries}</td>
                  </tr>
                );
              })}
              {!filteredProperties.length ? (
                <tr>
                  <td className="px-5 py-8 text-sm text-dashboard-muted" colSpan={6}>
                    No properties match the current filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </DashboardCard>

      <div className="grid gap-6">
        <DashboardCard className="overflow-hidden p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-dashboard-text">Map split preview</h2>
              <p className="mt-1 text-sm text-dashboard-muted">
                Selected properties and market focus stay in sync.
              </p>
            </div>
            <span className="rounded-full bg-green-accent/12 px-3 py-1 text-xs font-semibold text-deep-green">
              {filteredProperties.length} visible
            </span>
          </div>
          <div className="mt-5 grid min-h-[360px] overflow-hidden rounded-[24px] border border-black/5 bg-[radial-gradient(circle_at_28%_20%,rgba(63,125,88,0.18),transparent_26%),linear-gradient(145deg,#eef4ee,#ffffff)]">
            <div className="relative grid gap-4 p-5">
              <div className="flex flex-wrap gap-2">
                {Object.entries(marketTotals).map(([market, count]) => (
                  <button
                    className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                      resolvedActive?.market === market
                        ? "border-green-accent bg-green-accent text-white"
                        : "border-black/8 bg-white text-dashboard-text hover:border-green-accent hover:text-deep-green"
                    }`}
                    key={market}
                    type="button"
                    onClick={() => {
                      const next = filteredProperties.find((property) => property.market === market);
                      if (next) setActiveProperty(next);
                    }}
                  >
                    {market} {count}
                  </button>
                ))}
              </div>
              {resolvedActive ? (
                <div className="absolute inset-x-5 bottom-5 rounded-[24px] border border-black/5 bg-white/95 p-4 shadow-[0_16px_38px_rgba(26,39,31,0.08)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-green-accent">
                        Selected property
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-dashboard-text">
                        {resolvedActive.name}
                      </h3>
                      <p className="mt-1 text-sm text-dashboard-muted">
                        {resolvedActive.market} · {resolvedActive.agent}
                      </p>
                    </div>
                    <p className="text-2xl font-semibold text-deep-green">
                      {resolvedActive.price}
                    </p>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-dashboard-bg px-3 py-3 text-center">
                      <p className="text-[11px] uppercase tracking-[0.14em] text-dashboard-muted">
                        Inquiries
                      </p>
                      <p className="mt-1 text-lg font-semibold text-dashboard-text">
                        {resolvedActive.inquiries}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-dashboard-bg px-3 py-3 text-center">
                      <p className="text-[11px] uppercase tracking-[0.14em] text-dashboard-muted">
                        Status
                      </p>
                      <p className="mt-1 text-lg font-semibold text-dashboard-text">
                        {resolvedActive.status}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-dashboard-bg px-3 py-3 text-center">
                      <p className="text-[11px] uppercase tracking-[0.14em] text-dashboard-muted">
                        Value
                      </p>
                      <p className="mt-1 text-lg font-semibold text-dashboard-text">
                        {selectedPrice >= 7 ? "Premium" : "Active"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-x-5 bottom-5 rounded-[24px] border border-black/5 bg-white/95 p-4 text-sm text-dashboard-muted shadow-[0_16px_38px_rgba(26,39,31,0.08)]">
                  Choose a property to inspect the split preview.
                </div>
              )}
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
