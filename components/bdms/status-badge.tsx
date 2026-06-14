import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const toneByStatus: Record<string, string> = {
  Aktif: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Trial: "border-sky-200 bg-sky-50 text-sky-800",
  Cuti: "border-amber-200 bg-amber-50 text-amber-800",
  Alumni: "border-slate-200 bg-slate-50 text-slate-700",
  Blacklist: "border-rose-200 bg-rose-50 text-rose-800",
  Paid: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Verified: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Approved: "border-blue-200 bg-blue-50 text-blue-800",
  Pending: "border-amber-200 bg-amber-50 text-amber-800",
  Draft: "border-slate-200 bg-slate-50 text-slate-700",
  "Waiting Approval": "border-amber-200 bg-amber-50 text-amber-800",
  "Open Registration": "border-emerald-200 bg-emerald-50 text-emerald-800",
  Closed: "border-slate-200 bg-slate-50 text-slate-700",
  Completed: "border-blue-200 bg-blue-50 text-blue-800",
  Cancelled: "border-rose-200 bg-rose-50 text-rose-800",
  Hadir: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Izin: "border-amber-200 bg-amber-50 text-amber-800",
  Sakit: "border-orange-200 bg-orange-50 text-orange-800",
  Alpha: "border-rose-200 bg-rose-50 text-rose-800",
};

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn("whitespace-nowrap rounded-md font-medium", toneByStatus[status], className)}
    >
      {status}
    </Badge>
  );
}

