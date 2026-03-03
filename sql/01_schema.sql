-- ============================================================
-- CLARITY APP – Supabase Schema
-- Ausführen in: Supabase > SQL Editor
-- ============================================================

-- ── EXTENSIONS ──────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── USER PROFILE ────────────────────────────────────────────
create table if not exists public.user_profile (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  name        text,
  avatar_url  text,
  created_at  timestamptz default now()
);

-- ── INNER ITEMS (Katalog) ────────────────────────────────────
create table if not exists public.inner_values (
  id          uuid primary key default uuid_generate_v4(),
  label       text not null,
  description text,
  icon        text,
  sort_order  int default 0
);

create table if not exists public.inner_strengths (
  id          uuid primary key default uuid_generate_v4(),
  label       text not null,
  description text,
  icon        text,
  sort_order  int default 0
);

create table if not exists public.inner_drivers (
  id          uuid primary key default uuid_generate_v4(),
  label       text not null,
  description text,
  icon        text,
  sort_order  int default 0
);

create table if not exists public.inner_personality_dimensions (
  id          uuid primary key default uuid_generate_v4(),
  label       text not null,
  low_label   text,
  high_label  text,
  description text,
  sort_order  int default 0
);

-- ── USER SELECTIONS ──────────────────────────────────────────
create table if not exists public.user_selections_values (
  id       uuid primary key default uuid_generate_v4(),
  user_id  uuid references auth.users(id) on delete cascade,
  item_id  uuid references public.inner_values(id),
  unique(user_id, item_id)
);

create table if not exists public.user_selections_strengths (
  id       uuid primary key default uuid_generate_v4(),
  user_id  uuid references auth.users(id) on delete cascade,
  item_id  uuid references public.inner_strengths(id),
  unique(user_id, item_id)
);

create table if not exists public.user_selections_drivers (
  id       uuid primary key default uuid_generate_v4(),
  user_id  uuid references auth.users(id) on delete cascade,
  item_id  uuid references public.inner_drivers(id),
  unique(user_id, item_id)
);

create table if not exists public.user_personality_levels (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete cascade,
  dimension_id uuid references public.inner_personality_dimensions(id),
  level       int default 1 check (level between 0 and 2),
  unique(user_id, dimension_id)
);

-- ── MISSION STATEMENT ────────────────────────────────────────
create table if not exists public.user_mission_statement (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references auth.users(id) on delete cascade unique,
  content    text not null,
  updated_at timestamptz default now()
);

-- ── IDENTITY ────────────────────────────────────────────────
create table if not exists public.identity_pillars (
  id    uuid primary key default uuid_generate_v4(),
  label text not null,
  icon  text,
  sort_order int default 0
);

create table if not exists public.identity_roles (
  id         uuid primary key default uuid_generate_v4(),
  pillar_id  uuid references public.identity_pillars(id),
  label      text not null,
  description text,
  sort_order int default 0
);

create table if not exists public.user_identity_selections (
  id       uuid primary key default uuid_generate_v4(),
  user_id  uuid references auth.users(id) on delete cascade,
  role_id  uuid references public.identity_roles(id),
  score    int default 5 check (score between 1 and 10),
  unique(user_id, role_id)
);

-- ── KNOWLEDGE SNACKS ─────────────────────────────────────────
create table if not exists public.knowledge_snacks (
  id                uuid primary key default uuid_generate_v4(),
  title             text not null,
  preview           text,
  content           text,
  tags              text[],
  loop_area         text check (loop_area in ('load','output','off','progress')),
  read_time_minutes int default 3,
  created_at        timestamptz default now()
);

create table if not exists public.user_saved_snacks (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references auth.users(id) on delete cascade,
  snack_id   uuid references public.knowledge_snacks(id),
  saved_at   timestamptz default now(),
  unique(user_id, snack_id)
);

-- ── DAY PLAN ─────────────────────────────────────────────────
create table if not exists public.day_plan_blocks (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references auth.users(id) on delete cascade,
  date       date not null,
  title      text not null,
  block_type text default 'custom',
  time_start text,
  time_end   text,
  color      text,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists public.day_plan_items (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references auth.users(id) on delete cascade,
  block_id   uuid references public.day_plan_blocks(id) on delete cascade,
  date       date not null,
  item_type  text check (item_type in ('todo','appointment','habit','method')),
  title      text not null,
  done       boolean default false,
  time_start text,
  priority   int default 1,
  notes      text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ── HABITS ──────────────────────────────────────────────────
create table if not exists public.user_habits (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete cascade,
  title       text not null,
  loop_area   text,
  frequency   text default 'daily',
  active      boolean default true,
  created_at  timestamptz default now()
);

create table if not exists public.habit_logs (
  id        uuid primary key default uuid_generate_v4(),
  user_id   uuid references auth.users(id) on delete cascade,
  habit_id  uuid references public.user_habits(id) on delete cascade,
  date      date not null,
  done      boolean default false,
  unique(user_id, habit_id, date)
);

-- ── RLS POLICIES ─────────────────────────────────────────────
alter table public.user_profile             enable row level security;
alter table public.user_selections_values   enable row level security;
alter table public.user_selections_strengths enable row level security;
alter table public.user_selections_drivers  enable row level security;
alter table public.user_personality_levels  enable row level security;
alter table public.user_mission_statement   enable row level security;
alter table public.user_identity_selections enable row level security;
alter table public.user_saved_snacks        enable row level security;
alter table public.day_plan_blocks          enable row level security;
alter table public.day_plan_items           enable row level security;
alter table public.user_habits              enable row level security;
alter table public.habit_logs               enable row level security;

-- Helper: current user owns row
create or replace function public.uid() returns uuid as $$
  select auth.uid();
$$ language sql stable;

-- Policies – user_profile
create policy "own profile" on public.user_profile for all using (id = uid());

-- Policies – user_selections
create policy "own values"    on public.user_selections_values    for all using (user_id = uid());
create policy "own strengths" on public.user_selections_strengths for all using (user_id = uid());
create policy "own drivers"   on public.user_selections_drivers   for all using (user_id = uid());
create policy "own personality" on public.user_personality_levels for all using (user_id = uid());

-- Policies – mission
create policy "own mission" on public.user_mission_statement for all using (user_id = uid());

-- Policies – identity
create policy "own identity" on public.user_identity_selections for all using (user_id = uid());

-- Policies – knowledge
create policy "own saved" on public.user_saved_snacks for all using (user_id = uid());

-- Policies – day plan
create policy "own blocks" on public.day_plan_blocks for all using (user_id = uid());
create policy "own items"  on public.day_plan_items  for all using (user_id = uid());

-- Policies – habits
create policy "own habits" on public.user_habits for all using (user_id = uid());
create policy "own logs"   on public.habit_logs   for all using (user_id = uid());

-- Public read for catalog tables
alter table public.inner_values                  enable row level security;
alter table public.inner_strengths               enable row level security;
alter table public.inner_drivers                 enable row level security;
alter table public.inner_personality_dimensions  enable row level security;
alter table public.identity_pillars              enable row level security;
alter table public.identity_roles                enable row level security;
alter table public.knowledge_snacks              enable row level security;

create policy "public read values"       on public.inner_values                 for select using (true);
create policy "public read strengths"    on public.inner_strengths              for select using (true);
create policy "public read drivers"      on public.inner_drivers                for select using (true);
create policy "public read personality"  on public.inner_personality_dimensions for select using (true);
create policy "public read pillars"      on public.identity_pillars             for select using (true);
create policy "public read roles"        on public.identity_roles               for select using (true);
create policy "public read snacks"       on public.knowledge_snacks             for select using (true);

-- ── TRIGGER: auto-create profile on signup ──────────────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profile (id, email)
  values (new.id, new.email)
  on conflict do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
