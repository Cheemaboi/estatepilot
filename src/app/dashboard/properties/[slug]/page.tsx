import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { PropertyEditor } from "@/components/dashboard/property-editor";
import { featuredProperties } from "@/lib/mock-properties";
import { getPropertyBySlug, getPropertyMediaBySlug } from "@/lib/supabase/data";
import { getCurrentDashboardAccess } from "@/lib/supabase/session";

type PropertyEditorPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return featuredProperties.map((property) => ({
    slug: property.slug,
  }));
}

export default async function DashboardPropertyEditorPage({
  params,
}: PropertyEditorPageProps) {
  const { slug } = await params;
  const [property, mediaItems, access] = await Promise.all([
    getPropertyBySlug(slug),
    getPropertyMediaBySlug(slug),
    getCurrentDashboardAccess(),
  ]);

  if (!property) {
    notFound();
  }

  return (
    <DashboardShell
      title={property.title}
      description="Internal property detail and editor with draft controls, media review, and agent handoff."
    >
      <PropertyEditor
        accessRole={access.role}
        mediaItems={mediaItems}
        property={property}
      />
    </DashboardShell>
  );
}
