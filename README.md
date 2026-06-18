# BDMS Digital Management System

Full-stack Next.js + Supabase app untuk Bumi Sangkuriang Dance Sport.

## Stack

- Next.js App Router + React + TypeScript
- Supabase Auth, PostgreSQL, RLS, dan service-role server data layer
- Tailwind CSS + shadcn/ui
- Vercel-ready deployment

## Modul

- Dashboard admin
- Membership management
- Class management
- Attendance management
- Instructor portfolio summary
- Portal instruktur untuk cek kelas, tambah achievement, dan beri feedback member
- Portal member untuk cek jadwal, attendance, profil instruktur, feedback, dan progress level
- Financial management dan cash flow
- Instructor honor calculation
- Event management
- CRM prospective member
- Member progress dan Digital Dance Passport
- Analytics/report dan CSV export
- System settings/master data

## Local Development

```bash
npm install
npm run dev
```

Tanpa env Supabase, aplikasi berjalan dalam mode demo memakai seed data lokal.

## Supabase Setup

1. Buat project Supabase.
2. Jalankan `supabase/schema.sql` di SQL Editor Supabase.
3. Jalankan `supabase/portal_features.sql` untuk policy akses portal instruktur/member.
4. Jalankan `supabase/seed.sql` untuk data awal.
5. Isi env:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

`SUPABASE_SERVICE_ROLE_KEY` hanya dipakai di server untuk dashboard admin dan Server Actions. Jangan gunakan key ini di client component.

### Link Akun Portal

Setelah membuat user di Supabase Authentication, hubungkan user ke data bisnis melalui tabel `profiles`.
Template SQL ada di `supabase/portal_features.sql`.

- Role `instruktur` wajib punya `instructor_id`.
- Role `member` wajib punya `member_id`.
- Setelah login, instruktur diarahkan ke `/instruktur` dan member diarahkan ke `/member`.

## Deploy ke Vercel

1. Push folder `bdms` ke GitHub.
2. Import repository di Vercel.
3. Tambahkan env di Project Settings.
4. Build command: `npm run build`.
5. Output Next.js otomatis terdeteksi oleh Vercel.

## API

- `GET /api/health`
- `GET /api/dashboard`
- `GET /api/members`
- `POST /api/members`
- `GET /api/export/members`
