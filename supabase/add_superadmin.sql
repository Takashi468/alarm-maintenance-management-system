-- =====================================================================
-- Migration: เพิ่ม role 'superadmin' (รันใน Supabase SQL Editor)
-- ⚠️ ต้องรันเป็น 2 ครั้งแยกกัน (Postgres ห้ามใช้ค่า enum ใหม่ใน transaction เดียวกับ ALTER TYPE)
--   ครั้งที่ 1: รันเฉพาะ PART 1 แล้วกด Run
--   ครั้งที่ 2: ค่อยรัน PART 2
-- =====================================================================

-- ============================ PART 1 ================================
do $$ begin
  if not exists (
    select 1
    from pg_enum e
    join pg_type t on e.enumtypid = t.oid
    where t.typname = 'user_role' and e.enumlabel = 'superadmin'
  ) then
    alter type public.user_role add value 'superadmin';
  end if;
end $$;

-- ============================ PART 2 ================================
-- (รันหลังจาก PART 1 commit แล้วเท่านั้น)

drop policy "read own profile" on profiles;
create policy "read own profile"
  on profiles for select
  using (id = auth.uid() or current_role_name() in ('admin', 'superadmin'));

drop policy "admin manage profiles" on profiles;
create policy "admin manage profiles"
  on profiles for all
  using (current_role_name() in ('admin', 'superadmin'));

drop policy "admin write machines" on machines;
create policy "admin write machines"
  on machines for all
  using (current_role_name() in ('admin', 'superadmin'))
  with check (current_role_name() in ('admin', 'superadmin'));

drop policy "staff insert alarms" on alarms;
create policy "staff insert alarms"
  on alarms for insert
  with check (current_role_name() in ('admin', 'technician', 'superadmin'));

drop policy "staff update alarms" on alarms;
create policy "staff update alarms"
  on alarms for update
  using (current_role_name() in ('admin', 'technician', 'superadmin'));

drop policy "staff insert mnt" on maintenance_records;
create policy "staff insert mnt"
  on maintenance_records for insert
  with check (current_role_name() in ('admin', 'technician', 'superadmin'));

drop policy "staff update mnt" on maintenance_records;
create policy "staff update mnt"
  on maintenance_records for update
  using (current_role_name() in ('admin', 'technician', 'superadmin'));
