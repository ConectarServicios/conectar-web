alter table public.faqs
  add column if not exists featured boolean not null default false;

comment on column public.faqs.featured is
  'Controls whether an active general FAQ may appear on the home page.';

create index if not exists faqs_active_featured_order_idx
  on public.faqs (featured desc, display_order asc, created_at asc)
  where active;
