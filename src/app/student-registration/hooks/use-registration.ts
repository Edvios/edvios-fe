import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { StudentRegistrationData } from '../types';
import type { RegistrationResponseDto } from '../dtos/registration.dto';
import { submitStudentRegistration } from '../api/registration.api';
import AppToast from '@/utils/toast-utils';
import { logout } from '@/app/auth/login/api/auth.api';

interface UseRegistrationReturn {
  currentStep: number;
  formData: StudentRegistrationData;
  isSubmitting: boolean;
  error: string | null;
  response: RegistrationResponseDto | null;
  totalSteps: number;
  progressPercentage: number;

  setCurrentStep: (step: number | ((prev: number) => number)) => void;
  handleInputChange: (field: string, value: unknown) => void;
  handleNextStep: () => void;
  handlePrevStep: () => void;
  validateCurrentStep: () => boolean;
  handleSubmit: (onSubmit?: (data: StudentRegistrationData) => void, onClose?: () => void) => Promise<void>;
  handleAIAssistance: () => void;
  resetError: () => void;
}

const initialFormData: StudentRegistrationData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  nationality: '',
  gender: '',
  passportNumber: '',
  passportExpiryDate: '',
  emergencyContactName: '',
  emergencyContactNumber: '',

  currentEducationLevel: '',
  currentInstitution: '',
  fieldOfStudy: '',
  yearOfCompletion: '',
  mediumOfInstruction: '',
  gpa: '',
  academicCertificates: [],

  englishTest: '',
  englishScore: '',
  testExpiryDate: '',

  preferredDestination: [],
  preferredProgram: '',
  preferredStudyLevel: '',
  preferredIntake: '',
  estimatedBudget: '',
  fundingSource: '',

  previousVisaRefusal: false,
  visaRefusalDetails: '',
  travelHistory: '',
  ongoingImmigrationApps: '',

  hasValidPassport: false,
  hasAcademicTranscripts: false,
  hasRecommendationLetters: false,
  hasPersonalStatement: false,
  workExperience: '',
  extraCurricular: '',
  careerGoals: '',
  referralSource: '',
  preferredContactMethod: '',
  bestTimeToContact: '',
  additionalQuestions: '',
  dob: '',
  currentCountry: '',
  currentCity: '',
  scholarshipInterest: false,
  marketingConsent: false,
  termsAccepted: false
};

export const useRegistration = (): UseRegistrationReturn => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<StudentRegistrationData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<RegistrationResponseDto | null>(null);

  const totalSteps = 6;
  const progressPercentage = (currentStep / totalSteps) * 100;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userSession = sessionStorage.getItem('user-session');
      if (userSession) {
        try {
          const userData = JSON.parse(userSession);
          setFormData(prev => ({
            ...prev,
            firstName: userData.firstName || prev.firstName,
            lastName: userData.lastName || prev.lastName,
            email: userData.email || prev.email,
            phone: userData.phone || prev.phone,
          }));
        } catch (error) {
          console.error('Failed to parse user session data:', error);
        }
      }
    }
  }, []);

  const handleInputChange = (field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.firstName || !formData.lastName || !formData.dob || !formData.gender ||
          !formData.email || !formData.phone || !formData.passportNumber || !formData.passportExpiryDate) {
          AppToast.error('Please fill in all required personal details');
          return false;
        }
        break;
      case 2:
        if (!formData.currentEducationLevel || !formData.yearOfCompletion || !formData.currentInstitution) {
          AppToast.error('Please fill in all required academic details');
          return false;
        }
        break;
      case 3:
        if (formData.preferredDestination.length === 0 || !formData.preferredProgram || !formData.preferredStudyLevel || !formData.estimatedBudget) {
          AppToast.error('Please fill in all required study details');
          return false;
        }
        break;
      case 4:
        // Visa History
        if (formData.previousVisaRefusal && !formData.visaRefusalDetails) {
          AppToast.error('Please provide details for visa refusal');
          return false;
        }
        break;
      case 6:
        if (!formData.termsAccepted) {
          AppToast.error('Please accept the terms and conditions');
          return false;
        }
        break;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (onSubmit?: (data: StudentRegistrationData) => void, onClose?: () => void) => {
    if (validateCurrentStep()) {
      setIsSubmitting(true);
      setError(null);
      setResponse(null);

      try {
        console.log('Submitting registration with data:', formData);
        const result = await submitStudentRegistration(formData);
        setResponse(result);

        if (result) {
          AppToast.success(`Registration successful!`);
          AppToast.info('Please log in again to access your dashboard.');

          if (onSubmit) {
            onSubmit(formData);
          }
          if (onClose) {
            onClose();
          }

          // Logout to clear partial registration session and redirect to login
          logout().catch(console.error);

          setTimeout(() => {
            router.push('/auth/login');
          }, 2000);
        } else {
          console.error('Registration failed:');
          setError('Registration failed');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMessage);
        console.error('Registration failed:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleAIAssistance = () => {
    AppToast.info('AI advisor is ready to help you complete this form. What would you like assistance with?');
  };

  const resetError = () => {
    setError(null);
  };

  useEffect(() => {
    if (error) {
      AppToast.error(error);
    }
  }, [error]);

  return {
    currentStep,
    formData,
    isSubmitting,
    error,
    response,
    totalSteps,
    progressPercentage,

    setCurrentStep,
    handleInputChange,
    handleNextStep,
    handlePrevStep,
    validateCurrentStep,
    handleSubmit,
    handleAIAssistance,
    resetError,
  };
};
