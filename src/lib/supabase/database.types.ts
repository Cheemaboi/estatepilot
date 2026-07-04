export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      agents: {
        Row: {
          id: string;
          profile_id: string | null;
          display_name: string;
          title: string;
          email: string | null;
          phone: string | null;
          market: string;
          status: "active" | "onboarding" | "inactive";
          bio: string | null;
          pipeline_value: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["agents"]["Row"]> & {
          display_name: string;
          market: string;
        };
        Update: Partial<Database["public"]["Tables"]["agents"]["Row"]>;
        Relationships: [];
      };
      appointments: {
        Row: {
          id: string;
          property_id: string | null;
          lead_id: string | null;
          agent_id: string | null;
          title: string;
          scheduled_at: string;
          status: "scheduled" | "completed" | "cancelled";
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["appointments"]["Row"]> & {
          title: string;
          scheduled_at: string;
        };
        Update: Partial<Database["public"]["Tables"]["appointments"]["Row"]>;
        Relationships: [];
      };
      admin_activity_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          entity_type: string;
          entity_slug: string | null;
          action: string;
          summary: string;
          metadata: Json;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["admin_activity_logs"]["Row"]> & {
          entity_type: string;
          action: string;
          summary: string;
        };
        Update: Partial<Database["public"]["Tables"]["admin_activity_logs"]["Row"]>;
        Relationships: [];
      };
      inquiries: {
        Row: {
          id: string;
          property_id: string | null;
          full_name: string;
          email: string;
          phone: string | null;
          message: string | null;
          preferred_date: string | null;
          status: "new" | "contacted" | "converted" | "closed";
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["inquiries"]["Row"]> & {
          full_name: string;
          email: string;
        };
        Update: Partial<Database["public"]["Tables"]["inquiries"]["Row"]>;
        Relationships: [];
      };
      leads: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          budget_label: string | null;
          source: string;
          stage:
            | "new_inquiry"
            | "qualified"
            | "tour_scheduled"
            | "negotiation"
            | "closed"
            | "lost";
          property_id: string | null;
          assigned_agent_id: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["leads"]["Row"]> & {
          full_name: string;
          email: string;
        };
        Update: Partial<Database["public"]["Tables"]["leads"]["Row"]>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          full_name: string;
          role: "visitor" | "agent" | "admin";
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      properties: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          location: string;
          market: string;
          property_type: string;
          status: "draft" | "review" | "live" | "archived";
          price: number | null;
          price_label: string;
          beds: number;
          baths: number;
          area_sqft: number | null;
          tag: string | null;
          hero_image: string | null;
          amenities: string[];
          featured: boolean;
          agent_id: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["properties"]["Row"]> & {
          slug: string;
          title: string;
          location: string;
          market: string;
          property_type: string;
          price_label: string;
        };
        Update: Partial<Database["public"]["Tables"]["properties"]["Row"]>;
        Relationships: [];
      };
      workspace_settings: {
        Row: {
          id: number;
          agency_name: string;
          support_email: string;
          timezone: string;
          default_visibility: "draft" | "review" | "live" | "archived";
          notification_mode: "email" | "in-app" | "both";
          auto_approve_media: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["workspace_settings"]["Row"]> & {
          id?: number;
        };
        Update: Partial<Database["public"]["Tables"]["workspace_settings"]["Row"]>;
        Relationships: [];
      };
      property_images: {
        Row: {
          id: string;
          property_id: string;
          url: string;
          alt: string;
          sort_order: number;
          storage_path: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["property_images"]["Row"]> & {
          property_id: string;
          url: string;
        };
        Update: Partial<Database["public"]["Tables"]["property_images"]["Row"]>;
        Relationships: [];
      };
      saved_properties: {
        Row: {
          user_id: string;
          property_id: string;
          created_at: string;
        };
        Insert: Database["public"]["Tables"]["saved_properties"]["Row"];
        Update: Partial<Database["public"]["Tables"]["saved_properties"]["Row"]>;
        Relationships: [];
      };
      transactions: {
        Row: {
          id: string;
          property_id: string | null;
          lead_id: string | null;
          agent_id: string | null;
          amount: number | null;
          amount_label: string;
          status: "offer" | "diligence" | "contract" | "closed" | "lost";
          target_close_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["transactions"]["Row"]> & {
          amount_label: string;
        };
        Update: Partial<Database["public"]["Tables"]["transactions"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
