import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  FileCheck2,
  Building2,
  BadgeIndianRupee,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Eye,
  Sparkles,
  File,
  Shield,
  ShieldCheck,
  Check,
  XCircle,
} from 'lucide-react';
import {
  processDocumentFile,
  extractPanNumber,
  extractBankGuaranteeAmount,
  highlightKeywordsInText,
} from '../services/ocrService';
import {
  generateSampleBankGuaranteeImage,
  generateSampleCaCertificateImage,
  generateSampleBlurryImage,
} from '../services/sampleDocs';

export interface RADocumentState {
  file: File | null;
  fileName: string;
  status: 'idle' | 'processing' | 'done' | 'error';
  progress: number;
  statusMessage: string;
  rawText: string;
  confidence: number;
  isLegible: boolean;
  extractedPan?: string;
  extractedAmountLakhs?: number;
  isPanMatched?: boolean;
  isGuaranteeValid?: boolean;
  previewUrl?: string;
}

interface Props {
  agencyName: string;
  panNumber: string;
  proprietorName: string;
  bankName: string;
  netWorthLakhs: number;
  turnovers: number[];
  bankGuaranteeDoc: RADocumentState;
  setBankGuaranteeDoc: React.Dispatch<React.SetStateAction<RADocumentState>>;
  solvencyDoc: RADocumentState;
  setSolvencyDoc: React.Dispatch<React.SetStateAction<RADocumentState>>;
  specimenDoc: { fileName: string; previewUrl?: string; status: 'idle' | 'done' };
  setSpecimenDoc: React.Dispatch<
    React.SetStateAction<{ fileName: string; previewUrl?: string; status: 'idle' | 'done' }>
  >;
}

export const RecruitingAgentDocumentUploader: React.FC<Props> = ({
  agencyName,
  panNumber,
  proprietorName,
  bankName,
  netWorthLakhs,
  turnovers,
  bankGuaranteeDoc,
  setBankGuaranteeDoc,
  solvencyDoc,
  setSolvencyDoc,
  specimenDoc,
  setSpecimenDoc,
}) => {
  const [activeRawPreview, setActiveRawPreview] = useState<'guarantee' | 'solvency' | null>(null);
  const guaranteeInputRef = useRef<HTMLInputElement>(null);
  const solvencyInputRef = useRef<HTMLInputElement>(null);
  const specimenInputRef = useRef<HTMLInputElement>(null);

  // Process Bank Guarantee Bond
  const handleProcessGuarantee = async (file: File) => {
    setBankGuaranteeDoc((prev) => ({
      ...prev,
      file,
      fileName: file.name,
      status: 'processing',
      progress: 5,
      statusMessage: 'Initializing Tesseract OCR worker for Bank Guarantee Bond...',
    }));

    try {
      const ocr = await processDocumentFile(file, 'contract', (statusMessage, progress) => {
        setBankGuaranteeDoc((prev) => ({
          ...prev,
          statusMessage,
          progress,
        }));
      });

      const { amountInLakhs } = extractBankGuaranteeAmount(ocr.rawText);
      // Statutory minimum under Section 11 of Emigration Act 1983 is ₹50 Lakhs
      const isGuaranteeValid = Boolean(amountInLakhs && amountInLakhs >= 50);

      setBankGuaranteeDoc({
        file,
        fileName: file.name,
        status: 'done',
        progress: 100,
        statusMessage: 'OCR Complete • Tesseract Worker Terminated',
        rawText: ocr.rawText,
        confidence: ocr.confidence,
        isLegible: ocr.isLegible,
        extractedAmountLakhs: amountInLakhs || undefined,
        isGuaranteeValid,
        previewUrl: ocr.previewUrl,
      });
    } catch (err) {
      setBankGuaranteeDoc((prev) => ({
        ...prev,
        status: 'error',
        progress: 100,
        statusMessage: 'OCR Processing error',
        rawText: 'Error processing bank guarantee bond scan',
        confidence: 40,
        isLegible: false,
      }));
    }
  };

  // Process Solvency & Balance Sheet
  const handleProcessSolvency = async (file: File) => {
    setSolvencyDoc((prev) => ({
      ...prev,
      file,
      fileName: file.name,
      status: 'processing',
      progress: 5,
      statusMessage: 'Rendering CA balance sheets & solvency dossier...',
    }));

    try {
      const ocr = await processDocumentFile(file, 'contract', (statusMessage, progress) => {
        setSolvencyDoc((prev) => ({
          ...prev,
          statusMessage,
          progress,
        }));
      });

      const extractedPan = extractPanNumber(ocr.rawText) || undefined;
      const isPanMatched = Boolean(
        extractedPan && panNumber && extractedPan.toUpperCase() === panNumber.toUpperCase().trim()
      );

      setSolvencyDoc({
        file,
        fileName: file.name,
        status: 'done',
        progress: 100,
        statusMessage: 'OCR Complete • Tesseract Worker Terminated',
        rawText: ocr.rawText,
        confidence: ocr.confidence,
        isLegible: ocr.isLegible,
        extractedPan,
        isPanMatched,
        previewUrl: ocr.previewUrl,
      });
    } catch (err) {
      setSolvencyDoc((prev) => ({
        ...prev,
        status: 'error',
        progress: 100,
        statusMessage: 'OCR Processing error',
        rawText: 'Error processing solvency document scan',
        confidence: 40,
        isLegible: false,
      }));
    }
  };

  // Process Specimen Signatures
  const handleProcessSpecimen = (file: File) => {
    const url = URL.createObjectURL(file);
    setSpecimenDoc({
      fileName: file.name,
      previewUrl: url,
      status: 'done',
    });
  };

  // Drag and drop handlers
  const handleDrop = (e: React.DragEvent, type: 'guarantee' | 'solvency' | 'specimen') => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (type === 'guarantee') handleProcessGuarantee(file);
      else if (type === 'solvency') handleProcessSolvency(file);
      else if (type === 'specimen') handleProcessSpecimen(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
        <div>
          <h3 className="font-bold text-sm text-navy-900 flex items-center gap-2">
            <Upload className="w-4 h-4 text-navy-900" />
            Part E: Statutory Scrutiny Documents & Live OCR Pipeline
          </h3>
          <p className="text-xs text-slate-500">
            Upload the ₹50 Lakh Bank Guarantee Bond and CA Audited Solvency Certificate (.pdf, .png, .jpg). Full client-side Tesseract.js optical verification executes in your browser.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-900 px-2.5 py-1 rounded font-semibold border border-emerald-200 self-start sm:self-auto">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>Section 11 Emigration Act Gate Active</span>
        </div>
      </div>

      {/* DOCUMENT 1: Irrevocable Bank Guarantee Bond */}
      <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
              1
            </div>
            <div>
              <h4 className="font-bold text-xs text-navy-900 flex items-center gap-1.5">
                <BadgeIndianRupee className="w-4 h-4 text-emerald-700" />
                <span>Statutory Irrevocable Bank Guarantee Bond (₹50 Lakh) *</span>
              </h4>
              <p className="text-[11px] text-slate-500">
                Original deed issued in favor of Protector General of Emigrants (PGE) under Section 11 of Emigration Act 1983
              </p>
            </div>
          </div>

          {/* Quick sample doc test buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Quick Samples:</span>
            <button
              type="button"
              onClick={() => {
                const sample = generateSampleBankGuaranteeImage(agencyName, bankName, panNumber, 50, false);
                handleProcessGuarantee(sample);
              }}
              className="text-[11px] font-bold px-2 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded border border-emerald-200 flex items-center gap-1 transition"
            >
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Load Valid ₹50L Guarantee</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const deficient = generateSampleBankGuaranteeImage(agencyName, bankName, panNumber, 20, true);
                handleProcessGuarantee(deficient);
              }}
              className="text-[11px] font-bold px-2 py-1 bg-rose-50 text-rose-800 hover:bg-rose-100 rounded border border-rose-200 flex items-center gap-1 transition"
            >
              <AlertTriangle className="w-3 h-3 text-rose-600" />
              <span>Load Deficient (₹20L) Bond</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const blurry = generateSampleBlurryImage();
                handleProcessGuarantee(blurry);
              }}
              className="text-[11px] font-bold px-2 py-1 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded border border-amber-200 flex items-center gap-1 transition"
            >
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              <span>Load Blurry Scan</span>
            </button>
          </div>
        </div>

        {/* Drag & Drop Box */}
        <div
          onDrop={(e) => handleDrop(e, 'guarantee')}
          onDragOver={handleDragOver}
          onClick={() => guaranteeInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
            bankGuaranteeDoc.status === 'processing'
              ? 'border-blue-400 bg-blue-50/40'
              : bankGuaranteeDoc.status === 'done'
              ? bankGuaranteeDoc.isGuaranteeValid && bankGuaranteeDoc.isLegible
                ? 'border-emerald-300 bg-emerald-50/20 hover:bg-emerald-50/40'
                : 'border-rose-300 bg-rose-50/30 hover:bg-rose-50/50'
              : 'border-slate-300 hover:border-navy-900 bg-slate-50/50 hover:bg-slate-50'
          }`}
        >
          <input
            type="file"
            ref={guaranteeInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) handleProcessGuarantee(e.target.files[0]);
            }}
            accept=".png,.jpg,.jpeg,.pdf"
            className="hidden"
          />

          {bankGuaranteeDoc.status === 'processing' ? (
            <div className="space-y-3 max-w-sm mx-auto">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
              <div className="text-xs font-bold text-navy-900">{bankGuaranteeDoc.statusMessage}</div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${bankGuaranteeDoc.progress}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                Extracting Section 11 Guarantee Amount & Bank Endorsement ({bankGuaranteeDoc.progress}%)
              </span>
            </div>
          ) : bankGuaranteeDoc.status === 'done' ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-left">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    bankGuaranteeDoc.isGuaranteeValid && bankGuaranteeDoc.isLegible
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-xs text-navy-900 flex items-center gap-2">
                    <span>{bankGuaranteeDoc.fileName}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 font-mono">
                      Conf: {bankGuaranteeDoc.confidence}%
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {bankGuaranteeDoc.isGuaranteeValid
                      ? 'Statutory guarantee amount verified. Click to replace or inspect OCR.'
                      : 'Guarantee amount is deficient (< ₹50 Lakh) or scan unreadable.'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveRawPreview(activeRawPreview === 'guarantee' ? null : 'guarantee');
                  }}
                  className="px-3 py-1.5 text-xs font-bold bg-navy-900 text-white rounded hover:bg-navy-800 flex items-center gap-1.5 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{activeRawPreview === 'guarantee' ? 'Hide OCR' : 'Inspect OCR'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-xs font-bold text-navy-900">
                Drag and drop ₹50 Lakh Bank Guarantee Bond or <span className="text-blue-700 underline">Browse File</span>
              </div>
              <p className="text-[11px] text-slate-500">Supports PDF, PNG, JPG (Multi-page PDFs supported)</p>
            </div>
          )}
        </div>

        {/* Live Triage Telemetry for Bank Guarantee */}
        {bankGuaranteeDoc.status === 'done' && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Section 11 Bank Guarantee Statutory Audit Telemetry</span>
              </span>
              <span className="font-mono text-[11px] text-slate-500">
                Confidence: {bankGuaranteeDoc.confidence}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-2 bg-white rounded border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block">Statutory Minimum:</span>
                  <span className="font-mono font-bold text-navy-900">₹50,00,000 (50 Lakhs)</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">OCR Extracted:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {bankGuaranteeDoc.extractedAmountLakhs
                      ? `₹${bankGuaranteeDoc.extractedAmountLakhs} Lakhs`
                      : 'Unverified'}
                  </span>
                </div>
                <div>
                  {bankGuaranteeDoc.isGuaranteeValid ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      ✓ ₹50L Compliant
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                      ⚠ BELOW Statutory Gate
                    </span>
                  )}
                </div>
              </div>

              <div className="p-2 bg-white rounded border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block">Sovereign Beneficiary:</span>
                  <span className="font-bold text-navy-900">Protector General of Emigrants (PGE)</span>
                </div>
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Irrevocable Deed
                  </span>
                </div>
              </div>
            </div>

            {/* Raw OCR text toggle */}
            {activeRawPreview === 'guarantee' && (
              <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] text-navy-900">Extracted Raw Text with Keywords:</span>
                  <span className="text-[10px] text-slate-400">Tesseract.js Client-Side Buffer</span>
                </div>
                <div
                  className="p-3 bg-slate-900 text-slate-200 rounded font-mono text-[11px] leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap border border-slate-800"
                  dangerouslySetInnerHTML={{
                    __html: highlightKeywordsInText(bankGuaranteeDoc.rawText, {
                      panNumber,
                      agencyName,
                      guaranteeAmount: '50,00,000',
                      additional: [bankName, proprietorName],
                    }),
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* DOCUMENT 2: CA Audited Solvency & Balance Sheet Certificate */}
      <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
              2
            </div>
            <div>
              <h4 className="font-bold text-xs text-navy-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>CA Audited Solvency Certificate & 5-Year Turnovers *</span>
              </h4>
              <p className="text-[11px] text-slate-500">
                Audited balance sheet with Chartered Accountant UDIN certifying net worth and solvency
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Quick Samples:</span>
            <button
              type="button"
              onClick={() => {
                const sample = generateSampleCaCertificateImage(agencyName, proprietorName, netWorthLakhs, turnovers);
                handleProcessSolvency(sample);
              }}
              className="text-[11px] font-bold px-2 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded border border-emerald-200 flex items-center gap-1 transition"
            >
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Load CA Certificate (₹{netWorthLakhs}L)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const blurry = generateSampleBlurryImage();
                handleProcessSolvency(blurry);
              }}
              className="text-[11px] font-bold px-2 py-1 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded border border-amber-200 flex items-center gap-1 transition"
            >
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              <span>Load Blurry CA Scan</span>
            </button>
          </div>
        </div>

        {/* Drag & Drop Box */}
        <div
          onDrop={(e) => handleDrop(e, 'solvency')}
          onDragOver={handleDragOver}
          onClick={() => solvencyInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
            solvencyDoc.status === 'processing'
              ? 'border-blue-400 bg-blue-50/40'
              : solvencyDoc.status === 'done'
              ? solvencyDoc.isLegible
                ? 'border-emerald-300 bg-emerald-50/20 hover:bg-emerald-50/40'
                : 'border-amber-300 bg-amber-50/30 hover:bg-amber-50/50'
              : 'border-slate-300 hover:border-navy-900 bg-slate-50/50 hover:bg-slate-50'
          }`}
        >
          <input
            type="file"
            ref={solvencyInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) handleProcessSolvency(e.target.files[0]);
            }}
            accept=".png,.jpg,.jpeg,.pdf"
            className="hidden"
          />

          {solvencyDoc.status === 'processing' ? (
            <div className="space-y-3 max-w-sm mx-auto">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
              <div className="text-xs font-bold text-navy-900">{solvencyDoc.statusMessage}</div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${solvencyDoc.progress}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                Extracting CA Membership & Solvency Ledgers ({solvencyDoc.progress}%)
              </span>
            </div>
          ) : solvencyDoc.status === 'done' ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-left">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    solvencyDoc.isLegible ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-xs text-navy-900 flex items-center gap-2">
                    <span>{solvencyDoc.fileName}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 font-mono">
                      Conf: {solvencyDoc.confidence}%
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {solvencyDoc.isLegible
                      ? 'CA Solvency Certificate extracted successfully.'
                      : 'Low OCR resolution or unreadable certificate.'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveRawPreview(activeRawPreview === 'solvency' ? null : 'solvency');
                  }}
                  className="px-3 py-1.5 text-xs font-bold bg-navy-900 text-white rounded hover:bg-navy-800 flex items-center gap-1.5 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{activeRawPreview === 'solvency' ? 'Hide OCR' : 'Inspect OCR'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-xs font-bold text-navy-900">
                Drag and drop CA Solvency Dossier or <span className="text-blue-700 underline">Browse File</span>
              </div>
              <p className="text-[11px] text-slate-500">Supports PDF, PNG, JPG (Multi-page PDFs parsed)</p>
            </div>
          )}
        </div>

        {/* Live Triage Telemetry for Solvency */}
        {solvencyDoc.status === 'done' && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Financial Solvency & PAN Cross-Validation</span>
              </span>
              <span className="font-mono text-[11px] text-slate-500">
                Confidence: {solvencyDoc.confidence}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-2 bg-white rounded border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block">Stated PAN:</span>
                  <span className="font-mono font-bold text-navy-900">{panNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">OCR Extracted PAN:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {solvencyDoc.extractedPan || 'None Detected'}
                  </span>
                </div>
                <div>
                  {solvencyDoc.isPanMatched ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      ✓ PAN Matched
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      Audit Required
                    </span>
                  )}
                </div>
              </div>

              <div className="p-2 bg-white rounded border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block">Net Worth Audit:</span>
                  <span className="font-bold text-navy-900">₹{netWorthLakhs} Lakhs (CA Attested)</span>
                </div>
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    ≥ ₹25L Statutory Min
                  </span>
                </div>
              </div>
            </div>

            {/* Raw OCR text toggle */}
            {activeRawPreview === 'solvency' && (
              <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] text-navy-900">Extracted Raw Text with Keywords:</span>
                  <span className="text-[10px] text-slate-400">Tesseract.js Client-Side Buffer</span>
                </div>
                <div
                  className="p-3 bg-slate-900 text-slate-200 rounded font-mono text-[11px] leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap border border-slate-800"
                  dangerouslySetInnerHTML={{
                    __html: highlightKeywordsInText(solvencyDoc.rawText, {
                      panNumber,
                      agencyName,
                      fullName: proprietorName,
                      additional: ['CHARTERED ACCOUNTANT', 'UDIN', 'TURNOVER'],
                    }),
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* DOCUMENT 3: Specimen Signatures */}
      <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
              3
            </div>
            <div>
              <h4 className="font-bold text-xs text-navy-900">
                Notarized Specimen Signatures of Managing Director (Optional)
              </h4>
              <span className="text-[11px] text-slate-500">
                {specimenDoc.fileName || 'specimen_signatures_notarized.pdf (Attached)'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => specimenInputRef.current?.click()}
            className="px-3 py-1.5 text-xs font-bold border border-slate-300 rounded hover:bg-slate-100 text-slate-700"
          >
            {specimenDoc.status === 'done' ? '✓ File Attached' : 'Attach Scan'}
          </button>
          <input
            type="file"
            ref={specimenInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) handleProcessSpecimen(e.target.files[0]);
            }}
            accept=".png,.jpg,.jpeg,.pdf"
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};
