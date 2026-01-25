"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/auth/login/api/auth.api";

import { 
  BookOpen, 
  FileText, 
  GraduationCap, 
  LogOut, 
  User, 
  Calendar,
  CheckCircle,
  AlertCircle,
  MessageCircle
} from "lucide-react";

interface UserData {
  email: string;
  userType: string;
  name: string;
  id: string;
  phone?: string;
  organization?: string;
}

export default function StudentDashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const userSession = sessionStorage.getItem('user-session');
    const user = JSON.parse(userSession!);
    if (!userSession) {
      router.push('/auth/login');
      return;
    }
    
    if (user.role !== 'STUDENT') {
      router.push(`/dashboard/${user.role.toLowerCase()}`);
      return;
    }
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUserData(user);
  }, [router]);

  const handleLogout = async () => {
    try {
      await logout();

    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      sessionStorage.removeItem('user-session');
      sessionStorage.removeItem('auth-token');
      cookieStore.delete('sb-jlqamlxzkfmpfisjlzrg-auth-token');
      router.push('/auth/login');
    }
  };

  if (!userData) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Student Portal</h1>
                <p className="text-sm text-gray-500">Welcome back, {userData.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="default" size="sm" onClick={() => router.push('/chat')}>
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat with Agent
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Track your applications and academic progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Applications</CardTitle>
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">8</div>
              <p className="text-xs text-gray-500 mt-1">3 pending review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Accepted</CardTitle>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">3</div>
              <p className="text-xs text-gray-500 mt-1">From 8 applications</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Interviews</CardTitle>
                <Calendar className="w-5 h-5 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">2</div>
              <p className="text-xs text-gray-500 mt-1">Upcoming this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Documents</CardTitle>
                <BookOpen className="w-5 h-5 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12</div>
              <p className="text-xs text-gray-500 mt-1">All verified</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Applications */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>Your latest university applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Harvard University", status: "Under Review", date: "Jan 15, 2026", statusColor: "text-blue-600 bg-blue-50" },
                    { name: "Stanford University", status: "Accepted", date: "Jan 10, 2026", statusColor: "text-green-600 bg-green-50" },
                    { name: "MIT", status: "Interview Scheduled", date: "Jan 8, 2026", statusColor: "text-purple-600 bg-purple-50" },
                    { name: "Yale University", status: "Under Review", date: "Jan 5, 2026", statusColor: "text-blue-600 bg-blue-50" },
                  ].map((app, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <GraduationCap className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{app.name}</p>
                          <p className="text-sm text-gray-500">{app.date}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${app.statusColor}`}>
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  View All Applications
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Events */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Important dates and deadlines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: "MIT Interview", date: "Jan 20, 2026", time: "10:00 AM", icon: Calendar, color: "text-purple-600" },
                    { title: "Document Submission", date: "Jan 22, 2026", time: "11:59 PM", icon: FileText, color: "text-blue-600" },
                    { title: "Yale Decision", date: "Jan 25, 2026", time: "5:00 PM", icon: AlertCircle, color: "text-orange-600" },
                  ].map((event, idx) => (
                    <div key={idx} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <event.icon className={`w-5 h-5 mt-0.5 ${event.color}`} />
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">{event.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{event.date}</p>
                        <p className="text-xs text-gray-400">{event.time}</p>
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
                  <FileText className="w-4 h-4 mr-2" />
                  New Application
                </Button>
                <Button className="w-full" variant="outline">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Upload Documents
                </Button>
                <Button className="w-full" variant="outline">
                  <User className="w-4 h-4 mr-2" />
                  Update Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
