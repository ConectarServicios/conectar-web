-- Administrable Conectar Play module. Content is deliberately not seeded.
create table public.conectar_play_settings (
  id uuid primary key default gen_random_uuid(),
  active boolean not null default true,
  channel_count integer not null check (channel_count > 0),
  simultaneous_devices integer not null check (simultaneous_devices > 0),
  web_url text,
  short_description text,
  compatibility_text text,
  incompatible_tv_text text,
  onn_enabled boolean not null default true,
  onn_sale_price numeric(12, 2) check (onn_sale_price >= 0),
  onn_rental_price numeric(12, 2) check (onn_rental_price >= 0),
  onn_description text,
  support_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- A singleton keeps general settings unambiguous while still allowing the
-- initial state to contain no row.
create unique index conectar_play_settings_singleton on public.conectar_play_settings ((true));

create table public.conectar_play_plans (
  id uuid primary key default gen_random_uuid(), name text not null,
  slug text not null unique, description text,
  promotional_price numeric(12, 2) not null check (promotional_price >= 0),
  promotion_label text,
  promotion_discount_percent numeric(5, 2) check (promotion_discount_percent between 0 and 100),
  promotion_duration_months integer check (promotion_duration_months > 0),
  promotion_start timestamptz, promotion_end timestamptz,
  includes_football boolean not null default false,
  active boolean not null default true, featured boolean not null default false,
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint conectar_play_plans_dates_valid check (promotion_start is null or promotion_end is null or promotion_end >= promotion_start)
);

create table public.conectar_play_packs (
  id uuid primary key default gen_random_uuid(), name text not null,
  description text, price numeric(12, 2) check (price >= 0),
  active boolean not null default true,
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.conectar_play_faqs (
  id uuid primary key default gen_random_uuid(), question text not null,
  answer text not null, active boolean not null default true,
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create trigger conectar_play_settings_set_updated_at before update on public.conectar_play_settings for each row execute function public.set_updated_at();
create trigger conectar_play_plans_set_updated_at before update on public.conectar_play_plans for each row execute function public.set_updated_at();
create trigger conectar_play_packs_set_updated_at before update on public.conectar_play_packs for each row execute function public.set_updated_at();
create trigger conectar_play_faqs_set_updated_at before update on public.conectar_play_faqs for each row execute function public.set_updated_at();
create index conectar_play_plans_public_order_idx on public.conectar_play_plans (display_order) where active;
create index conectar_play_packs_public_order_idx on public.conectar_play_packs (display_order) where active;
create index conectar_play_faqs_public_order_idx on public.conectar_play_faqs (display_order) where active;

alter table public.conectar_play_settings enable row level security;
alter table public.conectar_play_plans enable row level security;
alter table public.conectar_play_packs enable row level security;
alter table public.conectar_play_faqs enable row level security;

create policy "Public can read active Conectar Play settings" on public.conectar_play_settings for select to anon, authenticated using (active);
create policy "Public can read active Conectar Play plans" on public.conectar_play_plans for select to anon, authenticated using (active);
create policy "Public can read active Conectar Play packs" on public.conectar_play_packs for select to anon, authenticated using (active);
create policy "Public can read active Conectar Play FAQs" on public.conectar_play_faqs for select to anon, authenticated using (active);
create policy "Administrators can manage Conectar Play plans" on public.conectar_play_plans for all to authenticated using ((select public.current_admin_role()) in ('editor', 'admin', 'super_admin')) with check ((select public.current_admin_role()) in ('editor', 'admin', 'super_admin'));
create policy "Administrators can manage Conectar Play packs" on public.conectar_play_packs for all to authenticated using ((select public.current_admin_role()) in ('editor', 'admin', 'super_admin')) with check ((select public.current_admin_role()) in ('editor', 'admin', 'super_admin'));
create policy "Administrators can manage Conectar Play FAQs" on public.conectar_play_faqs for all to authenticated using ((select public.current_admin_role()) in ('editor', 'admin', 'super_admin')) with check ((select public.current_admin_role()) in ('editor', 'admin', 'super_admin'));
create policy "Senior administrators can manage Conectar Play settings" on public.conectar_play_settings for all to authenticated using ((select public.current_admin_role()) in ('admin', 'super_admin')) with check ((select public.current_admin_role()) in ('admin', 'super_admin'));

revoke all on table public.conectar_play_settings, public.conectar_play_plans, public.conectar_play_packs, public.conectar_play_faqs from public, anon, authenticated;
grant select on table public.conectar_play_settings, public.conectar_play_plans, public.conectar_play_packs, public.conectar_play_faqs to anon;
grant select, insert, update, delete on table public.conectar_play_settings, public.conectar_play_plans, public.conectar_play_packs, public.conectar_play_faqs to authenticated;
