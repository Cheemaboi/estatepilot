import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { recordAdminActivity } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getCurrentDashboardAccess } from "@/lib/supabase/session";

export const dynamic = "force-dynamic";

type RequestBody = {
  action?: "request_review" | "publish_live" | "archive" | "restore_draft";
};

const actionMap: Record<
  NonNullable<RequestBody["action"]>,
  {
    allowedRoles: Array<"agent" | "admin">;
    message: string;
    status: "draft" | "review" | "live" | "archived";
    activityAction: string;
  }
> = {
  archive: {
    activityAction: "listing archived",
    allowedRoles: ["admin"],
    message: "Listing archived.",
    status: "archived",
  },
  publish_live: {
    activityAction: "listing published live",
    allowedRoles: ["admin"],
    message: "Listing published live.",
    status: "live",
  },
  request_review: {
    activityAction: "review requested",
    allowedRoles: ["agent", "admin"],
    message: "Listing moved into review.",
    status: "review",
  },
  restore_draft: {
    activityAction: "draft restored",
    allowedRoles: ["agent", "admin"],
    message: "Listing restored to draft.",
    status: "draft",
  },
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!hasSupabaseEnv()) {
    return NextResponse.json(
      { error: "Supabase env vars are required to update workflow state." },
      { status: 503 },
    );
  }

  const { slug } = await params;
  const body = (await request.json()) as RequestBody;

  if (!body.action || !(body.action in actionMap)) {
    return NextResponse.json({ error: "Action is required." }, { status: 400 });
  }

  const workflow = actionMap[body.action];
  const access = await getCurrentDashboardAccess();

  if (!workflow.allowedRoles.includes(access.role as "agent" | "admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("properties")
      .update({ status: workflow.status })
      .eq("slug", slug);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    await recordAdminActivity(supabase, {
      action: workflow.activityAction,
      entitySlug: slug,
      entityType: "property",
      summary: `Property workflow updated to ${workflow.status}.`,
      metadata: { action: body.action, status: workflow.status },
    });

    return NextResponse.json({
      message: workflow.message,
      ok: true,
      status: workflow.status,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    const status = message === "Forbidden" ? 403 : 401;
    return NextResponse.json({ error: message }, { status });
  }
}

