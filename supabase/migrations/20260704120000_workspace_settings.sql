create table public.workspace_settings (
  id integer primary key default 1,
  agency_name text not null default 'EstatePilot Agency',
  support_email text not null default 'team@estatepilot.co',
  timezone text not null default 'America/Los_Angeles',
  default_visibility public.property_status not null default 'review',
  notification_mode text not null default 'both',
  auto_approve_media boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint workspace_settings_singleton check (id = 1),
  constraint workspace_settings_notification_mode_check check (
    notification_mode in ('email', 'in-app', 'both')
  )
);

insert into public.workspace_settings (id)
values (1)
on conflict (id) do nothing;

create trigger workspace_settings_set_updated_at
before update on public.workspace_settings
for each row execute function public.set_updated_at();

alter table public.workspace_settings enable row level security;

create policy "Admins can read workspace settings"
on public.workspace_settings for select
to authenticated
using (public.current_user_role() = 'admin');

create policy "Admins can update workspace settings"
on public.workspace_settings for update
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');
