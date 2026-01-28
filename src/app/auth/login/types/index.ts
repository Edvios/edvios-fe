import { LucideIcon } from "lucide-react";

export interface LoginFormData {
  email: string;
  password: string;
  role: "STUDENT" | "AGENT" | "ADMIN" | "PENDING_AGENT";
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "STUDENT" | "AGENT" | "ADMIN" | "PENDING_AGENT";
  phone: string;
}

export interface UserType {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  color: string;
}

export interface UserData {
  email: string;
  role: "STUDENT" | "AGENT" | "ADMIN" | "PENDING_AGENT";
  name: string;
  id: string;
  phone?: string;
  loginTime?: string;
  registrationTime?: string;
}

