import { NextResponse } from "next/server";
import { recordAdminActivity } from "@/lib/supabase/admin";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { getCurrentSessionUser } from "@/lib/supabase/session";

export const dynamic = "force-dynamic";

type RequestBody = {
  contactEmail?: string;
  contactName?: string;
  contactPhone?: string;
  date?: string;
  notes?: string;
  propertySlug?: string;
  time?: string;
  title?: string;
};

export async function POST(request: Request) {
  if (!hasSupabaseEnv()) {
    return NextResponse.json(
      { error: "Supabase env vars are required to schedule appointments." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as RequestBody;
  const propertySlug = body.propertySlug?.trim();
  const title = body.title?.trim();
  const contactName = body.contactName?.trim();
  const contactEmail = body.contactEmail?.trim();
  const contactPhone = body.contactPhone?.trim();
  const date = body.date?.trim();
  const time = body.time?.trim();
  const notes = body.notes?.trim();

  if (!propertySlug || !title || !date || !time) {
    return NextResponse.json(
      { error: "Property, title, date, and time are required." },
      { status: 400 },
    );
  }

  const session = await getCurrentSessionUser();

  if (!session?.userId || (session.role !== "agent" && session.role !== "admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = await createClient();
  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .select("id, agent_id, title, slug")
    .eq("slug", propertySlug)
    .maybeSingle();

  if (propertyError || !property) {
    return NextResponse.json({ error: "Property not found." }, { status: 404 });
  }

  let agentId: string | null = null;

  if (session.role === "agent") {
    const { data: agent } = await supabase
      .from("agents")
      .select("id")
      .eq("profile_id", session.userId)
      .maybeSingle();

    if (!agent) {
      return NextResponse.json({ error: "Agent profile not found." }, { status: 403 });
    }

    if (property.agent_id && property.agent_id !== agent.id) {
      return NextResponse.json(
        { error: "You can only schedule appointments on your assigned listings." },
        { status: 403 },
      );
    }

    agentId = agent.id;
  } else {
    agentId = property.agent_id ?? null;
  }

  const scheduledAt = new Date(`${date}T${time}:00`);

  if (Number.isNaN(scheduledAt.getTime())) {
    return NextResponse.json({ error: "Invalid appointment time." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("appointments")
    .insert({
      agent_id: agentId,
      contact_email: contactEmail || null,
      contact_name: contactName || null,
      contact_phone: contactPhone || null,
      notes: notes || null,
      property_id: property.id,
      scheduled_at: scheduledAt.toISOString(),
      title,
    })
    .select("*")
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Unable to schedule." }, { status: 400 });
  }

  await recordAdminActivity(supabase, {
    action: "appointment scheduled",
    entitySlug: property.slug,
    entityType: "appointment",
    metadata: {
      contactEmail: contactEmail ?? null,
      contactName: contactName ?? null,
      contactPhone: contactPhone ?? null,
      notes: notes ?? null,
      scheduledAt: scheduledAt.toISOString(),
      title,
    },
    summary: `${title} scheduled for ${property.title}.`,
  });

  return NextResponse.json({
    appointment: data,
    message: "Appointment scheduled.",
    ok: true,
  });
}

