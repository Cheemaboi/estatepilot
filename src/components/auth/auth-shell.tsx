import type { ReactNode } from "react";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(216,189,134,0.18),transparent_26%),radial-gradient(circle_at_82%_18%,rgba(24,45,35,0.9),transparent_28%),linear-gradient(180deg,#06110d_0%,#08110d_48%,#09130f_100%)] px-5 py-10 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-6xl items-center gap-8 lg:grid-cols-[0.88fr_1.12fr]">
        <section className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-luxury-accent">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-md text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-white/68">
            {description}
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ["Secure", "Supabase auth"],
              ["Styled", "Public palette"],
              ["Role-aware", "Admin split"],
            ].map(([label, value]) => (
              <div
                className="rounded-[22px] border border-white/12 bg-white/[0.04] px-4 py-4 backdrop-blur"
                key={label}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/52">
                  {label}
                </p>
                <p className="mt-2 text-sm font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-[32px] border border-white/12 bg-white/[0.08] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-6">
          {children}
          {footer ? <div className="mt-6">{footer}</div> : null}
        </section>
      </div>
    </main>
  );
}
