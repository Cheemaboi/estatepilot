import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { StatusPill } from "@/components/dashboard/status-pill";
import { dashboardProperties, leads } from "@/lib/mock-dashboard";

type ListingItem = typeof dashboardProperties[number];
type LeadItem = typeof leads[number];

type TransactionItem = {
  amount: string;
  client: string;
  close: string;
  property: string;
  status: string;
};

type AppointmentItem = {
  contact: string;
  property: string;
  time: string;
  title: string;
};

function parseMillions(value: string) {
  const match = value.replaceAll(",", "").match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : 0;
}

function formatMillions(value: number) {
  return `$${value.toFixed(1)}M`;
}

export function RevenueActivityCard({ items }: { items: TransactionItem[] }) {
  const values = items.map((item) => ({
    ...item,
    numericAmount: parseMillions(item.amount),
  }));
  const total = values.reduce((sum, item) => sum + item.numericAmount, 0);
  const average = values.length ? total / values.length : 0;
  const maxAmount = Math.max(...values.map((item) => item.numericAmount), 1);

  return (
    <DashboardCard className="p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-dashboard-text">
            Revenue activity
          </h2>
          <p className="mt-1 text-sm text-dashboard-muted">
            Live deal values and upcoming close dates from the current pipeline.
          </p>
        </div>
        <span className="rounded-full bg-green-accent/12 px-3 py-1 text-xs font-semibold text-deep-green">
          {items.length} deals
        </span>
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_220px]">
        <div>
          <p className="text-4xl font-semibold text-deep-green">
            {formatMillions(total)}
          </p>
          <p className="mt-2 text-sm text-dashboard-muted">
            Average ticket {formatMillions(average)} across the current pipeline.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {values.map((item) => {
              const height = `${Math.max(28, (item.numericAmount / maxAmount) * 100)}%`;

              return (
                <div
                  className="rounded-2xl border border-black/5 bg-dashboard-bg px-3 py-3"
                  key={`${item.client}-${item.property}`}
                >
                  <div className="flex h-28 items-end">
                    <div
                      className="w-full rounded-t-2xl bg-green-accent"
                      style={{ height }}
                    />
                  </div>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-dashboard-muted">
                    {item.status}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-dashboard-text">
                    {item.amount}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="rounded-2xl border border-black/5 bg-dashboard-bg p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-green-accent">
            Next closes
          </p>
          <div className="mt-4 grid gap-3">
            {items.map((item) => (
              <div className="rounded-2xl bg-white px-4 py-3 shadow-sm" key={item.client}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-dashboard-text">{item.client}</p>
                    <p className="mt-1 text-sm text-dashboard-muted">{item.property}</p>
                  </div>
                  <p className="text-sm font-semibold text-deep-green">{item.amount}</p>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 text-xs text-dashboard-muted">
                  <span>{item.close}</span>
                  <StatusPill status={item.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}

export function MarketPulsePanel({ items }: { items: ListingItem[] }) {
  const marketCounts = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.market] = (acc[item.market] ?? 0) + 1;
    return acc;
  }, {});
  const statusCounts = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.status] = (acc[item.status] ?? 0) + 1;
    return acc;
  }, {});
  const topMarket = Object.entries(marketCounts).sort((a, b) => b[1] - a[1])[0];
  const maxCount = Math.max(...Object.values(marketCounts), 1);

  return (
    <DashboardCard className="p-5">
      <h2 className="text-lg font-semibold text-dashboard-text">Market pulse</h2>
      <p className="mt-1 text-sm text-dashboard-muted">
        Inventory concentration and approval mix across the current listing base.
      </p>
      <div className="mt-5 rounded-2xl border border-black/5 bg-[radial-gradient(circle_at_35%_20%,rgba(63,125,88,0.22),transparent_26%),linear-gradient(145deg,#f0f5ef,#ffffff)] p-5">
        <p className="text-3xl font-semibold text-deep-green">
          {topMarket ? topMarket[0] : "No market data"}
        </p>
        <p className="mt-2 text-sm text-dashboard-muted">
          {topMarket ? `${topMarket[1]} active listings are concentrated here.` : "Add listings to build the market pulse."}
        </p>
        <div className="mt-6 grid gap-3">
          {Object.entries(marketCounts).map(([market, count]) => (
            <div className="grid gap-2" key={market}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-semibold text-dashboard-text">{market}</span>
                <span className="text-dashboard-muted">{count} listings</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white">
                <div
                  className="h-full rounded-full bg-green-accent"
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { label: "Live", value: statusCounts.Live ?? 0 },
            { label: "Review", value: statusCounts.Review ?? 0 },
            { label: "Draft", value: statusCounts.Draft ?? 0 },
          ].map((item) => (
            <div className="rounded-2xl bg-white px-3 py-3 text-center shadow-sm" key={item.label}>
              <p className="text-[11px] uppercase tracking-[0.14em] text-dashboard-muted">
                {item.label}
              </p>
              <p className="mt-1 text-lg font-semibold text-dashboard-text">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
}

export function RecentListingsWidget({
  items = dashboardProperties.slice(0, 3),
}: {
  items?: ListingItem[];
}) {
  return (
    <DashboardCard className="p-5">
      <h2 className="text-lg font-semibold text-dashboard-text">
        Recent listings
      </h2>
      <div className="mt-4 grid gap-3">
        {items.map((property) => (
          <div
            className="flex items-center justify-between gap-4 rounded-2xl bg-dashboard-bg p-4"
            key={property.name}
          >
            <div>
              <p className="font-semibold text-dashboard-text">{property.name}</p>
              <p className="mt-1 text-sm text-dashboard-muted">
                {property.market} | {property.agent}
              </p>
            </div>
            <StatusPill status={property.status} />
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}

export function LeadSnippetsWidget({
  items = leads.slice(0, 3),
}: {
  items?: LeadItem[];
}) {
  return (
    <DashboardCard className="p-5">
      <h2 className="text-lg font-semibold text-dashboard-text">Lead snippets</h2>
      <div className="mt-4 grid gap-3">
        {items.map((lead) => (
          <div className="rounded-2xl border border-black/5 p-4" key={lead.name}>
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-dashboard-text">{lead.name}</p>
              <StatusPill status={lead.stage} />
            </div>
            <p className="mt-2 text-sm text-dashboard-muted">{lead.property}</p>
            <p className="mt-1 text-sm text-dashboard-muted">
              {lead.source} | {lead.value}
            </p>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}

export function ActivityFeed({ items }: { items: string[] }) {
  return (
    <DashboardCard className="p-5">
      <h2 className="text-lg font-semibold text-dashboard-text">Activity</h2>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <div
            className="rounded-2xl bg-dashboard-bg p-4 text-sm text-dashboard-muted"
            key={item}
          >
            {item}
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}

export function AppointmentTimeline({ items }: { items: AppointmentItem[] }) {
  return (
    <DashboardCard className="p-5">
      <h2 className="text-lg font-semibold text-dashboard-text">Today</h2>
      <div className="mt-4 grid gap-3">
        {items.map((appointment) => (
          <div
            className="grid grid-cols-[64px_minmax(0,1fr)] gap-3"
            key={`${appointment.time}-${appointment.title}`}
          >
            <p className="text-sm font-semibold text-green-accent">
              {appointment.time}
            </p>
            <div className="rounded-2xl border border-black/5 p-4">
              <p className="font-semibold text-dashboard-text">
                {appointment.title}
              </p>
              <p className="mt-1 text-sm text-dashboard-muted">
                {appointment.property} | {appointment.contact}
              </p>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
