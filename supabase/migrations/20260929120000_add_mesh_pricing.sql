-- Purpose-built pricing for the WiFi Power Mesh module shown in news content.
create table public.mesh_pricing (
  id uuid primary key default gen_random_uuid(),
  mode text not null constraint mesh_pricing_mode_check check (mode in ('rental', 'purchase')),
  equipment_count integer not null constraint mesh_pricing_equipment_count_check check (equipment_count >= 1),
  price numeric(12, 2) not null constraint mesh_pricing_price_check check (price >= 0),
  price_label text,
  active boolean not null default true,
  display_order integer not null default 0,
  updated_at timestamptz not null default now(),
  constraint mesh_pricing_mode_equipment_count_key unique (mode, equipment_count)
);

create index mesh_pricing_public_order_idx
on public.mesh_pricing (mode, equipment_count, display_order)
where active;

create trigger mesh_pricing_set_updated_at
before update on public.mesh_pricing
for each row execute function public.set_updated_at();

alter table public.mesh_pricing enable row level security;

create policy "Public can read active Mesh pricing"
on public.mesh_pricing for select to anon, authenticated
using (active);

create policy "Administrators can manage Mesh pricing"
on public.mesh_pricing for all to authenticated
using ((select public.current_admin_role()) in ('editor', 'admin', 'super_admin'))
with check ((select public.current_admin_role()) in ('editor', 'admin', 'super_admin'));

revoke all on table public.mesh_pricing from public, anon, authenticated;
grant select on table public.mesh_pricing to anon;
grant select, insert, update, delete on table public.mesh_pricing to authenticated;

alter table public.news
add column content_module text null,
add constraint news_content_module_check
check (content_module is null or content_module = 'mesh_pricing');
