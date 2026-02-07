"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Users, 
  User,
  UserPlus,
  GraduationCapIcon,
  Form,
  BookOpen,
  Building,
} from "lucide-react";
import { useAdminDashboard } from "@/app/dashboard/admin/hooks/use-adminDashboard";
import { useApplications } from "@/app/dashboard/agent/hooks/useAgentDashboard";
import { useRouter } from "next/navigation";

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-gradient-50 via-white to-bg-gradient-300">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Portal</h1>
                <p className="text-sm text-gray-500">System Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">System Overview</h2>
          <p className="text-gray-600">Monitor and manage the entire Edvios platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
                <Users className="w-5 h-5 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoadingStats ? (
                  <div className="h-9 w-24 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  stats.totalUsers.toLocaleString()
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Active Agents</CardTitle>
                <User className="w-5 h-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoadingStats ? (
                  <div className="h-9 w-24 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  stats.activeAgents.toLocaleString()
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Pending Agents</CardTitle>
                <UserPlus className="w-5 h-5 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoadingStats ? (
                  <div className="h-9 w-24 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  stats.pendingAgents.toLocaleString()
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Students</CardTitle>
                <GraduationCapIcon className="w-5 h-5 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoadingStats ? (
                  <div className="h-9 w-24 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  stats.students.toLocaleString()
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Pending Applications</CardTitle>
                <Form className="w-5 h-5 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoadingStats ? (
                  <div className="h-9 w-24 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  stats.applications.toLocaleString()
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Applications */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>Latest client interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.slice(0, 5).map((client, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient rounded-full flex items-center justify-center text-white font-semibold">
                          {client.student.firstName?.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{client.student.firstName}</p>
                          <p className="text-sm text-gray-500">{client.student.email}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        client.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                        client.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        client.status === 'UNDER_REVIEW' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {client.status}
                      </span>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline" onClick={() => router.push('/applications')}>
                  View All Applications
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline" onClick={() => router.push('/applications')}>
                  <Users className="w-4 h-4 mr-2" />
                  Review Applications
                </Button>
                <Button className="w-full" variant="outline" onClick={() => router.push('/agent-management')}>
                  <Users className="w-4 h-4 mr-2" />
                  Manage Agents
                </Button>
                <Button className="w-full" variant="outline" onClick={() => router.push('/institution-management')}>
                  <Building className="w-4 h-4 mr-2" />
                  Institutions
                </Button>
                <Button className="w-full" variant="outline" onClick={() => router.push('/program-management')}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Programs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}