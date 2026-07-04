"use client";

import { useMemo, useState } from "react";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { InputField } from "@/components/ui/field";

type TransactionRow = {
  amount: string;
  client: string;
  close: string;
  property: string;
  status: string;
};

type TransactionsBrowserProps = {
  transactions: TransactionRow[];
};

function matchesQuery(transaction: TransactionRow, query: string) {
  if (!query) return true;

  const text = [
    transaction.client,
    transaction.property,
    transaction.amount,
    transaction.status,
    transaction.close,
  ]
    .join(" ")
    .toLowerCase();

  return query.split(/\s+/).every((term) => text.includes(term));
}

function parseMillions(value: string) {
  const match = value.replaceAll(",", "").match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : 0;
}

export function TransactionsBrowser({ transactions }: TransactionsBrowserProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");

  const statuses = useMemo(
    () => ["All", ...new Set(transactions.map((transaction) => transaction.status))],
    [transactions],
  );

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesStatus = status === "All" || transaction.status === status;
      return matchesStatus && matchesQuery(transaction, query.trim().toLowerCase());
    });
  }, [query, status, transactions]);

  const totalValue = filteredTransactions.reduce(
    (sum, transaction) => sum + parseMillions(transaction.amount),
    0,
  );
  const nextClose = filteredTransactions[0]?.close ?? "TBD";

  return (
    <DashboardCard className="overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-black/5 px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-dashboard-text">Active transactions</h2>
          <p className="mt-1 text-sm text-dashboard-muted">
            Filter deal flow, review amounts, and track the next close date.
          </p>
        </div>
        <div className="w-full sm:max-w-sm">
          <InputField
            label="Search transactions"
            placeholder="Client, property, amount, status"
            variant="dashboard"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 border-b border-black/5 px-5 py-4">
        {statuses.map((item) => (
          <button
            className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
              item === status
                ? "bg-green-accent text-white"
                : "border border-black/8 text-dashboard-muted hover:border-green-accent hover:text-deep-green"
            }`}
            key={item}
            onClick={() => setStatus(item)}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="grid gap-3 border-b border-black/5 px-5 py-4 sm:grid-cols-3">
        <SummaryStat label="Deals visible" value={String(filteredTransactions.length)} />
        <SummaryStat label="Pipeline value" value={`$${totalValue.toFixed(1)}M`} />
        <SummaryStat label="Next close" value={nextClose} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-dashboard-bg text-xs uppercase tracking-[0.12em] text-dashboard-muted">
            <tr>
              {["Client", "Property", "Amount", "Status", "Target close"].map((header) => (
                <th className="px-5 py-3 font-semibold" key={header}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {filteredTransactions.map((transaction) => (
              <tr className="transition hover:bg-dashboard-bg/70" key={`${transaction.client}-${transaction.property}`}>
                <td className="px-5 py-4 font-semibold text-dashboard-text">
                  {transaction.client}
                </td>
                <td className="px-5 py-4 text-dashboard-muted">{transaction.property}</td>
                <td className="px-5 py-4 text-dashboard-muted">{transaction.amount}</td>
                <td className="px-5 py-4 text-dashboard-muted">{transaction.status}</td>
                <td className="px-5 py-4 text-dashboard-muted">{transaction.close}</td>
              </tr>
            ))}
            {!filteredTransactions.length ? (
              <tr>
                <td className="px-5 py-8 text-sm text-dashboard-muted" colSpan={5}>
                  No transactions match the current filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-dashboard-bg p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-dashboard-muted">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-dashboard-text">{value}</p>
    </div>
  );
}
