import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { StatusPill } from "@/components/dashboard/status-pill";
import {
  activity,
  appointments,
  dashboardProperties,
  leads,
} from "@/lib/mock-dashboard";

export function RevenueChartPlaceholder() {
  const bars = ["42%", "58%", "51%", "74%", "66%", "82%", "70%"];

  return (
    <DashboardCard className="p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-dashboard-text">
            Revenue activity
          </h2>
          <p className="mt-1 text-sm text-dashboard-muted">
            Placeholder chart for later analytics integration.
          </p>
        </div>
        <span className="rounded-full bg-green-accent/12 px-3 py-1 text-xs font-semibold text-deep-green">
          +18%
        </span>
      </div>
      <div className="mt-8 flex h-56 items-end gap-3">
        {bars.map((height, index) => (
          <div
            className="flex flex-1 items-end rounded-t-2xl bg-green-accent/12"
            key={`${height}-${index}`}
          >
            <div
              className="w-full rounded-t-2xl bg-green-accent"
              style={{ height }}
            />
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}

export function RecentListingsWidget() {
  return (
    <DashboardCard className="p-5">
      <h2 className="text-lg font-semibold text-dashboard-text">
        Recent listings
      </h2>
      <div className="mt-4 grid gap-3">
        {dashboardProperties.slice(0, 3).map((property) => (
          <div
            className="flex items-center justify-between gap-4 rounded-2xl bg-dashboard-bg p-4"
            key={property.name}
          >
            <div>
              <p className="font-semibold text-dashboard-text">{property.name}</p>
              <p className="mt-1 text-sm text-dashboard-muted">
                {property.market} · {property.agent}
              </p>
            </div>
            <StatusPill status={property.status} />
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}

export function LeadSnippetsWidget() {
  return (
    <DashboardCard className="p-5">
      <h2 className="text-lg font-semibold text-dashboard-text">Lead snippets</h2>
      <div className="mt-4 grid gap-3">
        {leads.slice(0, 3).map((lead) => (
          <div className="rounded-2xl border border-black/5 p-4" key={lead.name}>
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-dashboard-text">{lead.name}</p>
              <StatusPill status={lead.stage} />
            </div>
            <p className="mt-2 text-sm text-dashboard-muted">{lead.property}</p>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}

export function RegionInsightPanel() {
  return (
    <DashboardCard className="p-5">
      <h2 className="text-lg font-semibold text-dashboard-text">Region insight</h2>
      <div className="mt-5 rounded-2xl bg-[radial-gradient(circle_at_35%_20%,rgba(63,125,88,0.32),transparent_26%),linear-gradient(145deg,#eef4ee,#ffffff)] p-5">
        <p className="text-3xl font-semibold text-deep-green">4 priority markets</p>
        <p className="mt-2 text-sm leading-6 text-dashboard-muted">
          Static map/list panel for the future location intelligence workflow.
        </p>
        <div className="mt-6 grid gap-2">
          {["Malibu", "Austin", "New York", "Miami"].map((market) => (
            <span
              className="rounded-full bg-white px-3 py-2 text-sm font-medium text-dashboard-text shadow-sm"
              key={market}
            >
              {market}
            </span>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
}

export function ActivityFeed() {
  return (
    <DashboardCard className="p-5">
      <h2 className="text-lg font-semibold text-dashboard-text">Activity</h2>
      <div className="mt-4 grid gap-3">
        {activity.map((item) => (
          <div className="rounded-2xl bg-dashboard-bg p-4 text-sm text-dashboard-muted" key={item}>
            {item}
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}

export function AppointmentTimeline() {
  return (
    <DashboardCard className="p-5">
      <h2 className="text-lg font-semibold text-dashboard-text">Today</h2>
      <div className="mt-4 grid gap-3">
        {appointments.map((appointment) => (
          <div className="grid grid-cols-[64px_minmax(0,1fr)] gap-3" key={appointment.time}>
            <p className="text-sm font-semibold text-green-accent">
              {appointment.time}
            </p>
            <div className="rounded-2xl border border-black/5 p-4">
              <p className="font-semibold text-dashboard-text">
                {appointment.title}
              </p>
              <p className="mt-1 text-sm text-dashboard-muted">
                {appointment.property} · {appointment.contact}
              </p>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
