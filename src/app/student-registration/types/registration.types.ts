export interface StudentRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  nationality: string;
  
  // New Personal Fields
  gender: string;
  passportNumber: string;
  passportExpiryDate: string;
  emergencyContactName: string; // specific field for name
  emergencyContactNumber: string; // specific field for number - will combine for backend or use one field if backend expects string

  // Academic
  currentEducationLevel: string; // maps to highestQualification
  currentInstitution: string; // maps to institutionName
  fieldOfStudy: string; // maps to fieldOfStudy (not preferred) - Wait, in DTO there is no fieldOfStudy in Academic background, only preferredFieldOfStudy in StudyPrefs.
  // Actually DTO says: 
  // highestQualification: string;
  // yearOfCompletion?: number | null;
  // institutionName: string;
  // mediumOfInstruction?: string | null;
  // gradesSummary?: string | null;
  // academicCertificates?: string[];

  // So fieldOfStudy in "Academic Background" (step 2) might be mapped to notes or just not used in backend? 
  // Ah, DTO has `preferredFieldOfStudy` but that's for preferences.
  // The current UI has `fieldOfStudy` in step 2. I'll keep it for UI state but maybe map it to notes or ignore if backend doesn't want it.
  
  yearOfCompletion: string;
  mediumOfInstruction: string;
  gpa: string; // maps to gradesSummary
  academicCertificates: File[]; // For UI state
  
  // English
  englishTest: string;
  englishScore: string;
  testExpiryDate: string;

  // Preferences
  preferredDestination: string[]; // Changed to array
  preferredProgram: string; // preferredFieldOfStudy
  preferredStudyLevel: string;
  preferredIntake: string;
  estimatedBudget: string; // Changed to string to handle input, will parse to number
  fundingSource: string;

  // Visa / Immigration
  previousVisaRefusal: boolean; // "Yes/No"
  visaRefusalDetails: string;
  travelHistory: string;
  ongoingImmigrationApps: string;

  // Legacy/UI fields
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
