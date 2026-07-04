# EstatePilot Handoff

## What is in place

- Public luxury homepage, listings, property detail, smart finder, favorites, and AI assistant surfaces.
- Internal dashboard with overview, properties, agents, leads, transactions, appointments, settings, and activity.
- Supabase-backed auth, listings, inquiries, saved homes, media, workspace settings, activity logs, and appointment scheduling.
- OpenRouter-ready AI routes with local fallbacks.
- Mapbox-backed map previews with interactive public and dashboard map surfaces.

## Manual test checklist

1. Open `/` and verify the homepage hero, search module, featured homes, CTA, and footer render cleanly.
2. Open `/listings`, filter several combinations, and confirm the map/list sync updates.
3. Open `/properties/[slug]`, test the inquiry form, saved-home button, AI assistant, and map preview.
4. Open `/smart-finder` and confirm the query-to-ranked-home flow works with local fallback.
5. Sign in and open `/dashboard`, `/dashboard/properties`, `/dashboard/appointments`, and `/dashboard/activity`.
6. Test the appointment scheduler and confirm the new entry appears in the dashboard list.
7. Confirm auth surfaces are split into `/auth/login`, `/auth/signup`, and `/auth/admin`.

## Known gaps

- AI and map experiences still fall back to local/demo behavior when provider keys are absent or invalid.
- Email delivery depends on the configured mail provider environment variables.
- Public saved homes sync to Supabase only when the user is authenticated.
- Production deployment still needs the live Vercel/Supabase environment to be exercised end to end.

