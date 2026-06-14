import { formatCurrency } from "@/lib/bdms/format";
import { cn } from "@/lib/utils";

export function MiniBarList({
  items,
  valueFormatter = (value) => `${value}%`,
  maxValue,
  className,
}: {
  items: Array<{ label: string; value: number; helper?: string }>;
  valueFormatter?: (value: number) => string;
  maxValue?: number;
  className?: string;
}) {
  const max = maxValue ?? Math.max(...items.map((item) => item.value), 1);

  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item) => (
        <div key={item.label} className="space-y-2">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="truncate font-medium text-foreground">{item.label}</span>
            <span className="shrink-0 font-mono text-xs text-muted-foreground">
              {valueFormatter(item.value)}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-[hsl(var(--heritage-gold))]"
              style={{ width: `${Math.min(100, (item.value / max) * 100)}%` }}
            />
          </div>
          {item.helper ? <p className="text-xs text-muted-foreground">{item.helper}</p> : null}
        </div>
      ))}
    </div>
  );
}

export function CashFlowBars({
  items,
}: {
  items: Array<{ month: string; income: number; expenses: number; communityCash: number }>;
}) {
  const max = Math.max(...items.flatMap((item) => [item.income, item.expenses]), 1);

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
      {items.map((item) => (
        <div key={item.month} className="rounded-lg border bg-background/70 p-3">
          <p className="text-xs font-medium text-muted-foreground">{item.month}</p>
          <div className="mt-3 flex h-24 items-end gap-2">
            <div
              className="w-full rounded-t bg-[hsl(var(--heritage-navy))]"
              style={{ height: `${Math.max(12, (item.income / max) * 100)}%` }}
              title={`Income ${formatCurrency(item.income)}`}
            />
            <div
              className="w-full rounded-t bg-[hsl(var(--heritage-burgundy))]"
              style={{ height: `${Math.max(12, (item.expenses / max) * 100)}%` }}
              title={`Expenses ${formatCurrency(item.expenses)}`}
            />
          </div>
          <p className="mt-3 font-mono text-[11px] text-muted-foreground">
            Kas {formatCurrency(item.communityCash)}
          </p>
        </div>
      ))}
    </div>
  );
}

