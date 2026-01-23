"use client";

import { useEffect, useMemo, useState } from "react";
import { ProfileTab } from "../enums/profile-tabs.enum";
import { studentProfileDto } from "../dtos/profile.dto";
import { StudentProfile } from "../types/profile.types";

export function useStudentProfile() {
  const [activeTab, setActiveTab] = useState<ProfileTab>(ProfileTab.OVERVIEW);
  const initialProfile = useMemo(() => studentProfileDto, []);
  const [profile, setProfile] = useState<StudentProfile>(initialProfile);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        // If a student id is present in sessionStorage, pass it to the API
        let apiPath = `/profile/api`;
        // Safely parse session data without using `any`
        if (typeof window !== "undefined") {
          const userSession = sessionStorage.getItem("user-session");
          if (userSession) {
            try {
              const parsed: unknown = JSON.parse(userSession);
              const candidateKeys = ["STUDENTId", "studentId", "student_id", "studentID"];

              const isRecord = (v: unknown): v is Record<string, unknown> =>
                typeof v === "object" && v !== null;

              if (isRecord(parsed)) {
                for (const k of candidateKeys) {
                  const direct = parsed[k];
                  let val: unknown = direct;
                  if (val === undefined && isRecord(parsed) && "data" in parsed) {
                    const maybeData = parsed.data;
                    if (isRecord(maybeData)) val = maybeData[k];
                  }
                  if (val !== undefined && val !== null) {
                    apiPath = `/profile/api?studentId=${encodeURIComponent(String(val))}`;
                    break;
                  }
                }
              }
              } catch {
              // ignore parse errors
            }
          }
        }
        const res = await fetch(apiPath);
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        if (mounted && data) setProfile((prev) => ({ ...prev, ...data }));
      } catch (err: unknown) {
        // keep sample data if fetch fails
        console.warn("Could not load profile from API", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return {
    profile,
    activeTab,
    setActiveTab,
    loading,
    resetProfile: () => setProfile(initialProfile),
  } as const;
}
