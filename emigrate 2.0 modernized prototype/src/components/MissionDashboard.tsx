import React, { useState } from 'react';
import { useEmigrate } from '../context/EmigrateContext';
import { FERegistration } from '../types/emigrate';
import {
  Building2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Search,
  ArrowUpRight,
  Sparkles,
  FileCheck,
  Shield,
  Clock,
  User,
  Phone,
  MapPin,
  FileText,
  Award,
  ExternalLink,
} from 'lucide-react';
import { highlightKeywordsInText } from '../services/ocrService';

export const MissionDashboard: React.FC = () => {
  const { foreignEmployers, updateFEStatus, setActiveFeCertificate } = useEmigrate();

  const [selectedFE, setSelectedFE] = useState<FERegistration | null>(null);
  const [officerRemarksInput, setOfficerRemarksInput] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeRawDoc, setActiveRawDoc] = useState<'tradeLicense' | 'demandLetter' | null>(null);
  const [previewDocModal, setPreviewDocModal] = useState<{ title: string; url: string } | null>(null);

  const filteredFEs = foreignEmployers.filter(
    (fe) =>
      fe.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fe.feId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fe.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fe.tradeLicenseNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: FERegistration['status']) => {
    switch (status) {
      case 'ATTESTED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Attested & Authorized
          </span>
        );
      case 'PENDING_MISSION':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 animate-pulse">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Consular Attestation
          </span>
        );
      case 'FLAGGED_INCORRECT':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-300">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Corrections Requested
          </span>
        );
      case 'FLAGGED_CONSULAR_HEAD':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-300">
            <ArrowUpRight className="w-3.5 h-3.5 text-purple-600" /> Escalated to Consular Head
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-800 bg-red-100 px-2.5 py-0.5 rounded-full border border-red-300">
            <XCircle className="w-3.5 h-3.5 text-red-600" /> Attestation Rejected
          </span>
        );
    }
  };

  const handleAction = (status: FERegistration['status'], defaultRemark: string) => {
    if (!selectedFE) return;
    const remark = officerRemarksInput.trim() || defaultRemark;
    updateFEStatus(selectedFE.feId, status, remark);
    setActionSuccessMsg(`Employer status updated to: ${status}`);
    setTimeout(() => setActionSuccessMsg(null), 3000);
    setSelectedFE((prev) => (prev ? { ...prev, status, officerRemarks: remark } : null));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Embassy Header Banner */}
      <div className="bg-navy-900 text-white p-5 rounded-xl border border-navy-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center">
            <Building2 className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
              Indian Diplomatic Mission & Consular Wing
            </div>
            <h1 className="text-xl font-black text-white">
              Embassy of India • Overseas Employer Attestation Portal
            </h1>
            <p className="text-xs text-slate-300">
              Host Country Verification • Commercial Registry & Quota Verification Desk
            </p>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <div className="text-xs font-bold text-slate-200">Foreign Employers in Queue</div>
          <div className="text-xl font-mono font-black text-amber-400">
            {foreignEmployers.filter((f) => f.status === 'PENDING_MISSION').length} Pending Attestation
          </div>
        </div>
      </div>

      {/* Foreign Employer Attestation Queue Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by employer name, FE-ID, trade license..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-navy-900 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Total Registered Overseas Entities: <strong>{foreignEmployers.length}</strong>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse gov-table">
            <thead>
              <tr>
                <th>FE-ID</th>
                <th>Business Name & Org Type</th>
                <th>Host Country & Jurisdiction</th>
                <th>Trade License / CR</th>
                <th>Requested Quota</th>
                <th>Attestation Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredFEs.map((fe) => (
                <tr key={fe.feId} className="hover:bg-slate-50 transition">
                  <td className="font-mono font-bold text-navy-900">{fe.feId}</td>
                  <td>
                    <div className="font-bold text-slate-900">{fe.businessName}</div>
                    <div className="text-[11px] text-slate-500">{fe.orgType}</div>
                  </td>
                  <td>
                    <div className="font-semibold text-slate-800">{fe.country}</div>
                    <div className="text-[11px] text-slate-500">{fe.jurisdictionMission}</div>
                  </td>
                  <td className="font-mono text-xs text-slate-700">{fe.tradeLicenseNo}</td>
                  <td>
                    <span className="font-bold text-navy-900 font-mono bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {fe.demandQuotaRequested} Workers
                    </span>
                  </td>
                  <td>{getStatusBadge(fe.status)}</td>
                  <td className="text-right">
                    <button
                      onClick={() => {
                        setSelectedFE(fe);
                        setOfficerRemarksInput(fe.officerRemarks || '');
                      }}
                      className="px-3.5 py-1.5 bg-navy-900 hover:bg-navy-800 text-white rounded text-xs font-bold transition inline-flex items-center gap-1.5 shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Dossier</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* STANDARDIZED EMBASSY REVIEW CONSOLE (Left: Full Application / Right: AI Insights) */}
      {selectedFE && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full border border-slate-300 overflow-hidden flex flex-col max-h-[94vh]">
            <div className="tricolor-stripe" />

            {/* Header */}
            <div className="bg-navy-900 text-white px-6 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-navy-800 rounded-md border border-navy-700">
                  <Building2 className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-white">
                      Consular Attestation Dossier: {selectedFE.businessName}
                    </h3>
                    {getStatusBadge(selectedFE.status)}
                  </div>
                  <p className="text-xs text-slate-300">
                    FE-ID: {selectedFE.feId} • {selectedFE.jurisdictionMission}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFE(null)}
                className="text-slate-400 hover:text-white text-lg font-bold px-2 py-0.5 rounded hover:bg-navy-800"
              >
                ✕
              </button>
            </div>

            {actionSuccessMsg && (
              <div className="bg-emerald-600 text-white text-xs px-6 py-2.5 font-bold flex items-center gap-2 shadow-inner">
                <CheckCircle2 className="w-4 h-4" />
                <span>{actionSuccessMsg}</span>
              </div>
            )}

            {/* 2-Column Standardized Review Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto flex-1 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
              {/* LEFT SIDE (7 Cols): Complete Employer Application Information */}
              <div className="lg:col-span-7 p-6 space-y-5 overflow-y-auto">
                <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-navy-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-navy-900" />
                    Complete Foreign Employer Dossier (Read-Only)
                  </h4>
                  <span className="text-[11px] font-mono text-slate-500">
                    Entity ID: {selectedFE.feId}
                  </span>
                </div>

                {/* Section 1: Business & Corporate Information */}
                <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                  <div className="bg-slate-100 font-bold px-3 py-2 border-b border-slate-200 text-slate-800 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-navy-900" />
                    1. Business Identification & Registration Details
                  </div>
                  <div className="p-3.5 bg-white grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500 block">Legal Business Name:</span>
                      <strong className="text-navy-900 text-sm">{selectedFE.businessName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Organization Constitution:</span>
                      <strong className="text-navy-900">{selectedFE.orgType}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Trade License / CR Number:</span>
                      <strong className="text-navy-900 font-mono text-sm">{selectedFE.tradeLicenseNo}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">License Valid Until:</span>
                      <strong className="text-navy-900">{selectedFE.validUntil}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Host Country Sponsor ID:</span>
                      <strong className="text-navy-900 font-mono">{selectedFE.sponsorId}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Host Country:</span>
                      <strong className="text-navy-900">{selectedFE.country}</strong>
                    </div>
                  </div>
                </div>

                {/* Section 2: Authorized Signatory & Emergency Contact */}
                <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                  <div className="bg-slate-100 font-bold px-3 py-2 border-b border-slate-200 text-slate-800 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-navy-900" />
                    2. Authorized Corporate Signatory & Accountability
                  </div>
                  <div className="p-3.5 bg-white grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500 block">Signatory Name:</span>
                      <strong className="text-navy-900 text-sm">{selectedFE.signatoryName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Official Designation:</span>
                      <strong className="text-navy-900">{selectedFE.signatoryDesignation}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Emergency Mobile Contact:</span>
                      <strong className="text-navy-900 font-mono">{selectedFE.emergencyContact}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Jurisdiction Indian Mission:</span>
                      <strong className="text-slate-800">{selectedFE.jurisdictionMission}</strong>
                    </div>
                  </div>
                </div>

                {/* Section 3: Requested Demand Quota & Housing Accommodation */}
                <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                  <div className="bg-slate-100 font-bold px-3 py-2 border-b border-slate-200 text-slate-800 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-navy-900" />
                    3. Manpower Demand Quota & Housing Standards
                  </div>
                  <div className="p-3.5 bg-white grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500 block">Requested Indian Manpower Quota:</span>
                      <strong className="text-navy-900 font-mono text-base">
                        {selectedFE.demandQuotaRequested} Workers
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Accommodation Compliance:</span>
                      <span className="text-emerald-700 font-bold">
                        Host Country MEA Standards Compliant
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section 4: Supporting Attestation Documents with Live OCR */}
                <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                  <div className="bg-slate-100 font-bold px-3 py-2 border-b border-slate-200 text-slate-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <FileCheck className="w-3.5 h-3.5 text-navy-900" />
                      4. Supporting Corporate Scans & Client-Side OCR Dossier
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Tesseract Engine Output</span>
                  </div>
                  <div className="p-3.5 bg-white grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Trade License Card */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-bold text-navy-900 block">Trade License Certificate</span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {selectedFE.ocrDocuments.tradeLicense.fileName || 'trade_license_dxb.pdf'}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                            selectedFE.ocrDocuments.tradeLicense.score >= 60
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}
                        >
                          Conf: {selectedFE.ocrDocuments.tradeLicense.score}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        {selectedFE.ocrDocuments.tradeLicense.score >= 60 ? (
                          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Chamber Attested
                          </span>
                        ) : (
                          <span className="text-[10px] text-rose-700 font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Illegible Scan
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            setActiveRawDoc(activeRawDoc === 'tradeLicense' ? null : 'tradeLicense')
                          }
                          className="px-2 py-1 text-[11px] font-bold bg-navy-900 text-white rounded hover:bg-navy-800 flex items-center gap-1 transition"
                        >
                          <Eye className="w-3 h-3" />
                          <span>{activeRawDoc === 'tradeLicense' ? 'Hide OCR' : 'View Raw OCR'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Demand Letter Card */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-bold text-navy-900 block">Specimen Demand Letter</span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {selectedFE.ocrDocuments.demandLetter.fileName || 'demand_letter_signed.pdf'}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                            selectedFE.ocrDocuments.demandLetter.score >= 60
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}
                        >
                          Conf: {selectedFE.ocrDocuments.demandLetter.score}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        {selectedFE.ocrDocuments.demandLetter.score >= 60 ? (
                          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Quota Endorsed
                          </span>
                        ) : (
                          <span className="text-[10px] text-rose-700 font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Low Confidence
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            setActiveRawDoc(activeRawDoc === 'demandLetter' ? null : 'demandLetter')
                          }
                          className="px-2 py-1 text-[11px] font-bold bg-navy-900 text-white rounded hover:bg-navy-800 flex items-center gap-1 transition"
                        >
                          <Eye className="w-3 h-3" />
                          <span>{activeRawDoc === 'demandLetter' ? 'Hide OCR' : 'View Raw OCR'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Document Viewer: Raw Text with <mark> Highlighted Keywords */}
                  {activeRawDoc && (
                    <div className="p-3 bg-slate-900 border-t border-slate-700 text-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-400 flex items-center gap-1.5 text-xs">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>
                            {activeRawDoc === 'tradeLicense'
                              ? 'Trade License OCR Raw Extraction'
                              : 'Specimen Demand Letter OCR Raw Extraction'}
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
                            activeRawDoc === 'tradeLicense'
                              ? selectedFE.ocrDocuments.tradeLicense.rawText || 'No OCR text available'
                              : selectedFE.ocrDocuments.demandLetter.rawText || 'No OCR text available',
                            {
                              tradeLicenseNo: selectedFE.tradeLicenseNo,
                              demandQuota: selectedFE.demandQuotaRequested,
                              fullName: selectedFE.signatoryName,
                              additional: [selectedFE.businessName, selectedFE.sponsorId, selectedFE.country],
                            }
                          ),
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Previous Officer Remarks */}
                {selectedFE.officerRemarks && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs">
                    <strong className="text-amber-900 block mb-0.5">Previous Consular Observations:</strong>
                    <span className="text-slate-700">{selectedFE.officerRemarks}</span>
                  </div>
                )}
              </div>

              {/* RIGHT SIDE (5 Cols): AI Insights & Embassy Decision Actions */}
              <div className="lg:col-span-5 p-6 space-y-4 bg-slate-50/50 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      AI Insights & Algorithmic Triage Engine
                    </h4>
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        selectedFE.aiScore < 60
                          ? 'bg-rose-700 text-white'
                          : 'bg-navy-900 text-amber-400'
                      }`}
                    >
                      Confidence: {selectedFE.aiScore}%
                    </span>
                  </div>

                  {/* Live OCR Verification Chips */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-white border border-slate-200 rounded-lg space-y-1">
                      <span className="text-[10px] text-slate-500 block">Trade License Match:</span>
                      {selectedFE.ocrDocuments.tradeLicense.rawText &&
                      (selectedFE.ocrDocuments.tradeLicense.rawText
                        .toUpperCase()
                        .includes(selectedFE.tradeLicenseNo.toUpperCase().trim()) ||
                        (selectedFE.ocrDocuments.tradeLicense.extractedLicenseNo &&
                          selectedFE.ocrDocuments.tradeLicense.extractedLicenseNo
                            .toUpperCase()
                            .includes(selectedFE.tradeLicenseNo.toUpperCase().trim()))) ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> ✓ 100% Match
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                          <AlertTriangle className="w-3 h-3 text-amber-600" /> Manual Audit
                        </span>
                      )}
                    </div>

                    <div className="p-2.5 bg-white border border-slate-200 rounded-lg space-y-1">
                      <span className="text-[10px] text-slate-500 block">Demand Quota Match:</span>
                      {selectedFE.ocrDocuments.demandLetter.extractedQuota ===
                      selectedFE.demandQuotaRequested ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> ✓ Quota Aligned
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded border border-blue-300">
                          {selectedFE.demandQuotaRequested} Workers
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Important Risk Indicators Panel */}
                  <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-2 text-xs">
                    <span className="font-bold text-slate-800 block text-xs flex items-center justify-between">
                      <span>Important Risk Indicators:</span>
                      {selectedFE.aiScore < 60 ||
                      selectedFE.ocrDocuments.tradeLicense.score < 60 ||
                      selectedFE.ocrDocuments.demandLetter.score < 60 ? (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded border border-rose-300">
                          High Risk Flag
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                          Low Risk
                        </span>
                      )}
                    </span>

                    {/* Edge Case Alert: Low Confidence / Blurry Scan */}
                    {(selectedFE.aiScore < 60 ||
                      selectedFE.ocrDocuments.tradeLicense.score < 60 ||
                      selectedFE.ocrDocuments.demandLetter.score < 60 ||
                      selectedFE.ocrDocuments.tradeLicense.legible === false) && (
                      <div className="p-2 bg-rose-50 border border-rose-300 rounded text-rose-950 text-[11px] font-semibold flex items-start gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>Confidence: &lt;60%</strong>
                          <p className="font-normal text-rose-900 mt-0.5">
                            Document illegible, blank, or resolution deficient. Manual consular verification required before attestation.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Seeded or form risk indicators */}
                    {selectedFE.aiTelemetry?.riskIndicators &&
                      selectedFE.aiTelemetry.riskIndicators.map((risk, idx) => (
                        <div
                          key={idx}
                          className="p-2 bg-amber-50 border border-amber-300 rounded text-amber-950 text-[11px] font-semibold flex items-start gap-1.5"
                        >
                          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          <span>{risk}</span>
                        </div>
                      ))}

                    {(!selectedFE.aiTelemetry?.riskIndicators ||
                      selectedFE.aiTelemetry.riskIndicators.length === 0) &&
                      selectedFE.aiScore >= 60 && (
                        <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 p-2 rounded text-[11px] font-semibold border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>Zero host-country labour disputes or trade registration flags on Mission database.</span>
                        </div>
                      )}
                  </div>

                  {/* 1. AI Executive Summary */}
                  <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1 text-xs">
                    <span className="font-bold text-navy-900 block">Consular AI Summary:</span>
                    <p className="text-slate-700 text-[11px] leading-relaxed">
                      Entity <strong>{selectedFE.businessName}</strong> verified with host country Department of Economic Development. Commercial Registration #{selectedFE.tradeLicenseNo} valid through {selectedFE.validUntil}. Demand quota of <strong>{selectedFE.demandQuotaRequested}</strong> workers requested for Indian recruitment.
                    </p>
                  </div>

                  {/* 3. Housing Capacity Check */}
                  <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1 text-xs">
                    <span className="font-bold text-slate-800 block text-xs">Housing Capacity Cross-Reference:</span>
                    <div className="text-[11px] text-slate-700 leading-relaxed">
                      Labor camp site inspection records show certified capacity for <strong>400</strong> occupants with currently <strong>220</strong> occupied. Net available bed space (180) accommodates requested quota of <strong>{selectedFE.demandQuotaRequested}</strong>.
                    </div>
                  </div>

                  {/* 4. Recommended Action */}
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1 text-emerald-950">
                    <span className="font-bold block flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      Recommended Consular Action:
                    </span>
                    <p className="text-[11px] leading-relaxed">
                      {selectedFE.aiScore < 60
                        ? 'Flag profile for employer correction due to illegible commercial license scan.'
                        : `"All corporate credentials verified against host Chamber of Commerce. Attest employer and endorse demand quota of ${selectedFE.demandQuotaRequested}."`}
                    </p>
                  </div>

                  {/* Remarks Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Consular Attestation Endorsement Remarks *
                    </label>
                    <textarea
                      value={officerRemarksInput}
                      onChange={(e) => setOfficerRemarksInput(e.target.value)}
                      placeholder="Add consular observations, chamber seal verification, or quota conditions..."
                      rows={2}
                      className="w-full p-2.5 text-xs border border-slate-300 rounded bg-white focus:ring-2 focus:ring-navy-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 4 Standardized Actions */}
                <div className="pt-3 border-t border-slate-200 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() =>
                        handleAction(
                          'FLAGGED_INCORRECT',
                          'Labor accommodation photos or chamber registration deficient. Send back for employer correction.'
                        )
                      }
                      className="p-2.5 bg-amber-500 hover:bg-amber-600 text-navy-950 font-bold text-xs rounded transition flex items-center justify-center gap-1 shadow-xs"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Flag Incorrect</span>
                    </button>

                    <button
                      onClick={() =>
                        handleAction(
                          'FLAGGED_CONSULAR_HEAD',
                          'Forwarded to Consular Head for policy decision on quota allocation.'
                        )
                      }
                      className="p-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded transition flex items-center justify-center gap-1 shadow-xs"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>Forward to Head</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() =>
                        handleAction(
                          'REJECTED',
                          'Corporate entity fails host country compliance or has unresolved labor disputes on record.'
                        )
                      }
                      className="p-2.5 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded transition flex items-center justify-center gap-1 shadow-xs"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject Profile</span>
                    </button>

                    <button
                      onClick={() =>
                        handleAction(
                          'ATTESTED',
                          `Host country commercial registration and housing verified. Employer attested and demand quota of ${selectedFE.demandQuotaRequested} authorized.`
                        )
                      }
                      className="p-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded transition flex items-center justify-center gap-1 shadow-md"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Attest Employer</span>
                    </button>
                  </div>

                  {selectedFE.status === 'ATTESTED' && (
                    <button
                      onClick={() => {
                        setActiveFeCertificate(selectedFE);
                        setSelectedFE(null);
                      }}
                      className="w-full py-2 bg-navy-900 text-amber-300 font-bold text-xs rounded flex items-center justify-center gap-2 border border-navy-700 mt-2"
                    >
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>View Mission Attestation Certificate Pass</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-2.5 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedFE(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded border border-slate-300 transition"
              >
                Close Console
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
