-- UnseenGo AI — Phase 2A Database Schema
-- Run this file in the Supabase SQL Editor.
-- Scope: cities, places, accommodations, profiles, reviews, saved places.

create extension if not exists pgcrypto;

create table if not exists public.cities (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  state text not null,
  region text,
  description text,
  history text,
  image_url text,
  latitude double precision,
  longitude double precision,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id) on delete cascade,
  name text not null,
  category text not null,
  description text,
  history text,
  image_url text,
  latitude double precision,
  longitude double precision,
  map_url text,
  is_hidden_gem boolean not null default false,
  is_famous boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(city_id, name)
);

create index if not exists places_city_id_idx on public.places(city_id);
create index if not exists places_category_idx on public.places(category);
create index if not exists places_hidden_gem_idx on public.places(is_hidden_gem);

create table if not exists public.accommodations (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id) on delete cascade,
  area text not null,
  stay_type text not null,
  budget_band text,
  description text,
  map_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(city_id, area, stay_type)
);

create index if not exists accommodations_city_id_idx on public.accommodations(city_id);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  place_id uuid not null references public.places(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  title text,
  body text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reviews_place_id_idx on public.reviews(place_id);
create index if not exists reviews_user_id_idx on public.reviews(user_id);
create index if not exists reviews_status_idx on public.reviews(status);

create table if not exists public.saved_places (
  user_id uuid not null references auth.users(id) on delete cascade,
  place_id uuid not null references public.places(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(user_id, place_id)
);

-- Keep updated_at current.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists cities_updated_at on public.cities;
create trigger cities_updated_at before update on public.cities for each row execute function public.set_updated_at();
drop trigger if exists places_updated_at on public.places;
create trigger places_updated_at before update on public.places for each row execute function public.set_updated_at();
drop trigger if exists accommodations_updated_at on public.accommodations;
create trigger accommodations_updated_at before update on public.accommodations for each row execute function public.set_updated_at();
drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists reviews_updated_at on public.reviews;
create trigger reviews_updated_at before update on public.reviews for each row execute function public.set_updated_at();

-- Automatically create a profile after a new Auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Row Level Security.
alter table public.cities enable row level security;
alter table public.places enable row level security;
alter table public.accommodations enable row level security;
alter table public.profiles enable row level security;
alter table public.reviews enable row level security;
alter table public.saved_places enable row level security;

-- Public visitors can read active tourism data.
drop policy if exists "public read active cities" on public.cities;
create policy "public read active cities" on public.cities for select using (is_active = true);
drop policy if exists "public read active places" on public.places;
create policy "public read active places" on public.places for select using (is_active = true);
drop policy if exists "public read accommodations" on public.accommodations;
create policy "public read accommodations" on public.accommodations for select using (true);

-- Profiles: a signed-in user can read/update their own profile.
drop policy if exists "users read own profile" on public.profiles;
create policy "users read own profile" on public.profiles for select to authenticated using (auth.uid() = id);
drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- Reviews: everyone can read approved reviews; users manage their own reviews.
drop policy if exists "public read approved reviews" on public.reviews;
create policy "public read approved reviews" on public.reviews for select using (status = 'approved' or auth.uid() = user_id);
drop policy if exists "users create reviews" on public.reviews;
create policy "users create reviews" on public.reviews for insert to authenticated with check (auth.uid() = user_id and status = 'pending');
drop policy if exists "users update own reviews" on public.reviews;
create policy "users update own reviews" on public.reviews for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "users delete own reviews" on public.reviews;
create policy "users delete own reviews" on public.reviews for delete to authenticated using (auth.uid() = user_id);

-- Saved places: only the owner can manage them.
drop policy if exists "users read own saved places" on public.saved_places;
create policy "users read own saved places" on public.saved_places for select to authenticated using (auth.uid() = user_id);
drop policy if exists "users save places" on public.saved_places;
create policy "users save places" on public.saved_places for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "users remove saved places" on public.saved_places;
create policy "users remove saved places" on public.saved_places for delete to authenticated using (auth.uid() = user_id);

-- NOTE: admin write policies are intentionally not opened to the browser yet.
-- Admin operations will be implemented in Phase 2E using a protected server/admin path.
