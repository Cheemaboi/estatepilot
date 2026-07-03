insert into public.agents (display_name, title, email, phone, market, status, bio, pipeline_value)
values
  ('Maya Sterling', 'Luxury estates advisor', 'maya@estatepilot.demo', '+1 (310) 555-0184', 'Malibu', 'active', 'Coastal estates specialist focused on private view properties.', 22400000),
  ('Noah Vale', 'Austin market principal', 'noah@estatepilot.demo', '+1 (512) 555-0149', 'Austin', 'active', 'Modern villa and family compound advisor.', 13800000),
  ('Elena Park', 'Manhattan penthouse specialist', 'elena@estatepilot.demo', '+1 (212) 555-0177', 'New York', 'active', 'Urban luxury specialist for full-floor residences.', 31200000),
  ('Iris Chen', 'Miami waterfront advisor', 'iris@estatepilot.demo', '+1 (305) 555-0112', 'Miami', 'onboarding', 'Waterfront and new-development advisor.', 9600000)
on conflict do nothing;

with agent_refs as (
  select id, display_name from public.agents
),
inserted_properties as (
  insert into public.properties (
    slug,
    title,
    description,
    location,
    market,
    property_type,
    status,
    price,
    price_label,
    beds,
    baths,
    area_sqft,
    tag,
    hero_image,
    amenities,
    featured,
    agent_id
  )
  values
    (
      'glass-ridge-estate',
      'Glass Ridge Estate',
      'A cinematic cliffside estate with layered terraces, floor-to-ceiling glass, and resort-grade entertaining spaces oriented toward the Pacific.',
      'Malibu, California',
      'Malibu',
      'Private estate',
      'live',
      8900000,
      '$8.9M',
      6,
      7,
      8240,
      'Ocean View',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      array['Infinity pool', 'Wine room', 'Private cinema', 'Guest pavilion'],
      true,
      (select id from agent_refs where display_name = 'Maya Sterling')
    ),
    (
      'crescent-garden-villa',
      'Crescent Garden Villa',
      'A warm modern villa wrapped around a quiet courtyard, designed for indoor-outdoor living and polished daily comfort.',
      'Austin, Texas',
      'Austin',
      'Garden villa',
      'review',
      3400000,
      '$3.4M',
      5,
      5,
      5180,
      'Private Courtyard',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      array['Chef kitchen', 'Courtyard pool', 'Studio suite', 'Three-car garage'],
      true,
      (select id from agent_refs where display_name = 'Noah Vale')
    ),
    (
      'hudson-penthouse',
      'Hudson Penthouse',
      'A full-floor residence with city-facing terraces, gallery walls, and a quiet private wing above the Hudson corridor.',
      'New York, New York',
      'New York',
      'Penthouse',
      'live',
      6200000,
      '$6.2M',
      4,
      4,
      3910,
      'Skyline Terrace',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
      array['Doorman', 'Private elevator', 'Roof terrace', 'Wellness room'],
      true,
      (select id from agent_refs where display_name = 'Elena Park')
    ),
    (
      'harbor-court-residence',
      'Harbor Court Residence',
      'A composed waterfront residence with gallery-style interiors and private dock access.',
      'Miami, Florida',
      'Miami',
      'Waterfront residence',
      'draft',
      4800000,
      '$4.8M',
      5,
      5,
      4620,
      'Waterfront',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80',
      array['Private dock', 'Media lounge', 'Summer kitchen', 'Guest suite'],
      false,
      (select id from agent_refs where display_name = 'Iris Chen')
    )
  on conflict (slug) do update set
    title = excluded.title,
    description = excluded.description,
    location = excluded.location,
    market = excluded.market,
    property_type = excluded.property_type,
    status = excluded.status,
    price = excluded.price,
    price_label = excluded.price_label,
    beds = excluded.beds,
    baths = excluded.baths,
    area_sqft = excluded.area_sqft,
    tag = excluded.tag,
    hero_image = excluded.hero_image,
    amenities = excluded.amenities,
    featured = excluded.featured,
    agent_id = excluded.agent_id
  returning id, slug
)
insert into public.property_images (property_id, url, alt, sort_order)
select inserted_properties.id, image.url, image.alt, image.sort_order
from inserted_properties
cross join lateral (
  values
    ('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=80', inserted_properties.slug || ' gallery image', 1),
    ('https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=900&q=80', inserted_properties.slug || ' secondary image', 2)
) as image(url, alt, sort_order)
on conflict do nothing;

insert into public.leads (full_name, email, budget_label, source, stage, property_id, assigned_agent_id, notes)
select
  seed.full_name,
  seed.email,
  seed.budget_label,
  seed.source,
  seed.stage,
  properties.id,
  agents.id,
  seed.notes
from (
  values
    ('Amelia Hart', 'amelia@example.com', '$8M+', 'Smart Finder', 'tour_scheduled'::public.lead_stage, 'glass-ridge-estate', 'Maya Sterling', 'Requested a private morning showing.'),
    ('Daniel Reed', 'daniel@example.com', '$5M - $7M', 'Listing page', 'qualified'::public.lead_stage, 'hudson-penthouse', 'Elena Park', 'Prefers outdoor space and doorman building.'),
    ('Priya Shah', 'priya@example.com', '$3M - $4M', 'Homepage search', 'new_inquiry'::public.lead_stage, 'crescent-garden-villa', 'Noah Vale', 'Needs home office and guest suite.'),
    ('Marcus Lane', 'marcus@example.com', '$4M+', 'Agent referral', 'negotiation'::public.lead_stage, 'harbor-court-residence', 'Iris Chen', 'Interested in dock access.')
) as seed(full_name, email, budget_label, source, stage, property_slug, agent_name, notes)
join public.properties on properties.slug = seed.property_slug
join public.agents on agents.display_name = seed.agent_name
on conflict do nothing;

insert into public.inquiries (property_id, full_name, email, phone, message, preferred_date, status)
select properties.id, 'Amelia Hart', 'amelia@example.com', '+1 (555) 013-4481', 'I would like to schedule a private tour this week.', current_date + 3, 'new'
from public.properties
where slug = 'glass-ridge-estate'
on conflict do nothing;

insert into public.appointments (property_id, lead_id, agent_id, title, scheduled_at, status, notes)
select properties.id, leads.id, agents.id, 'Private showing', now() + interval '2 days', 'scheduled', 'Prepare sunset tour route.'
from public.properties
join public.leads on leads.property_id = properties.id
join public.agents on agents.id = leads.assigned_agent_id
where properties.slug = 'glass-ridge-estate'
on conflict do nothing;

insert into public.transactions (property_id, lead_id, agent_id, amount, amount_label, status, target_close_date)
select properties.id, leads.id, agents.id, 8700000, '$8.7M', 'diligence', current_date + 28
from public.properties
join public.leads on leads.property_id = properties.id
join public.agents on agents.id = leads.assigned_agent_id
where properties.slug = 'glass-ridge-estate'
on conflict do nothing;
