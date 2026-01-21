export interface StudentProfile {
  userId?: string;
  nationality?: string;
  currentEducationLevel?: string;
  currentInstitution?: string;
  fieldOfStudy?: string;
  gpa?: number;
  graduationDate?: string; // ISO string
  preferredDestination?: string;
  preferredProgram?: string;
  preferredStudyLevel?: string;
  preferredIntake?: string;
  englishTest?: string;
  englishScore?: string;
  hasValidPassport?: boolean;
  hasAcademicTranscripts?: boolean;
  hasRecommendationLetters?: boolean;
  hasPersonalStatement?: boolean;
  workExperience?: string;
  extraCurricular?: string;
  careerGoals?: string;
  referralSource?: string;
  preferredContactMethod?: string;
  bestTimeToContact?: string;
  additionalQuestions?: string;
  // legacy / display fields
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
}
