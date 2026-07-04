import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  SettingsConsole,
  type ApprovalItem,
  type Capability,
} from "@/components/dashboard/settings-console";
import { dashboardProperties } from "@/lib/mock-dashboard";
import { hasEmailEnv } from "@/lib/email";
import { hasMapboxToken } from "@/lib/mapbox";
import { hasOpenRouterEnv } from "@/lib/openrouter";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import {
  getDashboardProperties,
  getAdminActivityLog,
  getWorkspaceSettings,
} from "@/lib/supabase/data";

export default async function DashboardSettingsPage() {
  const [properties, settings, activity] = await Promise.all([
    getDashboardProperties(),
    getWorkspaceSettings(),
    getAdminActivityLog(),
  ]);

  const approvals: ApprovalItem[] = properties
    .filter((property) => property.status !== "Live")
    .slice(0, 4)
    .map((property, index) => ({
      agent: property.agent,
      market: property.market,
      notes:
        index === 0
          ? "Check copy, photos, and pricing alignment before publishing."
          : index === 1
            ? "Review staging notes and media order for the incoming gallery."
            : "Confirm listing details and routing before marking live.",
      property: property.name,
      slug: property.slug ?? property.name.toLowerCase().replaceAll(" ", "-"),
      status: (property.status === "Review" ? "Needs changes" : "Pending") as
        | "Pending"
        | "Needs changes",
    }));
  const fallbackApprovals: ApprovalItem[] = dashboardProperties.slice(0, 3).map((property) => ({
    agent: property.agent,
    market: property.market,
    notes: "Confirm copy, imagery, and publishing readiness before going live.",
    property: property.name,
    slug: property.slug ?? property.name.toLowerCase().replaceAll(" ", "-"),
    status: "Pending",
  }));
  const capabilityCards: Capability[] = [
    {
      available: hasSupabaseEnv(),
      description: "Auth, saved state, dashboard data, and persistence hooks.",
      label: "Supabase",
    },
    {
      available: hasMapboxToken(),
      description: "Interactive market maps and location-aware listing previews.",
      label: "Mapbox",
    },
    {
      available: hasOpenRouterEnv(),
      description: "Natural-language matching and property assistant responses.",
      label: "OpenRouter",
    },
    {
      available: hasEmailEnv(),
      description: "Inquiry notifications and tour request delivery.",
      label: "Email delivery",
    },
  ];

  return (
    <DashboardShell
      title="Settings"
      description="Workspace defaults, approval queue, and integration readiness in one admin control surface."
    >
      <SettingsConsole
        approvals={approvals.length ? approvals : fallbackApprovals}
        capabilities={capabilityCards}
        initialSettings={settings}
        activity={activity}
      />
    </DashboardShell>
  );
}
