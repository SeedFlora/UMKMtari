import "server-only";

import {
  attendance as sampleAttendance,
  classes as sampleClasses,
  instructors as sampleInstructors,
  members as sampleMembers,
  progress as sampleProgress,
} from "./sample-data";
import { createSupabaseAdmin } from "./supabase-admin";
import type { CurrentProfile } from "./auth";
import type {
  AttendanceRecord,
  DanceClass,
  Instructor,
  Member,
  MemberProgress,
} from "./types";

type DbRow = Record<string, unknown>;

export type InstructorAchievement = {
  id: string;
  title: string;
  type: string;
  year: number | null;
  location: string;
  category: string;
  danceStyle: string;
  rank: string;
  organizer: string;
  status: string;
  isPublic: boolean;
};

export type InstructorFeedback = {
  id: string;
  memberId: string;
  memberName: string;
  assessedAt: string;
  level: string;
  averageScore: number;
  feedback: string;
};

export type InstructorStudent = Member & {
  classNames: string[];
  lastFeedback?: string;
};

export type InstructorPortalData = {
  isConnected: boolean;
  instructor: Instructor | null;
  classes: DanceClass[];
  students: InstructorStudent[];
  attendance: AttendanceRecord[];
  achievements: InstructorAchievement[];
  feedback: InstructorFeedback[];
};

export type MemberInstructor = Instructor & {
  publicAchievements: InstructorAchievement[];
};

export type MemberPortalData = {
  isConnected: boolean;
  member: Member | null;
  classes: DanceClass[];
  attendance: AttendanceRecord[];
  instructors: MemberInstructor[];
  feedback: InstructorFeedback[];
  progress: MemberProgress | null;
};

function safeNumber(value: unknown) {
  return typeof value === "number" ? value : Number(value ?? 0);
}

function isRow(value: unknown): value is DbRow {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function asRow(value: unknown): DbRow {
  return isRow(value) ? value : {};
}

function stringValue(row: DbRow, key: string, fallback = "") {
  const value = row[key];
  return typeof value === "string" ? value : fallback;
}

function optionalString(row: DbRow, key: string) {
  const value = row[key];
  return typeof value === "string" && value ? value : undefined;
}

function stringArrayValue(row: DbRow, key: string) {
  const value = row[key];
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function mapInstructor(value: unknown): Instructor {
  const row = asRow(value);

  return {
    id: stringValue(row, "id"),
    instructorCode: stringValue(row, "instructor_code"),
    fullName: stringValue(row, "full_name"),
    phone: stringValue(row, "phone", "-"),
    email: stringValue(row, "email", "-"),
    status: stringValue(row, "status", "-"),
    level: stringValue(row, "level", "-"),
    specialties: stringArrayValue(row, "specialties"),
    sessionsThisMonth: safeNumber(row.sessions_this_month),
    honorDue: safeNumber(row.honor_due),
    achievementsCount: safeNumber(row.achievements_count),
    bio: stringValue(row, "bio"),
  };
}

function mapMember(value: unknown): Member {
  const row = asRow(value);

  return {
    id: stringValue(row, "id"),
    memberCode: stringValue(row, "member_code"),
    fullName: stringValue(row, "full_name"),
    phone: stringValue(row, "phone", "-"),
    email: stringValue(row, "email", "-"),
    joinedAt: stringValue(row, "joined_at"),
    status: stringValue(row, "status", "Trial") as Member["status"],
    membershipType: stringValue(row, "membership_type", "-"),
    currentLevel: stringValue(row, "current_level", "Foundation"),
    classesTaken: safeNumber(row.classes_taken),
    attendanceRate: safeNumber(row.attendance_rate),
    notes: optionalString(row, "notes"),
  };
}

function mapClass(value: unknown): DanceClass {
  const row = asRow(value);
  const danceStyles = asRow(row.dance_styles);
  const instructor = asRow(row.instructor);
  const instructors = asRow(row.instructors);
  const assistant = asRow(row.assistant);

  return {
    id: stringValue(row, "id"),
    classCode: stringValue(row, "class_code"),
    name: stringValue(row, "name"),
    type: stringValue(row, "class_type"),
    level: stringValue(row, "level", "-"),
    danceStyle: stringValue(danceStyles, "name", stringValue(row, "dance_style", "-")),
    instructorName: stringValue(
      instructor,
      "full_name",
      stringValue(instructors, "full_name", "-"),
    ),
    assistantName: optionalString(assistant, "full_name"),
    day: stringValue(row, "day_of_week"),
    startTime: stringValue(row, "start_time"),
    endTime: stringValue(row, "end_time"),
    room: stringValue(row, "room", "-"),
    capacity: safeNumber(row.capacity),
    enrolled: safeNumber(row.enrolled_count),
    price: safeNumber(row.price),
    status: stringValue(row, "status", "-"),
    revenueMonth: safeNumber(row.revenue_month),
    attendanceRate: safeNumber(row.attendance_rate),
  };
}

function mapAttendance(value: unknown): AttendanceRecord {
  const row = asRow(value);
  const classes = asRow(row.classes);
  const members = asRow(row.members);
  const instructors = asRow(row.instructors);

  return {
    id: stringValue(row, "id"),
    date: stringValue(row, "date"),
    className: stringValue(classes, "name", stringValue(row, "class_name", "-")),
    memberName: stringValue(members, "full_name", stringValue(row, "member_name", "-")),
    instructorName: stringValue(
      instructors,
      "full_name",
      stringValue(row, "instructor_name", "-"),
    ),
    status: stringValue(row, "status", "Hadir") as AttendanceRecord["status"],
    checkInTime: stringValue(row, "check_in_time", "-"),
    method: stringValue(row, "method", "Admin check-in"),
    notes: optionalString(row, "notes"),
  };
}

function mapAchievement(value: unknown): InstructorAchievement {
  const row = asRow(value);

  return {
    id: stringValue(row, "id"),
    title: stringValue(row, "title"),
    type: stringValue(row, "achievement_type"),
    year: row.year === null || row.year === undefined ? null : safeNumber(row.year),
    location: stringValue(row, "location", "-"),
    category: stringValue(row, "category", "-"),
    danceStyle: stringValue(row, "dance_style", "-"),
    rank: stringValue(row, "rank", "-"),
    organizer: stringValue(row, "organizer", "-"),
    status: stringValue(row, "status", "-"),
    isPublic: Boolean(row.is_public),
  };
}

function mapFeedback(value: unknown): InstructorFeedback {
  const row = asRow(value);
  const members = asRow(row.members);

  return {
    id: stringValue(row, "id"),
    memberId: stringValue(row, "member_id"),
    memberName: stringValue(members, "full_name", "-"),
    assessedAt: stringValue(row, "assessed_at"),
    level: stringValue(row, "level", "-"),
    averageScore: safeNumber(row.average_score),
    feedback: stringValue(row, "feedback"),
  };
}

function fallbackInstructorPortal(): InstructorPortalData {
  const instructor = sampleInstructors[0] ?? null;
  const classes = sampleClasses.filter((item) => item.instructorName === instructor?.fullName);
  const students = sampleMembers.slice(0, 2).map((member) => ({
    ...member,
    classNames: classes.map((item) => item.name),
    lastFeedback: sampleProgress.find((item) => item.memberName === member.fullName)?.feedback,
  }));

  return {
    isConnected: false,
    instructor,
    classes,
    students,
    attendance: sampleAttendance.filter((item) => item.instructorName === instructor?.fullName),
    achievements: [],
    feedback: [],
  };
}

function fallbackMemberPortal(): MemberPortalData {
  const member = sampleMembers[0] ?? null;

  return {
    isConnected: false,
    member,
    classes: sampleClasses.slice(0, 2),
    attendance: sampleAttendance.filter((item) => item.memberName === member?.fullName),
    instructors: sampleInstructors.slice(0, 2).map((instructor) => ({
      ...instructor,
      publicAchievements: [],
    })),
    feedback: [],
    progress: sampleProgress.find((item) => item.memberName === member?.fullName) ?? null,
  };
}

export async function getInstructorPortalData(
  profile: CurrentProfile | null,
): Promise<InstructorPortalData> {
  const supabase = createSupabaseAdmin();

  if (!supabase || profile?.role !== "instruktur" || !profile.instructorId) {
    return fallbackInstructorPortal();
  }

  const instructorId = profile.instructorId;
  const [
    instructorResult,
    classesResult,
    achievementsResult,
    feedbackResult,
    attendanceResult,
  ] = await Promise.all([
    supabase.from("instructors").select("*").eq("id", instructorId).maybeSingle(),
    supabase
      .from("classes")
      .select(
        "*, dance_styles(name), instructor:instructors!classes_instructor_id_fkey(full_name), assistant:instructors!classes_assistant_instructor_id_fkey(full_name)",
      )
      .or(`instructor_id.eq.${instructorId},assistant_instructor_id.eq.${instructorId}`)
      .order("day_of_week", { ascending: true }),
    supabase
      .from("instructor_achievements")
      .select("*")
      .eq("instructor_id", instructorId)
      .order("created_at", { ascending: false }),
    supabase
      .from("assessments")
      .select("*, members(full_name)")
      .eq("instructor_id", instructorId)
      .order("assessed_at", { ascending: false })
      .limit(20),
    supabase
      .from("attendance")
      .select("*, members(full_name), classes(name), instructors(full_name)")
      .eq("instructor_id", instructorId)
      .order("date", { ascending: false })
      .limit(30),
  ]);

  const classes = (classesResult.data ?? []).map(mapClass);
  const classIds = (classesResult.data ?? [])
    .map((item) => stringValue(asRow(item), "id"))
    .filter(isNonEmptyString);
  const enrollmentsResult = classIds.length
    ? await supabase
        .from("class_enrollments")
        .select("*, members(*)")
        .in("class_id", classIds)
        .order("enrolled_at", { ascending: false })
    : { data: [] };

  const studentMap = new Map<string, InstructorStudent>();
  for (const enrollment of enrollmentsResult.data ?? []) {
    const enrollmentRow = asRow(enrollment);
    const memberRow = enrollmentRow.members;

    if (!memberRow) continue;

    const member = mapMember(memberRow);
    const className =
      classes.find((item) => item.id === stringValue(enrollmentRow, "class_id"))?.name ??
      "Kelas terhubung";
    const existing = studentMap.get(member.id);

    if (existing) {
      existing.classNames.push(className);
    } else {
      studentMap.set(member.id, {
        ...member,
        classNames: [className],
      });
    }
  }

  for (const item of feedbackResult.data ?? []) {
    const row = asRow(item);
    const student = studentMap.get(stringValue(row, "member_id"));

    if (student && !student.lastFeedback) {
      student.lastFeedback = optionalString(row, "feedback");
    }
  }

  return {
    isConnected: true,
    instructor: instructorResult.data ? mapInstructor(instructorResult.data) : null,
    classes,
    students: Array.from(studentMap.values()),
    attendance: (attendanceResult.data ?? []).map(mapAttendance),
    achievements: (achievementsResult.data ?? []).map(mapAchievement),
    feedback: (feedbackResult.data ?? []).map(mapFeedback),
  };
}

export async function getMemberPortalData(
  profile: CurrentProfile | null,
): Promise<MemberPortalData> {
  const supabase = createSupabaseAdmin();

  if (!supabase || profile?.role !== "member" || !profile.memberId) {
    return fallbackMemberPortal();
  }

  const memberId = profile.memberId;
  const [memberResult, enrollmentsResult, attendanceResult, feedbackResult, progressResult] =
    await Promise.all([
      supabase.from("members").select("*").eq("id", memberId).maybeSingle(),
      supabase
        .from("class_enrollments")
        .select(
          "*, classes(*, dance_styles(name), instructor:instructors!classes_instructor_id_fkey(full_name), assistant:instructors!classes_assistant_instructor_id_fkey(full_name))",
        )
        .eq("member_id", memberId)
        .order("enrolled_at", { ascending: false }),
      supabase
        .from("attendance")
        .select("*, members(full_name), classes(name), instructors(full_name)")
        .eq("member_id", memberId)
        .order("date", { ascending: false })
        .limit(30),
      supabase
        .from("assessments")
        .select("*, members(full_name), instructors(full_name)")
        .eq("member_id", memberId)
        .order("assessed_at", { ascending: false }),
      supabase.from("member_progress_summary").select("*").eq("id", memberId).maybeSingle(),
    ]);

  const classRows = (enrollmentsResult.data ?? [])
    .map((enrollment) => asRow(enrollment).classes)
    .filter(isRow);
  const classes = classRows.map(mapClass);
  const instructorIds = Array.from(
    new Set(
      classRows
        .flatMap((item) => [item.instructor_id, item.assistant_instructor_id])
        .filter(isNonEmptyString),
    ),
  );

  const [instructorsResult, achievementsResult] = instructorIds.length
    ? await Promise.all([
        supabase.from("instructors").select("*").in("id", instructorIds),
        supabase
          .from("instructor_achievements")
          .select("*")
          .in("instructor_id", instructorIds)
          .eq("is_public", true)
          .order("year", { ascending: false }),
      ])
    : [{ data: [] }, { data: [] }];

  const achievementsByInstructor = new Map<string, InstructorAchievement[]>();
  for (const achievement of achievementsResult.data ?? []) {
    const achievementRow = asRow(achievement);
    const achievementInstructorId = stringValue(achievementRow, "instructor_id");
    const items = achievementsByInstructor.get(achievementInstructorId) ?? [];

    items.push(mapAchievement(achievement));
    achievementsByInstructor.set(achievementInstructorId, items);
  }

  const progressRow = asRow(progressResult.data);
  const progressData = progressResult.data
    ? {
        id: stringValue(progressRow, "id"),
        memberName: stringValue(progressRow, "member_name"),
        currentLevel: stringValue(progressRow, "current_level"),
        targetLevel: stringValue(progressRow, "target_level"),
        progressPercent: safeNumber(progressRow.progress_percent),
        attendanceMonth: safeNumber(progressRow.attendance_month),
        masteredSkills: safeNumber(progressRow.mastered_skills),
        totalSkills: safeNumber(progressRow.total_skills),
        assessmentAverage: safeNumber(progressRow.assessment_average),
        badges: stringArrayValue(progressRow, "badges"),
        feedback: stringValue(progressRow, "feedback"),
      }
    : null;

  return {
    isConnected: true,
    member: memberResult.data ? mapMember(memberResult.data) : null,
    classes,
    attendance: (attendanceResult.data ?? []).map(mapAttendance),
    instructors: (instructorsResult.data ?? []).map((row) => {
      const instructor = mapInstructor(row);

      return {
        ...instructor,
        publicAchievements: achievementsByInstructor.get(instructor.id) ?? [],
      };
    }),
    feedback: (feedbackResult.data ?? []).map(mapFeedback),
    progress: progressData,
  };
}
