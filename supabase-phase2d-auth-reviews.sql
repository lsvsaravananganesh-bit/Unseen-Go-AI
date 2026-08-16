-- Run once in Supabase SQL Editor after the reviews table exists.
alter table public.reviews add column if not exists user_id uuid references auth.users(id) on delete cascade;

alter table public.reviews enable row level security;

drop policy if exists "Public can submit reviews" on public.reviews;
create policy "Authenticated users can submit reviews"
on public.reviews for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Public can read reviews" on public.reviews;
create policy "Anyone can read reviews"
on public.reviews for select
to anon, authenticated
using (true);

grant select on public.reviews to anon, authenticated;
grant insert on public.reviews to authenticated;
