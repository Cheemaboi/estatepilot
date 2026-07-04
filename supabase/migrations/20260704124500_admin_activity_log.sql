create table public.admin_activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  entity_type text not null,
  entity_slug text,
  action text not null,
  summary text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index admin_activity_logs_created_at_idx
on public.admin_activity_logs(created_at desc);

create index admin_activity_logs_actor_id_idx
on public.admin_activity_logs(actor_id);

alter table public.admin_activity_logs enable row level security;

create policy "Admins can read activity logs"
on public.admin_activity_logs for select
to authenticated
using (public.current_user_role() = 'admin');

create policy "Admins can insert activity logs"
on public.admin_activity_logs for insert
to authenticated
with check (public.current_user_role() = 'admin');
