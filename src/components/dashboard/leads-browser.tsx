"use client";

import { useMemo, useState } from "react";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { StatusPill } from "@/components/dashboard/status-pill";
import { InputField } from "@/components/ui/field";

type LeadRow = {
  name: string;
  property: string;
  source: string;
  stage: string;
  value: string;
};

type LeadsBrowserProps = {
  leads: LeadRow[];
};

function matchesQuery(lead: LeadRow, query: string) {
  if (!query) return true;

  const text = [lead.name, lead.property, lead.source, lead.stage, lead.value]
    .join(" ")
    .toLowerCase();

  return query.split(/\s+/).every((term) => text.includes(term));
}

export function LeadsBrowser({ leads }: LeadsBrowserProps) {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("All");

  const stages = useMemo(
    () => ["All", ...new Set(leads.map((lead) => lead.stage))],
    [leads],
  );

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesStage = stage === "All" || lead.stage === stage;
      return matchesStage && matchesQuery(lead, query.trim().toLowerCase());
    });
  }, [leads, query, stage]);

  const highIntentCount = filteredLeads.filter((lead) =>
    ["Tour scheduled", "Qualified", "Negotiation"].includes(lead.stage),
  ).length;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
      <DashboardCard className="overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-black/5 px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-dashboard-text">Lead pipeline</h2>
            <p className="mt-1 text-sm text-dashboard-muted">
              Review inquiries, source mix, and stage movement at a glance.
            </p>
          </div>
          <div className="w-full sm:max-w-sm">
            <InputField
              label="Search leads"
              placeholder="Name, property, source, stage"
              variant="dashboard"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 border-b border-black/5 px-5 py-4">
          {stages.map((item) => (
            <button
              className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                item === stage
                  ? "bg-green-accent text-white"
                  : "border border-black/8 text-dashboard-muted hover:border-green-accent hover:text-deep-green"
              }`}
              key={item}
              onClick={() => setStage(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
        <div className="grid gap-3 border-t border-black/5 px-5 py-4 sm:grid-cols-3">
          <SummaryStat label="Visible leads" value={String(filteredLeads.length)} />
          <SummaryStat label="High intent" value={String(highIntentCount)} />
          <SummaryStat label="Sources" value={String(new Set(filteredLeads.map((lead) => lead.source)).size)} />
        </div>
        <div className="grid gap-3 border-t border-black/5 p-5 lg:grid-cols-2">
          {filteredLeads.map((lead) => (
            <div className="rounded-2xl bg-dashboard-bg p-4" key={lead.name}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-dashboard-text">{lead.name}</h3>
                  <p className="mt-1 text-sm text-dashboard-muted">{lead.property}</p>
                </div>
                <StatusPill status={lead.stage} />
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <SummaryMetric label="Source" value={lead.source} />
                <SummaryMetric label="Budget" value={lead.value} />
              </div>
            </div>
          ))}
          {!filteredLeads.length ? (
            <div className="rounded-2xl border border-black/5 bg-white p-5 text-sm text-dashboard-muted lg:col-span-2">
              No leads match the current filters.
            </div>
          ) : null}
        </div>
      </DashboardCard>

      <DashboardCard className="p-5">
        <h2 className="text-lg font-semibold text-dashboard-text">Follow-up focus</h2>
        <p className="mt-1 text-sm text-dashboard-muted">
          Quick read on where the team should spend time next.
        </p>
        <div className="mt-5 grid gap-3">
          {filteredLeads.slice(0, 4).map((lead, index) => (
            <div className="rounded-2xl bg-dashboard-bg p-4" key={`${lead.name}-${index}`}>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-dashboard-muted">
                {lead.stage}
              </p>
              <p className="mt-2 font-semibold text-dashboard-text">{lead.name}</p>
              <p className="mt-1 text-sm text-dashboard-muted">{lead.property}</p>
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

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white px-3 py-3 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-dashboard-muted">
        {label}
      </p>
      <p className="mt-1 text-base font-semibold text-dashboard-text">{value}</p>
    </div>
  );
}
