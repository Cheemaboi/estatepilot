export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-dashboard-bg text-dashboard-text">
      <div className="mx-auto grid min-h-screen max-w-[1500px] grid-cols-[minmax(0,1fr)] lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="border-b border-black/5 bg-white px-5 py-5 lg:border-b-0 lg:border-r lg:py-6">
          <div className="h-5 w-40 animate-pulse rounded-full bg-dashboard-bg" />
          <div className="mt-8 grid gap-3">
            {["Overview", "Properties", "Agents", "Leads"].map((item) => (
              <div
                className="h-10 animate-pulse rounded-xl bg-dashboard-bg"
                key={item}
              />
            ))}
          </div>
        </aside>
        <main className="px-5 py-6 sm:px-8 lg:py-8">
          <div className="h-4 w-36 animate-pulse rounded-full bg-green-accent/20" />
          <div className="mt-4 h-10 max-w-sm animate-pulse rounded-full bg-black/10" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                className="h-32 animate-pulse rounded-[22px] bg-white shadow-[0_14px_38px_rgba(26,39,31,0.08)]"
                key={item}
              />
            ))}
          </div>
          <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.75fr)]">
            <div className="h-80 animate-pulse rounded-[22px] bg-white" />
            <div className="h-80 animate-pulse rounded-[22px] bg-white" />
          </div>
        </main>
      </div>
    </div>
  );
}
