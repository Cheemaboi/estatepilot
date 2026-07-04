import Link from "next/link";
import { signIn } from "@/app/auth/actions";
import { AuthShell } from "@/components/auth/auth-shell";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputField } from "@/components/ui/field";

type AdminPageProps = {
  searchParams: Promise<{
    message?: string;
    next?: string;
  }>;
};

export default async function AdminSignInPage({ searchParams }: AdminPageProps) {
  const { message, next } = await searchParams;
  const nextRoute = next?.startsWith("/") ? next : "/dashboard";

  return (
    <AuthShell
      eyebrow="Admin access"
      title="Sign in to the agency console."
      description="This entry is for admins and senior operators who need access to the internal dashboard."
      tone="dashboard"
      footer={
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Link className="text-dashboard-muted hover:text-dashboard-text" href="/auth/login">
            Regular sign in
          </Link>
          <span className="text-dashboard-muted/50">/</span>
          <Link className="text-dashboard-muted hover:text-dashboard-text" href="/auth/signup">
            Create account
          </Link>
        </div>
      }
    >
      <Card variant="dashboard" className="p-6 sm:p-8">
        <form action={signIn} className="grid gap-4">
          <h2 className="text-xl font-semibold text-dashboard-text">Admin sign in</h2>
          <input name="next" type="hidden" value={nextRoute} />
          <InputField
            autoComplete="email"
            label="Admin email"
            name="email"
            placeholder="admin@example.com"
            type="email"
            variant="dashboard"
            required
          />
          <InputField
            autoComplete="current-password"
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
            Enter dashboard
          </button>
        </form>
        {message ? (
          <p className="mt-6 rounded-2xl border border-black/5 bg-dashboard-bg p-4 text-sm text-dashboard-muted">
            {message}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <ButtonLink href="/auth/login" variant="secondary">
            Regular sign in
          </ButtonLink>
          <ButtonLink href="/auth/signup" variant="secondary">
            Create account
          </ButtonLink>
        </div>
      </Card>
    </AuthShell>
  );
}

