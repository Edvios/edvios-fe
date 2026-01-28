import { z } from "zod";
import { ApplicationStatus } from '@/app/applications/enums/application.enum';

const ApplicationStatusEnum = z.nativeEnum(ApplicationStatus);
import { ProgramSchema } from "@/app/applications/dtos/application.dto";
import { StudentSchema } from "@/app/applications/dtos/application.dto";
import { CommentSchema } from "@/app/applications/dtos/application.dto";

export const PreferredIntakeSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const AgentApplicationSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  programId: z.string(),
  status: ApplicationStatusEnum,
  additionalNotes: z.string().nullable().optional(),
  preferredIntakeId: z.string().nullable().optional(),
  academicYear: z.string().nullable().optional(),
  appliedDate: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  student: StudentSchema,
  program: ProgramSchema,
  preferredIntake: PreferredIntakeSchema,
  comments: z.array(CommentSchema).optional().default([]),
});


export const ApplicationStatusCountSchema = z.object({
  SUBMITTED: z.number(),
  UNDER_REVIEW: z.number(),
  ACCEPTED: z.number(),
  REJECTED: z.number(),
});

export const TotalApplicationsSchema = z.object({
  count: ApplicationStatusCountSchema,
});

export const DashboardStatsSchema = z.object({
  totalStudents: z.number(),
  newUsers: z.number(),
  totalPrograms: z.number(),
  totalInstitutions: z.number(),
  totalApplications: TotalApplicationsSchema,
});


