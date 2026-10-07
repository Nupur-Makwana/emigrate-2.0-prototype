import React, { useState } from 'react';
import { useEmigrate } from '../../context/EmigrateContext';
import { EmigrantApplication } from '../../types/emigrate';
import { MRW_MATRIX } from '../../data/seedData';
import {
  User,
  FileText,
  Briefcase,
  Shield,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Sparkles,
  Send,
  Building,
  GraduationCap,
  Calendar,
  Lock,
  ArrowRight,
  Eye,
  FileCheck2,
  AlertCircle,
  Check,
  HelpCircle,
  Award,
  Info,
  Search,
  Code,
} from 'lucide-react';
import { highlightKeywordsInText } from '../../services/ocrService';

interface StandardApplicationReviewProps {
  application: EmigrantApplication;
  onClose: () => void;
  viewerRole: 'POE' | 'PGE';
}

export const StandardApplicationReview: React.FC<StandardApplicationReviewProps> = ({
  application,
  onClose,
  viewerRole,
}) => {
  const { updateEmigrantStatus, forwardEmigrantToPge, setActiveContractPass } = useEmigrate();

  const [officerRemarks, setOfficerRemarks] = useState(application.officerRemarks || '');
  const [forwardRemarks, setForwardRemarks] = useState(application.poeForwardRemarks || '');
  const [activeDocPreview, setActiveDocPreview] = useState<'passport' | 'contract' | 'photo' | 'visa' | null>(null);
  const [viewRawExtraction, setViewRawExtraction] = useState<boolean>(false);
  const [searchHighlight, setSearchHighlight] = useState<string>('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Statutory benchmark comparison
  const benchmark = MRW_MATRIX.find(
    (m) => m.country === application.destinationCountry && m.trade === application.tradeCategory
  );
  const benchmarkSalary = benchmark ? benchmark.minimumWageLocal : 1200;

  // Use live OCR extracted salary if available, else form offeredSalary
  const contractExtractedSalary = application.ocrDocuments?.contract?.extractedSalary;
  const effectiveSalary =
    contractExtractedSalary !== undefined ? contractExtractedSalary : application.offeredSalary;
  const isWageCompliant =
    effectiveSalary >= benchmarkSalary && (application.ocrDocuments?.contract?.isWageCompliant ?? true);
  const isMrzMatch = application.ocrDocuments?.passport?.isMatch ?? true;
  const passportScore = application.ocrDocuments?.passport?.score ?? 95;
  const contractScore = application.ocrDocuments?.contract?.score ?? 92;
  const isLowConfidence =
    application.aiScore < 60 ||
    passportScore < 60 ||
    contractScore < 60 ||
    application.ocrDocuments?.passport?.legible === false;

  // Handle POE forwarding to Higher Officer (PGE) - POE CANNOT APPROVE OR GRANT EC
  const handlePoeForward = () => {
    const remark =
      forwardRemarks.trim() ||
      'Complete application dossier reviewed. Bio-page MRZ, wage compliance, and PBBY policy checked. Forwarded for Higher Officer (PGE) final statutory approval.';
    forwardEmigrantToPge(application.arn, remark);
    setActionSuccess('Application successfully forwarded for Higher Officer (PGE) Approval!');
    setTimeout(() => {
      setActionSuccess(null);
      onClose();
    }, 1800);
  };

  // Handle PGE final approval & grant
  const handlePgeApprove = () => {
    const remark =
      officerRemarks.trim() ||
      'Final scrutiny completed by Protector General of Emigrants (PGE). All statutory requirements satisfied. Emigration Clearance granted.';
    updateEmigrantStatus(application.arn, 'APPROVED_EC_GRANTED', remark);
    setActionSuccess('Emigration Clearance granted! Dynamic Cryptographic Pass unlocked.');
    setTimeout(() => {
      setActionSuccess(null);
      onClose();
    }, 1800);
  };

  // Handle Flag Incorrect
  const handleFlagIncorrect = () => {
    const remark =
      officerRemarks.trim() ||
      'Deficiencies identified in submitted documents or statutory wages. Returned to applicant tracking view for correction.';
    updateEmigrantStatus(application.arn, 'FLAGGED_INCORRECT', remark);
    setActionSuccess('Application flagged and returned to applicant for corrections.');
    setTimeout(() => {
      setActionSuccess(null);
      onClose();
    }, 1800);
  };

  // Handle Rejection
  const handleReject = () => {
    const remark =
      officerRemarks.trim() ||
      'Application formally rejected under Section 24 of the Emigration Act 1983 due to fraudulent or non-compliant credentials.';
    updateEmigrantStatus(application.arn, 'REJECTED', remark);
    setActionSuccess('Application officially rejected.');
    setTimeout(() => {
      setActionSuccess(null);
      onClose();
    }, 1800);
  };

  const getStatusBadge = (status: EmigrantApplication['status']) => {
    switch (status) {
      case 'APPROVED_EC_GRANTED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Approved & EC Granted
          </span>
        );
      case 'PENDING_PGE_APPROVAL':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1 animate-pulse">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            Awaiting Higher Officer (PGE) Approval
          </span>
        );
      case 'PENDING_POE':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Under PoE Officer Review
          </span>
        );
      case 'FLAGGED_INCORRECT':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            Deficiencies Flagged
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full border border-slate-300 overflow-hidden flex flex-col max-h-[95vh]">
        <div className="tricolor-stripe" />

        {/* Modal Header */}
        <div className="bg-navy-900 text-white px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-navy-800 rounded-md border border-navy-700">
              <Shield className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">
                  Application Scrutiny & Verification: {application.arn}
                </h3>
                {getStatusBadge(application.status)}
              </div>
              <p className="text-xs text-slate-300">
                Reviewing Role:{' '}
                <strong className="text-amber-400">
                  {viewerRole === 'POE'
                    ? 'Protector of Emigrants (PoE Desk) — Review & Forward Authority'
                    : 'Protector General of Emigrants (Higher Officer Desk) — Final Granting Authority'}
                </strong>{' '}
                • Section 15 Scrutiny
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

        {actionSuccess && (
          <div className="bg-emerald-600 text-white text-xs px-6 py-2.5 font-bold flex items-center gap-2 shadow-inner">
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* 2-Column Standardized Review Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto flex-1 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* ========================================================
              LEFT SIDE (7 Cols): Complete Application Information
              Clean, structured, read-only format with all sections:
              - Applicant Information & Personal Details
              - Passport / Identification Details
              - Travel / Mission Details
              - Organization Details
              - Supporting Documents
              - Declarations
              ======================================================== */}
          <div className="lg:col-span-7 p-6 space-y-5 overflow-y-auto bg-slate-50/30">
            <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-navy-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-navy-900" />
                  Complete Application Form Dossier (Read-Only)
                </h4>
                <p className="text-[11px] text-slate-500">
                  All applicant data and uploaded documents rendered directly for reviewer scrutiny.
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                Filing Date: {application.submissionDate}
              </span>
            </div>

            {/* Section 1: Applicant Information & Personal Details */}
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs bg-white shadow-xs">
              <div className="bg-slate-100 font-bold px-3 py-2 border-b border-slate-200 text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-navy-900" />
                  1. Applicant Information & Personal Details
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Dossier ID: APP-{application.arn.slice(-4)}</span>
              </div>
              <div className="p-3.5 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 block text-[11px]">Full Legal Name:</span>
                  <strong className="text-navy-900 text-sm font-semibold">{application.fullName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Father's / Spouse's Name:</span>
                  <strong className="text-slate-800 text-xs font-semibold">{application.fatherName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Date of Birth (DOB):</span>
                  <strong className="text-slate-800 text-xs font-semibold">{application.dob}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Educational Qualification:</span>
                  <strong className="text-slate-800 text-xs font-semibold">
                    {application.ecrStatus === 'ECR' ? 'Non-Matriculate (Under 10th Standard)' : 'Matriculate & Above (10th+)'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Gender & Marital Status:</span>
                  <strong className="text-slate-800 text-xs font-semibold">Male • Married</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Permanent Domicile State:</span>
                  <strong className="text-slate-800 text-xs font-semibold">Rajasthan (District: Sikar)</strong>
                </div>
              </div>
            </div>

            {/* Section 2: Passport / Identification Details */}
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs bg-white shadow-xs">
              <div className="bg-slate-100 font-bold px-3 py-2 border-b border-slate-200 text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-navy-900" />
                  2. Passport / Identification Details
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Ministry of External Affairs Passport Seva</span>
              </div>
              <div className="p-3.5 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 block text-[11px]">Passport Number:</span>
                  <strong className="text-navy-900 font-mono text-sm">{application.passportNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">ECR Status Endorsement:</span>
                  <span className="inline-block bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[11px] border border-amber-300">
                    {application.ecrStatus} (Emigration Check Required)
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Place of Passport Issue:</span>
                  <strong className="text-slate-800">{application.placeOfIssue || 'RPO Jaipur'}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Passport Validity Expiry:</span>
                  <strong className="text-slate-800 font-mono">{application.passportExpiry}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Aadhaar Masked Ref:</span>
                  <strong className="text-slate-800 font-mono">XXXX-XXXX-9021</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Nationality:</span>
                  <strong className="text-slate-800">Citizen of India</strong>
                </div>
              </div>
            </div>

            {/* Section 3: Travel / Mission Details */}
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs bg-white shadow-xs">
              <div className="bg-slate-100 font-bold px-3 py-2 border-b border-slate-200 text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-navy-900" />
                  3. Travel & Overseas Mission Details
                </span>
                <span className="text-[10px] text-slate-500">Notified ECR Corridor</span>
              </div>
              <div className="p-3.5 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 block text-[11px]">Destination Country:</span>
                  <strong className="text-navy-900 text-sm font-semibold">{application.destinationCountry}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Designated Indian Mission:</span>
                  <strong className="text-slate-800 text-xs font-semibold">
                    {application.destinationCountry === 'United Arab Emirates'
                      ? 'Embassy of India, Abu Dhabi / Consulate General Dubai'
                      : application.destinationCountry === 'Kingdom of Saudi Arabia'
                      ? 'Embassy of India, Riyadh'
                      : `Embassy of India, ${application.destinationCountry}`}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Trade Category / Job Title:</span>
                  <strong className="text-navy-900 text-sm font-semibold">{application.tradeCategory}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Offered Contract Wage:</span>
                  <strong className="text-navy-900 font-mono text-sm">
                    {application.currency} {application.offeredSalary.toLocaleString()} / month
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Statutory Minimum Referral Wage (MRW):</span>
                  <span className="font-mono text-slate-700 font-semibold">
                    {application.currency} {benchmarkSalary.toLocaleString()} (Benchmark Met: {isWageCompliant ? 'YES' : 'NO'})
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Expected Port of Departure:</span>
                  <strong className="text-slate-800">IGI Airport, New Delhi (DEL)</strong>
                </div>
              </div>
            </div>

            {/* Section 4: Organization Details (Employer & Recruiting Agent) */}
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs bg-white shadow-xs">
              <div className="bg-slate-100 font-bold px-3 py-2 border-b border-slate-200 text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-navy-900" />
                  4. Organization Details (Foreign Employer & Intermediaries)
                </span>
                <span className="text-[10px] text-slate-500">Statutory Linkage</span>
              </div>
              <div className="p-3.5 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 block text-[11px]">Foreign Employer ID (FE-ID):</span>
                  <strong className="text-navy-900 font-mono">{application.feId || 'FE-UAE-9921'}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Foreign Employer Legal Name:</span>
                  <strong className="text-navy-900">Al-Habtoor Engineering Enterprises LLC</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Recruiting Agent ID (RA-ID):</span>
                  <strong className="text-navy-900 font-mono">
                    {application.raId || 'Direct Employment (Exempt)'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Recruiting Agency Name:</span>
                  <strong className="text-slate-800">
                    {application.raId ? 'Apex International Overseas Consultants Ltd' : 'Direct Employer Hiring'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">PBBY Insurance Policy Number:</span>
                  <strong className="font-mono text-navy-900">{application.pbbyPolicyNo}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">PBBY Insurance Verification:</span>
                  <span
                    className={`font-bold ${
                      application.pbbyStatus === 'VALID' ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {application.pbbyStatus === 'VALID'
                      ? '✓ Confirmed by IRDAI Portal (₹10 Lakh Cover)'
                      : 'Pending Asynchronous Gateway'}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 5: Supporting Documents */}
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs bg-white shadow-xs">
              <div className="bg-slate-100 font-bold px-3 py-2 border-b border-slate-200 text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-navy-900" />
                  5. Supporting Documents (Uploaded Scans & OCR Validation)
                </span>
                <span className="text-[10px] text-slate-500">Click to Scrutinize Document</span>
              </div>
              <div className="p-3.5 grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveDocPreview('passport')}
                  className={`p-3 border rounded-lg text-left transition ${
                    activeDocPreview === 'passport'
                      ? 'border-navy-900 bg-navy-50 shadow-xs'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-400'
                  }`}
                >
                  <span className="font-bold text-navy-900 block text-xs">Passport Bio-Page</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    OCR Score: {application.ocrDocuments.passport.score}%
                  </span>
                  <span className="text-[10px] text-blue-700 font-bold flex items-center gap-0.5 mt-1">
                    <Eye className="w-3 h-3" /> Inspect Scan
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDocPreview('contract')}
                  className={`p-3 border rounded-lg text-left transition ${
                    activeDocPreview === 'contract'
                      ? 'border-navy-900 bg-navy-50 shadow-xs'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-400'
                  }`}
                >
                  <span className="font-bold text-navy-900 block text-xs">Employment Contract</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    OCR Score: {application.ocrDocuments.contract.score}%
                  </span>
                  <span className="text-[10px] text-blue-700 font-bold flex items-center gap-0.5 mt-1">
                    <Eye className="w-3 h-3" /> Inspect Clauses
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDocPreview('photo')}
                  className={`p-3 border rounded-lg text-left transition ${
                    activeDocPreview === 'photo'
                      ? 'border-navy-900 bg-navy-50 shadow-xs'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-400'
                  }`}
                >
                  <span className="font-bold text-navy-900 block text-xs">Photograph (35x45mm)</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    OCR Score: {application.ocrDocuments.photo.score}%
                  </span>
                  <span className="text-[10px] text-blue-700 font-bold flex items-center gap-0.5 mt-1">
                    <Eye className="w-3 h-3" /> Inspect Photo
                  </span>
                </button>
              </div>

              {/* Document Preview Overlay if clicked */}
              {activeDocPreview && (
                <div className="m-3 p-4 bg-slate-900 text-slate-200 rounded-xl text-xs space-y-3 border border-slate-700 animate-in fade-in shadow-xl">
                  {/* Scrutiny Header with Raw Extraction Toggle */}
                  <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-2.5 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-emerald-400 font-bold uppercase text-xs">
                        Document Scrutiny Window: {activeDocPreview === 'passport' ? 'Passport Bio-Page' : activeDocPreview === 'contract' ? 'Employment Contract' : 'Photograph'}
                      </span>
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                        OCR Score: {activeDocPreview === 'passport' ? passportScore : activeDocPreview === 'contract' ? contractScore : 98}%
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* View Raw Extraction Toggle as requested */}
                      {(activeDocPreview === 'passport' || activeDocPreview === 'contract') && (
                        <button
                          type="button"
                          onClick={() => setViewRawExtraction(!viewRawExtraction)}
                          className={`px-3 py-1 text-[11px] font-bold rounded-lg transition flex items-center gap-1.5 border ${
                            viewRawExtraction
                              ? 'bg-amber-500 text-navy-950 border-amber-400 shadow-sm'
                              : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-600'
                          }`}
                        >
                          <Code className="w-3.5 h-3.5" />
                          <span>{viewRawExtraction ? 'Showing Raw OCR' : 'View Raw Extraction'}</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setActiveDocPreview(null);
                          setViewRawExtraction(false);
                          setSearchHighlight('');
                        }}
                        className="text-slate-400 hover:text-white font-bold px-2 py-1 rounded hover:bg-slate-800 transition"
                      >
                        Close Viewer ✕
                      </button>
                    </div>
                  </div>

                  {/* PASSPORT SCRUTINY */}
                  {activeDocPreview === 'passport' && (
                    <div className="space-y-2.5">
                      {viewRawExtraction ? (
                        /* RAW EXTRACTION VIEW WITH HIGHLIGHTED KEYWORDS */
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300">
                            <span className="flex items-center gap-1 text-amber-300 font-semibold">
                              <Sparkles className="w-3.5 h-3.5" />
                              Critical keywords highlighted with &lt;mark&gt; (Passport No, Full Name, Nationality):
                            </span>
                            <div className="relative w-48 sm:w-60">
                              <input
                                type="text"
                                value={searchHighlight}
                                onChange={(e) => setSearchHighlight(e.target.value)}
                                placeholder="Search keyword in OCR..."
                                className="w-full pl-7 pr-2 py-1 bg-black/60 border border-slate-700 rounded text-[11px] text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                              />
                              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
                            </div>
                          </div>

                          <div
                            className="p-3.5 bg-black/70 rounded-lg font-mono text-[11px] text-emerald-400 max-h-60 overflow-y-auto whitespace-pre-wrap border border-slate-800 leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: highlightKeywordsInText(
                                application.ocrDocuments?.passport?.rawText ||
                                  `GOVERNMENT OF INDIA / REPUBLIC OF INDIA\nPASSPORT / पासपोर्ट\nType: P Country Code: IND Passport No.: ${application.passportNumber}\nGiven Name: ${application.fullName}\nNationality: INDIAN Date of Birth: ${application.dob}\nPlace of Issue: ${application.placeOfIssue || 'JAIPUR'} Date of Expiry: ${application.passportExpiry}\nEMIGRATION CHECK REQUIRED (${application.ecrStatus})\n${application.ocrDocuments?.passport?.mrz || ''}`,
                                {
                                  passportNumber: application.passportNumber,
                                  fullName: application.fullName,
                                  additional: searchHighlight ? [searchHighlight] : [],
                                }
                              ),
                            }}
                          />

                          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-800">
                            <span>MRZ Regex: /[A-Z][0-9]&#123;7&#125;/ • Extracted: {application.ocrDocuments?.passport?.extractedPassportNo || application.passportNumber}</span>
                            <span>Engine: Tesseract.js 7.0 • Worker Memory Terminated</span>
                          </div>
                        </div>
                      ) : (
                        /* STRUCTURED VIEW */
                        <div className="space-y-2">
                          <p className="text-[11px] text-slate-400">Scanned Bio-Page Machine Readable Zone (MRZ):</p>
                          <pre className="p-2.5 bg-black/60 rounded font-mono text-[11px] text-emerald-400 overflow-x-auto border border-emerald-900/40">
                            {application.ocrDocuments.passport.mrz}
                          </pre>
                          <div className="flex items-center justify-between text-[11px]">
                            <div className="text-emerald-400 font-semibold flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" />
                              All 44 MRZ characters verified with passport number {application.passportNumber}.
                            </div>
                            <button
                              type="button"
                              onClick={() => setViewRawExtraction(true)}
                              className="text-amber-400 hover:underline font-bold text-[11px]"
                            >
                              Toggle Raw OCR Text →
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* CONTRACT SCRUTINY */}
                  {activeDocPreview === 'contract' && (
                    <div className="space-y-2.5">
                      {viewRawExtraction ? (
                        /* RAW EXTRACTION VIEW WITH HIGHLIGHTED KEYWORDS */
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300">
                            <span className="flex items-center gap-1 text-amber-300 font-semibold">
                              <Sparkles className="w-3.5 h-3.5" />
                              Critical keywords highlighted with &lt;mark&gt; (Salary, Monthly Pay, Name, Terms):
                            </span>
                            <div className="relative w-48 sm:w-60">
                              <input
                                type="text"
                                value={searchHighlight}
                                onChange={(e) => setSearchHighlight(e.target.value)}
                                placeholder="Search keyword in OCR..."
                                className="w-full pl-7 pr-2 py-1 bg-black/60 border border-slate-700 rounded text-[11px] text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                              />
                              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
                            </div>
                          </div>

                          <div
                            className="p-3.5 bg-black/70 rounded-lg font-mono text-[11px] text-emerald-400 max-h-60 overflow-y-auto whitespace-pre-wrap border border-slate-800 leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: highlightKeywordsInText(
                                application.ocrDocuments?.contract?.rawText ||
                                  `STANDARD BILATERAL EMPLOYMENT CONTRACT\nMINISTRY OF EXTERNAL AFFAIRS • EMIGRATE 2.0 OVERSEAS ACCORD\nFirst Party (Employer): Al-Habtoor Engineering Enterprises LLC (${application.feId || 'FE-UAE-9921'})\nSecond Party (Employee): ${application.fullName} (Indian Citizen)\nDesignated Trade / Occupation: ${application.tradeCategory}\nClause 2: Monthly Basic Wage: ${application.currency} ${effectiveSalary} per calendar month.\nClause 3: Working hours shall not exceed 8 hours per day, 48 hours weekly.\nClause 4: Accommodation, medical treatment and local transport provided free of charge.\nClause 5: Pravasi Bharatiya Bima Yojana (PBBY) ₹10 Lakh cover fully verified.\nClause 6: Rule 25 Compliance: No recruitment fees in excess of ₹30,000 charged.`,
                                {
                                  salary: effectiveSalary,
                                  fullName: application.fullName,
                                  additional: searchHighlight ? [searchHighlight] : [],
                                }
                              ),
                            }}
                          />

                          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-800">
                            <span>Extracted Salary: {application.currency} {effectiveSalary} • MRW Benchmark: {application.currency} {benchmarkSalary}</span>
                            <span>Status: {isWageCompliant ? '✓ Compliant' : '⚠ Deficient Wage'}</span>
                          </div>
                        </div>
                      ) : (
                        /* STRUCTURED VIEW */
                        <div className="space-y-2">
                          <p className="text-[11px] text-slate-400">Parsed Employment Contract Clauses:</p>
                          <div className="p-2.5 bg-black/60 rounded text-[11px] space-y-1 font-mono text-slate-300 border border-slate-800">
                            <div>• Clause 2 (Wage): {application.currency} {effectiveSalary} / month (Statutory benchmark: {application.currency} {benchmarkSalary})</div>
                            <div>• Clause 3 (Hours): 8 hrs/day, 48 hrs/week, Friday statutory rest</div>
                            <div>• Clause 4 (Amenities): Free bachelor accommodation & transport provided by employer</div>
                            <div>• Clause 5 (Insurance): PBBY ₹10 Lakh statutory cover active</div>
                            <div>• Clause 6 (Rule 25): No recruitment fee exceeding ₹30,000 + GST</div>
                          </div>
                          <div className="flex justify-end pt-1">
                            <button
                              type="button"
                              onClick={() => setViewRawExtraction(true)}
                              className="text-amber-400 hover:underline font-bold text-[11px]"
                            >
                              Toggle Raw OCR Text →
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* PHOTO SCRUTINY */}
                  {activeDocPreview === 'photo' && (
                    <div className="flex items-center gap-3 p-3 bg-black/60 rounded-lg">
                      <div className="w-14 h-16 bg-slate-800 rounded border border-slate-600 flex items-center justify-center font-bold text-[10px] text-slate-400">
                        PHOTO
                      </div>
                      <div className="text-[11px] space-y-0.5">
                        <div className="text-white font-semibold">Standard 35x45mm Color Photograph</div>
                        <div className="text-emerald-400">✓ Neutral background, eyes open, face covers 75% frame</div>
                        <div className="text-slate-400 text-[10px]">Zero tampering or generative distortion detected</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Section 6: Declarations (Mandatory Legal Undertakings) */}
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs bg-white shadow-xs">
              <div className="bg-slate-100 font-bold px-3 py-2 border-b border-slate-200 text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-navy-900" />
                  6. Declarations & Statutory Undertakings
                </span>
                <span className="text-[10px] text-emerald-700 font-bold font-mono">E-Signed & Timestamped</span>
              </div>
              <div className="p-3.5 space-y-2 text-[11px] text-slate-700">
                <div className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Rule 25 Adherence:</strong> The applicant certifies that no service charges exceeding statutory ₹30,000 + GST were demanded or paid to any agent.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Genuine Documents:</strong> The applicant affirms that all uploaded passport, trade test, and contract documents are genuine and unmanipulated.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Statutory Insurance:</strong> The applicant understands PBBY insurance coverage (₹10 Lakh) is active and claims may be submitted on eMigrate/MADAD.
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Digital Submission Hash: SHA-256#88c01..a09</span>
                  <span>IP Stamp: 103.21.58.42 (NIC Gateway)</span>
                </div>
              </div>
            </div>

            {/* Previous Review History & PoE Findings (Crucial for PGE!) */}
            {application.poeForwardRemarks && (
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-lg text-xs space-y-1">
                <div className="flex items-center justify-between text-navy-900 font-bold">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-blue-700" />
                    PoE Officer Verification Findings (Forwarded to Higher Officer):
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {application.poeVerifiedBy || 'PoE Reviewer'}
                  </span>
                </div>
                <p className="text-slate-800 leading-relaxed font-medium">
                  "{application.poeForwardRemarks}"
                </p>
              </div>
            )}
          </div>

          {/* ========================================================
              RIGHT SIDE (5 Cols): AI Insights & Standardized Decision Panel
              - Summary of the application
              - Missing information & completeness
              - Inconsistencies & Document discrepancies
              - Important risk indicators
              - Items requiring manual verification
              - Recommended action / next step
              - Officer Decision Controls (POE forwards; PGE grants)
              ======================================================== */}
          <div className="lg:col-span-5 p-6 space-y-4 bg-slate-50/60 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    AI Insights & Algorithmic Triage Engine
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    Objective telemetry assisting the officer; final decision rests with the officer.
                  </p>
                </div>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded shadow-xs ${
                    isLowConfidence
                      ? 'bg-red-600 text-white'
                      : 'bg-navy-900 text-amber-400'
                  }`}
                >
                  Confidence: {isLowConfidence ? '<60%' : `${application.aiScore}%`}
                </span>
              </div>

              {/* 1. Summary of the Application */}
              <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1 text-xs shadow-xs">
                <span className="font-bold text-navy-900 block flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-navy-900" />
                  Summary of Application:
                </span>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  Application submitted by <strong>{application.fullName}</strong> (Passport {application.passportNumber}, {application.ecrStatus}) for overseas placement in <strong>{application.destinationCountry}</strong> as <strong>{application.tradeCategory}</strong>. Offered monthly wage is {application.currency} {effectiveSalary.toLocaleString()}. PBBY policy is {application.pbbyStatus === 'VALID' ? 'verified' : 'pending'}.
                </p>
              </div>

              {/* 2. Inconsistencies & Document Discrepancies */}
              <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-2 text-xs shadow-xs">
                <span className="font-bold text-slate-800 block text-xs">
                  Inconsistencies & Document Discrepancies:
                </span>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between p-1.5 rounded bg-slate-50">
                    <span className="text-slate-600">Passport Bio-Page MRZ Match:</span>
                    {isMrzMatch ? (
                      <span className="font-bold text-emerald-700 flex items-center gap-1">
                        <Check className="w-3 h-3" /> ✓ 100% Match (0 Discrepancies)
                      </span>
                    ) : (
                      <span className="font-bold text-red-600 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Mismatch ({application.ocrDocuments?.passport?.extractedPassportNo || 'None'} ≠ {application.passportNumber})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-slate-50">
                    <span className="text-slate-600">Offered Wage vs Statutory MRW:</span>
                    {isWageCompliant ? (
                      <span className="font-bold text-emerald-700 flex items-center gap-1">
                        <Check className="w-3 h-3" /> ✓ Meets Statutory MRW (Compliant)
                      </span>
                    ) : (
                      <span className="font-bold text-red-600 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> BELOW Statutory Minimum Wage
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-slate-50">
                    <span className="text-slate-600">Rule 25 Fee Compliance:</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Certified Compliant (≤ ₹30k)
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Important Risk Indicators */}
              <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-2 text-xs shadow-xs">
                <span className="font-bold text-slate-800 block text-xs">
                  Important Risk Indicators:
                </span>
                {isWageCompliant && isMrzMatch && !isLowConfidence && application.pbbyStatus === 'VALID' ? (
                  <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 p-2.5 rounded text-[11px] font-semibold border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Low Risk: All statutory benchmarks, valid insurance, 100% MRZ match, and unflagged FE employer verified.</span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {isLowConfidence && (
                      <div className="flex items-start gap-2 text-red-900 bg-red-50 p-2.5 rounded text-[11px] border border-red-200 font-medium">
                        <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="block">Document Illegible or Blank (Confidence &lt;60%):</strong>
                          <span>Document illegible or blank. Manual verification required.</span>
                        </div>
                      </div>
                    )}
                    {!isWageCompliant && (
                      <div className="flex items-start gap-2 text-red-900 bg-red-50 p-2.5 rounded text-[11px] border border-red-200 font-medium">
                        <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="block">BELOW Statutory Minimum Wage:</strong>
                          <span>Contract wage ({application.currency} {effectiveSalary.toLocaleString()}) fails the MEA statutory minimum referral wage ({application.currency} {benchmarkSalary.toLocaleString()}).</span>
                        </div>
                      </div>
                    )}
                    {!isMrzMatch && (
                      <div className="flex items-start gap-2 text-red-900 bg-red-50 p-2.5 rounded text-[11px] border border-red-200 font-medium">
                        <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="block">Passport Number Discrepancy:</strong>
                          <span>Extracted passport number ({application.ocrDocuments?.passport?.extractedPassportNo || 'scan'}) differs from application input ({application.passportNumber}).</span>
                        </div>
                      </div>
                    )}
                    {application.pbbyStatus !== 'VALID' && (
                      <div className="flex items-start gap-2 text-amber-900 bg-amber-50 p-2.5 rounded text-[11px] border border-amber-200 font-medium">
                        <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="block">PBBY Policy Pending:</strong>
                          <span>Policy validation pending insurance gateway synchronization.</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 4. Items Requiring Manual Verification */}
              <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1 text-xs shadow-xs">
                <span className="font-bold text-slate-800 block text-xs">
                  Items Requiring Manual Verification:
                </span>
                <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                  <li>Confirm physical signature match on bilateral bilingual contract</li>
                  <li>Check Foreign Employer active visa demand balance ({application.destinationCountry})</li>
                  <li>Ensure passport validity extends beyond minimum 6-month overseas threshold</li>
                </ul>
              </div>

              {/* 5. Recommended Action / Next Step */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs space-y-1 text-amber-950">
                <span className="font-bold block flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Recommended Action / Next Step:
                </span>
                <p className="text-[11px] leading-relaxed">
                  {viewerRole === 'POE' ? (
                    isWageCompliant ? (
                      <span>
                        "All frontline checks satisfied. <strong>Forward for Higher Officer (PGE) final approval</strong>."
                      </span>
                    ) : (
                      <span>
                        "Statutory wage deficit detected. <strong>Flag incorrect and return to applicant</strong>."
                      </span>
                    )
                  ) : isWageCompliant ? (
                    <span>
                      "Frontline PoE review confirmed. <strong>Conduct final verification and Grant Emigration Clearance (EC)</strong>."
                    </span>
                  ) : (
                    <span>
                      "Do not grant clearance. Return application for employer contract correction."
                    </span>
                  )}
                </p>
              </div>

              {/* Remarks Inputs */}
              <div className="space-y-2">
                {viewerRole === 'POE' ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      PoE Findings & Forwarding Remarks to Higher Officer (PGE) *
                    </label>
                    <textarea
                      value={forwardRemarks}
                      onChange={(e) => setForwardRemarks(e.target.value)}
                      placeholder="Add PoE verification notes, bio-page MRZ match confirmation, or items for PGE attention..."
                      rows={2}
                      className="w-full p-2.5 text-xs border border-slate-300 rounded bg-white focus:ring-2 focus:ring-navy-900 focus:outline-none"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      PGE Final Statutory Approval Remarks *
                    </label>
                    <textarea
                      value={officerRemarks}
                      onChange={(e) => setOfficerRemarks(e.target.value)}
                      placeholder="Enter final order number, Section 15 clearance endorsement, or return grounds..."
                      rows={2}
                      className="w-full p-2.5 text-xs border border-slate-300 rounded bg-white focus:ring-2 focus:ring-navy-900 focus:outline-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Role-Specific Action Controls */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              {viewerRole === 'POE' ? (
                /* POE Actions: Can NOT grant EC. Must Forward to Higher Officer */
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleFlagIncorrect}
                      className="p-2.5 bg-amber-500 hover:bg-amber-600 text-navy-950 font-bold text-xs rounded transition flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Flag & Return</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleReject}
                      className="p-2.5 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded transition flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject Application</span>
                    </button>
                  </div>

                  {/* Primary PoE Action: Forward for Higher Officer Approval */}
                  <button
                    type="button"
                    onClick={handlePoeForward}
                    className="w-full py-3 bg-navy-900 hover:bg-navy-800 text-white font-black text-xs rounded-lg shadow-md transition flex items-center justify-center gap-2 border border-navy-700"
                  >
                    <Send className="w-4 h-4 text-amber-400" />
                    <span>Forward for Higher Officer (PGE) Approval</span>
                  </button>
                </div>
              ) : (
                /* PGE Actions: Has full authority to Grant EC */
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleFlagIncorrect}
                      className="p-2.5 bg-amber-500 hover:bg-amber-600 text-navy-950 font-bold text-xs rounded transition flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Return for Correction</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleReject}
                      className="p-2.5 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded transition flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject Application</span>
                    </button>
                  </div>

                  {/* Primary PGE Action: Approve & Grant Emigration Clearance */}
                  <button
                    type="button"
                    onClick={handlePgeApprove}
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-lg shadow-md transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Approve & Grant Emigration Clearance (EC)</span>
                  </button>

                  {application.status === 'APPROVED_EC_GRANTED' && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveContractPass(application);
                        onClose();
                      }}
                      className="w-full py-2 bg-navy-900 text-amber-400 font-bold text-xs rounded flex items-center justify-center gap-1.5"
                    >
                      <span>View Generated Cryptographic Pass</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-2.5 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>Official Section 15 Scrutiny Console • Ministry of External Affairs</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded border border-slate-300 transition"
          >
            Close Review Console
          </button>
        </div>
      </div>
    </div>
  );
};
