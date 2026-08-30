-- Evolve the existing table in-place: renames preserve every stored image
-- reference, while the USING expression preserves the singular placement.
alter table public.promotions rename column image_url to image_path;
alter table public.promotions rename column placement to placements;
alter table public.promotions alter column placements drop not null;
alter table public.promotions alter column placements type text[]
  using case when placements is null or btrim(placements) = '' then '{}'::text[] else array[placements] end;
alter table public.promotions alter column placements set default '{}'::text[];
alter table public.promotions alter column placements set not null;

alter table public.promotions add column slug text;
alter table public.promotions add column summary text;
alter table public.promotions add column featured boolean not null default false;

-- Existing rows receive deterministic, unique values without assuming the table is empty.
update public.promotions
set slug = 'promocion-' || replace(id::text, '-', ''),
    summary = coalesce(nullif(btrim(description), ''), title)
where slug is null or summary is null;

alter table public.promotions alter column slug set not null;
alter table public.promotions alter column summary set not null;
alter table public.promotions alter column description set not null;
alter table public.promotions add constraint promotions_slug_format
  check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$');
alter table public.promotions add constraint promotions_slug_unique unique (slug);
alter table public.promotions add constraint promotions_placements_valid check (
  placements <@ array['top_bar', 'home', 'plans', 'conectar_play']::text[]
);

drop index if exists public.promotions_public_order_idx;
create index promotions_public_priority_idx on public.promotions
  (featured desc, display_order asc, starts_at desc, created_at desc) where active;
create index promotions_placements_idx on public.promotions using gin (placements);

-- Recreate explicitly so the publication contract remains visible in this migration.
drop policy if exists "Public can read current promotions" on public.promotions;
create policy "Public can read current promotions" on public.promotions for select to anon, authenticated
using (active and (starts_at is null or starts_at <= now()) and (ends_at is null or ends_at >= now()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('promotion-images', 'promotion-images', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public can read promotion images" on storage.objects for select to anon, authenticated
using (bucket_id = 'promotion-images');
create policy "Editors can upload promotion images" on storage.objects for insert to authenticated
with check (bucket_id = 'promotion-images' and (select public.current_admin_role()) in ('editor','admin','super_admin'));
create policy "Editors can update promotion images" on storage.objects for update to authenticated
using (bucket_id = 'promotion-images' and (select public.current_admin_role()) in ('editor','admin','super_admin'))
with check (bucket_id = 'promotion-images' and (select public.current_admin_role()) in ('editor','admin','super_admin'));
create policy "Editors can delete promotion images" on storage.objects for delete to authenticated
using (bucket_id = 'promotion-images' and (select public.current_admin_role()) in ('editor','admin','super_admin'));
