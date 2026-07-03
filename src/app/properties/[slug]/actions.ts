"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sendInquiryEmail } from "@/lib/email";
import { getPropertyBySlug } from "@/lib/supabase/data";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export async function createInquiry(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const fullName = String(formData.get("full_name") ?? "");
  const email = String(formData.get("email") ?? "");
  const phone = String(formData.get("phone") ?? "");
  const preferredDate = String(formData.get("preferred_date") ?? "");
  const preferredTime = String(formData.get("preferred_time") ?? "");
  const tourFormat = String(formData.get("tour_format") ?? "");
  const message = String(formData.get("message") ?? "");

  if (!slug || !fullName || !email) {
    redirect(`/properties/${slug}?message=${encodeURIComponent("Name and email are required.")}`);
  }

  const propertyProfile = await getPropertyBySlug(slug);
  const emailResult = await sendInquiryEmail({
    email,
    fullName,
    message,
    phone,
    preferredDate,
    preferredTime,
    propertyTitle: propertyProfile?.title ?? slug,
    slug,
    tourFormat,
  });

  if (!hasSupabaseEnv()) {
    redirect(
      `/properties/${slug}?message=${encodeURIComponent(
        emailResult.sent
          ? "Inquiry email sent. Configure Supabase env vars to also save it."
          : "Inquiry captured in demo mode. Configure Supabase and email env vars to save and send it.",
      )}`,
    );
  }

  const supabase = await createClient();
  const { data: property } = await supabase
    .from("properties")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  const { error } = await supabase.from("inquiries").insert({
    property_id: property?.id,
    full_name: fullName,
    email,
    phone: phone || null,
    preferred_date: preferredDate || null,
    message:
      [
        message,
        preferredTime ? `Preferred time: ${preferredTime}` : "",
        tourFormat ? `Tour format: ${tourFormat}` : "",
      ]
        .filter(Boolean)
        .join("\n") || null,
  });

  if (error) {
    redirect(`/properties/${slug}?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/properties/${slug}`);
  redirect(
    `/properties/${slug}?message=${encodeURIComponent(
      emailResult.sent
        ? "Inquiry saved and email sent."
        : "Inquiry saved. Configure email env vars to send notifications.",
    )}`,
  );
}
