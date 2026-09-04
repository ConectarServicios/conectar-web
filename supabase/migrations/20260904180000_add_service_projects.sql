-- Reusable portfolio projects/solutions associated with service areas and optionally services.
create table public.service_projects (
  id uuid primary key default gen_random_uuid(),
  service_area_id uuid not null references public.service_areas (id) on delete restrict,
  service_id uuid references public.services (id) on delete set null,
  title text not null check (length(trim(title)) > 0),
  slug text not null unique,
  project_type text check (project_type is null or length(project_type) <= 80),
  short_description text,
  description text,
  image_path text,
  public_url text check (
    public_url is null
    or public_url ~ '^/([^/[:space:]][^[:space:]]*)?$'
    or public_url ~* '^https?://[^[:space:]]+$'
  ),
  featured boolean not null default false,
  active boolean not null default true,
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger service_projects_set_updated_at before update on public.service_projects
for each row execute function public.set_updated_at();

create index service_projects_public_area_order_idx
on public.service_projects (service_area_id, featured desc, display_order, title) where active;
create index service_projects_featured_idx on public.service_projects (featured) where featured;
create index service_projects_service_id_idx on public.service_projects (service_id) where service_id is not null;

alter table public.service_projects enable row level security;
create policy "Public can read active service projects" on public.service_projects
for select to anon, authenticated using (
  active and exists (
    select 1 from public.service_areas
    where service_areas.id = service_projects.service_area_id and service_areas.active
  )
);
create policy "Administrators can manage service projects" on public.service_projects
for all to authenticated
using ((select public.current_admin_role()) in ('editor', 'admin', 'super_admin'))
with check ((select public.current_admin_role()) in ('editor', 'admin', 'super_admin'));

revoke all on table public.service_projects from public, anon, authenticated;
grant select on table public.service_projects to anon;
grant select, insert, update, delete on table public.service_projects to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('service-project-images', 'service-project-images', true, 5242880,
  array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = excluded.public,
  file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "Public can read service project images" on storage.objects for select to anon, authenticated
using (bucket_id = 'service-project-images');
create policy "Editors can upload service project images" on storage.objects for insert to authenticated
with check (bucket_id = 'service-project-images' and (select public.current_admin_role()) in ('editor', 'admin', 'super_admin'));
create policy "Editors can update service project images" on storage.objects for update to authenticated
using (bucket_id = 'service-project-images' and (select public.current_admin_role()) in ('editor', 'admin', 'super_admin'))
with check (bucket_id = 'service-project-images' and (select public.current_admin_role()) in ('editor', 'admin', 'super_admin'));
create policy "Editors can delete service project images" on storage.objects for delete to authenticated
using (bucket_id = 'service-project-images' and (select public.current_admin_role()) in ('editor', 'admin', 'super_admin'));
