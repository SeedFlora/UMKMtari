create extension if not exists pgcrypto;

do $$
begin
  create type public.app_role as enum (
    'super_admin',
    'admin_operasional',
    'admin_keuangan',
    'instruktur',
    'member'
  );
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.member_status as enum (
    'Aktif',
    'Tidak aktif',
    'Trial',
    'Cuti',
    'Alumni',
    'Blacklist'
  );
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.attendance_status as enum (
    'Hadir',
    'Izin',
    'Sakit',
    'Alpha',
    'Make-up class'
  );
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.payment_status as enum (
    'Draft',
    'Pending',
    'Verified',
    'Paid',
    'Overdue',
    'Cancelled'
  );
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.honor_status as enum (
    'Draft',
    'Waiting Approval',
    'Approved',
    'Paid',
    'Cancelled'
  );
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.event_status as enum (
    'Draft',
    'Open Registration',
    'Closed',
    'Completed',
    'Cancelled'
  );
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.lead_status as enum (
    'New lead',
    'Contacted',
    'Trial scheduled',
    'Trial completed',
    'Interested',
    'Converted to member',
    'Not interested',
    'Follow up later'
  );
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.portfolio_status as enum (
    'Draft',
    'Pending Verification',
    'Approved',
    'Rejected',
    'Need Revision'
  );
exception when duplicate_object then null;
end $$;

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  member_code text unique not null,
  full_name text not null,
  photo_url text,
  phone text,
  email text,
  birth_date date,
  gender text,
  address text,
  occupation text,
  emergency_contact text,
  joined_at date not null default current_date,
  status public.member_status not null default 'Trial',
  membership_type text,
  current_level text not null default 'Foundation',
  classes_taken integer not null default 0,
  attendance_rate numeric(5,2) not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.instructors (
  id uuid primary key default gen_random_uuid(),
  instructor_code text unique not null,
  full_name text not null,
  photo_url text,
  phone text,
  email text,
  birth_date date,
  address text,
  status text not null default 'Aktif',
  level text,
  specialties text[] not null default '{}',
  teaching_since integer,
  bio text,
  social_links jsonb not null default '{}',
  video_url text,
  bank_account text,
  sessions_this_month integer not null default 0,
  honor_due numeric(14,2) not null default 0,
  achievements_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.app_role not null default 'member',
  member_id uuid references public.members(id) on delete set null,
  instructor_id uuid references public.instructors(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.dance_styles (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  category text,
  created_at timestamptz not null default now()
);

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  class_code text unique not null,
  name text not null,
  class_type text not null,
  level text,
  dance_style_id uuid references public.dance_styles(id) on delete set null,
  dance_style text,
  instructor_id uuid references public.instructors(id) on delete set null,
  assistant_instructor_id uuid references public.instructors(id) on delete set null,
  day_of_week text not null,
  start_time time not null,
  end_time time not null,
  room text,
  capacity integer not null default 0,
  price numeric(14,2) not null default 0,
  status text not null default 'Aktif',
  enrolled_count integer not null default 0,
  revenue_month numeric(14,2) not null default 0,
  attendance_rate numeric(5,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.class_enrollments (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,
  enrolled_at date not null default current_date,
  status text not null default 'Aktif',
  unique (class_id, member_id)
);

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  date date not null default current_date,
  class_id uuid references public.classes(id) on delete set null,
  member_id uuid references public.members(id) on delete set null,
  instructor_id uuid references public.instructors(id) on delete set null,
  class_name text,
  member_name text,
  instructor_name text,
  status public.attendance_status not null default 'Hadir',
  check_in_time time,
  method text not null default 'Admin check-in',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.private_packages (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  instructor_id uuid references public.instructors(id) on delete set null,
  package_name text not null,
  total_sessions integer not null,
  used_sessions integer not null default 0,
  price numeric(14,2) not null default 0,
  payment_status public.payment_status not null default 'Pending',
  package_status text not null default 'Aktif',
  started_at date not null default current_date,
  expires_at date,
  created_at timestamptz not null default now()
);

create table if not exists public.revenue_sharing (
  id uuid primary key default gen_random_uuid(),
  activity_type text unique not null,
  instructor_percentage numeric(5,2) not null default 80,
  community_percentage numeric(5,2) not null default 20,
  fixed_instructor_fee numeric(14,2),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint revenue_sharing_percentage_check
    check (instructor_percentage + community_percentage = 100)
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  invoice_no text unique not null,
  member_id uuid references public.members(id) on delete set null,
  payer_name text,
  category text not null,
  amount numeric(14,2) not null default 0,
  status public.payment_status not null default 'Pending',
  due_date date not null default current_date,
  paid_at date,
  proof_url text,
  instructor_share numeric(14,2) not null default 0,
  community_share numeric(14,2) not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  date date not null default current_date,
  type text not null check (type in ('cash_in', 'cash_out')),
  category text not null,
  description text not null,
  amount numeric(14,2) not null default 0,
  payment_id uuid references public.payments(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.instructor_honor (
  id uuid primary key default gen_random_uuid(),
  instructor_id uuid references public.instructors(id) on delete set null,
  instructor_name text,
  period_start date not null,
  period_end date not null,
  period_label text not null,
  class_count integer not null default 0,
  session_count integer not null default 0,
  attendee_count integer not null default 0,
  gross_revenue numeric(14,2) not null default 0,
  instructor_share numeric(14,2) not null default 0,
  deductions numeric(14,2) not null default 0,
  bonus numeric(14,2) not null default 0,
  total_honor numeric(14,2) generated always as (instructor_share - deductions + bonus) stored,
  status public.honor_status not null default 'Draft',
  paid_at date,
  treasurer_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  event_code text unique not null,
  name text not null,
  event_type text not null,
  date date not null,
  time time not null,
  location text not null,
  description text,
  poster_url text,
  quota integer not null default 0,
  registered_count integer not null default 0,
  ticket_price numeric(14,2) not null default 0,
  pic text,
  status public.event_status not null default 'Draft',
  revenue numeric(14,2) not null default 0,
  expenses numeric(14,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  member_id uuid references public.members(id) on delete set null,
  lead_id uuid,
  participant_name text not null,
  payment_status public.payment_status not null default 'Pending',
  checked_in_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  whatsapp text not null,
  email text,
  source text not null,
  interest_class text,
  first_contact_at date not null default current_date,
  status public.lead_status not null default 'New lead',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.member_levels (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  sort_order integer not null,
  description text
);

create table if not exists public.skill_matrix (
  id uuid primary key default gen_random_uuid(),
  level_id uuid references public.member_levels(id) on delete cascade,
  dance_style_id uuid references public.dance_styles(id) on delete set null,
  skill_name text not null,
  description text,
  sort_order integer not null default 0
);

create table if not exists public.member_skill_progress (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references public.members(id) on delete cascade,
  skill_id uuid references public.skill_matrix(id) on delete cascade,
  status text not null default 'Belum dimulai',
  updated_by uuid references public.instructors(id) on delete set null,
  updated_at timestamptz not null default now(),
  unique (member_id, skill_id)
);

create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references public.members(id) on delete cascade,
  instructor_id uuid references public.instructors(id) on delete set null,
  assessed_at date not null default current_date,
  level text not null,
  technique numeric(3,1) not null default 0,
  posture numeric(3,1) not null default 0,
  timing numeric(3,1) not null default 0,
  musicality numeric(3,1) not null default 0,
  partnering numeric(3,1) not null default 0,
  expression numeric(3,1) not null default 0,
  floorcraft numeric(3,1) not null default 0,
  confidence numeric(3,1) not null default 0,
  feedback text,
  average_score numeric(3,2) generated always as (
    (technique + posture + timing + musicality + partnering + expression + floorcraft + confidence) / 8
  ) stored
);

create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  description text,
  icon text,
  requirement text
);

create table if not exists public.member_badges (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references public.members(id) on delete cascade,
  badge_id uuid references public.badges(id) on delete cascade,
  awarded_at date not null default current_date,
  unique (member_id, badge_id)
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  certificate_no text unique not null,
  recipient_name text not null,
  member_id uuid references public.members(id) on delete set null,
  certificate_type text not null,
  activity_name text not null,
  issued_at date not null default current_date,
  template_url text,
  signature_url text,
  verification_code text unique not null default encode(gen_random_bytes(8), 'hex'),
  pdf_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.instructor_achievements (
  id uuid primary key default gen_random_uuid(),
  instructor_id uuid not null references public.instructors(id) on delete cascade,
  achievement_type text not null,
  title text not null,
  year integer,
  location text,
  category text,
  dance_style text,
  rank text,
  organizer text,
  proof_url text,
  status public.portfolio_status not null default 'Pending Verification',
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.files (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid,
  owner_type text,
  file_name text not null,
  file_url text not null,
  mime_type text,
  file_size integer,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_profile_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  channel text not null default 'in-app',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists members_touch_updated_at on public.members;
create trigger members_touch_updated_at
before update on public.members
for each row execute function public.touch_updated_at();

drop trigger if exists instructors_touch_updated_at on public.instructors;
create trigger instructors_touch_updated_at
before update on public.instructors
for each row execute function public.touch_updated_at();

drop trigger if exists classes_touch_updated_at on public.classes;
create trigger classes_touch_updated_at
before update on public.classes
for each row execute function public.touch_updated_at();

drop trigger if exists payments_touch_updated_at on public.payments;
create trigger payments_touch_updated_at
before update on public.payments
for each row execute function public.touch_updated_at();

drop trigger if exists revenue_sharing_touch_updated_at on public.revenue_sharing;
create trigger revenue_sharing_touch_updated_at
before update on public.revenue_sharing
for each row execute function public.touch_updated_at();

create or replace function public.apply_revenue_sharing()
returns trigger
language plpgsql
as $$
declare
  sharing public.revenue_sharing%rowtype;
begin
  select *
  into sharing
  from public.revenue_sharing
  where active = true and lower(activity_type) = lower(new.category)
  limit 1;

  if sharing.id is null then
    new.instructor_share := round(new.amount * 0.8, 2);
    new.community_share := round(new.amount * 0.2, 2);
  elsif sharing.fixed_instructor_fee is not null then
    new.instructor_share := least(sharing.fixed_instructor_fee, new.amount);
    new.community_share := greatest(new.amount - new.instructor_share, 0);
  else
    new.instructor_share := round(new.amount * sharing.instructor_percentage / 100, 2);
    new.community_share := round(new.amount * sharing.community_percentage / 100, 2);
  end if;

  return new;
end;
$$;

drop trigger if exists payments_apply_revenue_sharing on public.payments;
create trigger payments_apply_revenue_sharing
before insert or update of amount, category
on public.payments
for each row execute function public.apply_revenue_sharing();

create or replace view public.member_progress_summary as
select
  m.id,
  m.full_name as member_name,
  m.current_level,
  case m.current_level
    when 'Foundation' then 'Beginner'
    when 'Beginner' then 'Bronze'
    when 'Bronze' then 'Silver'
    when 'Silver' then 'Gold'
    when 'Gold' then 'Performance / Competition'
    else 'Performance / Competition'
  end as target_level,
  coalesce(round(
    100.0 * count(msp.id) filter (where msp.status in ('Dikuasai', 'Lulus assessment'))
    / nullif(count(sm.id), 0)
  ), m.attendance_rate) as progress_percent,
  m.attendance_rate as attendance_month,
  count(msp.id) filter (where msp.status in ('Dikuasai', 'Lulus assessment'))::integer as mastered_skills,
  count(sm.id)::integer as total_skills,
  coalesce(round(avg(a.average_score), 2), 0) as assessment_average,
  coalesce(array_agg(distinct b.name) filter (where b.name is not null), '{}') as badges,
  coalesce((array_agg(a.feedback order by a.assessed_at desc) filter (where a.feedback is not null))[1], '') as feedback
from public.members m
left join public.member_levels ml on ml.name = m.current_level
left join public.skill_matrix sm on sm.level_id = ml.id
left join public.member_skill_progress msp on msp.member_id = m.id and msp.skill_id = sm.id
left join public.assessments a on a.member_id = m.id
left join public.member_badges mb on mb.member_id = m.id
left join public.badges b on b.id = mb.badge_id
group by m.id, m.full_name, m.current_level, m.attendance_rate;

create or replace function public.current_app_role()
returns public.app_role
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_staff()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(public.current_app_role() in ('super_admin', 'admin_operasional', 'admin_keuangan'), false)
$$;

alter table public.members enable row level security;
alter table public.instructors enable row level security;
alter table public.profiles enable row level security;
alter table public.dance_styles enable row level security;
alter table public.classes enable row level security;
alter table public.class_enrollments enable row level security;
alter table public.attendance enable row level security;
alter table public.private_packages enable row level security;
alter table public.revenue_sharing enable row level security;
alter table public.payments enable row level security;
alter table public.transactions enable row level security;
alter table public.instructor_honor enable row level security;
alter table public.events enable row level security;
alter table public.event_registrations enable row level security;
alter table public.leads enable row level security;
alter table public.member_levels enable row level security;
alter table public.skill_matrix enable row level security;
alter table public.member_skill_progress enable row level security;
alter table public.assessments enable row level security;
alter table public.badges enable row level security;
alter table public.member_badges enable row level security;
alter table public.certificates enable row level security;
alter table public.instructor_achievements enable row level security;
alter table public.files enable row level security;
alter table public.notifications enable row level security;

create policy "staff can manage members" on public.members
  for all using (public.is_staff()) with check (public.is_staff());
create policy "members can view self" on public.members
  for select using (id in (select member_id from public.profiles where id = auth.uid()));

create policy "staff can manage instructors" on public.instructors
  for all using (public.is_staff()) with check (public.is_staff());
create policy "instructors can view self" on public.instructors
  for select using (id in (select instructor_id from public.profiles where id = auth.uid()));

create policy "users can view own profile" on public.profiles
  for select using (id = auth.uid() or public.is_staff());
create policy "staff can manage profiles" on public.profiles
  for all using (public.is_staff()) with check (public.is_staff());

create policy "authenticated can view master data" on public.dance_styles
  for select using (auth.uid() is not null);
create policy "staff can manage dance styles" on public.dance_styles
  for all using (public.is_staff()) with check (public.is_staff());

create policy "authenticated can view classes" on public.classes
  for select using (auth.uid() is not null);
create policy "staff can manage classes" on public.classes
  for all using (public.is_staff()) with check (public.is_staff());

create policy "staff can manage operational tables" on public.class_enrollments
  for all using (public.is_staff()) with check (public.is_staff());
create policy "staff can manage attendance" on public.attendance
  for all using (public.is_staff()) with check (public.is_staff());
create policy "instructors can add attendance" on public.attendance
  for insert with check (public.current_app_role() = 'instruktur');
create policy "members can view own attendance" on public.attendance
  for select using (member_id in (select member_id from public.profiles where id = auth.uid()) or public.is_staff());

create policy "staff can manage private packages" on public.private_packages
  for all using (public.is_staff()) with check (public.is_staff());
create policy "members can view own private packages" on public.private_packages
  for select using (member_id in (select member_id from public.profiles where id = auth.uid()));

create policy "finance can manage revenue sharing" on public.revenue_sharing
  for all using (public.current_app_role() in ('super_admin', 'admin_keuangan'))
  with check (public.current_app_role() in ('super_admin', 'admin_keuangan'));

create policy "finance can manage payments" on public.payments
  for all using (public.current_app_role() in ('super_admin', 'admin_keuangan', 'admin_operasional'))
  with check (public.current_app_role() in ('super_admin', 'admin_keuangan', 'admin_operasional'));
create policy "members can view own payments" on public.payments
  for select using (member_id in (select member_id from public.profiles where id = auth.uid()));

create policy "finance can manage transactions" on public.transactions
  for all using (public.current_app_role() in ('super_admin', 'admin_keuangan'))
  with check (public.current_app_role() in ('super_admin', 'admin_keuangan'));

create policy "finance can manage honor" on public.instructor_honor
  for all using (public.current_app_role() in ('super_admin', 'admin_keuangan'))
  with check (public.current_app_role() in ('super_admin', 'admin_keuangan'));
create policy "instructors can view own honor" on public.instructor_honor
  for select using (instructor_id in (select instructor_id from public.profiles where id = auth.uid()));

create policy "authenticated can view events" on public.events
  for select using (auth.uid() is not null);
create policy "staff can manage events" on public.events
  for all using (public.is_staff()) with check (public.is_staff());

create policy "staff can manage crm" on public.leads
  for all using (public.is_staff()) with check (public.is_staff());
create policy "staff can manage event registrations" on public.event_registrations
  for all using (public.is_staff()) with check (public.is_staff());

create policy "authenticated can view progress master data" on public.member_levels
  for select using (auth.uid() is not null);
create policy "authenticated can view skill matrix" on public.skill_matrix
  for select using (auth.uid() is not null);
create policy "staff can manage member levels" on public.member_levels
  for all using (public.is_staff()) with check (public.is_staff());
create policy "staff can manage skill matrix" on public.skill_matrix
  for all using (public.is_staff()) with check (public.is_staff());

create policy "staff can manage skill progress" on public.member_skill_progress
  for all using (public.is_staff() or public.current_app_role() = 'instruktur')
  with check (public.is_staff() or public.current_app_role() = 'instruktur');
create policy "members can view own skill progress" on public.member_skill_progress
  for select using (member_id in (select member_id from public.profiles where id = auth.uid()));

create policy "staff and instructors can manage assessments" on public.assessments
  for all using (public.is_staff() or public.current_app_role() = 'instruktur')
  with check (public.is_staff() or public.current_app_role() = 'instruktur');
create policy "members can view own assessments" on public.assessments
  for select using (member_id in (select member_id from public.profiles where id = auth.uid()));

create policy "authenticated can view badges" on public.badges
  for select using (auth.uid() is not null);
create policy "staff can manage badges" on public.badges
  for all using (public.is_staff()) with check (public.is_staff());
create policy "members can view own badges" on public.member_badges
  for select using (member_id in (select member_id from public.profiles where id = auth.uid()) or public.is_staff());
create policy "staff can manage member badges" on public.member_badges
  for all using (public.is_staff()) with check (public.is_staff());

create policy "staff can manage certificates" on public.certificates
  for all using (public.is_staff()) with check (public.is_staff());
create policy "members can view own certificates" on public.certificates
  for select using (member_id in (select member_id from public.profiles where id = auth.uid()));

create policy "staff can manage instructor achievements" on public.instructor_achievements
  for all using (public.is_staff()) with check (public.is_staff());
create policy "instructors can manage own achievements" on public.instructor_achievements
  for all using (instructor_id in (select instructor_id from public.profiles where id = auth.uid()))
  with check (instructor_id in (select instructor_id from public.profiles where id = auth.uid()));
create policy "authenticated can view public achievements" on public.instructor_achievements
  for select using (is_public = true or public.is_staff());

create policy "staff can manage files" on public.files
  for all using (public.is_staff()) with check (public.is_staff());
create policy "users can view own notifications" on public.notifications
  for select using (recipient_profile_id = auth.uid() or public.is_staff());
create policy "staff can manage notifications" on public.notifications
  for all using (public.is_staff()) with check (public.is_staff());

