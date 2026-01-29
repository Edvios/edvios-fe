import axiosInstance from "@/lib/axios";
import {
  Application,
  PaginationParams,
  PaginatedResponse,
} from "@/app/applications/types/application.types";
import { ApplicationStatus } from "@/app/applications/enums/application.enum";
import {
  ApplicationSchema,
  UpdateStatusSchema,
} from "@/app/applications/dtos/application.dto";
import { z } from "zod";

export const applicationsApi = {
  async getAll(
    params: PaginationParams = { page: 1, size: 10 },
  ): Promise<PaginatedResponse<Application>> {
    const response = await axiosInstance.get("/applications", {
      params: params,
    });

    return {
      data: z.array(ApplicationSchema).parse(response.data.applications),
      total: response.data.total || 0,
      currentPage: response.data.page || 1,
    };
  },

  async getById(id: string): Promise<Application> {
    const response = await axiosInstance.get(`/applications/${id}`);
    return ApplicationSchema.parse(response.data);
  },

  async updateStatus(id: string, status: ApplicationStatus): Promise<void> {
    const payload = UpdateStatusSchema.parse({ status });
    await axiosInstance.patch(`/applications/${id}/status`, payload);
  },

  async getCount(): Promise<{ count: { [key in ApplicationStatus]: number } }> {
    const response = await axiosInstance.get("/applications/count");
    return response.data;
  },
};