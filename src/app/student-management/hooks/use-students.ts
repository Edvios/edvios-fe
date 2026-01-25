import { useState, useEffect, useCallback } from "react";
import { fetchStudents } from "../api/student.api";
import { Student, StudentFilters } from "../types/student.types";

export const useStudents = (filters: StudentFilters) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Destructure filters (VERY IMPORTANT)
  const { page, search, pageSize } = filters;

  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchStudents({
        page,
        search,
        pageSize,
      });

      setStudents(response?.students ?? []);
      setTotal(response?.total ?? 0);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setStudents([]);
      setTotal(0);
      setError("Failed to load students. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const refetch = useCallback(() => {
    loadStudents();
  }, [loadStudents]);

  return {
    students,
    total,
    loading,
    error,
    refetch,
  };
};
