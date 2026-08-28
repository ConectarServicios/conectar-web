-- Keep the supported social platforms and one-link-per-platform invariant at
-- the database boundary as well as in the administrative UI.
alter table public.social_links
add constraint social_links_platform_check
check (platform in ('Instagram', 'Facebook', 'YouTube', 'LinkedIn'));

create unique index social_links_platform_key on public.social_links (platform);
