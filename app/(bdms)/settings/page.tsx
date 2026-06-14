import { Bell, Database, ShieldCheck, SlidersHorizontal } from "lucide-react";

import { PageHeader } from "@/components/bdms/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const settingsGroups = [
  {
    title: "User Role",
    icon: ShieldCheck,
    items: ["Super Admin", "Admin Operasional", "Admin Keuangan", "Instruktur", "Member"],
  },
  {
    title: "Master Data",
    icon: Database,
    items: [
      "Level member",
      "Skill matrix",
      "Dance style",
      "Jenis kelas",
      "Paket kelas",
      "Tarif kelas",
      "Kategori transaksi",
      "Template sertifikat",
      "Badge",
    ],
  },
  {
    title: "Revenue Sharing",
    icon: SlidersHorizontal,
    items: [
      "Kelas reguler 80/20",
      "Private class fleksibel",
      "Workshop custom",
      "Guest instructor fixed fee",
    ],
  },
  {
    title: "Notification",
    icon: Bell,
    items: [
      "Pembayaran jatuh tempo",
      "Paket private hampir habis",
      "Jadwal kelas",
      "Event baru",
      "Honor dibayarkan",
      "Follow-up prospek",
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="System Settings"
        title="Pengaturan Sistem"
        description="Konfigurasi role, master data, revenue sharing, notifikasi, template laporan, dan template sertifikat."
      />

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {settingsGroups.map((group) => {
          const Icon = group.icon;
          return (
            <Card key={group.title} className="rounded-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon className="h-4 w-4 text-[hsl(var(--heritage-burgundy))]" />
                  {group.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {group.items.map((item) => (
                  <div key={item}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-muted-foreground">{item}</span>
                      <Badge variant="outline" className="rounded-md bg-background text-[10px]">
                        Aktif
                      </Badge>
                    </div>
                    <Separator className="mt-3" />
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}

