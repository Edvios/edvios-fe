"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { ProfileTab } from "./enums/profile-tabs.enum";
import { useStudentProfile } from "./hooks/use-student-profile";
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
  ProfileTab.Overview,
  ProfileTab.Applications,
  ProfileTab.Documents,
  ProfileTab.Progress,
  ProfileTab.Support,
];

export default function StudentProfilePage() {
  const { profile, activeTab, setActiveTab, setPersonalField, resetProfile } = useStudentProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [showDobPicker, setShowDobPicker] = useState(false);
  const initials = useMemo(() => profile.personal.fullName.slice(0, 2).toUpperCase(), [profile.personal.fullName]);
  const dobDate = useMemo(() => new Date(profile.personal.dateOfBirth), [profile.personal.dateOfBirth]);

  const handleDateSelect = (date?: Date) => {
    if (!date) return;
    setPersonalField("dateOfBirth", date.toISOString().slice(0, 10));
    setShowDobPicker(false);
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
        <Card className="shadow-sm">
          <CardContent className="pt-6 pb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl font-bold">
                  {initials}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-2xl font-bold text-gray-900">{profile.personal.fullName}</h2>
                    <span className="text-sm text-gray-500">Student ID: {profile.personal.studentId}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">{profile.personal.status}</span>
                    <span className="text-sm text-gray-500">Student</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-2">
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button size="sm" onClick={() => setIsEditing(false)}>
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
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

            <div className="mt-6 flex flex-wrap gap-2 border-b border-gray-200 pb-2">
              {tabOrder.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-t-md text-sm font-semibold transition-colors ${
                    activeTab === tab
                      ? "bg-blue-50 text-blue-700 border border-b-white border-gray-200"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {activeTab === ProfileTab.Overview && (
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
                    <Input
                      value={profile.personal.fullName}
                      onChange={(e) => setPersonalField("fullName", e.target.value)}
                    />
                  ) : (
                    <p className="font-medium text-gray-900">{profile.personal.fullName}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Date of Birth</p>
                    {isEditing ? (
                      <div className="relative w-full">
                        <div className="flex items-center gap-2">
                          <Input
                            value={profile.personal.dateOfBirth}
                            readOnly
                            className="cursor-pointer"
                            onClick={() => setShowDobPicker((open) => !open)}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setShowDobPicker((open) => !open)}
                          >
                            Pick
                          </Button>
                        </div>
                        {showDobPicker && (
                          <div className="absolute z-20 mt-2 bg-white border rounded-md shadow-lg p-2">
                            <Calendar mode="single" selected={dobDate} onSelect={handleDateSelect} initialFocus />
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="font-medium text-gray-900">{profile.personal.dateOfBirth}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Student ID</p>
                    <p className="font-medium text-gray-900">{profile.personal.studentId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    {isEditing ? (
                      <Input
                        value={profile.personal.email}
                        onChange={(e) => setPersonalField("email", e.target.value)}
                      />
                    ) : (
                      <p className="font-medium text-gray-900">{profile.personal.email}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    {isEditing ? (
                      <Input
                        value={profile.personal.phone}
                        onChange={(e) => setPersonalField("phone", e.target.value)}
                      />
                    ) : (
                      <p className="font-medium text-gray-900">{profile.personal.phone}</p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Address</p>
                  {isEditing ? (
                    <Input
                      value={profile.personal.address}
                      onChange={(e) => setPersonalField("address", e.target.value)}
                    />
                  ) : (
                    <p className="font-medium text-gray-900">{profile.personal.address}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5 text-gray-500" />
                  <CardTitle>Academic Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-gray-700">
                <div>
                  <p className="text-xs text-gray-500">Current Education Level</p>
                  <p className="font-medium text-gray-900">{profile.academic.educationLevel}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">GPA</p>
                    <p className="font-medium text-gray-900">{profile.academic.gpa}</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <BookOpen className="w-4 h-4 text-gray-500 mt-1" />
                    <div>
                      <p className="text-xs text-gray-500">Interested Programs</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {profile.academic.interestedPrograms.map((program) => (
                          <span key={program} className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
                            {program}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <FileText className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500">Preferred Countries</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {profile.academic.preferredCountries.map((country) => (
                        <span key={country} className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
                          {country}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-2 bg-blue-50 border border-blue-100 rounded-lg p-3">
                  <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                  <p className="text-xs text-blue-800">
                    Keep your personal and academic information up to date to ensure smooth application processing.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
