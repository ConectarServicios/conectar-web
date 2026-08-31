-- Safely evolve the existing events table without assuming it is empty.
alter table public.events rename column cover_image to image_path;
alter table public.events add column summary text;
alter table public.events add column address text;
alter table public.events add column button_text text;
alter table public.events add column button_url text;

update public.events
set summary = coalesce(nullif(btrim(description), ''), title)
where summary is null or btrim(summary) = '';

alter table public.events alter column summary set not null;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('event-images', 'event-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public can read event images" on storage.objects for select to anon, authenticated
using (bucket_id = 'event-images');
create policy "Editors can upload event images" on storage.objects for insert to authenticated
with check (bucket_id = 'event-images' and (select public.current_admin_role()) in ('editor', 'admin', 'super_admin'));
create policy "Editors can update event images" on storage.objects for update to authenticated
using (bucket_id = 'event-images' and (select public.current_admin_role()) in ('editor', 'admin', 'super_admin'))
with check (bucket_id = 'event-images' and (select public.current_admin_role()) in ('editor', 'admin', 'super_admin'));
create policy "Editors can delete event images" on storage.objects for delete to authenticated
using (bucket_id = 'event-images' and (select public.current_admin_role()) in ('editor', 'admin', 'super_admin'));
