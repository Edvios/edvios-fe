"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// Calendar removed — currently unused
import { ProfileTab } from "./enums/profile-tabs.enum";
import { useStudentProfile, useProfileEffects } from "./hooks/use-student-profile";
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
import { Loader2 } from "lucide-react";

// tabOrder removed — not used

// Small local helpers to compute changed fields and merge them into the
// existing student DTO. Kept local to this file to avoid an extra import
// and to make the profile save self-contained.
type AnyRecord = Record<string, unknown>;

function getChangedFields(original: AnyRecord | undefined | null, modified: AnyRecord | undefined | null): AnyRecord {
  const changes: AnyRecord = {};
  if (!modified) return changes;

  for (const key of Object.keys(modified)) {
    const newVal = (modified as Record<string, unknown>)[key];
    const oldVal = original ? (original as Record<string, unknown>)[key] : undefined;

    if (newVal === undefined) continue;

    const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
    if (isObject(newVal) && isObject(oldVal)) {
      const nested = getChangedFields(oldVal, newVal);
      if (Object.keys(nested).length > 0) changes[key] = nested as unknown;
    } else if (Array.isArray(newVal) && Array.isArray(oldVal)) {
      if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) changes[key] = newVal as unknown;
    } else {
      if (newVal !== oldVal) changes[key] = newVal as unknown;
    }
  }

  return changes;
}

function mergeStudentRegistrationDto(original: AnyRecord | undefined | null, changes: AnyRecord | undefined | null): AnyRecord {
  const result: AnyRecord = original ? { ...(original as Record<string, unknown>) } : {};
  if (!changes) return result;
  for (const k of Object.keys(changes)) {
    const v = (changes as Record<string, unknown>)[k];
    if (v && typeof v === "object" && !Array.isArray(v)) {
      result[k] = { ...((result[k] as Record<string, unknown>) ?? {}), ...(v as Record<string, unknown>) } as unknown;
    } else {
      result[k] = v as unknown;
    }
  }

  const keysToSync = ["firstName", "lastName", "email", "phone"];
  let mergedUser: Record<string, unknown> | undefined;
  for (const k of keysToSync) {
    if (changes && Object.prototype.hasOwnProperty.call(changes, k)) {
      mergedUser = { ...(mergedUser ?? (result.user ?? {} as Record<string, unknown>)), [k]: (changes as Record<string, unknown>)[k] };
    }
  }

  if (mergedUser) result.user = mergedUser as unknown;

  return result;
}

function applyUpdatesToDto(original: AnyRecord | undefined | null, modified: AnyRecord | undefined | null): AnyRecord {
  const changes = getChangedFields(original, modified);
  return mergeStudentRegistrationDto(original, changes);
}

export default function StudentProfilePage() {
  const candidateSessionIdKeys = [
    "id",
    "_id",
    "userId",
    "user_id",
    "uid",
    "sub",
    "studentId",
    "student_id",
    "STUDENTId",
    "studentID",
  ];

  const getStudentIdFromSession = () => {
    if (typeof window === "undefined") return undefined;
    const raw = sessionStorage.getItem("user-session");
    if (!raw) return undefined;
    try {
      const parsed = JSON.parse(raw) as unknown;
      const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;
      if (!isRecord(parsed)) return undefined;

      const tryLookup = (obj: Record<string, unknown> | undefined) => {
        if (!obj) return undefined;
        const found = candidateSessionIdKeys
          .map((k) => obj[k])
          .find((v) => v !== undefined && v !== null);
        return found ? String(found) : undefined;
      };

      // top-level
      const top = tryLookup(parsed as Record<string, unknown>);
      if (top) return top;

      // common nested shapes
      const data = (parsed as Record<string, unknown>).data as Record<string, unknown> | undefined;
      const foundInData = tryLookup(data);
      if (foundInData) return foundInData;

      const user = (parsed as Record<string, unknown>).user as Record<string, unknown> | undefined;
      const foundInUser = tryLookup(user) ?? (user && user.id ? String(user.id) : undefined);
      if (foundInUser) return foundInUser;

      return undefined;
    } catch {
      return undefined;
    }
  };

  const studentId = getStudentIdFromSession();

  const { data: profileData, loading, error, fetchStudent, saveStudent } = useStudentProfile(studentId);

  const [activeTab, setActiveTab] = useState<ProfileTab>(ProfileTab.OVERVIEW);
  const resetProfile = () => {
    if (studentId) fetchStudent(studentId);
  };
  const [isEditing, setIsEditing] = useState(false);
  const [displayProfile, setDisplayProfile] = useState<StudentProfile>(profileData ?? ({} as StudentProfile));
  const [formProfile, setFormProfile] = useState<StudentProfile>(profileData ?? ({} as StudentProfile));
  // date picker state removed — not used
  const [gpaInput, setGpaInput] = useState<string>(String(profileData?.gpa ?? ""));
  
  const initials = useMemo(() => {
    const name = displayProfile.firstName
      ? `${displayProfile.firstName} ${displayProfile.lastName ?? ""}`.trim()
      : displayProfile.email ?? "";
    return String(name).slice(0, 2).toUpperCase();
  }, [displayProfile.firstName, displayProfile.lastName, displayProfile.email]);

  // dobDate and handleDateSelect removed — not used

  useProfileEffects({
    profileData,
    displayProfile,
    setDisplayProfile,
    setFormProfile,
    setGpaInput,
  });

  const displayAddress = displayProfile.address ?? displayProfile.adress ?? "";

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
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (typeof window !== "undefined") {
                  sessionStorage.removeItem("user-session");
                  sessionStorage.removeItem("auth-token");
                  cookieStore.delete('sb-jlqamlxzkfmpfisjlzrg-auth-token');
                  window.location.href = "/auth/login";
                }
              }}
            >
              Logout
            </Button>
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
                        <h2 className="text-2xl font-bold text-gray-900">{(displayProfile.firstName ? `${displayProfile.firstName} ${displayProfile.lastName ?? ""}`.trim() : displayProfile.email) ?? "-"}</h2>
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
                      <Button className="bg-gradient text-white hover:opacity-95" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit3 className="w-4 h-4 text-white" />
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        disabled={loading}
                        onClick={async () => {
                          // Save only changed fields to backend
                          try {
                            let apiPath = "/profile/api";
                            if (typeof window !== "undefined") {
                              const userSession = sessionStorage.getItem("user-session");
                              if (userSession) {
                                try {
                                  const parsed: unknown = JSON.parse(userSession);
                                  const candidateKeys = ["STUDENTId", "studentId", "student_id", "studentID"];
                                  const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;
                                  if (isRecord(parsed)) {
                                    const val = ((): unknown => {
                                      const direct = candidateKeys.map((k) => parsed[k]);
                                      const foundDirect = direct.find((v) => v !== undefined && v !== null);
                                      if (foundDirect !== undefined && foundDirect !== null) return foundDirect;
                                      if ("data" in parsed && isRecord((parsed as Record<string, unknown>).data)) {
                                        const maybeData = (parsed as Record<string, unknown>).data as Record<string, unknown>;
                                        const nested = candidateKeys.map((k) => maybeData[k]);
                                        return nested.find((v) => v !== undefined && v !== null);
                                      }
                                      return undefined;
                                    })();
                                    if (val !== undefined && val !== null) {
                                      apiPath = `/profile/api?studentId=${encodeURIComponent(String(val))}`;
                                    }
                                  }
                                } catch {
                                  // ignore parse errors
                                }
                              }
                            }
                            // Send the full user+student object so backend can persist both sides
                            // Create a merged payload that only applies edited fields
                            // and keeps nested `user` fields in sync.
                            let payloadAny: Record<string, unknown> | undefined;
                              try {
                              payloadAny = applyUpdatesToDto(displayProfile as AnyRecord, formProfile as AnyRecord);
                            } catch (e) {
                              // fallback to shallow merge if helper fails
                              payloadAny = { ...(displayProfile as Record<string, unknown>), ...(formProfile as Record<string, unknown>) };
                              console.debug('applyUpdatesToDto failed', e);
                            }

                            // normalize address field for backends using `adress` typo
                            if (payloadAny && (payloadAny as Record<string, unknown>).address) {
                              (payloadAny as Record<string, unknown>).adress = (payloadAny as Record<string, unknown>).adress ?? (payloadAny as Record<string, unknown>).address;
                            }

                            if (!studentId) {
                              throw new Error("Missing student id");
                            }

                            const data = await saveStudent(studentId, payloadAny as unknown as Partial<StudentProfile>);
                            setDisplayProfile({ ...displayProfile, ...payloadAny, ...data });
                            setIsEditing(false);
                          } catch (err: unknown) {
                            console.error('Save profile error', err);
                            let msg = String(err);
                            if (typeof err === 'object' && err !== null && 'message' in err) {
                              const maybeMsg = (err as { message?: unknown }).message;
                              msg = typeof maybeMsg === 'string' ? maybeMsg : String(maybeMsg);
                            }
                            alert("Failed to save profile: " + msg);
                          }
                        }}
                        >
                        {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
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
                    className="absolute top-1 bottom-1 rounded-4xl shadow-md transition-all duration-300 ease-in-out bg-gradient"
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
                
                {/* First / Last name editable fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">First Name</p>
                    {isEditing ? (
                      <Input
                        value={formProfile.firstName ?? ""}
                        onChange={(e) => setFormProfile((prev) => ({ ...prev, firstName: e.target.value }))}
                      />
                    ) : (
                      <p className="font-medium text-gray-900">{displayProfile.firstName ?? "-"}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Last Name</p>
                    {isEditing ? (
                      <Input
                        value={formProfile.lastName ?? ""}
                        onChange={(e) => setFormProfile((prev) => ({ ...prev, lastName: e.target.value }))}
                      />
                    ) : (
                      <p className="font-medium text-gray-900">{displayProfile.lastName ?? "-"}</p>
                    )}
                  </div>
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
                    <p className="text-xs text-gray-500">Date of Birth</p>
                    {isEditing ? (
                      <Input type="date" value={formProfile.dob ? String(formProfile.dob).slice(0, 10) : ""} onChange={(e) => setFormProfile({ ...formProfile, dob: e.target.value })} />
                    ) : (
                      <p className="font-medium text-gray-900">{displayProfile.dob ? new Date(displayProfile.dob).toLocaleDateString() : "-"}</p>
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
                    <Input value={formProfile.address ?? formProfile.adress ?? ""} onChange={(e) => setFormProfile({ ...formProfile, address: e.target.value })} />
                  ) : (
                    <p className="font-medium text-gray-900">{displayAddress ?? "-"}</p>
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
                      <Input
                        value={gpaInput}
                        onChange={(e) => setGpaInput(e.target.value)}
                        onBlur={() => setFormProfile({ ...formProfile, gpa: gpaInput === "" ? undefined : Number(gpaInput) })}
                      />
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
