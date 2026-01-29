export interface StudentProfile {
  id?: string;
  fullName?: string;

  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;

  dob?: string;
  nationality?: string;

  address?: string;
  adress?: string; // backend typo safety

  currentInstitution?: string;
  currentEducationLevel?: string;

  fieldOfStudy?: string;
  gpa?: number;

  preferredProgram?: string;
  preferredDestination?: string;

  // Additional fields present in DTO/schema
  graduationDate?: string;
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
  // New fields to match Student model
  currentCountry?: string;
  currentCity?: string;
  budgetRange?: string;
  scholarshipInterest?: boolean;
  marketingConsent?: boolean;
}
