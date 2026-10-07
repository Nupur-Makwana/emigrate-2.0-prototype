import { createWorker } from 'tesseract.js';
import { pdfjsLib } from './pdfWorker';

export interface OcrResult {
  rawText: string;
  confidence: number;
  extractedPassportNo?: string;
  extractedSalary?: number;
  extractedCurrency?: string;
  isPassportMatched?: boolean;
  isWageCompliant?: boolean;
  pagesProcessed: number;
  previewUrl?: string;
  warnings: string[];
}

export type OcrProgressCallback = (status: string, progress: number) => void;

/**
 * Render PDF pages to HTML5 Canvas and convert to base64 images
 * Processes at most 3 pages to prevent browser memory exhaustion.
 */
export async function convertPdfToImages(
  file: File | Blob,
  maxPages: number = 3,
  onProgress?: OcrProgressCallback
): Promise<string[]> {
  const arrayBuffer = await file.arrayBuffer();
  onProgress?.('Loading PDF document...', 10);

  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  const numPages = Math.min(pdfDoc.numPages, maxPages);
  const images: string[] = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    onProgress?.(`Rendering PDF Page ${pageNum} of ${numPages}...`, Math.round(10 + (pageNum / numPages) * 20));
    const page = await pdfDoc.getPage(pageNum);
    
    // Render at 1.5 scale for optimal OCR accuracy without overwhelming memory
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) continue;

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({
      canvasContext: context,
      viewport: viewport,
      canvas: canvas,
    }).promise;

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    images.push(dataUrl);

    // Clean up canvas
    canvas.width = 0;
    canvas.height = 0;
  }

  return images;
}

/**
 * Perform client-side OCR on an image (base64, Blob, or File)
 * Automatically cleans up the Tesseract worker after completion to prevent memory leaks.
 */
export async function runOcrOnImage(
  imageSource: string | File | Blob,
  onProgress?: (progressPercent: number) => void
): Promise<{ text: string; confidence: number }> {
  // Initialize worker for English
  const worker = await createWorker('eng', 1, {
    logger: (m) => {
      if (m.status === 'recognizing text') {
        const p = Math.min(99, Math.round((m.progress || 0) * 100));
        onProgress?.(p);
      }
    },
  });

  try {
    const result = await worker.recognize(imageSource);
    const text = result.data.text || '';
    const confidence = Math.round(result.data.confidence || 0);
    return { text, confidence };
  } finally {
    // Terminate worker to free WebAssembly and canvas memory
    try {
      await worker.terminate();
    } catch (e) {
      console.warn('Worker termination cleanup:', e);
    }
  }
}

/**
 * Main OCR pipeline processing uploaded File (Image or PDF)
 */
export async function processDocumentWithOcr(
  file: File,
  docType: 'passport' | 'contract' | 'general',
  expectedPassport?: string,
  offeredSalary?: number,
  currency?: string,
  onProgress?: OcrProgressCallback
): Promise<OcrResult> {
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  let combinedText = '';
  let totalConfidence = 0;
  let pagesCount = 0;
  let firstPreviewUrl: string | undefined;

  try {
    if (isPdf) {
      onProgress?.('Extracting pages from PDF...', 5);
      const pageImages = await convertPdfToImages(file, 3, onProgress);
      pagesCount = pageImages.length;

      if (pageImages.length > 0) {
        firstPreviewUrl = pageImages[0];
      }

      for (let i = 0; i < pageImages.length; i++) {
        const pageNum = i + 1;
        onProgress?.(`OCR Scanning Page ${pageNum} of ${pageImages.length}...`, Math.round(30 + (i / pageImages.length) * 60));
        
        const { text, confidence } = await runOcrOnImage(pageImages[i], (p) => {
          const overall = Math.round(30 + ((i + p / 100) / pageImages.length) * 60);
          onProgress?.(`Extracting Text (Page ${pageNum}: ${p}%)...`, overall);
        });

        combinedText += `\n--- PAGE ${pageNum} ---\n` + text;
        totalConfidence += confidence;
      }
      totalConfidence = pagesCount > 0 ? Math.round(totalConfidence / pagesCount) : 0;
    } else {
      // Direct image file
      onProgress?.('Preparing image for OCR...', 15);
      pagesCount = 1;

      // Create preview URL
      firstPreviewUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });

      onProgress?.('Extracting text with Tesseract Engine...', 25);
      const { text, confidence } = await runOcrOnImage(file, (p) => {
        onProgress?.(`Extracting Text (${p}%)...`, Math.round(25 + p * 0.7));
      });

      combinedText = text;
      totalConfidence = confidence;
    }

    onProgress?.('Analyzing extracted text...', 98);

    // Extraction & Validation Logic
    const warnings: string[] = [];

    // 1. Low confidence / blurriness check
    if (totalConfidence < 60 || combinedText.trim().length < 15) {
      warnings.push('Document illegible, blurry, or low-resolution. Manual verification required.');
    }

    // 2. Indian Passport Regex: 1 uppercase letter followed by 7 digits, e.g. K7819234, M8921004
    let detectedPassport: string | undefined;
    const passportRegex = /\b([A-Z][0-9]{7})\b/g;
    const matches = combinedText.match(passportRegex);
    if (matches && matches.length > 0) {
      detectedPassport = matches[0];
    } else {
      // Try searching inside MRZ lines
      const mrzMatch = combinedText.match(/([A-Z]{1}[0-9]{7})[<0-9]/);
      if (mrzMatch) {
        detectedPassport = mrzMatch[1];
      }
    }

    let isPassportMatched = false;
    if (expectedPassport && detectedPassport) {
      isPassportMatched = detectedPassport.toUpperCase() === expectedPassport.toUpperCase();
      if (!isPassportMatched) {
        warnings.push(`Passport number mismatch: Form has '${expectedPassport}', but OCR extracted '${detectedPassport}'.`);
      }
    }

    // 3. Contract Wage Extraction Logic
    let detectedSalary: number | undefined;
    let detectedCurrency: string | undefined;

    const salaryPatterns = [
      /(?:AED|SAR|QAR|KWD|OMR|BHD|INR|Rs\.?|USD|\$)\s*[:=]?\s*([0-9]{1,3}(?:,[0-9]{3})*|[0-9]{3,6})/i,
      /(?:Salary|Wage|Basic|Monthly Pay|Remuneration)\s*[:=-]?\s*(?:AED|SAR|QAR|KWD|OMR|BHD|INR|Rs\.?)?\s*([0-9]{1,3}(?:,[0-9]{3})*|[0-9]{3,6})/i,
      /([0-9]{1,3}(?:,[0-9]{3})*|[0-9]{3,6})\s*(?:AED|SAR|QAR|KWD|OMR|BHD)\b/i,
    ];

    for (const pattern of salaryPatterns) {
      const salMatch = combinedText.match(pattern);
      if (salMatch) {
        const rawNum = salMatch[1] ? salMatch[1].replace(/,/g, '') : salMatch[0].replace(/[^0-9]/g, '');
        const parsed = parseInt(rawNum, 10);
        if (!isNaN(parsed) && parsed >= 100 && parsed <= 50000) {
          detectedSalary = parsed;
          break;
        }
      }
    }

    // Currency extraction
    const currMatch = combinedText.match(/\b(AED|SAR|QAR|KWD|OMR|BHD|INR)\b/i);
    if (currMatch) {
      detectedCurrency = currMatch[1].toUpperCase();
    }

    let isWageCompliant = true;
    if (detectedSalary && offeredSalary) {
      if (detectedSalary < offeredSalary) {
        warnings.push(`Contract salary deficit: Document states ${detectedCurrency || currency || ''} ${detectedSalary}, but form stated ${offeredSalary}.`);
        isWageCompliant = false;
      }
    }

    onProgress?.('OCR Extraction Complete!', 100);

    return {
      rawText: combinedText,
      confidence: totalConfidence,
      extractedPassportNo: detectedPassport,
      extractedSalary: detectedSalary,
      extractedCurrency: detectedCurrency,
      isPassportMatched,
      isWageCompliant,
      pagesProcessed: pagesCount,
      previewUrl: firstPreviewUrl,
      warnings,
    };
  } catch (error: any) {
    console.error('OCR Pipeline failure:', error);
    return {
      rawText: combinedText || (error?.message ? `OCR Extraction Error: ${error.message}` : 'OCR failed to process document.'),
      confidence: 25,
      pagesProcessed: 0,
      previewUrl: firstPreviewUrl,
      warnings: ['OCR Processing failed or document format not recognized. Manual verification required.'],
    };
  }
}

/**
 * Generate a realistic sample Indian Passport bio-page image on an HTML5 canvas and return as a File
 */
export async function generateSamplePassportFile(
  fullName: string,
  passportNo: string,
  dob: string,
  expiry: string
): Promise<File> {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 560;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Background passport page with watermark styling
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 800, 560);

    // Border
    ctx.strokeStyle = '#0c2340';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, 780, 540);

    // Header strip
    ctx.fillStyle = '#0c2340';
    ctx.fillRect(10, 10, 780, 60);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('REPUBLIC OF INDIA / भारत गणराज्य', 30, 48);

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('PASSPORT / पासपोर्ट', 640, 48);

    // Photo Box
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(40, 100, 160, 200);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 100, 160, 200);

    ctx.fillStyle = '#475569';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('PHOTO', 95, 205);

    // Passport Details
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 15px monospace';

    ctx.fillText('Type: P', 240, 115);
    ctx.fillText('Country Code: IND', 380, 115);
    ctx.fillStyle = '#b91c1c';
    ctx.fillText(`Passport No: ${passportNo}`, 540, 115);

    ctx.fillStyle = '#475569';
    ctx.font = '12px sans-serif';
    ctx.fillText('Given Name(s) / दिया गया नाम:', 240, 150);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(fullName.toUpperCase(), 240, 172);

    ctx.fillStyle = '#475569';
    ctx.font = '12px sans-serif';
    ctx.fillText('Nationality / राष्ट्रीयता:', 240, 205);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('INDIAN', 240, 225);

    ctx.fillStyle = '#475569';
    ctx.font = '12px sans-serif';
    ctx.fillText('Date of Birth / जन्म तिथि:', 380, 205);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(dob, 380, 225);

    ctx.fillStyle = '#475569';
    ctx.font = '12px sans-serif';
    ctx.fillText('Place of Issue / जारी करने का स्थान:', 560, 205);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('JAIPUR', 560, 225);

    ctx.fillStyle = '#475569';
    ctx.font = '12px sans-serif';
    ctx.fillText('Date of Expiry / समाप्ति तिथि:', 240, 260);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(expiry, 240, 280);

    ctx.fillStyle = '#b45309';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('Emigration Check Required (ECR)', 450, 280);

    // Decorative separator
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, 330);
    ctx.lineTo(770, 330);
    ctx.stroke();

    // Machine Readable Zone (MRZ) - 2 Lines standard ICAO 9303
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 22px "Courier New", Courier, monospace';
    const cleanSurname = fullName.split(' ').pop()?.toUpperCase() || 'WORKER';
    const cleanGiven = fullName.split(' ')[0]?.toUpperCase() || 'INDIAN';
    const cleanDob = dob.replace(/-/g, '').substring(2);
    const cleanExp = expiry.replace(/-/g, '').substring(2);

    const mrzLine1 = `P<IND${cleanSurname}<<${cleanGiven}<<<<<<<<<<<<<<<<<<<`;
    const mrzLine2 = `${passportNo}<4IND${cleanDob}7M${cleanExp}4<<<<<<<<<<<<<<02`;

    ctx.fillText(mrzLine1, 40, 420);
    ctx.fillText(mrzLine2, 40, 470);
  }

  return new Promise<File>((resolve) => {
    canvas.toBlob((blob) => {
      const file = new File([blob || new Blob()], `sample_passport_${passportNo}.jpg`, { type: 'image/jpeg' });
      resolve(file);
    }, 'image/jpeg', 0.95);
  });
}

/**
 * Generate a realistic sample Bilingual Employment Contract on canvas and return as a File
 */
export async function generateSampleContractFile(
  employeeName: string,
  passportNo: string,
  trade: string,
  salary: number,
  currency: string = 'AED',
  isDeficient: boolean = false
): Promise<File> {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 700;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 800, 700);

    // Border
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 3;
    ctx.strokeRect(15, 15, 770, 670);

    // Contract Header
    ctx.fillStyle = '#0c2340';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('STANDARD BILATERAL EMPLOYMENT CONTRACT', 120, 60);

    ctx.fillStyle = '#64748b';
    ctx.font = '13px sans-serif';
    ctx.fillText('Approved under MEA Government of India & Host Country Labor Registry', 160, 85);

    // Parties
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('Employer: Al-Habtoor Engineering Enterprises W.L.L. (FE-UAE-9921)', 40, 130);
    ctx.fillText(`Employee: ${employeeName} (Passport No: ${passportNo})`, 40, 160);
    ctx.fillText(`Designation / Job Title: ${trade}`, 40, 190);

    // Clauses
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#334155';

    ctx.fillText('Clause 1: Term of Contract — 24 Months renewable with mutual written consent.', 40, 240);
    ctx.fillText('Clause 2: Working Hours — 8 hours per day, 48 hours per week with Friday rest.', 40, 275);
    ctx.fillText('Clause 3: Accommodation — Employer provides approved bachelor housing & transport.', 40, 310);

    // Clause 4: Remuneration (Critical field for OCR!)
    ctx.fillStyle = isDeficient ? '#991b1b' : '#065f46';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(`Clause 4: Monthly Basic Salary — ${currency} ${salary.toLocaleString()}`, 40, 355);

    ctx.fillStyle = '#334155';
    ctx.font = '14px sans-serif';
    ctx.fillText(`The employer agrees to pay the employee a monthly remuneration of ${currency} ${salary.toLocaleString()}.`, 40, 385);
    ctx.fillText('Payment shall be made directly into the worker bank account by the 7th of every calendar month.', 40, 410);

    ctx.fillText('Clause 5: Insurance — Mandatory Pravasi Bharatiya Bima Yojana (₹10 Lakh Cover).', 40, 450);
    ctx.fillText('Clause 6: Air Passage — Free return economy air ticket provided upon contract completion.', 40, 485);
    ctx.fillText('Clause 7: Rule 25 Compliance — Zero visa fee charged to worker under Indian sovereign rules.', 40, 520);

    // Signatures
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('Signature of Employer: [Attested Stamp]', 40, 600);
    ctx.fillText(`Signature of Worker: ${employeeName}`, 450, 600);

    ctx.fillStyle = '#64748b';
    ctx.font = '11px monospace';
    ctx.fillText('E-Migrate Ref: MEA-CONTRACT-BILATERAL-2026 • Verified Document', 220, 650);
  }

  return new Promise<File>((resolve) => {
    canvas.toBlob((blob) => {
      const file = new File([blob || new Blob()], `sample_contract_${salary}_${currency}.jpg`, { type: 'image/jpeg' });
      resolve(file);
    }, 'image/jpeg', 0.95);
  });
}

/**
 * Generate a blurred/illegible document to test low-confidence (<60%) edge case
 */
export async function generateSampleBlurryFile(): Promise<File> {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(0, 0, 600, 400);

    // Apply severe canvas blur filter
    ctx.filter = 'blur(16px)';
    ctx.fillStyle = '#64748b';
    ctx.font = '24px sans-serif';
    ctx.fillText('ILLEGIBLE DOCUMENT BLURRY SCAN', 50, 150);
    ctx.fillText('UNREADABLE TEXT 12345678', 50, 220);
    ctx.filter = 'none';

    // Add noise
    for (let i = 0; i < 500; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? '#cbd5e1' : '#94a3b8';
      ctx.fillRect(Math.random() * 600, Math.random() * 400, 2, 2);
    }
  }

  return new Promise<File>((resolve) => {
    canvas.toBlob((blob) => {
      const file = new File([blob || new Blob()], 'sample_blurry_document.jpg', { type: 'image/jpeg' });
      resolve(file);
    }, 'image/jpeg', 0.8);
  });
}
