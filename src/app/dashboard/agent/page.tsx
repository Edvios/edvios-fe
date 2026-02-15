"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  FileText,
  MessageSquare,
  Layers,
  BookOpen
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useApplications } from "./hooks/useAgentDashboard";
import { LogoLoading } from "@/components/ui/logo-loading";
import { Breadcrumb } from "@/components/ui/breadcrumb";

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
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const { applications, counts } = useApplications();

  const totalApplications = counts ?
    counts.totalApplications.count.SUBMITTED +
    counts.totalApplications.count.UNDER_REVIEW +
    counts.totalApplications.count.ACCEPTED +
    counts.totalApplications.count.REJECTED
    : 0;

  useEffect(() => {
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
          userType: (user.user_metadata?.role || user.app_metadata?.role || 'agent').toLowerCase(),
          name: `${user.user_metadata?.firstName || ''} ${user.user_metadata?.lastName || ''}`.trim() || user.email || 'User',
          id: user.id,
          phone: user.user_metadata?.phone || '',
          organization: user.user_metadata?.organization || ''
        });
      } catch (error) {
        console.error('Error fetching user:', error);
        router.push('/auth/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router, supabase.auth]);

  if (isLoading || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LogoLoading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full space-y-6">
        <Breadcrumb items={[{ label: "Agent Portal", active: true }]} />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Total Students</CardTitle>
                <Users className="w-5 h-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{counts?.totalStudents || 0}</div>
              <p className="text-xs text-gray-500 mt-1">{counts?.newUsers || 0} New students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Total Applications</CardTitle>
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalApplications || 0}</div>
              <p className="text-xs text-gray-500 mt-1">{counts?.totalApplications.count.SUBMITTED || 0} pending approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Total Programs</CardTitle>
                <Layers className="w-5 h-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{counts?.totalPrograms || 0}</div>
              <p className="text-xs text-gray-500 mt-1">{counts?.totalInstitutions || 0} institutions</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Clients */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>Your latest client interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.map((client, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-edvios-green/10 text-edvios-green rounded-full flex items-center justify-center font-bold">
                          {client.student.firstName?.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{client.student.firstName}</p>
                          <p className="text-sm text-gray-500">{client.student.email}</p>
                          {/* <p className="text-xs text-gray-400 mt-1">{client.applications} applications</p> */}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800`}>
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

          {/* Tasks & Quick Actions */}
          <div>


            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="default" size="sm" onClick={() => router.push('/chat')} className="w-full">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Support Inbox
                </Button>
                <Button className="w-full" variant="outline" onClick={() => router.push('/institution-management')}>
                  <FileText className="w-4 h-4 mr-2" />
                  Add Institutions
                </Button>
                <Button className="w-full" variant="outline" onClick={() => router.push('/program-management')}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Add Programs
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
