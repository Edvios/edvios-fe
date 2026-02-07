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
import { AgentApplicationSchema } from "@/app/dashboard/agent/dtos/dashboard.dto";
import { AgentApplication } from "@/app/dashboard/agent/types/dashboard.types";

export const applicationsApi = {

  async getAgentApplications(paginationParams: PaginationParams): Promise<PaginatedResponse<AgentApplication>> {
    try {
        const response = await axiosInstance.get('applications/agent', { params: paginationParams });
        const applications = z.array(AgentApplicationSchema).parse(response.data.applications);
        return {
          data: applications,
          total: response.data.total || applications.length,
          currentPage: paginationParams.page || 1,
        };
    } catch (error) {
        console.error("Failed to fetch agent applications:", error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Failed to fetch agent applications. Please try again.");
    }
  },

  async getAdminApplications(paginationParams: PaginationParams): Promise<PaginatedResponse<AgentApplication>> {
    try {
      const response = await axiosInstance.get("applications/admin", { params: paginationParams });
      const applications = z.array(AgentApplicationSchema).parse(response.data.applications);
      return {
        data: applications,
        total: response.data.total || applications.length,
        currentPage: paginationParams.page || 1,
      };
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to fetch applications. Please try again.");
    }
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