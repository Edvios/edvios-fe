import axiosInstance from '@/lib/axios';
import { 
  createStudentDtoSchema,
  type CreateStudentDto,
  type RegistrationResponseDto
} from '../dtos/registration.dto';
import type { StudentRegistrationData } from '../types/registration.types';

/**
 * Submit student registration
 */
export const submitStudentRegistration = async (
  formData: StudentRegistrationData
): Promise<RegistrationResponseDto> => {
  try {
    // Transform form data to DTO format (convert empty strings to null)
    const dtoData: CreateStudentDto = {
      firstName: formData.firstName || null,
      lastName: formData.lastName || null,
      email: formData.email || null,
      phone: formData.phone || null,
      address: formData.address || null, 
      dob: formData.dob || null,
      nationality: formData.nationality || null,
      currentEducationLevel: formData.currentEducationLevel || null,
      currentInstitution: formData.currentInstitution || null,
      fieldOfStudy: formData.fieldOfStudy || null,
      gpa: formData.gpa ? parseFloat(formData.gpa) : null,
      graduationDate: formData.graduationDate || null,
      preferredDestination: formData.preferredDestination || null,
      preferredProgram: formData.preferredProgram || null,
      preferredStudyLevel: formData.preferredStudyLevel || null,
      preferredIntake: formData.preferredIntake || null,
      englishTest: formData.englishTest || null,
      englishScore: formData.englishScore || null,
      hasValidPassport: formData.hasValidPassport,
      hasAcademicTranscripts: formData.hasAcademicTranscripts,
      hasRecommendationLetters: formData.hasRecommendationLetters,
      hasPersonalStatement: formData.hasPersonalStatement,
      workExperience: formData.workExperience || null,
      extraCurricular: formData.extraCurricular || null,
      careerGoals: formData.careerGoals || null,
      referralSource: formData.referralSource || null,
      preferredContactMethod: formData.preferredContactMethod || null,
      bestTimeToContact: formData.bestTimeToContact || null,
      additionalQuestions: formData.additionalQuestions || null,
      currentCountry: formData.currentCountry || null,
      currentCity: formData.currentCity || null,
      budgetRange: formData.budgetRange || null,
      scholarshipInterest: formData.scholarshipInterest,
      marketingConsent: formData.marketingConsent,
    };

    // Validate using Zod schema
    const validation = createStudentDtoSchema.safeParse(dtoData);

    if (!validation.success) {
      const errorMessages = validation.error.issues
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('; ');
      throw new Error(`Validation failed: ${errorMessages}`);
    }

    console.log('Submitting registration:', validation.data);

    // Make API call
    const response = await axiosInstance.post<RegistrationResponseDto>(
      '/students',
      validation.data
    );

    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to submit registration. Please try again.');
  }
};
