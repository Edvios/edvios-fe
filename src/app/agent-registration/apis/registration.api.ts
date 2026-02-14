import { FeatureType } from '@/app/profiles/agent-profile/types/agent-profile.types';
import axiosInstance from '../../../lib/axios';
import {
    createAgentDtoSchema,
    RegistrationResponseDto,
    AgentServiceType,
    AgentFeatureType
} from '../dtos/registration.dto';
import { ServiceType } from '../enums/registration.enums';
import { AgentRegistrationData} from '../types/registation.types';

export const submitAgentRegistration = async (
    formData: AgentRegistrationData
): Promise<RegistrationResponseDto> => {
    try {

        const notesParts = [];
        if (formData.openToPilotUsage) notesParts.push('Open to Pilot Usage: YES');


        const dtoData: Partial<AgentRegistrationData> = {
            // Identity
            legalName: formData.legalName,
            tradingName: formData.tradingName || undefined,
            agentName: formData.tradingName || formData.legalName, 
            countryOfRegistration: formData.countryOfRegistration,
            yearEstablished: formData.yearEstablished || undefined,
            websiteUrl: formData.websiteUrl || undefined,
            officeAddress: formData.officeAddress,
            calendlyLink: formData.calendlyLink || undefined,

            // Contact
            contactPersonName: formData.contactPersonName,
            designation: formData.designation || undefined,
            officialEmail: formData.officialEmail,
            phoneNumber: formData.phoneNumber,

            businessRegistrationNumber: formData.businessRegistrationNumber,
            businessRegistrationCertificate: formData.businessRegistrationCertificate || undefined,
            officeAddressProof: formData.officeAddressProof || undefined,

            registeredWithEducationCouncils: formData.registeredWithEducationCouncils,
            workingWithUkInstitutions: formData.workingWithUkInstitutions,
            workingWithCanadaInstitutions: formData.workingWithCanadaInstitutions,
            workingWithAustraliaInstitutions: formData.workingWithAustraliaInstitutions,

            primaryStudentMarkets: formData.primaryStudentMarkets.length > 0 ? formData.primaryStudentMarkets : [],
            averageStudentsPerYearLast2Years: formData.averageStudentsPerYearLast2Years || undefined,
            mainDestinations: formData.mainDestinations.length > 0 ? formData.mainDestinations : [],

            typicalStudentProfileStrength: formData.typicalStudentProfileStrength || undefined,
            inHouseVisaSupport: formData.inHouseVisaSupport,
            numberOfCounsellors: formData.numberOfCounsellors || undefined,

            servicesProvided: formData.servicesProvided.length > 0
                ? formData.servicesProvided.map(s => s as unknown as ServiceType)
                : [],
            reasonToUseEdvios: formData.reasonToUseEdvios || undefined,
            interestedFeatures: formData.interestedFeatures.length > 0
                ? formData.interestedFeatures.map(f => f as unknown as FeatureType)
                : [],

            notes: notesParts.length > 0 ? notesParts.join('\n') : undefined,
            agentTier: 'BASIC', 
        };

        const validation = createAgentDtoSchema.safeParse(dtoData);

        if (!validation.success) {
            const errorMessages = validation.error.issues
                .map((err) => `${err.path.join('.')}: ${err.message}`)
                .join('; ');
            throw new Error(`Validation failed: ${errorMessages}`);
        }

        console.log('Submitting agent registration:', validation.data);

        const response = await axiosInstance.post<RegistrationResponseDto>(
            '/agents',
            validation.data
        );

        return response.data;
    } catch (error) {
        console.error('Agent Registration error:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to submit registration. Please try again.');
    }
};
