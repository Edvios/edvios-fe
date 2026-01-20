"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

interface TopPanelProps {
  title?: string;
}

export const TopPanel: React.FC<TopPanelProps> = ({ title = "Dashboard" }) => {
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem("user-session");
    sessionStorage.removeItem("auth-token");
    router.push("/auth/login");
  };

  return (
    <div className="w-full bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="h-10 w-10 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#e5601b,#f88124)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white" />
            </svg>
          </div>

          <div>
            <div className="text-lg font-semibold text-slate-900">{title}</div>
            <div className="text-xs text-slate-400">Student</div>
          </div>

          <div className="hidden md:flex items-center bg-slate-50 rounded-full px-3 py-1 text-sm text-slate-500 ml-4">
            <svg className="h-4 w-4 mr-2 text-slate-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Search anything...
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button size="sm" className="gap-2 px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-400 text-white hover:from-orange-600 hover:to-orange-500">
            <RefreshCw className="h-4 w-4" />
            Check In
          </Button>

          <Button variant="outline" size="sm" className="gap-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4 text-rose-600" />
            <span className="text-rose-600">Logout</span>
          </Button>

          <div className="flex items-center gap-3 pl-2 border-l border-slate-100">
            <div className="text-sm text-slate-500">malik priyashan</div>
            <div className="h-8 w-8 rounded-full bg-slate-800 text-white flex items-center justify-center">MP</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopPanel;
