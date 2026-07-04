import Link from "next/link";
import { signUp } from "@/app/auth/actions";
import { AuthShell } from "@/components/auth/auth-shell";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputField } from "@/components/ui/field";

type SignUpPageProps = {
  searchParams: Promise<{
    message?: string;
    next?: string;
  }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const { message, next } = await searchParams;
  const nextRoute = next?.startsWith("/") ? next : "/dashboard";

  return (
    <AuthShell
      eyebrow="EstatePilot auth"
      title="Create your agency account."
      description="Set up a dashboard-ready account for agents and admins with Supabase Auth."
      footer={
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Link className="text-white/70 hover:text-white" href="/auth/login">
            Already have an account?
          </Link>
          <span className="text-white/30">•</span>
          <Link className="text-white/70 hover:text-white" href="/auth/admin">
            Admin sign in
          </Link>
        </div>
      }
    >
      <Card variant="glass" className="p-6 sm:p-8">
        <form action={signUp} className="grid gap-4">
          <h2 className="text-xl font-semibold text-white">Create account</h2>
          <input name="next" type="hidden" value={nextRoute} />
          <InputField
            label="Name"
            name="full_name"
            placeholder="Maya Sterling"
            autoComplete="name"
            required
          />
          <InputField
            label="Email"
            name="email"
            placeholder="new-agent@example.com"
            type="email"
            autoComplete="email"
            required
          />
          <InputField
            label="Password"
            name="password"
            placeholder="At least 6 characters"
            type="password"
            autoComplete="new-password"
            required
          />
          <button
            className="mt-2 rounded-full border border-luxury-accent/40 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white transition hover:border-luxury-accent hover:bg-white/[0.1]"
            type="submit"
          >
            Sign up
          </button>
        </form>
        {message ? (
          <p className="mt-6 rounded-2xl border border-white/12 bg-white/[0.05] p-4 text-sm text-white/72">
            {message}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <ButtonLink href="/auth/login" variant="secondary">
            Sign in
          </ButtonLink>
          <ButtonLink href="/auth/admin" variant="secondary">
            Admin sign in
          </ButtonLink>
        </div>
      </Card>
    </AuthShell>
  );
}
