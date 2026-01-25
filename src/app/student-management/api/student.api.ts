import axiosInstance from '@/lib/axios';
import { Student, StudentFilters, StudentResponse, UpdateStudentData } from '../types/student.types';

// Fetch all students with optional filters
export const fetchStudents = async (filters: StudentFilters): Promise<StudentResponse> => {
  try {
    const params: Record<string, string | number> = {};

    if (filters.search) params.search = filters.search;
    if (filters.country && filters.country !== 'all') params.country = filters.country;
    if (filters.page) params.page = filters.page;
    if (filters.pageSize) params.size = filters.pageSize; // Backend uses 'size'

    const response = await axiosInstance.get<StudentResponse>('/students', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

// Get single student by ID
export const getStudent = async (studentId: string): Promise<Student> => {
  try {
    const response = await axiosInstance.get<Student>(`/students/${studentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching student ${studentId}:`, error);
    throw error;
  }
};

// Update student information
export const updateStudent = async (studentId: string, data: UpdateStudentData): Promise<void> => {
  try {
    await axiosInstance.put(`/students/${studentId}`, data);
  } catch (error) {
    console.error(`Error updating student ${studentId}:`, error);
    throw error;
  }
};

// // Update student application status
// export const updateStudentStatus = async (studentId: string, status: StudentStatus): Promise<void> => {
//   try {
//     await axiosInstance.patch(`/students/${studentId}/status`, { status });
//   } catch (error) {
//     console.error(`Error updating student status ${studentId}:`, error);
//     throw error;
//   }
// };

// Delete a student
export const deleteStudent = async (studentId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/students/${studentId}`);
  } catch (error) {
    console.error(`Error deleting student ${studentId}:`, error);
    throw error;
  }
};

// Get filter options (countries, intakes, courses)
export const getStudentFilterOptions = async () => {
  try {
    const response = await axiosInstance.get('/students/filter-options');
    return response.data;
  } catch (error) {
    console.error('Error fetching student filter options:', error);
    return {
      countries: [],
      intakes: [],
      courses: []
    };
  }
};