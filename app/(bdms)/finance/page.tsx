import { Plus, ReceiptText, Wallet } from "lucide-react";

import { createCashOutAction, createPaymentAction } from "@/app/actions";
import { CashFlowBars } from "@/components/bdms/mini-bar-list";
import { MetricCard } from "@/components/bdms/metric-card";
import { PageHeader } from "@/components/bdms/page-header";
import { StatusBadge } from "@/components/bdms/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { getDashboardData, getMembers, getPayments, getTransactions } from "@/lib/bdms/queries";
import { formatCurrency, formatDate } from "@/lib/bdms/format";

export default async function FinancePage() {
  const [dashboard, payments, transactions, members] = await Promise.all([
    getDashboardData(),
    getPayments(),
    getTransactions(),
    getMembers(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Financial Management"
        title="Pembayaran dan Cash Flow"
        description="Catat pemasukan, pengeluaran, status pembayaran, dan distribusi otomatis hak instruktur serta kas komunitas."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Pemasukan bulan ini"
          value={formatCurrency(dashboard.finance.incomeThisMonth)}
          helper="Paid dan verified"
          icon={ReceiptText}
          accent="green"
        />
        <MetricCard
          label="Hak instruktur"
          value={formatCurrency(dashboard.finance.instructorShareThisMonth)}
          helper="Default 80% dari pembayaran"
          icon={Wallet}
          accent="gold"
        />
        <MetricCard
          label="Kas komunitas"
          value={formatCurrency(dashboard.finance.communityShareThisMonth)}
          helper="Default 20% masuk kas"
          icon={Wallet}
          accent="navy"
        />
        <MetricCard
          label="Pengeluaran"
          value={formatCurrency(dashboard.finance.expensesThisMonth)}
          helper="Operasional, promosi, event"
          icon={ReceiptText}
          accent="burgundy"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">Pembayaran Member</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Payer</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Nominal</TableHead>
                  <TableHead>Instruktur</TableHead>
                  <TableHead>Kas</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <p className="font-medium">{payment.invoiceNo}</p>
                      <p className="text-xs text-muted-foreground">
                        Due {formatDate(payment.dueDate)}
                      </p>
                    </TableCell>
                    <TableCell>{payment.payerName}</TableCell>
                    <TableCell>{payment.category}</TableCell>
                    <TableCell className="font-mono">{formatCurrency(payment.amount)}</TableCell>
                    <TableCell className="font-mono">
                      {formatCurrency(payment.instructorShare)}
                    </TableCell>
                    <TableCell className="font-mono">
                      {formatCurrency(payment.communityShare)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={payment.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Plus className="h-4 w-4 text-[hsl(var(--heritage-burgundy))]" />
              Input Pembayaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createPaymentAction} className="space-y-4">
              <div className="grid gap-2">
                <Label>Member</Label>
                <Select name="member_id">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih member" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="payer_name">Nama payer</Label>
                <Input id="payer_name" name="payer_name" placeholder="Opsional jika member dipilih" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label>Kategori</Label>
                  <Select name="category" defaultValue="Kelas reguler">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "Kelas reguler",
                        "Private class",
                        "Semi-private class",
                        "Workshop",
                        "Trial class",
                        "Ballroom Night",
                      ].map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select name="status" defaultValue="Pending">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Pending", "Verified", "Paid", "Overdue", "Cancelled"].map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="amount">Nominal</Label>
                  <Input id="amount" name="amount" type="number" defaultValue="250000" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="due_date">Due date</Label>
                  <Input
                    id="due_date"
                    name="due_date"
                    type="date"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Simpan Pembayaran
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">Catat Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createCashOutAction} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="date">Tanggal</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Kategori</Label>
                  <Select name="category" defaultValue="Operasional">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "Operasional",
                        "Promosi dan Branding",
                        "Pengembangan Program",
                        "Event Komunitas",
                        "Administrasi",
                      ].map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea id="description" name="description" placeholder="Contoh: dokumentasi event" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cashout_amount">Nominal</Label>
                <Input id="cashout_amount" name="amount" type="number" defaultValue="250000" />
              </div>
              <Button type="submit" variant="outline" className="w-full">
                Simpan Pengeluaran
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">Arus Kas Bulanan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <CashFlowBars items={dashboard.monthlyCashFlow} />
            <Separator />
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between gap-4 rounded-lg border bg-background/70 p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(transaction.date)} - {transaction.category}
                    </p>
                  </div>
                  <p className="font-mono text-sm">{formatCurrency(transaction.amount)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
