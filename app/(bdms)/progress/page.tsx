import { Award, BookOpenCheck, ClipboardCheck, Medal } from "lucide-react";

import { MetricCard } from "@/components/bdms/metric-card";
import { PageHeader } from "@/components/bdms/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { getProgress } from "@/lib/bdms/queries";
import { formatPercent } from "@/lib/bdms/format";

export default async function ProgressPage() {
  const progress = await getProgress();
  const averageProgress =
    progress.reduce((sum, item) => sum + item.progressPercent, 0) /
    Math.max(progress.length, 1);
  const mastered = progress.reduce((sum, item) => sum + item.masteredSkills, 0);
  const skills = progress.reduce((sum, item) => sum + item.totalSkills, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Member Progress & Digital Dance Passport"
        title="Progress Level Member"
        description="Pantau level, skill matrix, assessment instruktur, badge, feedback, dan perjalanan belajar setiap member."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Progress rata-rata"
          value={formatPercent(averageProgress)}
          helper="Menuju level berikutnya"
          icon={BookOpenCheck}
          accent="gold"
        />
        <MetricCard
          label="Skill dikuasai"
          value={`${mastered}/${skills}`}
          helper="Akumulasi skill matrix"
          icon={ClipboardCheck}
          accent="navy"
        />
        <MetricCard
          label="Badge aktif"
          value={progress.reduce((sum, item) => sum + item.badges.length, 0).toString()}
          helper="Masuk ke dance passport"
          icon={Medal}
          accent="burgundy"
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {progress.map((item) => (
          <Card key={item.id} className="rounded-lg">
            <CardHeader>
              <CardTitle className="text-base">{item.memberName}</CardTitle>
              <p className="text-xs text-muted-foreground">
                {item.currentLevel} menuju {item.targetLevel}
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Progress level</span>
                  <span className="font-mono">{formatPercent(item.progressPercent)}</span>
                </div>
                <Progress value={item.progressPercent} className="mt-2 h-2" />
              </div>
              <div className="grid grid-cols-3 gap-3 rounded-lg border bg-background/70 p-3 text-center">
                <div>
                  <p className="font-mono text-lg font-semibold">
                    {formatPercent(item.attendanceMonth)}
                  </p>
                  <p className="text-[11px] text-muted-foreground">Attendance</p>
                </div>
                <div>
                  <p className="font-mono text-lg font-semibold">
                    {item.masteredSkills}/{item.totalSkills}
                  </p>
                  <p className="text-[11px] text-muted-foreground">Skill</p>
                </div>
                <div>
                  <p className="font-mono text-lg font-semibold">{item.assessmentAverage}</p>
                  <p className="text-[11px] text-muted-foreground">Assessment</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.badges.map((badge) => (
                  <Badge key={badge} variant="outline" className="rounded-md bg-card">
                    <Award className="h-3.5 w-3.5" />
                    {badge}
                  </Badge>
                ))}
              </div>
              <Separator />
              <p className="text-sm leading-6 text-muted-foreground">{item.feedback}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}

