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
      footer={
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Link className="text-white/70 hover:text-white" href="/auth/login">
            Regular sign in
          </Link>
          <span className="text-white/30">•</span>
          <Link className="text-white/70 hover:text-white" href="/auth/signup">
            Create account
          </Link>
        </div>
      }
    >
      <Card variant="glass" className="p-6 sm:p-8">
        <form action={signIn} className="grid gap-4">
          <h2 className="text-xl font-semibold text-white">Admin sign in</h2>
          <input name="next" type="hidden" value={nextRoute} />
          <InputField
            label="Admin email"
            name="email"
            placeholder="admin@example.com"
            type="email"
            autoComplete="email"
            required
          />
          <InputField
            label="Password"
            name="password"
            placeholder="Password"
            type="password"
            autoComplete="current-password"
            required
          />
          <button
            className="mt-2 rounded-full bg-luxury-accent px-5 py-3 text-sm font-semibold text-public-bg transition hover:bg-[#e7cf98]"
            type="submit"
          >
            Enter dashboard
          </button>
        </form>
        {message ? (
          <p className="mt-6 rounded-2xl border border-white/12 bg-white/[0.05] p-4 text-sm text-white/72">
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
