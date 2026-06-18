"use server";

import { revalidatePath } from "next/cache";

import { requireInstructorProfile } from "@/lib/bdms/auth";
import { createSupabaseAdmin } from "@/lib/bdms/supabase-admin";

function text(formData: FormData, key: string, fallback = "") {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function numberValue(formData: FormData, key: string, fallback = 0) {
  const value = Number(formData.get(key));
  return Number.isFinite(value) ? value : fallback;
}

function scoreValue(formData: FormData, key: string, fallback = 3) {
  return Math.min(5, Math.max(0, numberValue(formData, key, fallback)));
}

function checked(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function generatedCode(prefix: string) {
  return `${prefix}-${Date.now().toString().slice(-8)}`;
}

export async function createMemberAction(formData: FormData) {
  const supabase = createSupabaseAdmin();

  if (supabase) {
    const { error } = await supabase.from("members").insert({
      member_code: generatedCode("BSDS-M"),
      full_name: text(formData, "full_name"),
      phone: text(formData, "phone"),
      email: text(formData, "email"),
      status: text(formData, "status", "Trial"),
      membership_type: text(formData, "membership_type", "Reguler"),
      current_level: text(formData, "current_level", "Foundation"),
      joined_at: text(formData, "joined_at", new Date().toISOString().slice(0, 10)),
      notes: text(formData, "notes"),
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  revalidatePath("/members");
  revalidatePath("/");
}

export async function createClassAction(formData: FormData) {
  const supabase = createSupabaseAdmin();

  if (supabase) {
    const { error } = await supabase.from("classes").insert({
      class_code: generatedCode("BSDS-C"),
      name: text(formData, "name"),
      class_type: text(formData, "class_type", "Kelas reguler"),
      level: text(formData, "level", "Foundation"),
      dance_style: text(formData, "dance_style"),
      instructor_id: text(formData, "instructor_id") || null,
      day_of_week: text(formData, "day_of_week", "Selasa"),
      start_time: text(formData, "start_time", "19:00"),
      end_time: text(formData, "end_time", "20:30"),
      room: text(formData, "room", "Studio Heritage"),
      capacity: numberValue(formData, "capacity", 20),
      price: numberValue(formData, "price", 250000),
      status: text(formData, "status", "Aktif"),
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  revalidatePath("/classes");
  revalidatePath("/");
}

export async function createAttendanceAction(formData: FormData) {
  const supabase = createSupabaseAdmin();

  if (supabase) {
    const { error } = await supabase.from("attendance").insert({
      date: text(formData, "date", new Date().toISOString().slice(0, 10)),
      class_id: text(formData, "class_id") || null,
      member_id: text(formData, "member_id") || null,
      instructor_id: text(formData, "instructor_id") || null,
      status: text(formData, "status", "Hadir"),
      check_in_time: text(formData, "check_in_time") || null,
      method: text(formData, "method", "Admin check-in"),
      notes: text(formData, "notes"),
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  revalidatePath("/attendance");
  revalidatePath("/");
}

export async function createPaymentAction(formData: FormData) {
  const supabase = createSupabaseAdmin();

  if (supabase) {
    const { error } = await supabase.from("payments").insert({
      invoice_no: generatedCode("INV"),
      member_id: text(formData, "member_id") || null,
      payer_name: text(formData, "payer_name"),
      category: text(formData, "category", "Kelas reguler"),
      amount: numberValue(formData, "amount"),
      status: text(formData, "status", "Pending"),
      due_date: text(formData, "due_date", new Date().toISOString().slice(0, 10)),
      paid_at: text(formData, "paid_at") || null,
      notes: text(formData, "notes"),
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  revalidatePath("/finance");
  revalidatePath("/");
}

export async function createCashOutAction(formData: FormData) {
  const supabase = createSupabaseAdmin();

  if (supabase) {
    const { error } = await supabase.from("transactions").insert({
      date: text(formData, "date", new Date().toISOString().slice(0, 10)),
      type: "cash_out",
      category: text(formData, "category", "Operasional"),
      description: text(formData, "description"),
      amount: numberValue(formData, "amount"),
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  revalidatePath("/finance");
  revalidatePath("/");
}

export async function createLeadAction(formData: FormData) {
  const supabase = createSupabaseAdmin();

  if (supabase) {
    const { error } = await supabase.from("leads").insert({
      full_name: text(formData, "full_name"),
      whatsapp: text(formData, "whatsapp"),
      email: text(formData, "email") || null,
      source: text(formData, "source", "Instagram"),
      interest_class: text(formData, "interest_class"),
      first_contact_at: text(
        formData,
        "first_contact_at",
        new Date().toISOString().slice(0, 10),
      ),
      status: text(formData, "status", "New lead"),
      notes: text(formData, "notes"),
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  revalidatePath("/crm");
}

export async function createInstructorAchievementAction(formData: FormData) {
  const profile = await requireInstructorProfile();
  const supabase = createSupabaseAdmin();

  if (supabase) {
    const title = text(formData, "title");

    if (!title) {
      throw new Error("Judul achievement wajib diisi.");
    }

    const { error } = await supabase.from("instructor_achievements").insert({
      instructor_id: profile.instructorId,
      achievement_type: text(formData, "achievement_type", "Competition"),
      title,
      year: numberValue(formData, "year") || null,
      location: text(formData, "location") || null,
      category: text(formData, "category") || null,
      dance_style: text(formData, "dance_style") || null,
      rank: text(formData, "rank") || null,
      organizer: text(formData, "organizer") || null,
      proof_url: text(formData, "proof_url") || null,
      status: "Pending Verification",
      is_public: checked(formData, "is_public"),
    });

    if (error) {
      throw new Error(error.message);
    }

    const { count } = await supabase
      .from("instructor_achievements")
      .select("id", { count: "exact", head: true })
      .eq("instructor_id", profile.instructorId);

    await supabase
      .from("instructors")
      .update({ achievements_count: count ?? 0 })
      .eq("id", profile.instructorId);
  }

  revalidatePath("/instruktur");
  revalidatePath("/instructors");
}

export async function createMemberFeedbackAction(formData: FormData) {
  const profile = await requireInstructorProfile();
  const supabase = createSupabaseAdmin();

  if (supabase) {
    const memberId = text(formData, "member_id");

    if (!memberId) {
      throw new Error("Pilih member terlebih dahulu.");
    }

    const { data: classes, error: classError } = await supabase
      .from("classes")
      .select("id")
      .or(
        `instructor_id.eq.${profile.instructorId},assistant_instructor_id.eq.${profile.instructorId}`,
      );

    if (classError) {
      throw new Error(classError.message);
    }

    const classIds = (classes ?? []).map((item) => item.id);
    const enrollmentCheck = classIds.length
      ? await supabase
          .from("class_enrollments")
          .select("id")
          .eq("member_id", memberId)
          .in("class_id", classIds)
          .limit(1)
      : { data: [] };

    const attendanceCheck = await supabase
      .from("attendance")
      .select("id")
      .eq("member_id", memberId)
      .eq("instructor_id", profile.instructorId)
      .limit(1);

    if (!enrollmentCheck.data?.length && !attendanceCheck.data?.length) {
      throw new Error("Member ini belum terdaftar di kelas instruktur.");
    }

    const { error } = await supabase.from("assessments").insert({
      member_id: memberId,
      instructor_id: profile.instructorId,
      assessed_at: text(formData, "assessed_at", new Date().toISOString().slice(0, 10)),
      level: text(formData, "level", "Foundation"),
      technique: scoreValue(formData, "technique"),
      posture: scoreValue(formData, "posture"),
      timing: scoreValue(formData, "timing"),
      musicality: scoreValue(formData, "musicality"),
      partnering: scoreValue(formData, "partnering"),
      expression: scoreValue(formData, "expression"),
      floorcraft: scoreValue(formData, "floorcraft"),
      confidence: scoreValue(formData, "confidence"),
      feedback: text(formData, "feedback"),
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  revalidatePath("/instruktur");
  revalidatePath("/member");
  revalidatePath("/progress");
}
