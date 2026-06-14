import { Plus } from "lucide-react";

import { createClassAction } from "@/app/actions";
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
import { getClasses, getInstructors } from "@/lib/bdms/queries";
import { formatCurrency, formatPercent, formatTimeRange } from "@/lib/bdms/format";

export default async function ClassesPage() {
  const [classes, instructors] = await Promise.all([getClasses(), getInstructors()]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Class Management"
        title="Jadwal dan Kelas"
        description="Kelola kelas reguler, private class, workshop, special class, kuota peserta, instruktur, dan pendapatan per kelas."
      />

      <section className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">Kelas Berjalan</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Jadwal</TableHead>
                  <TableHead>Instruktur</TableHead>
                  <TableHead>Peserta</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Pendapatan</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.map((danceClass) => (
                  <TableRow key={danceClass.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{danceClass.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {danceClass.classCode} - {danceClass.danceStyle} - {danceClass.level}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {danceClass.day},{" "}
                      {formatTimeRange(danceClass.startTime, danceClass.endTime)}
                      <p className="text-xs text-muted-foreground">{danceClass.room}</p>
                    </TableCell>
                    <TableCell>{danceClass.instructorName}</TableCell>
                    <TableCell>
                      {danceClass.enrolled}/{danceClass.capacity}
                    </TableCell>
                    <TableCell className="font-mono">
                      {formatPercent(danceClass.attendanceRate)}
                    </TableCell>
                    <TableCell className="font-mono">
                      {formatCurrency(danceClass.revenueMonth)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={danceClass.status} />
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
              Buat Kelas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createClassAction} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nama kelas</Label>
                <Input id="name" name="name" required placeholder="Waltz Beginner" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label>Jenis</Label>
                  <Select name="class_type" defaultValue="Kelas reguler">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "Kelas reguler",
                        "Private class",
                        "Semi-private class",
                        "Workshop",
                        "Special class",
                      ].map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Level</Label>
                  <Select name="level" defaultValue="Foundation">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Foundation", "Beginner", "Bronze", "Silver", "Gold", "All level"].map(
                        (level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dance_style">Dance style</Label>
                <Input id="dance_style" name="dance_style" placeholder="Waltz, Rumba, Salsa" />
              </div>
              <div className="grid gap-2">
                <Label>Instruktur utama</Label>
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
              <div className="grid grid-cols-3 gap-3">
                <div className="grid gap-2">
                  <Label>Hari</Label>
                  <Select name="day_of_week" defaultValue="Selasa">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"].map(
                        (day) => (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="start_time">Mulai</Label>
                  <Input id="start_time" name="start_time" type="time" defaultValue="19:00" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end_time">Selesai</Label>
                  <Input id="end_time" name="end_time" type="time" defaultValue="20:30" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="capacity">Kuota</Label>
                  <Input id="capacity" name="capacity" type="number" defaultValue="20" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Harga</Label>
                  <Input id="price" name="price" type="number" defaultValue="250000" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="room">Lokasi / ruangan</Label>
                <Input id="room" name="room" defaultValue="Studio Heritage" />
              </div>
              <Button type="submit" className="w-full">
                Simpan Kelas
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

