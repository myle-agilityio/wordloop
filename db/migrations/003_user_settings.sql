-- WordLoop: each user's review settings (new words per day and review gaps), one row per user.
-- Run once in the Neon SQL Editor (runs as the database owner), after 002_study_days.sql.
-- Safe to run again: every statement checks whether its object already exists.
-- Afterwards, open Data API in the Neon Console and click "Refresh schema cache",
-- otherwise the Data API may answer "Could not find the table 'public.user_settings'".
-- Users without a row use the defaults in src/constants/srs.ts.

create table if not exists public.user_settings (
  user_id                    text         not null default auth.user_id() primary key,
  new_words_per_day          integer      not null check (new_words_per_day between 0 and 100),
  hard_first_interval_days   integer      not null check (hard_first_interval_days between 1 and 36500),
  medium_first_interval_days integer      not null check (medium_first_interval_days between 1 and 36500),
  easy_first_interval_days   integer      not null check (easy_first_interval_days between 1 and 36500),
  medium_multiplier          numeric(4,2) not null check (medium_multiplier between 1 and 10),
  easy_multiplier            numeric(4,2) not null check (easy_multiplier between 1 and 10),
  max_interval_days          integer      not null check (max_interval_days between 1 and 36500),
  updated_at                 timestamptz  not null default now(),
  -- Same rules as the Settings page: an easier rating never brings a word back sooner.
  check (hard_first_interval_days <= medium_first_interval_days),
  check (medium_first_interval_days <= easy_first_interval_days),
  check (medium_multiplier <= easy_multiplier),
  check (easy_first_interval_days <= max_interval_days)
);

-- Each user can only read and change their own row.
alter table public.user_settings enable row level security;

drop policy if exists "Users manage their own settings" on public.user_settings;
create policy "Users manage their own settings"
  on public.user_settings
  for all
  to authenticated
  using (user_id = auth.user_id())
  with check (user_id = auth.user_id());

-- Signed-in users (via the Data API) may use the table; RLS above limits them to their row.
-- Signed-out users get no access.
grant select, insert, update, delete on public.user_settings to authenticated;
revoke all on public.user_settings from anonymous;
