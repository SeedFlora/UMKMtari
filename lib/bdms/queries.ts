import "server-only";

import {
  attendance as sampleAttendance,
  classes as sampleClasses,
  events as sampleEvents,
  honors as sampleHonors,
  instructors as sampleInstructors,
  leads as sampleLeads,
  members as sampleMembers,
  monthlyCashFlow,
  payments as samplePayments,
  progress as sampleProgress,
  transactions as sampleTransactions,
} from "./sample-data";
import { createSupabaseAdmin } from "./supabase-admin";
import type {
  AttendanceRecord,
  CashTransaction,
  CommunityEvent,
  DanceClass,
  DashboardData,
  HonorRecord,
  Instructor,
  Lead,
  Member,
  MemberProgress,
  Payment,
} from "./types";

function safeNumber(value: unknown) {
  return typeof value === "number" ? value : Number(value ?? 0);
}

async function fromSupabase<T>(loader: () => Promise<T>, fallback: T) {
  const supabase = createSupabaseAdmin();

  if (!supabase) {
    return fallback;
  }

  try {
    return await loader();
  } catch {
    return fallback;
  }
}

export async function getMembers(): Promise<Member[]> {
  return fromSupabase<Member[]>(async () => {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase!
      .from("members")
      .select("*")
      .order("joined_at", { ascending: false });

    if (error) throw error;

    return (data ?? []).map((member) => ({
      id: member.id,
      memberCode: member.member_code,
      fullName: member.full_name,
      phone: member.phone ?? "-",
      email: member.email ?? "-",
      joinedAt: member.joined_at,
      status: member.status,
      membershipType: member.membership_type ?? "-",
      currentLevel: member.current_level ?? "Foundation",
      classesTaken: safeNumber(member.classes_taken),
      attendanceRate: safeNumber(member.attendance_rate),
      notes: member.notes ?? undefined,
    }));
  }, sampleMembers);
}

export async function getInstructors(): Promise<Instructor[]> {
  return fromSupabase<Instructor[]>(async () => {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase!
      .from("instructors")
      .select("*")
      .order("full_name", { ascending: true });

    if (error) throw error;

    return (data ?? []).map((instructor) => ({
      id: instructor.id,
      instructorCode: instructor.instructor_code,
      fullName: instructor.full_name,
      phone: instructor.phone ?? "-",
      email: instructor.email ?? "-",
      status: instructor.status,
      level: instructor.level ?? "-",
      specialties: instructor.specialties ?? [],
      sessionsThisMonth: safeNumber(instructor.sessions_this_month),
      honorDue: safeNumber(instructor.honor_due),
      achievementsCount: safeNumber(instructor.achievements_count),
      bio: instructor.bio ?? "",
    }));
  }, sampleInstructors);
}

export async function getClasses(): Promise<DanceClass[]> {
  return fromSupabase<DanceClass[]>(async () => {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase!
      .from("classes")
      .select(
        "*, dance_styles(name), instructors!classes_instructor_id_fkey(full_name), assistant:instructors!classes_assistant_instructor_id_fkey(full_name)",
      )
      .order("day_of_week", { ascending: true });

    if (error) throw error;

    return (data ?? []).map((danceClass) => ({
      id: danceClass.id,
      classCode: danceClass.class_code,
      name: danceClass.name,
      type: danceClass.class_type,
      level: danceClass.level ?? "-",
      danceStyle: danceClass.dance_styles?.name ?? danceClass.dance_style ?? "-",
      instructorName: danceClass.instructors?.full_name ?? "-",
      assistantName: danceClass.assistant?.full_name ?? undefined,
      day: danceClass.day_of_week,
      startTime: danceClass.start_time,
      endTime: danceClass.end_time,
      room: danceClass.room ?? "-",
      capacity: safeNumber(danceClass.capacity),
      enrolled: safeNumber(danceClass.enrolled_count),
      price: safeNumber(danceClass.price),
      status: danceClass.status,
      revenueMonth: safeNumber(danceClass.revenue_month),
      attendanceRate: safeNumber(danceClass.attendance_rate),
    }));
  }, sampleClasses);
}

export async function getAttendance(): Promise<AttendanceRecord[]> {
  return fromSupabase<AttendanceRecord[]>(async () => {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase!
      .from("attendance")
      .select("*, members(full_name), classes(name), instructors(full_name)")
      .order("date", { ascending: false })
      .limit(80);

    if (error) throw error;

    return (data ?? []).map((row) => ({
      id: row.id,
      date: row.date,
      className: row.classes?.name ?? row.class_name ?? "-",
      memberName: row.members?.full_name ?? row.member_name ?? "-",
      instructorName: row.instructors?.full_name ?? row.instructor_name ?? "-",
      status: row.status,
      checkInTime: row.check_in_time ?? "-",
      method: row.method ?? "Admin check-in",
      notes: row.notes ?? undefined,
    }));
  }, sampleAttendance);
}

export async function getPayments(): Promise<Payment[]> {
  return fromSupabase<Payment[]>(async () => {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase!
      .from("payments")
      .select("*, members(full_name)")
      .order("due_date", { ascending: false });

    if (error) throw error;

    return (data ?? []).map((payment) => ({
      id: payment.id,
      invoiceNo: payment.invoice_no,
      payerName: payment.members?.full_name ?? payment.payer_name ?? "-",
      category: payment.category,
      amount: safeNumber(payment.amount),
      status: payment.status,
      dueDate: payment.due_date,
      paidAt: payment.paid_at ?? undefined,
      instructorShare: safeNumber(payment.instructor_share),
      communityShare: safeNumber(payment.community_share),
    }));
  }, samplePayments);
}

export async function getTransactions(): Promise<CashTransaction[]> {
  return fromSupabase<CashTransaction[]>(async () => {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase!
      .from("transactions")
      .select("*")
      .order("date", { ascending: false });

    if (error) throw error;

    return (data ?? []).map((transaction) => ({
      id: transaction.id,
      date: transaction.date,
      type: transaction.type === "cash_out" ? "Cash out" : "Cash in",
      category: transaction.category,
      description: transaction.description,
      amount: safeNumber(transaction.amount),
    }));
  }, sampleTransactions);
}

export async function getHonors(): Promise<HonorRecord[]> {
  return fromSupabase<HonorRecord[]>(async () => {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase!
      .from("instructor_honor")
      .select("*, instructors(full_name)")
      .order("period_start", { ascending: false });

    if (error) throw error;

    return (data ?? []).map((honor) => ({
      id: honor.id,
      instructorName: honor.instructors?.full_name ?? honor.instructor_name ?? "-",
      period: honor.period_label,
      classCount: safeNumber(honor.class_count),
      sessionCount: safeNumber(honor.session_count),
      attendeeCount: safeNumber(honor.attendee_count),
      grossRevenue: safeNumber(honor.gross_revenue),
      instructorShare: safeNumber(honor.instructor_share),
      deductions: safeNumber(honor.deductions),
      bonus: safeNumber(honor.bonus),
      totalHonor: safeNumber(honor.total_honor),
      status: honor.status,
    }));
  }, sampleHonors);
}

export async function getEvents(): Promise<CommunityEvent[]> {
  return fromSupabase<CommunityEvent[]>(async () => {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase!
      .from("events")
      .select("*")
      .order("date", { ascending: true });

    if (error) throw error;

    return (data ?? []).map((event) => ({
      id: event.id,
      eventCode: event.event_code,
      name: event.name,
      type: event.event_type,
      date: event.date,
      time: event.time,
      location: event.location,
      quota: safeNumber(event.quota),
      registered: safeNumber(event.registered_count),
      ticketPrice: safeNumber(event.ticket_price),
      status: event.status,
      revenue: safeNumber(event.revenue),
      expenses: safeNumber(event.expenses),
    }));
  }, sampleEvents);
}

export async function getLeads(): Promise<Lead[]> {
  return fromSupabase<Lead[]>(async () => {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase!
      .from("leads")
      .select("*")
      .order("first_contact_at", { ascending: false });

    if (error) throw error;

    return (data ?? []).map((lead) => ({
      id: lead.id,
      fullName: lead.full_name,
      whatsapp: lead.whatsapp,
      source: lead.source,
      interestClass: lead.interest_class ?? "-",
      firstContactAt: lead.first_contact_at,
      status: lead.status,
      notes: lead.notes ?? "",
    }));
  }, sampleLeads);
}

export async function getProgress(): Promise<MemberProgress[]> {
  return fromSupabase<MemberProgress[]>(async () => {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase!
      .from("member_progress_summary")
      .select("*")
      .order("progress_percent", { ascending: false });

    if (error) throw error;

    return (data ?? []).map((item) => ({
      id: item.id,
      memberName: item.member_name,
      currentLevel: item.current_level,
      targetLevel: item.target_level,
      progressPercent: safeNumber(item.progress_percent),
      attendanceMonth: safeNumber(item.attendance_month),
      masteredSkills: safeNumber(item.mastered_skills),
      totalSkills: safeNumber(item.total_skills),
      assessmentAverage: safeNumber(item.assessment_average),
      badges: item.badges ?? [],
      feedback: item.feedback ?? "",
    }));
  }, sampleProgress);
}

export async function getDashboardData(): Promise<DashboardData> {
  const [
    allMembers,
    allClasses,
    allPayments,
    allTransactions,
    allHonors,
    allEvents,
    allInstructors,
  ] = await Promise.all([
    getMembers(),
    getClasses(),
    getPayments(),
    getTransactions(),
    getHonors(),
    getEvents(),
    getInstructors(),
  ]);

  const paidPayments = allPayments.filter((payment) =>
    ["Paid", "Verified"].includes(payment.status),
  );
  const incomeThisMonth = paidPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const instructorShareThisMonth = paidPayments.reduce(
    (sum, payment) => sum + payment.instructorShare,
    0,
  );
  const communityShareThisMonth = paidPayments.reduce(
    (sum, payment) => sum + payment.communityShare,
    0,
  );
  const expensesThisMonth = allTransactions
    .filter((transaction) => transaction.type === "Cash out")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const cashIn = allTransactions
    .filter((transaction) => transaction.type === "Cash in")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const mostActiveClass = [...allClasses].sort(
    (a, b) => b.attendanceRate - a.attendanceRate,
  )[0];
  const mostActiveInstructor = [...allInstructors].sort(
    (a, b) => b.sessionsThisMonth - a.sessionsThisMonth,
  )[0];

  return {
    summary: {
      totalMembers: allMembers.length,
      activeMembers: allMembers.filter((member) => member.status === "Aktif").length,
      inactiveMembers: allMembers.filter((member) => member.status !== "Aktif").length,
      newMembersThisMonth: allMembers.filter((member) =>
        member.joinedAt.startsWith("2026-06"),
      ).length,
      activeClasses: allClasses.filter((danceClass) => danceClass.status === "Aktif")
        .length,
      privateSessionsThisMonth: allClasses.filter((danceClass) =>
        danceClass.type.toLowerCase().includes("private"),
      ).length,
      upcomingEvents: allEvents.filter((event) =>
        ["Open Registration", "Draft"].includes(event.status),
      ).length,
      attendanceRate: Math.round(
        allClasses.reduce((sum, danceClass) => sum + danceClass.attendanceRate, 0) /
          Math.max(allClasses.length, 1),
      ),
    },
    finance: {
      incomeThisMonth,
      instructorShareThisMonth,
      communityShareThisMonth,
      expensesThisMonth,
      cashBalance: cashIn - expensesThisMonth,
    },
    highlights: {
      mostActiveClass: mostActiveClass?.name ?? "-",
      mostActiveInstructor: mostActiveInstructor?.fullName ?? "-",
      pendingPayments: allPayments.filter((payment) =>
        ["Pending", "Overdue"].includes(payment.status),
      ).length,
      pendingHonor: allHonors.filter((honor) =>
        ["Draft", "Waiting Approval", "Approved"].includes(honor.status),
      ).length,
    },
    monthlyCashFlow,
    classPerformance: allClasses.map((danceClass) => ({
      name: danceClass.name,
      attendanceRate: danceClass.attendanceRate,
      revenue: danceClass.revenueMonth,
    })),
  };
}
