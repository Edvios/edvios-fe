'use client'
import { useCallback, useEffect, useState } from "react";
import { StudentProfileData } from "../types/student-profile.types";
import { getStudentProfile, updateStudentProfile } from "../api/student-profile.api";

export const useStudentProfile = (studentId?: string) => {
    const [data, setData] = useState<StudentProfileData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    const fetchStudent = useCallback(async (id: string) => {
        setLoading(true);
        try {
            const res = await getStudentProfile(id);
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
        async (id: string, dto: Partial<StudentProfileData>) => {
            setLoading(true);
            try {
                const res = await updateStudentProfile(id, dto);
                setData(res);
                return res;
            } catch (err) {
                setError(err);
                throw err;
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
