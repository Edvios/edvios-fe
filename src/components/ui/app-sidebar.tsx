"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Users,
  Home,
  FileText,
  LogOut,
  User,
  Search,
  MessageCircle,
  Building2,
  BookOpen,
  LucideUserPlus2,
  Calendar,
  Menu,
  PanelLeftIcon,
} from "lucide-react";
import { motion } from "framer-motion";

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
  const { state, isMobile, setOpenMobile, toggleSidebar } = useSidebar();
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

  return (
    <Sidebar collapsible="icon" className="bg-sidebar">
      <SidebarHeader className="bg-transparent h-20 flex flex-col justify-center px-4">
        <div className={`flex items-center w-full ${isCollapsed ? "justify-center" : "justify-between"}`}>

          {/* Logo - Only show when NOT collapsed */}
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center"
            >
              <Image
                src="/logoWithLetters.png"
                alt="Logo"
                width={160}
                height={50}
                className="object-contain"
                priority
              />
            </motion.div>
          )}

          {/* Trigger Icon - Hamburger when collapsed, PanelLeft when expanded */}
          <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="icon"
            className={`
              text-edvios-green hover:bg-edvios-green/10 
              transition-colors duration-200
              ${isCollapsed ? "mx-auto" : ""}
            `}
          >
            {isCollapsed ? <Menu className="size-6" /> : <PanelLeftIcon className="size-6" />}
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </div>
      </SidebarHeader>

      <div className="px-4">
        <div className="h-[1px] w-full bg-edvios-blue/20" />
      </div>

      <SidebarContent className="mt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className={isCollapsed ? "items-center gap-3" : "gap-1 px-3"}>
              {menuItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title} className="w-full flex justify-center">
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={`
                        relative transition-all duration-200 ease-in-out group/menu-item
                        ${isCollapsed ? "h-12 w-12 justify-center" : "h-11 w-full px-4"}
                        ${isActive
                          ? "bg-edvios-green text-white shadow-md hover:bg-edvios-green hover:text-white"
                          : "text-black hover:bg-edvios-green/10 hover:text-edvios-green"
                        }
                        rounded-xl
                      `}
                    >
                      <Link href={item.url} onClick={handleMobileClose} className="flex items-center">
                        <item.icon
                          className={`${isCollapsed ? "size-6" : "size-5"} shrink-0 ${isActive ? "text-white" : "text-edvios-green"}`}
                          strokeWidth={isActive ? 2.5 : 2}
                        />
                        {!isCollapsed && (
                          <span className={`ml-3 text-sm tracking-wide ${isActive ? "font-semibold" : "font-medium"}`}>
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

      <SidebarFooter className="p-4 bg-transparent">
        <SidebarMenu className={isCollapsed ? "items-center" : ""}>
          <SidebarMenuItem className="w-full flex justify-center">
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Logout"
              className={`
                transition-all duration-200 
                ${isCollapsed ? "h-12 w-12 justify-center rounded-xl" : "h-11 w-full px-4 rounded-xl"}
                text-black hover:text-destructive hover:bg-destructive/10
              `}
            >
              <LogOut className={`shrink-0 ${isCollapsed ? "size-6" : "size-5"} text-edvios-green group-hover:text-destructive`} strokeWidth={2} />
              {!isCollapsed && <span className="ml-3 text-sm font-medium">Logout</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}