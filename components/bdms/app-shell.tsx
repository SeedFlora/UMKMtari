import { Suspense } from "react";
import Link from "next/link";
import { Crown, Search } from "lucide-react";

import { AuthButton } from "@/components/auth-button";
import { CurrentDate } from "@/components/bdms/current-date";
import { EnvVarWarning } from "@/components/env-var-warning";
import { MobileNav } from "@/components/bdms/mobile-nav";
import { getNavItemsForRole, secondaryNavItems } from "@/components/bdms/nav-items";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { CurrentProfile } from "@/lib/bdms/auth";
import { hasEnvVars } from "@/lib/utils";
import { cn } from "@/lib/utils";

function Sidebar({ profile }: { profile: CurrentProfile | null }) {
  const navItems = getNavItemsForRole(profile?.role);
  const brandCaption =
    profile?.role === "instruktur"
      ? "Portal Instruktur"
      : profile?.role === "member"
        ? "Portal Member"
        : "Bumi Sangkuriang Dance Sport";

  return (
    <aside className="hidden border-r border-border/80 bg-sidebar/95 lg:block">
      <div className="flex h-screen flex-col">
        <div className="border-b border-border/80 p-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[hsl(var(--heritage-navy))] text-[hsl(var(--heritage-gold))] shadow-sm">
              <Crown className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-normal text-foreground">BDMS</p>
              <p className="text-xs text-muted-foreground">{brandCaption}</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          <div className="grid gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-[hsl(var(--heritage-burgundy))]" />
                  {item.label}
                </Link>
              );
            })}
          </div>
          <Separator className="my-5" />
          <div className="space-y-3 px-2">
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex min-w-0 items-center gap-2 text-muted-foreground">
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <Badge variant="outline" className="rounded-md bg-background text-[10px]">
                    {item.value}
                  </Badge>
                </div>
              );
            })}
          </div>
        </nav>
        <div className="border-t border-border/80 p-4">
          <p className="text-xs leading-5 text-muted-foreground">
            Dancing Through Time, Powered by Data
          </p>
        </div>
      </div>
    </aside>
  );
}

export function AppShell({
  children,
  profile,
}: {
  children: React.ReactNode;
  profile: CurrentProfile | null;
}) {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-foreground lg:grid lg:grid-cols-[280px_1fr]">
      <Sidebar profile={profile} />
      <div className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-border/80 bg-background/92 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 md:px-6">
            <MobileNav role={profile?.role} />
            <div className="relative hidden w-full max-w-md md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                aria-label="Cari data"
                className="h-9 rounded-md pl-9"
                placeholder="Cari member, kelas, event"
              />
            </div>
            <div className="ml-auto flex items-center gap-3">
              <CurrentDate />
              <div
                className={cn(
                  "hidden items-center text-sm md:flex",
                  !hasEnvVars && "max-w-[260px]",
                )}
              >
                {!hasEnvVars ? (
                  <EnvVarWarning />
                ) : (
                  <Suspense>
                    <AuthButton />
                  </Suspense>
                )}
              </div>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1500px] px-4 py-6 md:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
