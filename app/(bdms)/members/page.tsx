import { Download, Plus } from "lucide-react";

import { createMemberAction } from "@/app/actions";
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
import { getMembers } from "@/lib/bdms/queries";
import { formatDate, formatPercent } from "@/lib/bdms/format";

export default async function MembersPage() {
  const members = await getMembers();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Membership Management"
        title="Data Member"
        description="Kelola profil anggota, status membership, level, riwayat kelas, dan catatan operasional."
        actions={
          <Button variant="outline" size="sm" asChild>
            <a href="/api/export/members">
              <Download className="h-4 w-4" />
              Export CSV
            </a>
          </Button>
        }
      />

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">Daftar Anggota</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Membership</TableHead>
                  <TableHead>Kehadiran</TableHead>
                  <TableHead>Bergabung</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{member.fullName}</p>
                        <p className="text-xs text-muted-foreground">
                          {member.memberCode} - {member.phone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={member.status} />
                    </TableCell>
                    <TableCell>{member.currentLevel}</TableCell>
                    <TableCell>{member.membershipType}</TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">
                        {formatPercent(member.attendanceRate)}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(member.joinedAt)}</TableCell>
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
              Input Member Baru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createMemberAction} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="full_name">Nama lengkap</Label>
                <Input id="full_name" name="full_name" required placeholder="Nama member" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Nomor telepon</Label>
                <Input id="phone" name="phone" placeholder="08xx" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="member@email.com" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select name="status" defaultValue="Trial">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Trial", "Aktif", "Cuti", "Alumni", "Tidak aktif"].map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Level</Label>
                  <Select name="current_level" defaultValue="Foundation">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Foundation", "Beginner", "Bronze", "Silver", "Gold"].map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="membership_type">Jenis membership</Label>
                <Input
                  id="membership_type"
                  name="membership_type"
                  defaultValue="Reguler"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="joined_at">Tanggal bergabung</Label>
                <Input
                  id="joined_at"
                  name="joined_at"
                  type="date"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Catatan</Label>
                <Textarea id="notes" name="notes" placeholder="Catatan khusus" />
              </div>
              <Button type="submit" className="w-full">
                Simpan Member
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
