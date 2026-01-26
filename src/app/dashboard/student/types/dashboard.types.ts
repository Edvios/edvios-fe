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

export interface UserData {
  email: string;
  userType: string;
  firstName: string;
  lastName: string;
  id: string;
  phone?: string;
  role: string;
}
