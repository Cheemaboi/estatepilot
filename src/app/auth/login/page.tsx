import { signIn, signUp } from "@/app/auth/actions";
import { Card } from "@/components/ui/card";
import { InputField } from "@/components/ui/field";

type LoginPageProps = {
  searchParams: Promise<{
    message?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { message } = await searchParams;

  return (
    <main className="min-h-screen bg-dashboard-bg px-5 py-10 text-dashboard-text">
      <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-5xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-accent">
            EstatePilot auth
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Sign in to the agency dashboard.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-dashboard-muted">
            Supabase Auth is wired for email and password access. Roles are
            stored in profiles and enforced by database policies.
          </p>
          {message ? (
            <p className="mt-6 rounded-2xl border border-green-accent/20 bg-white p-4 text-sm text-dashboard-muted">
              {message}
            </p>
          ) : null}
        </div>
        <Card variant="dashboard" className="p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <form action={signIn} className="grid gap-4">
              <h2 className="text-xl font-semibold">Sign in</h2>
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
              <h2 className="text-xl font-semibold">Create account</h2>
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
                className="mt-2 rounded-full border border-green-accent/30 px-5 py-3 text-sm font-semibold text-deep-green transition hover:bg-green-accent/10"
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
