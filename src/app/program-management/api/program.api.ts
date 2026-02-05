import axiosInstance from '@/lib/axios';
import type { Program } from '../types';
import { ProgramsResopnseDto } from '../dtos/program.dto';

// Program API as an object (matches other API modules)
export const programApi = {
  async fetchPrograms(
    filters: Record<string, unknown> = {},
    params?: { page?: number; size?: number }
  ): Promise<ProgramsResopnseDto> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page !== undefined) {
        queryParams.append('page', String(params.page));
      }
      if (params?.size !== undefined) {
        queryParams.append('size', String(params.size));
      }
      
      const queryString = queryParams.toString();
      const url = `/pai/programs/filter${queryString ? `?${queryString}` : ''}`;
      const resp = await axiosInstance.post(url, filters);
      return resp.data;
    } catch (error) {
      console.error('Failed to fetch programs:', error);
      throw error;
    }
  },
  async fetchInitialData(): Promise<unknown> {
    try {
      const resp = await axiosInstance.get('/pai/programs/initial-data');
      return resp.data?.data ?? resp.data ?? resp;
    } catch (error) {
      console.error('Failed to fetch initial program data:', error);
      throw error;
    }
  },
  async createProgram(data: Record<string, unknown>): Promise<Program> {
    try {
      const resp = await axiosInstance.post('/pai/programs', data);
      return (resp.data?.data ?? resp.data) as Program;
    } catch (error) {
      console.error('Failed to create program:', error);
      throw error;
    }
  },
  async updateProgram(id: string, data: Record<string, unknown>): Promise<Program> {
    try {
      const resp = await axiosInstance.put(`/pai/programs/${id}`, data);
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


