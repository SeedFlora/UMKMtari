import { BadgeDollarSign, FileText, Percent } from "lucide-react";

import { MetricCard } from "@/components/bdms/metric-card";
import { PageHeader } from "@/components/bdms/page-header";
import { StatusBadge } from "@/components/bdms/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getHonors } from "@/lib/bdms/queries";
import { formatCurrency } from "@/lib/bdms/format";

export default async function HonorPage() {
  const honors = await getHonors();
  const totalHonor = honors.reduce((sum, honor) => sum + honor.totalHonor, 0);
  const totalSessions = honors.reduce((sum, honor) => sum + honor.sessionCount, 0);
  const waiting = honors.filter((honor) => honor.status !== "Paid").length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Instructor Honor Calculation"
        title="Rekap Honor Instruktur"
        description="Hitung honor berdasarkan persentase pendapatan, tarif sesi, tarif peserta, atau kombinasi skema sesuai jenis kegiatan."
        actions={
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4" />
            Slip PDF
          </Button>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Total honor"
          value={formatCurrency(totalHonor)}
          helper="Periode berjalan"
          icon={BadgeDollarSign}
          accent="gold"
        />
        <MetricCard
          label="Sesi mengajar"
          value={totalSessions.toLocaleString("id-ID")}
          helper="Reguler, private, workshop"
          icon={Percent}
          accent="navy"
        />
        <MetricCard
          label="Butuh approval"
          value={waiting.toLocaleString("id-ID")}
          helper="Draft, waiting, approved"
          icon={FileText}
          accent="burgundy"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">Rekap Honor</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Instruktur</TableHead>
                  <TableHead>Periode</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Sesi</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Share</TableHead>
                  <TableHead>Bonus</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {honors.map((honor) => (
                  <TableRow key={honor.id}>
                    <TableCell>{honor.instructorName}</TableCell>
                    <TableCell>{honor.period}</TableCell>
                    <TableCell>{honor.classCount}</TableCell>
                    <TableCell>{honor.sessionCount}</TableCell>
                    <TableCell className="font-mono">
                      {formatCurrency(honor.grossRevenue)}
                    </TableCell>
                    <TableCell className="font-mono">
                      {formatCurrency(honor.instructorShare)}
                    </TableCell>
                    <TableCell className="font-mono">{formatCurrency(honor.bonus)}</TableCell>
                    <TableCell className="font-mono font-semibold">
                      {formatCurrency(honor.totalHonor)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={honor.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">Metode Perhitungan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              ["Persentase pendapatan", "Default 80% instruktur dan 20% kas komunitas."],
              ["Tarif per sesi", "Cocok untuk guest instructor atau workshop khusus."],
              ["Tarif per peserta", "Mengikuti jumlah peserta hadir pada sesi."],
              ["Kombinasi", "Tarif dasar ditambah bonus peserta atau performa."],
            ].map(([title, description]) => (
              <div key={title} className="rounded-lg border bg-background/70 p-4">
                <Badge variant="outline" className="rounded-md bg-card">
                  {title}
                </Badge>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

