import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { AgentsBrowser } from "@/components/dashboard/agents-browser";
import { getDashboardAgents } from "@/lib/supabase/data";

export default async function DashboardAgentsPage() {
  const agents = await getDashboardAgents();

  return (
    <DashboardShell
      title="Agents management"
      description="Agent performance, assigned inventory, and status cards for the internal SaaS experience."
    >
      <AgentsBrowser agents={agents} />
    </DashboardShell>
  );
}
