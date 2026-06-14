import { NextResponse } from "next/server";

import { getMembers } from "@/lib/bdms/queries";

export const dynamic = "force-dynamic";

function csvCell(value: string | number) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET() {
  const members = await getMembers();
  const header = [
    "member_code",
    "full_name",
    "phone",
    "email",
    "status",
    "membership_type",
    "current_level",
    "attendance_rate",
    "joined_at",
  ];
  const rows = members.map((member) => [
    member.memberCode,
    member.fullName,
    member.phone,
    member.email,
    member.status,
    member.membershipType,
    member.currentLevel,
    member.attendanceRate,
    member.joinedAt,
  ]);

  const body = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="bdms-members.csv"',
    },
  });
}
