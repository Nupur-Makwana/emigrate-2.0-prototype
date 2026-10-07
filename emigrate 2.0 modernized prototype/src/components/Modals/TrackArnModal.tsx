import React, { useState } from 'react';
import { useEmigrate } from '../../context/EmigrateContext';
import {
  Search,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  QrCode,
  Shield,
  Building2,
  Award,
  Users,
  Briefcase,
  ChevronRight,
  ExternalLink,
  Info,
} from 'lucide-react';

interface TrackArnModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialArn?: string;
  initialCategory?: 'emigrant' | 'employer' | 'ra';
}

export const TrackArnModal: React.FC<TrackArnModalProps> = ({
  isOpen,
  onClose,
  initialArn = '',
  initialCategory = 'emigrant',
}) => {
  const {
    emigrants,
    foreignEmployers,
    recruitingAgents,
    setActiveContractPass,
    setActiveFeCertificate,
    setActiveRaCertificate,
  } = useEmigrate();

  // 1. First choose category: Emigrant, Employer, RA
  const [selectedCategory, setSelectedCategory] = useState<'emigrant' | 'employer' | 'ra'>(
    initialCategory
  );

  // Search input state
  const [referenceQuery, setReferenceQuery] = useState(
    initialArn ||
      (selectedCategory === 'emigrant'
        ? 'ARN-2026-DXB-9012'
        : selectedCategory === 'employer'
        ? 'FE-UAE-9921'
        : 'RA-DEL-0418')
  );

  const [hasSearched, setHasSearched] = useState(true);

  if (!isOpen) return null;

  // Handle category switch
  const handleSelectCategory = (cat: 'emigrant' | 'employer' | 'ra') => {
    setSelectedCategory(cat);
    if (cat === 'emigrant') {
      setReferenceQuery('ARN-2026-DXB-9012');
    } else if (cat === 'employer') {
      setReferenceQuery('FE-UAE-9921');
    } else {
      setReferenceQuery('RA-DEL-0418');
    }
    setHasSearched(true);
  };

  // Find corresponding record
  const cleanQuery = referenceQuery.trim().toUpperCase();

  const foundEmigrant =
    selectedCategory === 'emigrant'
      ? emigrants.find(
          (app) =>
            app.arn.toUpperCase() === cleanQuery ||
            app.passportNumber.toUpperCase() === cleanQuery
        )
      : null;

  const foundEmployer =
    selectedCategory === 'employer'
      ? foreignEmployers.find(
          (fe) =>
            fe.feId.toUpperCase() === cleanQuery ||
            fe.tradeLicenseNo.toUpperCase() === cleanQuery ||
            fe.businessName.toUpperCase().includes(cleanQuery)
        )
      : null;

  const foundRa =
    selectedCategory === 'ra'
      ? recruitingAgents.find(
          (ra) =>
            ra.raId.toUpperCase() === cleanQuery ||
            ra.agencyName.toUpperCase().includes(cleanQuery) ||
            ra.panNumber.toUpperCase() === cleanQuery
        )
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-300 overflow-hidden flex flex-col max-h-[92vh]">
        <div className="tricolor-stripe" />

        {/* Modal Header */}
        <div className="bg-navy-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-navy-800 rounded-md border border-navy-700">
              <Search className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Track Application Reference (ARN)
              </h3>
              <p className="text-xs text-slate-300">
                Official MEA Sovereign Application Tracking & Approval Portal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-bold px-2 py-0.5 rounded hover:bg-navy-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Step 1: Select Application Category (Emigrant / Employer / RA) */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Step 1: Select Your Category
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleSelectCategory('emigrant')}
              className={`p-3 rounded-lg border text-left transition flex items-center gap-2.5 ${
                selectedCategory === 'emigrant'
                  ? 'bg-navy-900 border-navy-900 text-white shadow-md'
                  : 'bg-white border-slate-300 text-slate-800 hover:border-navy-900'
              }`}
            >
              <div
                className={`p-1.5 rounded ${
                  selectedCategory === 'emigrant'
                    ? 'bg-navy-800 text-amber-400'
                    : 'bg-blue-50 text-blue-700'
                }`}
              >
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs block leading-tight">Emigrant</span>
                <span
                  className={`text-[10px] block ${
                    selectedCategory === 'emigrant' ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  ECR Worker Clearance
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSelectCategory('employer')}
              className={`p-3 rounded-lg border text-left transition flex items-center gap-2.5 ${
                selectedCategory === 'employer'
                  ? 'bg-navy-900 border-navy-900 text-white shadow-md'
                  : 'bg-white border-slate-300 text-slate-800 hover:border-navy-900'
              }`}
            >
              <div
                className={`p-1.5 rounded ${
                  selectedCategory === 'employer'
                    ? 'bg-navy-800 text-amber-400'
                    : 'bg-blue-50 text-blue-700'
                }`}
              >
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs block leading-tight">Employer</span>
                <span
                  className={`text-[10px] block ${
                    selectedCategory === 'employer' ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  Foreign Company (FE)
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSelectCategory('ra')}
              className={`p-3 rounded-lg border text-left transition flex items-center gap-2.5 ${
                selectedCategory === 'ra'
                  ? 'bg-navy-900 border-navy-900 text-white shadow-md'
                  : 'bg-white border-slate-300 text-slate-800 hover:border-navy-900'
              }`}
            >
              <div
                className={`p-1.5 rounded ${
                  selectedCategory === 'ra'
                    ? 'bg-navy-800 text-amber-400'
                    : 'bg-blue-50 text-blue-700'
                }`}
              >
                <Award className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs block leading-tight">RA</span>
                <span
                  className={`text-[10px] block ${
                    selectedCategory === 'ra' ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  Recruiting Agent
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Step 2: Search Input Field */}
        <div className="p-4 bg-white border-b border-slate-200">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Step 2: Enter{' '}
            {selectedCategory === 'emigrant'
              ? 'Application Reference Number (ARN) or Passport Number'
              : selectedCategory === 'employer'
              ? 'Foreign Employer Reference (FE-ID) or Trade License CR'
              : 'Recruiting Agent ID (RA-ID) or Agency Name'}
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={referenceQuery}
                onChange={(e) => setReferenceQuery(e.target.value)}
                placeholder={
                  selectedCategory === 'emigrant'
                    ? 'e.g. ARN-2026-DXB-9012 or M8921004'
                    : selectedCategory === 'employer'
                    ? 'e.g. FE-UAE-9921 or CR-DXB-88310'
                    : 'e.g. RA-DEL-0418 or Apex International'
                }
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded font-mono font-medium focus:ring-2 focus:ring-navy-900 focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
            <button
              type="button"
              onClick={() => setHasSearched(true)}
              className="px-5 py-2 bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold rounded shadow transition flex items-center gap-1.5"
            >
              <span>Check Status</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Demo Reference Shortcuts */}
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-600 flex-wrap">
            <span className="font-semibold text-slate-500">Quick Test Records:</span>
            {selectedCategory === 'emigrant' && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setReferenceQuery('ARN-2026-DXB-9012');
                    setHasSearched(true);
                  }}
                  className="text-navy-900 hover:underline font-mono bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded border border-slate-300 text-[10px]"
                >
                  ARN-2026-DXB-9012 (Mason)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReferenceQuery('ARN-2026-DOH-7731');
                    setHasSearched(true);
                  }}
                  className="text-emerald-800 font-bold hover:underline font-mono bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 text-[10px]"
                >
                  ARN-2026-DOH-7731 (Approved & EC Granted)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReferenceQuery('ARN-2026-RUH-4410');
                    setHasSearched(true);
                  }}
                  className="text-navy-900 hover:underline font-mono bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded border border-slate-300 text-[10px]"
                >
                  ARN-2026-RUH-4410 (Driver)
                </button>
              </>
            )}

            {selectedCategory === 'employer' && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setReferenceQuery('FE-UAE-9921');
                    setHasSearched(true);
                  }}
                  className="text-emerald-800 font-bold hover:underline font-mono bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 text-[10px]"
                >
                  FE-UAE-9921 (Attested & Approved)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReferenceQuery('FE-KSA-4001');
                    setHasSearched(true);
                  }}
                  className="text-navy-900 hover:underline font-mono bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded border border-slate-300 text-[10px]"
                >
                  FE-KSA-4001 (Saudi Binladin)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReferenceQuery('FE-QAT-1109');
                    setHasSearched(true);
                  }}
                  className="text-navy-900 hover:underline font-mono bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded border border-slate-300 text-[10px]"
                >
                  FE-QAT-1109 (Doha MEP)
                </button>
              </>
            )}

            {selectedCategory === 'ra' && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setReferenceQuery('RA-DEL-0418');
                    setHasSearched(true);
                  }}
                  className="text-emerald-800 font-bold hover:underline font-mono bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 text-[10px]"
                >
                  RA-DEL-0418 (Approved & Licensed)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReferenceQuery('RA-MUM-0812');
                    setHasSearched(true);
                  }}
                  className="text-navy-900 hover:underline font-mono bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded border border-slate-300 text-[10px]"
                >
                  RA-MUM-0812 (Konkan Global)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReferenceQuery('RA-CHD-0199');
                    setHasSearched(true);
                  }}
                  className="text-emerald-800 font-bold hover:underline font-mono bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 text-[10px]"
                >
                  RA-CHD-0199 (Northern Plains)
                </button>
              </>
            )}
          </div>
        </div>

        {/* Results Area */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* CATEGORY 1: EMIGRANT RESULTS */}
          {selectedCategory === 'emigrant' && hasSearched && (
            foundEmigrant ? (
              <div className="space-y-4 animate-in fade-in">
                {/* Status Header */}
                <div className="p-3.5 bg-slate-100 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                      Emigration Clearance Status
                    </span>
                    <div className="mt-1">
                      {foundEmigrant.status === 'APPROVED_EC_GRANTED' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Approved & Emigration Clearance (EC) Granted
                        </span>
                      )}
                      {foundEmigrant.status === 'PENDING_PGE_APPROVAL' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300 animate-pulse">
                          <Clock className="w-3.5 h-3.5 text-blue-700" />
                          Stage 2: Forwarded to Higher Officer (PGE) for Final EC Grant
                        </span>
                      )}
                      {foundEmigrant.status === 'PENDING_POE' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          Stage 1: Under PoE Frontline Review
                        </span>
                      )}
                      {foundEmigrant.status === 'FLAGGED_INCORRECT' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          Deficiencies Flagged — Resubmission Required
                        </span>
                      )}
                      {foundEmigrant.status === 'REJECTED' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
                          <XCircle className="w-3.5 h-3.5 text-red-600" />
                          Clearance Rejected
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 font-bold block">Filing Date</span>
                    <strong className="text-xs text-navy-900 font-mono">
                      {foundEmigrant.submissionDate}
                    </strong>
                  </div>
                </div>

                {/* Worker Dossier Card */}
                <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                  <div className="bg-slate-50 font-bold px-3 py-2 border-b border-slate-200 text-navy-900 flex items-center justify-between">
                    <span>Applicant & Overseas Deployment Details</span>
                    <span className="font-mono text-[11px] text-slate-500">
                      ARN: {foundEmigrant.arn}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 p-3.5 bg-white">
                    <div>
                      <span className="text-slate-500 block">Worker Name:</span>
                      <strong className="text-navy-900 text-sm">{foundEmigrant.fullName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Passport Number:</span>
                      <strong className="text-navy-900 font-mono">{foundEmigrant.passportNumber}</strong> ({foundEmigrant.ecrStatus})
                    </div>
                    <div>
                      <span className="text-slate-500 block">Destination Country:</span>
                      <strong className="text-navy-900">{foundEmigrant.destinationCountry}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Job Designation:</span>
                      <strong className="text-navy-900">{foundEmigrant.tradeCategory}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Offered Wage:</span>
                      <strong className="text-navy-900 font-mono">
                        {foundEmigrant.currency} {foundEmigrant.offeredSalary.toLocaleString()}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">PBBY Insurance Cover:</span>
                      <span className="text-emerald-700 font-bold">
                        {foundEmigrant.pbbyStatus === 'VALID' ? 'Active (₹10 Lakh Cover)' : 'Under Verification'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* PoE Forwarding Remark */}
                {foundEmigrant.poeForwardRemarks && (
                  <div className="p-3 bg-blue-50 border-l-4 border-blue-600 rounded text-xs text-blue-950 space-y-1">
                    <div className="flex items-center justify-between font-bold text-blue-900">
                      <span>PoE Frontline Verification Notes:</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {foundEmigrant.poeVerifiedBy || 'PoE Delhi'}
                      </span>
                    </div>
                    <p className="text-slate-700 italic">"{foundEmigrant.poeForwardRemarks}"</p>
                  </div>
                )}

                {/* Officer Remarks */}
                {foundEmigrant.officerRemarks && (
                  <div className="p-3 bg-amber-50 border-l-4 border-amber-500 rounded text-xs text-amber-950">
                    <strong className="block mb-0.5">Scrutiny Remarks:</strong>
                    <span>{foundEmigrant.officerRemarks}</span>
                  </div>
                )}

                {/* SPECIFICATION: If Approved, Emigrant receives EC & Contract Pass */}
                {foundEmigrant.status === 'APPROVED_EC_GRANTED' && (
                  <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-emerald-950 text-sm flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Emigration Clearance & Dynamic Contract Pass Ready
                      </h4>
                      <p className="text-xs text-emerald-800">
                        Clearance granted by Higher Officer (PGE). Cryptographic SHA-256 pass with verified bilingual employment contract is available for offline border inspection.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveContractPass(foundEmigrant);
                        onClose();
                      }}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow transition flex items-center gap-2 whitespace-nowrap"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>View EC & Contract Pass</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800">Emigrant Application Not Found</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                  No record matched the reference entered. Check ARN format (e.g. ARN-2026-DXB-9012) or passport number.
                </p>
              </div>
            )
          )}

          {/* CATEGORY 2: EMPLOYER RESULTS */}
          {selectedCategory === 'employer' && hasSearched && (
            foundEmployer ? (
              <div className="space-y-4 animate-in fade-in">
                {/* Status Header */}
                <div className="p-3.5 bg-slate-100 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                      Mission Attestation Status
                    </span>
                    <div className="mt-1">
                      {foundEmployer.status === 'ATTESTED' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Attested & Authorized by Indian Diplomatic Mission
                        </span>
                      )}
                      {foundEmployer.status === 'PENDING_MISSION' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          Pending Consular Scrutiny at Indian Mission
                        </span>
                      )}
                      {foundEmployer.status === 'FLAGGED_INCORRECT' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          Deficiencies Flagged by Consular Wing
                        </span>
                      )}
                      {foundEmployer.status === 'REJECTED' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
                          <XCircle className="w-3.5 h-3.5 text-red-600" />
                          Attestation Denied
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 font-bold block">FE Entity ID</span>
                    <strong className="text-xs text-navy-900 font-mono">
                      {foundEmployer.feId}
                    </strong>
                  </div>
                </div>

                {/* Foreign Employer Dossier Card */}
                <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                  <div className="bg-slate-50 font-bold px-3 py-2 border-b border-slate-200 text-navy-900 flex items-center justify-between">
                    <span>Corporate Commercial Registration & Demand Quota</span>
                    <span className="font-mono text-[11px] text-slate-500">
                      CR: {foundEmployer.tradeLicenseNo}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 p-3.5 bg-white">
                    <div>
                      <span className="text-slate-500 block">Business Name:</span>
                      <strong className="text-navy-900 text-sm">{foundEmployer.businessName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Constitution / Org Type:</span>
                      <strong className="text-navy-900">{foundEmployer.orgType}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Host Country & Embassy:</span>
                      <strong className="text-navy-900">{foundEmployer.country}</strong>
                      <span className="text-[11px] text-slate-500 block">
                        {foundEmployer.jurisdictionMission}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Authorized Demand Quota:</span>
                      <strong className="text-navy-900 font-mono text-sm">
                        {foundEmployer.demandQuotaRequested} Indian Workers
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Authorized Signatory:</span>
                      <strong className="text-navy-900">{foundEmployer.signatoryName}</strong>
                      <span className="text-[10px] text-slate-500 block">
                        {foundEmployer.signatoryDesignation}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Commercial Validity:</span>
                      <strong className="text-navy-900 font-mono">
                        Valid until {foundEmployer.validUntil}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Officer Remarks */}
                {foundEmployer.officerRemarks && (
                  <div className="p-3 bg-blue-50 border-l-4 border-blue-600 rounded text-xs text-blue-950">
                    <strong className="block mb-0.5">Consular Attestation Remarks:</strong>
                    <span>{foundEmployer.officerRemarks}</span>
                  </div>
                )}

                {/* SPECIFICATION: If Approved, Employer receives Relevant Approval Letter */}
                {foundEmployer.status === 'ATTESTED' && (
                  <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-emerald-950 text-sm flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-emerald-600" />
                        Official Employer Attestation Letter Ready
                      </h4>
                      <p className="text-xs text-emerald-800">
                        Commercial registration and housing verified by Indian Diplomatic Mission. Download your official FE Approval Letter & Demand Endorsement.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveFeCertificate(foundEmployer);
                        onClose();
                      }}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow transition flex items-center gap-2 whitespace-nowrap"
                    >
                      <FileText className="w-4 h-4" />
                      <span>View FE Approval Letter</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800">Foreign Employer Not Found</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                  No record matched the FE-ID or trade license number entered. Check the FE identifier (e.g. FE-UAE-9921).
                </p>
              </div>
            )
          )}

          {/* CATEGORY 3: RECRUITING AGENT (RA) RESULTS */}
          {selectedCategory === 'ra' && hasSearched && (
            foundRa ? (
              <div className="space-y-4 animate-in fade-in">
                {/* Status Header */}
                <div className="p-3.5 bg-slate-100 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                      Recruiting Agent Licensing Status
                    </span>
                    <div className="mt-1">
                      {foundRa.status === 'APPROVED' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Registration Certificate (RC) Granted & Active
                        </span>
                      )}
                      {foundRa.status === 'PENDING_POE' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          Under PoE Financial & Bank Guarantee Verification
                        </span>
                      )}
                      {foundRa.status === 'FLAGGED_INCORRECT' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          Rule 25 Audit Deficiencies Flagged
                        </span>
                      )}
                      {foundRa.status === 'REJECTED' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
                          <XCircle className="w-3.5 h-3.5 text-red-600" />
                          License Application Rejected
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 font-bold block">License Identifier</span>
                    <strong className="text-xs text-navy-900 font-mono">
                      {foundRa.raId}
                    </strong>
                  </div>
                </div>

                {/* RA Agency Dossier Card */}
                <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                  <div className="bg-slate-50 font-bold px-3 py-2 border-b border-slate-200 text-navy-900 flex items-center justify-between">
                    <span>Recruiting Agent Legal Credentials</span>
                    <span className="font-mono text-[11px] text-slate-500">
                      PAN: {foundRa.panNumber}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 p-3.5 bg-white">
                    <div className="col-span-2">
                      <span className="text-slate-500 block">Registered Agency Name:</span>
                      <strong className="text-navy-900 text-sm">{foundRa.agencyName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Proprietor / MD:</span>
                      <strong className="text-navy-900">{foundRa.proprietorName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Bank Guarantee Status:</span>
                      <span className="text-emerald-700 font-bold">
                        ₹50 Lakh Verified ({foundRa.bankName})
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500 block">ROC Registered Office:</span>
                      <span className="text-slate-800">{foundRa.rocAddress}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Audited Net Worth:</span>
                      <strong className="text-navy-900 font-mono">
                        ₹{foundRa.netWorthLakhs} Lakhs
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Statutory Compliance:</span>
                      <span className="text-emerald-700 font-bold">
                        Rule 25 Fee Compliance Certified
                      </span>
                    </div>
                  </div>
                </div>

                {/* Officer Remarks */}
                {foundRa.officerRemarks && (
                  <div className="p-3 bg-blue-50 border-l-4 border-blue-600 rounded text-xs text-blue-950">
                    <strong className="block mb-0.5">Protector of Emigrants Endorsement:</strong>
                    <span>{foundRa.officerRemarks}</span>
                  </div>
                )}

                {/* SPECIFICATION: If Approved, RA receives the official Approval Letter / Certificate */}
                {foundRa.status === 'APPROVED' && (
                  <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-emerald-950 text-sm flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-emerald-600" />
                        Official RA Registration Certificate / Approval Letter Ready
                      </h4>
                      <p className="text-xs text-emerald-800">
                        License issued under Section 11 of the Emigration Act 1983. Access your verified Registration Certificate (RC) with QR security endorsement.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveRaCertificate(foundRa);
                        onClose();
                      }}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow transition flex items-center gap-2 whitespace-nowrap"
                    >
                      <FileText className="w-4 h-4" />
                      <span>View RA Approval Letter</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800">Recruiting Agent Not Found</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                  No record matched the RA-ID or agency name entered. Please verify the agent license identifier (e.g. RA-DEL-0418).
                </p>
              </div>
            )
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>Official Ministry of External Affairs Sovereign Database</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded border border-slate-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
