"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Users, 
  Building, 
  LogOut, 
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Activity,
  Database,
  Settings,
  BarChart3,
} from "lucide-react";
import { UserTypeEnum } from "@/app/auth/login/enums/auth.enum";

interface UserData {
  email: string;
  role: string;
  name: string;
  id: string;
  phone?: string;
  organization?: string;
}

export default function ADMINDashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const userSession = sessionStorage.getItem('user-session');
    if (!userSession) {
      router.push('/auth/login');
      return;
    }
    
    const user = JSON.parse(userSession);
    if (!user.role || user.role !== UserTypeEnum.ADMIN) {
      router.push(`/dashboard/${user.role?.toLowerCase() || 'admin'}`);
      return;
    }
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUserData(user);
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('user-session');
    sessionStorage.removeItem('auth-token');
    router.push('/auth/login');
  };

  if (!userData) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Super Admin Portal</h1>
                <p className="text-sm text-gray-500">System Administrator</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
                <Users className="w-5 h-5 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">2,847</div>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +18.2% this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Active Agents</CardTitle>
                <Building className="w-5 h-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">156</div>
              <p className="text-xs text-gray-500 mt-1">124 active today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Applications</CardTitle>
                <Activity className="w-5 h-5 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">8,942</div>
              <p className="text-xs text-gray-500 mt-1">412 pending review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Revenue</CardTitle>
                <DollarSign className="w-5 h-5 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$284K</div>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +24.5% vs last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* System Health */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Real-time platform monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { service: "API Server", status: "Operational", uptime: "99.98%", statusColor: "bg-green-500" },
                    { service: "Database", status: "Operational", uptime: "99.95%", statusColor: "bg-green-500" },
                    { service: "Email Service", status: "Operational", uptime: "99.89%", statusColor: "bg-green-500" },
                    { service: "File Storage", status: "Degraded", uptime: "98.12%", statusColor: "bg-yellow-500" },
                  ].map((service, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${service.statusColor}`}></div>
                        <div>
                          <p className="font-medium text-gray-900">{service.service}</p>
                          <p className="text-sm text-gray-500">{service.status}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{service.uptime}</p>
                        <p className="text-xs text-gray-500">Uptime</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system events and actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { action: "New AGENT registered", user: "Global Education Ltd.", time: "2 min ago", icon: Building, color: "text-green-600" },
                    { action: "Bulk application import", user: "System", time: "15 min ago", icon: Database, color: "text-blue-600" },
                    { action: "Security alert resolved", user: "Admin", time: "1 hour ago", icon: AlertTriangle, color: "text-orange-600" },
                    { action: "Payment processed", user: "Stripe Gateway", time: "2 hours ago", icon: DollarSign, color: "text-purple-600" },
                  ].map((activity, idx) => (
                    <div key={idx} className="flex items-start space-x-3 p-3 border-l-2 border-gray-200 hover:border-primary hover:bg-gray-50 transition-all">
                      <activity.icon className={`w-5 h-5 mt-0.5 ${activity.color}`} />
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.user} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats & Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
                <CardDescription>Today&apos;s summary</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm text-blue-600">New Users</p>
                    <p className="text-2xl font-bold text-blue-900">47</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm text-green-600">Applications</p>
                    <p className="text-2xl font-bold text-green-900">183</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="text-sm text-purple-600">Revenue</p>
                    <p className="text-2xl font-bold text-purple-900">$9.2K</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Admin Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Users
                </Button>
                <Button className="w-full" variant="outline">
                  <Building className="w-4 h-4 mr-2" />
                  Manage Agents
                </Button>
                <Button className="w-full" variant="outline">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Reports
                </Button>
                <Button className="w-full" variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  System Settings
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-red-900 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="p-2 bg-white rounded border border-red-200">
                    <p className="text-sm font-medium text-red-900">2 Pending Reviews</p>
                    <p className="text-xs text-red-600">Require ADMIN approval</p>
                  </div>
                  <div className="p-2 bg-white rounded border border-orange-200">
                    <p className="text-sm font-medium text-orange-900">Storage at 78%</p>
                    <p className="text-xs text-orange-600">Consider upgrading</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
