import axiosInstance from '../../../lib/axios';
import {
  createStudentDtoSchema,
  type CreateStudentDto,
  type RegistrationResponseDto
} from '../dtos/registration.dto';
import type { StudentRegistrationData } from '../types';

const capitalizeFirstLetter = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};

const parseIntake = (intake: string) => {
  if (!intake || intake === 'flexible') return { month: null, year: null };
  const parts = intake.split('-');
  if (parts.length === 2) {
    const monthName = parts[0].toLowerCase();
    const year = parseInt(parts[1]);
    const monthMap: Record<string, number> = {
      january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
      july: 7, august: 8, september: 9, october: 10, november: 11, december: 12
    };
    return { month: monthMap[monthName] || null, year: !isNaN(year) ? year : null };
  }
  return { month: null, year: null };
};

export const submitStudentRegistration = async (
  formData: StudentRegistrationData
): Promise<RegistrationResponseDto> => {
  try {
    const { month: intendedIntakeMonth, year: intendedIntakeYear } = parseIntake(formData.preferredIntake);

    const notesParts = [];
    if (formData.workExperience) notesParts.push(`Work Exp: ${formData.workExperience}`);
    if (formData.extraCurricular) notesParts.push(`Extra Curricular: ${formData.extraCurricular}`);
    if (formData.careerGoals) notesParts.push(`Career Goals: ${formData.careerGoals}`);
    if (formData.referralSource) notesParts.push(`Referral: ${formData.referralSource}`);
    if (formData.preferredContactMethod) notesParts.push(`Pref Contact: ${formData.preferredContactMethod}`);
    if (formData.bestTimeToContact) notesParts.push(`Best Time: ${formData.bestTimeToContact}`);
    if (formData.additionalQuestions) notesParts.push(`Questions: ${formData.additionalQuestions}`);
    const docsReady = [];
    if (formData.hasValidPassport) docsReady.push('Passport');
    if (formData.hasAcademicTranscripts) docsReady.push('Transcripts');
    if (formData.hasRecommendationLetters) docsReady.push('Rec Letters');
    if (formData.hasPersonalStatement) docsReady.push('Personal Statement');
    if (docsReady.length > 0) notesParts.push(`Docs Ready: ${docsReady.join(', ')}`);

    const notes = notesParts.length > 0 ? notesParts.join('\n') : null;

    const dtoData: CreateStudentDto = {
      // Personal
      firstName: formData.firstName ? capitalizeFirstLetter(formData.firstName) : null,
      lastName: formData.lastName ? capitalizeFirstLetter(formData.lastName) : null,
      dob: formData.dob || null,
      gender: formData.gender || null, 
      nationality: formData.nationality || null,
      passportNumber: formData.passportNumber || null,
      passportExpiryDate: formData.passportExpiryDate || null,
      countryOfResidence: formData.currentCountry || null,

      // Contact
      email: formData.email || null,
      phone: formData.phone || null,
      emergencyContact: (formData.emergencyContactName || formData.emergencyContactNumber)
        ? `${formData.emergencyContactName} (${formData.emergencyContactNumber})`
        : null,
      address: formData.address || null,

      // Academic
      highestQualification: formData.currentEducationLevel || null,
      yearOfCompletion: formData.yearOfCompletion ? parseInt(formData.yearOfCompletion) : null,
      institutionName: formData.currentInstitution || null,
      mediumOfInstruction: formData.mediumOfInstruction || null,
      gradesSummary: formData.gpa || null,
      academicCertificates: formData.academicCertificates.length > 0 ? formData.academicCertificates : [],

      // English
      englishTestTaken: formData.englishTest || null,
      overallScore: formData.englishScore ? parseFloat(formData.englishScore) : null,
      testExpiryDate: formData.testExpiryDate || null,

      // Study Prefs
      intendedIntakeMonth: intendedIntakeMonth,
      intendedIntakeYear: intendedIntakeYear,
      preferredCountries: formData.preferredDestination.length > 0 ? formData.preferredDestination : null,
      preferredStudyLevel: formData.preferredStudyLevel || null,
      preferredFieldOfStudy: formData.preferredProgram || null, 
      estimatedBudget: formData.estimatedBudget ? parseFloat(formData.estimatedBudget) : null,
      fundingSource: formData.fundingSource || null,

      // Visa
      previousVisaRefusal: formData.previousVisaRefusal,
      visaRefusalDetails: formData.visaRefusalDetails || null,
      travelHistory: formData.travelHistory || null,
      ongoingImmigrationApps: formData.ongoingImmigrationApps || null,

      // Internal
      notes: notes,
    };

    const validation = createStudentDtoSchema.safeParse(dtoData);

    if (!validation.success) {
      const errorMessages = validation.error.issues
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('; ');
      throw new Error(`Validation failed: ${errorMessages}`);
    }

    console.log('Submitting registration:', validation.data);

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
