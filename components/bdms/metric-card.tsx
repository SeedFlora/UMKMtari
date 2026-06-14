import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  helper,
  icon: Icon,
  accent = "gold",
}: {
  label: string;
  value: string;
  helper: string;
  icon: LucideIcon;
  accent?: "gold" | "burgundy" | "navy" | "green";
}) {
  const accentClass = {
    gold: "bg-[hsl(var(--heritage-gold)/0.16)] text-[hsl(var(--heritage-gold-dark))]",
    burgundy: "bg-[hsl(var(--heritage-burgundy)/0.12)] text-[hsl(var(--heritage-burgundy))]",
    navy: "bg-[hsl(var(--heritage-navy)/0.1)] text-[hsl(var(--heritage-navy))]",
    green: "bg-emerald-50 text-emerald-700",
  }[accent];

  return (
    <Card className="rounded-lg border-border/80 bg-card/95 shadow-sm">
      <CardContent className="flex min-h-[132px] items-start justify-between gap-4 p-5">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-3 text-2xl font-semibold tracking-normal text-foreground">
            {value}
          </p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">{helper}</p>
        </div>
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-md", accentClass)}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

