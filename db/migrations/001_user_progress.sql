-- WordLoop: per-user learning progress, one row per user and word.
-- Run once in the Neon SQL Editor (runs as the database owner).
-- Safe to run again: every statement checks whether its object already exists.
-- Afterwards, open Data API in the Neon Console and click "Refresh schema cache",
-- otherwise the Data API may answer "Could not find the table 'public.user_progress'".

create table if not exists public.user_progress (
  user_id       text        not null default auth.user_id(),
  word_id       text        not null,
  learned_on    date        not null,
  due_on        date        not null,
  interval_days integer     not null check (interval_days > 0),
  review_count  integer     not null check (review_count > 0),
  last_rating   text        not null check (last_rating in ('hard', 'medium', 'easy')),
  updated_at    timestamptz not null default now(),
  primary key (user_id, word_id)
);

-- Each user can only read and change their own rows.
-- auth.user_id() is the signed-in user's id, taken from the Neon Auth token.
alter table public.user_progress enable row level security;

drop policy if exists "Users manage their own progress" on public.user_progress;
create policy "Users manage their own progress"
  on public.user_progress
  for all
  to authenticated
  using (user_id = auth.user_id())
  with check (user_id = auth.user_id());

-- Signed-in users (via the Data API) may use the table; RLS above limits them to their rows.
-- Signed-out users get no access.
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.user_progress to authenticated;
revoke all on public.user_progress from anonymous;
