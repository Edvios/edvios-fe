export interface StudentProfile {
  userId?: string;
  firstName?: string;
  lastName?: string;
  nationality?: string;
  currentEducationLevel?: string;
  currentInstitution?: string;
  fieldOfStudy?: string;
  gpa?: number;
  graduationDate?: string; // ISO string
  dob?: string; // ISO string for date of birth
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
  // Note: some DB rows may use the misspelled `adress` column — keep both for compatibility
  adress?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
}
