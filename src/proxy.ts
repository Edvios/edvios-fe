import { updateSession } from "@/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const pathname = request.nextUrl.pathname;
  const isAuthPage = pathname.startsWith("/auth/login");
  const isDashboardPage = pathname.startsWith("/dashboard");

  // If user is not authenticated and trying to access protected routes
  if (!user && isDashboardPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // If user is authenticated and trying to access login page, redirect to their role-specific dashboard
  if (user && isAuthPage) {
    const userRole = user.user_metadata?.role || user.app_metadata?.role;
    
    const roleRoutes: Record<string, string> = {
      'STUDENT': '/dashboard/student',
      'AGENT': '/dashboard/agent',
      'ADMIN': '/dashboard/admin'
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
      'ADMIN': '/dashboard/admin'
    };

    if (userRole) {
      const allowedRoute = roleRoutes[userRole.toUpperCase()];
      
      // Check if user is trying to access a different role's dashboard
      if (allowedRoute && !pathname.startsWith(allowedRoute)) {
        console.log('Redirecting to allowed route:', allowedRoute);
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
