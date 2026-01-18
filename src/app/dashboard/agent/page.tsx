"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  FileText, 
  TrendingUp, 
  LogOut, 
  DollarSign,
  CheckCircle,
  Building,
  Mail,
  Phone
} from "lucide-react";

interface UserData {
  email: string;
  userType: string;
  name: string;
  id: string;
  phone?: string;
  organization?: string;
}

export default function AgentDashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const userSession = sessionStorage.getItem('user-session');
    if (!userSession) {
      router.push('/auth/login');
      return;
    }
    
    const user = JSON.parse(userSession);
    if (user.userType !== 'agent') {
      router.push(`/dashboard/${user.userType}`);
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Agent Portal</h1>
                <p className="text-sm text-gray-500">Welcome, {userData.name}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Agent Dashboard</h2>
          <p className="text-gray-600">Manage your clients and track commissions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Active Clients</CardTitle>
                <Users className="w-5 h-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">24</div>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Applications</CardTitle>
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">156</div>
              <p className="text-xs text-gray-500 mt-1">32 pending approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Success Rate</CardTitle>
                <CheckCircle className="w-5 h-5 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">78%</div>
              <p className="text-xs text-gray-500 mt-1">Applications accepted</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Commission</CardTitle>
                <DollarSign className="w-5 h-5 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$12,400</div>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Clients */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Clients</CardTitle>
                <CardDescription>Your latest client interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "John Smith", email: "john.smith@email.com", status: "Active", applications: 3, statusColor: "text-green-600 bg-green-50" },
                    { name: "Sarah Johnson", email: "sarah.j@email.com", status: "Pending Docs", applications: 2, statusColor: "text-orange-600 bg-orange-50" },
                    { name: "Michael Chen", email: "m.chen@email.com", status: "Active", applications: 5, statusColor: "text-green-600 bg-green-50" },
                    { name: "Emily Davis", email: "emily.d@email.com", status: "In Review", applications: 4, statusColor: "text-blue-600 bg-blue-50" },
                  ].map((client, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {client.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{client.name}</p>
                          <p className="text-sm text-gray-500">{client.email}</p>
                          <p className="text-xs text-gray-400 mt-1">{client.applications} applications</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${client.statusColor}`}>
                        {client.status}
                      </span>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  View All Clients
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Tasks & Quick Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Pending Tasks</CardTitle>
                <CardDescription>Items requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: "Review Documents", client: "Sarah Johnson", priority: "High", icon: FileText, color: "text-red-600" },
                    { title: "Follow-up Call", client: "John Smith", priority: "Medium", icon: Phone, color: "text-orange-600" },
                    { title: "Send Confirmation", client: "Emily Davis", priority: "Low", icon: Mail, color: "text-blue-600" },
                  ].map((task, idx) => (
                    <div key={idx} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <task.icon className={`w-5 h-5 mt-0.5 ${task.color}`} />
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">{task.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{task.client}</p>
                        <span className="text-xs text-gray-400">Priority: {task.priority}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Add New Client
                </Button>
                <Button className="w-full" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Submit Application
                </Button>
                <Button className="w-full" variant="outline">
                  <DollarSign className="w-4 h-4 mr-2" />
                  View Commissions
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-900">Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-700">This Month</span>
                    <span className="font-bold text-green-900">$12,400</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-700">YTD</span>
                    <span className="font-bold text-green-900">$48,200</span>
                  </div>
                  <div className="pt-2 border-t border-green-200">
                    <p className="text-xs text-green-600">You are 25% ahead of your target!</p>
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
