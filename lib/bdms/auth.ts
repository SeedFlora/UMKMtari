import "server-only";

import { createClient } from "@/lib/supabase/server";
import { hasEnvVars } from "@/lib/utils";

export type AppRole =
  | "super_admin"
  | "admin_operasional"
  | "admin_keuangan"
  | "instruktur"
  | "member";

export type CurrentProfile = {
  id: string;
  email: string | null;
  fullName: string;
  role: AppRole;
  memberId: string | null;
  instructorId: string | null;
  isLinked: boolean;
};

export function isStaffRole(role?: AppRole | null) {
  return role === "super_admin" || role === "admin_operasional" || role === "admin_keuangan";
}

export async function getCurrentProfile(): Promise<CurrentProfile | null> {
  if (!hasEnvVars) {
    return null;
  }

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const claims = claimsData?.claims;

  if (!claims?.sub) {
    return null;
  }

  const email = typeof claims.email === "string" ? claims.email : null;
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, role, member_id, instructor_id")
    .eq("id", claims.sub)
    .maybeSingle();

  if (!data) {
    return {
      id: claims.sub,
      email,
      fullName: email ?? "User BDMS",
      role: "member",
      memberId: null,
      instructorId: null,
      isLinked: false,
    };
  }

  return {
    id: data.id,
    email,
    fullName: data.full_name ?? email ?? "User BDMS",
    role: data.role,
    memberId: data.member_id,
    instructorId: data.instructor_id,
    isLinked: true,
  };
}

export async function requireInstructorProfile() {
  const profile = await getCurrentProfile();

  if (profile?.role !== "instruktur" || !profile.instructorId) {
    throw new Error("Akun ini belum terhubung sebagai instruktur.");
  }

  return profile;
}
