-- Verification metadata for the India destination catalog.
-- Run this migration in Supabase before importing new records.
create table if not exists public.india_city_sources (
  id uuid primary key default gen_random_uuid(),
  city_id uuid references public.cities(id) on delete cascade,
  source_name text not null,
  source_url text,
  checked_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending','verified','rejected','needs_review')),
  notes text
);

create index if not exists india_city_sources_city_idx on public.india_city_sources(city_id);
create index if not exists places_verification_idx on public.places(verification_status, verified_at);
create index if not exists places_city_idx on public.places(city_id);

alter table public.india_city_sources enable row level security;
create policy if not exists "public can read verified city sources" on public.india_city_sources
  for select to anon, authenticated using (status = 'verified');
