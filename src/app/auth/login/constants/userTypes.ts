import { UserType } from "../types";
import { GraduationCap, Users, Shield } from "lucide-react";
import { UserTypeEnum } from "../enums/auth.enum";

export const USER_TYPES: UserType[] = [
  {
    id: UserTypeEnum.STUDENT,
    name: "Student",
    icon: GraduationCap,
    description: "Access student portal, applications, and academic resources",
    color: "bg-blue-500"
  },
  {
    id: UserTypeEnum.AGENT,
    name: "Agent",
    icon: Users,
    description: "Manage leads, clients, and educational consultancy services",
    color: "bg-green-500"
  },
  {
    id: UserTypeEnum.SUPERADMIN,
    name: "Super Administrator",
    icon: Shield,
    description: "Full system access and administrative controls",
    color: "bg-red-500"
  }
];
