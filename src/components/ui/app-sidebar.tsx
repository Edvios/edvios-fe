"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
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
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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

// Student menu items
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
    title: "Counselling",
    url: "#",
    icon: HelpingHandIcon,
  },
  {
    title: "Profile",
    url: "/profile",
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
  }

];

// Admin menu items
const adminItems = [
  {
    title: "Dashboard",
    url: "/dashboard/admin",
    icon: Home,
  },
  {
    title: "Students",
    url: "/student-management",
    icon: Users,
  },
  {
    title: "Agents",
    url: "/agent-management",
    icon: User,
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
    title: "Assignments",
    url: "/agent-assignment",
    icon: LucideUserPlus2,
  },
];

export function AppSidebar() {
  const router = useRouter();
  const { state, isMobile, setOpenMobile } = useSidebar();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
          setIsLoading(false);
        } else {
          const response = await axiosInstance.get("/auth/me");
          setUserData(response.data);
          sessionStorage.setItem("user-session", JSON.stringify(response.data));
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = async () => {
    handleMobileClose();
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      sessionStorage.removeItem("user-session");
      sessionStorage.removeItem("auth-token");
      cookieStore.delete("sb-jlqamlxzkfmpfisjlzrg-auth-token");
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
      <SidebarContent>
        {/* Sidebar Top */}
        <SidebarHeader className="flex items-center gap-2 px-2 py-2">
          <SidebarTrigger className="shrink-0" />
          <div className="flex-1">
            <div
              className={
                isMobile
                  ? "hidden"
                  : state === "collapsed"
                  ? "block"
                  : "hidden"
              }
            >
              <Image src="/logo.png" alt="Logo" width={28} height={28} />
            </div>
            <div
              className={
                isMobile
                  ? "block"
                  : state === "collapsed"
                  ? "hidden"
                  : "block"
              }
            >
              <Image
                src="/logo.png"
                alt="Logo"
                width={isMobile ? 160 : 110}
                height={isMobile ? 56 : 40}
              />
            </div>
          </div>
        </SidebarHeader>

        {/* Main Menu */}
        <SidebarGroup>
          <SidebarGroupLabel>{roleLabel}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url} onClick={handleMobileClose}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with Logout */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
