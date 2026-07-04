import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ActivityBrowser } from "@/components/dashboard/activity-browser";
import { getAdminActivityLog } from "@/lib/supabase/data";

export default async function DashboardActivityPage() {
  const activity = await getAdminActivityLog();

  return (
    <DashboardShell
      title="Audit history"
      description="A searchable trail of workspace, property, and media actions."
    >
      <ActivityBrowser items={activity} />
    </DashboardShell>
  );
}
