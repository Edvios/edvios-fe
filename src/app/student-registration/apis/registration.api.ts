import { 
  STUDENTRegistrationDtoSchema,
  type StudentRegistrationDto,
  type RegistrationResponseDto
} from '../dtos/registration.dto';
import type { StudentRegistrationData } from '../types/registration.types';

// Mock API URL - replace with your actual API endpoint
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
console.log('API_BASE_URL:', API_BASE_URL);
/**
 * Submit STUDENT registration
 */
export const submitStudentRegistration = async (
  formData: StudentRegistrationData
): Promise<RegistrationResponseDto> => {
  try {
    // Transform flat form data to structured DTO format
    const dtoData: StudentRegistrationDto = {
      personalInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        nationality: formData.nationality,
        currentCountry: formData.currentCountry,
        currentCity: formData.currentCity,
      },
      academicBackground: {
        currentEducationLevel: formData.currentEducationLevel,
        currentInstitution: formData.currentInstitution,
        fieldOfStudy: formData.fieldOfStudy,
        gpa: formData.gpa,
        graduationDate: formData.graduationDate,
        englishProficiency: formData.englishProficiency,
        ieltsScore: formData.ieltsScore,
        toeflScore: formData.toeflScore,
      },
      studyPreferences: {
        preferredDestination: formData.preferredDestination,
        preferredProgram: formData.preferredProgram,
        studyLevel: formData.studyLevel,
        preferredIntake: formData.preferredIntake,
        budgetRange: formData.budgetRange,
        scholarshipInterest: formData.scholarshipInterest,
      },
      documentReadiness: {
        hasPassport: formData.hasPassport,
        hasTranscripts: formData.hasTranscripts,
        hasRecommendationLetters: formData.hasRecommendationLetters,
        hasPersonalStatement: formData.hasPersonalStatement,
        workExperience: formData.workExperience,
        extracurriculars: formData.extracurriculars,
        careerGoals: formData.careerGoals,
      },
      additionalInfo: {
        howDidYouHear: formData.howDidYouHear,
        additionalRequirements: formData.additionalRequirements,
        preferredContactMethod: formData.preferredContactMethod,
        bestTimeToContact: formData.bestTimeToContact,
        marketingConsent: formData.marketingConsent,
        termsAccepted: formData.termsAccepted,
      },
    };

    // Validate using Zod schema
    const validation = STUDENTRegistrationDtoSchema.safeParse(dtoData);

    if (!validation.success) {
      const errorMessages = validation.error.issues
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('; ');
      throw new Error(`Validation failed: ${errorMessages}`);
    }

    // Mock API call - replace with actual fetch/axios call
    // Example:
    // const response = await fetch(`${API_BASE_URL}/STUDENT-registration`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(validation.data),
    // });
    // if (!response.ok) {
    //   throw new Error('Failed to submit registration');
    // }
    // return await response.json();

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock success response
    console.log('Submitting registration:', validation.data);

    // Simulate successful registration
    return {
      success: true,
      message: 'Registration submitted successfully!',
      data: {
        registrationId: `REG-${Date.now()}`,
        STUDENTId: `STU-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      },
    };
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to submit registration. Please try again.');
  }
};
