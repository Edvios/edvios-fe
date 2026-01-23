import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { StudentRegistrationData } from '../types/registration.types';
import type { RegistrationResponseDto } from '../dtos/registration.dto';
import { submitStudentRegistration } from '../apis/registration.api';
import AppToast from '@/utils/toast-utils';

interface UseRegistrationReturn {
  // State
  currentStep: number;
  formData: StudentRegistrationData;
  isSubmitting: boolean;
  error: string | null;
  response: RegistrationResponseDto | null;
  totalSteps: number;
  progressPercentage: number;
  
  // Functions
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
  currentEducationLevel: '',
  currentInstitution: '',
  fieldOfStudy: '',
  gpa: '',
  graduationDate: '',
  preferredDestination: '',
  preferredProgram: '',
  preferredStudyLevel: '',
  preferredIntake: '',
  englishTest: '',
  englishScore: '',
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
  budgetRange: '',
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

  const totalSteps = 5;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const handleInputChange = (field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.firstName || !formData.lastName || !formData.dob || !formData.email || !formData.phone ) {
          AppToast.error('Please fill in all required details');
          return false;
        }
        break;
      case 2:
        if (!formData.currentEducationLevel || !formData.fieldOfStudy) {
          AppToast.error('Please fill in all required details');
          return false;
        }
        break;
      case 3:
        if (!formData.preferredDestination || !formData.preferredProgram || !formData.preferredStudyLevel) {
          AppToast.error('Please fill in all required details');
          return true;
        }
        break;
      case 5:
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
        
          if (onSubmit) {
            onSubmit(formData);
          }
          if (onClose) {
            onClose();
          }
          setTimeout(() => {
            router.push('/dashboard/student');
          }, 1500);
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

  // Show error toast when error state changes
  useEffect(() => {
    if (error) {
      AppToast.error(error);
    }
  }, [error]);

  return {
    // State
    currentStep,
    formData,
    isSubmitting,
    error,
    response,
    totalSteps,
    progressPercentage,
    
    // Functions
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
