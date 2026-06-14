import { AppShell } from "@/components/bdms/app-shell";

export const dynamic = "force-dynamic";

export default function BdmsLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
