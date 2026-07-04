import Link from "next/link";
import { signIn } from "@/app/auth/actions";
import { AuthShell } from "@/components/auth/auth-shell";
import { ButtonLink } from "@/components/ui/button";
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
    <AuthShell
      eyebrow="EstatePilot auth"
      title="Sign in to the agency dashboard."
      description="Use your agency account to get into the dashboard, manage listings, and review leads."
      tone="public"
      footer={
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Link className="text-white/70 hover:text-white" href="/auth/signup">
            Create an account
          </Link>
          <span className="text-white/30">/</span>
          <Link className="text-white/70 hover:text-white" href="/auth/admin">
            Admin sign in
          </Link>
        </div>
      }
    >
      <Card variant="glass" className="p-6 sm:p-8">
        <form action={signIn} className="grid gap-4">
          <h2 className="text-xl font-semibold text-white">Sign in</h2>
          <input name="next" type="hidden" value={nextRoute} />
          <InputField
            autoComplete="email"
            label="Email"
            name="email"
            placeholder="agent@example.com"
            type="email"
            required
          />
          <InputField
            autoComplete="current-password"
            label="Password"
            name="password"
            placeholder="Password"
            type="password"
            required
          />
          <button
            className="mt-2 rounded-full bg-luxury-accent px-5 py-3 text-sm font-semibold text-public-bg transition hover:bg-[#e7cf98]"
            type="submit"
          >
            Sign in
          </button>
        </form>
        {message ? (
          <p className="mt-6 rounded-2xl border border-white/12 bg-white/[0.05] p-4 text-sm text-white/72">
            {message}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <ButtonLink href="/auth/signup" variant="secondary">
            Create account
          </ButtonLink>
          <ButtonLink href="/auth/admin" variant="secondary">
            Admin sign in
          </ButtonLink>
        </div>
      </Card>
    </AuthShell>
  );
}

