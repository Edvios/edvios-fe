import axiosInstance from "@/lib/axios";
import { StudentProfile } from "../types/profile.types";

/* ---------------- API CALLS ---------------- */

export const getStudent = async (id: string): Promise<StudentProfile> => {
  const res = await axiosInstance.get<StudentProfile>(`/students/${id}`);
  return res.data;
};

export const updateStudent = async (
  id: string,
  payload: Partial<StudentProfile>
): Promise<StudentProfile> => {
  // Use PATCH for partial updates; return raw API payload like agent API
  const res = await axiosInstance.patch<StudentProfile>(`/students/${id}`, payload);
  return res.data;
};


