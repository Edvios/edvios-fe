import axiosInstance from "@/lib/axios";
import { StudentProfileData } from "../types/student-profile.types";

export const getStudentProfile = async (id: string): Promise<StudentProfileData> => {
    const res = await axiosInstance.get<StudentProfileData>(`/students/${id}`);
    return res.data;
};

export const updateStudentProfile = async (
    id: string,
    payload: Partial<StudentProfileData>
): Promise<StudentProfileData> => {
    const res = await axiosInstance.patch<StudentProfileData>(`/students/${id}`, payload);
    return res.data;
};
