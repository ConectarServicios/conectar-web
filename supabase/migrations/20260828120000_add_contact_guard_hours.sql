alter table public.contact_information
add column guard_hours text;

update public.contact_information
set
  business_hours = coalesce(
    business_hours,
    E'Lun-Vie: 7:00 a 19:00\nSáb: 8:00 a 12:00'
  ),
  guard_hours = coalesce(
    guard_hours,
    E'Sáb: 12:00 a 19:00\nDom: 10:00 a 19:00\nFeriados: 10:00 a 19:00'
  );

insert into public.contact_information (business_hours, guard_hours)
select
  E'Lun-Vie: 7:00 a 19:00\nSáb: 8:00 a 12:00',
  E'Sáb: 12:00 a 19:00\nDom: 10:00 a 19:00\nFeriados: 10:00 a 19:00'
where not exists (select 1 from public.contact_information);
