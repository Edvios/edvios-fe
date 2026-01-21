"use client";

import { useMemo, useState } from "react";
import { ProfileTab } from "../enums/profile-tabs.enum";
import { studentProfileDto } from "../dtos/profile.dto";
import { AcademicInfo, PersonalInfo, StudentProfile } from "../types/profile.types";

export function useStudentProfile() {
  const [activeTab, setActiveTab] = useState<ProfileTab>(ProfileTab.Overview);
  const initialProfile = useMemo(() => studentProfileDto, []);
  const [profile, setProfile] = useState<StudentProfile>(initialProfile);

  const setPersonalField = <K extends keyof PersonalInfo>(key: K, value: PersonalInfo[K]) => {
    setProfile((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        [key]: value,
      },
    }));
  };

  const setAcademicField = <K extends keyof AcademicInfo>(key: K, value: AcademicInfo[K]) => {
    setProfile((prev) => ({
      ...prev,
      academic: {
        ...prev.academic,
        [key]: value,
      },
    }));
  };

  return {
    profile,
    activeTab,
    setActiveTab,
    setPersonalField,
    setAcademicField,
    resetProfile: () => setProfile(initialProfile),
  } as const;
}
