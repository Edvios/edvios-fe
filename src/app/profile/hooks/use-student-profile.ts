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
        const res = await fetch(`/api/profile`);
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        if (mounted && data) setProfile((prev) => ({ ...prev, ...data }));
      } catch (e) {
        // keep sample data if fetch fails
        console.warn("Could not load profile from API", e);
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
