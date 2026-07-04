import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { PropertiesBoard } from "@/components/dashboard/properties-board";
import { getDashboardProperties } from "@/lib/supabase/data";

export default async function DashboardPropertiesPage() {
  const properties = await getDashboardProperties();

  return (
    <DashboardShell
      title="Properties management"
      description="Filterable inventory board with a split preview for the active property and market view."
    >
      <PropertiesBoard properties={properties} />
    </DashboardShell>
  );
}
