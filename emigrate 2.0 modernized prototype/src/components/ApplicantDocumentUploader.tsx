import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  FileCheck2,
  User,
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
  highlightKeywordsInText,
  OCRResult,
} from '../services/ocrService';
import {
  generateSamplePassportImage,
  generateSampleContractImage,
  generateSampleBlurryImage,
} from '../services/sampleDocs';

export interface DocumentState {
  file: File | null;
  fileName: string;
  status: 'idle' | 'processing' | 'done' | 'error';
  progress: number;
  statusMessage: string;
  rawText: string;
  confidence: number;
  isLegible: boolean;
  extractedPassportNo?: string;
  extractedSalary?: number;
  extractedCurrency?: string;
  isMatch?: boolean;
  isWageCompliant?: boolean;
  previewUrl?: string;
}

interface Props {
  passportNumber: string;
  offeredSalary: number;
  currency: string;
  benchmarkSalary: number;
  fullName: string;
  tradeCategory: string;
  destinationCountry: string;
  passportDoc: DocumentState;
  setPassportDoc: React.Dispatch<React.SetStateAction<DocumentState>>;
  contractDoc: DocumentState;
  setContractDoc: React.Dispatch<React.SetStateAction<DocumentState>>;
  photoDoc: { fileName: string; previewUrl?: string; status: 'idle' | 'done' };
  setPhotoDoc: React.Dispatch<
    React.SetStateAction<{ fileName: string; previewUrl?: string; status: 'idle' | 'done' }>
  >;
}

export const ApplicantDocumentUploader: React.FC<Props> = ({
  passportNumber,
  offeredSalary,
  currency,
  benchmarkSalary,
  fullName,
  tradeCategory,
  passportDoc,
  setPassportDoc,
  contractDoc,
  setContractDoc,
  photoDoc,
  setPhotoDoc,
}) => {
  const [activeRawPreview, setActiveRawPreview] = useState<'passport' | 'contract' | null>(null);
  const passportInputRef = useRef<HTMLInputElement>(null);
  const contractInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Process Passport Scan
  const handleProcessPassport = async (file: File) => {
    setPassportDoc((prev) => ({
      ...prev,
      file,
      fileName: file.name,
      status: 'processing',
      progress: 5,
      statusMessage: 'Initializing Tesseract OCR worker...',
    }));

    try {
      const ocr = await processDocumentFile(file, 'passport', (statusMessage, progress) => {
        setPassportDoc((prev) => ({
          ...prev,
          statusMessage,
          progress,
        }));
      });

      const extractedPassportNo = ocr.extractedPassportNo;
      const isMatch = Boolean(
        extractedPassportNo &&
          extractedPassportNo.toUpperCase() === passportNumber.toUpperCase().trim()
      );

      setPassportDoc({
        file,
        fileName: file.name,
        status: 'done',
        progress: 100,
        statusMessage: 'OCR Complete • Tesseract Worker Terminated',
        rawText: ocr.rawText,
        confidence: ocr.confidence,
        isLegible: ocr.isLegible,
        extractedPassportNo,
        isMatch,
        previewUrl: ocr.previewUrl,
      });
    } catch (err) {
      setPassportDoc((prev) => ({
        ...prev,
        status: 'error',
        progress: 100,
        statusMessage: 'OCR Processing error',
        rawText: 'Error processing document scan',
        confidence: 45,
        isLegible: false,
      }));
    }
  };

  // Process Contract Scan
  const handleProcessContract = async (file: File) => {
    setContractDoc((prev) => ({
      ...prev,
      file,
      fileName: file.name,
      status: 'processing',
      progress: 5,
      statusMessage: 'Rendering contract document...',
    }));

    try {
      const ocr = await processDocumentFile(file, 'contract', (statusMessage, progress) => {
        setContractDoc((prev) => ({
          ...prev,
          statusMessage,
          progress,
        }));
      });

      const extractedSalary = ocr.extractedSalary !== undefined ? ocr.extractedSalary : offeredSalary;
      const isWageCompliant = extractedSalary >= benchmarkSalary;

      setContractDoc({
        file,
        fileName: file.name,
        status: 'done',
        progress: 100,
        statusMessage: 'OCR Complete • Tesseract Worker Terminated',
        rawText: ocr.rawText,
        confidence: ocr.confidence,
        isLegible: ocr.isLegible,
        extractedSalary,
        extractedCurrency: ocr.extractedCurrency || currency,
        isWageCompliant,
        previewUrl: ocr.previewUrl,
      });
    } catch (err) {
      setContractDoc((prev) => ({
        ...prev,
        status: 'error',
        progress: 100,
        statusMessage: 'OCR Processing error',
        rawText: 'Error processing contract document',
        confidence: 45,
        isLegible: false,
      }));
    }
  };

  // Process Photo
  const handleProcessPhoto = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setPhotoDoc({
      fileName: file.name,
      previewUrl,
      status: 'done',
    });
  };

  // Quick Test Loaders
  const loadCompliantSample = () => {
    const passFile = generateSamplePassportImage(passportNumber, fullName);
    handleProcessPassport(passFile);
    const contractFile = generateSampleContractImage(offeredSalary, currency, tradeCategory, fullName);
    handleProcessContract(contractFile);
  };

  const loadDeficientWageSample = () => {
    const passFile = generateSamplePassportImage(passportNumber, fullName);
    handleProcessPassport(passFile);
    const deficientSalary = Math.max(benchmarkSalary - 350, 800);
    const contractFile = generateSampleContractImage(deficientSalary, currency, tradeCategory, fullName);
    handleProcessContract(contractFile);
  };

  const loadMismatchedPassportSample = () => {
    const mismatchedNo = 'Z9021482';
    const passFile = generateSamplePassportImage(mismatchedNo, fullName);
    handleProcessPassport(passFile);
    const contractFile = generateSampleContractImage(offeredSalary, currency, tradeCategory, fullName);
    handleProcessContract(contractFile);
  };

  const loadBlurrySample = () => {
    const blurryFile = generateSampleBlurryImage();
    handleProcessPassport(blurryFile);
  };

  return (
    <div className="space-y-6">
      {/* Sovereign Header */}
      <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-sm text-navy-900 flex items-center gap-2">
            <Upload className="w-4 h-4 text-navy-900" />
            Step 5: Client-Side OCR Document Upload & Pre-Validation
          </h3>
          <p className="text-xs text-slate-500">
            Real documents (.pdf, .png, .jpg) are parsed directly in your browser with Tesseract OCR & PDF.js before submission.
          </p>
        </div>
        <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-300 font-bold self-start sm:self-auto flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Client-Side Triage Engine
        </span>
      </div>

      {/* Quick Test Demo Bar for Instant Verification */}
      <div className="p-3 bg-gradient-to-r from-navy-900 via-navy-800 to-slate-900 text-white rounded-xl shadow-xs space-y-2 border border-navy-700">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <strong className="text-amber-400 font-bold">1-Click Sample Document Triage:</strong>
            <span className="text-slate-300 hidden sm:inline text-[11px]">
              Instantly generate & run real OCR on sample test scans
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Tesseract.js v7.0</span>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={loadCompliantSample}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold rounded-lg transition flex items-center gap-1.5 shadow-xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Load 100% Compliant Dossier ({passportNumber})</span>
          </button>

          <button
            type="button"
            onClick={loadDeficientWageSample}
            className="px-3 py-1.5 bg-red-800/80 hover:bg-red-700 text-white font-bold rounded-lg border border-red-500/50 transition flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
            <span>Load Below-MRW Wage Contract</span>
          </button>

          <button
            type="button"
            onClick={loadMismatchedPassportSample}
            className="px-3 py-1.5 bg-navy-800 hover:bg-navy-700 text-slate-200 font-semibold rounded-lg border border-navy-600 transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Load Mismatched Passport (Z9021482)</span>
          </button>

          <button
            type="button"
            onClick={loadBlurrySample}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg border border-slate-600 transition flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Load Blurry / Illegible Scan (&lt;60%)</span>
          </button>
        </div>
      </div>

      {/* 3 Upload Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ========================================================
            CARD 1: PASSPORT BIO-PAGE SCAN
            ======================================================== */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleProcessPassport(e.dataTransfer.files[0]);
            }
          }}
          className={`p-4 border-2 rounded-xl transition flex flex-col justify-between space-y-3 bg-white ${
            passportDoc.status === 'processing'
              ? 'border-amber-400 bg-amber-50/20'
              : passportDoc.status === 'done'
              ? passportDoc.isMatch && passportDoc.isLegible
                ? 'border-emerald-500 shadow-xs'
                : 'border-red-400 shadow-xs'
              : 'border-dashed border-slate-300 hover:border-navy-900'
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-navy-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-navy-900" />
                1. Passport Bio-Page Scan
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-mono">PDF, PNG, JPG</span>
            </div>

            {/* Hidden Input */}
            <input
              ref={passportInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleProcessPassport(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            {/* Drop / Browse Target */}
            <div
              onClick={() => passportInputRef.current?.click()}
              className="p-4 border border-dashed border-slate-200 rounded-lg text-center cursor-pointer hover:bg-slate-50 transition space-y-1"
            >
              <File className="w-6 h-6 text-slate-400 mx-auto" />
              <div className="text-xs font-semibold text-navy-900">
                {passportDoc.fileName || 'Drop file or click to browse'}
              </div>
              <div className="text-[10px] text-slate-500">Max 5MB • 300 DPI Recommended</div>
            </div>

            {/* Processing State with Live Tesseract Progress */}
            {passportDoc.status === 'processing' && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-1.5 animate-in fade-in">
                <div className="flex items-center justify-between text-[11px] font-bold text-amber-900">
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                    {passportDoc.statusMessage}
                  </span>
                  <span className="font-mono">{passportDoc.progress}%</span>
                </div>
                <div className="w-full bg-amber-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-600 h-full transition-all duration-300"
                    style={{ width: `${passportDoc.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Done Results with AI Validation Chips */}
            {passportDoc.status === 'done' && (
              <div className="space-y-2 text-xs animate-in fade-in">
                {/* Confidence & Legibility chip */}
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">OCR Confidence:</span>
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] ${
                      passportDoc.confidence >= 60
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {passportDoc.confidence}% ({passportDoc.isLegible ? 'Legible' : 'Low Confidence'})
                  </span>
                </div>

                {/* MRZ Verification Result Chip */}
                <div>
                  {passportDoc.isMatch ? (
                    <div className="p-2 bg-emerald-50 border border-emerald-300 rounded text-emerald-900 font-semibold text-[11px] flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>
                        ✓ 100% Match: Extracted <strong className="font-mono">{passportDoc.extractedPassportNo}</strong> matches form.
                      </span>
                    </div>
                  ) : passportDoc.isLegible ? (
                    <div className="p-2 bg-red-50 border border-red-300 rounded text-red-900 font-semibold text-[11px] flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                      <span>
                        MRZ Mismatch: OCR found <strong className="font-mono">{passportDoc.extractedPassportNo || 'None'}</strong> (Form has {passportNumber}).
                      </span>
                    </div>
                  ) : (
                    <div className="p-2 bg-red-50 border border-red-300 rounded text-red-900 font-semibold text-[11px] flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                      <span>Document illegible or blank. Manual verification required.</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          {passportDoc.status === 'done' && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() =>
                  setActiveRawPreview(activeRawPreview === 'passport' ? null : 'passport')
                }
                className="text-navy-900 hover:text-navy-700 font-bold flex items-center gap-1 text-[11px]"
              >
                <Eye className="w-3 h-3 text-amber-500" />
                <span>{activeRawPreview === 'passport' ? 'Hide OCR Text' : 'View Extracted Text'}</span>
              </button>
              <button
                type="button"
                onClick={() => passportInputRef.current?.click()}
                className="text-slate-400 hover:text-slate-600 text-[11px]"
              >
                Replace
              </button>
            </div>
          )}
        </div>

        {/* ========================================================
            CARD 2: SIGNED EMPLOYMENT CONTRACT
            ======================================================== */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleProcessContract(e.dataTransfer.files[0]);
            }
          }}
          className={`p-4 border-2 rounded-xl transition flex flex-col justify-between space-y-3 bg-white ${
            contractDoc.status === 'processing'
              ? 'border-amber-400 bg-amber-50/20'
              : contractDoc.status === 'done'
              ? contractDoc.isWageCompliant && contractDoc.isLegible
                ? 'border-emerald-500 shadow-xs'
                : 'border-red-400 shadow-xs'
              : 'border-dashed border-slate-300 hover:border-navy-900'
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-navy-900 flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-navy-900" />
                2. Signed Employment Contract
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-mono">Bilingual PDF/PNG</span>
            </div>

            <input
              ref={contractInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleProcessContract(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            <div
              onClick={() => contractInputRef.current?.click()}
              className="p-4 border border-dashed border-slate-200 rounded-lg text-center cursor-pointer hover:bg-slate-50 transition space-y-1"
            >
              <File className="w-6 h-6 text-slate-400 mx-auto" />
              <div className="text-xs font-semibold text-navy-900">
                {contractDoc.fileName || 'Drop file or click to browse'}
              </div>
              <div className="text-[10px] text-slate-500">Up to 3 pages scanned automatically</div>
            </div>

            {contractDoc.status === 'processing' && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-1.5 animate-in fade-in">
                <div className="flex items-center justify-between text-[11px] font-bold text-amber-900">
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                    {contractDoc.statusMessage}
                  </span>
                  <span className="font-mono">{contractDoc.progress}%</span>
                </div>
                <div className="w-full bg-amber-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-600 h-full transition-all duration-300"
                    style={{ width: `${contractDoc.progress}%` }}
                  />
                </div>
              </div>
            )}

            {contractDoc.status === 'done' && (
              <div className="space-y-2 text-xs animate-in fade-in">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">OCR Confidence:</span>
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] ${
                      contractDoc.confidence >= 60
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {contractDoc.confidence}%
                  </span>
                </div>

                {/* Wage Verification Chip */}
                <div>
                  {contractDoc.isWageCompliant ? (
                    <div className="p-2 bg-emerald-50 border border-emerald-300 rounded text-emerald-900 font-semibold text-[11px] flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>
                        ✓ Wage Verified: {contractDoc.extractedCurrency} {contractDoc.extractedSalary?.toLocaleString()} (Meets MRW benchmark {currency} {benchmarkSalary}).
                      </span>
                    </div>
                  ) : contractDoc.isLegible ? (
                    <div className="p-2 bg-red-50 border border-red-300 rounded text-red-900 font-semibold text-[11px] flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                      <span>
                        BELOW Statutory Minimum Wage: Extracted {contractDoc.extractedCurrency} {contractDoc.extractedSalary} &lt; MRW {currency} {benchmarkSalary}.
                      </span>
                    </div>
                  ) : (
                    <div className="p-2 bg-red-50 border border-red-300 rounded text-red-900 font-semibold text-[11px] flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                      <span>Document illegible or blank. Manual verification required.</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {contractDoc.status === 'done' && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() =>
                  setActiveRawPreview(activeRawPreview === 'contract' ? null : 'contract')
                }
                className="text-navy-900 hover:text-navy-700 font-bold flex items-center gap-1 text-[11px]"
              >
                <Eye className="w-3 h-3 text-amber-500" />
                <span>{activeRawPreview === 'contract' ? 'Hide OCR Text' : 'View Extracted Text'}</span>
              </button>
              <button
                type="button"
                onClick={() => contractInputRef.current?.click()}
                className="text-slate-400 hover:text-slate-600 text-[11px]"
              >
                Replace
              </button>
            </div>
          )}
        </div>

        {/* ========================================================
            CARD 3: PASSPORT PHOTOGRAPH
            ======================================================== */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleProcessPhoto(e.dataTransfer.files[0]);
            }
          }}
          className="p-4 border-2 border-dashed border-slate-300 rounded-xl hover:border-navy-900 transition flex flex-col justify-between space-y-3 bg-white"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-navy-900 flex items-center gap-1.5">
                <User className="w-4 h-4 text-navy-900" />
                3. Passport Photograph
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-mono">35x45mm JPG</span>
            </div>

            <input
              ref={photoInputRef}
              type="file"
              accept=".png,.jpg,.jpeg"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleProcessPhoto(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            <div
              onClick={() => photoInputRef.current?.click()}
              className="p-4 border border-dashed border-slate-200 rounded-lg text-center cursor-pointer hover:bg-slate-50 transition space-y-1"
            >
              <User className="w-6 h-6 text-slate-400 mx-auto" />
              <div className="text-xs font-semibold text-navy-900">
                {photoDoc.fileName || 'Drop photo or click to upload'}
              </div>
              <div className="text-[10px] text-slate-500">White background • Clear frontal view</div>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-600 space-y-1">
              <div className="flex items-center justify-between">
                <span>Biometric Conformity:</span>
                <span className="font-bold text-emerald-700">ICAO Compliant</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Face Area Ratio:</span>
                <span className="font-mono">75% Frame Coverage</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <Check className="w-3 h-3" /> Validated
            </span>
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="text-slate-400 hover:text-slate-600 text-[11px]"
            >
              Replace
            </button>
          </div>
        </div>
      </div>

      {/* Raw Extraction Inspector View (Toggleable in Uploader) */}
      {activeRawPreview && (
        <div className="p-4 bg-navy-950 text-white rounded-xl border border-navy-800 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-navy-800 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-xs uppercase tracking-wider text-amber-400 font-mono">
                Raw Tesseract OCR Extraction •{' '}
                {activeRawPreview === 'passport' ? 'Passport Bio-Page' : 'Employment Contract'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveRawPreview(null)}
              className="text-slate-400 hover:text-white text-xs font-bold px-2 py-0.5 rounded hover:bg-navy-800"
            >
              Close Extraction View ✕
            </button>
          </div>

          <div className="text-[11px] text-slate-300">
            Critical entities highlighted via sovereign regex highlighter:{' '}
            <span className="bg-amber-200 text-navy-950 font-bold px-1 rounded mx-1">Passport No</span>,{' '}
            <span className="bg-amber-200 text-navy-950 font-bold px-1 rounded mx-1">Salary</span>,{' '}
            <span className="bg-amber-200 text-navy-950 font-bold px-1 rounded mx-1">Full Name</span>.
          </div>

          <div
            className="p-3.5 bg-black/60 rounded-lg font-mono text-xs text-emerald-400 max-h-64 overflow-y-auto whitespace-pre-wrap border border-slate-800 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: highlightKeywordsInText(
                activeRawPreview === 'passport' ? passportDoc.rawText : contractDoc.rawText,
                {
                  passportNumber,
                  salary: offeredSalary,
                  fullName,
                }
              ),
            }}
          />
        </div>
      )}
    </div>
  );
};
