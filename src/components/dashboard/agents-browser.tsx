"use client";

import { useMemo, useState } from "react";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { StatusPill } from "@/components/dashboard/status-pill";
import { InputField } from "@/components/ui/field";

type AgentRow = {
  listings: number;
  market: string;
  name: string;
  pipeline: string;
  status: string;
};

type AgentsBrowserProps = {
  agents: AgentRow[];
};

function matchesQuery(agent: AgentRow, query: string) {
  if (!query) return true;

  const text = [agent.name, agent.market, agent.status, agent.pipeline]
    .join(" ")
    .toLowerCase();

  return query.split(/\s+/).every((term) => text.includes(term));
}

export function AgentsBrowser({ agents }: AgentsBrowserProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [activeMarket, setActiveMarket] = useState("All");

  const markets = useMemo(
    () => ["All", ...new Set(agents.map((agent) => agent.market))],
    [agents],
  );
  const statuses = ["All", "Active", "Onboarding"];

  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const matchesStatus = status === "All" || agent.status === status;
      const matchesMarket = activeMarket === "All" || agent.market === activeMarket;
      return matchesStatus && matchesMarket && matchesQuery(agent, query.trim().toLowerCase());
    });
  }, [activeMarket, agents, query, status]);

  const totalListings = filteredAgents.reduce((sum, agent) => sum + agent.listings, 0);
  const pipelineTotal = filteredAgents.reduce((sum, agent) => {
    const value = Number(agent.pipeline.replaceAll(/[^0-9.]/g, ""));
    return sum + (Number.isFinite(value) ? value : 0);
  }, 0);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <DashboardCard className="overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-black/5 px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-dashboard-text">Agent roster</h2>
            <p className="mt-1 text-sm text-dashboard-muted">
              Search the team, inspect market coverage, and compare pipeline value.
            </p>
          </div>
          <div className="w-full sm:max-w-sm">
            <InputField
              label="Search agents"
              placeholder="Name, market, status"
              variant="dashboard"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 border-b border-black/5 px-5 py-4">
          {statuses.map((item) => (
            <button
              className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                item === status
                  ? "bg-green-accent text-white"
                  : "border border-black/8 text-dashboard-muted hover:border-green-accent hover:text-deep-green"
              }`}
              key={item}
              onClick={() => setStatus(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 px-5 py-4">
          {markets.map((market) => (
            <button
              className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                market === activeMarket
                  ? "bg-green-accent/12 text-deep-green"
                  : "border border-black/8 text-dashboard-muted hover:border-green-accent hover:text-deep-green"
              }`}
              key={market}
              onClick={() => setActiveMarket(market)}
              type="button"
            >
              {market}
            </button>
          ))}
        </div>
        <div className="grid gap-3 border-t border-black/5 px-5 py-4 sm:grid-cols-3">
          <SummaryStat label="Visible agents" value={String(filteredAgents.length)} />
          <SummaryStat label="Listings" value={String(totalListings)} />
          <SummaryStat label="Pipeline" value={`$${pipelineTotal.toFixed(1)}M`} />
        </div>
        <div className="grid gap-3 border-t border-black/5 p-5 md:grid-cols-2">
          {filteredAgents.map((agent) => (
            <div className="rounded-2xl bg-dashboard-bg p-4" key={agent.name}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-dashboard-text">{agent.name}</h3>
                  <p className="mt-1 text-sm text-dashboard-muted">{agent.market}</p>
                </div>
                <StatusPill status={agent.status} />
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-3">
                <SummaryMetric label="Listings" value={String(agent.listings)} />
                <SummaryMetric label="Pipeline" value={agent.pipeline} />
              </dl>
            </div>
          ))}
          {!filteredAgents.length ? (
            <div className="rounded-2xl border border-black/5 bg-white p-5 text-sm text-dashboard-muted md:col-span-2">
              No agents match the current filters.
            </div>
          ) : null}
        </div>
      </DashboardCard>

      <DashboardCard className="p-5">
        <h2 className="text-lg font-semibold text-dashboard-text">Coverage</h2>
        <p className="mt-1 text-sm text-dashboard-muted">
          Market distribution for the currently visible roster.
        </p>
        <div className="mt-5 grid gap-3">
          {markets
            .filter((market) => market !== "All")
            .map((market) => {
              const marketAgents = filteredAgents.filter((agent) => agent.market === market);
              return (
                <div className="rounded-2xl bg-dashboard-bg p-4" key={market}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-dashboard-text">{market}</p>
                    <p className="text-sm text-dashboard-muted">{marketAgents.length} agents</p>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-green-accent"
                      style={{ width: `${Math.max(12, (marketAgents.length / Math.max(filteredAgents.length, 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
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
      <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-dashboard-muted">
        {label}
      </dt>
      <dd className="mt-1 text-base font-semibold text-dashboard-text">{value}</dd>
    </div>
  );
}
