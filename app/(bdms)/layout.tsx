import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/bdms/app-shell";
import { getCurrentProfile } from "@/lib/bdms/auth";

export const dynamic = "force-dynamic";

export default async function BdmsLayout({ children }: { children: React.ReactNode }) {
  const [profile, headerStore] = await Promise.all([getCurrentProfile(), headers()]);
  const pathname = headerStore.get("x-bdms-pathname") ?? "/";

  if (profile?.role === "instruktur" && !pathname.startsWith("/instruktur")) {
    redirect("/instruktur");
  }

  if (profile?.role === "member" && !pathname.startsWith("/member")) {
    redirect("/member");
  }

  return <AppShell profile={profile}>{children}</AppShell>;
}
