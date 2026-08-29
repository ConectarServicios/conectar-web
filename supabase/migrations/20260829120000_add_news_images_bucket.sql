-- Public cover images for news and communications. Editorial writes remain authenticated and role-gated.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('news-images', 'news-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public can read news images" on storage.objects for select to anon, authenticated
using (bucket_id = 'news-images');
create policy "Editors can upload news images" on storage.objects for insert to authenticated
with check (bucket_id = 'news-images' and (select public.current_admin_role()) in ('editor', 'admin', 'super_admin'));
create policy "Editors can update news images" on storage.objects for update to authenticated
using (bucket_id = 'news-images' and (select public.current_admin_role()) in ('editor', 'admin', 'super_admin'))
with check (bucket_id = 'news-images' and (select public.current_admin_role()) in ('editor', 'admin', 'super_admin'));
create policy "Editors can delete news images" on storage.objects for delete to authenticated
using (bucket_id = 'news-images' and (select public.current_admin_role()) in ('editor', 'admin', 'super_admin'));
