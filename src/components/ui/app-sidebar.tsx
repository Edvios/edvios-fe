"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Users,
  Shield,
  Home,
  FileText,
  Settings,
  LogOut,
  Building,
  BarChart3,
  User,
  Search,
  MessageCircle,
  HelpingHandIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

interface UserData {
  email: string;
  userType: string;
  name: string;
  id: string;
}

// Student menu items
const studentItems = [
  {
    title: "Dashboard",
    url: "/dashboard/student",
    icon: Home,
  },
  {
    title: "Program Finder",
    url: "/program",
    icon: Search,
  },
  {
    title: "Communication Hub",
    url: "#",
    icon: MessageCircle,
  },
  {
    title: "Counselling",
    url: "#",
    icon: HelpingHandIcon,
  },
  {
    title: "Profile",
    url: "#",
    icon: User,
  },
];

// Agent menu items
const agentItems = [
  {
    title: "Dashboard",
    url: "/dashboard/agent",
    icon: Home,
  },
  {
    title: "Clients",
    url: "/dashboard/agent/clients",
    icon: Users,
  },
  {
    title: "Applications",
    url: "/dashboard/agent/applications",
    icon: FileText,
  },
  {
    title: "Commissions",
    url: "/dashboard/agent/commissions",
    icon: BarChart3,
  },
  {
    title: "Agency",
    url: "/dashboard/agent/agency",
    icon: Building,
  },
];

// Super Admin menu items
const superAdminItems = [
  {
    title: "Dashboard",
    url: "/dashboard/super-admin",
    icon: Home,
  },
  {
    title: "Users",
    url: "/dashboard/super-admin/users",
    icon: Users,
  },
  {
    title: "Agents",
    url: "/dashboard/super-admin/agents",
    icon: Building,
  },
  {
    title: "Analytics",
    url: "/dashboard/super-admin/analytics",
    icon: BarChart3,
  },
  {
    title: "System Settings",
    url: "/dashboard/super-admin/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const router = useRouter();
  const [userData] = useState<UserData | null>(() => {
    if (typeof window === "undefined") return null;
    const userSession = sessionStorage.getItem("user-session");
    return userSession ? JSON.parse(userSession) : null;
  });

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("user-session");
      sessionStorage.removeItem("auth-token");
    }
    router.push("/auth/login");
  };

  const menuItems = useMemo(() => {
    switch (userData?.userType) {
      case "student":
        return studentItems;
      case "agent":
        return agentItems;
      case "super-admin":
        return superAdminItems;
      default:
        return [];
    }
  }, [userData?.userType]);

  const userTypeLabel = useMemo(() => {
    switch (userData?.userType) {
      case "student":
        return "Student Portal";
      case "agent":
        return "Agent Portal";
      case "super-admin":
        return "Admin Portal";
      default:
        return "Portal";
    }
  }, [userData?.userType]);

  const renderUserIcon = () => {
    switch (userData?.userType) {
      case "student":
        return <GraduationCap className="w-5 h-5 text-white" />;
      case "agent":
        return <Users className="w-5 h-5 text-white" />;
      case "super-admin":
        return <Shield className="w-5 h-5 text-white" />;
      default:
        return <User className="w-5 h-5 text-white" />;
    }
  };

  return (
    <Sidebar>
      <SidebarContent>
        {/* User Info Section */}
        <SidebarGroup>
          <div className="flex items-center gap-3 px-4 py-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-orange-gradient">
              {renderUserIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-md font-semibold truncate text-orange-gradient">
                Edvios
              </p>
              <p className="text-xs text-muted-foreground truncate">
                Educational Visionaries
              </p>
            </div>
          </div>
        </SidebarGroup>

        {/* Main Menu */}
        <SidebarGroup>
          <SidebarGroupLabel>{userTypeLabel}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard/settings">
                    <Settings />
                    <span>Settings</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with Logout */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}