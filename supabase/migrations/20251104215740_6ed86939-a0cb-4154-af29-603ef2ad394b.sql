-- Create admin_actions table for audit trail
create table if not exists public.admin_actions (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references auth.users(id) on delete set null,
  target_user_id uuid references auth.users(id) on delete set null,
  action_type text not null check (action_type in ('reset_password', 'ban_user', 'unban_user', 'grant_admin', 'remove_admin', 'send_magic_link')),
  reason text,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.admin_actions enable row level security;

-- Only admins can view admin actions
create policy "Admins can view all admin actions"
on public.admin_actions
for select
to authenticated
using (has_role(auth.uid(), 'admin'));

-- Only admins can insert admin actions (handled by edge function, but good to have policy)
create policy "Admins can insert admin actions"
on public.admin_actions
for insert
to authenticated
with check (has_role(auth.uid(), 'admin'));

-- Create index for faster queries
create index idx_admin_actions_admin_id on public.admin_actions(admin_id);
create index idx_admin_actions_target_user_id on public.admin_actions(target_user_id);
create index idx_admin_actions_created_at on public.admin_actions(created_at desc);