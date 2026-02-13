"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  Home,
  FileText,
  LogOut,
  User,
  Search,
  MessageCircle,
  HelpingHandIcon,
  Building2,
  BookOpen,
  LucideUserPlus2,
  Calendar,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { logout } from "@/app/auth/login/api/auth.api";
import axiosInstance from "@/lib/axios";

interface UserData {
  email: string;
  role: string;
  name: string;
  id: string;
}

const studentItems = [
  {
    title: "Dashboard",
    url: "/dashboard/student",
    icon: Home,
  },
  {
    title: "Program Finder",
    url: "/program-finder",
    icon: Search,
  },
  {
    title: "Communication Hub",
    url: "/chat",
    icon: MessageCircle,
  },
  {
    title: "Session Booking",
    url: "/session-booking",
    icon: Calendar,
  },
  {
    title: "Profile",
    url: "/profiles/student-profile",
    icon: User,
  },
];

const agentItems = [
  {
    title: "Dashboard",
    url: "/dashboard/agent",
    icon: Home,
  },
  {
    title: "Students",
    url: "/student-management",
    icon: Users,
  },
  {
    title: "Applications",
    url: "/applications",
    icon: FileText,
  },
  {
    title: "Institutions",
    url: "/institution-management",
    icon: Building2,
  },
  {
    title: "Programs",
    url: "/program-management",
    icon: BookOpen,
  },
  {
    title: "Chat",
    url: "/chat",
    icon: MessageCircle,
  },

  {
    title: "Profile",
    url: "/profiles/agent-profile",
    icon: User,
  },
];

const adminItems = [
  { title: "Dashboard", url: "/dashboard/admin", icon: Home },
  { title: "Students", url: "/student-management", icon: Users },
  { title: "Agents", url: "/agent-management", icon: User },
  { title: "Applications", url: "/applications", icon: FileText },
  { title: "Institutions", url: "/institution-management", icon: Building2 },
  { title: "Programs", url: "/program-management", icon: BookOpen },
  { title: "Assignments", url: "/agent-assignment", icon: LucideUserPlus2 },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { state, isMobile, setOpenMobile } = useSidebar();
  const [userData, setUserData] = useState<UserData | null>(null);

  const isCollapsed = state === "collapsed";

  const handleMobileClose = () => {
    if (isMobile) setOpenMobile(false);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const loadUserData = async () => {
      try {
        const userSession = sessionStorage.getItem("user-session");
        if (userSession) {
          setUserData(JSON.parse(userSession));
        } else {
          const response = await axiosInstance.get("/auth/me");
          setUserData(response.data);
          sessionStorage.setItem("user-session", JSON.stringify(response.data));
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };
    loadUserData();
  }, []);

  const handleLogout = async () => {
    handleMobileClose();
    try {
      await logout();
    } finally {
      sessionStorage.removeItem("user-session");
      sessionStorage.removeItem("auth-token");
      router.push("/auth/login");
    }
  };

  const menuItems = useMemo(() => {
    switch (userData?.role) {
      case "STUDENT":
        return studentItems;
      case "AGENT":
        return agentItems;
      case "ADMIN":
        return adminItems;
      case "SELECTED_AGENT":
        return agentItems;
      default:
        return [];
    }
  }, [userData?.role]);

  const roleLabel = useMemo(() => {
    switch (userData?.role) {
      case "STUDENT":
        return "Student Portal";
      case "AGENT":
        return "Agent Portal";
      case "ADMIN":
        return "Admin Portal";
      case "SELECTED_AGENT":
        return "Agent Portal";
      default:
        return "Portal";
    }
  }, [userData?.role]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex flex-col p-0">
        {/* Centered Trigger Container */}
        <div className={`flex items-center pt-4 ${isCollapsed ? "justify-center" : "justify-end px-4"}`}>
          <SidebarTrigger className="opacity-70 hover:opacity-100 transition-opacity scale-110" />
        </div>

        {/* Logo area */}
        <div className="mt-2 flex items-center justify-center min-h-[50px]">
          {isCollapsed && !isMobile ? (
            <Image src="/logo.png" alt="Logo" width={36} height={36} className="object-contain" />
          ) : (
            <Image src="/logoWithLetters.png" alt="Logo" width={140} height={40} className="object-contain" />
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="mt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            {/* Tightened vertical gap between items */}
            <SidebarMenu className={isCollapsed ? "items-center gap-3" : "gap-1 px-3"}>
              {menuItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title} className="w-full flex justify-center">
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={`
                        relative transition-all duration-300 ease-in-out
                        ${isCollapsed ? "h-14 w-14 justify-center" : "h-11 w-full px-4"}
                        ${isActive 
                          ? "sidebar-item-active text-white rounded-xl shadow-lg hover:text-white" 
                          : "text-muted-foreground hover:bg-accent/50 rounded-lg"
                        }
                      `}
                    >
                      <Link href={item.url} onClick={handleMobileClose} className="flex items-center">
                        <item.icon 
                          className={`${isCollapsed ? "size-10" : "size-6"} shrink-0`} 
                          strokeWidth={isActive ? 2.5 : 2} 
                        />
                        {!isCollapsed && (
                          <span className={`ml-3 text-sm tracking-wide ${isActive ? "font-bold" : "font-medium"}`}>
                            {item.title}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 bg-transparent border-none">
        <SidebarMenu className={isCollapsed ? "items-center" : ""}>
          <SidebarMenuItem className="w-full flex justify-center">
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Logout"
              className={`
                transition-all duration-200 text-muted-foreground hover:text-destructive hover:bg-destructive/5
                ${isCollapsed ? "h-14 w-14 justify-center rounded-xl" : "h-11 w-full px-4 rounded-lg"}
              `}
            >
              <LogOut className={isCollapsed ? "size-10" : "size-7"} strokeWidth={2} />
              {!isCollapsed && <span className="ml-3 text-sm font-medium">Logout</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}