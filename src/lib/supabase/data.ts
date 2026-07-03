import { agents as mockAgents, appointments as mockAppointments, dashboardKpis, dashboardProperties, leads as mockLeads, transactions as mockTransactions } from "@/lib/mock-dashboard";
import { featuredProperties, type FeaturedProperty } from "@/lib/mock-properties";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

type PropertyRow = Database["public"]["Tables"]["properties"]["Row"];
type AgentRow = Database["public"]["Tables"]["agents"]["Row"];
type ImageRow = Database["public"]["Tables"]["property_images"]["Row"];

function formatArea(areaSqft: number | null) {
  return areaSqft ? `${areaSqft.toLocaleString()} sq ft` : "Upon request";
}

function mapProperty(
  property: PropertyRow,
  images: ImageRow[],
  agent?: AgentRow,
): FeaturedProperty {
  const gallery = images.length
    ? images.map((image) => image.url)
    : property.hero_image
      ? [property.hero_image]
      : [];

  return {
    slug: property.slug,
    title: property.title,
    location: property.location,
    price: property.price_label,
    image: property.hero_image ?? gallery[0] ?? featuredProperties[0].image,
    gallery,
    beds: property.beds,
    baths: Number(property.baths),
    area: formatArea(property.area_sqft),
    tag: property.tag ?? property.property_type,
    type: property.property_type,
    description: property.description,
    amenities: property.amenities,
    agent: {
      name: agent?.display_name ?? "EstatePilot Advisor",
      role: agent?.title ?? "Luxury property advisor",
      phone: agent?.phone ?? "+1 (555) 010-0000",
    },
  };
}

async function getRowsWithContext(status?: "live") {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const supabase = await createClient();
  let query = supabase.from("properties").select("*").order("created_at");

  if (status) {
    query = query.eq("status", status);
  }

  const { data: properties, error } = await query;

  if (error || !properties?.length) {
    return null;
  }

  const propertyIds = properties.map((property) => property.id);
  const agentIds = properties
    .map((property) => property.agent_id)
    .filter((id): id is string => Boolean(id));

  const [{ data: images }, { data: agents }] = await Promise.all([
    supabase
      .from("property_images")
      .select("*")
      .in("property_id", propertyIds)
      .order("sort_order"),
    agentIds.length
      ? supabase.from("agents").select("*").in("id", agentIds)
      : Promise.resolve({ data: [] as AgentRow[] }),
  ]);

  return {
    properties,
    images: images ?? [],
    agents: agents ?? [],
  };
}

export async function getPublicProperties() {
  const context = await getRowsWithContext("live");

  if (!context) {
    return featuredProperties;
  }

  return context.properties.map((property) =>
    mapProperty(
      property,
      context.images.filter((image) => image.property_id === property.id),
      context.agents.find((agent) => agent.id === property.agent_id),
    ),
  );
}

export async function getPropertyBySlug(slug: string) {
  const properties = await getPublicProperties();
  return properties.find((property) => property.slug === slug);
}

export async function getDashboardProperties() {
  const context = await getRowsWithContext();

  if (!context) {
    return dashboardProperties;
  }

  return context.properties.map((property) => ({
    name: property.title,
    market: property.market,
    agent:
      context.agents.find((agent) => agent.id === property.agent_id)?.display_name ??
      "Unassigned",
    price: property.price_label,
    status:
      property.status === "live"
        ? "Live"
        : property.status === "review"
          ? "Review"
          : property.status === "draft"
            ? "Draft"
            : "Archived",
    inquiries: 0,
  }));
}

export async function getDashboardAgents() {
  if (!hasSupabaseEnv()) {
    return mockAgents;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("agents").select("*").order("display_name");

  if (error || !data?.length) {
    return mockAgents;
  }

  return data.map((agent) => ({
    name: agent.display_name,
    market: agent.market,
    status: agent.status === "onboarding" ? "Onboarding" : "Active",
    listings: 0,
    pipeline: `$${(Number(agent.pipeline_value) / 1000000).toFixed(1)}M`,
  }));
}

export async function getDashboardLeads() {
  if (!hasSupabaseEnv()) {
    return mockLeads;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("leads").select("*").order("created_at");

  if (error || !data?.length) {
    return mockLeads;
  }

  return data.map((lead) => ({
    name: lead.full_name,
    property: "Connected property",
    stage: lead.stage.replaceAll("_", " ").replace(/^\w/, (letter) => letter.toUpperCase()),
    source: lead.source,
    value: lead.budget_label ?? "Unspecified",
  }));
}

export async function getDashboardTransactions() {
  if (!hasSupabaseEnv()) {
    return mockTransactions;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("created_at");

  if (error || !data?.length) {
    return mockTransactions;
  }

  return data.map((transaction) => ({
    client: "Connected lead",
    property: "Connected property",
    amount: transaction.amount_label,
    status: transaction.status.replace(/^\w/, (letter) => letter.toUpperCase()),
    close: transaction.target_close_date ?? "TBD",
  }));
}

export async function getDashboardAppointments() {
  if (!hasSupabaseEnv()) {
    return mockAppointments;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .order("scheduled_at");

  if (error || !data?.length) {
    return mockAppointments;
  }

  return data.map((appointment) => ({
    time: new Date(appointment.scheduled_at).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    title: appointment.title,
    property: "Connected property",
    contact: "Connected contact",
  }));
}

export async function getDashboardKpis() {
  if (!hasSupabaseEnv()) {
    return dashboardKpis;
  }

  const [properties, agents, leads] = await Promise.all([
    getDashboardProperties(),
    getDashboardAgents(),
    getDashboardLeads(),
  ]);

  return [
    { label: "Active listings", value: String(properties.length), change: "From Supabase" },
    { label: "Pipeline value", value: agents[0]?.pipeline ?? "$0", change: "Agent pipeline" },
    { label: "New leads", value: String(leads.length), change: "Connected CRM" },
    { label: "Tours booked", value: "0", change: "Appointments ready" },
  ];
}
