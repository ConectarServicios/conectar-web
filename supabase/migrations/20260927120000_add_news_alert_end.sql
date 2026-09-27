alter table public.news
add column alert_ends_at timestamptz;

comment on column public.news.alert_ends_at is
  'Optional instant after which a featured Aviso stops appearing in the home alert banner.';
