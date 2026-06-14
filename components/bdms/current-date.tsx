"use client";

import { CalendarDays } from "lucide-react";

export function CurrentDate() {
  const today = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="hidden items-center gap-2 rounded-md border bg-card px-3 py-2 text-xs text-muted-foreground md:flex">
      <CalendarDays className="h-4 w-4 text-[hsl(var(--heritage-burgundy))]" />
      <span>{today}</span>
    </div>
  );
}

