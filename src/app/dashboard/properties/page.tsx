import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatusPill } from "@/components/dashboard/status-pill";
import { getDashboardProperties } from "@/lib/supabase/data";

export default async function DashboardPropertiesPage() {
  const properties = await getDashboardProperties();

  return (
    <DashboardShell
      title="Properties management"
      description="Static management shell with filters, status, table patterns, and a map/list split ready for real listing data."
    >
      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <DashboardCard className="overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-black/5 px-5 py-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-semibold text-dashboard-text">
              Property list
            </h2>
            <div className="flex flex-wrap gap-2">
              {["All", "Live", "Review", "Draft"].map((filter) => (
                <button
                  className="rounded-full border border-black/8 px-3 py-2 text-sm font-semibold text-dashboard-muted transition hover:border-green-accent hover:text-deep-green"
                  key={filter}
                  type="button"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-dashboard-bg text-xs uppercase tracking-[0.12em] text-dashboard-muted">
                <tr>
                  {["Property", "Market", "Agent", "Price", "Status", "Inquiries"].map(
                    (header) => (
                      <th className="px-5 py-3 font-semibold" key={header}>
                        {header}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {properties.map((property) => (
                  <tr className="transition hover:bg-dashboard-bg/70" key={property.name}>
                    <td className="px-5 py-4 font-semibold text-dashboard-text">
                      {property.name}
                    </td>
                    <td className="px-5 py-4 text-dashboard-muted">{property.market}</td>
                    <td className="px-5 py-4 text-dashboard-muted">{property.agent}</td>
                    <td className="px-5 py-4 text-dashboard-muted">{property.price}</td>
                    <td className="px-5 py-4">
                      <StatusPill status={property.status} />
                    </td>
                    <td className="px-5 py-4 text-dashboard-muted">
                      {property.inquiries}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>
        <DashboardCard className="p-5">
          <h2 className="text-lg font-semibold text-dashboard-text">
            Map split preview
          </h2>
          <p className="mt-2 text-sm leading-6 text-dashboard-muted">
            Placeholder for map provider integration in a later phase.
          </p>
          <div className="mt-5 grid min-h-[520px] content-between rounded-2xl bg-[radial-gradient(circle_at_30%_20%,rgba(63,125,88,0.28),transparent_26%),linear-gradient(145deg,#edf4ed,#ffffff)] p-5">
            {properties.map((property) => (
              <div
                className="rounded-2xl bg-white p-4 shadow-sm"
                key={property.name}
              >
                <p className="font-semibold text-dashboard-text">{property.market}</p>
                <p className="mt-1 text-sm text-dashboard-muted">{property.name}</p>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </DashboardShell>
  );
}
