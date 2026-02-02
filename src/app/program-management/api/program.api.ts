import axiosInstance from '@/lib/axios';
import type { Program, Institution } from '../types';

// Program API as an object (matches other API modules)
export const programApi = {
  async fetchPrograms(params?: { page?: number; size?: number }): Promise<
    | Program[]
    | { data?: Program[]; items?: Program[]; page?: number; size?: number; total?: number }
    | unknown
  > {
    try {
      const response = await axiosInstance.get('/pai/programs', { params });
      // Return the raw response payload so callers can inspect pagination metadata
      // Possible shapes:
      // - Array of programs
      // - { data: [...], page, size, total }
      // - { items: [...], pagination: { page, size, total } }
      return response.data ?? response;
    } catch (error) {
      console.error('Failed to fetch programs:', error);
      throw error;
    }
  },
  async fetchProgramById(id: string): Promise<Program | null> {
    try {
      const resp = await axiosInstance.get(`/pai/programs/${id}`);
      // normalize common API shapes: { data: { ... } } or direct object
      return (resp.data?.data ?? resp.data) as Program;
    } catch (error) {
      console.error(`Failed to fetch program ${id}:`, error);
      return null;
    }
  },
  async getInstituteById(id: string): Promise<Institution | null> {
    try {
      const resp = await axiosInstance.get(`/pai/institutes/${id}`);
      // normalize common API shapes: { data: { ... } } or direct object
      return (resp.data?.data ?? resp.data) as Institution;
    } catch (error) {
      console.error(`Failed to fetch institute ${id}:`, error);
      return null;
    }
  },
  async getIntakeById(id: string): Promise<{ id: string; name?: string } | null> {
    try {
      const resp = await axiosInstance.get(`/pai/intakes/${id}`);
      return (resp.data?.data ?? resp.data) as { id: string; name?: string };
    } catch (error) {
      console.error(`Failed to fetch intake ${id}:`, error);
      return null;
    }
  },
  async getSubjectById(id: string): Promise<{ id: string; name?: string } | null> {
    try {
      const resp = await axiosInstance.get(`/pai/subjects/${id}`);
      return (resp.data?.data ?? resp.data) as { id: string; name?: string };
    } catch (error) {
      console.error(`Failed to fetch subject ${id}:`, error);
      return null;
    }
  },
  async filterPrograms(
    filters: Record<string, unknown>,
    params?: { page?: number; size?: number }
  ): Promise<
    | Program[]
    | { data?: Program[]; items?: Program[]; page?: number; size?: number; total?: number }
    | unknown
  > {
    try {
      const query = new URLSearchParams();
      if (params?.page) query.append('page', String(params.page));
      if (params?.size) query.append('size', String(params.size));
      const suffix = query.toString() ? `?${query.toString()}` : '';
      const resp = await axiosInstance.post(`/pai/programs/filter${suffix}`, filters);
      // Return full payload so callers can read pagination metadata (page/size/total)
      return resp.data ?? resp;
    } catch (error) {
      console.error('Failed to fetch filtered programs:', error);
      throw error;
    }
  },
  async fetchInitialData(): Promise<unknown> {
    try {
      const resp = await axiosInstance.get('/pai/programs/initial-data');
      // prefer `.data` container shapes
      return resp.data?.data ?? resp.data ?? resp;
    } catch (error) {
      console.error('Failed to fetch initial program data:', error);
      throw error;
    }
  },
  async fetchInstitutes(params?: { page?: number; size?: number }): Promise<Institution[]> {
    try {
      const response = await axiosInstance.get('/pai/institutes', { params });
      const payload = response.data?.data ?? response.data?.items ?? response.data;
      return Array.isArray(payload) ? (payload as Institution[]) : [];
    } catch (error) {
      console.error('Failed to fetch institutes:', error);
      throw error;
    }
  },
  async updateProgram(id: string, data: Record<string, unknown>): Promise<Program> {
    try {
      const resp = await axiosInstance.put(`/pai/programs/${id}`, data);
      // normalize common API shapes: { data: {...} } or direct object
      return (resp.data?.data ?? resp.data) as Program;
    } catch (error) {
      console.error(`Failed to update program ${id}:`, error);
      throw error;
    }
  },
  async deleteProgram(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`/pai/programs/${id}`);
    } catch (error) {
      console.error(`Failed to delete program ${id}:`, error);
      throw error;
    }
  },
};

export default programApi;


