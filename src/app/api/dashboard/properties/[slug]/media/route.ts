import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { recordAdminActivity, requireAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function createStoragePath(slug: string, fileName: string) {
  const safeName = fileName.replaceAll(/[^a-zA-Z0-9._-]/g, "-");
  return `properties/${slug}/${Date.now()}-${safeName}`;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!hasSupabaseEnv()) {
    return NextResponse.json(
      { error: "Supabase env vars are required to upload property media." },
      { status: 503 },
    );
  }

  const { slug } = await params;
  const formData = await request.formData();
  const file = formData.get("file");
  const alt = String(formData.get("alt") ?? "").trim();

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File is required." }, { status: 400 });
  }

  try {
    const supabase = await requireAdminClient();
    const { data: property, error: propertyError } = await supabase
      .from("properties")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (propertyError || !property) {
      return NextResponse.json({ error: "Property not found." }, { status: 404 });
    }

    const storagePath = createStoragePath(slug, file.name);
    const { error: uploadError } = await supabase.storage
      .from("property-media")
      .upload(storagePath, file, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 400 });
    }

    const { data: publicUrlData } = supabase.storage
      .from("property-media")
      .getPublicUrl(storagePath);

    const { data, error } = await supabase
      .from("property_images")
      .insert({
        alt: alt || `${slug} gallery image`,
        property_id: property.id,
        sort_order: 0,
        storage_path: storagePath,
        url: publicUrlData.publicUrl,
      })
      .select("*")
      .single();

    if (error || !data) {
      return NextResponse.json({ error: error?.message ?? "Upload failed." }, { status: 400 });
    }

    await recordAdminActivity(supabase, {
      action: "media uploaded",
      entitySlug: slug,
      entityType: "property",
      summary: `Media uploaded for ${slug}.`,
      metadata: { alt: data.alt, storagePath: data.storage_path ?? storagePath },
    });

    return NextResponse.json({
      alt: data.alt,
      id: data.id,
      sortOrder: data.sort_order,
      storagePath: data.storage_path ?? storagePath,
      url: data.url,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    const status = message === "Forbidden" ? 403 : 401;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!hasSupabaseEnv()) {
    return NextResponse.json(
      { error: "Supabase env vars are required to delete property media." },
      { status: 503 },
    );
  }

  const { slug } = await params;
  const body = (await request.json()) as { imageId?: string };

  if (!body.imageId) {
    return NextResponse.json({ error: "imageId is required." }, { status: 400 });
  }

  try {
    const supabase = await requireAdminClient();
    const { data: property, error: propertyError } = await supabase
      .from("properties")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (propertyError || !property) {
      return NextResponse.json({ error: "Property not found." }, { status: 404 });
    }

    const { data: media, error: mediaError } = await supabase
      .from("property_images")
      .select("*")
      .eq("id", body.imageId)
      .eq("property_id", property.id)
      .maybeSingle();

    if (mediaError || !media) {
      return NextResponse.json({ error: "Media not found." }, { status: 404 });
    }

    if (media.storage_path) {
      await supabase.storage.from("property-media").remove([media.storage_path]);
    }

    const { error } = await supabase.from("property_images").delete().eq("id", media.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    await recordAdminActivity(supabase, {
      action: "media deleted",
      entitySlug: slug,
      entityType: "property",
      summary: `Media removed from ${slug}.`,
      metadata: { imageId: media.id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    const status = message === "Forbidden" ? 403 : 401;
    return NextResponse.json({ error: message }, { status });
  }
}
