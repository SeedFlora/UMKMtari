import Image from "next/image";
import {
  Award,
  CalendarCheck2,
  CalendarDays,
  ClipboardPenLine,
  Medal,
  Plus,
  UsersRound,
} from "lucide-react";

import {
  createInstructorAchievementAction,
  createMemberFeedbackAction,
} from "@/app/actions";
import { MetricCard } from "@/components/bdms/metric-card";
import { PageHeader } from "@/components/bdms/page-header";
import { StatusBadge } from "@/components/bdms/status-badge";
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import { getCurrentProfile } from "@/lib/bdms/auth";
import { heritageImages } from "@/lib/bdms/assets";
import { formatDate, formatPercent, formatTimeRange } from "@/lib/bdms/format";
import { getInstructorPortalData } from "@/lib/bdms/portal";

const scoreFields = [
  ["technique", "Technique"],
  ["posture", "Posture"],
  ["timing", "Timing"],
  ["musicality", "Musicality"],
  ["partnering", "Partnering"],
  ["expression", "Expression"],
  ["floorcraft", "Floorcraft"],
  ["confidence", "Confidence"],
] as const;

export default async function InstructorPortalPage() {
  const profile = await getCurrentProfile();
  const portal = await getInstructorPortalData(profile);
  const instructor = portal.instructor;
  const approvedAchievements = portal.achievements.filter(
    (achievement) => achievement.status === "Approved",
  ).length;
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Portal Instruktur"
        title={`Selamat datang${instructor ? `, ${instructor.fullName}` : ""}`}
        description="Kelola kelas yang diajar, portfolio achievement, assessment, catatan, dan feedback member dari satu ruang kerja."
      />

      {!portal.isConnected && (
        <Card className="rounded-lg border-[hsl(var(--heritage-gold))] bg-[hsl(var(--heritage-gold)/0.10)]">
          <CardContent className="p-4 text-sm text-[hsl(var(--heritage-navy))]">
            Akun ini belum terhubung ke data instruktur Supabase. Admin perlu membuat baris
            `profiles` dengan role `instruktur` dan `instructor_id` yang sesuai.
          </CardContent>
        </Card>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Kelas diampu"
          value={portal.classes.length.toString()}
          helper="Kelas utama dan assistant"
          icon={CalendarDays}
          accent="navy"
        />
        <MetricCard
          label="Member bimbingan"
          value={portal.students.length.toString()}
          helper="Dari enrolment kelas"
          icon={UsersRound}
          accent="gold"
        />
        <MetricCard
          label="Sesi bulan ini"
          value={(instructor?.sessionsThisMonth ?? 0).toString()}
          helper="Ringkasan portfolio instruktur"
          icon={CalendarCheck2}
          accent="green"
        />
        <MetricCard
          label="Achievement approved"
          value={approvedAchievements.toString()}
          helper={`${portal.achievements.length} total submission`}
          icon={Medal}
          accent="burgundy"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <Card className="overflow-hidden rounded-lg">
          <div className="relative min-h-[260px] bg-[hsl(var(--heritage-navy))] text-white">
            <Image
              src={heritageImages.classSession}
              alt="Sesi kelas tari di studio heritage"
              fill
              sizes="(min-width: 1280px) 760px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--heritage-navy)/0.92)] via-[hsl(var(--heritage-navy)/0.68)] to-transparent" />
            <div className="relative max-w-2xl p-6 md:p-8">
              <Badge className="rounded-md bg-[hsl(var(--heritage-gold))] text-[hsl(var(--heritage-navy))]">
                Instructor Workspace
              </Badge>
              <h2 className="mt-5 text-3xl font-semibold tracking-normal">
                {instructor?.level ?? "Instruktur BSDS"}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/82">
                {instructor?.bio ??
                  "Ruang kerja instruktur untuk menjaga kualitas kelas, portfolio, dan perkembangan member."}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {(instructor?.specialties ?? []).map((specialty) => (
                  <Badge key={specialty} variant="secondary" className="rounded-md bg-white/12 text-white">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Plus className="h-4 w-4 text-[hsl(var(--heritage-burgundy))]" />
              Tambah Achievement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createInstructorAchievementAction} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="achievement-title">Judul</Label>
                <Input id="achievement-title" name="title" required placeholder="Nama kompetisi, sertifikasi, atau showcase" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label>Jenis</Label>
                  <Select name="achievement_type" defaultValue="Competition">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Competition", "Certification", "Showcase", "Workshop", "Teaching"].map(
                        (type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="achievement-year">Tahun</Label>
                  <Input id="achievement-year" name="year" type="number" min="1990" max="2100" defaultValue="2026" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="achievement-style">Dance style</Label>
                  <Input id="achievement-style" name="dance_style" placeholder="Waltz, Rumba" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="achievement-rank">Rank</Label>
                  <Input id="achievement-rank" name="rank" placeholder="Juara 1, Finalist" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="achievement-category">Kategori</Label>
                <Input id="achievement-category" name="category" placeholder="Senior Amateur, Coach Clinic" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="achievement-location">Lokasi</Label>
                  <Input id="achievement-location" name="location" placeholder="Bandung" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="achievement-organizer">Organizer</Label>
                  <Input id="achievement-organizer" name="organizer" placeholder="BSDS / IODI" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="achievement-proof">Proof URL</Label>
                <Input id="achievement-proof" name="proof_url" type="url" placeholder="https://..." />
              </div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input name="is_public" type="checkbox" className="h-4 w-4 rounded border-border" />
                Tampilkan di profil publik instruktur
              </label>
              <Button type="submit" className="w-full">
                Simpan Achievement
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">Kelas Saya</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {portal.classes.map((danceClass) => (
              <div key={danceClass.id} className="rounded-lg border bg-background/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{danceClass.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {danceClass.classCode} - {danceClass.danceStyle} - {danceClass.level}
                    </p>
                  </div>
                  <StatusBadge status={danceClass.status} />
                </div>
                <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Jadwal</p>
                    <p>{danceClass.day}, {formatTimeRange(danceClass.startTime, danceClass.endTime)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Ruangan</p>
                    <p>{danceClass.room}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Attendance</p>
                    <p className="font-mono">{formatPercent(danceClass.attendanceRate)}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ClipboardPenLine className="h-4 w-4 text-[hsl(var(--heritage-burgundy))]" />
              Feedback Member
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createMemberFeedbackAction} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label>Member</Label>
                  <Select name="member_id" disabled={!portal.students.length}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih member" />
                    </SelectTrigger>
                    <SelectContent>
                      {portal.students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Level</Label>
                  <Select name="level" defaultValue="Foundation">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Foundation", "Beginner", "Bronze", "Silver", "Gold", "Performance / Competition"].map(
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
                <Label htmlFor="assessed-at">Tanggal assessment</Label>
                <Input id="assessed-at" name="assessed_at" type="date" defaultValue={today} />
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {scoreFields.map(([name, label]) => (
                  <div key={name} className="grid gap-2">
                    <Label htmlFor={name}>{label}</Label>
                    <Input id={name} name={name} type="number" min="0" max="5" step="0.1" defaultValue="3.5" />
                  </div>
                ))}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="feedback">Catatan dan feedback</Label>
                <Textarea
                  id="feedback"
                  name="feedback"
                  required
                  placeholder="Contoh: Posture sudah stabil, perlu latihan timing di reverse turn."
                />
              </div>
              <Button type="submit" className="w-full" disabled={!portal.students.length}>
                Kirim Feedback
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <Card className="rounded-lg xl:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Member Bimbingan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {portal.students.map((student) => (
              <div key={student.id} className="rounded-lg border bg-background/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{student.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      {student.memberCode} - {student.currentLevel}
                    </p>
                  </div>
                  <StatusBadge status={student.status} />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {student.classNames.join(", ")}
                </p>
                {student.lastFeedback && (
                  <>
                    <Separator className="my-3" />
                    <p className="text-sm leading-6 text-muted-foreground">
                      {student.lastFeedback}
                    </p>
                  </>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">Portfolio Achievement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {portal.achievements.map((achievement) => (
              <div key={achievement.id} className="rounded-lg border bg-background/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{achievement.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {achievement.type} - {achievement.year ?? "-"} - {achievement.danceStyle}
                    </p>
                  </div>
                  <StatusBadge status={achievement.status} />
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {achievement.rank} - {achievement.organizer}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">Feedback Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {portal.feedback.map((item) => (
              <div key={item.id} className="rounded-lg border bg-background/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{item.memberName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(item.assessedAt)} - {item.level}
                    </p>
                  </div>
                  <Badge variant="outline" className="rounded-md">
                    <Award className="h-3.5 w-3.5" />
                    {item.averageScore.toFixed(1)}
                  </Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {item.feedback}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
