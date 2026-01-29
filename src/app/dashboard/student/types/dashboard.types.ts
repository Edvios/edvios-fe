// Structural types for the Student Dashboard
// These mirror the simple, interface-based style used in `profile.types.ts`

export interface StatCard {
  key: string;
  label?: string;
  value?: number | string;
  accent?: string;
  direction?: "up" | "down";
  change?: string;
  changeLabel?: string;
}

export interface Application {
  id?: string;
  programId?: string;
  school?: string;
  program?: string;
  status?: string;
  stage?: string;
  date?: string;
  nextStep?: string;
}

export interface Interview {
  id?: string;
  school?: string;
  contact?: string;
  date?: string;
  timezone?: string;
  time?: string;
  status?: string;
}

export interface DocumentItem {
  id?: string;
  title?: string;
  status?: string;
  updatedAt?: string;
}


export interface EnrolledProgram {
  id?: string;
  school?: string;
  program?: string;
  term?: string;
  startDate?: string;
}
// API aliases (kept for compatibility with different backend shapes)
export interface EnrolledProgram {
  title?: string;
  university?: string;
  startedAt?: string;
  status?: string;
  raw?: unknown;
}

export interface ApplicationsCount {
  count: { [status: string]: number };
}

export interface StudentDashboardStats {
  totalPrograms: number;
  enrolledPrograms: number;
  applicationCount: number;
  acceptedCount: number;
  enrolledCount: number;
  unreadNotifications?: number;
  gpa?: number | null;
}

export interface RecentActivity {
  id: string;
  type: string;
  message: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface UserData {
  email: string;
  userType: string;
  firstName: string;
  lastName: string;
  id: string;
  phone?: string;
  role: string;
}
