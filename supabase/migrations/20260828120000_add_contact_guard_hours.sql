alter table public.contact_information
add column guard_hours text;

update public.contact_information
set
  whatsapp = coalesce(whatsapp, '+54 9 3493 400983'),
  commercial_email = coalesce(
    commercial_email,
    'comercializacion@conectarservicios.com.ar'
  ),
  address = coalesce(address, 'Av. Independencia 135, Sunchales'),
  business_hours = coalesce(
    business_hours,
    E'Lun-Vie: 7:00 a 19:00\nSáb: 8:00 a 12:00'
  ),
  guard_hours = coalesce(
    guard_hours,
    E'Sáb: 12:00 a 19:00\nDom: 10:00 a 19:00\nFeriados: 10:00 a 19:00'
  );

update public.contact_information
set
  phone = case
    when regexp_replace(coalesce(phone, ''), '[^0-9]', '', 'g') like '%' || ('420' || '002') || '%'
      then null
    else phone
  end,
  whatsapp = case
    when regexp_replace(coalesce(whatsapp, ''), '[^0-9]', '', 'g') like '%' || ('420' || '002') || '%'
      then '+54 9 3493 400983'
    else whatsapp
  end;

-- contact_information represents the single institutional contact record. Keep
-- the oldest row if pre-production data accidentally contains more than one.
delete from public.contact_information
where id not in (
  select id
  from public.contact_information
  order by created_at, id
  limit 1
);

insert into public.contact_information (
  phone,
  whatsapp,
  commercial_email,
  address,
  business_hours,
  guard_hours
)
select
  null,
  '+54 9 3493 400983',
  'comercializacion@conectarservicios.com.ar',
  'Av. Independencia 135, Sunchales',
  E'Lun-Vie: 7:00 a 19:00\nSáb: 8:00 a 12:00',
  E'Sáb: 12:00 a 19:00\nDom: 10:00 a 19:00\nFeriados: 10:00 a 19:00'
where not exists (select 1 from public.contact_information);

create unique index contact_information_singleton_idx
on public.contact_information ((true));

alter table public.contact_information
add constraint contact_information_phone_allowed check (
  regexp_replace(coalesce(phone, ''), '[^0-9]', '', 'g') not like '%' || ('420' || '002') || '%'
),
add constraint contact_information_whatsapp_allowed check (
  regexp_replace(coalesce(whatsapp, ''), '[^0-9]', '', 'g') not like '%' || ('420' || '002') || '%'
);
