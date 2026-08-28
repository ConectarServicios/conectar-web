-- Administrable home hero slides and their public Storage bucket.

create table public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(btrim(title)) > 0),
  subtitle text,
  image_path text not null check (length(btrim(image_path)) > 0),
  button_text text,
  button_url text,
  active boolean not null default true,
  featured boolean not null default false,
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint hero_slides_button_valid check (
    (button_text is null or length(btrim(button_text)) = 0 or (button_url is not null and length(btrim(button_url)) > 0))
    and (button_url is null or length(btrim(button_url)) = 0 or button_url ~ '^(/[^[:space:]]*|https?://[^[:space:]]+)$')
  )
);

create unique index hero_slides_one_featured_idx on public.hero_slides (featured) where featured;
create index hero_slides_active_idx on public.hero_slides (active);
create index hero_slides_featured_idx on public.hero_slides (featured);
create index hero_slides_display_order_idx on public.hero_slides (display_order);

create trigger hero_slides_set_updated_at before update on public.hero_slides
for each row execute function public.set_updated_at();

create function public.enforce_hero_active_limit()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.active then
    -- Serialize changes that could otherwise concurrently exceed the limit.
    perform pg_advisory_xact_lock(48761923);
    if (select count(*) from public.hero_slides where active and id <> new.id) >= 3 then
      raise exception using errcode = 'check_violation', message = 'Only three hero slides may be active';
    end if;
  end if;
  return new;
end;
$$;

create trigger hero_slides_active_limit
before insert or update of active on public.hero_slides
for each row execute function public.enforce_hero_active_limit();

alter table public.hero_slides enable row level security;

create policy "Public can read active hero slides" on public.hero_slides
for select to anon, authenticated using (active);
create policy "Senior administrators can manage hero slides" on public.hero_slides
for all to authenticated
using ((select public.current_admin_role()) in ('admin', 'super_admin'))
with check ((select public.current_admin_role()) in ('admin', 'super_admin'));

revoke all on table public.hero_slides from public, anon, authenticated;
grant select on table public.hero_slides to anon;
grant select, insert, update, delete on table public.hero_slides to authenticated;
revoke all on function public.enforce_hero_active_limit() from public, anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('hero-banners', 'hero-banners', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public can read hero banner images" on storage.objects
for select to anon, authenticated using (bucket_id = 'hero-banners');
create policy "Senior administrators can upload hero banner images" on storage.objects
for insert to authenticated with check (
  bucket_id = 'hero-banners'
  and (select public.current_admin_role()) in ('admin', 'super_admin')
);
create policy "Senior administrators can update hero banner images" on storage.objects
for update to authenticated
using (bucket_id = 'hero-banners' and (select public.current_admin_role()) in ('admin', 'super_admin'))
with check (bucket_id = 'hero-banners' and (select public.current_admin_role()) in ('admin', 'super_admin'));
create policy "Senior administrators can delete hero banner images" on storage.objects
for delete to authenticated
using (bucket_id = 'hero-banners' and (select public.current_admin_role()) in ('admin', 'super_admin'));
