import { Plus, UserPlus } from "lucide-react";

import { createLeadAction } from "@/app/actions";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { getLeads } from "@/lib/bdms/queries";
import { formatDate } from "@/lib/bdms/format";

export default async function CrmPage() {
  const leads = await getLeads();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="CRM & Prospective Member"
        title="Prospek Member"
        description="Catat calon anggota dari Instagram, TikTok, website, referral, event, walk-in, dan jadwalkan trial class sampai converted."
      />

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <UserPlus className="h-4 w-4 text-[hsl(var(--heritage-burgundy))]" />
              Pipeline Prospek
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>WhatsApp</TableHead>
                  <TableHead>Sumber</TableHead>
                  <TableHead>Minat</TableHead>
                  <TableHead>Kontak pertama</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <p className="font-medium">{lead.fullName}</p>
                      <p className="text-xs text-muted-foreground">{lead.notes}</p>
                    </TableCell>
                    <TableCell>{lead.whatsapp}</TableCell>
                    <TableCell>{lead.source}</TableCell>
                    <TableCell>{lead.interestClass}</TableCell>
                    <TableCell>{formatDate(lead.firstContactAt)}</TableCell>
                    <TableCell>
                      <StatusBadge status={lead.status} />
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
              Input Lead
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createLeadAction} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="full_name">Nama</Label>
                <Input id="full_name" name="full_name" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input id="whatsapp" name="whatsapp" required placeholder="08xx" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label>Sumber</Label>
                  <Select name="source" defaultValue="Instagram">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Instagram", "TikTok", "Website", "Teman", "Event", "Walk-in", "Referral"].map(
                        (source) => (
                          <SelectItem key={source} value={source}>
                            {source}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select name="status" defaultValue="New lead">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "New lead",
                        "Contacted",
                        "Trial scheduled",
                        "Trial completed",
                        "Interested",
                        "Converted to member",
                        "Follow up later",
                      ].map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="interest_class">Minat kelas</Label>
                <Input id="interest_class" name="interest_class" placeholder="Latin Foundation" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="first_contact_at">Tanggal kontak</Label>
                <Input
                  id="first_contact_at"
                  name="first_contact_at"
                  type="date"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Catatan follow-up</Label>
                <Textarea id="notes" name="notes" />
              </div>
              <Button type="submit" className="w-full">
                Simpan Lead
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
