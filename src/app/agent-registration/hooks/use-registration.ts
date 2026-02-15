import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { AgentRegistrationData } from '../types/registation.types';
import AppToast from '@/utils/toast-utils';
import { isAxiosError } from 'axios';
import { submitAgentRegistration } from '../apis/registration.api';
import { logout } from '@/app/auth/login/api/auth.api';
import axiosInstance from '@/lib/axios';

interface UseAgentRegistrationReturn {
    currentStep: number;
    formData: AgentRegistrationData;
    isSubmitting: boolean;
    error: string | null;
    totalSteps: number;
    progressPercentage: number;
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
    businessRegistrationCertificate: '',
    officeAddressProof: '',
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

    // 1. Initial Load: Auth Session & Draft Recovery
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const initializeData = async () => {
            try {
                // Check local session first
                let sessionRaw = sessionStorage.getItem('user-session');
                
                if (!sessionRaw) {
                    try {
                        const { data } = await axiosInstance.get('/auth/me');
                        sessionRaw = JSON.stringify(data);
                        sessionStorage.setItem('user-session', sessionRaw);
                    } catch (err) {
                        console.error("Auth check failed", err);
                    }
                }

                if (sessionRaw) {
                    const userData = JSON.parse(sessionRaw);
                    
                    // Email verification guard
                    if (userData.emailVerified === false) {
                        AppToast.info("Please verify your email first");
                        router.replace(`/auth/verify-request?email=${encodeURIComponent(userData.email)}`);
                        return;
                    }

                    // Pre-fill user data if form is empty
                    setFormData(prev => ({
                        ...prev,
                        contactPersonName: prev.contactPersonName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
                        officialEmail: prev.officialEmail || userData.email,
                        phoneNumber: prev.phoneNumber || userData.phone || userData.phoneNumber,
                    }));
                }

                // Restore Drafts
                const savedForm = sessionStorage.getItem('agent-registration-form');
                const savedStep = sessionStorage.getItem('agent-registration-step');

                if (savedForm) setFormData(JSON.parse(savedForm));
                if (savedStep) {
                    const step = parseInt(savedStep);
                    if (!isNaN(step) && step >= 1 && step <= totalSteps) setCurrentStep(step);
                }

            } catch (err) {
                console.error('Initialization error:', err);
            }
        };

        initializeData();
    }, [router]);

    // 2. Persist state changes
    useEffect(() => {
        if (formData !== initialFormData) {
            sessionStorage.setItem('agent-registration-form', JSON.stringify(formData));
        }
    }, [formData]);

    useEffect(() => {
        sessionStorage.setItem('agent-registration-step', currentStep.toString());
    }, [currentStep]);

    const handleInputChange = (field: string, value: unknown) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateCurrentStep = (): boolean => {
        const year = parseInt(formData.yearEstablished);
        const students = parseInt(formData.averageStudentsPerYearLast2Years);
        const staff = parseInt(formData.numberOfCounsellors);

        switch (currentStep) {
            case 1:
                if (!formData.legalName || !formData.countryOfRegistration || !formData.officeAddress || !formData.yearEstablished) {
                    AppToast.error('Please fill in all required agency details');
                    return false;
                }
                if (isNaN(year) || year < 1800 || year > new Date().getFullYear()) {
                    AppToast.error('Please enter a valid established year');
                    return false;
                }
                return true;
            case 2:
                if (!formData.contactPersonName || !formData.officialEmail || !formData.phoneNumber) {
                    AppToast.error('Please fill in all required contact details');
                    return false;
                }
                return true;
            case 3:
                if (!formData.businessRegistrationNumber) {
                    AppToast.error('Please provide business registration number');
                    return false;
                }
                return true;
            case 4:
                if (formData.primaryStudentMarkets.length === 0 || isNaN(students)) {
                    AppToast.error('Please provide market and valid student numbers');
                    return false;
                }
                return true;
            case 5:
                if (isNaN(staff) || formData.servicesProvided.length === 0) {
                    AppToast.error('Please specify services and team size');
                    return false;
                }
                return true;
            case 6:
                if (!formData.reasonToUseEdvios || !formData.termsAccepted) {
                    AppToast.error('Please accept terms and complete the final section');
                    return false;
                }
                return true;
            default:
                return true;
        }
    };

    const handleNextStep = () => validateCurrentStep() && setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    const handlePrevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async (onSubmit?: (data: AgentRegistrationData) => void, onClose?: () => void) => {
        if (!validateCurrentStep()) return;

        setIsSubmitting(true);
        setError(null);

        try {
            await submitAgentRegistration(formData);
            AppToast.success('Registration successful!');
            
            sessionStorage.removeItem('agent-registration-form');
            sessionStorage.removeItem('agent-registration-step');

            if (onSubmit) onSubmit(formData);
            if (onClose) onClose();

            // Force a clean state for the user
            await logout().catch(() => {}); 
            setTimeout(() => router.push('/auth/login'), 2000);

        } catch (err: any) {
            const msg = isAxiosError(err) ? err.response?.data?.message : err.message;
            setError(msg || 'Submission failed');
            AppToast.error(msg || 'An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAIAssistance = () => {
        AppToast.info('AI advisor is ready to help! What can I clarify for you?');
    };

    const resetError = () => setError(null);

    return {
        currentStep, formData, isSubmitting, error, totalSteps, progressPercentage,
        setCurrentStep, handleInputChange, handleNextStep, handlePrevStep,
        handleSubmit, handleAIAssistance, resetError,
    };
};