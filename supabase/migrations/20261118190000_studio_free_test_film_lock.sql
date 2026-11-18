create table if not exists public.studio_trials (
  user_id uuid primary key references auth.users(id) on delete cascade,
  claimed_at timestamptz not null default now()
);
alter table public.studio_trials enable row level security;
create policy "own trial row readable" on public.studio_trials for select to authenticated using (user_id = auth.uid());

create or replace function public.claim_studio_trial()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare uid uuid := auth.uid();
begin
  if uid is null then return false; end if;
  insert into public.studio_trials(user_id) values (uid) on conflict do nothing;
  return found;
end;
$$;
revoke all on function public.claim_studio_trial() from public, anon;
grant execute on function public.claim_studio_trial() to authenticated;
