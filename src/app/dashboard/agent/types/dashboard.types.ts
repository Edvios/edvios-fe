import z from "zod";
import { AgentApplicationSchema, ApplicationStatusCountSchema, DashboardStatsSchema, TotalApplicationsSchema } from "../dtos/dashboard.dto";


export type AgentApplication = z.infer<typeof AgentApplicationSchema>;

export type ApplicationStatusCount = z.infer<
  typeof ApplicationStatusCountSchema
>;

export type TotalApplications = z.infer<
  typeof TotalApplicationsSchema
>;

export type DashboardStats = z.infer<
  typeof DashboardStatsSchema
>;
