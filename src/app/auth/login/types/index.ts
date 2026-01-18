import { LucideIcon } from "lucide-react";

export interface LoginFormData {
  email: string;
  password: string;
  userType: string;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: string;
  phone: string;
  organization: string;
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
  userType: string;
  name: string;
  id: string;
  phone?: string;
  organization?: string;
  loginTime?: string;
  registrationTime?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: UserData;
  token?: string;
}
