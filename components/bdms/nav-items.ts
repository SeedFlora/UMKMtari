import {
  BarChart3,
  CalendarDays,
  ContactRound,
  CreditCard,
  FileBarChart,
  GraduationCap,
  Landmark,
  LayoutDashboard,
  Medal,
  Settings,
  Sparkles,
  UserRoundCog,
  UsersRound,
} from "lucide-react";

export const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/members", label: "Members", icon: UsersRound },
  { href: "/classes", label: "Classes", icon: CalendarDays },
  { href: "/attendance", label: "Attendance", icon: ContactRound },
  { href: "/instructors", label: "Instructors", icon: UserRoundCog },
  { href: "/finance", label: "Finance", icon: Landmark },
  { href: "/honor", label: "Honor", icon: CreditCard },
  { href: "/events", label: "Events", icon: Sparkles },
  { href: "/progress", label: "Progress", icon: GraduationCap },
  { href: "/crm", label: "CRM", icon: Medal },
  { href: "/reports", label: "Reports", icon: FileBarChart },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export const secondaryNavItems = [
  { label: "Financial Transparency", value: "80% / 20%", icon: BarChart3 },
  { label: "Digital Dance Passport", value: "Phase 3", icon: Medal },
  { label: "Instructor Portfolio", value: "Verified", icon: UserRoundCog },
] as const;

