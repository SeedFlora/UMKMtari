import { Award, BadgeCheck, Banknote, GraduationCap } from "lucide-react";

import { MetricCard } from "@/components/bdms/metric-card";
import { PageHeader } from "@/components/bdms/page-header";
import { StatusBadge } from "@/components/bdms/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getInstructors } from "@/lib/bdms/queries";
import { formatCurrency } from "@/lib/bdms/format";

export default async function InstructorsPage() {
  const instructors = await getInstructors();
  const active = instructors.filter((instructor) => instructor.status === "Aktif").length;
  const totalHonor = instructors.reduce((sum, instructor) => sum + instructor.honorDue, 0);
  const totalSessions = instructors.reduce(
    (sum, instructor) => sum + instructor.sessionsThisMonth,
    0,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Instructor Management"
        title="Instruktur dan Portfolio"
        description="Kelola profil instruktur, spesialisasi tari, sesi mengajar, honor berjalan, prestasi, sertifikasi, dan status verifikasi portfolio."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Instruktur aktif"
          value={active.toLocaleString("id-ID")}
          helper={`${instructors.length} total instruktur`}
          icon={GraduationCap}
          accent="navy"
        />
        <MetricCard
          label="Sesi bulan ini"
          value={totalSessions.toLocaleString("id-ID")}
          helper="Reguler, private, workshop"
          icon={BadgeCheck}
          accent="gold"
        />
        <MetricCard
          label="Estimasi honor"
          value={formatCurrency(totalHonor)}
          helper="Sebelum approval bendahara"
          icon={Banknote}
          accent="burgundy"
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {instructors.map((instructor) => (
          <Card key={instructor.id} className="rounded-lg">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-base">{instructor.fullName}</CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {instructor.instructorCode} - {instructor.level}
                  </p>
                </div>
                <StatusBadge status={instructor.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6 text-muted-foreground">{instructor.bio}</p>
              <div className="flex flex-wrap gap-2">
                {instructor.specialties.map((specialty) => (
                  <Badge key={specialty} variant="outline" className="rounded-md bg-background">
                    {specialty}
                  </Badge>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3 rounded-lg border bg-background/70 p-3 text-center">
                <div>
                  <p className="font-mono text-lg font-semibold">
                    {instructor.sessionsThisMonth}
                  </p>
                  <p className="text-[11px] text-muted-foreground">Sesi</p>
                </div>
                <div>
                  <p className="font-mono text-lg font-semibold">
                    {instructor.achievementsCount}
                  </p>
                  <p className="text-[11px] text-muted-foreground">Prestasi</p>
                </div>
                <div>
                  <p className="font-mono text-lg font-semibold">
                    {formatCurrency(instructor.honorDue).replace("Rp", "")}
                  </p>
                  <p className="text-[11px] text-muted-foreground">Honor</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Award className="h-4 w-4 text-[hsl(var(--heritage-gold-dark))]" />
                Portfolio publik tampil setelah approved oleh admin.
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}

