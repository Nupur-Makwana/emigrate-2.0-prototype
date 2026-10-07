export type Country =
  | 'United Arab Emirates'
  | 'Kingdom of Saudi Arabia'
  | 'Kuwait'
  | 'Qatar'
  | 'Oman'
  | 'Bahrain';

export interface MRWBenchmark {
  country: Country;
  trade: string;
  minimumWageINR: number;
  minimumWageLocal: number;
  currency: string;
}

export interface EmigrantApplication {
  arn: string;
  fullName: string;
  fatherName: string;
  dob: string;
  passportNumber: string;
  passportExpiry: string;
  placeOfIssue?: string;
  dateOfIssue?: string;
  ecrStatus: 'ECR' | 'ECNR';
  destinationCountry: Country;
  tradeCategory: string;
  offeredSalary: number;
  currency: string;
  pbbyPolicyNo: string;
  pbbyStatus: 'VALID' | 'PENDING' | 'REJECTED';
  raId?: string;
  feId?: string;
  submissionDate: string;
  status:
    | 'PENDING_POE'
    | 'PENDING_PGE_APPROVAL'
    | 'FLAGGED_INCORRECT'
    | 'FLAGGED_PGE_REVIEW'
    | 'APPROVED_EC_GRANTED'
    | 'REJECTED';
  officerRemarks?: string;
  poeForwardRemarks?: string;
  poeVerifiedBy?: string;
  poeVerifiedAt?: string;
  pgeApprovedBy?: string;
  pgeApprovedAt?: string;
  aiScore: number; // 0 - 100
  aiTelemetry: {
    mrzMatch: boolean;
    wageCompliant: boolean;
    pbbyVerified: boolean;
    rule25Compliant: boolean;
    notes: string[];
    riskIndicators?: string[];
    inconsistencies?: string[];
    recommendedChecks?: string[];
  };
  ocrDocuments: {
    passport: {
      score: number;
      mrz: string;
      legible: boolean;
      rawText?: string;
      extractedPassportNo?: string;
      fileName?: string;
      previewUrl?: string;
      isMatch?: boolean;
    };
    contract: {
      score: number;
      extractedSalary: number;
      legible: boolean;
      rawText?: string;
      extractedCurrency?: string;
      fileName?: string;
      previewUrl?: string;
      isWageCompliant?: boolean;
    };
    photo: {
      score: number;
      validDimensions: boolean;
      fileName?: string;
      previewUrl?: string;
    };
  };
}

export interface FERegistration {
  feId: string;
  businessName: string;
  orgType: 'Company' | 'Partnership' | 'Proprietorship' | 'Government';
  sponsorId: string;
  tradeLicenseNo: string;
  validUntil: string;
  signatoryName: string;
  signatoryDesignation: string;
  emergencyContact: string;
  country: Country;
  jurisdictionMission: string;
  demandQuotaRequested: number;
  status:
    | 'PENDING_MISSION'
    | 'FLAGGED_INCORRECT'
    | 'FLAGGED_CONSULAR_HEAD'
    | 'ATTESTED'
    | 'REJECTED';
  officerRemarks?: string;
  attestationDate?: string;
  attestedBy?: string;
  aiScore: number;
  ocrDocuments: {
    tradeLicense: {
      score: number;
      verifiedEntity: boolean;
      rawText?: string;
      fileName?: string;
      previewUrl?: string;
      extractedLicenseNo?: string;
      legible?: boolean;
    };
    demandLetter: {
      score: number;
      quotaApproved: boolean;
      rawText?: string;
      fileName?: string;
      previewUrl?: string;
      extractedQuota?: number;
      legible?: boolean;
    };
  };
  aiTelemetry?: {
    chamberMatched: boolean;
    housingAdequate: boolean;
    wageCompliant: boolean;
    notes: string[];
    riskIndicators?: string[];
  };
}

export interface RARegistration {
  raId: string;
  agencyName: string;
  rocAddress: string;
  proprietorName: string;
  panNumber: string;
  aadhaarNumber: string;
  bankName: string;
  netWorthLakhs: number;
  turnoverFiveYears: number[]; // e.g. [10, 15, 20, 25, 30] in Lakhs
  status:
    | 'PENDING_POE'
    | 'PENDING_PGE_APPROVAL'
    | 'FLAGGED_INCORRECT'
    | 'FLAGGED_PGE_REVIEW'
    | 'APPROVED'
    | 'REJECTED';
  aiScore: number;
  officerRemarks?: string;
  poeForwardRemarks?: string;
  poeVerifiedBy?: string;
  poeVerifiedAt?: string;
  licenseValidUntil?: string;
  approvedBy?: string;
  approvedAt?: string;
  ocrDocuments?: {
    incorporationRoc: {
      score: number;
      verified: boolean;
      rawText?: string;
      fileName?: string;
      previewUrl?: string;
      extractedPan?: string;
      legible?: boolean;
    };
    bankGuarantee: {
      score: number;
      verified: boolean;
      rawText?: string;
      fileName?: string;
      previewUrl?: string;
      extractedAmountLakhs?: number;
      legible?: boolean;
    };
  };
  aiTelemetry?: {
    panMatched: boolean;
    bankGuaranteeValid: boolean;
    turnoverAdequate: boolean;
    notes: string[];
    riskIndicators?: string[];
  };
}

export interface ResourceItem {
  id: string;
  title: string;
  category: 'emigrant' | 'employer' | 'ra' | 'acts_orders';
  description: string;
  type: 'form' | 'pdf' | 'guide' | 'checklist' | 'link' | 'video';
  fileSize?: string;
  docCode?: string;
  actionUrl?: string;
  isPopular?: boolean;
}

export interface PoeOffice {
  id: string;
  city: string;
  state: string;
  officerName: string;
  designation: string;
  email: string;
  phone: string;
  address: string;
}

export interface SupportTicket {
  ticketId: string;
  arn?: string;
  category: string;
  subject: string;
  description: string;
  mobile: string;
  email: string;
  createdAt: string;
  status: 'OPEN' | 'ASSIGNED' | 'RESOLVED';
}

export type SupportedLanguage = 'en' | 'hi' | 'ta' | 'te' | 'kn' | 'bn' | 'mr' | 'gu';
export type FontScale = 'sm' | 'base' | 'lg';
export type UserRole = 'PUBLIC' | 'POE' | 'PGE' | 'MISSION';

