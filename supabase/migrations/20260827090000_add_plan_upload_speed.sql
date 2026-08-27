alter table public.plans
add column upload_speed_mbps integer;

alter table public.plans
add constraint plans_upload_speed_positive
check (upload_speed_mbps is null or upload_speed_mbps > 0);
