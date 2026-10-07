import React, { useState } from 'react';
import { useEmigrate } from '../context/EmigrateContext';
import { Country } from '../types/emigrate';
import { INDIAN_MISSIONS, ECR_COUNTRIES } from '../data/seedData';
import {
  Building2,
  FileText,
  User,
  Phone,
  MapPin,
  CheckCircle2,
  Upload,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import {
  EmployerDocumentUploader,
  EmployerDocumentState,
} from './EmployerDocumentUploader';

export const EmployerForm: React.FC = () => {
  const { addFERegistration, setActiveView } = useEmigrate();

  const [submittedFeId, setSubmittedFeId] = useState<string | null>(null);

  // Form Fields
  const [businessName, setBusinessName] = useState('Emirates Infra-Build Contracting LLC');
  const [orgType, setOrgType] = useState<'Company' | 'Partnership' | 'Proprietorship' | 'Government'>('Company');
  const [sponsorId, setSponsorId] = useState('SP-DXB-998811');
  const [tradeLicenseNo, setTradeLicenseNo] = useState('TL-DXB-2026-5541');
  const [validUntil, setValidUntil] = useState('2028-12-31');
  const [signatoryName, setSignatoryName] = useState('Ahmed Mansoor Al-Ketbi');
  const [signatoryDesignation, setSignatoryDesignation] = useState('Chief Operations Officer');
  const [emergencyContact, setEmergencyContact] = useState('+971-4-889-2233');
  const [country, setCountry] = useState<Country>('United Arab Emirates');
  const [jurisdictionMission, setJurisdictionMission] = useState(INDIAN_MISSIONS[0]);
  const [demandQuotaRequested, setDemandQuotaRequested] = useState<number>(150);

  // Document states
  const [tradeLicenseDoc, setTradeLicenseDoc] = useState<EmployerDocumentState>({
    file: null,
    fileName: 'trade_license_dxb.pdf',
    status: 'idle',
    progress: 0,
    statusMessage: '',
    rawText: '',
    confidence: 0,
    isLegible: true,
  });

  const [demandLetterDoc, setDemandLetterDoc] = useState<EmployerDocumentState>({
    file: null,
    fileName: 'demand_letter_signed.pdf',
    status: 'idle',
    progress: 0,
    statusMessage: '',
    rawText: '',
    confidence: 0,
    isLegible: true,
  });

  const [signatoryIdDoc, setSignatoryIdDoc] = useState<{
    fileName: string;
    previewUrl?: string;
    status: 'idle' | 'done';
  }>({
    fileName: 'signatory_national_id.pdf',
    status: 'done',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare OCR documents payload
    const ocrPayload = {
      tradeLicense: {
        score: tradeLicenseDoc.confidence > 0 ? tradeLicenseDoc.confidence : 94,
        verifiedEntity: tradeLicenseDoc.isLicenseMatched !== false,
        rawText:
          tradeLicenseDoc.rawText ||
          `GOVERNMENT OF DUBAI • DEPARTMENT OF ECONOMIC DEVELOPMENT\nCOMMERCIAL LICENSE / TRADE REGISTRATION CERTIFICATE\nLegal Entity Name: ${businessName}\nTrade License No: ${tradeLicenseNo}\nCommercial Registry / Sponsor ID: ${sponsorId}\nValid Until: ${validUntil}\nDUBAI CHAMBER OF COMMERCE • ATTESTED & REGISTERED 2026`,
        fileName: tradeLicenseDoc.fileName || 'trade_license_attested.pdf',
        previewUrl: tradeLicenseDoc.previewUrl,
        extractedLicenseNo: tradeLicenseDoc.extractedLicenseNo || tradeLicenseNo,
        legible: tradeLicenseDoc.isLegible,
      },
      demandLetter: {
        score: demandLetterDoc.confidence > 0 ? demandLetterDoc.confidence : 91,
        quotaApproved: demandLetterDoc.isQuotaMatched !== false,
        rawText:
          demandLetterDoc.rawText ||
          `${businessName.toUpperCase()}\nCorporate Human Resources Division\nSUBJECT: FORMAL SPECIMEN DEMAND LETTER FOR INDIAN MANPOWER\nTotal Manpower Demand Quota: ${demandQuotaRequested} Workers\nAuthorized Signatory: ${signatoryName}\nCompany Stamp: [Chamber of Commerce Attested]`,
        fileName: demandLetterDoc.fileName || 'demand_letter_specimen.pdf',
        previewUrl: demandLetterDoc.previewUrl,
        extractedQuota: demandLetterDoc.extractedQuota || demandQuotaRequested,
        legible: demandLetterDoc.isLegible,
      },
    };

    const riskIndicators: string[] = [];
    if (!tradeLicenseDoc.isLegible && tradeLicenseDoc.status === 'done') {
      riskIndicators.push('Trade License document blurry or low confidence (<60%). Manual consular verification required.');
    }
    if (tradeLicenseDoc.extractedLicenseNo && !tradeLicenseDoc.isLicenseMatched) {
      riskIndicators.push(`Trade License mismatch: Form stated '${tradeLicenseNo}', but OCR found '${tradeLicenseDoc.extractedLicenseNo}'.`);
    }

    const feId = addFERegistration(
      {
        businessName,
        orgType,
        sponsorId,
        tradeLicenseNo,
        validUntil,
        signatoryName,
        signatoryDesignation,
        emergencyContact,
        country,
        jurisdictionMission,
        demandQuotaRequested,
      },
      ocrPayload,
      {
        chamberMatched: tradeLicenseDoc.isLicenseMatched !== false,
        housingAdequate: true,
        wageCompliant: true,
        riskIndicators,
      }
    );

    setSubmittedFeId(feId);
  };

  if (submittedFeId) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-in fade-in">
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          <div className="tricolor-stripe" />
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 text-navy-900 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-navy-900" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-blue-800 block">
              Foreign Employer Profile Registered
            </span>

            <h2 className="text-2xl font-black text-navy-900">
              Foreign Employer Reference (FE-ID)
            </h2>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg max-w-md mx-auto">
              <span className="font-mono text-2xl font-extrabold text-navy-900 tracking-wider">
                {submittedFeId}
              </span>
              <p className="text-xs text-slate-500 mt-1">
                Transmitted directly to the designated Indian Diplomatic Mission for corporate attestation.
              </p>
            </div>

            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Your registration dossier and requested demand quota of {demandQuotaRequested} workers have been routed to <strong>{jurisdictionMission}</strong>. Consular officers will audit host-country trade registration and housing capacity.
            </p>

            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={() => setSubmittedFeId(null)}
                className="px-4 py-2 border border-slate-300 text-xs font-semibold text-slate-700 rounded hover:bg-slate-100 transition"
              >
                Register Another Entity
              </button>
              <button
                onClick={() => setActiveView('home')}
                className="px-5 py-2 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded shadow transition"
              >
                Return to Home Portal
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          Ministry of External Affairs • Form FE-REG-01
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-navy-900">
          Foreign Employer (FE) Registration & Mission Attestation
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Registration for overseas corporate entities, sponsors, and governments seeking recruitment authorization for Indian citizens.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <div className="tricolor-stripe" />

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Section 1: Business Details */}
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
              <h3 className="font-bold text-sm text-navy-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-navy-900" />
                1. Business & Organization Identification
              </h3>
              <span className="text-xs text-slate-500 font-medium">Corporate Dossier</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Legal Business Name (as per Trade License) *
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-navy-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nature of Organization *
                </label>
                <select
                  value={orgType}
                  onChange={(e) => setOrgType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white focus:ring-2 focus:ring-navy-900 focus:outline-none"
                >
                  <option value="Company">Company / LLC / Corporation</option>
                  <option value="Partnership">Partnership Firm</option>
                  <option value="Proprietorship">Sole Proprietorship</option>
                  <option value="Government">Government / Public Sector</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Host Country Sponsor ID / CR Number *
                </label>
                <input
                  type="text"
                  value={sponsorId}
                  onChange={(e) => setSponsorId(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded font-mono focus:ring-2 focus:ring-navy-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Trade License / Commercial Registration No. *
                </label>
                <input
                  type="text"
                  value={tradeLicenseNo}
                  onChange={(e) => setTradeLicenseNo(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded font-mono focus:ring-2 focus:ring-navy-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Date up to which Registration is Valid *
                </label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-navy-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Initial Demand Quota Requested (Worker Count) *
                </label>
                <input
                  type="number"
                  value={demandQuotaRequested}
                  onChange={(e) => setDemandQuotaRequested(Number(e.target.value))}
                  required
                  min={1}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded font-bold text-navy-900 focus:ring-2 focus:ring-navy-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Authorized Signatory & Emergency Contact */}
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
              <h3 className="font-bold text-sm text-navy-900 flex items-center gap-2">
                <User className="w-4 h-4 text-navy-900" />
                2. Authorized Corporate Signatory & Emergency Point of Contact
              </h3>
              <span className="text-xs text-slate-500 font-medium">Accountability</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Signatory Full Name *
                </label>
                <input
                  type="text"
                  value={signatoryName}
                  onChange={(e) => setSignatoryName(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-navy-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Corporate Designation *
                </label>
                <input
                  type="text"
                  value={signatoryDesignation}
                  onChange={(e) => setSignatoryDesignation(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-navy-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Emergency Contact Mobile *
                </label>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded font-mono focus:ring-2 focus:ring-navy-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Indian Diplomatic Mission Jurisdiction */}
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
              <h3 className="font-bold text-sm text-navy-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-navy-900" />
                3. Diplomatic Jurisdiction & Consular Attestation
              </h3>
              <span className="text-xs text-slate-500 font-medium">Mission Allocation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Host Country *
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value as Country)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white focus:ring-2 focus:ring-navy-900 focus:outline-none"
                >
                  {ECR_COUNTRIES.slice(0, 6).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Jurisdiction (Indian Embassy / Consulate) *
                </label>
                <select
                  value={jurisdictionMission}
                  onChange={(e) => setJurisdictionMission(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white focus:ring-2 focus:ring-navy-900 focus:outline-none"
                >
                  {INDIAN_MISSIONS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Live Client-Side OCR Attestation Documents */}
          <EmployerDocumentUploader
            businessName={businessName}
            tradeLicenseNo={tradeLicenseNo}
            sponsorId={sponsorId}
            validUntil={validUntil}
            demandQuotaRequested={demandQuotaRequested}
            signatoryName={signatoryName}
            country={country}
            tradeLicenseDoc={tradeLicenseDoc}
            setTradeLicenseDoc={setTradeLicenseDoc}
            demandLetterDoc={demandLetterDoc}
            setDemandLetterDoc={setDemandLetterDoc}
            signatoryIdDoc={signatoryIdDoc}
            setSignatoryIdDoc={setSignatoryIdDoc}
          />

          {/* Statutory Undertaking */}
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-xs text-amber-900 space-y-1">
            <strong>Foreign Employer Statutory Undertaking:</strong>
            <p>
              The employer undertakes to provide safe accommodation meeting host-country and MEA standards, pay wages strictly equal to or exceeding the statutory Minimum Referral Wage (MRW), provide free medical care, and never confiscate employee passports.
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded shadow transition flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Submit Registration for Embassy Attestation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
