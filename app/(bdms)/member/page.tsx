import Image from "next/image";
import {
  Award,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
  Medal,
  Star,
  UserRoundCog,
} from "lucide-react";

import { MetricCard } from "@/components/bdms/metric-card";
import { PageHeader } from "@/components/bdms/page-header";
import { StatusBadge } from "@/components/bdms/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCurrentProfile } from "@/lib/bdms/auth";
import { heritageImages } from "@/lib/bdms/assets";
import { formatDate, formatPercent, formatTimeRange } from "@/lib/bdms/format";
import { getMemberPortalData } from "@/lib/bdms/portal";

export default async function MemberPortalPage() {
  const profile = await getCurrentProfile();
  const portal = await getMemberPortalData(profile);
  const member = portal.member;
  const progress = portal.progress;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Portal Member"
        title={`Perjalanan tari${member ? ` ${member.fullName}` : ""}`}
        description="Lihat jadwal kelas, attendance, profil instruktur, feedback, badge, dan progress level dalam Digital Dance Passport."
      />

      {!portal.isConnected && (
        <Card className="rounded-lg border-[hsl(var(--heritage-gold))] bg-[hsl(var(--heritage-gold)/0.10)]">
          <CardContent className="p-4 text-sm text-[hsl(var(--heritage-navy))]">
            Akun ini belum terhubung ke data member Supabase. Admin perlu membuat baris
            `profiles` dengan role `member` dan `member_id` yang sesuai.
          </CardContent>
        </Card>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Level saat ini"
          value={member?.currentLevel ?? "-"}
          helper={progress ? `Target ${progress.targetLevel}` : "Digital Dance Passport"}
          icon={GraduationCap}
          accent="navy"
        />
        <MetricCard
          label="Progress level"
          value={formatPercent(progress?.progressPercent ?? 0)}
          helper={`${progress?.masteredSkills ?? 0}/${progress?.totalSkills ?? 0} skill dikuasai`}
          icon={ClipboardCheck}
          accent="gold"
        />
        <MetricCard
          label="Attendance"
          value={formatPercent(member?.attendanceRate ?? 0)}
          helper={`${portal.attendance.length} catatan absensi`}
          icon={CalendarDays}
          accent="green"
        />
        <MetricCard
          label="Badge"
          value={(progress?.badges.length ?? 0).toString()}
          helper="Achievement member"
          icon={Medal}
          accent="burgundy"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <Card className="overflow-hidden rounded-lg">
          <div className="relative min-h-[300px] bg-[hsl(var(--heritage-navy))] text-white">
            <Image
              src={heritageImages.dancePassport}
              alt="Digital dance passport bernuansa heritage Indonesia"
              fill
              priority
              sizes="(min-width: 1280px) 780px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--heritage-navy)/0.92)] via-[hsl(var(--heritage-navy)/0.64)] to-transparent" />
            <div className="relative flex min-h-[300px] flex-col justify-between p-6 md:p-8">
              <div>
                <Badge className="rounded-md bg-[hsl(var(--heritage-gold))] text-[hsl(var(--heritage-navy))]">
                  Digital Dance Passport
                </Badge>
                <h2 className="mt-5 text-3xl font-semibold tracking-normal md:text-4xl">
                  {member?.memberCode ?? "Member BSDS"}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-white/82">
                  {member?.membershipType ?? "Membership"} - bergabung sejak{" "}
                  {member?.joinedAt ? formatDate(member.joinedAt) : "-"}
                </p>
              </div>
              <div className="mt-8 max-w-xl rounded-lg border border-white/18 bg-white/10 p-4 backdrop-blur">
                <div className="flex justify-between text-sm">
                  <span>Progress menuju level berikutnya</span>
                  <span className="font-mono">{formatPercent(progress?.progressPercent ?? 0)}</span>
                </div>
                <Progress value={progress?.progressPercent ?? 0} className="mt-3 h-2" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">Feedback Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {portal.feedback.slice(0, 3).map((item) => (
              <div key={item.id} className="rounded-lg border bg-background/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{item.level}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(item.assessedAt)}
                    </p>
                  </div>
                  <Badge variant="outline" className="rounded-md">
                    <Star className="h-3.5 w-3.5" />
                    {item.averageScore.toFixed(1)}
                  </Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {item.feedback}
                </p>
              </div>
            ))}
            {!portal.feedback.length && (
              <p className="text-sm text-muted-foreground">
                Feedback instruktur akan muncul setelah assessment pertama.
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">Jadwal Kelas Saya</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {portal.classes.map((danceClass) => (
              <div key={danceClass.id} className="rounded-lg border bg-background/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{danceClass.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {danceClass.danceStyle} - {danceClass.level}
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
                    <p className="text-xs text-muted-foreground">Instruktur</p>
                    <p>{danceClass.instructorName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Ruangan</p>
                    <p>{danceClass.room}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Instruktur</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Catatan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portal.attendance.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{formatDate(item.date)}</TableCell>
                    <TableCell>{item.className}</TableCell>
                    <TableCell>{item.instructorName}</TableCell>
                    <TableCell>
                      <StatusBadge status={item.status} />
                    </TableCell>
                    <TableCell className="max-w-[240px] text-muted-foreground">
                      {item.notes ?? "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <UserRoundCog className="h-4 w-4 text-[hsl(var(--heritage-burgundy))]" />
              Profil Instruktur
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {portal.instructors.map((instructor) => (
              <div key={instructor.id} className="rounded-lg border bg-background/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{instructor.fullName}</p>
                    <p className="text-xs text-muted-foreground">{instructor.level}</p>
                  </div>
                  <Badge variant="outline" className="rounded-md">
                    {instructor.status}
                  </Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {instructor.bio}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {instructor.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="rounded-md">
                      {specialty}
                    </Badge>
                  ))}
                </div>
                {!!instructor.publicAchievements.length && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-2">
                      {instructor.publicAchievements.slice(0, 3).map((achievement) => (
                        <div key={achievement.id} className="flex items-start gap-2 text-sm">
                          <Award className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--heritage-burgundy))]" />
                          <span>
                            {achievement.title} {achievement.year ? `(${achievement.year})` : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">Progress Level</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="flex justify-between text-sm">
                <span>{progress?.currentLevel ?? member?.currentLevel ?? "-"}</span>
                <span className="font-mono">{formatPercent(progress?.progressPercent ?? 0)}</span>
              </div>
              <Progress value={progress?.progressPercent ?? 0} className="mt-2 h-2" />
              <p className="mt-2 text-xs text-muted-foreground">
                Target: {progress?.targetLevel ?? "-"}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 rounded-lg border bg-background/70 p-3 text-center">
              <div>
                <p className="font-mono text-lg font-semibold">
                  {formatPercent(progress?.attendanceMonth ?? member?.attendanceRate ?? 0)}
                </p>
                <p className="text-[11px] text-muted-foreground">Attendance</p>
              </div>
              <div>
                <p className="font-mono text-lg font-semibold">
                  {progress?.masteredSkills ?? 0}/{progress?.totalSkills ?? 0}
                </p>
                <p className="text-[11px] text-muted-foreground">Skill</p>
              </div>
              <div>
                <p className="font-mono text-lg font-semibold">
                  {(progress?.assessmentAverage ?? 0).toFixed(1)}
                </p>
                <p className="text-[11px] text-muted-foreground">Score</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {(progress?.badges ?? []).map((badge) => (
                <Badge key={badge} variant="outline" className="rounded-md bg-card">
                  <Medal className="h-3.5 w-3.5" />
                  {badge}
                </Badge>
              ))}
            </div>
            {progress?.feedback && (
              <>
                <Separator />
                <p className="text-sm leading-6 text-muted-foreground">
                  {progress.feedback}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
