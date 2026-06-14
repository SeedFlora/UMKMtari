import { QrCode, Save } from "lucide-react";

import { createAttendanceAction } from "@/app/actions";
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
import { getAttendance, getClasses, getInstructors, getMembers } from "@/lib/bdms/queries";
import { formatDate } from "@/lib/bdms/format";

export default async function AttendancePage() {
  const [attendance, classes, members, instructors] = await Promise.all([
    getAttendance(),
    getClasses(),
    getMembers(),
    getInstructors(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Attendance Management"
        title="Absensi Kelas"
        description="Catat kehadiran member dan instruktur dengan admin check-in, QR code, atau validasi instruktur."
      />

      <section className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <QrCode className="h-4 w-4 text-[hsl(var(--heritage-burgundy))]" />
              Check-in Cepat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createAttendanceAction} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Tanggal</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                />
              </div>
              <div className="grid gap-2">
                <Label>Kelas</Label>
                <Select name="class_id">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((danceClass) => (
                      <SelectItem key={danceClass.id} value={danceClass.id}>
                        {danceClass.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                <Label>Instruktur</Label>
                <Select name="instructor_id">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih instruktur" />
                  </SelectTrigger>
                  <SelectContent>
                    {instructors.map((instructor) => (
                      <SelectItem key={instructor.id} value={instructor.id}>
                        {instructor.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select name="status" defaultValue="Hadir">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Hadir", "Izin", "Sakit", "Alpha", "Make-up class"].map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="check_in_time">Check-in</Label>
                  <Input id="check_in_time" name="check_in_time" type="time" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Metode</Label>
                <Select name="method" defaultValue="Admin check-in">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Admin check-in", "QR code", "Instruktur check-in"].map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Catatan progres</Label>
                <Textarea id="notes" name="notes" placeholder="Feedback singkat" />
              </div>
              <Button type="submit" className="w-full">
                <Save className="h-4 w-4" />
                Simpan Absensi
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">Riwayat Absensi</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Instruktur</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Metode</TableHead>
                  <TableHead>Catatan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{formatDate(record.date)}</TableCell>
                    <TableCell>{record.className}</TableCell>
                    <TableCell>{record.memberName}</TableCell>
                    <TableCell>{record.instructorName}</TableCell>
                    <TableCell>
                      <StatusBadge status={record.status} />
                    </TableCell>
                    <TableCell>{record.method}</TableCell>
                    <TableCell className="max-w-[260px] truncate text-muted-foreground">
                      {record.notes ?? "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
