"use client";

import { useMemo, useState } from "react";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { InputField } from "@/components/ui/field";
import type { AdminActivity } from "@/lib/supabase/data";

type ActivityBrowserProps = {
  items: AdminActivity[];
};

const entityFilters = ["All", "workspace", "property"];
const actionFilters = [
  "All",
  "settings saved",
  "status updated",
  "review requested",
  "listing published live",
  "listing archived",
  "draft restored",
  "appointment scheduled",
  "media uploaded",
  "media deleted",
];

function matchesQuery(item: AdminActivity, query: string) {
  if (!query) return true;

  const text = [item.action, item.entityType, item.summary, item.entitySlug ?? ""]
    .join(" ")
    .toLowerCase();

  return query.split(/\s+/).every((term) => text.includes(term));
}

export function ActivityBrowser({ items }: ActivityBrowserProps) {
  const [query, setQuery] = useState("");
  const [entityType, setEntityType] = useState("All");
  const [action, setAction] = useState("All");

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesEntity = entityType === "All" || item.entityType === entityType;
      const matchesAction = action === "All" || item.action === action;
      return matchesEntity && matchesAction && matchesQuery(item, query.trim().toLowerCase());
    });
  }, [action, entityType, items, query]);

  const activityCount = filteredItems.length;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
      <DashboardCard className="overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-black/5 px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-dashboard-text">Audit history</h2>
            <p className="mt-1 text-sm text-dashboard-muted">
              Track settings, property, and media actions across the admin surface.
            </p>
          </div>
          <div className="w-full sm:max-w-sm">
            <InputField
              label="Search activity"
              placeholder="Search summary, slug, or action"
              variant="dashboard"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-black/5 px-5 py-4">
          {entityFilters.map((filter) => {
            const isActive = filter === entityType;

            return (
              <button
                className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-green-accent text-white"
                    : "border border-black/8 text-dashboard-muted hover:border-green-accent hover:text-deep-green"
                }`}
                key={filter}
                onClick={() => setEntityType(filter)}
                type="button"
              >
                {filter}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2 border-b border-black/5 px-5 py-4">
          {actionFilters.map((filter) => {
            const isActive = filter === action;

            return (
              <button
                className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-green-accent/12 text-deep-green"
                    : "border border-black/8 text-dashboard-muted hover:border-green-accent hover:text-deep-green"
                }`}
                key={filter}
                onClick={() => setAction(filter)}
                type="button"
              >
                {filter}
              </button>
            );
          })}
        </div>

        <div className="grid gap-3 border-b border-black/5 px-5 py-4 sm:grid-cols-3">
          <SummaryStat label="Visible events" value={String(activityCount)} />
          <SummaryStat label="Property events" value={String(filteredItems.filter((item) => item.entityType === "property").length)} />
          <SummaryStat label="Workspace events" value={String(filteredItems.filter((item) => item.entityType === "workspace").length)} />
        </div>

        <div className="grid gap-4 p-5">
          {filteredItems.map((item) => (
            <div className="rounded-2xl bg-dashboard-bg p-4" key={`${item.entityType}-${item.action}-${item.createdAt}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-dashboard-muted">
                    {item.entityType}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-dashboard-text">{item.action}</h3>
                  <p className="mt-1 text-sm text-dashboard-muted">{item.summary}</p>
                </div>
                <p className="text-xs uppercase tracking-[0.12em] text-dashboard-muted">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em]">
                {item.entitySlug ? (
                  <span className="rounded-full bg-white px-3 py-1 text-dashboard-text">
                    {item.entitySlug}
                  </span>
                ) : null}
                <span className="rounded-full bg-green-accent/12 px-3 py-1 text-deep-green">
                  {item.entityType}
                </span>
              </div>
            </div>
          ))}
          {!filteredItems.length ? (
            <div className="rounded-2xl border border-black/5 bg-white p-5 text-sm text-dashboard-muted">
              No activity matches the current filters.
            </div>
          ) : null}
        </div>
      </DashboardCard>

      <DashboardCard className="p-5">
        <h2 className="text-lg font-semibold text-dashboard-text">Activity breakdown</h2>
        <p className="mt-1 text-sm text-dashboard-muted">
          Quick read on the current audit mix.
        </p>
        <div className="mt-5 grid gap-3">
          {[
            { label: "Settings", value: filteredItems.filter((item) => item.action === "settings saved").length },
            { label: "Status changes", value: filteredItems.filter((item) => item.action === "status updated").length },
            { label: "Workflow updates", value: filteredItems.filter((item) => ["review requested", "listing published live", "listing archived", "draft restored"].includes(item.action)).length },
            { label: "Appointments", value: filteredItems.filter((item) => item.action === "appointment scheduled").length },
            { label: "Uploads", value: filteredItems.filter((item) => item.action === "media uploaded").length },
            { label: "Deletes", value: filteredItems.filter((item) => item.action === "media deleted").length },
          ].map((item) => (
            <div className="rounded-2xl bg-dashboard-bg px-4 py-3" key={item.label}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-dashboard-muted">
                {item.label}
              </p>
              <p className="mt-1 text-lg font-semibold text-dashboard-text">{item.value}</p>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
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
