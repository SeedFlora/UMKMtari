import { NextResponse } from "next/server";

import { getMembers } from "@/lib/bdms/queries";
import { createSupabaseAdmin } from "@/lib/bdms/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getMembers());
}

export async function POST(request: Request) {
  const supabase = createSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json(
      { message: "Supabase env belum dikonfigurasi. Data demo tidak disimpan." },
      { status: 202 },
    );
  }

  const payload = await request.json();
  const { data, error } = await supabase
    .from("members")
    .insert({
      member_code: payload.member_code,
      full_name: payload.full_name,
      phone: payload.phone,
      email: payload.email,
      status: payload.status ?? "Trial",
      membership_type: payload.membership_type ?? "Reguler",
      current_level: payload.current_level ?? "Foundation",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 201 });
}
