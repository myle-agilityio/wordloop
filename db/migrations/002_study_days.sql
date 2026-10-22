-- WordLoop: the days each user studied, one row per user and day. Used for the study streak.
-- Run once in the Neon SQL Editor (runs as the database owner), after 001_user_progress.sql.
-- Safe to run again: every statement checks whether its object already exists.
-- Afterwards, open Data API in the Neon Console and click "Refresh schema cache",
-- otherwise the Data API may answer "Could not find the table 'public.study_days'".

create table if not exists public.study_days (
  user_id    text        not null default auth.user_id(),
  day        date        not null,
  created_at timestamptz not null default now(),
  primary key (user_id, day)
);

-- Seed from existing progress, so users who studied before this table existed keep the days they learned words.
insert into public.study_days (user_id, day)
select distinct user_id, learned_on from public.user_progress
on conflict do nothing;

-- Each user can only read and change their own rows.
alter table public.study_days enable row level security;

drop policy if exists "Users manage their own study days" on public.study_days;
create policy "Users manage their own study days"
  on public.study_days
  for all
  to authenticated
  using (user_id = auth.user_id())
  with check (user_id = auth.user_id());

-- Signed-in users (via the Data API) may use the table; RLS above limits them to their rows.
-- Signed-out users get no access.
grant select, insert, update, delete on public.study_days to authenticated;
revoke all on public.study_days from anonymous;
