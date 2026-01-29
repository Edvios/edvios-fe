"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentTab, studentTabLabels } from "./enums/student-tabs";
import type { UserData } from "@/app/dashboard/student/types/dashboard.types";
import { useStudentDashboard } from "./hooks/use-student-dashboard";
import {
  Calendar,
  CheckCircle,
  AlertCircle,
  ClipboardList,
  FileText,
  FolderCheck,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import { logout } from "@/app/auth/login/api/auth.api";
//import CountUp from "@/components/ui/count-up";

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
  const [tabValue, setTabValue] = useState<StudentTab>(StudentTab.APPLICATIONS);
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
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-edvios-cap" style={{ backgroundColor: '#1c87e2', border: '1px solid rgba(0,0,0,0.06)' }}>
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Student Portal</h1>
                <p className="text-sm text-gray-500">Welcome back, {userData.firstName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
                <Button className="bg-gradient text-white" size="sm" onClick={() => router.push('/chat')}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat with Agent
                </Button>
                </div>
              </div>
            </div>
        </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
          {statCards.filter((s) => s.key !== "interviews").map((stat) => {
            const Icon = statIcons[stat.key] ?? FileText;
            const accent = statAccentMap[stat.accent as string] ?? "text-slate-700 bg-slate-100";

            const displayLabel =
              stat.key === "applications" ? "Total Applications" :
              stat.key === "accepted" ? "Accepted Applications" :
              stat.key === "programs" ? "Total Programs" :
              stat.label;

            return (
              <Card key={stat.key} className="border border-slate-100 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">{displayLabel}</p>
                    <span className={`inline-flex items-center justify-center rounded-full p-2 text-sm font-medium ${accent}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-3xl font-semibold text-slate-900">{stat.value}</div>
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
              className="absolute top-1 bottom-1 rounded-4xl transition-all duration-300 ease-in-out bg-gradient"
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

          <TabsContent value={StudentTab.APPLICATIONS} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-3 border border-slate-100">
                <CardHeader>
                  <CardTitle>Applications</CardTitle>
                  <CardDescription>Recent progress across your applications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {applications.length === 0 ? (
                    <div className="p-6 text-center text-sm text-slate-500">No applications found.</div>
                  ) : (
                    applications.slice(0, 3).map((app) => {
                    const dateObj = new Date(String(app.date ?? ""));
                    const valid = !isNaN(dateObj.getTime());
                    const formattedDate = valid ? dateObj.toLocaleDateString() : String(app.date ?? '');

                    return (
                      <div
                        key={String(app.id)}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3"
                      >
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                            <GraduationCap className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{String(app.school ?? '')}</p>
                            <p className="text-sm text-slate-500">{String(app.program ?? '')}</p>
                          </div>
                        </div>

                        <div className="flex flex-col text-right sm:mx-4">
                          <span className="text-sm text-slate-700">{formattedDate}</span>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusTone(String(app.status ?? ''))}`}>
                            {String(app.status ?? '')}
                          </span>

                          <span className="text-xs text-slate-500">{String(app.stage ?? '')}</span>
                        </div>
                      </div>
                    );
                    })
                  )}
                </CardContent>
              </Card>

              {/* Deadlines & Tasks removed */}
            </div>
          </TabsContent>

          {/* Applications tab removed - details moved to pipeline overview if needed */}

          <TabsContent value={StudentTab.INTERVIEWS} className="space-y-4">
            <Card className="border border-slate-100">
              <CardHeader>
                <CardTitle>Interviews</CardTitle>
                <CardDescription>Upcoming and recent interview slots</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">

                {interviews.length === 0 ? (
                  <div className="p-6 text-center text-sm text-slate-500">Coming soon.</div>
                ) : (
                  interviews.map((interview) => (
                    <div
                      key={String(interview.id)}
                      className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3"
                    >
                      <div>
                        <p className="font-medium text-slate-900">{String(interview.school ?? '')}</p>
                        <p className="text-sm text-slate-500">{String(interview.contact ?? '')}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-purple-600" />
                          {String(interview.date ?? '')}
                        </span>
                        <span className="text-slate-400">{String(interview.timezone ?? '')}</span>
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusTone(String(interview.status ?? ''))}`}>
                          {String(interview.status ?? '')}
                        </span>
                      </div>

                    </div>
                  ))
                )}
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
                {documents.length === 0 ? (
                  <div className="p-6 text-center text-sm text-slate-500">Coming soon.</div>
                ) : (
                  documents.map((doc) => (
                    <div
                      key={String(doc.id)}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3"
                    >
                      <div>
                        <p className="font-medium text-slate-900">{String(doc.title ?? '')}</p>
                        <p className="text-sm text-slate-500">Updated {String(doc.updatedAt ?? '')}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusTone(String(doc.status ?? ''))}`}>
                        {String(doc.status ?? '')}
                      </span>
                    </div>
                  ))
                )}
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
                {programs.length === 0 ? (
                  <div className="p-6 text-center text-sm text-slate-500">No programs found.</div>
                ) : (
                  programs.map((program) => (
                    <div
                      key={String(program.id)}
                      className="grid grid-cols-1 md:grid-cols-4 items-start gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3"
                    >
                      <div className="md:col-span-2">
                        <p className="font-medium text-slate-900">{String(program.school ?? '')}</p>
                        <p className="text-sm text-slate-500">{String(program.program ?? '')}</p>
                      </div>
                      <div className="text-sm text-slate-600">{String(program.term ?? '')}</div>
                      <div className="text-sm text-slate-500">Starts {String(program.startDate ?? '')}</div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </main>
    </div>

  );
}
//<CountUp target={stat.value} trigger={refreshKey} />
