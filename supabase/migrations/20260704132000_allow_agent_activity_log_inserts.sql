drop policy if exists "Admins can insert activity logs" on public.admin_activity_logs;

create policy "Agents and admins can insert activity logs"
on public.admin_activity_logs for insert
to authenticated
with check (public.current_user_role() in ('agent', 'admin'));

