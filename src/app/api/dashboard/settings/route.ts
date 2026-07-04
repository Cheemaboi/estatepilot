import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { recordAdminActivity, requireAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!hasSupabaseEnv()) {
    return NextResponse.json({
      agencyName: "EstatePilot Agency",
      autoApproveMedia: false,
      defaultVisibility: "review",
      notificationMode: "both",
      supportEmail: "team@estatepilot.co",
      timezone: "America/Los_Angeles",
    });
  }

  try {
    const supabase = await requireAdminClient();
    const { data, error } = await supabase.from("workspace_settings").select("*").maybeSingle();

    if (error || !data) {
      return NextResponse.json({ error: "Settings not found." }, { status: 404 });
    }

    return NextResponse.json({
      agencyName: data.agency_name,
      autoApproveMedia: data.auto_approve_media,
      defaultVisibility: data.default_visibility,
      notificationMode: data.notification_mode,
      supportEmail: data.support_email,
      timezone: data.timezone,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function POST(request: Request) {
  if (!hasSupabaseEnv()) {
    return NextResponse.json(
      { error: "Supabase env vars are required to save settings." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as {
    agencyName?: string;
    autoApproveMedia?: boolean;
    defaultVisibility?: "draft" | "review" | "live" | "archived";
    notificationMode?: "email" | "in-app" | "both";
    supportEmail?: string;
    timezone?: string;
  };

  try {
    const supabase = await requireAdminClient();
    const { error } = await supabase
      .from("workspace_settings")
      .update({
        agency_name: body.agencyName ?? "EstatePilot Agency",
        auto_approve_media: Boolean(body.autoApproveMedia),
        default_visibility: body.defaultVisibility ?? "review",
        notification_mode: body.notificationMode ?? "both",
        support_email: body.supportEmail ?? "team@estatepilot.co",
        timezone: body.timezone ?? "America/Los_Angeles",
      })
      .eq("id", 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    await recordAdminActivity(supabase, {
      action: "settings saved",
      entitySlug: null,
      entityType: "workspace",
      summary: "Workspace settings updated from the dashboard control room.",
      metadata: body,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    const status = message === "Forbidden" ? 403 : 401;
    return NextResponse.json({ error: message }, { status });
  }
}
