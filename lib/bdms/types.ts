export type MemberStatus =
  | "Aktif"
  | "Tidak aktif"
  | "Trial"
  | "Cuti"
  | "Alumni"
  | "Blacklist";

export type PaymentStatus =
  | "Draft"
  | "Pending"
  | "Verified"
  | "Paid"
  | "Overdue"
  | "Cancelled";

export type HonorStatus =
  | "Draft"
  | "Waiting Approval"
  | "Approved"
  | "Paid"
  | "Cancelled";

export type EventStatus =
  | "Draft"
  | "Open Registration"
  | "Closed"
  | "Completed"
  | "Cancelled";

export type AttendanceStatus = "Hadir" | "Izin" | "Sakit" | "Alpha" | "Make-up class";

export type LeadStatus =
  | "New lead"
  | "Contacted"
  | "Trial scheduled"
  | "Trial completed"
  | "Interested"
  | "Converted to member"
  | "Not interested"
  | "Follow up later";

export type Member = {
  id: string;
  memberCode: string;
  fullName: string;
  phone: string;
  email: string;
  joinedAt: string;
  status: MemberStatus;
  membershipType: string;
  currentLevel: string;
  classesTaken: number;
  attendanceRate: number;
  notes?: string;
};

export type Instructor = {
  id: string;
  instructorCode: string;
  fullName: string;
  phone: string;
  email: string;
  status: string;
  level: string;
  specialties: string[];
  sessionsThisMonth: number;
  honorDue: number;
  achievementsCount: number;
  bio: string;
};

export type DanceClass = {
  id: string;
  classCode: string;
  name: string;
  type: string;
  level: string;
  danceStyle: string;
  instructorName: string;
  assistantName?: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  capacity: number;
  enrolled: number;
  price: number;
  status: string;
  revenueMonth: number;
  attendanceRate: number;
};

export type AttendanceRecord = {
  id: string;
  date: string;
  className: string;
  memberName: string;
  instructorName: string;
  status: AttendanceStatus;
  checkInTime: string;
  method: string;
  notes?: string;
};

export type Payment = {
  id: string;
  invoiceNo: string;
  payerName: string;
  category: string;
  amount: number;
  status: PaymentStatus;
  dueDate: string;
  paidAt?: string;
  instructorShare: number;
  communityShare: number;
};

export type CashTransaction = {
  id: string;
  date: string;
  type: "Cash in" | "Cash out";
  category: string;
  description: string;
  amount: number;
};

export type HonorRecord = {
  id: string;
  instructorName: string;
  period: string;
  classCount: number;
  sessionCount: number;
  attendeeCount: number;
  grossRevenue: number;
  instructorShare: number;
  deductions: number;
  bonus: number;
  totalHonor: number;
  status: HonorStatus;
};

export type CommunityEvent = {
  id: string;
  eventCode: string;
  name: string;
  type: string;
  date: string;
  time: string;
  location: string;
  quota: number;
  registered: number;
  ticketPrice: number;
  status: EventStatus;
  revenue: number;
  expenses: number;
};

export type Lead = {
  id: string;
  fullName: string;
  whatsapp: string;
  source: string;
  interestClass: string;
  firstContactAt: string;
  status: LeadStatus;
  notes: string;
};

export type MemberProgress = {
  id: string;
  memberName: string;
  currentLevel: string;
  targetLevel: string;
  progressPercent: number;
  attendanceMonth: number;
  masteredSkills: number;
  totalSkills: number;
  assessmentAverage: number;
  badges: string[];
  feedback: string;
};

export type DashboardData = {
  summary: {
    totalMembers: number;
    activeMembers: number;
    inactiveMembers: number;
    newMembersThisMonth: number;
    activeClasses: number;
    privateSessionsThisMonth: number;
    upcomingEvents: number;
    attendanceRate: number;
  };
  finance: {
    incomeThisMonth: number;
    instructorShareThisMonth: number;
    communityShareThisMonth: number;
    expensesThisMonth: number;
    cashBalance: number;
  };
  highlights: {
    mostActiveClass: string;
    mostActiveInstructor: string;
    pendingPayments: number;
    pendingHonor: number;
  };
  monthlyCashFlow: Array<{
    month: string;
    income: number;
    expenses: number;
    communityCash: number;
  }>;
  classPerformance: Array<{
    name: string;
    attendanceRate: number;
    revenue: number;
  }>;
};

