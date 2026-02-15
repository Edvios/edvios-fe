import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { StudentRegistrationData } from '../types';
import type { RegistrationResponseDto } from '../dtos/registration.dto';
import { submitStudentRegistration } from '../api/registration.api';
import AppToast from '@/utils/toast-utils';
import { logout } from '@/app/auth/login/api/auth.api';
import axiosInstance from '@/lib/axios';

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

  // Load saved form data and restore progress on component mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initializeFlow = async () => {
      try {
        // 1. Try to restore saved form data and step
        const savedFormData = sessionStorage.getItem('student-registration-form');
        const savedStep = sessionStorage.getItem('student-registration-step');

        if (savedFormData) {
          try {
            const parsedData = JSON.parse(savedFormData);
            setFormData(prev => ({ ...prev, ...parsedData }));
          } catch (e) {
            console.error('Failed to parse saved form data', e);
          }
        }

        if (savedStep) {
          const step = parseInt(savedStep);
          if (!isNaN(step) && step >= 1 && step <= totalSteps) {
            setCurrentStep(step);
          }
        }

        // 2. Load/Fetch user session
        let userSession = sessionStorage.getItem('user-session');
        let userData = null;

        if (userSession) {
          try {
            userData = JSON.parse(userSession);
          } catch (e) {
            console.error('Failed to parse user session', e);
          }
        }

        if (!userData) {
          try {
            const response = await axiosInstance.get('/auth/me');
            userData = response.data;
            sessionStorage.setItem('user-session', JSON.stringify(userData));
          } catch (e) {
            console.error('Failed to fetch user data', e);
          }
        }

        // 3. Handle verification redirect and autofill
        if (userData) {
          if (userData.emailVerified === false) {
            AppToast.info("Please verify your email first");
            router.replace(`/auth/verify-request?email=${encodeURIComponent(userData.email)}`);
            return;
          }

          // Autofill profile info if it's currently empty
          setFormData(prev => ({
            ...prev,
            firstName: prev.firstName || userData.firstName || '',
            lastName: prev.lastName || userData.lastName || '',
            email: prev.email || userData.email || '',
            phone: prev.phone || userData.phone || '',
          }));
        }
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    initializeFlow();
  }, [router, totalSteps]);

  // Save form data to sessionStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && formData !== initialFormData) {
      sessionStorage.setItem('student-registration-form', JSON.stringify(formData));
    }
  }, [formData]);

  // Save current step to sessionStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('student-registration-step', currentStep.toString());
    }
  }, [currentStep]);

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
          !formData.nationality || !formData.currentCountry || !formData.email ||
          !formData.phone || !formData.passportNumber || !formData.passportExpiryDate || !formData.emergencyContactNumber) {
          AppToast.error('Please fill in all required personal details');
          return false;
        }
        break;
      case 2:
        if (!formData.currentEducationLevel || !formData.yearOfCompletion || !formData.currentInstitution || !formData.englishTest) {
          AppToast.error('Please fill in all required academic details');
          return false;
        }

        const yearOfCompletion = parseInt(formData.yearOfCompletion);
        if (isNaN(yearOfCompletion) || yearOfCompletion < 1900 || yearOfCompletion > new Date().getFullYear() + 10) {
          AppToast.error('Please enter a valid completion year');
          return false;
        }

        // Only validate score if a test other than 'NONE' is selected
        if (['IELTS', 'PTE', 'DUOLINGO', 'TOEFL'].includes(formData.englishTest)) {
          if (!formData.englishScore) {
            AppToast.error('Please enter your English proficiency score');
            return false;
          }
          const englishScore = parseFloat(formData.englishScore);
          if (isNaN(englishScore) || englishScore < 0) {
            AppToast.error('Please enter a valid English score');
            return false;
          }
        }
        break;
      case 3:
        if (formData.preferredDestination.length === 0 || !formData.preferredProgram || !formData.preferredStudyLevel || !formData.estimatedBudget) {
          AppToast.error('Please fill in all required study details');
          return false;
        }
        const estimatedBudget = parseInt(formData.estimatedBudget);
        if (isNaN(estimatedBudget) || estimatedBudget < 0) {
          AppToast.error('Please enter a valid estimated budget');
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

        const result = await submitStudentRegistration(formData);
        setResponse(result);

        if (result) {
          AppToast.success(`Registration successful!`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          AppToast.info('Please log in again to access your dashboard.');

          // Clear saved form data from sessionStorage
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('student-registration-form');
            sessionStorage.removeItem('student-registration-step');
          }

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
