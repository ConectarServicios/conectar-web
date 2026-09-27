-- Remove the obsolete administrable hero. The public home uses its static,
-- segment-specific hero and no longer reads this data or Storage bucket.

-- Dropping the table also removes its indexes, triggers, RLS policies and grants.
drop table if exists public.hero_slides;

drop function if exists public.save_hero_slide(
  uuid, text, text, text, text, text, boolean, boolean, integer
);
drop function if exists public.set_featured_hero_slide(uuid);
drop function if exists public.enforce_hero_active_limit();

drop policy if exists "Public can read hero banner images" on storage.objects;
drop policy if exists "Senior administrators can upload hero banner images" on storage.objects;
drop policy if exists "Senior administrators can update hero banner images" on storage.objects;
drop policy if exists "Senior administrators can delete hero banner images" on storage.objects;

-- The hero-banners Storage bucket is intentionally not deleted from SQL.
-- Supabase Storage metadata and physical objects must be removed through
-- the Storage API or Dashboard if this bucket is no longer needed.
