import { z } from "zod";

export const statCardSchema = z.object({
  key: z.string(),
  label: z.string(),
  value: z.string(),
  change: z.string(),
  changeLabel: z.string(),
  direction: z.enum(["up", "down"]),
  accent: z.string(),
});

export const applicationSchema = z.object({
  id: z.string(),
  school: z.string(),
  program: z.string(),
  status: z.string(),
  stage: z.string(),
  date: z.string(),
  nextStep: z.string(),
});

export const interviewSchema = z.object({
  id: z.string(),
  school: z.string(),
  date: z.string(),
  timezone: z.string(),
  contact: z.string(),
  status: z.string(),
});

export const documentSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  updatedAt: z.string(),
});

export const enrolledProgramSchema = z.object({
  id: z.string(),
  school: z.string(),
  program: z.string(),
  term: z.string(),
  startDate: z.string(),
});
