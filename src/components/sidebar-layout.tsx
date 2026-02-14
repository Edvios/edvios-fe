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
  const excludedPaths = ['/student-registration', '/pending-approval', '/agent-registration'];

  const isAuthPage = pathname.startsWith('/auth/');
  const isExcluded = excludedPaths.some(path => pathname.startsWith(path));
  const shouldShowSidebar = !isAuthPage && !isExcluded;
  const hideMobileTriggerPaths = ["/chat"];
  const shouldShowMobileTrigger =
    shouldShowSidebar && !hideMobileTriggerPaths.some((path) => pathname.startsWith(path));

  if (!shouldShowSidebar) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1">
          {shouldShowMobileTrigger && (
            <div className="md:hidden sticky top-0 z-20 bg-background/95 backdrop-blur border-b px-3 py-2">
              <SidebarTrigger />
            </div>
          )}
          <div className="flex-1">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
