-- UnseenGo AI India registry support
-- Run in Supabase SQL editor before scripts/seed-india.mjs.

create unique index if not exists cities_name_unique_idx on public.cities (name);
create unique index if not exists places_city_name_unique_idx on public.places (city_id, name);

create index if not exists cities_state_idx on public.cities (state);
create index if not exists cities_verification_idx on public.cities (verification_status);
create index if not exists places_verification_idx on public.places (verification_status);
create index if not exists places_source_idx on public.places (source);

create or replace view public.unseengo_india_registry as
select
  c.id as city_id,
  c.name as city,
  c.state,
  c.verification_status as city_verification_status,
  c.source as city_source,
  p.id as place_id,
  p.name as place,
  p.category,
  p.verification_status as place_verification_status,
  p.source as place_source,
  p.source_url,
  p.verified_at,
  p.data_quality_score,
  p.verification_notes
from public.cities c
left join public.places p on p.city_id=c.id and p.is_active=true
where c.is_active=true;

comment on view public.unseengo_india_registry is 'Government-sourced UnseenGo India registry. government_listed records must be live-verified before being presented as Google-verified.';
