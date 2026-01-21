"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { ProfileTab } from "./enums/profile-tabs.enum";
import { useStudentProfile } from "./hooks/use-student-profile";
import { StudentProfile } from "./types/profile.types";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  AlertCircle,
  Bell,
  BookOpen,
  Edit3,
  FileText,
  GraduationCap,
  Menu,
  Search,
  User,
} from "lucide-react";

const tabOrder: ProfileTab[] = [
  ProfileTab.OVERVIEW,
  ProfileTab.APPLICATIONS,
  ProfileTab.DOCUMENTS,
  ProfileTab.PROGRESS,
  ProfileTab.SUPPORT,
];

export default function StudentProfilePage() {
  const { profile, activeTab, setActiveTab, loading, resetProfile } = useStudentProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [displayProfile, setDisplayProfile] = useState<StudentProfile>(profile);
  const [formProfile, setFormProfile] = useState<StudentProfile>(profile);
  const [showDobPicker, setShowDobPicker] = useState(false);
  
  const initials = useMemo(() => (displayProfile.fullName || displayProfile.email || "").slice(0, 2).toUpperCase(), [displayProfile.fullName, displayProfile.email]);
  const dobDate = useMemo(() => (displayProfile.graduationDate ? new Date(displayProfile.graduationDate) : new Date()), [displayProfile.graduationDate]);

  const handleDateSelect = (date?: Date) => {
    if (!date) return;
    // no edit handler wired for graduationDate in this simple update
    setShowDobPicker(false);
  };

  useEffect(() => {
    setDisplayProfile(profile);
  }, [profile]);

  useEffect(() => {
    setFormProfile(displayProfile);
  }, [displayProfile]);

  const toggleOptions = [
    { id: ProfileTab.OVERVIEW, name: "Overview", icon: User, description: "Overview" },
    { id: ProfileTab.APPLICATIONS, name: "Applications", icon: BookOpen, description: "Applications" },
    { id: ProfileTab.DOCUMENTS, name: "Documents", icon: FileText, description: "Documents" },
    { id: ProfileTab.PROGRESS, name: "Progress", icon: GraduationCap, description: "Progress" },
    { id: ProfileTab.SUPPORT, name: "Support", icon: AlertCircle, description: "Support" },
  ];

  const getToggleBackground = () => {
    const index = toggleOptions.findIndex((o) => o.id === activeTab);
    const percentage = 100 / toggleOptions.length;
    return {
      width: `${percentage}%`,
      left: `${percentage * index}%`,
    } as React.CSSProperties;
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="p-2 rounded-full bg-gray-100 border text-gray-600">
              <Menu className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-semibold text-gray-900">Student Profile</h1>
            <div className="hidden md:flex items-center ml-6 space-x-2">
              <Search className="w-4 h-4 text-gray-400" />
              <Input className="w-64" placeholder="Search anything..." />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">Check In</Button>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" aria-hidden />
            </Button>
            <Button variant="destructive" size="sm">Logout</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ProfileTab)}>
          <Card className="shadow-sm">
            <CardContent className="pt-6 pb-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl font-bold">
                    {initials}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                        <h2 className="text-2xl font-bold text-gray-900">{displayProfile.fullName ?? "-"}</h2>
                        <span className="text-sm text-gray-500">Institution: {displayProfile.currentInstitution ?? "-"}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">{displayProfile.currentEducationLevel ?? "Student"}</span>
                      <span className="text-sm text-gray-500">Student</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex items-center space-x-2">
                  {!isEditing ? (
                      <Button className="bg-orange-gradient text-white hover:opacity-95" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit3 className="w-4 h-4 text-white" />
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        onClick={() => {
                          // apply changes locally
                          setDisplayProfile(formProfile);
                          setIsEditing(false);
                          setShowDobPicker(false);
                        }}
                      >
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // discard changes
                          setFormProfile(displayProfile);
                          resetProfile();
                          setIsEditing(false);
                          setShowDobPicker(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <div
                  className={`grid gap-2 p-1 rounded-4xl bg-gray-100 relative`}
                  style={{ gridTemplateColumns: `repeat(${toggleOptions.length}, minmax(0, 1fr))` }}
                >
                  <div
                    className="absolute top-1 bottom-1 rounded-4xl shadow-md transition-all duration-300 ease-in-out bg-orange-gradient"
                    style={getToggleBackground()}
                  />

                  {toggleOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setActiveTab(option.id as ProfileTab)}
                      className="relative z-10 px-4 py-2 rounded-4xl transition-colors duration-300 ease-in-out border-0 text-sm font-medium"
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: activeTab === option.id ? 'white' : '#374151',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <option.icon className="w-3.5 h-3.5" />
                        <span className="inline">{option.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <TabsContent value={ProfileTab.OVERVIEW}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-500" />
                  <CardTitle>Personal Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-gray-700">
                <div>
                  <p className="text-xs text-gray-500">Full Name</p>
                  {isEditing ? (
                    <Input value={formProfile.fullName ?? ""} onChange={(e) => setFormProfile({ ...formProfile, fullName: e.target.value })} />
                  ) : (
                    <p className="font-medium text-gray-900">{displayProfile.fullName ?? "-"}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    {isEditing ? (
                      <Input value={formProfile.email ?? ""} onChange={(e) => setFormProfile({ ...formProfile, email: e.target.value })} />
                    ) : (
                      <p className="font-medium text-gray-900">{displayProfile.email ?? "-"}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    {isEditing ? (
                      <Input value={formProfile.phone ?? ""} onChange={(e) => setFormProfile({ ...formProfile, phone: e.target.value })} />
                    ) : (
                      <p className="font-medium text-gray-900">{displayProfile.phone ?? "-"}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Nationality</p>
                    {isEditing ? (
                      <Input value={formProfile.nationality ?? ""} onChange={(e) => setFormProfile({ ...formProfile, nationality: e.target.value })} />
                    ) : (
                      <p className="font-medium text-gray-900">{displayProfile.nationality ?? "-"}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Institution</p>
                    {isEditing ? (
                      <Input value={formProfile.currentInstitution ?? ""} onChange={(e) => setFormProfile({ ...formProfile, currentInstitution: e.target.value })} />
                    ) : (
                      <p className="font-medium text-gray-900">{displayProfile.currentInstitution ?? "-"}</p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Address</p>
                  {isEditing ? (
                    <Input value={formProfile.address ?? ""} onChange={(e) => setFormProfile({ ...formProfile, address: e.target.value })} />
                  ) : (
                    <p className="font-medium text-gray-900">{displayProfile.address ?? "-"}</p>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5 text-gray-500" />
                  <CardTitle>Academic & Preferences</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-gray-700">
                <div>
                  <p className="text-xs text-gray-500">Current Education Level</p>
                  {isEditing ? (
                    <Input value={formProfile.currentEducationLevel ?? ""} onChange={(e) => setFormProfile({ ...formProfile, currentEducationLevel: e.target.value })} />
                  ) : (
                    <p className="font-medium text-gray-900">{displayProfile.currentEducationLevel ?? "-"}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Field Of Study</p>
                    {isEditing ? (
                      <Input value={String(formProfile.fieldOfStudy ?? "")} onChange={(e) => setFormProfile({ ...formProfile, fieldOfStudy: e.target.value })} />
                    ) : (
                      <p className="font-medium text-gray-900">{displayProfile.fieldOfStudy ?? "-"}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">GPA</p>
                    {isEditing ? (
                      <Input value={String(formProfile.gpa ?? "")} onChange={(e) => setFormProfile({ ...formProfile, gpa: Number(e.target.value) })} />
                    ) : (
                      <p className="font-medium text-gray-900">{displayProfile.gpa ?? "-"}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Preferred Program</p>
                    {isEditing ? (
                      <Input value={formProfile.preferredProgram ?? ""} onChange={(e) => setFormProfile({ ...formProfile, preferredProgram: e.target.value })} />
                    ) : (
                      <p className="font-medium text-gray-900">{displayProfile.preferredProgram ?? "-"}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Preferred Destination</p>
                    {isEditing ? (
                      <Input value={formProfile.preferredDestination ?? ""} onChange={(e) => setFormProfile({ ...formProfile, preferredDestination: e.target.value })} />
                    ) : (
                      <p className="font-medium text-gray-900">{displayProfile.preferredDestination ?? "-"}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start space-x-2 bg-blue-50 border border-blue-100 rounded-lg p-3">
                  <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                  <p className="text-xs text-blue-800">Keep your preferences up to date for accurate applications.</p>
                </div>
              </CardContent>
            </Card>
          </div>
          </TabsContent>

          <TabsContent value={ProfileTab.APPLICATIONS}>
            <Card className="shadow-sm">
              <CardContent>
                <p className="text-sm text-gray-700">Applications content coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value={ProfileTab.DOCUMENTS}>
            <Card className="shadow-sm">
              <CardContent>
                <p className="text-sm text-gray-700">Documents content coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value={ProfileTab.PROGRESS}>
            <Card className="shadow-sm">
              <CardContent>
                <p className="text-sm text-gray-700">Progress content coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value={ProfileTab.SUPPORT}>
            <Card className="shadow-sm">
              <CardContent>
                <p className="text-sm text-gray-700">Support content coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
}
