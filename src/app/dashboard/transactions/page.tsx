import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DataTable } from "@/components/dashboard/data-table";
import { transactions } from "@/lib/mock-dashboard";

export default function DashboardTransactionsPage() {
  return (
    <DashboardShell
      title="Transactions"
      description="Transaction values, stages, target close dates, and deal references in a clean table shell."
    >
      <DataTable
        title="Active transactions"
        headers={["Client", "Property", "Amount", "Status", "Target close"]}
        rows={transactions.map((transaction) => [
          transaction.client,
          transaction.property,
          transaction.amount,
          transaction.status,
          transaction.close,
        ])}
      />
    </DashboardShell>
  );
}
