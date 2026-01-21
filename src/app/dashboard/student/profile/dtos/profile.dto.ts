import { z } from "zod";
import { studentProfileData } from "../data/profile.data";
import { StudentProfile } from "../types/profile.types";

const personalInfoSchema = z.object({
  fullName: z.string(),
  studentId: z.string(),
  status: z.string(),
  dateOfBirth: z.string(),
  email: z.string(),
  phone: z.string(),
  address: z.string(),
});

const academicInfoSchema = z.object({
  educationLevel: z.string(),
  gpa: z.string(),
  interestedPrograms: z.array(z.string()),
  preferredCountries: z.array(z.string()),
});

const studentProfileSchema = z.object({
  personal: personalInfoSchema,
  academic: academicInfoSchema,
});

export const studentProfileDto: StudentProfile = studentProfileSchema.parse(studentProfileData);
