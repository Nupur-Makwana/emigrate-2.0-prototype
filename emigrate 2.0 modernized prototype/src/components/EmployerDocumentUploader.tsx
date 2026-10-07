import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  FileCheck2,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Eye,
  RefreshCw,
  Sparkles,
  File,
  Check,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import {
  processDocumentFile,
  extractTradeLicenseNumber,
  extractDemandQuotaCount,
  highlightKeywordsInText,
} from '../services/ocrService';
import {
  generateSampleTradeLicenseImage,
  generateSampleDemandLetterImage,
  generateSampleBlurryImage,
} from '../services/sampleDocs';

export interface EmployerDocumentState {
  file: File | null;
  fileName: string;
  status: 'idle' | 'processing' | 'done' | 'error';
  progress: number;
  statusMessage: string;
  rawText: string;
  confidence: number;
  isLegible: boolean;
  extractedLicenseNo?: string;
  extractedQuota?: number;
  isLicenseMatched?: boolean;
  isQuotaMatched?: boolean;
  previewUrl?: string;
}

interface Props {
  businessName: string;
  tradeLicenseNo: string;
  sponsorId: string;
  validUntil: string;
  demandQuotaRequested: number;
  signatoryName: string;
  country: string;
  tradeLicenseDoc: EmployerDocumentState;
  setTradeLicenseDoc: React.Dispatch<React.SetStateAction<EmployerDocumentState>>;
  demandLetterDoc: EmployerDocumentState;
  setDemandLetterDoc: React.Dispatch<React.SetStateAction<EmployerDocumentState>>;
  signatoryIdDoc: { fileName: string; previewUrl?: string; status: 'idle' | 'done' };
  setSignatoryIdDoc: React.Dispatch<
    React.SetStateAction<{ fileName: string; previewUrl?: string; status: 'idle' | 'done' }>
  >;
}

export const EmployerDocumentUploader: React.FC<Props> = ({
  businessName,
  tradeLicenseNo,
  sponsorId,
  validUntil,
  demandQuotaRequested,
  signatoryName,
  country,
  tradeLicenseDoc,
  setTradeLicenseDoc,
  demandLetterDoc,
  setDemandLetterDoc,
  signatoryIdDoc,
  setSignatoryIdDoc,
}) => {
  const [activeRawPreview, setActiveRawPreview] = useState<'license' | 'demand' | null>(null);
  const licenseInputRef = useRef<HTMLInputElement>(null);
  const demandInputRef = useRef<HTMLInputElement>(null);
  const signatoryInputRef = useRef<HTMLInputElement>(null);

  // Process Trade License / CR
  const handleProcessLicense = async (file: File) => {
    setTradeLicenseDoc((prev) => ({
      ...prev,
      file,
      fileName: file.name,
      status: 'processing',
      progress: 5,
      statusMessage: 'Initializing Tesseract OCR worker for Corporate Dossier...',
    }));

    try {
      const ocr = await processDocumentFile(file, 'contract', (statusMessage, progress) => {
        setTradeLicenseDoc((prev) => ({
          ...prev,
          statusMessage,
          progress,
        }));
      });

      const extractedLicense = extractTradeLicenseNumber(ocr.rawText) || undefined;
      const isLicenseMatched = Boolean(
        extractedLicense &&
          tradeLicenseNo &&
          (extractedLicense.toUpperCase().includes(tradeLicenseNo.toUpperCase().trim()) ||
            tradeLicenseNo.toUpperCase().includes(extractedLicense.toUpperCase().trim()))
      );

      setTradeLicenseDoc({
        file,
        fileName: file.name,
        status: 'done',
        progress: 100,
        statusMessage: 'OCR Complete • Tesseract Worker Terminated',
        rawText: ocr.rawText,
        confidence: ocr.confidence,
        isLegible: ocr.isLegible,
        extractedLicenseNo: extractedLicense,
        isLicenseMatched,
        previewUrl: ocr.previewUrl,
      });
    } catch (err) {
      setTradeLicenseDoc((prev) => ({
        ...prev,
        status: 'error',
        progress: 100,
        statusMessage: 'OCR Processing error',
        rawText: 'Error processing corporate trade license scan',
        confidence: 40,
        isLegible: false,
      }));
    }
  };

  // Process Demand Letter
  const handleProcessDemandLetter = async (file: File) => {
    setDemandLetterDoc((prev) => ({
      ...prev,
      file,
      fileName: file.name,
      status: 'processing',
      progress: 5,
      statusMessage: 'Rendering specimen demand letter...',
    }));

    try {
      const ocr = await processDocumentFile(file, 'contract', (statusMessage, progress) => {
        setDemandLetterDoc((prev) => ({
          ...prev,
          statusMessage,
          progress,
        }));
      });

      const extractedQuota = extractDemandQuotaCount(ocr.rawText) || undefined;
      const isQuotaMatched = Boolean(
        extractedQuota && demandQuotaRequested && extractedQuota === demandQuotaRequested
      );

      setDemandLetterDoc({
        file,
        fileName: file.name,
        status: 'done',
        progress: 100,
        statusMessage: 'OCR Complete • Tesseract Worker Terminated',
        rawText: ocr.rawText,
        confidence: ocr.confidence,
        isLegible: ocr.isLegible,
        extractedQuota,
        isQuotaMatched,
        previewUrl: ocr.previewUrl,
      });
    } catch (err) {
      setDemandLetterDoc((prev) => ({
        ...prev,
        status: 'error',
        progress: 100,
        statusMessage: 'OCR Processing error',
        rawText: 'Error processing demand letter scan',
        confidence: 40,
        isLegible: false,
      }));
    }
  };

  // Process Signatory ID
  const handleProcessSignatoryId = (file: File) => {
    const url = URL.createObjectURL(file);
    setSignatoryIdDoc({
      fileName: file.name,
      previewUrl: url,
      status: 'done',
    });
  };

  // Drag and drop handlers
  const handleDrop = (e: React.DragEvent, type: 'license' | 'demand' | 'signatory') => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (type === 'license') handleProcessLicense(file);
      else if (type === 'demand') handleProcessDemandLetter(file);
      else if (type === 'signatory') handleProcessSignatoryId(file);
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
            4. Live Client-Side OCR Attestation Documents
          </h3>
          <p className="text-xs text-slate-500">
            Upload commercial trade licenses and manpower demand letters (.pdf, .png, .jpg). Real client-side Tesseract.js optical character extraction is performed in your browser.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-900 px-2.5 py-1 rounded font-semibold border border-blue-200 self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Client-Side Tesseract OCR Engine Active</span>
        </div>
      </div>

      {/* DOCUMENT 1: Trade License / Commercial Registration */}
      <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-navy-900 text-white flex items-center justify-center font-bold text-xs">
              1
            </div>
            <div>
              <h4 className="font-bold text-xs text-navy-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-navy-900" />
                <span>Trade License / Commercial Registration (CR) Certificate *</span>
              </h4>
              <p className="text-[11px] text-slate-500">
                Official registration issued by host country Chamber of Commerce or Dept of Economic Development
              </p>
            </div>
          </div>

          {/* Quick sample doc test buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Quick Samples:</span>
            <button
              type="button"
              onClick={() => {
                const sample = generateSampleTradeLicenseImage(tradeLicenseNo, businessName, validUntil, sponsorId);
                handleProcessLicense(sample);
              }}
              className="text-[11px] font-bold px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded border border-blue-200 flex items-center gap-1 transition"
            >
              <Sparkles className="w-3 h-3 text-blue-600" />
              <span>Load Valid Trade License</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const blurry = generateSampleBlurryImage();
                handleProcessLicense(blurry);
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
          onDrop={(e) => handleDrop(e, 'license')}
          onDragOver={handleDragOver}
          onClick={() => licenseInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
            tradeLicenseDoc.status === 'processing'
              ? 'border-blue-400 bg-blue-50/40'
              : tradeLicenseDoc.status === 'done'
              ? tradeLicenseDoc.isLegible
                ? 'border-emerald-300 bg-emerald-50/20 hover:bg-emerald-50/40'
                : 'border-amber-300 bg-amber-50/30 hover:bg-amber-50/50'
              : 'border-slate-300 hover:border-navy-900 bg-slate-50/50 hover:bg-slate-50'
          }`}
        >
          <input
            type="file"
            ref={licenseInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) handleProcessLicense(e.target.files[0]);
            }}
            accept=".png,.jpg,.jpeg,.pdf"
            className="hidden"
          />

          {tradeLicenseDoc.status === 'processing' ? (
            <div className="space-y-3 max-w-sm mx-auto">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
              <div className="text-xs font-bold text-navy-900">{tradeLicenseDoc.statusMessage}</div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${tradeLicenseDoc.progress}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                Running in-browser Optical Character Recognition ({tradeLicenseDoc.progress}%)
              </span>
            </div>
          ) : tradeLicenseDoc.status === 'done' ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-left">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    tradeLicenseDoc.isLegible ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-xs text-navy-900 flex items-center gap-2">
                    <span>{tradeLicenseDoc.fileName}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 font-mono">
                      Conf: {tradeLicenseDoc.confidence}%
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {tradeLicenseDoc.isLegible
                      ? 'Text extracted successfully. Click to replace or examine OCR below.'
                      : 'Low OCR resolution/blurry document detected. Manual consular audit will be required.'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveRawPreview(activeRawPreview === 'license' ? null : 'license');
                  }}
                  className="px-3 py-1.5 text-xs font-bold bg-navy-900 text-white rounded hover:bg-navy-800 flex items-center gap-1.5 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{activeRawPreview === 'license' ? 'Hide OCR' : 'Inspect OCR'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-xs font-bold text-navy-900">
                Drag and drop Commercial License or <span className="text-blue-700 underline">Browse File</span>
              </div>
              <p className="text-[11px] text-slate-500">Supports PDF, PNG, JPG (Multi-page PDFs parsed)</p>
            </div>
          )}
        </div>

        {/* Live Triage Telemetry for Trade License */}
        {tradeLicenseDoc.status === 'done' && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Trade License AI Triage Telemetry</span>
              </span>
              <span className="font-mono text-[11px] text-slate-500">
                Confidence: {tradeLicenseDoc.confidence}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-2 bg-white rounded border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block">Stated Form License:</span>
                  <span className="font-mono font-bold text-navy-900">{tradeLicenseNo}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">OCR Extracted:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {tradeLicenseDoc.extractedLicenseNo || 'None Detected'}
                  </span>
                </div>
                <div>
                  {tradeLicenseDoc.isLicenseMatched ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      ✓ 100% Match
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      Review Needed
                    </span>
                  )}
                </div>
              </div>

              <div className="p-2 bg-white rounded border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block">Legibility Status:</span>
                  <span className="font-bold text-navy-900">
                    {tradeLicenseDoc.isLegible ? 'Crisp & Legible' : 'Low Confidence (<60%)'}
                  </span>
                </div>
                <div>
                  {tradeLicenseDoc.isLegible ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Chamber Attested
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                      Flagged for Audit
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Raw OCR text toggle */}
            {activeRawPreview === 'license' && (
              <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] text-navy-900">Extracted Raw Text with Keywords:</span>
                  <span className="text-[10px] text-slate-400">Tesseract.js Client-Side Buffer</span>
                </div>
                <div
                  className="p-3 bg-slate-900 text-slate-200 rounded font-mono text-[11px] leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap border border-slate-800"
                  dangerouslySetInnerHTML={{
                    __html: highlightKeywordsInText(tradeLicenseDoc.rawText, {
                      tradeLicenseNo,
                      fullName: signatoryName,
                      additional: [businessName, sponsorId],
                    }),
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* DOCUMENT 2: Demand Specimen Letter */}
      <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-navy-900 text-white flex items-center justify-center font-bold text-xs">
              2
            </div>
            <div>
              <h4 className="font-bold text-xs text-navy-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-navy-900" />
                <span>Chamber Attested Manpower Demand Specimen Letter *</span>
              </h4>
              <p className="text-[11px] text-slate-500">
                Formal manpower requisition specifying required quota, trades, wages, and consular obligations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Quick Samples:</span>
            <button
              type="button"
              onClick={() => {
                const sample = generateSampleDemandLetterImage(
                  businessName,
                  demandQuotaRequested,
                  signatoryName,
                  country
                );
                handleProcessDemandLetter(sample);
              }}
              className="text-[11px] font-bold px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded border border-blue-200 flex items-center gap-1 transition"
            >
              <Sparkles className="w-3 h-3 text-blue-600" />
              <span>Load Demand ({demandQuotaRequested} Quota)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const blurry = generateSampleBlurryImage();
                handleProcessDemandLetter(blurry);
              }}
              className="text-[11px] font-bold px-2 py-1 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded border border-amber-200 flex items-center gap-1 transition"
            >
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              <span>Load Blurry Letter</span>
            </button>
          </div>
        </div>

        {/* Drag & Drop Box */}
        <div
          onDrop={(e) => handleDrop(e, 'demand')}
          onDragOver={handleDragOver}
          onClick={() => demandInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
            demandLetterDoc.status === 'processing'
              ? 'border-blue-400 bg-blue-50/40'
              : demandLetterDoc.status === 'done'
              ? demandLetterDoc.isLegible
                ? 'border-emerald-300 bg-emerald-50/20 hover:bg-emerald-50/40'
                : 'border-amber-300 bg-amber-50/30 hover:bg-amber-50/50'
              : 'border-slate-300 hover:border-navy-900 bg-slate-50/50 hover:bg-slate-50'
          }`}
        >
          <input
            type="file"
            ref={demandInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) handleProcessDemandLetter(e.target.files[0]);
            }}
            accept=".png,.jpg,.jpeg,.pdf"
            className="hidden"
          />

          {demandLetterDoc.status === 'processing' ? (
            <div className="space-y-3 max-w-sm mx-auto">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
              <div className="text-xs font-bold text-navy-900">{demandLetterDoc.statusMessage}</div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${demandLetterDoc.progress}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                Extracting Quota & Tradesmen Allocations ({demandLetterDoc.progress}%)
              </span>
            </div>
          ) : demandLetterDoc.status === 'done' ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-left">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    demandLetterDoc.isLegible ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-xs text-navy-900 flex items-center gap-2">
                    <span>{demandLetterDoc.fileName}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 font-mono">
                      Conf: {demandLetterDoc.confidence}%
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {demandLetterDoc.isLegible
                      ? 'Specimen Demand Letter analyzed. Quota extracted.'
                      : 'Document text could not be verified automatically.'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveRawPreview(activeRawPreview === 'demand' ? null : 'demand');
                  }}
                  className="px-3 py-1.5 text-xs font-bold bg-navy-900 text-white rounded hover:bg-navy-800 flex items-center gap-1.5 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{activeRawPreview === 'demand' ? 'Hide OCR' : 'Inspect OCR'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-xs font-bold text-navy-900">
                Drag and drop Specimen Demand Letter or <span className="text-blue-700 underline">Browse File</span>
              </div>
              <p className="text-[11px] text-slate-500">Supports PDF, PNG, JPG (Multi-page PDFs supported)</p>
            </div>
          )}
        </div>

        {/* Live Triage Telemetry for Demand Letter */}
        {demandLetterDoc.status === 'done' && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Demand Quota Cross-Validation</span>
              </span>
              <span className="font-mono text-[11px] text-slate-500">
                Confidence: {demandLetterDoc.confidence}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-2 bg-white rounded border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block">Requested Form Quota:</span>
                  <span className="font-mono font-bold text-navy-900">{demandQuotaRequested} Workers</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">OCR Extracted Quota:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {demandLetterDoc.extractedQuota ? `${demandLetterDoc.extractedQuota} Workers` : 'Not Extracted'}
                  </span>
                </div>
                <div>
                  {demandLetterDoc.isQuotaMatched ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      ✓ Quota Aligned
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
                  <span className="text-[10px] text-slate-500 block">Accommodation Cross-Ref:</span>
                  <span className="font-bold text-emerald-700">180 Net Beds Available</span>
                </div>
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Sufficient Capacity
                  </span>
                </div>
              </div>
            </div>

            {/* Raw OCR text toggle */}
            {activeRawPreview === 'demand' && (
              <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] text-navy-900">Extracted Raw Text with Keywords:</span>
                  <span className="text-[10px] text-slate-400">Tesseract.js Client-Side Buffer</span>
                </div>
                <div
                  className="p-3 bg-slate-900 text-slate-200 rounded font-mono text-[11px] leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap border border-slate-800"
                  dangerouslySetInnerHTML={{
                    __html: highlightKeywordsInText(demandLetterDoc.rawText, {
                      demandQuota: demandQuotaRequested,
                      fullName: signatoryName,
                      additional: [businessName, country],
                    }),
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* DOCUMENT 3: Authorized Signatory National ID / Passport */}
      <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-navy-900 text-white flex items-center justify-center font-bold text-xs">
              3
            </div>
            <div>
              <h4 className="font-bold text-xs text-navy-900">
                Signatory Passport or Host National Identity Card (Optional)
              </h4>
              <span className="text-[11px] text-slate-500">
                {signatoryIdDoc.fileName || 'signatory_national_id.pdf (Attested copy)'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => signatoryInputRef.current?.click()}
            className="px-3 py-1.5 text-xs font-bold border border-slate-300 rounded hover:bg-slate-100 text-slate-700"
          >
            {signatoryIdDoc.status === 'done' ? '✓ File Attached' : 'Attach Scan'}
          </button>
          <input
            type="file"
            ref={signatoryInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) handleProcessSignatoryId(e.target.files[0]);
            }}
            accept=".png,.jpg,.jpeg,.pdf"
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};
