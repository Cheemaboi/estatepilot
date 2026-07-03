# EstatePilot Supabase Schema

Phase 4 introduces the first versioned backend schema in `supabase/migrations`.

## Tables

- `profiles`: one row per `auth.users` account, with `visitor`, `agent`, or `admin` role.
- `agents`: public-facing and internal agent records, optionally linked to a profile.
- `properties`: main listing records with public status, price, facts, amenities, and assigned agent.
- `property_images`: ordered media records for a property.
- `leads`: CRM leads assigned to agents and optionally tied to a property.
- `inquiries`: public inquiry submissions from property pages.
- `appointments`: scheduled tours, reviews, and meetings.
- `transactions`: active deal pipeline records.
- `saved_properties`: visitor/user saved listing join table.

## Relationships

- `profiles.id` references `auth.users.id`.
- `agents.profile_id` references `profiles.id`.
- `properties.agent_id` references `agents.id`.
- `property_images.property_id` references `properties.id`.
- `leads.property_id` references `properties.id`.
- `leads.assigned_agent_id` references `agents.id`.
- `inquiries.property_id` references `properties.id`.
- `appointments.property_id`, `appointments.lead_id`, and `appointments.agent_id` connect calendar activity.
- `transactions.property_id`, `transactions.lead_id`, and `transactions.agent_id` connect deal flow.
- `saved_properties` joins users to properties.

## RLS Summary

- Public users can read only live properties, live property images, and agents attached to live listings.
- Anyone can insert an inquiry.
- Authenticated users can read/update their own profile.
- Admins can manage agents and all properties.
- Agents can manage assigned properties and related CRM records.
- Saved properties are restricted to the owning authenticated user.
- The `property-media` storage bucket is public-readable; uploads and updates are restricted to agents/admins.

## App Boundary

The app uses `@supabase/ssr` clients in `src/lib/supabase`.
Server data adapters fall back to mock data when Supabase environment variables are missing, so local builds remain stable before a project is linked.
