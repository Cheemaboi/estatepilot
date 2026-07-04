import type { ReactNode } from "react";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
  tone?: "public" | "dashboard";
};

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
  tone = "public",
}: AuthShellProps) {
  const isDashboardTone = tone === "dashboard";

  return (
    <main
      className={`min-h-screen px-5 py-10 ${
        isDashboardTone
          ? "bg-[radial-gradient(circle_at_top_left,rgba(63,125,88,0.12),transparent_24%),radial-gradient(circle_at_80%_14%,rgba(216,189,134,0.16),transparent_22%),linear-gradient(180deg,#f5f7f5_0%,#eef3ef_45%,#e9efe9_100%)] text-dashboard-text"
          : "bg-[radial-gradient(circle_at_top_left,rgba(216,189,134,0.18),transparent_26%),radial-gradient(circle_at_82%_18%,rgba(24,45,35,0.9),transparent_28%),linear-gradient(180deg,#06110d_0%,#08110d_48%,#09130f_100%)] text-white"
      }`}
    >
      <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-6xl items-center gap-8 lg:grid-cols-[0.88fr_1.12fr]">
        <section className="max-w-xl">
          <p
            className={`text-xs font-semibold uppercase tracking-[0.24em] ${
              isDashboardTone ? "text-green-accent" : "text-luxury-accent"
            }`}
          >
            {eyebrow}
          </p>
          <h1
            className={`mt-4 max-w-md text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl ${
              isDashboardTone ? "text-dashboard-text" : "text-white"
            }`}
          >
            {title}
          </h1>
          <p
            className={`mt-5 max-w-xl text-base leading-8 ${
              isDashboardTone ? "text-dashboard-muted" : "text-white/68"
            }`}
          >
            {description}
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ["Secure", "Supabase auth"],
              ["Styled", "Public palette"],
              ["Role-aware", "Admin split"],
            ].map(([label, value]) => (
              <div
                className={`rounded-[22px] border px-4 py-4 backdrop-blur ${
                  isDashboardTone
                    ? "border-black/5 bg-white shadow-[0_14px_38px_rgba(26,39,31,0.06)]"
                    : "border-white/12 bg-white/[0.04]"
                }`}
                key={label}
              >
                <p
                  className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
                    isDashboardTone ? "text-dashboard-muted" : "text-white/52"
                  }`}
                >
                  {label}
                </p>
                <p
                  className={`mt-2 text-sm font-semibold ${
                    isDashboardTone ? "text-dashboard-text" : "text-white"
                  }`}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>
        </section>
        <section
          className={`rounded-[32px] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-6 ${
            isDashboardTone
              ? "border border-black/5 bg-white"
              : "border border-white/12 bg-white/[0.08]"
          }`}
        >
          {children}
          {footer ? <div className="mt-6">{footer}</div> : null}
        </section>
      </div>
    </main>
  );
}
