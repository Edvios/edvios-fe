import { z } from "zod";
import { studentProfileData } from "../data/profile.data";
import { StudentProfile } from "../types/profile.types";

const studentProfileSchema = z.object({
  userId: z.string().optional(),
  nationality: z.string().optional(),
  currentEducationLevel: z.string().optional(),
  currentInstitution: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  gpa: z.number().optional(),
  graduationDate: z.string().optional(),
  preferredDestination: z.string().optional(),
  preferredProgram: z.string().optional(),
  preferredStudyLevel: z.string().optional(),
  preferredIntake: z.string().optional(),
  englishTest: z.string().optional(),
  englishScore: z.string().optional(),
  hasValidPassport: z.boolean().optional(),
  hasAcademicTranscripts: z.boolean().optional(),
  hasRecommendationLetters: z.boolean().optional(),
  hasPersonalStatement: z.boolean().optional(),
  workExperience: z.string().optional(),
  extraCurricular: z.string().optional(),
  careerGoals: z.string().optional(),
  referralSource: z.string().optional(),
  preferredContactMethod: z.string().optional(),
  bestTimeToContact: z.string().optional(),
  additionalQuestions: z.string().optional(),
  // legacy display
  fullName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const studentProfileDto: StudentProfile = studentProfileSchema.parse(studentProfileData);
