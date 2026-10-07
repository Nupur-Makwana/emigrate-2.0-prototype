import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Country,
  EmigrantApplication,
  FERegistration,
  FontScale,
  RARegistration,
  SupportedLanguage,
  SupportTicket,
  UserRole,
} from '../types/emigrate';
import { INITIAL_EMIGRANTS, INITIAL_FE, INITIAL_RA, MRW_MATRIX } from '../data/seedData';

// Collision-resistant numeric suffix (Web Crypto instead of Math.random)
const secureSuffix = (min: number, max: number): number => {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return min + (buf[0] % (max - min + 1));
};

// Safe persistence: never let a storage error (quota / private mode) crash the app, and
// never persist heavy or short-lived preview data (data: / blob: URLs of uploaded scans).
const persist = (key: string, value: unknown) => {
  try {
    const json = JSON.stringify(value, (k, v) =>
      k === 'previewUrl' && typeof v === 'string' && (v.startsWith('data:') || v.startsWith('blob:')) ? undefined : v
    );
    localStorage.setItem(key, json);
  } catch (e) {
    console.warn(`Could not save "${key}" to localStorage:`, e);
  }
};


interface EmigrateContextType {
  // Data State
  emigrants: EmigrantApplication[];
  foreignEmployers: FERegistration[];
  recruitingAgents: RARegistration[];
  supportTickets: SupportTicket[];

  // User & Auth State
  currentUser: { role: UserRole; username: string } | null;
  login: (role: UserRole, username: string) => void;
  logout: () => void;

  // Global UI State
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  fontScale: FontScale;
  setFontScale: (scale: FontScale) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  serverDowntimeActive: boolean;
  setServerDowntimeActive: (val: boolean) => void;

  // Active Modals & Views
  activeView: string;
  setActiveView: (view: string) => void;
  inspectedEmigrant: EmigrantApplication | null;
  setInspectedEmigrant: (app: EmigrantApplication | null) => void;
  inspectedFE: FERegistration | null;
  setInspectedFE: (fe: FERegistration | null) => void;
  activeContractPass: EmigrantApplication | null;
  setActiveContractPass: (app: EmigrantApplication | null) => void;
  activeRaCertificate: RARegistration | null;
  setActiveRaCertificate: (ra: RARegistration | null) => void;
  activeFeCertificate: FERegistration | null;
  setActiveFeCertificate: (fe: FERegistration | null) => void;
  tutorialOpen: boolean;
  setTutorialOpen: (open: boolean) => void;
  prefilledMitraQuery: string | null;
  setPrefilledMitraQuery: (q: string | null) => void;
  isMitraOpen: boolean;
  setIsMitraOpen: (open: boolean) => void;

  // Actions
  addEmigrantApplication: (
    app: Omit<EmigrantApplication, 'arn' | 'submissionDate' | 'status' | 'aiScore' | 'aiTelemetry' | 'ocrDocuments'>,
    ocrData?: Partial<EmigrantApplication['ocrDocuments']>,
    aiTelemetryOverrides?: Partial<EmigrantApplication['aiTelemetry']>
  ) => string;
  addFERegistration: (
    fe: Omit<FERegistration, 'feId' | 'status' | 'aiScore' | 'ocrDocuments'>,
    ocrData?: Partial<FERegistration['ocrDocuments']>,
    aiTelemetryOverrides?: Partial<FERegistration['aiTelemetry']>
  ) => string;
  addRARegistration: (
    ra: Omit<RARegistration, 'raId' | 'status' | 'aiScore'>,
    ocrData?: Partial<NonNullable<RARegistration['ocrDocuments']>>,
    aiTelemetryOverrides?: Partial<NonNullable<RARegistration['aiTelemetry']>>
  ) => string;
  updateEmigrantStatus: (
    arn: string,
    status: EmigrantApplication['status'],
    officerRemarks: string,
    forwardRemarks?: string
  ) => void;
  forwardEmigrantToPge: (arn: string, forwardRemarks: string) => void;
  updateFEStatus: (
    feId: string,
    status: FERegistration['status'],
    officerRemarks: string
  ) => void;
  updateRAStatus: (
    raId: string,
    status: RARegistration['status'],
    officerRemarks: string,
    forwardRemarks?: string
  ) => void;
  createSupportTicket: (
    category: string,
    subject: string,
    description: string,
    mobile: string,
    email: string,
    arn?: string
  ) => string;
  resetAllSeedData: () => void;
}

const EmigrateContext = createContext<EmigrateContextType | undefined>(undefined);

export const EmigrateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Emigrant applications with localStorage persistence
  const [emigrants, setEmigrants] = useState<EmigrantApplication[]>(() => {
    try {
      const saved = localStorage.getItem('emigrate_applications');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_EMIGRANTS;
  });

  // 2. Foreign Employers
  const [foreignEmployers, setForeignEmployers] = useState<FERegistration[]>(() => {
    try {
      const saved = localStorage.getItem('emigrate_fe');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_FE;
  });

  // 3. Recruiting Agents
  const [recruitingAgents, setRecruitingAgents] = useState<RARegistration[]>(() => {
    try {
      const saved = localStorage.getItem('emigrate_ra');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_RA;
  });

  // 4. Support Tickets
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    try {
      const saved = localStorage.getItem('emigrate_tickets');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Auth & Settings
  const [currentUser, setCurrentUser] = useState<{ role: UserRole; username: string } | null>(() => {
    try {
      const saved = localStorage.getItem('emigrate_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [fontScale, setFontScale] = useState<FontScale>('base');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [serverDowntimeActive, setServerDowntimeActive] = useState<boolean>(false);

  // Navigation & Modals
  const [activeView, setActiveView] = useState<string>('home');
  const [inspectedEmigrant, setInspectedEmigrant] = useState<EmigrantApplication | null>(null);
  const [inspectedFE, setInspectedFE] = useState<FERegistration | null>(null);
  const [activeContractPass, setActiveContractPass] = useState<EmigrantApplication | null>(null);
  const [activeRaCertificate, setActiveRaCertificate] = useState<RARegistration | null>(null);
  const [activeFeCertificate, setActiveFeCertificate] = useState<FERegistration | null>(null);
  const [tutorialOpen, setTutorialOpen] = useState<boolean>(() => {
    try {
      return !localStorage.getItem('emigrate_tutorial_seen');
    } catch (e) {
      return false;
    }
  });
  const [prefilledMitraQuery, setPrefilledMitraQuery] = useState<string | null>(null);
  const [isMitraOpen, setIsMitraOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    persist('emigrate_applications', emigrants);
  }, [emigrants]);

  useEffect(() => {
    persist('emigrate_fe', foreignEmployers);
  }, [foreignEmployers]);

  useEffect(() => {
    persist('emigrate_ra', recruitingAgents);
  }, [recruitingAgents]);

  useEffect(() => {
    persist('emigrate_tickets', supportTickets);
  }, [supportTickets]);

  useEffect(() => {
    if (currentUser) {
      persist('emigrate_user', currentUser);
    } else {
      localStorage.removeItem('emigrate_user');
    }
  }, [currentUser]);

  // Auth functions
  const login = (role: UserRole, username: string) => {
    const user = { role, username };
    setCurrentUser(user);
    if (role === 'POE') {
      setActiveView('poe-dashboard');
    } else if (role === 'PGE') {
      setActiveView('pge-dashboard');
    } else if (role === 'MISSION') {
      setActiveView('mission-dashboard');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveView('home');
    setInspectedEmigrant(null);
    setInspectedFE(null);
  };

  // Add Emigrant with algorithmic triage and live OCR support
  const addEmigrantApplication = (
    data: Omit<EmigrantApplication, 'arn' | 'submissionDate' | 'status' | 'aiScore' | 'aiTelemetry' | 'ocrDocuments'>,
    ocrData?: Partial<EmigrantApplication['ocrDocuments']>,
    aiTelemetryOverrides?: Partial<EmigrantApplication['aiTelemetry']>
  ): string => {
    const randomSuffix = secureSuffix(1000, 9999);
    const countryCode = data.destinationCountry.substring(0, 3).toUpperCase();
    const arn = `ARN-2026-${countryCode}-${randomSuffix}`;

    // Lookup statutory MRW
    const benchmark = MRW_MATRIX.find(
      (m) => m.country === data.destinationCountry && m.trade === data.tradeCategory
    );
    const minSalary = benchmark ? benchmark.minimumWageLocal : 1200;

    // Check wage compliance - if contract OCR extracted a salary, verify it against both stated wage and statutory MRW
    const extractedContractSalary = ocrData?.contract?.extractedSalary;
    const effectiveSalary = extractedContractSalary !== undefined ? extractedContractSalary : data.offeredSalary;
    const isWageCompliant = effectiveSalary >= minSalary && (ocrData?.contract?.isWageCompliant ?? true);
    const isPbbyValid = data.pbbyStatus === 'VALID';
    const isMrzMatch = ocrData?.passport?.isMatch ?? true;

    // Check OCR confidence & illegibility
    const passportConfidence = ocrData?.passport?.score ?? 95;
    const contractConfidence = ocrData?.contract?.score ?? 92;
    const isLowConfidence = passportConfidence < 60 || contractConfidence < 60 || (ocrData?.passport?.legible === false);

    // Calculate AI triage score
    let score = 75;
    if (isLowConfidence) {
      score = 52; // Automatically <60% as required
    } else {
      if (isMrzMatch) score += 10;
      else score -= 35;

      if (isWageCompliant) score += 15;
      else score -= 30;

      if (isPbbyValid) score += 10;
      else score -= 15;
    }

    const notes: string[] = [];
    const riskIndicators: string[] = [];
    const inconsistencies: string[] = [];

    if (isLowConfidence) {
      riskIndicators.push('Document illegible, blurry, or blank. Manual verification required.');
      notes.push('CRITICAL OCR FLAG: Average confidence score below 60%. Biometric verification inhibited.');
    }

    if (isMrzMatch) {
      notes.push(`Machine Readable Zone (MRZ) characters match entered passport number ${data.passportNumber} 100%.`);
    } else {
      inconsistencies.push(
        `Passport MRZ mismatch: Form has '${data.passportNumber}', but OCR extracted '${ocrData?.passport?.extractedPassportNo || 'Unreadable'}'.`
      );
      riskIndicators.push('Passport number discrepancy between application input and uploaded bio-page scan.');
    }

    if (isWageCompliant) {
      notes.push(
        `Offered wage (${data.currency} ${effectiveSalary.toLocaleString()}) meets or exceeds statutory MRW benchmark of ${data.currency} ${minSalary.toLocaleString()}.`
      );
    } else {
      notes.push(
        `CRITICAL WAGE DEFICIT: Contract wage (${data.currency} ${effectiveSalary.toLocaleString()}) is below statutory Minimum Referral Wage of ${data.currency} ${minSalary.toLocaleString()}.`
      );
      riskIndicators.push(
        `Statutory Wage Deficit: Contract salary ${data.currency} ${effectiveSalary} fails MEA minimum referral wage (${data.currency} ${minSalary}).`
      );
    }

    if (isPbbyValid) {
      notes.push(`PBBY Policy #${data.pbbyPolicyNo} active in sovereign database with ₹10 Lakh cover.`);
    } else {
      notes.push('PBBY policy confirmation pending verification or unverified.');
      riskIndicators.push('PBBY insurance pending IRDAI repository confirmation.');
    }

    notes.push('Stated service fee complies with Rule 25 ceiling (≤ ₹30,000 + GST).');

    // Merge any external notes / overrides
    if (aiTelemetryOverrides?.notes) {
      notes.push(...aiTelemetryOverrides.notes);
    }
    if (aiTelemetryOverrides?.riskIndicators) {
      riskIndicators.push(...aiTelemetryOverrides.riskIndicators);
    }

    const cleanDob = data.dob.replace(/-/g, '').substring(2);
    const cleanExp = data.passportExpiry.replace(/-/g, '').substring(2);
    const cleanSurname = data.fullName.split(' ').pop()?.toUpperCase() || 'WORKER';
    const cleanGiven = data.fullName.split(' ')[0]?.toUpperCase() || 'INDIAN';
    const mrzString = `P<IND${cleanSurname}<<${cleanGiven}<<<<<<<<<<<${data.passportNumber}IND${cleanDob}M${cleanExp}<<<<<<<<<<<<<<01`;

    const newApp: EmigrantApplication = {
      ...data,
      arn,
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'PENDING_POE',
      aiScore: Math.min(Math.max(score, 45), 98),
      aiTelemetry: {
        mrzMatch: isMrzMatch,
        wageCompliant: isWageCompliant,
        pbbyVerified: isPbbyValid,
        rule25Compliant: true,
        notes,
        riskIndicators: riskIndicators.length > 0 ? riskIndicators : ['None identified. Clean applicant history.'],
        inconsistencies,
        recommendedChecks: isLowConfidence
          ? ['Mandatory physical document verification required due to low OCR confidence.']
          : ['Confirm visa quota validity with host country Ministry of Labour.'],
      },
      ocrDocuments: {
        passport: {
          score: ocrData?.passport?.score ?? 95,
          mrz: ocrData?.passport?.mrz ?? mrzString,
          legible: ocrData?.passport?.legible ?? !isLowConfidence,
          rawText: ocrData?.passport?.rawText,
          extractedPassportNo: ocrData?.passport?.extractedPassportNo ?? data.passportNumber,
          fileName: ocrData?.passport?.fileName ?? 'passport_bio_scan.pdf',
          previewUrl: ocrData?.passport?.previewUrl,
          isMatch: isMrzMatch,
        },
        contract: {
          score: ocrData?.contract?.score ?? 92,
          extractedSalary: ocrData?.contract?.extractedSalary ?? data.offeredSalary,
          legible: ocrData?.contract?.legible ?? !isLowConfidence,
          rawText: ocrData?.contract?.rawText,
          extractedCurrency: ocrData?.contract?.extractedCurrency ?? data.currency,
          fileName: ocrData?.contract?.fileName ?? 'signed_employment_contract.pdf',
          previewUrl: ocrData?.contract?.previewUrl,
          isWageCompliant,
        },
        photo: {
          score: ocrData?.photo?.score ?? 97,
          validDimensions: ocrData?.photo?.validDimensions ?? true,
          fileName: ocrData?.photo?.fileName ?? 'photo_35x45.jpg',
          previewUrl: ocrData?.photo?.previewUrl,
        },
      },
    };

    setEmigrants((prev) => [newApp, ...prev]);
    return arn;
  };

  // Add Foreign Employer
  const addFERegistration = (
    data: Omit<FERegistration, 'feId' | 'status' | 'aiScore' | 'ocrDocuments'>,
    ocrData?: Partial<FERegistration['ocrDocuments']>,
    aiTelemetryOverrides?: Partial<FERegistration['aiTelemetry']>
  ): string => {
    const randomSuffix = secureSuffix(1000, 9999);
    const feId = `FE-2026-${randomSuffix}`;

    const defaultOcr = {
      tradeLicense: {
        score: ocrData?.tradeLicense?.score ?? 92,
        verifiedEntity: ocrData?.tradeLicense?.verifiedEntity ?? true,
        rawText: ocrData?.tradeLicense?.rawText,
        fileName: ocrData?.tradeLicense?.fileName ?? 'trade_license_attested.pdf',
        previewUrl: ocrData?.tradeLicense?.previewUrl,
        extractedLicenseNo: ocrData?.tradeLicense?.extractedLicenseNo,
        legible: ocrData?.tradeLicense?.legible ?? true,
      },
      demandLetter: {
        score: ocrData?.demandLetter?.score ?? 88,
        quotaApproved: ocrData?.demandLetter?.quotaApproved ?? true,
        rawText: ocrData?.demandLetter?.rawText,
        fileName: ocrData?.demandLetter?.fileName ?? 'demand_letter_specimen.pdf',
        previewUrl: ocrData?.demandLetter?.previewUrl,
        extractedQuota: ocrData?.demandLetter?.extractedQuota,
        legible: ocrData?.demandLetter?.legible ?? true,
      },
    };

    const avgScore = Math.round(
      ((defaultOcr.tradeLicense.score || 85) + (defaultOcr.demandLetter.score || 85)) / 2
    );

    const newFE: FERegistration = {
      ...data,
      feId,
      status: 'PENDING_MISSION',
      aiScore: avgScore,
      ocrDocuments: defaultOcr,
      aiTelemetry: {
        chamberMatched: aiTelemetryOverrides?.chamberMatched ?? true,
        housingAdequate: aiTelemetryOverrides?.housingAdequate ?? true,
        wageCompliant: aiTelemetryOverrides?.wageCompliant ?? true,
        notes: aiTelemetryOverrides?.notes ?? [
          'Trade License verified with host country Department of Economic Development.',
          `Demand quota of ${data.demandQuotaRequested} workers matches specimen letter.`,
          'Zero labor retention flags on consular database.',
        ],
        riskIndicators: aiTelemetryOverrides?.riskIndicators ?? [],
      },
    };

    setForeignEmployers((prev) => [newFE, ...prev]);
    return feId;
  };

  // Add Recruiting Agent
  const addRARegistration = (
    data: Omit<RARegistration, 'raId' | 'status' | 'aiScore'>,
    ocrData?: Partial<NonNullable<RARegistration['ocrDocuments']>>,
    aiTelemetryOverrides?: Partial<NonNullable<RARegistration['aiTelemetry']>>
  ): string => {
    const randomSuffix = secureSuffix(100, 999);
    const raId = `RA-NEW-${randomSuffix}`;

    const defaultOcr = {
      incorporationRoc: {
        score: ocrData?.incorporationRoc?.score ?? 90,
        verified: ocrData?.incorporationRoc?.verified ?? true,
        rawText: ocrData?.incorporationRoc?.rawText,
        fileName: ocrData?.incorporationRoc?.fileName ?? 'audited_solvency_roc.pdf',
        previewUrl: ocrData?.incorporationRoc?.previewUrl,
        extractedPan: ocrData?.incorporationRoc?.extractedPan,
        legible: ocrData?.incorporationRoc?.legible ?? true,
      },
      bankGuarantee: {
        score: ocrData?.bankGuarantee?.score ?? 94,
        verified: ocrData?.bankGuarantee?.verified ?? true,
        rawText: ocrData?.bankGuarantee?.rawText,
        fileName: ocrData?.bankGuarantee?.fileName ?? 'bank_guarantee_50lakh.pdf',
        previewUrl: ocrData?.bankGuarantee?.previewUrl,
        extractedAmountLakhs: ocrData?.bankGuarantee?.extractedAmountLakhs ?? 50,
        legible: ocrData?.bankGuarantee?.legible ?? true,
      },
    };

    const avgScore = Math.round(
      ((defaultOcr.incorporationRoc.score || 85) + (defaultOcr.bankGuarantee.score || 85)) / 2
    );

    const newRA: RARegistration = {
      ...data,
      raId,
      status: 'PENDING_POE',
      aiScore: avgScore,
      ocrDocuments: defaultOcr,
      aiTelemetry: {
        panMatched: aiTelemetryOverrides?.panMatched ?? true,
        bankGuaranteeValid: aiTelemetryOverrides?.bankGuaranteeValid ?? true,
        turnoverAdequate: aiTelemetryOverrides?.turnoverAdequate ?? true,
        notes: aiTelemetryOverrides?.notes ?? [
          'Irrevocable Bank Guarantee of ₹50 Lakh deposited and validated with bank.',
          'PAN and ROC incorporation details verified with Ministry of Corporate Affairs.',
          'Rule 25 maximum fee ceiling pledged (≤ ₹30,000 + GST).',
        ],
        riskIndicators: aiTelemetryOverrides?.riskIndicators ?? [],
      },
    };

    setRecruitingAgents((prev) => [newRA, ...prev]);
    return raId;
  };

  // Update RA status by PoE or PGE Officer
  const updateRAStatus = (
    raId: string,
    status: RARegistration['status'],
    officerRemarks: string,
    forwardRemarks?: string
  ) => {
    setRecruitingAgents((prev) =>
      prev.map((ra) => {
        if (ra.raId !== raId) return ra;
        return {
          ...ra,
          status,
          officerRemarks,
          ...(forwardRemarks ? { poeForwardRemarks: forwardRemarks } : {}),
          ...(status === 'PENDING_PGE_APPROVAL'
            ? {
                poeVerifiedBy: currentUser?.username || 'PoE Reviewing Officer',
                poeVerifiedAt: new Date().toISOString(),
              }
            : {}),
          ...(status === 'APPROVED'
            ? {
                approvedBy: currentUser?.username || 'Protector General of Emigrants (PGE)',
                approvedAt: new Date().toISOString(),
                licenseValidUntil: '2031-12-31',
              }
            : {}),
        };
      })
    );
  };

  // Update Emigrant status by POE Officer or PGE Higher Officer
  const updateEmigrantStatus = (
    arn: string,
    status: EmigrantApplication['status'],
    officerRemarks: string,
    forwardRemarks?: string
  ) => {
    setEmigrants((prev) =>
      prev.map((app) => {
        if (app.arn !== arn) return app;
        const updated: EmigrantApplication = {
          ...app,
          status,
          officerRemarks,
          ...(forwardRemarks ? { poeForwardRemarks: forwardRemarks } : {}),
          ...(status === 'PENDING_PGE_APPROVAL'
            ? {
                poeVerifiedBy: currentUser?.username || 'PoE Reviewing Officer',
                poeVerifiedAt: new Date().toISOString(),
              }
            : {}),
          ...(status === 'APPROVED_EC_GRANTED'
            ? {
                pgeApprovedBy: currentUser?.username || 'Protector General of Emigrants (PGE)',
                pgeApprovedAt: new Date().toISOString(),
              }
            : {}),
        };
        return updated;
      })
    );
    if (inspectedEmigrant && inspectedEmigrant.arn === arn) {
      setInspectedEmigrant((prev) =>
        prev
          ? {
              ...prev,
              status,
              officerRemarks,
              ...(forwardRemarks ? { poeForwardRemarks: forwardRemarks } : {}),
            }
          : null
      );
    }
  };

  const forwardEmigrantToPge = (arn: string, forwardRemarks: string) => {
    updateEmigrantStatus(
      arn,
      'PENDING_PGE_APPROVAL',
      'Forwarded to Higher Officer (PGE) with verification findings.',
      forwardRemarks
    );
  };

  // Update FE status by Indian Mission
  const updateFEStatus = (
    feId: string,
    status: FERegistration['status'],
    officerRemarks: string
  ) => {
    setForeignEmployers((prev) =>
      prev.map((fe) => (fe.feId === feId ? { ...fe, status, officerRemarks } : fe))
    );
    if (inspectedFE && inspectedFE.feId === feId) {
      setInspectedFE((prev) => (prev ? { ...prev, status, officerRemarks } : null));
    }
  };

  // Create PBSK Support Ticket
  const createSupportTicket = (
    category: string,
    subject: string,
    description: string,
    mobile: string,
    email: string,
    arn?: string
  ): string => {
    const ticketId = `TICKET-PBSK-2026-${secureSuffix(1000, 9999)}`;
    const ticket: SupportTicket = {
      ticketId,
      arn,
      category,
      subject,
      description,
      mobile,
      email,
      createdAt: new Date().toISOString(),
      status: 'OPEN',
    };
    setSupportTickets((prev) => [ticket, ...prev]);
    return ticketId;
  };

  // Reset function
  const resetAllSeedData = () => {
    setEmigrants(INITIAL_EMIGRANTS);
    setForeignEmployers(INITIAL_FE);
    setRecruitingAgents(INITIAL_RA);
    setSupportTickets([]);
    localStorage.removeItem('emigrate_applications');
    localStorage.removeItem('emigrate_fe');
    localStorage.removeItem('emigrate_ra');
    localStorage.removeItem('emigrate_tickets');
    localStorage.removeItem('emigrate_user');
    setCurrentUser(null);
    setActiveView('home');
  };

  return (
    <EmigrateContext.Provider
      value={{
        emigrants,
        foreignEmployers,
        recruitingAgents,
        supportTickets,
        currentUser,
        login,
        logout,
        language,
        setLanguage,
        fontScale,
        setFontScale,
        darkMode,
        setDarkMode,
        serverDowntimeActive,
        setServerDowntimeActive,
        activeView,
        setActiveView,
        inspectedEmigrant,
        setInspectedEmigrant,
        inspectedFE,
        setInspectedFE,
        activeContractPass,
        setActiveContractPass,
        activeRaCertificate,
        setActiveRaCertificate,
        activeFeCertificate,
        setActiveFeCertificate,
        tutorialOpen,
        setTutorialOpen,
        prefilledMitraQuery,
        setPrefilledMitraQuery,
        isMitraOpen,
        setIsMitraOpen,
        addEmigrantApplication,
        addFERegistration,
        addRARegistration,
        updateEmigrantStatus,
        forwardEmigrantToPge,
        updateFEStatus,
        updateRAStatus,
        createSupportTicket,
        resetAllSeedData,
      }}
    >
      {children}
    </EmigrateContext.Provider>
  );
};

export const useEmigrate = () => {
  const context = useContext(EmigrateContext);
  if (!context) {
    throw new Error('useEmigrate must be used within an EmigrateProvider');
  }
  return context;
};
