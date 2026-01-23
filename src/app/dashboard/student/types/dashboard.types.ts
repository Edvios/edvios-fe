import {
  applicationSchema,
  documentSchema,
  enrolledProgramSchema,
  interviewSchema,
  statCardSchema,
} from "../dtos/dashboard.dto";

export type StatCard = import("zod").infer<typeof statCardSchema>;
export type Application = import("zod").infer<typeof applicationSchema>;
export type Interview = import("zod").infer<typeof interviewSchema>;
export type DocumentItem = import("zod").infer<typeof documentSchema>;
export type EnrolledProgram = import("zod").infer<typeof enrolledProgramSchema>;
