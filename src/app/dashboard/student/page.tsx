"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentTab, studentTabLabels } from "./enums/student-tabs";
import type { UserData } from "@/app/dashboard/student/types/dashboard.types";
import { useStudentDashboard } from "./hooks/use-student-dashboard";
import {
  Calendar,
  CheckCircle,
  ClipboardList,
  FileText,
  FolderCheck,
  GraduationCap,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";

const statIcons: Record<string, LucideIcon> = {
  applications: FileText,
  accepted: CheckCircle,
  interviews: Calendar,
  documents: ClipboardList,
  programs: FolderCheck,
  pending: Calendar,
};

const statAccentMap: Record<string, string> = {
  default: "text-slate-700 bg-slate-100",
  primary: "text-slate-700 bg-slate-100",
  success: "text-emerald-700 bg-emerald-50",
  info: "text-blue-700 bg-blue-50",
  warn: "text-amber-700 bg-amber-50",
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

function resolveLabel(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.map(v => resolveLabel(v)).filter(Boolean).join(', ');
  if (typeof value === 'object' && value !== null) {
    // common fields to try
    const keys = ['title', 'name', 'label', 'program', 'programTitle', 'program_name', 'institution', 'institutionName', 'institution_name', 'university'];
    const obj = value as Record<string, unknown>;
    for (const k of keys) {
      if (obj[k]) return resolveLabel(obj[k]);
    }
    // fallback to empty string to avoid '[object Object]'
    return '';
  }
  return '';
}

export default function StudentDashboard() {
  const router = useRouter();
  const [userData] = useState<UserData | null>(() => {
    try {
      const s = sessionStorage.getItem('user-session');
      return s ? (JSON.parse(s) as UserData) : null;
    } catch {
      return null;
    }
  });
  const [tabValue, setTabValue] = useState<StudentTab>(StudentTab.APPLICATIONS);
  const { applications } = useStudentDashboard();

  // derive simple stat cards from applications list (students cannot call admin-only count endpoint)
  const totalApplications = applications.length;
  const acceptedCount = applications.filter(a => String(a.status ?? '').toLowerCase().includes('accept')).length;
  const pendingCount = applications.filter((a) => {
    const s = String(a.status ?? '').toLowerCase();
    // Count only 'submitted' statuses as pending for the student's view
    return s.includes('submit');
  }).length;
  // program count relevant to the student: prefer number of filtered `programs` fetched, otherwise count unique program IDs from applications
  const programIdsFromApps = new Set(
    applications
      .map((a) => {
        if (a.programId) return a.programId;
        if (a.program && typeof a.program === 'object' && a.program !== null) {
          const p = a.program as Record<string, unknown>;
          return p.id ?? p.programId ?? undefined;
        }
        return undefined;
      })
      .filter(Boolean)
      .map(String),
  );
  // Only count programs that are referenced by the student's applications.
  // Do not fall back to the full `programs` list to avoid showing global counts.
  const programsCount = programIdsFromApps.size;

  const statCards = [
    { key: 'applications', label: 'Total Applications', value: totalApplications, accent: 'primary' },
    { key: 'accepted', label: 'Accepted Applications', value: acceptedCount, accent: 'success' },
    { key: 'pending', label: 'Pending Applications', value: pendingCount, accent: 'warn' },
    { key: 'programs', label: 'Total Programs', value: programsCount, accent: 'info' },
  ];

  // other sections are currently not sourced from backend; keep placeholders
  const interviews: Record<string, unknown>[] = [];
  const documents: Record<string, unknown>[] = [];

  const tabOrder = useMemo(() => Object.values(StudentTab).filter((t) => t !== StudentTab.PROGRAMS) as StudentTab[], []);
  const activeTabIndex = useMemo(() => tabOrder.indexOf(tabValue), [tabOrder, tabValue]);


    useEffect(() => {
    if (!userData) {
      router.push('/auth/login');
      return;
    }

    if (userData.role !== 'STUDENT') {
      router.push(`/dashboard/${userData.role.toLowerCase()}`);
      return;
    }
  }, [router, userData]);

  // logout handled elsewhere; no-op here to avoid unused function

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
                                  {(() => {
                                    // support multiple backend shapes: simple strings or nested program object
                                    const programField = app.program as unknown;
                                    const programObj = (typeof programField === 'object' && programField !== null) ? programField as Record<string, unknown> : undefined;
                                    const programTitle = resolveLabel(typeof programField === 'string' ? programField : (programObj?.title ?? programObj?.program ?? programField));

                                    const schoolField = resolveLabel(app.school ?? (programObj && (programObj?.institution ?? programObj?.school ?? programObj)));

                                    return (
                                      <>
                                        <p className="font-medium text-slate-900">{schoolField}</p>
                                        <p className="text-sm text-slate-500">{programTitle}</p>
                                      </>
                                    );
                                  })()}
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

              
            </div>
          </TabsContent>

          
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
                  interviews.map((interview) => {
                    const item = interview as Record<string, unknown>;
                    return (
                    <div
                      key={String(item.id ?? '')}
                      className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3"
                    >
                      <div>
                        <p className="font-medium text-slate-900">{resolveLabel(item.school ?? item.institution ?? item.name)}</p>
                        <p className="text-sm text-slate-500">{resolveLabel(item.contact ?? item.contactName ?? item.contact_person)}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-purple-600" />
                          {resolveLabel(item.date ?? item.scheduledAt)}
                        </span>
                        <span className="text-slate-400">{resolveLabel(item.timezone ?? item.tz)}</span>
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusTone(resolveLabel(item.status))}`}>
                          {resolveLabel(item.status)}
                        </span>
                      </div>

                    </div>
                    );
                  })
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
                  documents.map((doc) => {
                    const item = doc as Record<string, unknown>;
                    return (
                    <div
                      key={String(item.id ?? '')}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3"
                    >
                      <div>
                        <p className="font-medium text-slate-900">{resolveLabel(item.title)}</p>
                        <p className="text-sm text-slate-500">Updated {resolveLabel(item.updatedAt ?? item.updated)}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusTone(resolveLabel(item.status))}`}>
                        {resolveLabel(item.status)}
                      </span>
                    </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Programs tab removed per request */}
        </Tabs>

      </main>
    </div>

  );
}
// CountUp removed — keep UI unchanged
