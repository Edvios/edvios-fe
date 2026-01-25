"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentTab, studentTabLabels } from "./enums/student-tabs";
import type { UserData } from "@/app/dashboard/student/types/dashboard.types";
import { useStudentDashboard } from "./hooks/use-student-dashboard";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  ClipboardList,
  Download,
  FileText,
  FolderCheck,
  GraduationCap,
  LogOut,
  Plus,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";
import { logout } from "@/app/auth/login/api/auth.api";
//import CountUp from "@/components/ui/count-up";


const statAccentMap: Record<string, string> = {
  blue: "text-blue-600 bg-blue-50",
  emerald: "text-emerald-600 bg-emerald-50",
  purple: "text-purple-600 bg-purple-50",
  amber: "text-amber-600 bg-amber-50",
  indigo: "text-indigo-600 bg-indigo-50",
};

const statIcons: Record<string, LucideIcon> = {
  applications: FileText,
  accepted: CheckCircle,
  interviews: Calendar,
  documents: ClipboardList,
  programs: FolderCheck,
};

function statusTone(status?: string) {
  const normalized = (status ?? "").toLowerCase();

  if (normalized.includes("accepted") || normalized.includes("approved")) {
    return "bg-emerald-50 text-emerald-700";
  }
  if (normalized.includes("interview")) {
    return "bg-purple-50 text-purple-700";
  }
  if (normalized.includes("pending") || normalized.includes("await")) {
    return "bg-amber-50 text-amber-700";
  }
  if (normalized.includes("review")) {
    return "bg-blue-50 text-blue-700";
  }
  return "bg-slate-100 text-slate-700";
}

export default function StudentDashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [tabValue, setTabValue] = useState<StudentTab>(StudentTab.OVERVIEW);
  const { statCards, applications, interviews, documents, programs, refresh } = useStudentDashboard();

  const tabOrder = useMemo(() => Object.values(StudentTab), []);
  const activeTabIndex = useMemo(() => tabOrder.indexOf(tabValue), [tabOrder, tabValue]);


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
                <p className="text-sm text-gray-500">Welcome back, {userData.firstName}</p>
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

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2" aria-label="Refresh dashboard" onClick={() => refresh()}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>

          <Button variant="outline" size="sm" className="gap-2" aria-label="Export data" onClick={() => console.log('export data')}>
            <Download className="h-4 w-4" />
            Export
          </Button>

          <Button variant="outline" size="sm" className="gap-2" aria-label="Logout" onClick={() => handleLogout()}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>

          <Button size="sm" className="gap-2 px-3 py-1 bg-orange-gradient text-white hover:from-orange-600 hover:to-orange-500" onClick={() => router.push('/dashboard/student/add')}>
            <Plus className="h-4 w-4" />
            Add Lead
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {statCards.map((stat) => {
            const Icon = statIcons[stat.key] ?? FileText;
            const accent = statAccentMap[stat.accent as string] ?? "text-slate-700 bg-slate-100";      
            const trendColor = stat.direction === "up" ? "text-emerald-600" : "text-rose-600";

            return (
              <Card key={stat.key} className="border border-slate-100 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    <span className={`inline-flex items-center justify-center rounded-full p-2 text-sm font-medium ${accent}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-3xl font-semibold text-slate-900"></div>
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <span className={trendColor}>{stat.change}</span>
                    <span>{stat.changeLabel}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs value={tabValue} onValueChange={(val) => setTabValue(val as StudentTab)} className="space-y-4">
          <TabsList
            className="relative w-full p-1 rounded-4xl bg-gray-100 overflow-hidden !bg-gray-100 !p-1 !rounded-4xl !w-full"
            style={{ gridTemplateColumns: `repeat(${tabOrder.length}, 1fr)` }}
          >
            <div
              className="absolute top-1 bottom-1 rounded-4xl transition-all duration-300 ease-in-out bg-orange-gradient"
              style={{
                width: `calc(${100 / tabOrder.length}% - 8px)`,
                left: `calc(${activeTabIndex * (100 / tabOrder.length)}% + 4px)`,
              }}
            />

            {tabOrder.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="relative z-10 px-2 py-2 duration-300 ease-in-out border-0 text-sm font-medium data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=inactive]:text-gray-700 !h-auto !rounded-4xl !border-0 !px-2 !py-2 !shadow-none !bg-transparent"
              >
                {studentTabLabels[tab]}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={StudentTab.OVERVIEW} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2 border border-slate-100">
                <CardHeader>
                  <CardTitle>Application Pipeline</CardTitle>
                  <CardDescription>Recent progress across your applications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {applications.slice(0, 3).map((app) => (
                    <div
                      key={app.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                          <GraduationCap className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{app.school}</p>
                          <p className="text-sm text-slate-500">{app.program}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusTone(app.status)}`}>
                          {app.status}
                        </span>
                        <span className="text-xs text-slate-500">{app.stage}</span>
                        <span className="text-xs text-slate-400">{app.date}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border border-slate-100">
                <CardHeader>
                  <CardTitle>Deadlines & Tasks</CardTitle>
                  <CardDescription>Stay ahead on upcoming steps</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    "Confirm MIT interview slot",
                    "Upload financial statement for Yale",
                    "Review Stanford enrollment kit",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-lg bg-slate-100 px-3 py-2">
                      <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                      <p className="text-sm text-slate-800">{item}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value={StudentTab.APPLICATIONS} className="space-y-4">
            <Card className="border border-slate-100">
              <CardHeader>
                <CardTitle>Applications</CardTitle>
                <CardDescription>Everything from submission to decision</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="grid grid-cols-1 md:grid-cols-5 items-start gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3"
                  >
                    <div className="md:col-span-2">
                      <p className="font-medium text-slate-900">{app.school}</p>
                      <p className="text-sm text-slate-500">{app.program}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusTone(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600">{app.stage}</div>
                    <div className="text-sm text-slate-500">
                      <p>{app.date}</p>
                      <p className="text-xs text-slate-400">{app.nextStep}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value={StudentTab.INTERVIEWS} className="space-y-4">
            <Card className="border border-slate-100">
              <CardHeader>
                <CardTitle>Interviews</CardTitle>
                <CardDescription>Upcoming and recent interview slots</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {interviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{interview.school}</p>
                      <p className="text-sm text-slate-500">{interview.contact}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-purple-600" />
                        {interview.date}
                      </span>
                      <span className="text-slate-400">{interview.timezone}</span>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusTone(interview.status)}`}>
                        {interview.status}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value={StudentTab.DOCUMENTS} className="space-y-4">
            <Card className="border border-slate-100">
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>Verification and upload status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{doc.title}</p>
                      <p className="text-sm text-slate-500">Updated {doc.updatedAt}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusTone(doc.status)}`}>
                      {doc.status}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value={StudentTab.PROGRAMS} className="space-y-4">
            <Card className="border border-slate-100">
              <CardHeader>
                <CardTitle>Enrolled Programs</CardTitle>
                <CardDescription>Confirmed offers for upcoming terms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {programs.map((program) => (
                  <div
                    key={program.id}
                    className="grid grid-cols-1 md:grid-cols-4 items-start gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3"
                  >
                    <div className="md:col-span-2">
                      <p className="font-medium text-slate-900">{program.school}</p>
                      <p className="text-sm text-slate-500">{program.program}</p>
                    </div>
                    <div className="text-sm text-slate-600">{program.term}</div>
                    <div className="text-sm text-slate-500">Starts {program.startDate}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
//<CountUp target={stat.value} trigger={refreshKey} />
