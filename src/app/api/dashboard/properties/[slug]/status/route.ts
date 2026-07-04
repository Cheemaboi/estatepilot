import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { recordAdminActivity, requireAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type RequestBody = {
  status?: "draft" | "review" | "live" | "archived";
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!hasSupabaseEnv()) {
    return NextResponse.json(
      { error: "Supabase env vars are required to update property status." },
      { status: 503 },
    );
  }

  const { slug } = await params;
  const body = (await request.json()) as RequestBody;

  if (!body.status) {
    return NextResponse.json({ error: "Status is required." }, { status: 400 });
  }

  try {
    const supabase = await requireAdminClient();
    const { error } = await supabase
      .from("properties")
      .update({ status: body.status })
      .eq("slug", slug);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    await recordAdminActivity(supabase, {
      action: "status updated",
      entitySlug: slug,
      entityType: "property",
      summary: `Property status set to ${body.status}.`,
      metadata: { status: body.status },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    const status = message === "Forbidden" ? 403 : 401;
    return NextResponse.json({ error: message }, { status });
  }
}
