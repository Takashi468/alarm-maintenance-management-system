-- =====================================================================
-- AMMS — Mock/seed data สำหรับ demo (Machines / Alarms / Maintenance)
-- รันซ้ำได้ปลอดภัย (idempotent): แถวเดิมไม่ถูกแตะ, แถวใหม่มี guard ทุกแถว
-- ชื่อช่างอ้างอิงจาก profiles.full_name = 'technician1' / '2' / '3'
-- =====================================================================

-- ---------- 1. MACHINES: เพิ่ม 5 เครื่อง (ข้ามถ้า machine_id มีอยู่แล้ว) ----------
insert into machines (machine_id, machine_name, machine_type, location, status) values
  ('MC-PACK-03', 'Case Packer CP-450',      'Packaging',  'Hall 2 - Line 1', 'Running'),
  ('MC-LBL-04',  'Labeling Machine LB-200', 'Packaging',  'Hall 2 - Line 1', 'Stop'),
  ('MC-FILL-05', 'Filling Station FS-80',   'Processing', 'Hall 3',          'Maintenance'),
  ('MC-CONV-01', 'Conveyor System CV-100',  'Conveyor',   'Hall 1',          'Running'),
  ('MC-ROB-02',  'Robotic Arm RB-6000',     'Robotics',   'Hall 1',          'Alarm')
on conflict (machine_id) do nothing;

-- ---------- 2. ALARMS: เพิ่ม 6 แถว (ข้ามถ้า alarm_code มีอยู่แล้ว) ----------

insert into alarms (machine_id, alarm_code, description, occurred_at, status, created_by)
select
  (select id from machines where machine_id = 'MC-PACK-03'),
  'ALM-101',
  'Product jam at infeed conveyor',
  now() - interval '2 hours',
  'In Progress',
  (select id from profiles where full_name = 'technician1' limit 1)
where not exists (select 1 from alarms a where a.alarm_code = 'ALM-101');

insert into alarms (machine_id, alarm_code, description, occurred_at, status, created_by)
select
  (select id from machines where machine_id = 'MC-LBL-04'),
  'ALM-102',
  'Label feed sensor intermittent fault',
  now() - interval '5 hours',
  'Open',
  (select id from profiles where full_name = 'technician2' limit 1)
where not exists (select 1 from alarms a where a.alarm_code = 'ALM-102');

insert into alarms (machine_id, alarm_code, description, occurred_at, status, created_by, closed_by, cause, closed_at)
select
  (select id from machines where machine_id = 'MC-FILL-05'),
  'ALM-103',
  'Nozzle pressure drop below setpoint',
  now() - interval '4 days',
  'Closed',
  (select id from profiles where full_name = 'technician3' limit 1),
  (select id from profiles where full_name = 'technician3' limit 1),
  'Replaced worn nozzle seal and recalibrated pressure controller to 6.2 bar',
  now() - interval '3 days'
where not exists (select 1 from alarms a where a.alarm_code = 'ALM-103');

insert into alarms (machine_id, alarm_code, description, occurred_at, status, created_by, closed_by, cause, closed_at)
select
  (select id from machines where machine_id = 'MC-CONV-01'),
  'ALM-104',
  'Belt tension out of range during startup',
  now() - interval '6 days',
  'Closed',
  (select id from profiles where full_name = 'technician1' limit 1),
  (select id from profiles where full_name = 'technician2' limit 1),
  'Adjusted belt tensioner to specification (450 N) and verified tracking over 30 min run',
  now() - interval '5 days'
where not exists (select 1 from alarms a where a.alarm_code = 'ALM-104');

insert into alarms (machine_id, alarm_code, description, occurred_at, status, created_by)
select
  (select id from machines where machine_id = 'MC-ROB-02'),
  'ALM-105',
  'Tool changer timeout during changeover cycle',
  now() - interval '1 hour',
  'Open',
  (select id from profiles where full_name = 'technician3' limit 1)
where not exists (select 1 from alarms a where a.alarm_code = 'ALM-105');

insert into alarms (machine_id, alarm_code, description, occurred_at, status, created_by, closed_by, cause, closed_at)
select
  (select id from machines where machine_id = 'MC-PACK-03'),
  'ALM-106',
  'Servo overtemperature warning on axis 2',
  now() - interval '8 days',
  'Closed',
  (select id from profiles where full_name = 'technician2' limit 1),
  (select id from profiles where full_name = 'technician1' limit 1),
  'Cleaned servo cooling fan and verified airflow at rated speed',
  now() - interval '7 days'
where not exists (select 1 from alarms a where a.alarm_code = 'ALM-106');

-- ---------- 3. MAINTENANCE RECORDS: เพิ่ม 4 แถว (ข้ามถ้า alarm เดียวกันมีอยู่แล้ว) ----------

insert into maintenance_records (machine_id, alarm_id, technician_id, problem, action_taken, maintained_at, status)
select
  (select id from machines where machine_id = 'MC-PACK-03'),
  (select id from alarms where alarm_code = 'ALM-101'),
  (select id from profiles where full_name = 'technician1' limit 1),
  'Product jam at infeed conveyor — cases accumulating before packer',
  'Disassembled infeed section and clearing jammed cases; checking belt alignment',
  current_date,
  'In Progress'
where not exists (select 1 from maintenance_records mr where mr.alarm_id = (select id from alarms where alarm_code = 'ALM-101'));

insert into maintenance_records (machine_id, alarm_id, technician_id, problem, action_taken, maintained_at, status)
select
  (select id from machines where machine_id = 'MC-LBL-04'),
  (select id from alarms where alarm_code = 'ALM-102'),
  (select id from profiles where full_name = 'technician2' limit 1),
  'Label feed sensor intermittent fault — labels skipping on random cycles',
  null,
  current_date,
  'Pending'
where not exists (select 1 from maintenance_records mr where mr.alarm_id = (select id from alarms where alarm_code = 'ALM-102'));

insert into maintenance_records (machine_id, alarm_id, technician_id, problem, action_taken, maintained_at, status)
select
  (select id from machines where machine_id = 'MC-FILL-05'),
  (select id from alarms where alarm_code = 'ALM-103'),
  (select id from profiles where full_name = 'technician3' limit 1),
  'Nozzle pressure drop below setpoint during filling cycle',
  'Replaced worn nozzle seal and recalibrated pressure controller to 6.2 bar',
  (now() - interval '3 days')::date,
  'Done'
where not exists (select 1 from maintenance_records mr where mr.alarm_id = (select id from alarms where alarm_code = 'ALM-103'));

insert into maintenance_records (machine_id, alarm_id, technician_id, problem, action_taken, maintained_at, status)
select
  (select id from machines where machine_id = 'MC-CONV-01'),
  (select id from alarms where alarm_code = 'ALM-104'),
  (select id from profiles where full_name = 'technician2' limit 1),
  'Belt tension out of range during startup',
  'Adjusted belt tensioner to specification (450 N) and verified tracking over 30 min run',
  (now() - interval '5 days')::date,
  'Done'
where not exists (select 1 from maintenance_records mr where mr.alarm_id = (select id from alarms where alarm_code = 'ALM-104'));

-- ---------- 4. เติมชื่อช่างให้แถว Pending เก่าที่ยังว่างอยู่ (no-op ถ้ามีค่าแล้ว) ----------
update maintenance_records
set technician_id = (select id from profiles where full_name = 'technician1' limit 1)
where id = 'cd723aac-d59f-4285-9de4-aa6f2df3a25e' and technician_id is null;
