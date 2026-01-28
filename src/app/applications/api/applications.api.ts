import axiosInstance from '@/lib/axios';
import { Application } from '@/app/applications/types/application.types';
import { ApplicationStatus } from '@/app/applications/enums/application.enum';
import { ApplicationSchema, UpdateStatusSchema } from '@/app/applications/dtos/application.dto';
import { z } from 'zod';

export const applicationsApi = {
  async getAll(): Promise<Application[]> {
    const response = await axiosInstance.get('/applications');
    return z.array(ApplicationSchema).parse(response.data);
  },

  async getById(id: string): Promise<Application> {
    const response = await axiosInstance.get(`/applications/${id}`);
    return ApplicationSchema.parse(response.data);
  },

  async updateStatus(id: string, status: ApplicationStatus): Promise<void> {
    const payload = UpdateStatusSchema.parse({ status });
    await axiosInstance.patch(`/applications/${id}/status`, payload);
  },

  async getByStatus(status?: ApplicationStatus): Promise<Application[]> {
    const url = status ? `/applications?status=${status}` : '/applications';
    const response = await axiosInstance.get(url);
    return z.array(ApplicationSchema).parse(response.data);
  },

  async getCount(): Promise<{ count: { [key in ApplicationStatus]: number } }> {
    const response = await axiosInstance.get('/applications/count');
    return response.data;
  },
}