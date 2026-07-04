"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

function getAuthRedirect(message: string) {
  return `/auth/login?message=${encodeURIComponent(message)}`;
}

function getNextRedirect(formData: FormData) {
  const next = String(formData.get("next") ?? "").trim();

  if (next.startsWith("/")) {
    return next;
  }

  return "/dashboard";
}

export async function signIn(formData: FormData) {
  if (!hasSupabaseEnv()) {
    redirect(getAuthRedirect("Supabase env vars are not configured yet."));
  }

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = getNextRedirect(formData);
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(getAuthRedirect(error.message));
  }

  redirect(next);
}

export async function signUp(formData: FormData) {
  if (!hasSupabaseEnv()) {
    redirect(getAuthRedirect("Supabase env vars are not configured yet."));
  }

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "");
  const next = getNextRedirect(formData);
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    redirect(getAuthRedirect(error.message));
  }

  redirect(
    `/auth/login?message=${encodeURIComponent(
      `Check your email to confirm your account. You will return to ${next}.`,
    )}`,
  );
}

export async function signOut() {
  if (hasSupabaseEnv()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  redirect("/");
}
