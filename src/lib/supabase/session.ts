import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type DashboardAccessRole = "visitor" | "agent" | "admin";

export type DashboardAccess = {
  role: DashboardAccessRole;
  userId: string | null;
};

export async function getCurrentSessionUser() {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  return {
    role: profile?.role ?? "visitor",
    userId: data.user.id,
  };
}

export async function getCurrentDashboardAccess(): Promise<DashboardAccess> {
  const session = await getCurrentSessionUser();

  if (!session) {
    return {
      role: hasSupabaseEnv() ? "visitor" : "admin",
      userId: null,
    };
  }

  return {
    role: session.role,
    userId: session.userId,
  };
}
