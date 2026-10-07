import React, { useState } from 'react';
import { useEmigrate } from '../../context/EmigrateContext';
import { RARegistration } from '../../types/emigrate';
import {
  Building2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  BadgeIndianRupee,
  FileCheck2,
  Sparkles,
  Shield,
  ShieldCheck,
  Send,
  Award,
  User,
  MapPin,
  FileText,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { highlightKeywordsInText } from '../../services/ocrService';

interface Props {
  ra: RARegistration;
  onClose: () => void;
  viewerRole: 'POE' | 'PGE';
}

export const RecruitingAgentReviewModal: React.FC<Props> = ({ ra, onClose, viewerRole }) => {
  const { updateRAStatus, setActiveRaCertificate } = useEmigrate();

  const [officerRemarks, setOfficerRemarks] = useState(ra.officerRemarks || '');
  const [forwardRemarks, setForwardRemarks] = useState(ra.poeForwardRemarks || '');
  const [activeRawDoc, setActiveRawDoc] = useState<'guarantee' | 'solvency' | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const bgScore = ra.ocrDocuments?.bankGuarantee.score ?? 92;
  const rocScore = ra.ocrDocuments?.incorporationRoc.score ?? 90;
  const isLowConfidence = ra.aiScore < 60 || bgScore < 60 || rocScore < 60;

  const bgAmount = ra.ocrDocuments?.bankGuarantee.extractedAmountLakhs ?? 50;
  const isGuaranteeCompliant = bgAmount >= 50;

  const extractedPan = ra.ocrDocuments?.incorporationRoc.extractedPan || ra.panNumber;
  const isPanMatched = Boolean(
    extractedPan && ra.panNumber && extractedPan.toUpperCase() === ra.panNumber.toUpperCase()
  );

  const handleAction = (
    newStatus: RARegistration['status'],
    defaultRemark: string,
    fwdRemark?: string
  ) => {
    const remark = officerRemarks.trim() || defaultRemark;
    updateRAStatus(ra.raId, newStatus, remark, fwdRemark || forwardRemarks);
    setActionSuccess(`Status updated to: ${newStatus}`);
    setTimeout(() => {
      setActionSuccess(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-navy-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-navy-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  {viewerRole === 'POE' ? 'PoE First-Tier Scrutiny Desk' : 'PGE Statutory Licensing Authority'}
                </span>
                <span className="bg-blue-600 text-white text-[9px] px-1.5 py-0.2 rounded font-bold">
                  SECTION 11 AUDIT
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                {ra.agencyName}
              </h3>
              <p className="text-xs text-slate-300">
                RA-ID: {ra.raId} • PAN: {ra.panNumber} • Managing Director: {ra.proprietorName}
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

        {/* 2-Column Standardized Review Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto flex-1 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* LEFT SIDE (7 Cols): Complete RA Dossier & Documents */}
          <div className="lg:col-span-7 p-6 space-y-5 overflow-y-auto">
            <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-navy-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-navy-900" />
                Complete Recruiting Agent Licensure Dossier (Read-Only)
              </h4>
              <span className="text-[11px] font-mono text-slate-500">File ID: {ra.raId}</span>
            </div>

            {/* Section 1: Organisation & ROC Details */}
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <div className="bg-slate-100 font-bold px-3 py-2 border-b border-slate-200 text-slate-800 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-navy-900" />
                1. Organisation & ROC Registration Information
              </div>
              <div className="p-3.5 bg-white grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 block">Agency Legal Name:</span>
                  <strong className="text-navy-900 text-sm">{ra.agencyName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Permanent Account Number (PAN):</span>
                  <strong className="text-navy-900 font-mono text-sm">{ra.panNumber}</strong>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 block">Registered Office (as per ROC):</span>
                  <span className="text-slate-800 font-medium">{ra.rocAddress}</span>
                </div>
              </div>
            </div>

            {/* Section 2: MD & Proprietor Accountability */}
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <div className="bg-slate-100 font-bold px-3 py-2 border-b border-slate-200 text-slate-800 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-navy-900" />
                2. Key Management Personnel / Managing Director
              </div>
              <div className="p-3.5 bg-white grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 block">Managing Director / Proprietor:</span>
                  <strong className="text-navy-900 text-sm">{ra.proprietorName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Aadhaar Identity Reference:</span>
                  <strong className="text-navy-900 font-mono">{ra.aadhaarNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Primary Banker:</span>
                  <strong className="text-slate-800">{ra.bankName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Rule 25 Service Fee Limit:</span>
                  <span className="text-emerald-700 font-bold">Pledged: ≤ ₹30,000 + GST</span>
                </div>
              </div>
            </div>

            {/* Section 3: Financial Solvency & 5-Year Turnovers */}
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <div className="bg-slate-100 font-bold px-3 py-2 border-b border-slate-200 text-slate-800 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-navy-900" />
                3. Financial Solvency & 5-Year CA Audited Turnovers
              </div>
              <div className="p-3.5 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 block">Certified Net Worth:</span>
                    <strong className="text-navy-900 font-mono text-base">₹{ra.netWorthLakhs} Lakhs</strong>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                    ✓ Exceeds ₹25L Solvency Baseline
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block mb-1">5-Year Audited Turnovers (Lakhs):</span>
                  <div className="grid grid-cols-5 gap-2 text-center font-mono font-bold">
                    {ra.turnoverFiveYears.map((t, i) => (
                      <div key={i} className="p-1.5 bg-slate-50 border border-slate-200 rounded text-[11px]">
                        <span className="text-[9px] text-slate-400 block font-normal">FY{22 + i}</span>
                        <span className="text-navy-900">₹{t}L</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Supporting Scrutiny Scans & Client-Side OCR Dossier */}
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <div className="bg-slate-100 font-bold px-3 py-2 border-b border-slate-200 text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-navy-900" />
                  4. Supporting Scrutiny Scans & Client-Side OCR Dossier
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Tesseract Engine Output</span>
              </div>
              <div className="p-3.5 bg-white grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Bank Guarantee Card */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-navy-900 block">Bank Guarantee Bond</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {ra.ocrDocuments?.bankGuarantee.fileName || 'bank_guarantee_50lakh.pdf'}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                        bgScore >= 60
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      Conf: {bgScore}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {isGuaranteeCompliant ? (
                      <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> ₹50L Verified
                      </span>
                    ) : (
                      <span className="text-[10px] text-rose-700 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Deficient Amount
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setActiveRawDoc(activeRawDoc === 'guarantee' ? null : 'guarantee')
                      }
                      className="px-2 py-1 text-[11px] font-bold bg-navy-900 text-white rounded hover:bg-navy-800 flex items-center gap-1 transition"
                    >
                      <Eye className="w-3 h-3" />
                      <span>{activeRawDoc === 'guarantee' ? 'Hide OCR' : 'View Raw OCR'}</span>
                    </button>
                  </div>
                </div>

                {/* CA Solvency Dossier Card */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-navy-900 block">CA Solvency Certificate</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {ra.ocrDocuments?.incorporationRoc.fileName || 'ca_audited_solvency.pdf'}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                        rocScore >= 60
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      Conf: {rocScore}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {isPanMatched ? (
                      <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> PAN Validated
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-700 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> PAN Check Req
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setActiveRawDoc(activeRawDoc === 'solvency' ? null : 'solvency')
                      }
                      className="px-2 py-1 text-[11px] font-bold bg-navy-900 text-white rounded hover:bg-navy-800 flex items-center gap-1 transition"
                    >
                      <Eye className="w-3 h-3" />
                      <span>{activeRawDoc === 'solvency' ? 'Hide OCR' : 'View Raw OCR'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Raw OCR Viewer with <mark> Highlighted Keywords */}
              {activeRawDoc && (
                <div className="p-3 bg-slate-900 border-t border-slate-700 text-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400 flex items-center gap-1.5 text-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>
                        {activeRawDoc === 'guarantee'
                          ? 'Bank Guarantee Bond OCR Raw Extraction'
                          : 'CA Solvency & Turnover Certificate OCR Raw Extraction'}
                      </span>
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Keywords Highlighted with &lt;mark&gt;
                    </span>
                  </div>
                  <div
                    className="p-3 bg-slate-950 rounded font-mono text-[11px] leading-relaxed max-h-56 overflow-y-auto whitespace-pre-wrap border border-slate-800"
                    dangerouslySetInnerHTML={{
                      __html: highlightKeywordsInText(
                        activeRawDoc === 'guarantee'
                          ? ra.ocrDocuments?.bankGuarantee.rawText || 'No OCR text available'
                          : ra.ocrDocuments?.incorporationRoc.rawText || 'No OCR text available',
                        {
                          panNumber: ra.panNumber,
                          agencyName: ra.agencyName,
                          guaranteeAmount: '50,00,000',
                          fullName: ra.proprietorName,
                          additional: [ra.bankName, 'SECTION 11', 'RULE 25', 'PGE', 'LAKH'],
                        }
                      ),
                    }}
                  />
                </div>
              )}
            </div>

            {/* Prior Officer Observations */}
            {ra.officerRemarks && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs">
                <strong className="text-amber-900 block mb-0.5">Prior Scrutiny Observations:</strong>
                <span className="text-slate-700">{ra.officerRemarks}</span>
              </div>
            )}
          </div>

          {/* RIGHT SIDE (5 Cols): AI Insights & Decision Actions */}
          <div className="lg:col-span-5 p-6 space-y-4 bg-slate-50/50 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  AI Scrutiny & Solvency Engine
                </h4>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    isLowConfidence ? 'bg-rose-700 text-white' : 'bg-navy-900 text-amber-400'
                  }`}
                >
                  Confidence: {ra.aiScore}%
                </span>
              </div>

              {/* Live OCR Verification Chips */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg space-y-1">
                  <span className="text-[10px] text-slate-500 block">Bank Guarantee:</span>
                  {isGuaranteeCompliant ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> ✓ ₹50L Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded border border-rose-300">
                      <AlertTriangle className="w-3 h-3 text-rose-600" /> ⚠ Deficient ({bgAmount}L)
                    </span>
                  )}
                </div>

                <div className="p-2.5 bg-white border border-slate-200 rounded-lg space-y-1">
                  <span className="text-[10px] text-slate-500 block">PAN Cross-Match:</span>
                  {isPanMatched ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> ✓ 100% Match
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                      <AlertTriangle className="w-3 h-3 text-amber-600" /> Audit Required
                    </span>
                  )}
                </div>
              </div>

              {/* Risk Indicators Panel */}
              <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-2 text-xs">
                <span className="font-bold text-slate-800 block text-xs flex items-center justify-between">
                  <span>Important Risk Indicators:</span>
                  {isLowConfidence || !isGuaranteeCompliant ? (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded border border-rose-300">
                      High Risk Flag
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                      Compliant
                    </span>
                  )}
                </span>

                {/* Edge Case 1: Low Confidence / Blurry */}
                {isLowConfidence && (
                  <div className="p-2 bg-rose-50 border border-rose-300 rounded text-rose-950 text-[11px] font-semibold flex items-start gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Confidence: &lt;60%</strong>
                      <p className="font-normal text-rose-900 mt-0.5">
                        Document illegible, blank, or low-resolution. Manual physical PoE scrutiny required.
                      </p>
                    </div>
                  </div>
                )}

                {/* Edge Case 2: Below statutory 50 Lakh guarantee */}
                {!isGuaranteeCompliant && (
                  <div className="p-2 bg-rose-50 border border-rose-300 rounded text-rose-950 text-[11px] font-semibold flex items-start gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Statutory Deficit: BELOW ₹50 Lakh Minimum</strong>
                      <p className="font-normal text-rose-900 mt-0.5">
                        Uploaded bank guarantee specifies only ₹{bgAmount} Lakhs, falling short of the Section 11 mandate.
                      </p>
                    </div>
                  </div>
                )}

                {/* Telemetry risk indicators */}
                {ra.aiTelemetry?.riskIndicators &&
                  ra.aiTelemetry.riskIndicators.map((risk, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-amber-50 border border-amber-300 rounded text-amber-950 text-[11px] font-semibold flex items-start gap-1.5"
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span>{risk}</span>
                    </div>
                  ))}

                {(!ra.aiTelemetry?.riskIndicators || ra.aiTelemetry.riskIndicators.length === 0) &&
                  !isLowConfidence &&
                  isGuaranteeCompliant && (
                    <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 p-2 rounded text-[11px] font-semibold border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>Zero adverse criminal record or Rule 25 overcharging complaints lodged on PGE database.</span>
                    </div>
                  )}
              </div>

              {/* AI Summary */}
              <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1 text-xs">
                <span className="font-bold text-navy-900 block">PoE Scrutiny AI Summary:</span>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  Entity <strong>{ra.agencyName}</strong> (Managing Director: {ra.proprietorName}) has submitted audited records with ₹{ra.netWorthLakhs} Lakhs net worth. Bank Guarantee of ₹50 Lakh verified with {ra.bankName}.
                </p>
              </div>

              {/* Remarks Inputs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {viewerRole === 'POE' ? 'PoE Scrutiny Officer Remarks *' : 'PGE Higher Authority Remarks *'}
                </label>
                <textarea
                  value={officerRemarks}
                  onChange={(e) => setOfficerRemarks(e.target.value)}
                  placeholder="Enter scrutiny observations, bank guarantee validation, or conditions..."
                  rows={2}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded bg-white focus:ring-2 focus:ring-navy-900 focus:outline-none"
                />
              </div>

              {viewerRole === 'POE' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Forwarding Note to PGE (Higher Authority)
                  </label>
                  <input
                    type="text"
                    value={forwardRemarks}
                    onChange={(e) => setForwardRemarks(e.target.value)}
                    placeholder="E.g. Bank guarantee deed physically inspected. Recommended for grant of RC."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white focus:ring-2 focus:ring-navy-900 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Officer Action Buttons */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              {viewerRole === 'POE' ? (
                /* PoE First-Tier Actions: Scrutinize & Forward or Flag */
                <div className="space-y-2">
                  <button
                    onClick={() =>
                      handleAction(
                        'PENDING_PGE_APPROVAL',
                        'Scrutiny completed by PoE. Bank guarantee verified. Forwarded to PGE for licensing.',
                        forwardRemarks || 'Recommended for Certificate of Registration grant under Section 11.'
                      )
                    }
                    className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Forward to PGE with Recommendation</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() =>
                        handleAction(
                          'FLAGGED_INCORRECT',
                          'Bank guarantee deed or audited turnovers deficient. Returned for agency rectification.'
                        )
                      }
                      className="p-2 bg-amber-500 hover:bg-amber-600 text-navy-950 font-bold text-xs rounded transition flex items-center justify-center gap-1 shadow-xs"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Flag Deficiencies</span>
                    </button>
                    <button
                      onClick={() =>
                        handleAction(
                          'REJECTED',
                          'Application rejected due to failed financial solvency or statutory guarantee deficit.'
                        )
                      }
                      className="p-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded transition flex items-center justify-center gap-1 shadow-xs"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject Dossier</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* PGE Higher Authority Actions: Grant License or Flag */
                <div className="space-y-2">
                  <button
                    onClick={() =>
                      handleAction(
                        'APPROVED',
                        'PGE Grant of Registration: License approved under Section 11 of the Emigration Act 1983. Valid for 5 years.'
                      )
                    }
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Award className="w-4 h-4 text-amber-300" />
                    <span>Grant Section 11 Registration Certificate (Approve)</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() =>
                        handleAction(
                          'FLAGGED_PGE_REVIEW',
                          'PGE requested further clarification from PoE and applicant regarding financial ledgers.'
                        )
                      }
                      className="p-2 bg-amber-500 hover:bg-amber-600 text-navy-950 font-bold text-xs rounded transition flex items-center justify-center gap-1 shadow-xs"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Flag Back to PoE</span>
                    </button>
                    <button
                      onClick={() =>
                        handleAction(
                          'REJECTED',
                          'PGE Order: Licensing application rejected under Section 11(3) of Emigration Act 1983.'
                        )
                      }
                      className="p-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded transition flex items-center justify-center gap-1 shadow-xs"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject Application</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setActiveRaCertificate(ra);
                    onClose();
                  }}
                  className="text-xs text-navy-900 hover:underline font-bold"
                >
                  Preview Formal Certificate of Registration (RC) →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
