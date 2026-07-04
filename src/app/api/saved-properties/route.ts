import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { getCurrentSessionUser } from "@/lib/supabase/session";

export const dynamic = "force-dynamic";

type RequestBody = {
  slug?: string;
};

async function getPropertyIdBySlug(supabase: Awaited<ReturnType<typeof createClient>>, slug: string) {
  const { data, error } = await supabase.from("properties").select("id").eq("slug", slug).maybeSingle();

  if (error || !data) {
    return null;
  }

  return data.id;
}

export async function GET() {
  if (!hasSupabaseEnv()) {
    return NextResponse.json({ slugs: [] });
  }

  const session = await getCurrentSessionUser();

  if (!session?.userId) {
    return NextResponse.json({ slugs: [] });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("saved_properties")
    .select("property_id")
    .eq("user_id", session.userId);

  if (error || !data?.length) {
    return NextResponse.json({ slugs: [] });
  }

  const propertyIds = data.map((row) => row.property_id);
  const { data: properties } = await supabase.from("properties").select("slug").in("id", propertyIds);

  return NextResponse.json({ slugs: properties?.map((property) => property.slug) ?? [] });
}

export async function POST(request: Request) {
  if (!hasSupabaseEnv()) {
    return NextResponse.json(
      { error: "Supabase env vars are required to save favorites." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as RequestBody;
  const slug = body.slug?.trim();

  if (!slug) {
    return NextResponse.json({ error: "Slug is required." }, { status: 400 });
  }

  const session = await getCurrentSessionUser();

  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const propertyId = await getPropertyIdBySlug(supabase, slug);

  if (!propertyId) {
    return NextResponse.json({ error: "Property not found." }, { status: 404 });
  }

  const { error } = await supabase.from("saved_properties").upsert(
    {
      created_at: new Date().toISOString(),
      property_id: propertyId,
      user_id: session.userId,
    },
    { onConflict: "user_id,property_id" },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, saved: true });
}

export async function DELETE(request: Request) {
  if (!hasSupabaseEnv()) {
    return NextResponse.json(
      { error: "Supabase env vars are required to manage favorites." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as RequestBody;
  const slug = body.slug?.trim();

  if (!slug) {
    return NextResponse.json({ error: "Slug is required." }, { status: 400 });
  }

  const session = await getCurrentSessionUser();

  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const propertyId = await getPropertyIdBySlug(supabase, slug);

  if (!propertyId) {
    return NextResponse.json({ error: "Property not found." }, { status: 404 });
  }

  const { error } = await supabase
    .from("saved_properties")
    .delete()
    .eq("user_id", session.userId)
    .eq("property_id", propertyId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, saved: false });
}
