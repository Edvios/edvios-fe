import { z } from "zod";

const studentProfileSchema = z.object({
  // Identity
  id: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  fullName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),

  // Personal
  dob: z.string().optional(),
  nationality: z.string().optional(),
  address: z.string().optional(),
  adress: z.string().optional(), // backend typo safety
  currentCountry: z.string().optional(),
  currentCity: z.string().optional(),

  // Academic & Background
  currentEducationLevel: z.string().optional(),
  currentInstitution: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  gpa: z.number().optional(),
  graduationDate: z.string().optional(),

  // Preferences
  preferredDestination: z.string().optional(),
  preferredProgram: z.string().optional(),
  preferredStudyLevel: z.string().optional(),
  preferredIntake: z.string().optional(),

  // English & Identity
  englishTest: z.string().optional(),
  englishScore: z.string().optional(),
  hasValidPassport: z.boolean().optional(),

  // Document readiness
  hasAcademicTranscripts: z.boolean().optional(),
  hasRecommendationLetters: z.boolean().optional(),
  hasPersonalStatement: z.boolean().optional(),

  // Narrative
  workExperience: z.string().optional(),
  extraCurricular: z.string().optional(),
  careerGoals: z.string().optional(),

  // Communication & CRM
  referralSource: z.string().optional(),
  preferredContactMethod: z.string().optional(),
  bestTimeToContact: z.string().optional(),
  additionalQuestions: z.string().optional(),

  // Other fields
  budgetRange: z.string().optional(),
  scholarshipInterest: z.boolean().optional(),
  marketingConsent: z.boolean().optional(),
});

export type StudentProfileDto = z.infer<typeof studentProfileSchema>;
export { studentProfileSchema };

export function sanitizeStudentPayload(payload: Partial<StudentProfileDto>) {
  const parsed = studentProfileSchema.safeParse(payload);
  if (!parsed.success) return payload;
  return parsed.data;
}
