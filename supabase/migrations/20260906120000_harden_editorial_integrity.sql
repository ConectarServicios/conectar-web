-- AUD-001/002/003/006: enforce editorial integrity at the database boundary.

-- A project may only reference a service from its own area. Abort rather than
-- silently repairing pre-existing inconsistent content.
do $$
declare
  inconsistent_count bigint;
  sample_project_ids text;
begin
  select count(*) into inconsistent_count
  from public.service_projects as project
  join public.services as service on service.id = project.service_id
  where project.service_id is not null
    and service.service_area_id is distinct from project.service_area_id;

  select string_agg(project_id::text, ', ' order by project_id)
  into sample_project_ids
  from (
    select project.id as project_id
    from public.service_projects as project
    join public.services as service on service.id = project.service_id
    where project.service_id is not null
      and service.service_area_id is distinct from project.service_area_id
    order by project.id
    limit 10
  ) as inconsistent_projects;

  if inconsistent_count > 0 then
    raise exception using
      errcode = 'check_violation',
      message = format(
        'Cannot enforce service project area integrity: found %s incompatible project(s); sample project IDs: %s',
        inconsistent_count,
        sample_project_ids
      );
  end if;
end;
$$;

alter table public.services
add constraint services_id_service_area_id_key unique (id, service_area_id);

alter table public.service_projects
drop constraint service_projects_service_id_fkey,
add constraint service_projects_service_and_area_fkey
  foreign key (service_id, service_area_id)
  references public.services (id, service_area_id)
  on delete set null (service_id);

-- Shared validation for optional public call-to-action URLs. Internal paths
-- start with exactly one slash; external URLs use only HTTP(S).
create function public.is_safe_public_url(value text)
returns boolean
language sql
immutable
strict
set search_path = ''
as $$
  select value = pg_catalog.btrim(value)
    and pg_catalog.strpos(value, pg_catalog.chr(92)) = 0
    and value !~ '[[:cntrl:][:space:]]'
    and (
      value ~ '^/($|[^/])'
      or value ~ '^https?://.+'
    )
$$;

revoke all on function public.is_safe_public_url(text) from public, anon, authenticated;
-- Editorial writes evaluate this helper through the CHECK constraints below.
-- EXECUTE does not grant table access; events/promotions grants and RLS remain
-- the authorization boundary for INSERT and UPDATE operations.
grant execute on function public.is_safe_public_url(text) to authenticated;

do $$
declare
  invalid_event_count bigint;
  invalid_event_ids text;
  invalid_promotion_count bigint;
  invalid_promotion_ids text;
begin
  select count(*) into invalid_event_count
  from public.events
  where button_url is not null and not public.is_safe_public_url(button_url);

  select string_agg(id::text, ', ' order by id)
  into invalid_event_ids
  from (
    select id
    from public.events
    where button_url is not null and not public.is_safe_public_url(button_url)
    order by id
    limit 10
  ) as invalid_events;

  select count(*) into invalid_promotion_count
  from public.promotions
  where button_url is not null and not public.is_safe_public_url(button_url);

  select string_agg(id::text, ', ' order by id)
  into invalid_promotion_ids
  from (
    select id
    from public.promotions
    where button_url is not null and not public.is_safe_public_url(button_url)
    order by id
    limit 10
  ) as invalid_promotions;

  if invalid_event_count > 0 or invalid_promotion_count > 0 then
    raise exception using
      errcode = 'check_violation',
      message = format(
        'Cannot enforce safe button URLs: invalid events=%s (sample IDs: %s), invalid promotions=%s (sample IDs: %s)',
        invalid_event_count,
        coalesce(invalid_event_ids, 'none'),
        invalid_promotion_count,
        coalesce(invalid_promotion_ids, 'none')
      );
  end if;
end;
$$;

alter table public.events
add constraint events_button_url_safe
check (button_url is null or public.is_safe_public_url(button_url));

alter table public.promotions
add constraint promotions_button_url_safe
check (button_url is null or public.is_safe_public_url(button_url));

-- SECURITY INVOKER intentionally preserves the authenticated caller's RLS.
-- PostgreSQL executes the function body atomically, including feature replacement.
create function public.save_plan_with_features(
  p_id uuid,
  p_name text,
  p_slug text,
  p_speed_mbps integer,
  p_upload_speed_mbps integer,
  p_description text,
  p_regular_price numeric,
  p_promotional_price numeric,
  p_promotion_label text,
  p_promotion_start timestamptz,
  p_promotion_end timestamptz,
  p_featured boolean,
  p_active boolean,
  p_display_order integer,
  p_features jsonb
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  saved_plan_id uuid;
begin
  if coalesce((select public.current_admin_role())::text, '') not in ('editor', 'admin', 'super_admin') then
    raise exception using errcode = 'insufficient_privilege', message = 'Insufficient permissions to manage plans';
  end if;

  if p_features is null or pg_catalog.jsonb_typeof(p_features) <> 'array' then
    raise exception using errcode = 'invalid_parameter_value', message = 'Plan features must be a JSON array';
  end if;

  if p_id is null then
    insert into public.plans (
      name, slug, speed_mbps, upload_speed_mbps, description, regular_price,
      promotional_price, promotion_label, promotion_start, promotion_end,
      featured, active, display_order
    ) values (
      p_name, p_slug, p_speed_mbps, p_upload_speed_mbps, p_description, p_regular_price,
      p_promotional_price, p_promotion_label, p_promotion_start, p_promotion_end,
      p_featured, p_active, p_display_order
    ) returning id into saved_plan_id;
  else
    update public.plans
    set name = p_name,
        slug = p_slug,
        speed_mbps = p_speed_mbps,
        upload_speed_mbps = p_upload_speed_mbps,
        description = p_description,
        regular_price = p_regular_price,
        promotional_price = p_promotional_price,
        promotion_label = p_promotion_label,
        promotion_start = p_promotion_start,
        promotion_end = p_promotion_end,
        featured = p_featured,
        active = p_active,
        display_order = p_display_order
    where id = p_id
    returning id into saved_plan_id;

    if saved_plan_id is null then
      raise exception using errcode = 'no_data_found', message = 'Plan not found';
    end if;

    delete from public.plan_features where plan_id = saved_plan_id;
  end if;

  insert into public.plan_features (plan_id, text, display_order)
  select saved_plan_id, feature.text, feature.display_order
  from pg_catalog.jsonb_to_recordset(p_features) as feature(text text, display_order integer);

  return saved_plan_id;
end;
$$;

revoke all on function public.save_plan_with_features(
  uuid, text, text, integer, integer, text, numeric, numeric, text,
  timestamptz, timestamptz, boolean, boolean, integer, jsonb
) from public, anon, authenticated;
grant execute on function public.save_plan_with_features(
  uuid, text, text, integer, integer, text, numeric, numeric, text,
  timestamptz, timestamptz, boolean, boolean, integer, jsonb
) to authenticated;

-- The advisory lock serializes competing selections. Existence is checked
-- before clearing the current featured slide, and any error rolls back both updates.
create function public.set_featured_hero_slide(slide_id uuid)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if coalesce((select public.current_admin_role())::text, '') not in ('admin', 'super_admin') then
    raise exception using errcode = 'insufficient_privilege', message = 'Insufficient permissions to manage hero slides';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(48761924);

  if not exists (
    select 1 from public.hero_slides where id = slide_id for update
  ) then
    raise exception using errcode = 'no_data_found', message = 'Hero slide not found';
  end if;

  update public.hero_slides set featured = false where featured and id <> slide_id;
  update public.hero_slides set featured = true where id = slide_id;
end;
$$;

revoke all on function public.set_featured_hero_slide(uuid) from public, anon, authenticated;
grant execute on function public.set_featured_hero_slide(uuid) to authenticated;
