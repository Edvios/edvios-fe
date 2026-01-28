"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Pages that should NOT have the sidebar
  const excludedPaths = ['/auth/login', '/student-registration', '/pending-approval'];
  const shouldShowSidebar = !excludedPaths.some(path => pathname.startsWith(path));

  if (!shouldShowSidebar) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1">
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center px-4">
              <SidebarTrigger />
            </div>
          </div>
          <div className="flex-1">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
