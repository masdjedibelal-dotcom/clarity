-- Tabelle für Tagesstart / Tagesabschluss (daily_reflections)
-- In Supabase SQL Editor ausführen.

create table if not exists public.daily_reflections (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  plan_id    uuid references public.user_day_plan(id) on delete set null,
  type       text not null check (type in ('start', 'close')),
  content    text,
  date       date not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, plan_id, type, date)
);

-- RLS
alter table public.daily_reflections enable row level security;

create policy "Users can manage own reflections"
  on public.daily_reflections for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Optional: Index für Abfragen nach user + date
create index if not exists idx_daily_reflections_user_date
  on public.daily_reflections (user_id, date);
