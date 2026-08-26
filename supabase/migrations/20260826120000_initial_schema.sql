-- Initial administrable content schema for Conectar Web.
-- The first super administrator must be bootstrapped separately by a database owner.

create type public.admin_role as enum ('super_admin', 'admin', 'editor');
create type public.content_status as enum ('draft', 'published', 'archived');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role public.admin_role not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  speed_mbps integer not null check (speed_mbps > 0),
  description text,
  regular_price numeric(12, 2) not null check (regular_price >= 0),
  promotional_price numeric(12, 2) check (promotional_price >= 0),
  promotion_label text,
  promotion_start timestamptz,
  promotion_end timestamptz,
  featured boolean not null default false,
  active boolean not null default true,
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint plans_promotion_dates_valid check (
    promotion_start is null or promotion_end is null or promotion_end >= promotion_start
  )
);

create table public.plan_features (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.plans (id) on delete cascade,
  text text not null,
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  short_description text,
  description text,
  image_url text,
  icon text,
  category text,
  featured boolean not null default false,
  active boolean not null default true,
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  cover_image text,
  category text,
  status public.content_status not null default 'draft',
  featured boolean not null default false,
  published_at timestamptz,
  author_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  cover_image text,
  location text,
  starts_at timestamptz,
  ends_at timestamptz,
  status public.content_status not null default 'draft',
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_dates_valid check (
    starts_at is null or ends_at is null or ends_at >= starts_at
  )
);

create table public.promotions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  button_text text,
  button_url text,
  starts_at timestamptz,
  ends_at timestamptz,
  active boolean not null default true,
  placement text not null,
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint promotions_dates_valid check (
    starts_at is null or ends_at is null or ends_at >= starts_at
  )
);

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text,
  active boolean not null default true,
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null,
  description text,
  updated_at timestamptz not null default now()
);

create table public.contact_information (
  id uuid primary key default gen_random_uuid(),
  phone text,
  whatsapp text,
  commercial_email text,
  address text,
  business_hours text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  url text not null,
  active boolean not null default true,
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger plans_set_updated_at before update on public.plans
for each row execute function public.set_updated_at();
create trigger services_set_updated_at before update on public.services
for each row execute function public.set_updated_at();
create trigger news_set_updated_at before update on public.news
for each row execute function public.set_updated_at();
create trigger events_set_updated_at before update on public.events
for each row execute function public.set_updated_at();
create trigger promotions_set_updated_at before update on public.promotions
for each row execute function public.set_updated_at();
create trigger faqs_set_updated_at before update on public.faqs
for each row execute function public.set_updated_at();
create trigger site_settings_set_updated_at before update on public.site_settings
for each row execute function public.set_updated_at();
create trigger contact_information_set_updated_at before update on public.contact_information
for each row execute function public.set_updated_at();
create trigger social_links_set_updated_at before update on public.social_links
for each row execute function public.set_updated_at();

-- SECURITY DEFINER avoids recursive profile policies. The empty search path and
-- schema-qualified objects prevent object-shadowing attacks.
create function public.current_admin_role()
returns public.admin_role
language sql
stable
security definer
set search_path = ''
as $$
  select profile.role
  from public.profiles as profile
  where profile.id = (select auth.uid())
    and profile.active
$$;

create function public.prevent_self_super_admin_promotion()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.id <> old.id then
    raise exception 'A profile id cannot be changed';
  end if;

  if new.id = (select auth.uid())
    and new.role = 'super_admin'::public.admin_role
    and old.role <> 'super_admin'::public.admin_role then
    raise exception 'A user cannot promote their own profile to super_admin';
  end if;

  return new;
end;
$$;

create trigger profiles_prevent_self_super_admin_promotion
before update on public.profiles
for each row execute function public.prevent_self_super_admin_promotion();

create index profiles_active_role_idx on public.profiles (role) where active;
create index plans_public_order_idx on public.plans (display_order) where active;
create index plans_featured_idx on public.plans (featured) where featured;
create index plan_features_plan_order_idx on public.plan_features (plan_id, display_order);
create index services_public_order_idx on public.services (display_order) where active;
create index services_featured_idx on public.services (featured) where featured;
create index news_publication_idx on public.news (status, published_at desc);
create index news_author_id_idx on public.news (author_id);
create index news_featured_idx on public.news (featured) where featured;
create index events_publication_idx on public.events (status, starts_at);
create index events_featured_idx on public.events (featured) where featured;
create index promotions_public_order_idx on public.promotions (display_order) where active;
create index faqs_public_order_idx on public.faqs (display_order) where active;
create index social_links_public_order_idx on public.social_links (display_order) where active;

alter table public.profiles enable row level security;
alter table public.plans enable row level security;
alter table public.plan_features enable row level security;
alter table public.services enable row level security;
alter table public.news enable row level security;
alter table public.events enable row level security;
alter table public.promotions enable row level security;
alter table public.faqs enable row level security;
alter table public.site_settings enable row level security;
alter table public.contact_information enable row level security;
alter table public.social_links enable row level security;

-- Profiles are never public. Active administrators can read themselves; only
-- super administrators can list, create, update, or delete profiles.
create policy "Administrators can read own profile"
on public.profiles for select to authenticated
using (id = (select auth.uid()) and active);

create policy "Super administrators can read profiles"
on public.profiles for select to authenticated
using ((select public.current_admin_role()) = 'super_admin');

create policy "Super administrators can insert profiles"
on public.profiles for insert to authenticated
with check ((select public.current_admin_role()) = 'super_admin');

create policy "Super administrators can update profiles"
on public.profiles for update to authenticated
using ((select public.current_admin_role()) = 'super_admin')
with check ((select public.current_admin_role()) = 'super_admin');

create policy "Super administrators can delete profiles"
on public.profiles for delete to authenticated
using ((select public.current_admin_role()) = 'super_admin');

-- Public read policies apply equally after login; authentication alone never
-- grants administrative access.
create policy "Public can read active plans"
on public.plans for select to anon, authenticated
using (active);
create policy "Public can read features of active plans"
on public.plan_features for select to anon, authenticated
using (exists (select 1 from public.plans where plans.id = plan_id and plans.active));
create policy "Public can read active services"
on public.services for select to anon, authenticated
using (active);
create policy "Public can read published news"
on public.news for select to anon, authenticated
using (status = 'published' and published_at is not null and published_at <= now());
create policy "Public can read published events"
on public.events for select to anon, authenticated
using (status = 'published');
create policy "Public can read current promotions"
on public.promotions for select to anon, authenticated
using (active and (starts_at is null or starts_at <= now()) and (ends_at is null or ends_at >= now()));
create policy "Public can read active faqs"
on public.faqs for select to anon, authenticated
using (active);
create policy "Public can read site settings"
on public.site_settings for select to anon, authenticated
using (true);
create policy "Public can read contact information"
on public.contact_information for select to anon, authenticated
using (true);
create policy "Public can read active social links"
on public.social_links for select to anon, authenticated
using (active);

-- Editors, admins, and super administrators manage editorial content.
create policy "Administrators can manage plans" on public.plans
for all to authenticated
using ((select public.current_admin_role()) in ('editor', 'admin', 'super_admin'))
with check ((select public.current_admin_role()) in ('editor', 'admin', 'super_admin'));
create policy "Administrators can manage plan features" on public.plan_features
for all to authenticated
using ((select public.current_admin_role()) in ('editor', 'admin', 'super_admin'))
with check ((select public.current_admin_role()) in ('editor', 'admin', 'super_admin'));
create policy "Administrators can manage services" on public.services
for all to authenticated
using ((select public.current_admin_role()) in ('editor', 'admin', 'super_admin'))
with check ((select public.current_admin_role()) in ('editor', 'admin', 'super_admin'));
create policy "Administrators can manage news" on public.news
for all to authenticated
using ((select public.current_admin_role()) in ('editor', 'admin', 'super_admin'))
with check ((select public.current_admin_role()) in ('editor', 'admin', 'super_admin'));
create policy "Administrators can manage events" on public.events
for all to authenticated
using ((select public.current_admin_role()) in ('editor', 'admin', 'super_admin'))
with check ((select public.current_admin_role()) in ('editor', 'admin', 'super_admin'));
create policy "Administrators can manage promotions" on public.promotions
for all to authenticated
using ((select public.current_admin_role()) in ('editor', 'admin', 'super_admin'))
with check ((select public.current_admin_role()) in ('editor', 'admin', 'super_admin'));
create policy "Administrators can manage faqs" on public.faqs
for all to authenticated
using ((select public.current_admin_role()) in ('editor', 'admin', 'super_admin'))
with check ((select public.current_admin_role()) in ('editor', 'admin', 'super_admin'));

-- Configuration is restricted to admins and super administrators.
create policy "Senior administrators can manage site settings" on public.site_settings
for all to authenticated
using ((select public.current_admin_role()) in ('admin', 'super_admin'))
with check ((select public.current_admin_role()) in ('admin', 'super_admin'));
create policy "Senior administrators can manage contact information" on public.contact_information
for all to authenticated
using ((select public.current_admin_role()) in ('admin', 'super_admin'))
with check ((select public.current_admin_role()) in ('admin', 'super_admin'));
create policy "Senior administrators can manage social links" on public.social_links
for all to authenticated
using ((select public.current_admin_role()) in ('admin', 'super_admin'))
with check ((select public.current_admin_role()) in ('admin', 'super_admin'));

-- Table privileges are intentionally narrower than the defaults. RLS remains
-- the row-level authorization layer for every granted operation.
revoke create on schema public from public, anon, authenticated;
grant usage on schema public to anon, authenticated;

revoke all on type public.admin_role, public.content_status
from public, anon, authenticated;
grant usage on type public.content_status to anon, authenticated;
grant usage on type public.admin_role to authenticated;

revoke all on table public.profiles, public.plans, public.plan_features,
  public.services, public.news, public.events, public.promotions, public.faqs,
  public.site_settings, public.contact_information, public.social_links
from public, anon, authenticated;

grant select on table public.plans, public.plan_features, public.services,
  public.news, public.events, public.promotions, public.faqs,
  public.site_settings, public.contact_information, public.social_links
to anon;

grant select, insert, update, delete on table public.profiles, public.plans,
  public.plan_features, public.services, public.news, public.events,
  public.promotions, public.faqs, public.site_settings,
  public.contact_information, public.social_links
to authenticated;

revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.prevent_self_super_admin_promotion() from public, anon, authenticated;
revoke all on function public.current_admin_role() from public, anon, authenticated;
grant execute on function public.current_admin_role() to authenticated;
