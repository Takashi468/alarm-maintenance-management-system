-- =====================================================================
-- Alarm & Maintenance Management System (AMMS)
-- Supabase Database Schema
-- =====================================================================
-- รันไฟล์นี้ใน Supabase SQL Editor ตามลำดับจากบนลงล่าง
-- ประกอบด้วย: Enum Types, Tables, Indexes, RLS Helper, RLS Policies, Auto-Profile Trigger
-- =====================================================================


-- =====================================================================
-- 1. ENUM TYPES
-- =====================================================================
create type machine_status as enum ('Running', 'Stop', 'Alarm', 'Maintenance');
create type alarm_status   as enum ('Open', 'In Progress', 'Closed');
create type mnt_status     as enum ('Pending', 'In Progress', 'Done');
create type user_role      as enum ('admin', 'technician', 'viewer', 'superadmin');


-- =====================================================================
-- 2. TABLES
-- =====================================================================

-- ---------- PROFILES ----------
-- ผูกกับ auth.users แบบ 1:1 เก็บ role และชื่อของผู้ใช้
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null,
  role        user_role not null default 'technician',
  created_at  timestamptz not null default now()
);

-- ---------- MACHINES ----------
-- Machine Master ใช้ soft delete ผ่านคอลัมน์ deleted_at
create table machines (
  id               uuid primary key default gen_random_uuid(),
  machine_id       text not null unique,
  machine_name     text not null,
  machine_type     text not null,
  location         text not null,
  status           machine_status not null default 'Running',
  deleted_at       timestamptz,
  last_updated_at  timestamptz not null default now(),
  created_at       timestamptz not null default now(),
  constraint machine_id_format check (char_length(machine_id) between 2 and 20)
);

-- ---------- ALARMS ----------
-- ผูกกับ machines (restrict = ห้ามลบเครื่องที่ยังมี alarm)
-- constraint บังคับว่าเมื่อ status = Closed ต้องมี cause และ closed_at
create table alarms (
  id           uuid primary key default gen_random_uuid(),
  machine_id   uuid not null references machines(id) on delete restrict,
  alarm_code   text not null,
  description  text not null,
  cause        text,
  occurred_at  timestamptz not null default now(),
  status       alarm_status not null default 'Open',
  created_by   uuid references profiles(id),
  closed_by    uuid references profiles(id),
  closed_at    timestamptz,
  constraint closed_requires_cause
    check (status <> 'Closed' or (cause is not null and closed_at is not null))
);

-- ---------- MAINTENANCE RECORDS ----------
-- ผูกกับ machines และ alarms (optional)
-- constraint บังคับว่าเมื่อ status = Done ต้องมี action_taken
create table maintenance_records (
  id             uuid primary key default gen_random_uuid(),
  machine_id     uuid not null references machines(id) on delete restrict,
  alarm_id       uuid references alarms(id) on delete set null,
  technician_id  uuid references profiles(id),
  problem        text not null,
  action_taken   text,
  maintained_at  date not null default current_date,
  status         mnt_status not null default 'Pending',
  created_at     timestamptz not null default now(),
  constraint done_requires_action
    check (status <> 'Done' or action_taken is not null)
);


-- =====================================================================
-- 3. INDEXES
-- =====================================================================
create index idx_alarms_machine   on alarms(machine_id);
create index idx_alarms_status    on alarms(status);
create index idx_alarms_time      on alarms(occurred_at desc);
create index idx_mnt_machine      on maintenance_records(machine_id);
create index idx_mnt_status       on maintenance_records(status);
create index idx_machines_status  on machines(status);
create index idx_machines_deleted on machines(deleted_at);


-- =====================================================================
-- 4. RLS HELPER FUNCTION
-- =====================================================================
-- อ่าน role ของผู้ใช้ปัจจุบันจากตาราง profiles
-- ใช้ security definer เพื่อให้อ่าน profiles ได้แม้ policy จะจำกัด
create or replace function current_role_name()
returns user_role language sql stable security definer as $$
  select role from profiles where id = auth.uid();
$$;


-- =====================================================================
-- 5. ROW LEVEL SECURITY
-- =====================================================================
alter table profiles            enable row level security;
alter table machines            enable row level security;
alter table alarms              enable row level security;
alter table maintenance_records enable row level security;

-- ---------- PROFILES ----------
create policy "read own profile"
  on profiles for select
  using (id = auth.uid() or current_role_name() in ('admin', 'superadmin'));

create policy "admin manage profiles"
  on profiles for all
  using (current_role_name() in ('admin', 'superadmin'));

-- ---------- MACHINES ----------
-- ทุกคนที่ login อ่านได้ / เฉพาะ admin แก้ได้
create policy "authenticated read machines"
  on machines for select
  using (auth.uid() is not null);

create policy "admin write machines"
  on machines for all
  using (current_role_name() in ('admin', 'superadmin'))
  with check (current_role_name() in ('admin', 'superadmin'));

-- ---------- ALARMS ----------
-- อ่านได้ทุกคนที่ login / เพิ่มและแก้ได้เฉพาะ admin และ technician
create policy "authenticated read alarms"
  on alarms for select
  using (auth.uid() is not null);

create policy "staff insert alarms"
  on alarms for insert
  with check (current_role_name() in ('admin', 'technician', 'superadmin'));

create policy "staff update alarms"
  on alarms for update
  using (current_role_name() in ('admin', 'technician', 'superadmin'));

-- ---------- MAINTENANCE RECORDS ----------
create policy "authenticated read mnt"
  on maintenance_records for select
  using (auth.uid() is not null);

create policy "staff insert mnt"
  on maintenance_records for insert
  with check (current_role_name() in ('admin', 'technician', 'superadmin'));

create policy "staff update mnt"
  on maintenance_records for update
  using (current_role_name() in ('admin', 'technician', 'superadmin'));


-- =====================================================================
-- 6. AUTO-PROFILE TRIGGER
-- =====================================================================
-- สร้าง row ใน profiles อัตโนมัติเมื่อมี user ใหม่ใน auth.users
-- (ไม่ว่าจะสร้างผ่าน Dashboard, Admin API หรือ signup ในอนาคต)
--
-- ทำไม default role = 'technician':
--   * เป็นสิทธิ์ต่ำสุดที่ "ใช้งานได้จริง" — login แล้วใช้ Dashboard / Alarms / Maintenance ได้
--     แต่ยังจัดการ machines / simulator / users ไม่ได้
--   * ป้องกัน privilege escalation โดยไม่ตั้งใจ — user ใหม่ไม่ได้สิทธิ์ admin มาโดย default
--   * Admin ต้องเข้าไปตั้ง role ให้เองทีหลังผ่านหน้า /users ตามความเหมาะสม

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


-- =====================================================================
-- 7. GRANTS (จำเป็นสำหรับ Data API)
-- =====================================================================
grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on all tables in schema public
  to anon, authenticated, service_role;
alter default privileges in schema public
  grant select, insert, update, delete on tables
  to anon, authenticated, service_role;


-- =====================================================================
-- 8. SEED DATA (ข้อมูลตัวอย่าง)
-- =====================================================================
-- สร้าง user ใน Supabase Dashboard > Authentication > Users ก่อน
-- (trigger on_auth_user_created จะสร้าง profiles ให้อัตโนมัติ role = technician)
-- แล้วรันไฟล์ supabase/seed_mock_data.sql เพื่อเพิ่มข้อมูลตัวอย่าง Machines / Alarms / Maintenance
