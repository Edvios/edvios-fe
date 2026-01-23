import { z } from "zod";
import { StudentProfile } from "../types/profile.types";

const studentProfileSchema = z.object({
  userId: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  nationality: z.string().optional(),
  currentEducationLevel: z.string().optional(),
  currentInstitution: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  gpa: z.number().optional(),
  graduationDate: z.string().optional(),
  dob: z.string().optional(),
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
  // accept both correct and misspelled address fields
  adress: z.string().optional(),
  // legacy display
  fullName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});
// Use an empty default object — real data comes from the API backed by Supabase
const studentProfileData: Partial<StudentProfile> = {};

export const studentProfileDto: StudentProfile = studentProfileSchema.parse(studentProfileData);
