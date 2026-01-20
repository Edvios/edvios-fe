export interface StudentRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  currentCountry: string;
  currentCity: string;
  currentEducationLevel: string;
  currentInstitution: string;
  fieldOfStudy: string;
  gpa: string;
  graduationDate: string;
  englishProficiency: string;
  ieltsScore: string;
  toeflScore: string;
  preferredDestination: string;
  preferredProgram: string;
  studyLevel: string;
  preferredIntake: string;
  budgetRange: string;
  scholarshipInterest: boolean;
  hasPassport: boolean;
  hasTranscripts: boolean;
  hasRecommendationLetters: boolean;
  hasPersonalStatement: boolean;
  workExperience: string;
  extracurriculars: string;
  careerGoals: string;
  howDidYouHear: string;
  additionalRequirements: string;
  preferredContactMethod: string;
  bestTimeToContact: string;
  marketingConsent: boolean;
  termsAccepted: boolean;
}

export interface StudentRegistrationResponse {
  success: boolean;
  message: string;
  data?: {
    registrationId: string;
    studentId: string;
  };
}
