-- The deployed function qualified COALESCE as pg_catalog.coalesce(). COALESCE
-- is SQL syntax rather than a schema-qualified function, so its authorization
-- guard failed at execution time before the first service_media insert.
create or replace function public.save_service_media(
  p_id uuid,
  p_service_id uuid,
  p_type text,
  p_image_path text,
  p_alt_text text,
  p_caption text,
  p_active boolean,
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
  if coalesce((select public.current_admin_role())::text, '') not in ('editor', 'admin', 'super_admin') then
    raise exception using
      errcode = '42501',
      message = 'Insufficient permissions to manage service media';
  end if;

  if p_type = 'hero' and p_active then
    perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext(p_service_id::text));
    update public.service_media
    set active = false
    where service_id = p_service_id
      and type = 'hero'
      and active
      and id is distinct from p_id;
  end if;

  if p_id is null then
    insert into public.service_media (
      service_id, type, image_path, alt_text, caption, active, display_order
    ) values (
      p_service_id, p_type, p_image_path, p_alt_text, p_caption, p_active, p_display_order
    )
    returning id into saved_id;
  else
    update public.service_media
    set type = p_type,
        image_path = p_image_path,
        alt_text = p_alt_text,
        caption = p_caption,
        active = p_active,
        display_order = p_display_order
    where id = p_id
      and service_id = p_service_id
    returning id into saved_id;
  end if;

  if saved_id is null then
    raise exception using
      errcode = 'P0002',
      message = 'Service media not found';
  end if;

  return saved_id;
end;
$$;

revoke all on function public.save_service_media(uuid, uuid, text, text, text, text, boolean, integer)
from public, anon, authenticated;
grant execute on function public.save_service_media(uuid, uuid, text, text, text, text, boolean, integer)
to authenticated;
