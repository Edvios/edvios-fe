export interface Agent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'AGENT' | 'PENDING_AGENT';
  phone?: string;
  createdAt: string;
  updatedAt: string;

  // Company information
  legalName?: string;
  tradingName?: string | null;
  agentName?: string;
  calendlyLink?: string | null;
  countryOfRegistration?: string;
  yearEstablished?: number | null;
  websiteUrl?: string | null;

  // Contact information
  officeAddress?: string;
  contactPersonName?: string;
  designation?: string | null;
  officialEmail?: string;
  phoneNumber?: string;

  // Registration documents
  businessRegistrationNumber?: string;
  businessRegistrationCertificate?: string | null;
  officeAddressProof?: string | null;

  // Partnerships & accreditations
  registeredWithEducationCouncils?: boolean;
  workingWithUkInstitutions?: boolean;
  workingWithCanadaInstitutions?: boolean;
  workingWithAustraliaInstitutions?: boolean;

  // Business details
  primaryStudentMarkets?: string[];
  averageStudentsPerYearLast2Years?: number | null;
  mainDestinations?: string[];
  typicalStudentProfileStrength?: string | null;

  // Services
  inHouseVisaSupport?: boolean;
  numberOfCounsellors?: number;
  servicesProvided?: string[];

  // Platform usage
  reasonToUseEdvios?: string | null;
  interestedFeatures?: string[];
  agentTier?: string;
  notes?: string | null;

  // Existing fields
  address?: string;
  city?: string;
  country?: string;
  organization?: string;
}

export type AgentStatus = 'ALL' | 'AGENT' | 'PENDING_AGENT';

export interface AgentFilters {
  search?: string;
  filter?: AgentStatus;
  page?: number;
  pageSize?: number;
}

export interface AgentResponse {
  agents: Agent[];
  total: number;
  page: number;
  size: number;
}