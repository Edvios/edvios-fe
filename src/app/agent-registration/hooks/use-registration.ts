import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { AgentRegistrationData } from '../types/registation.types';
import AppToast from '@/utils/toast-utils';
import { isAxiosError } from 'axios';
import { submitAgentRegistration } from '../apis/registration.api';
import { logout } from '@/app/auth/login/api/auth.api';
import axiosInstance from '@/lib/axios';

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
    agentName: '',
    countryOfRegistration: '',
    yearEstablished: '',
    websiteUrl: '',
    officeAddress: '',
    calendlyLink: '',

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

    // Load saved form data and restore progress on component mount
    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        const loadUserData = async () => {
            try {
                // First, ensure user session is available
                let userSession = sessionStorage.getItem('user-session');
                if (!userSession) {
                    // Fetch from API if not in sessionStorage
                    try {
                        const response = await axiosInstance.get('/auth/me');
                        sessionStorage.setItem('user-session', JSON.stringify(response.data));
                        userSession = JSON.stringify(response.data);
                        console.log('Fetched and saved user session from API');
                    } catch (error) {
                        console.error('Failed to fetch user data from API:', error);
                    }
                }

                // Then, try to restore saved form data
                const savedFormData = sessionStorage.getItem('agent-registration-form');
                const savedStep = sessionStorage.getItem('agent-registration-step');
                
                if (savedFormData) {
                    try {
                        const parsedFormData = JSON.parse(savedFormData);
                        console.log('Restoring saved agent registration form data');
                        setFormData(parsedFormData);
                    } catch (error) {
                        console.error('Failed to parse saved form data:', error);
                    }
                }
                
                if (savedStep) {
                    try {
                        const step = parseInt(savedStep);
                        if (!isNaN(step) && step >= 1 && step <= totalSteps) {
                            setCurrentStep(step);
                        }
                    } catch (error) {
                        console.error('Failed to parse saved step:', error);
                    }
                }
                
                // Autofill user data from session storage if no saved form data
                if (userSession && !savedFormData) {
                    try {
                        const userData = JSON.parse(userSession);
                        
                        setFormData(prev => ({
                            ...prev,
                            contactPersonName: (
                                `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 
                                userData.name || 
                                userData.fullName || 
                                prev.contactPersonName
                            ),
                            officialEmail: userData.email || prev.officialEmail,
                            phoneNumber: userData.phone || userData.phoneNumber || prev.phoneNumber,
                        }));
                    } catch (error) {
                        console.error('Failed to parse user session data:', error);
                    }
                }
            } catch (error) {
                console.error('Failed to load user data:', error);
            }
        };
        
        loadUserData();
    }, []);

    // Save form data to sessionStorage whenever it changes
    useEffect(() => {
        if (typeof window !== 'undefined' && formData !== initialFormData) {
            sessionStorage.setItem('agent-registration-form', JSON.stringify(formData));
        }
    }, [formData]);

    // Save current step to sessionStorage whenever it changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('agent-registration-step', currentStep.toString());
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
            case 1: // Agency Details
                if (!formData.legalName || !formData.countryOfRegistration || !formData.officeAddress || !formData.yearEstablished || !formData.agentName) {
                    AppToast.error('Please fill in all required agency details');
                    return false;
                }
                const yearEstablished = parseInt(formData.yearEstablished);
                if (isNaN(yearEstablished) || yearEstablished < 1900 || yearEstablished > new Date().getFullYear()) {
                    AppToast.error('Please enter a valid established year');
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
                const averageStudentsPerYearLast2Years = parseInt(formData.averageStudentsPerYearLast2Years);
                    if (isNaN(averageStudentsPerYearLast2Years) || averageStudentsPerYearLast2Years < 0) {
                    AppToast.error('Please enter a valid average students per year');
                    return false;
                }
                break;
            case 5: // Services
                if (!formData.numberOfCounsellors || formData.servicesProvided.length === 0) {
                    AppToast.error('Please specify services provided and team size');
                    return false;
                }
                const numberOfCounsellors = parseInt(formData.numberOfCounsellors);
                    if (isNaN(numberOfCounsellors) || numberOfCounsellors < 0) {
                    AppToast.error('Please enter a valid number of counsellors');
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
                const response = await submitAgentRegistration(formData);

                console.log('Registration response:', response);
                AppToast.success('Registration successful!');
                AppToast.info('Please log in again to access your account.');

                // Clear saved form data from sessionStorage
                if (typeof window !== 'undefined') {
                    sessionStorage.removeItem('agent-registration-form');
                    sessionStorage.removeItem('agent-registration-step');
                }

                if (onSubmit) onSubmit(formData);
                if (onClose) onClose();

                // Logout to clear partial registration session and redirect to login
                logout().catch(console.error);

                setTimeout(() => {
                    router.push('/auth/login');
                }, 2000);

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
