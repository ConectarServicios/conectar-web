-- Defense in depth: application checks provide friendly feedback, while this
-- trigger atomically prevents every database path from removing the final
-- active super administrator.
create function public.protect_last_active_super_admin()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.role = 'super_admin'::public.admin_role and old.active
    and (tg_op = 'DELETE' or new.role <> 'super_admin'::public.admin_role or not new.active) then
    lock table public.profiles in share row exclusive mode;
    if not exists (
      select 1 from public.profiles as profile
      where profile.id <> old.id
        and profile.role = 'super_admin'::public.admin_role
        and profile.active
    ) then
      raise exception 'Cannot remove the last active super_admin'
        using errcode = '23514';
    end if;
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

create trigger profiles_protect_last_active_super_admin
before update or delete on public.profiles
for each row execute function public.protect_last_active_super_admin();

revoke all on function public.protect_last_active_super_admin() from public, anon, authenticated;
