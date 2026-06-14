import { CalendarPlus, Ticket } from "lucide-react";

import { MetricCard } from "@/components/bdms/metric-card";
import { PageHeader } from "@/components/bdms/page-header";
import { StatusBadge } from "@/components/bdms/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getEvents } from "@/lib/bdms/queries";
import { formatCurrency, formatDate } from "@/lib/bdms/format";

export default async function EventsPage() {
  const events = await getEvents();
  const totalRevenue = events.reduce((sum, event) => sum + event.revenue, 0);
  const totalSurplus = events.reduce(
    (sum, event) => sum + event.revenue - event.expenses,
    0,
  );
  const openEvents = events.filter((event) => event.status === "Open Registration").length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Event Management"
        title="Event Komunitas"
        description="Kelola Ballroom Night, workshop, showcase, trial class, registrasi peserta, check-in event, sertifikat, dan laporan surplus."
        actions={
          <Button size="sm">
            <CalendarPlus className="h-4 w-4" />
            Event Baru
          </Button>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Event open"
          value={openEvents.toLocaleString("id-ID")}
          helper={`${events.length} total event terdaftar`}
          icon={Ticket}
          accent="navy"
        />
        <MetricCard
          label="Pendapatan event"
          value={formatCurrency(totalRevenue)}
          helper="Akumulasi event berjalan"
          icon={Ticket}
          accent="gold"
        />
        <MetricCard
          label="Surplus event"
          value={formatCurrency(totalSurplus)}
          helper="Revenue dikurangi expenses"
          icon={Ticket}
          accent="green"
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {events.map((event) => (
          <Card key={event.id} className="rounded-lg">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge variant="outline" className="rounded-md bg-background">
                    {event.type}
                  </Badge>
                  <CardTitle className="mt-3 text-base">{event.name}</CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {event.eventCode} - {formatDate(event.date)} pukul {event.time}
                  </p>
                </div>
                <StatusBadge status={event.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{event.location}</p>
              <div>
                <div className="flex justify-between text-sm">
                  <span>Registrasi</span>
                  <span>
                    {event.registered}/{event.quota}
                  </span>
                </div>
                <Progress
                  value={(event.registered / Math.max(event.quota, 1)) * 100}
                  className="mt-2 h-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 rounded-lg border bg-background/70 p-3">
                <div>
                  <p className="text-xs text-muted-foreground">Tiket</p>
                  <p className="font-mono text-sm">{formatCurrency(event.ticketPrice)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Surplus</p>
                  <p className="font-mono text-sm">
                    {formatCurrency(event.revenue - event.expenses)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}

