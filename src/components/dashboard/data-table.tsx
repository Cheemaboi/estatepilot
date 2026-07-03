import { DashboardCard } from "@/components/dashboard/dashboard-card";

type DataTableProps = {
  title: string;
  headers: string[];
  rows: string[][];
};

export function DataTable({ title, headers, rows }: DataTableProps) {
  return (
    <DashboardCard className="overflow-hidden">
      <div className="border-b border-black/5 px-5 py-4">
        <h2 className="text-lg font-semibold text-dashboard-text">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="bg-dashboard-bg text-xs uppercase tracking-[0.12em] text-dashboard-muted">
            <tr>
              {headers.map((header) => (
                <th className="px-5 py-3 font-semibold" key={header}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {rows.map((row) => (
              <tr className="transition hover:bg-dashboard-bg/70" key={row.join("-")}>
                {row.map((cell, index) => (
                  <td
                    className={
                      index === 0
                        ? "px-5 py-4 font-semibold text-dashboard-text"
                        : "px-5 py-4 text-dashboard-muted"
                    }
                    key={`${cell}-${index}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
}
