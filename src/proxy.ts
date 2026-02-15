import { updateSession } from "@/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const pathname = request.nextUrl.pathname;
  const isAuthPage = pathname.startsWith("/auth/login");
  const isDashboardPage = pathname.startsWith("/dashboard");
  const isStudentRegistrationPage = pathname.startsWith("/student-registration");
  const isAgentRegistrationPage = pathname.startsWith("/agent-registration");
  // const isPendingApprovalPage = pathname.startsWith("/pending-approval");
  const isManagementPage =
    pathname.startsWith("/agent-management") ||
    pathname.startsWith("/institution-management") ||
    pathname.startsWith("/program-management") ||
    pathname.startsWith("/student-management");

  // If user is not authenticated and trying to access protected routes
  if (!user && (isDashboardPage || isStudentRegistrationPage || isAgentRegistrationPage)) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // If user is pending agent, block all pages except pending approval
  // if (user) {
  //   const userRole = user.user_metadata?.role || user.app_metadata?.role;
  //   const normalizedRole = typeof userRole === "string" ? userRole.toUpperCase() : undefined;

  //   if (normalizedRole === "PENDING_AGENT" && !isPendingApprovalPage) {
  //     const url = request.nextUrl.clone();
  //     url.pathname = "/pending-approval";
  //     return NextResponse.redirect(url);
  //   }
  // }

  // Management pages access control - only ADMIN and AGENT roles allowed
  if (user && isManagementPage) {
    const userRole = user.user_metadata?.role || user.app_metadata?.role;
    const normalizedRole = typeof userRole === "string" ? userRole.toUpperCase() : undefined;

    // Block STUDENT and PENDING_AGENT from management pages
    if (normalizedRole === "STUDENT" || normalizedRole === "PENDING_AGENT") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard/student";
      return NextResponse.redirect(url);
    }

    // Block AGENT from agent-management page (only ADMIN allowed)
    if (pathname.startsWith("/agent-management") && normalizedRole === "AGENT") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard/agent";
      return NextResponse.redirect(url);
    }

    // Allow only ADMIN and AGENT roles for other management pages
    if (normalizedRole !== "ADMIN" && normalizedRole !== "AGENT") {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
  }

  // If user is authenticated and trying to access login page, redirect to their role-specific dashboard
  if (user && isAuthPage) {
    const userRole = user.user_metadata?.role || user.app_metadata?.role;

    const roleRoutes: Record<string, string> = {
      'STUDENT': '/dashboard/student',
      'AGENT': '/dashboard/agent',
      'ADMIN': '/dashboard/admin',
      'PARTIAL_REGISTER_STUDENT': '/student-registration',
      'PARTIAL_REGISTER_AGENT': '/agent-registration'
    };

    if (userRole) {
      const allowedRoute = roleRoutes[userRole.toUpperCase()];
      if (allowedRoute) {
        const url = request.nextUrl.clone();
        url.pathname = allowedRoute;
        return NextResponse.redirect(url);
      }
    }

    // If no role found, stay on login page to prevent redirect loop
    return supabaseResponse;
  }

  // Role-based dashboard access control
  if (user && isDashboardPage) {
    // Extract role from user metadata or app_metadata
    const userRole = user.user_metadata?.role || user.app_metadata?.role;

    // Define allowed routes per role
    const roleRoutes: Record<string, string> = {
      'STUDENT': '/dashboard/student',
      'AGENT': '/dashboard/agent',
      'ADMIN': '/dashboard/admin',
      'SELECTED_AGENT': '/dashboard/agent',
      'PARTIAL_REGISTER_STUDENT': '/student-registration',
      'PARTIAL_REGISTER_AGENT': '/agent-registration'
    };

    if (userRole) {
      const allowedRoute = roleRoutes[userRole.toUpperCase()];

      // Check if user is trying to access a different role's dashboard
      if (allowedRoute && !pathname.startsWith(allowedRoute)) {

        const url = request.nextUrl.clone();
        url.pathname = allowedRoute;
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
