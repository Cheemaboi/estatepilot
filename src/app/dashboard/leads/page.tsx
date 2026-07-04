import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { LeadsBrowser } from "@/components/dashboard/leads-browser";
import { getDashboardLeads } from "@/lib/supabase/data";

export default async function DashboardLeadsPage() {
  const leads = await getDashboardLeads();

  return (
    <DashboardShell
      title="Leads and CRM"
      description="Lead stage cards for inquiry tracking, source attribution, and agent follow-up planning."
    >
      <LeadsBrowser leads={leads} />
    </DashboardShell>
  );
}
