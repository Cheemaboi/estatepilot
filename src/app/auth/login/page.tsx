import { signIn, signUp } from "@/app/auth/actions";
import { Card } from "@/components/ui/card";
import { InputField } from "@/components/ui/field";

type LoginPageProps = {
  searchParams: Promise<{
    message?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { message, next } = await searchParams;
  const nextRoute = next?.startsWith("/") ? next : "/dashboard";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(63,125,88,0.12),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(23,63,44,0.08),transparent_24%),linear-gradient(180deg,#f5f7f4_0%,#eff2ee_100%)] px-5 py-10 text-dashboard-text">
      <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-6xl items-center gap-8 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="rounded-[32px] border border-green-accent/10 bg-white/75 p-8 shadow-[0_18px_48px_rgba(23,63,44,0.08)] backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-accent">
            EstatePilot auth
          </p>
          <h1 className="mt-4 max-w-md text-4xl font-semibold tracking-tight sm:text-5xl">
            Sign in to the agency dashboard.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-dashboard-muted">
            Supabase Auth is wired for email and password access. Roles are
            stored in profiles and enforced by database policies.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[22px] border border-green-accent/12 bg-white px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-dashboard-muted">
                Access
              </p>
              <p className="mt-2 text-sm font-semibold text-dashboard-text">
                Email sign-in
              </p>
            </div>
            <div className="rounded-[22px] border border-green-accent/12 bg-white px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-dashboard-muted">
                Roles
              </p>
              <p className="mt-2 text-sm font-semibold text-dashboard-text">
                Profile policies
              </p>
            </div>
            <div className="rounded-[22px] border border-green-accent/12 bg-white px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-dashboard-muted">
                Flow
              </p>
              <p className="mt-2 text-sm font-semibold text-dashboard-text">
                Dashboard redirect
              </p>
            </div>
          </div>
          {message ? (
            <p className="mt-6 rounded-2xl border border-green-accent/20 bg-green-accent/8 p-4 text-sm text-dashboard-muted">
              {message}
            </p>
          ) : null}
        </div>
        <Card
          variant="dashboard"
          className="border-green-accent/10 bg-white p-6 shadow-[0_24px_70px_rgba(23,63,44,0.08)] sm:p-8"
        >
          <div className="grid gap-8 lg:grid-cols-2">
            <form className="grid gap-4" action={signIn}>
              <h2 className="text-xl font-semibold text-dashboard-text">Sign in</h2>
              <input name="next" type="hidden" value={nextRoute} />
              <InputField
                label="Email"
                name="email"
                placeholder="agent@example.com"
                type="email"
                variant="dashboard"
                required
              />
              <InputField
                label="Password"
                name="password"
                placeholder="Password"
                type="password"
                variant="dashboard"
                required
              />
              <button
                className="mt-2 rounded-full bg-green-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-deep-green"
                type="submit"
              >
                Sign in
              </button>
            </form>
            <form action={signUp} className="grid gap-4">
              <h2 className="text-xl font-semibold text-dashboard-text">Create account</h2>
              <input name="next" type="hidden" value={nextRoute} />
              <InputField
                label="Name"
                name="full_name"
                placeholder="Maya Sterling"
                variant="dashboard"
                required
              />
              <InputField
                label="Email"
                name="email"
                placeholder="new-agent@example.com"
                type="email"
                variant="dashboard"
                required
              />
              <InputField
                label="Password"
                name="password"
                placeholder="At least 6 characters"
                type="password"
                variant="dashboard"
                required
              />
              <button
                className="mt-2 rounded-full border border-green-accent/25 bg-green-accent/8 px-5 py-3 text-sm font-semibold text-deep-green transition hover:bg-green-accent/14"
                type="submit"
              >
                Sign up
              </button>
            </form>
          </div>
        </Card>
      </div>
    </main>
  );
}
