// app/institutions/api.ts

import axiosInstance from "@/lib/axios";
import type {
  Institution,
  PaginationWithFilterParams,
  PaginatedResponse,
} from "@/app/institution-management/types/institute-managemet.types";
import type {
  CreateInstitutionDTO,
  UpdateInstitutionDTO,
} from "@/app/institution-management/dtos/institution-managemet.dto";
import { InstitutionSchema } from "@/app/institution-management/dtos/institution-managemet.dto";

export const institutionApi = {
  /**
   * Fetch all institutions with pagination
   */
  async getAll(
    params: PaginationWithFilterParams = { page: 1, size: 10 },
  ): Promise<PaginatedResponse<Institution>> {
    try {
      // Build query params, excluding undefined/empty values
      const queryParams: Record<string, string | number> = {
        page: params.page || 1,
        size: params.size || 10,
      }

      // Only add filter params if they have values
      if (params.country) queryParams.country = params.country
      if (params.name) queryParams.name = params.name
      if (params.status) queryParams.status = params.status
      if (params.type) queryParams.type = params.type

      const response = await axiosInstance.get<PaginatedResponse<unknown>>(
        "pai/institutes",
        { params: queryParams },
      );

      const normalizedData: Institution[] = [];

      response.data.data.forEach((inst, index) => {
        const parsed = InstitutionSchema.safeParse(inst);
        if (parsed.success) {
          normalizedData.push(parsed.data);
        } else {
          console.warn(
            `Institution at index ${index} failed validation:`,
            parsed.error,
          );
        }
      });

      const pageSize = response.data.size || params.size || 1;
      const totalPages =
        response.data.totalPages ??
        Math.max(
          1,
          Math.ceil((response.data.total || normalizedData.length) / pageSize),
        );

      return {
        ...response.data,
        data: normalizedData,
        totalPages,
      };
    } catch (error) {
      console.error("Failed to fetch institutions:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to fetch institutions. Please try again.");
    }
  },

  /**
   * Fetch single institution by ID
   */
  async getById(id: string): Promise<Institution> {
    try {
      const response = await axiosInstance.get<unknown>(`pai/institutes/${id}`);

      const validation = InstitutionSchema.safeParse(response.data);
      if (!validation.success) {
        const errorMessages = validation.error.issues
          .map((err) => `${err.path.join(".")}: ${err.message}`)
          .join("; ");
        throw new Error(`Validation failed: ${errorMessages}`);
      }

      return validation.data;
    } catch (error) {
      console.error("Failed to fetch institution:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to fetch institution. Please try again.");
    }
  },

  /**
   * Create new institution
   */
  async create(data: CreateInstitutionDTO): Promise<Institution> {
    try {
      const response = await axiosInstance.post<unknown>(
        "pai/institutes",
        data,
      );

      const validation = InstitutionSchema.safeParse(response.data);
      if (!validation.success) {
        const errorMessages = validation.error.issues
          .map((err) => `${err.path.join(".")}: ${err.message}`)
          .join("; ");
        throw new Error(`Validation failed: ${errorMessages}`);
      }

      return validation.data;
    } catch (error) {
      console.error("Failed to create institution:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to create institution. Please try again.");
    }
  },

  /**
   * Update existing institution
   */
  async update(data: UpdateInstitutionDTO): Promise<Institution> {
    try {
      const response = await axiosInstance.put<unknown>(
        `pai/institutes/${data.id}`,
        data,
      );

      const validation = InstitutionSchema.safeParse(response.data);
      if (!validation.success) {
        const errorMessages = validation.error.issues
          .map((err) => `${err.path.join(".")}: ${err.message}`)
          .join("; ");
        throw new Error(`Validation failed: ${errorMessages}`);
      }

      return validation.data;
    } catch (error) {
      console.error("Failed to update institution:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to update institution. Please try again.");
    }
  },

  /**
   * Delete institution
   */
  async delete(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`pai/institutes/${id}`);
    } catch (error) {
      console.error("Failed to delete institution:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to delete institution. Please try again.");
    }
  },

  /**
   * Fetch institution statistics
   */
  // async getStats(institutionId?: string): Promise<InstitutionStats[]> {
  //   try {
  //     const url = institutionId
  //       ? `/institutes/${institutionId}/stats`
  //       : '/institutes/stats'

  //     const response = await axiosInstance.get<InstitutionStats[]>(url)
  //     return response.data
  //   } catch (error) {
  //     console.error('Failed to fetch stats:', error)
  //     if (error instanceof Error) {
  //       throw error
  //     }
  //     throw new Error('Failed to fetch statistics. Please try again.')
  //   }
  // }
};
