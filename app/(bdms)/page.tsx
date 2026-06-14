import Image from "next/image";
import {
  Activity,
  CalendarCheck2,
  CalendarDays,
  CreditCard,
  Landmark,
  TrendingUp,
  UsersRound,
  WalletCards,
} from "lucide-react";

import { CashFlowBars, MiniBarList } from "@/components/bdms/mini-bar-list";
import { MetricCard } from "@/components/bdms/metric-card";
import { PageHeader } from "@/components/bdms/page-header";
import { StatusBadge } from "@/components/bdms/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { heritageIcons, heritageImages } from "@/lib/bdms/assets";
import { getDashboardData, getEvents, getHonors, getPayments } from "@/lib/bdms/queries";
import { formatCurrency, formatDate, formatPercent } from "@/lib/bdms/format";

export default async function DashboardPage() {
  const [dashboard, events, payments, honors] = await Promise.all([
    getDashboardData(),
    getEvents(),
    getPayments(),
    getHonors(),
  ]);

  const maxFinance = Math.max(
    dashboard.finance.incomeThisMonth,
    dashboard.finance.instructorShareThisMonth,
    dashboard.finance.communityShareThisMonth,
    1,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="BDMS Digital Management System"
        title="Dashboard Operasional Sanggar"
        description="Ringkasan member, kelas, absensi, pendapatan, honor instruktur, dan kas komunitas untuk Bumi Sangkuriang Dance Sport."
      />

      <section className="relative min-h-[300px] overflow-hidden rounded-lg border bg-[hsl(var(--heritage-navy))] text-white shadow-sm">
        <Image
          src={heritageImages.studioHero}
          alt="Interior sanggar tari heritage dengan aksen batik dan ballroom"
          fill
          priority
          sizes="(min-width: 1024px) 1200px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--heritage-navy)/0.92)] via-[hsl(var(--heritage-navy)/0.62)] to-transparent" />
        <div className="relative flex min-h-[300px] flex-col justify-between p-6 md:p-8">
          <div className="max-w-2xl">
            <Badge className="rounded-md bg-[hsl(var(--heritage-gold))] text-[hsl(var(--heritage-navy))]">
              Modern Heritage Ballroom
            </Badge>
            <h2 className="mt-5 text-3xl font-semibold tracking-normal md:text-5xl">
              Bumi Sangkuriang Dance Sport
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/82 md:text-base">
              Pusat data untuk membership, jadwal kelas, absensi, pembayaran,
              honor instruktur, kas komunitas, progress level, dan dance passport.
            </p>
          </div>
          <div className="grid gap-3 pt-8 sm:grid-cols-3">
            <div className="rounded-lg border border-white/18 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs text-white/70">Kelas paling aktif</p>
              <p className="mt-1 font-medium">{dashboard.highlights.mostActiveClass}</p>
            </div>
            <div className="rounded-lg border border-white/18 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs text-white/70">Instruktur aktif</p>
              <p className="mt-1 font-medium">{dashboard.highlights.mostActiveInstructor}</p>
            </div>
            <div className="rounded-lg border border-white/18 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs text-white/70">Attendance rate</p>
              <p className="mt-1 font-medium">{formatPercent(dashboard.summary.attendanceRate)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Kelas Heritage",
            helper: "Latihan ballroom dengan nuansa sanggar modern.",
            image: heritageImages.classSession,
            icon: heritageIcons.pendopo,
          },
          {
            title: "Ballroom Night",
            helper: "Event komunitas yang hangat dan elegan.",
            image: heritageImages.ballroomNight,
            icon: heritageIcons.gong,
          },
          {
            title: "Kas Transparan",
            helper: "Pembagian honor dan kas komunitas lebih jelas.",
            image: heritageImages.financeDesk,
            icon: heritageIcons.revenueSplit,
          },
          {
            title: "Dance Passport",
            helper: "Perjalanan member tersimpan sebagai achievement.",
            image: heritageImages.dancePassport,
            icon: heritageIcons.dancePassport,
          },
        ].map((tile) => (
          <Card key={tile.title} className="overflow-hidden rounded-lg">
            <div className="relative h-36">
              <Image
                src={tile.image}
                alt={tile.title}
                fill
                sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <CardContent className="flex min-h-[120px] gap-3 p-4">
              <Image
                src={tile.icon}
                alt=""
                width={40}
                height={40}
                className="h-10 w-10 shrink-0"
              />
              <div>
                <p className="font-medium text-foreground">{tile.title}</p>
                <p className="mt-1 text-sm leading-5 text-muted-foreground">{tile.helper}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Member aktif"
          value={dashboard.summary.activeMembers.toLocaleString("id-ID")}
          helper={`${dashboard.summary.totalMembers} total member, ${dashboard.summary.newMembersThisMonth} baru bulan ini`}
          icon={UsersRound}
          accent="navy"
        />
        <MetricCard
          label="Kelas aktif"
          value={dashboard.summary.activeClasses.toLocaleString("id-ID")}
          helper={`${dashboard.summary.privateSessionsThisMonth} private class berjalan`}
          icon={CalendarDays}
          accent="gold"
        />
        <MetricCard
          label="Pendapatan bulan ini"
          value={formatCurrency(dashboard.finance.incomeThisMonth)}
          helper="Pembayaran paid dan verified"
          icon={TrendingUp}
          accent="green"
        />
        <MetricCard
          label="Saldo kas komunitas"
          value={formatCurrency(dashboard.finance.cashBalance)}
          helper={`${formatCurrency(dashboard.finance.expensesThisMonth)} pengeluaran`}
          icon={Landmark}
          accent="burgundy"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <WalletCards className="h-4 w-4 text-[hsl(var(--heritage-burgundy))]" />
              Financial Transparency Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">Hak instruktur</p>
                <p className="mt-1 text-xl font-semibold">
                  {formatCurrency(dashboard.finance.instructorShareThisMonth)}
                </p>
                <Progress
                  value={(dashboard.finance.instructorShareThisMonth / maxFinance) * 100}
                  className="mt-3 h-2"
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Kas komunitas</p>
                <p className="mt-1 text-xl font-semibold">
                  {formatCurrency(dashboard.finance.communityShareThisMonth)}
                </p>
                <Progress
                  value={(dashboard.finance.communityShareThisMonth / maxFinance) * 100}
                  className="mt-3 h-2"
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pengeluaran</p>
                <p className="mt-1 text-xl font-semibold">
                  {formatCurrency(dashboard.finance.expensesThisMonth)}
                </p>
                <Progress
                  value={(dashboard.finance.expensesThisMonth / maxFinance) * 100}
                  className="mt-3 h-2"
                />
              </div>
            </div>
            <Separator />
            <CashFlowBars items={dashboard.monthlyCashFlow} />
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4 text-[hsl(var(--heritage-burgundy))]" />
              Performa Kelas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MiniBarList
              items={dashboard.classPerformance.map((item) => ({
                label: item.name,
                value: item.attendanceRate,
                helper: formatCurrency(item.revenue),
              }))}
            />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <Card className="rounded-lg xl:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarCheck2 className="h-4 w-4 text-[hsl(var(--heritage-burgundy))]" />
              Event Mendatang
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {events.slice(0, 3).map((event) => (
              <div key={event.id} className="rounded-lg border bg-background/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{event.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(event.date)} - {event.location}
                    </p>
                  </div>
                  <StatusBadge status={event.status} />
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{event.registered}/{event.quota} peserta</span>
                  <span>{formatCurrency(event.revenue - event.expenses)} surplus</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="h-4 w-4 text-[hsl(var(--heritage-burgundy))]" />
              Pembayaran Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {payments.slice(0, 4).map((payment) => (
              <div key={payment.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{payment.payerName}</p>
                  <p className="text-xs text-muted-foreground">
                    {payment.invoiceNo} - {payment.category}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm">{formatCurrency(payment.amount)}</p>
                  <StatusBadge status={payment.status} className="mt-1" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="h-4 w-4 text-[hsl(var(--heritage-burgundy))]" />
              Honor Instruktur
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {honors.slice(0, 4).map((honor) => (
              <div key={honor.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{honor.instructorName}</p>
                  <p className="text-xs text-muted-foreground">
                    {honor.sessionCount} sesi - {honor.period}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm">{formatCurrency(honor.totalHonor)}</p>
                  <StatusBadge status={honor.status} className="mt-1" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
