-- Remove the orphaned, database-backed services/projects domain. The public
-- services catalogue is now maintained in application data instead.

-- Storage policies are independent database objects, so remove only the
-- policies dedicated to the two legacy buckets.
drop policy if exists "Public can read service project images" on storage.objects;
drop policy if exists "Editors can upload service project images" on storage.objects;
drop policy if exists "Editors can update service project images" on storage.objects;
drop policy if exists "Editors can delete service project images" on storage.objects;

drop policy if exists "Public can read service media objects" on storage.objects;
drop policy if exists "Editors can upload service media objects" on storage.objects;
drop policy if exists "Editors can update service media objects" on storage.objects;
drop policy if exists "Editors can delete service media objects" on storage.objects;

-- Buckets may contain files. Delete their object metadata before deleting the
-- bucket records so no storage metadata is left orphaned.
delete from storage.objects
where bucket_id in ('service-project-images', 'service-media');

delete from storage.buckets
where id in ('service-project-images', 'service-media');

-- This RPC is exclusive to service_media. Shared helpers such as
-- set_updated_at(), current_admin_role(), and URL validators remain in place.
drop function if exists public.save_service_media(
  uuid, uuid, text, text, text, text, boolean, integer
);

-- Drop children before parents. PostgreSQL removes each table's own policies,
-- triggers, indexes, constraints, and grants without requiring CASCADE.
drop table if exists public.service_projects;
drop table if exists public.service_media;
drop table if exists public.service_options;
drop table if exists public.services;
drop table if exists public.service_areas;
