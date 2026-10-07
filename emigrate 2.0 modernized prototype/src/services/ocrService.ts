import { pdfjsLib } from '../utils/pdfWorker';
import { createWorker } from 'tesseract.js';

export interface OCRResult {
  rawText: string;
  confidence: number;
  fileName: string;
  fileType: string;
  pageCount: number;
  isLegible: boolean;
  extractedPassportNo?: string;
  extractedSalary?: number;
  extractedCurrency?: string;
  mrzString?: string;
  previewUrl?: string;
  thumbnailUrl?: string;
}

/**
 * Render PDF file to image data URLs (up to 3 pages) using a hidden canvas
 */
export async function renderPdfPagesToImages(
  file: File,
  maxPages = 3,
  onProgress?: (status: string, progress: number) => void
): Promise<{ images: string[]; pageCount: number; firstPagePreview: string }> {
  onProgress?.('Rendering PDF pages to canvas...', 10);
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  const totalPages = pdfDoc.numPages;
  const pagesToProcess = Math.min(totalPages, maxPages);

  const images: string[] = [];
  let firstPagePreview = '';

  for (let pageNum = 1; pageNum <= pagesToProcess; pageNum++) {
    onProgress?.(`Rendering page ${pageNum} of ${pagesToProcess}...`, 10 + (pageNum / pagesToProcess) * 20);
    const page = await pdfDoc.getPage(pageNum);
    // Render at 1.8x scale for crisp OCR character recognition
    const viewport = page.getViewport({ scale: 1.8 });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Canvas 2D context not available');
    }

    // White background
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Render page
    // Note: cast render parameter for compatibility across pdfjs versions
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
      canvas,
    };
    await page.render(renderContext as any).promise;

    const dataUrl = canvas.toDataURL('image/png');
    images.push(dataUrl);
    if (pageNum === 1) {
      firstPagePreview = dataUrl;
    }
  }

  return { images, pageCount: totalPages, firstPagePreview };
}

/**
 * Run Tesseract OCR on a single image or data URL with live progress tracking
 */
export async function recognizeImage(
  imageSource: string | File | Blob,
  onProgress?: (status: string, progress: number) => void
): Promise<{ text: string; confidence: number }> {
  // Create worker for English
  const worker = await createWorker('eng', 1, {
    logger: (m) => {
      if (m.status === 'recognizing text') {
        const pct = Math.round((m.progress || 0) * 100);
        onProgress?.(`Extracting Text (${pct}%)...`, 30 + Math.round(pct * 0.6));
      } else if (m.status) {
        onProgress?.(`OCR Engine: ${m.status}...`, 35);
      }
    },
  });

  try {
    const result = await worker.recognize(imageSource);
    const text = result.data.text || '';
    const confidence = typeof result.data.confidence === 'number' ? Math.round(result.data.confidence) : 85;
    return { text, confidence };
  } finally {
    // Memory cleanup: Terminate Tesseract worker to prevent leaks
    try {
      await worker.terminate();
    } catch (e) {
      console.warn('Worker termination caught:', e);
    }
  }
}

/**
 * Main Client-Side OCR Pipeline
 * Accepts .pdf, .png, .jpg, .jpeg
 * Processes up to 3 pages for multi-page PDFs
 * Extracts text, computes confidence, flags illegible documents
 */
export async function processDocumentFile(
  file: File,
  docType: 'passport' | 'contract' | 'photo' = 'passport',
  onProgress?: (status: string, progress: number) => void
): Promise<OCRResult> {
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  let rawText = '';
  let avgConfidence = 0;
  let pageCount = 1;
  let previewUrl = '';
  let thumbnailUrl = '';

  try {
    if (isPdf) {
      onProgress?.('Initializing PDF parser...', 5);
      const { images, pageCount: pdfPages, firstPagePreview } = await renderPdfPagesToImages(
        file,
        3,
        onProgress
      );
      pageCount = pdfPages;
      previewUrl = firstPagePreview;
      thumbnailUrl = firstPagePreview;

      const pageTexts: string[] = [];
      let totalConf = 0;

      for (let i = 0; i < images.length; i++) {
        onProgress?.(`Running OCR on page ${i + 1} of ${images.length}...`, 30 + (i / images.length) * 55);
        const { text, confidence } = await recognizeImage(images[i], onProgress);
        pageTexts.push(text.trim());
        totalConf += confidence;
      }

      rawText = pageTexts.filter(Boolean).join('\n\n--- Page Break ---\n\n');
      avgConfidence = images.length > 0 ? Math.round(totalConf / images.length) : 0;
    } else {
      // Direct Image File
      onProgress?.('Loading image file...', 15);
      previewUrl = URL.createObjectURL(file);
      thumbnailUrl = previewUrl;

      onProgress?.('Extracting text with Tesseract...', 30);
      const { text, confidence } = await recognizeImage(file, onProgress);
      rawText = text.trim();
      avgConfidence = confidence;
    }

    onProgress?.('Analyzing extracted text...', 90);

    // Blank or gibberish check
    const isVeryShort = rawText.replace(/\s+/g, '').length < 8;
    const isLegible = !isVeryShort && avgConfidence >= 60;

    // Extract potential passport number using MRZ Regex: [A-Z][0-9]{7}
    const extractedPassportNo = extractPassportNumber(rawText);

    // Extract potential contract salary and currency
    const salaryData = extractContractSalary(rawText);

    onProgress?.('Extraction completed successfully', 100);

    return {
      rawText,
      confidence: isLegible ? avgConfidence : Math.min(avgConfidence, 52),
      fileName: file.name,
      fileType: file.type || (isPdf ? 'application/pdf' : 'image/jpeg'),
      pageCount,
      isLegible,
      extractedPassportNo: extractedPassportNo || undefined,
      extractedSalary: salaryData.extractedSalary || undefined,
      extractedCurrency: salaryData.extractedCurrency || undefined,
      previewUrl,
      thumbnailUrl,
    };
  } catch (error) {
    console.error('OCR Extraction failed:', error);
    return {
      rawText: 'OCR Extraction Error: Unable to process document scan.',
      confidence: 45,
      fileName: file.name,
      fileType: file.type || 'unknown',
      pageCount: 1,
      isLegible: false,
      previewUrl,
    };
  }
}

/**
 * Regex MRZ Verification for Indian Passports
 * Standard Indian Passport: 1 uppercase letter followed by 7 digits (e.g. K7819234, Z9021482)
 */
export function extractPassportNumber(rawText: string): string | null {
  if (!rawText) return null;

  // 1. Check for standard Indian Passport number pattern: [A-Z][0-9]{7}
  const passportRegex = /\b([A-Z][0-9]{7})\b/g;
  const matches = rawText.toUpperCase().match(passportRegex);
  if (matches && matches.length > 0) {
    return matches[0];
  }

  // 2. Check MRZ lines: P<IND... followed by passport number
  const mrzRegex = /IND([A-Z0-9<]{8,9})/;
  const mrzMatch = rawText.toUpperCase().match(mrzRegex);
  if (mrzMatch && mrzMatch[1]) {
    const candidate = mrzMatch[1].replace(/</g, '').trim();
    if (/^[A-Z][0-9]{7}$/.test(candidate)) {
      return candidate;
    }
  }

  // 3. Fallback: Search near keyword "Passport"
  const nearbyRegex = /(?:passport|passport\s+no|passport\s+number)[\s:.-]*([A-Z0-9]{8})/i;
  const nearbyMatch = rawText.match(nearbyRegex);
  if (nearbyMatch && nearbyMatch[1]) {
    const cleaned = nearbyMatch[1].toUpperCase().trim();
    if (/^[A-Z][0-9]{7}$/.test(cleaned)) {
      return cleaned;
    }
  }

  return null;
}

/**
 * Extract numerical salary values and currency from contract text
 */
export function extractContractSalary(rawText: string): {
  extractedSalary: number | null;
  extractedCurrency?: string;
  foundValues: number[];
} {
  if (!rawText) return { extractedSalary: null, foundValues: [] };

  const foundValues: number[] = [];
  let extractedCurrency = 'AED';

  // Detect currency from text
  const upper = rawText.toUpperCase();
  if (upper.includes('SAR') || upper.includes('RIYAL')) extractedCurrency = 'SAR';
  else if (upper.includes('QAR')) extractedCurrency = 'QAR';
  else if (upper.includes('KWD') || upper.includes('DINAR')) extractedCurrency = 'KWD';
  else if (upper.includes('OMR')) extractedCurrency = 'OMR';
  else if (upper.includes('BHD')) extractedCurrency = 'BHD';
  else if (upper.includes('AED') || upper.includes('DIRHAM')) extractedCurrency = 'AED';

  // Search patterns like: Salary: 1,450 or Wage: 1450 or Monthly Pay AED 1450
  const wagePattern =
    /(?:salary|wage|basic\s+wage|monthly\s+remuneration|monthly\s+pay|monthly\s+salary|aed|sar|qar|kwd|omr|bhd)[\s:=-]+([0-9]{1,2},[0-9]{3}|[0-9]{3,6})/gi;

  let match: RegExpExecArray | null;
  while ((match = wagePattern.exec(rawText)) !== null) {
    if (match[1]) {
      const val = parseInt(match[1].replace(/,/g, ''), 10);
      if (!isNaN(val) && val >= 300 && val <= 100000) {
        foundValues.push(val);
      }
    }
  }

  // If no direct wage pattern matched, search standalone currency numbers
  if (foundValues.length === 0) {
    const generalNumPattern = /\b([0-9]{1,2},[0-9]{3}|[1-9][0-9]{2,4})\b/g;
    let numMatch: RegExpExecArray | null;
    while ((numMatch = generalNumPattern.exec(rawText)) !== null) {
      const val = parseInt(numMatch[1].replace(/,/g, ''), 10);
      if (!isNaN(val) && val >= 500 && val <= 50000) {
        foundValues.push(val);
      }
    }
  }

  // Pick the most plausible contract monthly wage
  const extractedSalary = foundValues.length > 0 ? foundValues[0] : null;

  return { extractedSalary, extractedCurrency, foundValues };
}

/**
 * Extract Trade License or Commercial Registration (CR) number
 * Matches patterns like: TL-DXB-2026-5541, CR-1010-99218, TL-DXB-7788192, CR-QAT-55441, or 6-9 digit registrations
 */
export function extractTradeLicenseNumber(rawText: string): string | null {
  if (!rawText) return null;

  // 1. Specific format pattern: (TL|CR)-[A-Z0-9-]+
  const prefPattern = /\b(?:TL|CR)[-_][A-Z0-9-_]{4,16}\b/i;
  const match1 = rawText.match(prefPattern);
  if (match1) return match1[0].toUpperCase();

  // 2. Pattern near keywords "Trade License" or "Commercial Registration" or "CR No"
  const nearbyPattern = /(?:trade\s*license|commercial\s*reg(?:istration)?|cr\s*no\.?|license\s*no\.?)[\s:=-]+([A-Z0-9-_]{5,20})/i;
  const match2 = rawText.match(nearbyPattern);
  if (match2 && match2[1]) {
    const val = match2[1].trim();
    if (!/^(date|issue|valid|until|name)$/i.test(val)) {
      return val.toUpperCase();
    }
  }

  return null;
}

/**
 * Extract Manpower Demand Quota count from corporate demand letter
 * Matches patterns like: Quota: 150 or 150 Workers or Demand Quota: 250
 */
export function extractDemandQuotaCount(rawText: string): number | null {
  if (!rawText) return null;

  const patterns = [
    /(?:demand\s*quota|quota\s*requested|manpower\s*demand|total\s*workers|worker\s*quota|workers\s*required)[\s:=-]+([0-9]{1,4})\b/i,
    /\b([0-9]{1,4})\s*(?:workers|manpower|personnel|laborers|tradesmen|employees)\b/i,
    /(?:quota|allocation)[\s:=-]+([0-9]{1,4})\b/i,
  ];

  for (const pattern of patterns) {
    const match = rawText.match(pattern);
    if (match && match[1]) {
      const parsed = parseInt(match[1], 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 5000) {
        return parsed;
      }
    }
  }

  return null;
}

/**
 * Extract Indian Income Tax Permanent Account Number (PAN)
 * Standard Indian PAN format: 5 letters, 4 digits, 1 letter (e.g. AAACH9012K, AAACA1299K)
 */
export function extractPanNumber(rawText: string): string | null {
  if (!rawText) return null;

  const panRegex = /\b([A-Z]{5}[0-9]{4}[A-Z]{1})\b/g;
  const matches = rawText.toUpperCase().match(panRegex);
  if (matches && matches.length > 0) {
    return matches[0];
  }

  return null;
}

/**
 * Extract Bank Guarantee amount (in Lakhs or total INR)
 * Returns the amount in Lakhs (e.g., 50 for ₹50 Lakhs)
 */
export function extractBankGuaranteeAmount(rawText: string): {
  amountInLakhs: number | null;
  rawMatchedString?: string;
} {
  if (!rawText) return { amountInLakhs: null };

  const upper = rawText.toUpperCase();

  // 1. Match "50 Lakh" or "₹50 Lakh" or "50,00,000" or "5,000,000"
  const lakhPattern = /(?:INR|RS\.?|₹)?\s*([0-9]{1,3}(?:\.[0-9]+)?)\s*(?:LAKH|LAKHS|LAC|LACS)/i;
  const lakhMatch = upper.match(lakhPattern);
  if (lakhMatch && lakhMatch[1]) {
    const num = parseFloat(lakhMatch[1]);
    if (!isNaN(num)) {
      return { amountInLakhs: num, rawMatchedString: lakhMatch[0] };
    }
  }

  // 2. Match standard Indian format ₹50,00,000
  const fullIndianPattern = /(?:INR|RS\.?|₹)?\s*([0-9]{1,3},[0-9]{2},[0-9]{3})/i;
  const indianMatch = upper.match(fullIndianPattern);
  if (indianMatch && indianMatch[1]) {
    const rawVal = parseInt(indianMatch[1].replace(/,/g, ''), 10);
    if (!isNaN(rawVal)) {
      return { amountInLakhs: rawVal / 100000, rawMatchedString: indianMatch[0] };
    }
  }

  // 3. Match international format 5,000,000
  const fullIntlPattern = /(?:INR|RS\.?|₹)?\s*([0-9]{1,3},[0-9]{3},[0-9]{3})/i;
  const intlMatch = upper.match(fullIntlPattern);
  if (intlMatch && intlMatch[1]) {
    const rawVal = parseInt(intlMatch[1].replace(/,/g, ''), 10);
    if (!isNaN(rawVal)) {
      return { amountInLakhs: rawVal / 100000, rawMatchedString: intlMatch[0] };
    }
  }

  // 4. Match plain 5000000 near guarantee
  const nearbyNum = /(?:guarantee|security\s*bond|bond\s*amount)[\s:=-]+(?:INR|RS\.?|₹)?\s*([0-9]{6,8})/i;
  const nearbyMatch = upper.match(nearbyNum);
  if (nearbyMatch && nearbyMatch[1]) {
    const rawVal = parseInt(nearbyMatch[1], 10);
    if (!isNaN(rawVal)) {
      return { amountInLakhs: rawVal / 100000, rawMatchedString: nearbyMatch[0] };
    }
  }

  return { amountInLakhs: null };
}

/**
 * Highlight keywords (Passport No, Salary, Names, and Statutory Terms) with <mark> tags
 */
export function highlightKeywordsInText(
  rawText: string,
  keywords: {
    passportNumber?: string;
    salary?: number;
    fullName?: string;
    tradeLicenseNo?: string;
    demandQuota?: number;
    panNumber?: string;
    guaranteeAmount?: string;
    agencyName?: string;
    additional?: string[];
  }
): string {
  if (!rawText) return '';

  const termsToHighlight: string[] = [];

  if (keywords.passportNumber) termsToHighlight.push(keywords.passportNumber);
  if (keywords.tradeLicenseNo) termsToHighlight.push(keywords.tradeLicenseNo);
  if (keywords.panNumber) termsToHighlight.push(keywords.panNumber);
  if (keywords.guaranteeAmount) termsToHighlight.push(keywords.guaranteeAmount);

  if (keywords.demandQuota && keywords.demandQuota > 0) {
    termsToHighlight.push(keywords.demandQuota.toString());
    termsToHighlight.push(`${keywords.demandQuota} Workers`);
  }

  if (keywords.salary && keywords.salary > 0) {
    termsToHighlight.push(keywords.salary.toString());
    termsToHighlight.push(keywords.salary.toLocaleString());
  }

  if (keywords.fullName) {
    termsToHighlight.push(...keywords.fullName.split(/\s+/).filter((p) => p.length > 2));
  }

  if (keywords.agencyName) {
    termsToHighlight.push(...keywords.agencyName.split(/\s+/).filter((p) => p.length > 3));
  }

  // Statutory & Corporate keywords
  termsToHighlight.push(
    'TRADE LICENSE',
    'COMMERCIAL REGISTRATION',
    'DEPARTMENT OF ECONOMIC DEVELOPMENT',
    'CHAMBER OF COMMERCE',
    'DEMAND LETTER',
    'QUOTA',
    'MANPOWER',
    'BANK GUARANTEE',
    'SECURITY DEED',
    'STATE BANK OF INDIA',
    'SECTION 11',
    'EMIGRATION ACT 1983',
    'RULE 25',
    'AUDITED BALANCE SHEET',
    'CHARTERED ACCOUNTANT',
    'NET WORTH',
    'TURNOVER',
    'MINISTRY OF EXTERNAL AFFAIRS',
    'EMIGRATION',
    'PASSPORT',
    'SALARY',
    'WAGE',
    'BASIC WAGE',
    'PBBY',
    'CONTRACT',
    '50 LAKH',
    '₹50,00,000'
  );

  if (keywords.additional) {
    termsToHighlight.push(...keywords.additional);
  }

  // Unique terms, longest first so longer phrases win over their parts
  const uniqueTerms = Array.from(new Set(termsToHighlight.filter(Boolean))).sort(
    (a, b) => b.length - a.length
  );

  const escapeHtml = (t: string) =>
    t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  if (uniqueTerms.length === 0) return escapeHtml(rawText);

  // One combined regex run on the RAW text; each piece is escaped separately afterwards.
  // (Highlighting after escaping could corrupt entities such as &amp; / &lt;.)
  const pattern = new RegExp(
    `(${uniqueTerms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
    'gi'
  );

  let out = '';
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(rawText)) !== null) {
    if (m[0].length === 0) {
      pattern.lastIndex++;
      continue;
    }
    out += escapeHtml(rawText.slice(last, m.index));
    out += `<mark class="bg-amber-200 text-navy-950 font-bold px-1 rounded shadow-xs">${escapeHtml(m[0])}</mark>`;
    last = m.index + m[0].length;
  }
  out += escapeHtml(rawText.slice(last));
  return out;
}
