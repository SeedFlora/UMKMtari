-- Run after schema.sql on an existing Supabase project to enable role-based
-- instructor/member portal access without recreating tables.

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'class_enrollments'
      and policyname = 'instructors can view assigned class enrollments'
  ) then
    create policy "instructors can view assigned class enrollments"
    on public.class_enrollments
    for select
    using (
      exists (
        select 1
        from public.classes c
        join public.profiles p on p.id = auth.uid()
        where c.id = class_enrollments.class_id
          and p.role = 'instruktur'
          and p.instructor_id in (c.instructor_id, c.assistant_instructor_id)
      )
    );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'class_enrollments'
      and policyname = 'members can view own class enrollments'
  ) then
    create policy "members can view own class enrollments"
    on public.class_enrollments
    for select
    using (
      member_id in (
        select member_id from public.profiles where id = auth.uid()
      )
    );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'members'
      and policyname = 'instructors can view assigned members'
  ) then
    create policy "instructors can view assigned members"
    on public.members
    for select
    using (
      exists (
        select 1
        from public.class_enrollments ce
        join public.classes c on c.id = ce.class_id
        join public.profiles p on p.id = auth.uid()
        where ce.member_id = members.id
          and p.role = 'instruktur'
          and p.instructor_id in (c.instructor_id, c.assistant_instructor_id)
      )
    );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'attendance'
      and policyname = 'instructors can view assigned attendance'
  ) then
    create policy "instructors can view assigned attendance"
    on public.attendance
    for select
    using (
      instructor_id in (
        select instructor_id from public.profiles where id = auth.uid()
      )
      or exists (
        select 1
        from public.classes c
        join public.profiles p on p.id = auth.uid()
        where c.id = attendance.class_id
          and p.role = 'instruktur'
          and p.instructor_id in (c.instructor_id, c.assistant_instructor_id)
      )
    );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'instructors'
      and policyname = 'members can view instructors from enrolled classes'
  ) then
    create policy "members can view instructors from enrolled classes"
    on public.instructors
    for select
    using (
      exists (
        select 1
        from public.class_enrollments ce
        join public.classes c on c.id = ce.class_id
        join public.profiles p on p.id = auth.uid()
        where ce.member_id = p.member_id
          and instructors.id in (c.instructor_id, c.assistant_instructor_id)
      )
    );
  end if;
end $$;

-- After creating a Supabase Auth user, link it to a business profile.
-- Replace USER_UID_DARI_SUPABASE with the UUID from Authentication > Users.
--
-- Member:
-- insert into public.profiles (id, full_name, role, member_id)
-- values (
--   'USER_UID_DARI_SUPABASE',
--   'Ayu Larasati',
--   'member',
--   '30000000-0000-0000-0000-000000000001'
-- )
-- on conflict (id) do update set
--   full_name = excluded.full_name,
--   role = excluded.role,
--   member_id = excluded.member_id,
--   instructor_id = null,
--   updated_at = now();
--
-- Instructor:
-- insert into public.profiles (id, full_name, role, instructor_id)
-- values (
--   'USER_UID_DARI_SUPABASE',
--   'Damar Wicaksono',
--   'instruktur',
--   '40000000-0000-0000-0000-000000000001'
-- )
-- on conflict (id) do update set
--   full_name = excluded.full_name,
--   role = excluded.role,
--   member_id = null,
--   instructor_id = excluded.instructor_id,
--   updated_at = now();
