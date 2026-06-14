"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseAdmin } from "@/lib/bdms/supabase-admin";

function text(formData: FormData, key: string, fallback = "") {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function numberValue(formData: FormData, key: string, fallback = 0) {
  const value = Number(formData.get(key));
  return Number.isFinite(value) ? value : fallback;
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

