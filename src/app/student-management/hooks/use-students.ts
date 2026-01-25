import { useState, useEffect, useCallback, useMemo } from "react";
import { fetchStudents } from "../api/student.api";
import { Student, StudentFilters } from "../types/student.types";

export const useStudents = (filters: StudentFilters) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stableFilters = useMemo(
    () => filters,
    [
      filters.search,
      filters.page,
      filters.pageSize,
      filters.country,
   
    ]
  );

  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchStudents(stableFilters);
      setStudents(response.students || []);
      setTotal(response.total || 0);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setError("Failed to load students. Please try again.");
      setStudents([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [stableFilters]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const refetch = useCallback(() => {
    loadStudents();
  }, [loadStudents]);

  return { students, total, loading, error, refetch };
};
