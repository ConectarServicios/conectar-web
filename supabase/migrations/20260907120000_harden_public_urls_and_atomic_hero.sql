-- AUD2 P1 hardening: consistent URL semantics and atomic hero persistence.

create function public.is_safe_external_http_url(value text)
returns boolean
language sql
immutable
strict
set search_path = ''
as $$
  select value = pg_catalog.btrim(value)
    and value !~ '[[:cntrl:][:space:]]'
    and pg_catalog.strpos(value, pg_catalog.chr(92)) = 0
    and value ~* '^https?://[^/?#:@]+(:[0-9]+)?([/?#].*)?$'
$$;

-- Events/Promotions retain navigation semantics through is_safe_public_url.
create function public.is_safe_navigation_url(value text)
returns boolean
language sql
immutable
strict
set search_path = ''
as $$
  select value = pg_catalog.btrim(value)
    and value !~ '[[:cntrl:][:space:]]'
    and pg_catalog.strpos(value, pg_catalog.chr(92)) = 0
    and (
      value ~ '^/($|[^/])'
      or public.is_safe_external_http_url(value)
    )
$$;

create or replace function public.is_safe_public_url(value text)
returns boolean
language sql
immutable
strict
set search_path = ''
as $$
  select public.is_safe_navigation_url(value)
$$;

revoke all on function public.is_safe_navigation_url(text) from public, anon, authenticated;
revoke all on function public.is_safe_external_http_url(text) from public, anon, authenticated;
-- Authenticated writers need EXECUTE for CHECK evaluation. These grants confer
-- no table writes and do not alter any table grant or RLS policy.
grant execute on function public.is_safe_navigation_url(text) to authenticated;
grant execute on function public.is_safe_external_http_url(text) to authenticated;

-- Fail closed without rewriting existing content. Every affected surface is
-- inspected before constraints are replaced/added, including the two existing
-- consumers of is_safe_public_url whose implementation is now stricter.
do $$
declare
  invalid_count bigint;
  examples text;
begin
  select count(*), (select pg_catalog.string_agg(id::text, ', ' order by id) from (select id from public.hero_slides where button_url is not null and not public.is_safe_navigation_url(button_url) order by id limit 10) sample)
  into invalid_count, examples from public.hero_slides where button_url is not null and not public.is_safe_navigation_url(button_url);
  if invalid_count > 0 then raise exception using errcode = 'check_violation', message = pg_catalog.format('hero_slides has %s invalid button_url value(s); sample IDs: %s', invalid_count, pg_catalog.coalesce(examples, 'none')); end if;

  select count(*), (select pg_catalog.string_agg(id::text, ', ' order by id) from (select id from public.service_areas where public_url is not null and not public.is_safe_navigation_url(public_url) order by id limit 10) sample)
  into invalid_count, examples from public.service_areas where public_url is not null and not public.is_safe_navigation_url(public_url);
  if invalid_count > 0 then raise exception using errcode = 'check_violation', message = pg_catalog.format('service_areas has %s invalid public_url value(s); sample IDs: %s', invalid_count, pg_catalog.coalesce(examples, 'none')); end if;

  select count(*), (select pg_catalog.string_agg(id::text, ', ' order by id) from (select id from public.service_projects where public_url is not null and not public.is_safe_navigation_url(public_url) order by id limit 10) sample)
  into invalid_count, examples from public.service_projects where public_url is not null and not public.is_safe_navigation_url(public_url);
  if invalid_count > 0 then raise exception using errcode = 'check_violation', message = pg_catalog.format('service_projects has %s invalid public_url value(s); sample IDs: %s', invalid_count, pg_catalog.coalesce(examples, 'none')); end if;

  select count(*), (select pg_catalog.string_agg(id::text, ', ' order by id) from (select id from public.conectar_play_settings where web_url is not null and not public.is_safe_external_http_url(web_url) order by id limit 10) sample)
  into invalid_count, examples from public.conectar_play_settings where web_url is not null and not public.is_safe_external_http_url(web_url);
  if invalid_count > 0 then raise exception using errcode = 'check_violation', message = pg_catalog.format('conectar_play_settings has %s invalid web_url value(s); sample IDs: %s', invalid_count, pg_catalog.coalesce(examples, 'none')); end if;

  select count(*), (select pg_catalog.string_agg(id::text, ', ' order by id) from (select id from public.social_links where not public.is_safe_external_http_url(url) order by id limit 10) sample)
  into invalid_count, examples from public.social_links where not public.is_safe_external_http_url(url);
  if invalid_count > 0 then raise exception using errcode = 'check_violation', message = pg_catalog.format('social_links has %s invalid url value(s); sample IDs: %s', invalid_count, pg_catalog.coalesce(examples, 'none')); end if;

  select count(*), (select pg_catalog.string_agg(key, ', ' order by key) from (select key from public.site_settings where key = 'self_service_url' and (pg_catalog.jsonb_typeof(value) <> 'string' or not public.is_safe_external_http_url(value #>> '{}')) order by key limit 10) sample)
  into invalid_count, examples from public.site_settings where key = 'self_service_url' and (pg_catalog.jsonb_typeof(value) <> 'string' or not public.is_safe_external_http_url(value #>> '{}'));
  if invalid_count > 0 then raise exception using errcode = 'check_violation', message = pg_catalog.format('site_settings has %s invalid self_service_url value(s); sample keys: %s', invalid_count, pg_catalog.coalesce(examples, 'none')); end if;

  select count(*), (select pg_catalog.string_agg(id::text, ', ' order by id) from (select id from public.events where button_url is not null and not public.is_safe_public_url(button_url) order by id limit 10) sample)
  into invalid_count, examples from public.events where button_url is not null and not public.is_safe_public_url(button_url);
  if invalid_count > 0 then raise exception using errcode = 'check_violation', message = pg_catalog.format('events has %s invalid button_url value(s); sample IDs: %s', invalid_count, pg_catalog.coalesce(examples, 'none')); end if;

  select count(*), (select pg_catalog.string_agg(id::text, ', ' order by id) from (select id from public.promotions where button_url is not null and not public.is_safe_public_url(button_url) order by id limit 10) sample)
  into invalid_count, examples from public.promotions where button_url is not null and not public.is_safe_public_url(button_url);
  if invalid_count > 0 then raise exception using errcode = 'check_violation', message = pg_catalog.format('promotions has %s invalid button_url value(s); sample IDs: %s', invalid_count, pg_catalog.coalesce(examples, 'none')); end if;
end;
$$;

alter table public.hero_slides drop constraint hero_slides_button_valid;
alter table public.hero_slides add constraint hero_slides_button_valid check (
  (button_text is null or pg_catalog.length(pg_catalog.btrim(button_text)) = 0 or button_url is not null)
  and (button_url is null or public.is_safe_navigation_url(button_url))
);
alter table public.service_areas drop constraint service_areas_public_url_check;
alter table public.service_areas add constraint service_areas_public_url_check check (public_url is null or public.is_safe_navigation_url(public_url));
alter table public.service_projects drop constraint service_projects_public_url_check;
alter table public.service_projects add constraint service_projects_public_url_check check (public_url is null or public.is_safe_navigation_url(public_url));
alter table public.conectar_play_settings add constraint conectar_play_settings_web_url_safe check (web_url is null or public.is_safe_external_http_url(web_url));
alter table public.social_links add constraint social_links_url_safe check (public.is_safe_external_http_url(url));
alter table public.site_settings add constraint site_settings_self_service_url_safe check (
  key <> 'self_service_url'
  or (pg_catalog.jsonb_typeof(value) = 'string' and public.is_safe_external_http_url(value #>> '{}'))
);

-- SECURITY INVOKER preserves RLS and caller privileges. One function call is
-- one PostgreSQL transaction, so save + featured selection roll back together.
create function public.save_hero_slide(
  p_id uuid,
  p_title text,
  p_subtitle text,
  p_image_path text,
  p_button_text text,
  p_button_url text,
  p_active boolean,
  p_featured boolean,
  p_display_order integer
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  saved_id uuid;
begin
  if pg_catalog.coalesce((select public.current_admin_role())::text, '') not in ('admin', 'super_admin') then
    raise exception using errcode = 'insufficient_privilege', message = 'Insufficient permissions to manage hero slides';
  end if;

  if p_featured then
    perform pg_catalog.pg_advisory_xact_lock(48761924);
  end if;

  if p_id is null then
    insert into public.hero_slides (title, subtitle, image_path, button_text, button_url, active, featured, display_order)
    values (p_title, p_subtitle, p_image_path, p_button_text, p_button_url, p_active, false, p_display_order)
    returning id into saved_id;
  else
    update public.hero_slides
    set title = p_title, subtitle = p_subtitle, image_path = p_image_path,
        button_text = p_button_text, button_url = p_button_url, active = p_active,
        featured = false, display_order = p_display_order
    where id = p_id
    returning id into saved_id;
    if saved_id is null then
      raise exception using errcode = 'no_data_found', message = 'Hero slide not found';
    end if;
  end if;

  if p_featured then
    update public.hero_slides set featured = false where featured and id <> saved_id;
    update public.hero_slides set featured = true where id = saved_id;
  end if;

  return saved_id;
end;
$$;

revoke all on function public.save_hero_slide(uuid, text, text, text, text, text, boolean, boolean, integer) from public, anon, authenticated;
grant execute on function public.save_hero_slide(uuid, text, text, text, text, text, boolean, boolean, integer) to authenticated;
