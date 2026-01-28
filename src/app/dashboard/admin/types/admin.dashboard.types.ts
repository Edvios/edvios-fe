export interface UserData {
  email: string;
  role: string;
  name: string;
  id: string;
  phone?: string;
  organization?: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeAgents: number;
  pendingAgents: number;
  students: number;
  applications: number;
}