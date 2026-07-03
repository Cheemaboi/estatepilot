create extension if not exists pgcrypto;

create type public.user_role as enum ('visitor', 'agent', 'admin');
create type public.agent_status as enum ('active', 'onboarding', 'inactive');
create type public.property_status as enum ('draft', 'review', 'live', 'archived');
create type public.lead_stage as enum ('new_inquiry', 'qualified', 'tour_scheduled', 'negotiation', 'closed', 'lost');
create type public.inquiry_status as enum ('new', 'contacted', 'converted', 'closed');
create type public.appointment_status as enum ('scheduled', 'completed', 'cancelled');
create type public.transaction_status as enum ('offer', 'diligence', 'contract', 'closed', 'lost');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role public.user_role not null default 'visitor',
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.agents (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  display_name text not null,
  title text not null default 'Luxury property advisor',
  email text,
  phone text,
  market text not null,
  status public.agent_status not null default 'active',
  bio text,
  pipeline_value numeric(14, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  location text not null,
  market text not null,
  property_type text not null,
  status public.property_status not null default 'draft',
  price numeric(14, 2),
  price_label text not null,
  beds integer not null default 0,
  baths numeric(4, 1) not null default 0,
  area_sqft integer,
  tag text,
  hero_image text,
  amenities text[] not null default '{}',
  featured boolean not null default false,
  agent_id uuid references public.agents(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  url text not null,
  alt text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  budget_label text,
  source text not null default 'Website',
  stage public.lead_stage not null default 'new_inquiry',
  property_id uuid references public.properties(id) on delete set null,
  assigned_agent_id uuid references public.agents(id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties(id) on delete set null,
  full_name text not null,
  email text not null,
  phone text,
  message text,
  preferred_date date,
  status public.inquiry_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties(id) on delete set null,
  lead_id uuid references public.leads(id) on delete set null,
  agent_id uuid references public.agents(id) on delete set null,
  title text not null,
  scheduled_at timestamptz not null,
  status public.appointment_status not null default 'scheduled',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties(id) on delete set null,
  lead_id uuid references public.leads(id) on delete set null,
  agent_id uuid references public.agents(id) on delete set null,
  amount numeric(14, 2),
  amount_label text not null,
  status public.transaction_status not null default 'offer',
  target_close_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.saved_properties (
  user_id uuid not null references public.profiles(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, property_id)
);

create index properties_status_featured_idx on public.properties(status, featured);
create index properties_slug_idx on public.properties(slug);
create index property_images_property_id_idx on public.property_images(property_id);
create index leads_assigned_agent_id_idx on public.leads(assigned_agent_id);
create index inquiries_property_id_idx on public.inquiries(property_id);
create index appointments_agent_id_scheduled_at_idx on public.appointments(agent_id, scheduled_at);
create index transactions_agent_id_idx on public.transactions(agent_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger agents_set_updated_at
before update on public.agents
for each row execute function public.set_updated_at();

create trigger properties_set_updated_at
before update on public.properties
for each row execute function public.set_updated_at();

create trigger leads_set_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

create trigger inquiries_set_updated_at
before update on public.inquiries
for each row execute function public.set_updated_at();

create trigger appointments_set_updated_at
before update on public.appointments
for each row execute function public.set_updated_at();

create trigger transactions_set_updated_at
before update on public.transactions
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    'visitor'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.current_user_agent_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.agents where profile_id = auth.uid() limit 1;
$$;

alter table public.profiles enable row level security;
alter table public.agents enable row level security;
alter table public.properties enable row level security;
alter table public.property_images enable row level security;
alter table public.leads enable row level security;
alter table public.inquiries enable row level security;
alter table public.appointments enable row level security;
alter table public.transactions enable row level security;
alter table public.saved_properties enable row level security;

create policy "Public can read live agents"
on public.agents for select
to anon, authenticated
using (
  exists (
    select 1 from public.properties
    where properties.agent_id = agents.id
    and properties.status = 'live'
  )
  or public.current_user_role() in ('agent', 'admin')
);

create policy "Admins can manage agents"
on public.agents for all
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "Users can read their own profile"
on public.profiles for select
to authenticated
using (auth.uid() is not null and id = auth.uid());

create policy "Admins can read all profiles"
on public.profiles for select
to authenticated
using (public.current_user_role() = 'admin');

create policy "Users can update their own profile"
on public.profiles for update
to authenticated
using (auth.uid() is not null and id = auth.uid())
with check (auth.uid() is not null and id = auth.uid());

create policy "Public can read live properties"
on public.properties for select
to anon, authenticated
using (status = 'live' or public.current_user_role() in ('agent', 'admin'));

create policy "Agents and admins can insert properties"
on public.properties for insert
to authenticated
with check (public.current_user_role() in ('agent', 'admin'));

create policy "Agents can update assigned properties and admins can update all"
on public.properties for update
to authenticated
using (
  public.current_user_role() = 'admin'
  or agent_id = public.current_user_agent_id()
)
with check (
  public.current_user_role() = 'admin'
  or agent_id = public.current_user_agent_id()
);

create policy "Admins can delete properties"
on public.properties for delete
to authenticated
using (public.current_user_role() = 'admin');

create policy "Public can read live property images"
on public.property_images for select
to anon, authenticated
using (
  exists (
    select 1 from public.properties
    where properties.id = property_images.property_id
    and (
      properties.status = 'live'
      or public.current_user_role() in ('agent', 'admin')
    )
  )
);

create policy "Agents and admins can manage property images"
on public.property_images for all
to authenticated
using (public.current_user_role() in ('agent', 'admin'))
with check (public.current_user_role() in ('agent', 'admin'));

create policy "Agents and admins can read leads"
on public.leads for select
to authenticated
using (
  public.current_user_role() = 'admin'
  or assigned_agent_id = public.current_user_agent_id()
);

create policy "Agents and admins can manage leads"
on public.leads for all
to authenticated
using (
  public.current_user_role() = 'admin'
  or assigned_agent_id = public.current_user_agent_id()
)
with check (
  public.current_user_role() = 'admin'
  or assigned_agent_id = public.current_user_agent_id()
);

create policy "Anyone can create inquiries"
on public.inquiries for insert
to anon, authenticated
with check (true);

create policy "Agents and admins can read inquiries"
on public.inquiries for select
to authenticated
using (
  public.current_user_role() = 'admin'
  or exists (
    select 1 from public.properties
    where properties.id = inquiries.property_id
    and properties.agent_id = public.current_user_agent_id()
  )
);

create policy "Agents and admins can update inquiries"
on public.inquiries for update
to authenticated
using (
  public.current_user_role() = 'admin'
  or exists (
    select 1 from public.properties
    where properties.id = inquiries.property_id
    and properties.agent_id = public.current_user_agent_id()
  )
)
with check (
  public.current_user_role() = 'admin'
  or exists (
    select 1 from public.properties
    where properties.id = inquiries.property_id
    and properties.agent_id = public.current_user_agent_id()
  )
);

create policy "Agents and admins can manage appointments"
on public.appointments for all
to authenticated
using (
  public.current_user_role() = 'admin'
  or agent_id = public.current_user_agent_id()
)
with check (
  public.current_user_role() = 'admin'
  or agent_id = public.current_user_agent_id()
);

create policy "Agents and admins can manage transactions"
on public.transactions for all
to authenticated
using (
  public.current_user_role() = 'admin'
  or agent_id = public.current_user_agent_id()
)
with check (
  public.current_user_role() = 'admin'
  or agent_id = public.current_user_agent_id()
);

create policy "Users can manage their saved properties"
on public.saved_properties for all
to authenticated
using (auth.uid() is not null and user_id = auth.uid())
with check (auth.uid() is not null and user_id = auth.uid());

insert into storage.buckets (id, name, public)
values ('property-media', 'property-media', true)
on conflict (id) do nothing;

create policy "Public can read property media"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'property-media');

create policy "Agents and admins can upload property media"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'property-media'
  and public.current_user_role() in ('agent', 'admin')
);

create policy "Agents and admins can update property media"
on storage.objects for update
to authenticated
using (
  bucket_id = 'property-media'
  and public.current_user_role() in ('agent', 'admin')
)
with check (
  bucket_id = 'property-media'
  and public.current_user_role() in ('agent', 'admin')
);
