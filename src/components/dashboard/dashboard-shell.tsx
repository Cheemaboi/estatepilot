import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  { label: "Overview", href: "/dashboard" },
  { label: "Properties", href: "/dashboard/properties" },
  { label: "Agents", href: "/dashboard/agents" },
  { label: "Leads", href: "/dashboard/leads" },
  { label: "Transactions", href: "/dashboard/transactions" },
  { label: "Appointments", href: "/dashboard/appointments" },
  { label: "Activity", href: "/dashboard/activity" },
  { label: "Settings", href: "/dashboard/settings" },
];

type DashboardShellProps = {
  children: ReactNode;
  title: string;
  description: string;
};

export function DashboardShell({
  children,
  title,
  description,
}: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-dashboard-bg text-dashboard-text">
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-green-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        href="#dashboard-content"
      >
        Skip to dashboard content
      </a>
      <div className="mx-auto grid min-h-screen max-w-[1500px] grid-cols-[minmax(0,1fr)] lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="min-w-0 border-b border-black/5 bg-white px-5 py-5 lg:border-b-0 lg:border-r lg:py-6">
          <div className="flex items-center justify-between gap-4 lg:block">
            <Link
              href="/dashboard"
              className="text-base font-bold tracking-[0.16em] text-deep-green focus-visible:rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-accent"
            >
              ESTATEPILOT
            </Link>
            <Link
              href="/"
              className="rounded-full border border-black/8 px-3 py-2 text-xs font-semibold text-dashboard-muted transition hover:border-green-accent hover:text-deep-green lg:hidden"
            >
              Public site
            </Link>
          </div>
          <nav className="mt-5 flex max-w-full gap-2 overflow-x-auto lg:mt-8 lg:grid lg:overflow-visible">
            {navItems.map((item) => (
              <Link
                href={item.href}
                key={item.href}
                className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-dashboard-muted transition hover:bg-dashboard-bg hover:text-deep-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-accent lg:rounded-xl"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 hidden rounded-2xl bg-dashboard-bg p-4 lg:block">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-accent">
              Operational snapshot
            </p>
            <p className="mt-2 text-sm leading-6 text-dashboard-muted">
              Workspace data keeps the dashboard current while the product stays
              ready for the connected services behind it.
            </p>
          </div>
        </aside>
        <div className="min-w-0">
          <header className="border-b border-black/5 bg-white px-5 py-5 sm:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-accent">
                  Agency console
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-dashboard-text">
                  {title}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-dashboard-muted">
                  {description}
                </p>
              </div>
              <Link
                href="/"
                className="hidden rounded-full border border-black/8 px-4 py-2 text-sm font-semibold text-dashboard-muted transition hover:border-green-accent hover:text-deep-green lg:inline-flex"
              >
                View public site
              </Link>
            </div>
          </header>
          <main
            className="px-5 py-6 sm:px-8 lg:py-8"
            id="dashboard-content"
            tabIndex={-1}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
