-- UnseenGo AI: verification pipeline
-- Run in Supabase SQL editor. Service-role credentials stay server-side only.
create index if not exists idx_places_verification_status on public.places(verification_status);
create index if not exists idx_places_verified_at on public.places(verified_at);
create index if not exists idx_places_city_active on public.places(city_id, is_active);

create or replace view public.verified_india_places as
select p.*, c.name as city_name, c.state as state_name
from public.places p
join public.cities c on c.id = p.city_id
where p.is_active = true
  and p.verification_status in ('verified','community_verified','live_verified');

create or replace function public.verification_summary()
returns table(status text, total bigint)
language sql stable security invoker as $$
  select coalesce(p.verification_status,'unverified')::text, count(*)
  from public.places p
  group by coalesce(p.verification_status,'unverified')
  order by 1;
$$;
