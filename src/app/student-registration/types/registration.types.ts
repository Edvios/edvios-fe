export interface StudentRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  nationality: string;
  currentEducationLevel: string;
  currentInstitution: string;
  fieldOfStudy: string;
  gpa: string;
  graduationDate: string;
  preferredDestination: string;
  preferredProgram: string;
  preferredStudyLevel: 'BACHELORS' | 'MASTERS' | 'PHD' | 'DIPLOMA' | '';
  preferredIntake: string;
  englishTest: string;
  englishScore: string;
  hasValidPassport: boolean;
  hasAcademicTranscripts: boolean;
  hasRecommendationLetters: boolean;
  hasPersonalStatement: boolean;
  workExperience: string;
  extraCurricular: string;
  careerGoals: string;
  referralSource: string;
  preferredContactMethod: string;
  bestTimeToContact: string;
  additionalQuestions: string;
  dob: string;
  currentCountry: string;
  currentCity: string;
  budgetRange: string;
  scholarshipInterest: boolean;
  marketingConsent: boolean;
  termsAccepted: boolean;
}

export interface StudentRegistrationResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    studentId: string;
  };
}
