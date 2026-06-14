insert into public.dance_styles (id, name, category) values
  ('10000000-0000-0000-0000-000000000001', 'Waltz', 'Standard'),
  ('10000000-0000-0000-0000-000000000002', 'Foxtrot', 'Standard'),
  ('10000000-0000-0000-0000-000000000003', 'Quickstep', 'Standard'),
  ('10000000-0000-0000-0000-000000000004', 'Cha Cha', 'Latin'),
  ('10000000-0000-0000-0000-000000000005', 'Rumba', 'Latin'),
  ('10000000-0000-0000-0000-000000000006', 'Samba', 'Latin'),
  ('10000000-0000-0000-0000-000000000007', 'Social Dance', 'Community')
on conflict (name) do nothing;

insert into public.member_levels (id, name, sort_order, description) values
  ('20000000-0000-0000-0000-000000000001', 'Foundation', 1, 'Dasar gerak, postur, ritme, dan pengenalan ballroom dance.'),
  ('20000000-0000-0000-0000-000000000002', 'Beginner', 2, 'Basic figure dan pola dasar.'),
  ('20000000-0000-0000-0000-000000000003', 'Bronze', 3, 'Kombinasi dasar dan teknik pasangan.'),
  ('20000000-0000-0000-0000-000000000004', 'Silver', 4, 'Variasi, musicality, dan floorcraft.'),
  ('20000000-0000-0000-0000-000000000005', 'Gold', 5, 'Siap showcase atau kompetisi internal.'),
  ('20000000-0000-0000-0000-000000000006', 'Performance / Competition', 6, 'Fokus performa, kompetisi, dan representasi komunitas.')
on conflict (name) do nothing;

insert into public.members (
  id, member_code, full_name, phone, email, joined_at, status,
  membership_type, current_level, classes_taken, attendance_rate, notes
) values
  ('30000000-0000-0000-0000-000000000001', 'BSDS-M-0001', 'Ayu Larasati', '0812-1100-2401', 'ayu.larasati@example.com', '2026-01-12', 'Aktif', 'Reguler', 'Beginner', 18, 86, 'Fokus Waltz dan posture.'),
  ('30000000-0000-0000-0000-000000000002', 'BSDS-M-0002', 'Raka Pradipta', '0812-1100-2402', 'raka.pradipta@example.com', '2025-10-04', 'Aktif', 'Private 4x', 'Bronze', 34, 92, null),
  ('30000000-0000-0000-0000-000000000003', 'BSDS-M-0003', 'Nadia Kirana', '0812-1100-2403', 'nadia.kirana@example.com', '2026-05-19', 'Trial', 'Trial', 'Foundation', 2, 75, null),
  ('30000000-0000-0000-0000-000000000004', 'BSDS-M-0004', 'Bimo Santosa', '0812-1100-2404', 'bimo.santosa@example.com', '2025-03-27', 'Cuti', 'Reguler', 'Silver', 61, 64, null),
  ('30000000-0000-0000-0000-000000000005', 'BSDS-M-0005', 'Sinta Maharani', '0812-1100-2405', 'sinta.maharani@example.com', '2024-08-15', 'Aktif', 'Reguler Plus', 'Gold', 82, 94, null)
on conflict (member_code) do nothing;

insert into public.instructors (
  id, instructor_code, full_name, phone, email, status, level,
  specialties, sessions_this_month, honor_due, achievements_count, bio
) values
  ('40000000-0000-0000-0000-000000000001', 'BSDS-I-001', 'Damar Wicaksono', '0813-2100-4001', 'damar.w@example.com', 'Aktif', 'Senior Instructor', array['Waltz', 'Foxtrot', 'Quickstep'], 22, 12800000, 7, 'Pelatih ballroom standar dengan pengalaman showcase dan kompetisi nasional.'),
  ('40000000-0000-0000-0000-000000000002', 'BSDS-I-002', 'Ratna Sari', '0813-2100-4002', 'ratna.sari@example.com', 'Aktif', 'Professional Instructor', array['Cha Cha', 'Rumba', 'Samba'], 18, 9400000, 5, 'Instruktur latin dance dengan fokus musicality dan expression.'),
  ('40000000-0000-0000-0000-000000000003', 'BSDS-I-003', 'Galih Pamungkas', '0813-2100-4003', 'galih.p@example.com', 'Guest instructor', 'Maestro', array['Tango', 'Social Dance'], 7, 4100000, 11, 'Guest coach untuk teknik partner work dan floorcraft.')
on conflict (instructor_code) do nothing;

insert into public.revenue_sharing (activity_type, instructor_percentage, community_percentage) values
  ('Kelas reguler', 80, 20),
  ('Private class', 80, 20),
  ('Semi-private class', 80, 20),
  ('Workshop', 70, 30),
  ('Trial class', 80, 20),
  ('Ballroom Night', 60, 40)
on conflict (activity_type) do nothing;

insert into public.classes (
  id, class_code, name, class_type, level, dance_style_id, dance_style,
  instructor_id, assistant_instructor_id, day_of_week, start_time, end_time,
  room, capacity, price, status, enrolled_count, revenue_month, attendance_rate
) values
  ('50000000-0000-0000-0000-000000000001', 'BSDS-C-001', 'Waltz Beginner', 'Kelas reguler', 'Beginner', '10000000-0000-0000-0000-000000000001', 'Waltz', '40000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000002', 'Selasa', '19:00', '20:30', 'Studio Heritage', 24, 250000, 'Aktif', 19, 9500000, 88),
  ('50000000-0000-0000-0000-000000000002', 'BSDS-C-002', 'Latin Foundation', 'Kelas reguler', 'Foundation', '10000000-0000-0000-0000-000000000004', 'Cha Cha', '40000000-0000-0000-0000-000000000002', null, 'Kamis', '18:30', '20:00', 'Studio Sangkuriang', 26, 250000, 'Aktif', 22, 11000000, 91),
  ('50000000-0000-0000-0000-000000000003', 'BSDS-PC-014', 'Private Bronze Technique', 'Private class', 'Bronze', '10000000-0000-0000-0000-000000000002', 'Foxtrot', '40000000-0000-0000-0000-000000000001', null, 'Sabtu', '10:00', '11:00', 'Studio Private', 2, 450000, 'Aktif', 1, 3600000, 100),
  ('50000000-0000-0000-0000-000000000004', 'BSDS-C-004', 'Social Dance Night Prep', 'Special class', 'All level', '10000000-0000-0000-0000-000000000007', 'Social Dance', '40000000-0000-0000-0000-000000000003', null, 'Jumat', '19:00', '21:00', 'Pendopo', 40, 150000, 'Aktif', 31, 4650000, 84)
on conflict (class_code) do nothing;

insert into public.attendance (
  id, date, class_id, member_id, instructor_id, status, check_in_time, method, notes
) values
  ('60000000-0000-0000-0000-000000000001', '2026-06-03', '50000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'Hadir', '18:55', 'QR code', 'Natural turn meningkat.'),
  ('60000000-0000-0000-0000-000000000002', '2026-06-03', '50000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001', 'Hadir', '18:58', 'Admin check-in', null),
  ('60000000-0000-0000-0000-000000000003', '2026-06-05', '50000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000002', 'Izin', null, 'Admin check-in', 'Reschedule trial.'),
  ('60000000-0000-0000-0000-000000000004', '2026-06-07', '50000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001', 'Hadir', '09:56', 'Instruktur check-in', null)
on conflict (id) do nothing;

insert into public.payments (
  id, invoice_no, member_id, payer_name, category, amount, status, due_date, paid_at
) values
  ('70000000-0000-0000-0000-000000000001', 'INV-2026-0601', '30000000-0000-0000-0000-000000000001', 'Ayu Larasati', 'Kelas reguler', 250000, 'Paid', '2026-06-05', '2026-06-02'),
  ('70000000-0000-0000-0000-000000000002', 'INV-2026-0602', '30000000-0000-0000-0000-000000000002', 'Raka Pradipta', 'Private class', 1500000, 'Verified', '2026-06-08', '2026-06-07'),
  ('70000000-0000-0000-0000-000000000003', 'INV-2026-0603', '30000000-0000-0000-0000-000000000003', 'Nadia Kirana', 'Trial class', 100000, 'Pending', '2026-06-15', null),
  ('70000000-0000-0000-0000-000000000004', 'INV-2026-0604', '30000000-0000-0000-0000-000000000005', 'Sinta Maharani', 'Workshop', 350000, 'Paid', '2026-06-12', '2026-06-10')
on conflict (invoice_no) do nothing;

insert into public.transactions (id, date, type, category, description, amount, payment_id) values
  ('80000000-0000-0000-0000-000000000001', '2026-06-02', 'cash_in', 'Kas komunitas 20%', 'Share kelas reguler Juni', 50000, '70000000-0000-0000-0000-000000000001'),
  ('80000000-0000-0000-0000-000000000002', '2026-06-07', 'cash_in', 'Kas komunitas 20%', 'Share private class Raka', 300000, '70000000-0000-0000-0000-000000000002'),
  ('80000000-0000-0000-0000-000000000003', '2026-06-09', 'cash_out', 'Promosi dan Branding', 'Desain poster Ballroom Night', 450000, null),
  ('80000000-0000-0000-0000-000000000004', '2026-06-11', 'cash_out', 'Operasional', 'Air minum dan ATK studio', 280000, null)
on conflict (id) do nothing;

insert into public.instructor_honor (
  id, instructor_id, instructor_name, period_start, period_end, period_label,
  class_count, session_count, attendee_count, gross_revenue, instructor_share,
  deductions, bonus, status
) values
  ('90000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'Damar Wicaksono', '2026-06-01', '2026-06-30', 'Juni 2026', 2, 22, 138, 16000000, 12800000, 0, 400000, 'Waiting Approval'),
  ('90000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000002', 'Ratna Sari', '2026-06-01', '2026-06-30', 'Juni 2026', 1, 18, 112, 11750000, 9400000, 0, 250000, 'Approved'),
  ('90000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000003', 'Galih Pamungkas', '2026-06-01', '2026-06-30', 'Juni 2026', 1, 7, 31, 4650000, 3720000, 0, 380000, 'Paid')
on conflict (id) do nothing;

insert into public.events (
  id, event_code, name, event_type, date, time, location, quota,
  registered_count, ticket_price, status, revenue, expenses
) values
  ('a0000000-0000-0000-0000-000000000001', 'EVT-2026-07', 'Ballroom Night Heritage Edition', 'Ballroom Night', '2026-07-12', '19:00', 'Pendopo Bumi Sangkuriang', 80, 54, 150000, 'Open Registration', 8100000, 3600000),
  ('a0000000-0000-0000-0000-000000000002', 'WRK-2026-06', 'Workshop Partnering & Floorcraft', 'Workshop', '2026-06-29', '10:00', 'Studio Heritage', 35, 29, 350000, 'Open Registration', 10150000, 2800000),
  ('a0000000-0000-0000-0000-000000000003', 'TRIAL-2026-06', 'Open Trial Latin Foundation', 'Trial class', '2026-06-20', '18:30', 'Studio Sangkuriang', 20, 13, 100000, 'Open Registration', 1300000, 250000)
on conflict (event_code) do nothing;

insert into public.leads (
  id, full_name, whatsapp, source, interest_class, first_contact_at, status, notes
) values
  ('b0000000-0000-0000-0000-000000000001', 'Meita Rosalia', '0812-3300-5101', 'Instagram', 'Latin Foundation', '2026-06-10', 'Trial scheduled', 'Datang trial 20 Juni.'),
  ('b0000000-0000-0000-0000-000000000002', 'Arman Fikri', '0812-3300-5102', 'Referral', 'Waltz Beginner', '2026-06-09', 'Contacted', 'Menunggu jadwal kerja.'),
  ('b0000000-0000-0000-0000-000000000003', 'Livia Anindya', '0812-3300-5103', 'Event', 'Private class', '2026-06-08', 'Interested', 'Tertarik paket private 4x.')
on conflict (id) do nothing;

insert into public.badges (id, name, description, icon, requirement) values
  ('c0000000-0000-0000-0000-000000000001', 'First Class', 'Kelas pertama selesai.', 'sparkles', '1 attendance'),
  ('c0000000-0000-0000-0000-000000000002', '10 Classes Completed', 'Menyelesaikan 10 kelas.', 'award', '10 attendance'),
  ('c0000000-0000-0000-0000-000000000003', '25 Classes Completed', 'Menyelesaikan 25 kelas.', 'medal', '25 attendance'),
  ('c0000000-0000-0000-0000-000000000004', 'Consistent Attendance', 'Kehadiran konsisten bulan berjalan.', 'calendar-check', 'attendance >= 85%'),
  ('c0000000-0000-0000-0000-000000000005', 'Bronze Achiever', 'Naik ke level Bronze.', 'trophy', 'level Bronze')
on conflict (name) do nothing;

