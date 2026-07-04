import type { Database, Json } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;
type ActivityPayload = {
  action: string;
  entitySlug?: string | null;
  entityType: string;
  metadata?: Record<string, unknown>;
  summary: string;
};

export async function requireAdminClient() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new Error("Unauthorized");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError || profile?.role !== "admin") {
    throw new Error("Forbidden");
  }

  return supabase as SupabaseClient;
}

export async function recordAdminActivity(
  supabase: SupabaseClient,
  payload: ActivityPayload,
) {
  const { data } = await supabase.auth.getUser();

  await supabase.from("admin_activity_logs").insert({
    actor_id: data.user?.id ?? null,
    action: payload.action,
    entity_slug: payload.entitySlug ?? null,
    entity_type: payload.entityType,
    metadata: (payload.metadata ?? {}) as Json,
    summary: payload.summary,
  });
}

export type { Database };
