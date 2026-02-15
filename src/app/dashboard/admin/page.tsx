"use client";

import { Button } from "@/components/ui/button";
import {
  Users,
  User,
  UserPlus,
  GraduationCapIcon,
  Form,
  BookOpen,
  Building,
  MessageSquare,
} from "lucide-react";
import { useAdminDashboard } from "@/app/dashboard/admin/hooks/use-adminDashboard";
import { useApplications } from "@/app/dashboard/agent/hooks/useAgentDashboard";
import { useRouter } from "next/navigation";
import { LogoLoading } from "@/components/ui/logo-loading";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { StatsCard } from "@/components/shared/stats-card";

export default function ADMINDashboard() {
  const router = useRouter();
  const {
    userData,
    isLoading,
    stats,
    isLoadingStats,
  } = useAdminDashboard();

  const { applications } = useApplications();

  if (isLoading || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LogoLoading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: "Admin Dashboard", active: true }]} />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatsCard
            label="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon={Users}
            valueColor="text-blue-600"
            loading={isLoadingStats}
          />
          <StatsCard
            label="Active Agents"
            value={stats.activeAgents.toLocaleString()}
            icon={User}
            valueColor="text-green-600"
            loading={isLoadingStats}
          />
          <StatsCard
            label="Pending Agents"
            value={stats.pendingAgents.toLocaleString()}
            icon={UserPlus}
            valueColor="text-yellow-600"
            loading={isLoadingStats}
          />
          <StatsCard
            label="Students"
            value={stats.students.toLocaleString()}
            icon={GraduationCapIcon}
            valueColor="text-purple-600"
            loading={isLoadingStats}
          />
          <StatsCard
            label="Pending Applications"
            value={stats.applications.toLocaleString()}
            icon={Form}
            valueColor="text-orange-600"
            loading={isLoadingStats}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Applications */}
          {/* Recent Applications */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Recent Applications</h3>
              <Button variant="ghost" size="sm" onClick={() => router.push('/applications')} className="text-edvios-green hover:text-edvios-green/80 hover:bg-edvios-green/5">
                View All
              </Button>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-50">
                {applications.slice(0, 5).map((client, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                        {client.student.firstName?.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{client.student.firstName}</p>
                        <p className="text-xs text-gray-500">{client.student.email}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${client.status === 'ACCEPTED' ? 'bg-green-50 text-green-700 border-green-100' :
                      client.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-100' :
                        client.status === 'UNDER_REVIEW' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                          'bg-yellow-50 text-yellow-700 border-yellow-100'
                      }`}>
                      {client.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
                {applications.length === 0 && (
                  <div className="p-8 text-center text-gray-400 text-sm">No recent applications</div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="ghost"
                  className="h-auto py-4 flex flex-col gap-2 bg-gray-50 hover:bg-edvios-green hover:text-white border border-transparent hover:border-edvios-green/20 transition-all group"
                  onClick={() => router.push('/applications')}
                >
                  <div className="p-2 bg-white rounded-full text-gray-600 group-hover:text-edvios-green shadow-sm">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold">Review Apps</span>
                </Button>

                <Button
                  variant="ghost"
                  className="h-auto py-4 flex flex-col gap-2 bg-gray-50 hover:bg-edvios-green hover:text-white border border-transparent hover:border-edvios-green/20 transition-all group"
                  onClick={() => router.push('/agent-management')}
                >
                  <div className="p-2 bg-white rounded-full text-gray-600 group-hover:text-edvios-green shadow-sm">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold">Agents</span>
                </Button>

                <Button
                  variant="ghost"
                  className="h-auto py-4 flex flex-col gap-2 bg-gray-50 hover:bg-edvios-green hover:text-white border border-transparent hover:border-edvios-green/20 transition-all group"
                  onClick={() => router.push('/institution-management')}
                >
                  <div className="p-2 bg-white rounded-full text-gray-600 group-hover:text-edvios-green shadow-sm">
                    <Building className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold">Institutes</span>
                </Button>

                <Button
                  variant="ghost"
                  className="h-auto py-4 flex flex-col gap-2 bg-gray-50 hover:bg-edvios-green hover:text-white border border-transparent hover:border-edvios-green/20 transition-all group"
                  onClick={() => router.push('/program-management')}
                >
                  <div className="p-2 bg-white rounded-full text-gray-600 group-hover:text-edvios-green shadow-sm">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold">Programs</span>
                </Button>

                <Button
                  variant="ghost"
                  className="col-span-2 h-auto py-3 flex flex-row items-center justify-center gap-2 bg-gray-900 text-white hover:bg-gray-800 transition-all shadow-sm"
                  onClick={() => router.push('/notifications/admin')}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Send Notification</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
