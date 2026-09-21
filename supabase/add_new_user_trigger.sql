-- =====================================================================
-- AMMS — Auto-create profile row when a new auth user is created
-- รันใน Supabase SQL Editor (รันซ้ำได้ ปลอดภัย)
-- =====================================================================
-- ทำไม default role = 'technician':
--   * เป็นสิทธิ์ต่ำสุดที่ "ใช้งานได้จริง" — login แล้วเห็น Dashboard / Alarms / Maintenance
--     แต่ยังไม่สามารถจัดการ machines, simulator หรือเปลี่ยน role ของคนอื่นได้
--   * ป้องกัน privilege escalation โดยไม่ตั้งใจ — user ใหม่ไม่ได้สิทธิ์ admin มาโดย default
--   * Admin ต้องเข้าไปตั้ง role ให้เองทีหลังผ่านหน้า /users ตามความเหมาะสม
-- =====================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data->>'full_name', ''),
      split_part(coalesce(new.email, 'user'), '@', 1)
    ),
    'technician'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill: สร้าง profile ให้ user เดิมที่ยังไม่มี (no-op ถ้าครบแล้ว)
insert into public.profiles (id, full_name, role)
select u.id, split_part(u.email, '@', 1), 'technician'
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;
