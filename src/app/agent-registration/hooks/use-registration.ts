import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { AgentRegistrationData} from '../types/registration.types';
import { submitAgentRegistration } from '../apis/registration.api';
import AppToast from '@/utils/toast-utils';
import { isAxiosError } from 'axios';

// ... (previous imports)

interface UseAgentRegistrationReturn {
    // State
    currentStep: number;
    formData: AgentRegistrationData;
    isSubmitting: boolean;
    error: string | null;
    totalSteps: number;
    progressPercentage: number;

    // Functions
    setCurrentStep: (step: number | ((prev: number) => number)) => void;
    handleInputChange: (field: string, value: unknown) => void;
    handleNextStep: () => void;
    handlePrevStep: () => void;
    handleSubmit: (onSubmit?: (data: AgentRegistrationData) => void, onClose?: () => void) => Promise<void>;
    handleAIAssistance: () => void;
    resetError: () => void;
}

const initialFormData: AgentRegistrationData = {
    legalName: '',
    tradingName: '',
    countryOfRegistration: '',
    yearEstablished: '',
    websiteUrl: '',
    officeAddress: '',

    contactPersonName: '',
    designation: '',
    officialEmail: '',
    phoneNumber: '',

    businessRegistrationNumber: '',
    businessRegistrationCertificate: '', // URL
    officeAddressProof: '', // URL

    registeredWithEducationCouncils: false,
    workingWithUkInstitutions: false,
    workingWithCanadaInstitutions: false,
    workingWithAustraliaInstitutions: false,

    primaryStudentMarkets: [],
    averageStudentsPerYearLast2Years: '',
    mainDestinations: [],

    typicalStudentProfileStrength: '',
    inHouseVisaSupport: false,
    numberOfCounsellors: '',

    servicesProvided: [],
    reasonToUseEdvios: '',
    interestedFeatures: [],
    openToPilotUsage: false,

    termsAccepted: false,
    marketingConsent: false,
};

export const useAgentRegistration = (): UseAgentRegistrationReturn => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<AgentRegistrationData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const totalSteps = 6;
    const progressPercentage = (currentStep / totalSteps) * 100;

    // Autofill user data from session storage on component mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userSession = sessionStorage.getItem('user-session');
            if (userSession) {
                try {
                    const userData = JSON.parse(userSession);
                    setFormData(prev => ({
                        ...prev,
                        contactPersonName: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || prev.contactPersonName,
                        officialEmail: userData.email || prev.officialEmail,
                        phoneNumber: userData.phone || prev.phoneNumber,
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
            case 1: // Agency Details
                if (!formData.legalName || !formData.countryOfRegistration || !formData.officeAddress || !formData.yearEstablished) {
                    AppToast.error('Please fill in all required agency details');
                    return false;
                }
                break;
            case 2: // Contact Info
                if (!formData.contactPersonName || !formData.officialEmail || !formData.phoneNumber) {
                    AppToast.error('Please fill in all required contact details');
                    return false;
                }
                break;
            case 3: // Business Verification
                if (!formData.businessRegistrationNumber) {
                    AppToast.error('Please provide business registration number');
                    return false;
                }
                break;
            case 4: // Operational Profile
                if (formData.primaryStudentMarkets.length === 0 || !formData.averageStudentsPerYearLast2Years) {
                    AppToast.error('Please provide market and student details');
                    return false;
                }
                break;
            case 5: // Services
                if (!formData.numberOfCounsellors || formData.servicesProvided.length === 0) {
                    AppToast.error('Please specify services provided and team size');
                    return false;
                }
                break;
            case 6: // Final Step - Engagement
                if (!formData.reasonToUseEdvios) {
                    AppToast.error('Please tell us why you want to use Edvios');
                    return false;
                }
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

    const handleSubmit = async (onSubmit?: (data: AgentRegistrationData) => void, onClose?: () => void) => {
        if (validateCurrentStep()) {
            setIsSubmitting(true);
            setError(null);

            try {
                console.log('Submitting agent registration with data:', formData);

                // Call API
                AppToast.success('Registration successful! Your account is pending admin approval.');

                if (onSubmit) onSubmit(formData);
                if (onClose) onClose();

                // Redirect to login or a success page explaining the pending status
                // Using 1.5s delay to match student flow feel
                setTimeout(() => {
                    router.push('/auth/login?registered=true');
                }, 1500);

            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
                setError(errorMessage);
                console.error('Registration failed:', err);
                // Extract API error message if available
                if (isAxiosError(err) && err.response?.data?.message) {
                    AppToast.error(err.response.data.message);
                } else {
                setError('An unexpected error occurred while submitting registration.');
                    AppToast.error(errorMessage);
                }
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

    return {
        currentStep,
        formData,
        isSubmitting,
        error,
        totalSteps,
        progressPercentage,
        setCurrentStep,
        handleInputChange,
        handleNextStep,
        handlePrevStep,
        handleSubmit,
        handleAIAssistance,
        resetError,
    };
};
