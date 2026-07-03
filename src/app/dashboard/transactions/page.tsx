import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DataTable } from "@/components/dashboard/data-table";
import { getDashboardTransactions } from "@/lib/supabase/data";

export default async function DashboardTransactionsPage() {
  const transactions = await getDashboardTransactions();

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
