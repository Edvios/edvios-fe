import axiosInstance from "@/lib/axios";

export const adminAPI = {
  /**
   * Get total users count
   */
  async getTotalUsersCount(): Promise<number> {
    try {
      const response = await axiosInstance.get<{ userCount: number }>(
        "auth/users-count",
      );
      if (!response.data) {
        throw new Error("Error occured while fetching total users count");
      }

      return response.data.userCount;
    } catch (error) {
      console.error("Failed to fetch total users count:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to fetch total users count. Please try again.");
    }
  },

  /**
   * Get active agents count
   */
  async getAgentsCount(): Promise<number> {
    try {
      const response = await axiosInstance.get<{ agentCount: number }>(
        "agents/agents-count",
      );
      if (!response.data) {
        throw new Error("Error occured while fetching agents count");
      }

      return response.data.agentCount;
    } catch (error) {
      console.error("Failed to fetch agents count:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to fetch agents count. Please try again.");
    }
  },

  async getPendingAgentsCount(): Promise<number> {
    try {
      const response = await axiosInstance.get<{ pendingAgentCount: number }>(
        "agents/pending-agents-count",
      );
      if (!response.data) {
        throw new Error("Error occured while fetching pending agents count");
      }

      return response.data.pendingAgentCount;
    } catch (error) {
      console.error("Failed to fetch pending agents count:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        "Failed to fetch pending agents count. Please try again.",
      );
    }
  },

  /**
   * Get students count
   */
  async getStudentsCount(): Promise<number> {
    try {
      const response = await axiosInstance.get<{ studentCount: number }>(
        "students/students-count",
      );
      if (!response.data) {
        throw new Error("Error occured while fetching students count");
      }

      return response.data.studentCount;
    } catch (error) {
      console.error("Failed to fetch students count:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to fetch students count. Please try again.");
    }
  },

  /**
   * Get applications count
   */
  async getApplicationsCount(): Promise<number> {
    try {
      const response = await axiosInstance.get<{
        count: {
          SUBMITTED: number;
          UNDER_REVIEW: number;
          ACCEPTED: number;
          REJECTED: number;
        };
      }>("applications/count");
      if (!response.data) {
        throw new Error("Error occured while fetching applications count");
      }

      return response.data.count.SUBMITTED || 0;
    } catch (error) {
      console.error("Failed to fetch applications count:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to fetch applications count. Please try again.");
    }
  },
};
