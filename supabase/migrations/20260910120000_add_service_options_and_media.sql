-- Generic commercial options and managed media for every service.
create table public.service_options (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  title text not null check (length(trim(title)) between 1 and 120),
  mode text not null check (mode in ('rental', 'purchase')),
  equipment_count integer check (equipment_count is null or equipment_count > 0),
  price numeric(12,2) not null check (price >= 0),
  price_label text check (price_label is null or length(price_label) <= 80),
  description text,
  active boolean not null default true,
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create trigger service_options_set_updated_at before update on public.service_options for each row execute function public.set_updated_at();
create index service_options_service_id_idx on public.service_options(service_id);
create index service_options_public_order_idx on public.service_options(service_id, display_order, title) where active;

create table public.service_media (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  type text not null check (type in ('hero', 'equipment', 'coverage', 'gallery')),
  image_path text not null check (image_path ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}\.(jpg|png|webp)$'),
  alt_text text check (alt_text is null or length(alt_text) <= 180),
  caption text,
  active boolean not null default true,
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(image_path)
);
create trigger service_media_set_updated_at before update on public.service_media for each row execute function public.set_updated_at();
create index service_media_service_id_idx on public.service_media(service_id);
create index service_media_public_order_idx on public.service_media(service_id, type, display_order) where active;
create unique index service_media_one_active_hero_idx on public.service_media(service_id) where type = 'hero' and active;

alter table public.service_options enable row level security;
alter table public.service_media enable row level security;
create policy "Public can read active service options" on public.service_options for select to anon, authenticated using (
  active and exists (select 1 from public.services s join public.service_areas a on a.id = s.service_area_id where s.id = service_options.service_id and s.active and a.active)
);
create policy "Administrators can manage service options" on public.service_options for all to authenticated
using ((select public.current_admin_role()) in ('editor','admin','super_admin')) with check ((select public.current_admin_role()) in ('editor','admin','super_admin'));
create policy "Public can read active service media" on public.service_media for select to anon, authenticated using (
  active and exists (select 1 from public.services s join public.service_areas a on a.id = s.service_area_id where s.id = service_media.service_id and s.active and a.active)
);
create policy "Administrators can manage service media" on public.service_media for all to authenticated
using ((select public.current_admin_role()) in ('editor','admin','super_admin')) with check ((select public.current_admin_role()) in ('editor','admin','super_admin'));
revoke all on public.service_options, public.service_media from public, anon, authenticated;
grant select on public.service_options, public.service_media to anon;
grant select, insert, update, delete on public.service_options, public.service_media to authenticated;

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types) values
('service-media','service-media',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=excluded.public, file_size_limit=excluded.file_size_limit, allowed_mime_types=excluded.allowed_mime_types;
create policy "Public can read service media objects" on storage.objects for select to anon, authenticated using (bucket_id='service-media');
create policy "Editors can upload service media objects" on storage.objects for insert to authenticated with check (
  bucket_id='service-media' and (select public.current_admin_role()) in ('editor','admin','super_admin') and (storage.foldername(name))[1] ~ '^[0-9a-f-]{36}$'
);
create policy "Editors can update service media objects" on storage.objects for update to authenticated using (bucket_id='service-media' and (select public.current_admin_role()) in ('editor','admin','super_admin')) with check (bucket_id='service-media' and (select public.current_admin_role()) in ('editor','admin','super_admin'));
create policy "Editors can delete service media objects" on storage.objects for delete to authenticated using (bucket_id='service-media' and (select public.current_admin_role()) in ('editor','admin','super_admin'));

-- Atomic persistence enforces a single active hero even under concurrent requests.
create function public.save_service_media(p_id uuid, p_service_id uuid, p_type text, p_image_path text, p_alt_text text, p_caption text, p_active boolean, p_display_order integer)
returns uuid language plpgsql security invoker set search_path='' as $$
declare saved_id uuid;
begin
  if pg_catalog.coalesce((select public.current_admin_role())::text,'') not in ('editor','admin','super_admin') then raise exception using errcode='insufficient_privilege'; end if;
  if p_type = 'hero' and p_active then perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext(p_service_id::text)); update public.service_media set active=false where service_id=p_service_id and type='hero' and active and id is distinct from p_id; end if;
  if p_id is null then insert into public.service_media(service_id,type,image_path,alt_text,caption,active,display_order) values(p_service_id,p_type,p_image_path,p_alt_text,p_caption,p_active,p_display_order) returning id into saved_id;
  else update public.service_media set type=p_type, alt_text=p_alt_text, caption=p_caption, active=p_active, display_order=p_display_order where id=p_id and service_id=p_service_id returning id into saved_id; end if;
  if saved_id is null then raise exception using errcode='no_data_found'; end if; return saved_id;
end $$;
revoke all on function public.save_service_media(uuid,uuid,text,text,text,text,boolean,integer) from public,anon,authenticated;
grant execute on function public.save_service_media(uuid,uuid,text,text,text,text,boolean,integer) to authenticated;
