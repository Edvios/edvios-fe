'use client'
import { useCallback, useEffect, useState } from "react";
import { StudentProfile } from "../types/profile.types";
import { getStudent, updateStudent } from "../api/profile.api";

export const useStudentProfile = (studentId?: string) => {
  const [data, setData] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetchStudent = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await getStudent(id);
      setData(res);
      return res;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveStudent = useCallback(
    async (id: string, dto: Partial<StudentProfile>) => {
      setLoading(true);
      try {
        const res = await updateStudent(id, dto);
        setData(res);
        return res;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  

  useEffect(() => {
    if (studentId) fetchStudent(studentId);
  }, [studentId, fetchStudent]);

  return {
    data,
    loading,
    error,
    fetchStudent,
    saveStudent,
  };
};

// compatibility: normalization effect previously provided by use-profile-effects.ts

export function useProfileEffects(params: {
  profileData?: StudentProfile | Record<string, unknown> | null;
  displayProfile: StudentProfile;
  setDisplayProfile: (p: StudentProfile) => void;
  setFormProfile: (p: StudentProfile) => void;
  setGpaInput: (v: string) => void;
}) {
  const { profileData, displayProfile, setDisplayProfile, setFormProfile, setGpaInput } = params;

  useEffect(() => {
    // normalize and apply data from API when available
    const p = profileData as unknown as Record<string, unknown>;
    // prefer auth-provided email (may be returned in user_metadata) when profile.email is missing
    let emailFromMeta: string | undefined;
    const maybeMeta = p?.user_metadata;
    if (typeof maybeMeta === "object" && maybeMeta !== null) {
      const meta = maybeMeta as Record<string, unknown>;
      if (typeof meta.email === "string") emailFromMeta = meta.email;
    }

    const firstFromFull = typeof profileData?.fullName === "string" && profileData.fullName.trim().length > 0
      ? String(profileData.fullName).trim().split(/\s+/)[0]
      : undefined;
    const lastFromFull = typeof profileData?.fullName === "string" && profileData.fullName.trim().length > 0
      ? String(profileData.fullName).trim().split(/\s+/).slice(1).join(" ") || undefined
      : undefined;

    const normalized = {
      ...(profileData ?? {}),
      email: profileData?.email ?? emailFromMeta,
      address: profileData?.address ?? (profileData as Record<string, unknown>)?.adress,
      firstName: profileData?.firstName ?? firstFromFull,
      lastName: profileData?.lastName ?? lastFromFull,
    } as StudentProfile;

    if (profileData) {
      console.debug('Profile page: received profileData', normalized);
    } else {
      console.debug('Profile page: no profileData available');
    }

    setDisplayProfile(normalized);
  }, [profileData, setDisplayProfile]);

  useEffect(() => {
    setFormProfile(displayProfile);
    setGpaInput(String(displayProfile.gpa ?? ""));
  }, [displayProfile, setFormProfile, setGpaInput]);
}
