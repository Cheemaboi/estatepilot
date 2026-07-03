import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatusPill } from "@/components/dashboard/status-pill";
import { getDashboardAgents } from "@/lib/supabase/data";

export default async function DashboardAgentsPage() {
  const agents = await getDashboardAgents();

  return (
    <DashboardShell
      title="Agents management"
      description="Agent performance, assigned inventory, and status cards for the internal SaaS experience."
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {agents.map((agent) => (
          <DashboardCard className="p-5" key={agent.name}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-dashboard-text">
                  {agent.name}
                </h2>
                <p className="mt-1 text-sm text-dashboard-muted">{agent.market}</p>
              </div>
              <StatusPill status={agent.status} />
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-black/5 pt-5">
              <div>
                <dt className="text-xs font-medium uppercase tracking-[0.12em] text-dashboard-muted">
                  Listings
                </dt>
                <dd className="mt-2 text-2xl font-semibold text-dashboard-text">
                  {agent.listings}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-[0.12em] text-dashboard-muted">
                  Pipeline
                </dt>
                <dd className="mt-2 text-2xl font-semibold text-dashboard-text">
                  {agent.pipeline}
                </dd>
              </div>
            </dl>
          </DashboardCard>
        ))}
      </div>
    </DashboardShell>
  );
}
