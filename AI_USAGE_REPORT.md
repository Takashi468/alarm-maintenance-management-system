# รายงานการใช้ AI ในการพัฒนา AMMS

**โครงการ:** Alarm & Maintenance Management System (AMMS)
**ผู้พัฒนา:** Takashi
**เครื่องมือ AI ที่ใช้:** Claude (Claude Code)

## 1. ภาพรวมการใช้งาน

ใช้ AI (Claude Code) ช่วยตลอดวงจรการพัฒนา ตั้งแต่การออกแบบฐานข้อมูล เขียนโค้ด ไปจนถึงการตรวจสอบความครบถ้วนก่อนส่งงาน โดยพัฒนาเป็นโมดูลย่อยทีละส่วนและ commit ต่อเนื่อง (ดู git log) ไม่ใช่การให้ AI สร้างทั้งระบบในครั้งเดียว

## 2. งานที่ AI ช่วยทำ (ตามลำดับ commit จริง)

| ขั้นตอน | สิ่งที่ AI ช่วย |
| --- | --- |
| Auth + Machine module | ออกแบบ Supabase Auth flow, เขียน Server Actions และหน้า CRUD ของ Machine พร้อม validation (unique machine_id, ห้ามค่าว่าง) |
| Alarm module | ออกแบบ state machine ของสถานะ alarm (Open → In Progress → Closed) และ business rule ว่าปิด alarm ต้องมี `cause` และ `closed_by/closed_at` ที่ระบบกำหนดฝั่ง server เท่านั้น |
| Maintenance module | เขียน CRU flow ที่เชื่อมกับ machine และ alarm (optional FK) พร้อม constraint ว่าสถานะ Done ต้องมี action_taken |
| User management module | เขียนหน้าจัดการ role ของผู้ใช้ (admin-only) |
| Dashboard module | เขียน query สรุปจำนวนเครื่องจักรตามสถานะ, alarm ล่าสุด, maintenance backlog |
| PLC Mock Simulator | ออกแบบและเขียนหน้าจำลองสัญญาณจาก PLC สำหรับทดสอบ workflow แบบ end-to-end |
| CI/CD | เขียน GitHub Actions workflow (lint → build → test) |
| README | เขียนเอกสารภาพรวมโครงการ, DB structure, วิธีติดตั้ง |
| UI Redesign | ปรับ theme เป็น dark industrial SCADA style |
| Database Schema (SQL) | Export enum/table/index/RLS policy จาก Supabase เป็นไฟล์ `supabase/schema.sql` ที่ commit เข้า repo ได้ |
| Audit ก่อนส่งงาน | ตรวจสอบ codebase เทียบกับเกณฑ์การให้คะแนนทั้งหมด (CRUD, RLS, validation, CI, secret leak) เพื่อหาช่องว่างก่อนส่งงานจริง |
| E2E Screenshot | เขียนสคริปต์ Playwright ใช้ test account (admin) login เข้าระบบจริงบน Vercel แล้ว capture หน้า Dashboard/Machines/Alarms/Maintenance/Simulator |

## 3. สิ่งที่คนเป็นผู้กำหนด (ไม่ปล่อยให้ AI ตัดสินใจเอง)

- **Security boundary**: การตรวจสิทธิ์ทำ 3 ชั้น — Middleware (กันหน้าที่ไม่ login), Server Action guard (`requireAdmin`/`requireStaff`), และ RLS policy ใน Postgres เป็นชั้นสุดท้าย ไม่พึ่งการซ่อนปุ่มใน UI อย่างเดียว
- **Business rule ของ workflow**: เงื่อนไขการเปลี่ยนสถานะ alarm/maintenance และ field ที่บังคับต้องมีก่อนปิดงาน เป็นการตัดสินใจของผู้พัฒนา ไม่ใช่ AI คิดเอง
- **การตรวจสอบ**: ทุก commit ผ่านการรัน lint/build/typecheck จริงก่อน push และมีการ manual test ผ่านหน้าเว็บจริงด้วย test account

## 4. ข้อจำกัดที่พบจากการใช้ AI

- AI สามารถเขียนโค้ดได้เร็ว แต่ยังต้องมีคนตรวจ business logic และ security policy ทุกครั้ง เพราะ AI ไม่รู้ context ของกฎการทำงานจริงของโรงงาน
- ต้องสั่งให้ AI export schema เป็น SQL แยกจาก TypeScript types เอง เพราะ AI ไม่ได้ทำให้อัตโนมัติตั้งแต่แรก
