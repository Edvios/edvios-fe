export interface StudentRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  nationality: string;
  

  gender: string;
  passportNumber: string;
  passportExpiryDate: string;
  emergencyContactName: string;
  emergencyContactNumber: string; 
  // Academic
  currentEducationLevel: string; 
  currentInstitution: string; 
  fieldOfStudy: string; 

  yearOfCompletion: string;
  mediumOfInstruction: string;
  gpa: string; 
  academicCertificates: string[]; // Cloudinary URLs
  
    // English
  englishTest: string;
  englishScore: string;
  testExpiryDate: string;

  // Preferences
  preferredDestination: string[]; 
  preferredProgram: string; 
  preferredStudyLevel: string;
  preferredIntake: string;
  estimatedBudget: string; 
  fundingSource: string;

  // Visa / Immigration
  previousVisaRefusal: boolean;
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
