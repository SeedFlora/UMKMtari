import { Download, FileBarChart, PieChart, TrendingUp } from "lucide-react";

import { MetricCard } from "@/components/bdms/metric-card";
import { PageHeader } from "@/components/bdms/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  getClasses,
  getDashboardData,
  getEvents,
  getHonors,
  getMembers,
  getProgress,
} from "@/lib/bdms/queries";
import { formatCurrency, formatPercent } from "@/lib/bdms/format";

export default async function ReportsPage() {
  const [dashboard, members, classes, honors, events, progress] = await Promise.all([
    getDashboardData(),
    getMembers(),
    getClasses(),
    getHonors(),
    getEvents(),
    getProgress(),
  ]);

  const reportGroups = [
    {
      title: "Membership",
      items: [
        `Total member: ${members.length}`,
        `Member aktif: ${dashboard.summary.activeMembers}`,
        `Member nonaktif: ${dashboard.summary.inactiveMembers}`,
        `Member baru bulan ini: ${dashboard.summary.newMembersThisMonth}`,
      ],
    },
    {
      title: "Attendance",
      items: [
        `Attendance rate: ${formatPercent(dashboard.summary.attendanceRate)}`,
        `Kelas paling aktif: ${dashboard.highlights.mostActiveClass}`,
        `Kelas aktif: ${classes.length}`,
      ],
    },
    {
      title: "Keuangan",
      items: [
        `Pemasukan: ${formatCurrency(dashboard.finance.incomeThisMonth)}`,
        `Honor instruktur: ${formatCurrency(dashboard.finance.instructorShareThisMonth)}`,
        `Kas komunitas: ${formatCurrency(dashboard.finance.communityShareThisMonth)}`,
        `Pengeluaran: ${formatCurrency(dashboard.finance.expensesThisMonth)}`,
      ],
    },
    {
      title: "Progress",
      items: [
        `Member tracked: ${progress.length}`,
        `Badge issued: ${progress.reduce((sum, item) => sum + item.badges.length, 0)}`,
        `Skill mastered: ${progress.reduce((sum, item) => sum + item.masteredSkills, 0)}`,
      ],
    },
    {
      title: "Instruktur",
      items: [
        `Rekap honor: ${honors.length}`,
        `Total sesi: ${honors.reduce((sum, item) => sum + item.sessionCount, 0)}`,
        `Total honor: ${formatCurrency(honors.reduce((sum, item) => sum + item.totalHonor, 0))}`,
      ],
    },
    {
      title: "Event",
      items: [
        `Event terdaftar: ${events.length}`,
        `Event mendatang: ${dashboard.summary.upcomingEvents}`,
        `Surplus event: ${formatCurrency(events.reduce((sum, event) => sum + event.revenue - event.expenses, 0))}`,
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Analytics & Report"
        title="Laporan dan Analitik"
        description="Ringkasan membership, attendance, keuangan, progress member, instruktur, dan event untuk pengambilan keputusan komunitas."
        actions={
          <Button variant="outline" size="sm" asChild>
            <a href="/api/export/members">
              <Download className="h-4 w-4" />
              Export Member
            </a>
          </Button>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Income"
          value={formatCurrency(dashboard.finance.incomeThisMonth)}
          helper="Bulan berjalan"
          icon={TrendingUp}
          accent="green"
        />
        <MetricCard
          label="Attendance"
          value={formatPercent(dashboard.summary.attendanceRate)}
          helper="Rata-rata kelas"
          icon={PieChart}
          accent="gold"
        />
        <MetricCard
          label="Report pack"
          value="6"
          helper="Membership sampai event"
          icon={FileBarChart}
          accent="navy"
        />
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {reportGroups.map((group) => (
          <Card key={group.title} className="rounded-lg">
            <CardHeader>
              <CardTitle className="text-base">{group.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {group.items.map((item) => (
                <div key={item}>
                  <p className="text-sm text-muted-foreground">{item}</p>
                  <Separator className="mt-3" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}

