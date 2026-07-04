import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { requireAdminClient } from "@/lib/supabase/admin";

export default async function DashboardSettingsLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  if (hasSupabaseEnv()) {
    try {
      await requireAdminClient();
    } catch {
      redirect("/dashboard?message=Admin access required.");
    }
  }

  return children;
}
