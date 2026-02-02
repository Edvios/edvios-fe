import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { adminAPI } from "@/app/dashboard/admin/api/admin.dashboard.api";
import { UserData, DashboardStats } from "@/app/dashboard/admin/types/admin.dashboard.types";
import AppToast from "@/utils/toast-utils";

export const useAdminDashboard = () => {
  const router = useRouter();
  const supabase = createClient();
  
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeAgents: 0,
    pendingAgents: 0,
    students: 0,
    applications: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  /**
   * Fetch current user session and profile
   */
  const fetchUser = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        router.push('/auth/login');
        return;
      }
      
      const user = session.user;
      setUserData({
        email: user.email || '',
        role: (user.user_metadata?.role || user.app_metadata?.role || 'admin').toLowerCase(),
        name: `${user.user_metadata?.firstName || ''} ${user.user_metadata?.lastName || ''}`.trim() || user.email || 'Admin',
        id: user.id,
        phone: user.user_metadata?.phone || '',
        organization: user.user_metadata?.organization || ''
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      AppToast.error('Failed to fetch user data');
      router.push('/auth/login');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetch all dashboard statistics counts from API
   */
  const fetchDashboardStats = async () => {
    setIsLoadingStats(true);
    try {
      const [
        totalUsers,
        totalAgents,
        pendingAgents,
        students,
        applications,
      ] = await Promise.all([
        adminAPI.getTotalUsersCount(),
        adminAPI.getAgentsCount(),
        adminAPI.getPendingAgentsCount(),
        adminAPI.getStudentsCount(),
        adminAPI.getApplicationsCount(),
      ]);

      const activeAgents = Math.max(totalAgents - pendingAgents, 0);
      console.log({ totalAgents, pendingAgents, activeAgents });

      setStats({
        totalUsers,
        activeAgents,
        pendingAgents,
        students,
        applications,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      AppToast.error('Failed to load dashboard statistics');
    } finally {
      setIsLoadingStats(false);
    }
  };

  /**
   * Handle user logout
   */
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      
      // Clear session storage
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('auth-token');
        sessionStorage.removeItem('user-session');
      }
      
      AppToast.success('Logged out successfully');
      router.push('/auth/login');
      router.refresh();
    } catch (error) {
      console.error('Error logging out:', error);
      AppToast.error('Failed to logout');
    }
  };


  /**
   * Refresh dashboard data
   */
  const refreshDashboard = async () => {
    await Promise.all([
      fetchUser(),
      fetchDashboardStats()
    ]);
  };

  // Initialize dashboard on mount
  useEffect(() => {
    fetchUser();
    fetchDashboardStats();
  }, []);

  return {
    // State
    userData,
    isLoading,
    stats,
    isLoadingStats,
    
    // Methods
    handleLogout,
    refreshDashboard,
  };
};