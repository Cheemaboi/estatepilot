import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { TransactionsBrowser } from "@/components/dashboard/transactions-browser";
import { getDashboardTransactions } from "@/lib/supabase/data";

export default async function DashboardTransactionsPage() {
  const transactions = await getDashboardTransactions();

  return (
    <DashboardShell
      title="Transactions"
      description="Transaction values, stages, target close dates, and deal references in a clean table shell."
    >
      <TransactionsBrowser transactions={transactions} />
    </DashboardShell>
  );
}
