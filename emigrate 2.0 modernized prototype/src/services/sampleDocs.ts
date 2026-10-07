/**
 * Sample Document Generator for Client-Side OCR Testing
 * Generates real canvas-rendered images of Passport and Contract documents
 * so Tesseract OCR can run actual client-side optical recognition on real pixels.
 */

export function generateSamplePassportImage(
  passportNo = 'K7819234',
  fullName = 'MUKESH KUMAR VERMA',
  dob = '14/07/1995',
  expiry = '09/08/2031'
): File {
  const canvas = document.createElement('canvas');
  canvas.width = 900;
  canvas.height = 620;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas context not available');
  }

  // Background - Indian Passport bio-page security paper
  ctx.fillStyle = '#f8f6ee';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Decorative border
  ctx.strokeStyle = '#0c2340';
  ctx.lineWidth = 4;
  ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);

  // Header
  ctx.fillStyle = '#0c2340';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('GOVERNMENT OF INDIA / REPUBLIC OF INDIA', 220, 55);

  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('PASSPORT / पासपोर्ट', 380, 85);

  // Photo Box
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(40, 110, 160, 200);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 110, 160, 200);
  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('PASSPORT PHOTO', 55, 215);

  // Data fields
  ctx.fillStyle = '#0f172a';
  ctx.font = '13px sans-serif';
  ctx.fillText('Type / प्रकार: P', 230, 125);
  ctx.fillText('Country Code / देश कोड: IND', 440, 125);

  ctx.font = 'bold 15px sans-serif';
  ctx.fillText(`Passport No. / पासपोर्ट सं.: ${passportNo}`, 230, 155);

  ctx.font = '13px sans-serif';
  ctx.fillText('Given Name(s) / दिया गया नाम:', 230, 185);
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText(fullName, 230, 205);

  ctx.font = '13px sans-serif';
  ctx.fillText('Nationality / राष्ट्रीयता: INDIAN', 230, 235);
  ctx.fillText(`Date of Birth / जन्म तिथि: ${dob}`, 440, 235);

  ctx.fillText('Place of Issue / जारी करने का स्थान: JAIPUR', 230, 265);
  ctx.fillText(`Date of Expiry / समाप्ति तिथि: ${expiry}`, 440, 265);

  // Emigration Check Required Stamp
  ctx.strokeStyle = '#b91c1c';
  ctx.lineWidth = 2;
  ctx.strokeRect(660, 110, 190, 70);
  ctx.fillStyle = '#b91c1c';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('EMIGRATION CHECK', 680, 138);
  ctx.fillText('REQUIRED (ECR)', 700, 162);

  // Machine Readable Zone (MRZ) - 2 Lines standard ICAO 9303
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 20px monospace';

  const surname = fullName.split(' ').pop() || 'VERMA';
  const given = fullName.split(' ')[0] || 'MUKESH';
  const line1 = `P<IND${surname}<<${given}<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`;
  const line2 = `${passportNo}IND9507142M3108092<<<<<<<<<<<<<<02`;

  ctx.fillText(line1.substring(0, 44), 40, 520);
  ctx.fillText(line2.substring(0, 44), 40, 560);

  // Convert canvas to Blob then File
  const dataUrl = canvas.toDataURL('image/png');
  const blobBin = atob(dataUrl.split(',')[1]);
  const array: number[] = [];
  for (let i = 0; i < blobBin.length; i++) {
    array.push(blobBin.charCodeAt(i));
  }
  const file = new File([new Uint8Array(array)], `passport_scan_${passportNo.toLowerCase()}.png`, {
    type: 'image/png',
  });
  return file;
}

export function generateSampleContractImage(
  salary = 1450,
  currency = 'AED',
  trade = 'Construction Mason',
  workerName = 'Mukesh Kumar Verma'
): File {
  const canvas = document.createElement('canvas');
  canvas.width = 900;
  canvas.height = 700;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas context not available');
  }

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Border
  ctx.strokeStyle = '#0c2340';
  ctx.lineWidth = 3;
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

  // Header
  ctx.fillStyle = '#0c2340';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('STANDARD BILATERAL EMPLOYMENT CONTRACT', 190, 65);

  ctx.font = '14px sans-serif';
  ctx.fillText('MINISTRY OF EXTERNAL AFFAIRS • EMIGRATE 2.0 OVERSEAS ACCORD', 200, 95);

  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, 115);
  ctx.lineTo(860, 115);
  ctx.stroke();

  // Parties
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText('PARTIES TO THE CONTRACT:', 45, 145);

  ctx.font = '14px sans-serif';
  ctx.fillText('First Party (Employer): Al-Habtoor Engineering Enterprises LLC (FE-UAE-9921)', 45, 175);
  ctx.fillText(`Second Party (Employee): ${workerName} (Indian Citizen)`, 45, 205);
  ctx.fillText(`Designated Trade / Occupation: ${trade}`, 45, 235);

  // Clauses
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText('TERMS OF EMPLOYMENT & STATUTORY CLAUSES:', 45, 280);

  ctx.font = '14px sans-serif';
  ctx.fillText('Clause 1: Contract duration is 24 months commencing on deployment date.', 45, 315);

  // Key Wage Clause (Bolded for OCR)
  ctx.font = 'bold 16px sans-serif';
  ctx.fillStyle = '#0c2340';
  ctx.fillText(`Clause 2: Monthly Basic Wage: ${currency} ${salary} per calendar month.`, 45, 355);

  ctx.font = '14px sans-serif';
  ctx.fillStyle = '#0f172a';
  ctx.fillText('Clause 3: Working hours shall not exceed 8 hours per day, 48 hours weekly.', 45, 395);
  ctx.fillText('Clause 4: Accommodation, medical treatment and local transport provided free of charge.', 45, 430);
  ctx.fillText('Clause 5: Pravasi Bharatiya Bima Yojana (PBBY) ₹10 Lakh cover fully verified.', 45, 465);
  ctx.fillText('Clause 6: Rule 25 Compliance: No recruitment fees in excess of ₹30,000 charged.', 45, 500);

  // Signatures
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('Authorized Signatory (Employer)', 70, 580);
  ctx.fillText('Signature of Worker (Employee)', 540, 580);

  ctx.font = 'italic 16px serif';
  ctx.fillStyle = '#1e3a8a';
  ctx.fillText('Ahmed Al-Mansoor', 90, 615);
  ctx.fillText(workerName, 570, 615);

  // Convert canvas to File
  const dataUrl = canvas.toDataURL('image/png');
  const blobBin = atob(dataUrl.split(',')[1]);
  const array: number[] = [];
  for (let i = 0; i < blobBin.length; i++) {
    array.push(blobBin.charCodeAt(i));
  }
  const file = new File([new Uint8Array(array)], `signed_contract_${currency.toLowerCase()}_${salary}.png`, {
    type: 'image/png',
  });
  return file;
}

export function generateSampleBlurryImage(): File {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas context not available');
  }

  // Gray noise / blurred gradient
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Blurry scribbles that produce low confidence or gibberish
  ctx.fillStyle = '#94a3b8';
  ctx.filter = 'blur(8px)';
  ctx.font = '16px sans-serif';
  ctx.fillText('Unreadable scan noise text blurred', 40, 100);
  ctx.fillText('xxxx xxxx xxxx blurry image', 40, 150);

  const dataUrl = canvas.toDataURL('image/png');
  const blobBin = atob(dataUrl.split(',')[1]);
  const array: number[] = [];
  for (let i = 0; i < blobBin.length; i++) {
    array.push(blobBin.charCodeAt(i));
  }
  return new File([new Uint8Array(array)], 'blurry_unreadable_scan.png', {
    type: 'image/png',
  });
}

/**
 * Generate sample Trade License / Commercial Registration (CR) image for Foreign Employer
 */
export function generateSampleTradeLicenseImage(
  tradeLicenseNo = 'TL-DXB-2026-5541',
  businessName = 'Emirates Infra-Build Contracting LLC',
  validUntil = '2028-12-31',
  sponsorId = 'SP-DXB-998811'
): File {
  const canvas = document.createElement('canvas');
  canvas.width = 900;
  canvas.height = 700;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Border
  ctx.strokeStyle = '#0c2340';
  ctx.lineWidth = 4;
  ctx.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);

  // Header
  ctx.fillStyle = '#0c2340';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('GOVERNMENT OF DUBAI • DEPARTMENT OF ECONOMIC DEVELOPMENT', 90, 60);

  ctx.font = 'bold 18px sans-serif';
  ctx.fillStyle = '#1e3a8a';
  ctx.fillText('COMMERCIAL LICENSE / TRADE REGISTRATION CERTIFICATE', 180, 95);

  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(35, 115);
  ctx.lineTo(865, 115);
  ctx.stroke();

  // License Details
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText('REGISTRATION & ENTITY IDENTIFICATION:', 45, 150);

  ctx.font = '14px sans-serif';
  ctx.fillText(`Legal Entity Name: ${businessName}`, 45, 185);
  ctx.fillText('Legal Status: Limited Liability Company (LLC)', 45, 215);

  // Key License Number field for OCR
  ctx.font = 'bold 16px sans-serif';
  ctx.fillStyle = '#0c2340';
  ctx.fillText(`Trade License No: ${tradeLicenseNo}`, 45, 255);

  ctx.font = '14px sans-serif';
  ctx.fillStyle = '#0f172a';
  ctx.fillText(`Commercial Registry (CR) / Sponsor ID: ${sponsorId}`, 45, 290);
  ctx.fillText('Issuing Authority: Dubai Department of Economic Development (DED)', 45, 325);
  ctx.fillText(`Registration Valid Until: ${validUntil}`, 45, 360);
  ctx.fillText('Authorized Business Activities: Building Contracting, Civil Infrastructure, MEP Works', 45, 395);

  // Chamber Attestation Seal
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 2;
  ctx.strokeRect(550, 430, 290, 110);
  ctx.fillStyle = '#b45309';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('DUBAI CHAMBER OF COMMERCE', 580, 460);
  ctx.fillText('ATTESTED & REGISTERED 2026', 585, 485);
  ctx.fillText('VERIFIED FOR OVERSEAS RECRUITMENT', 560, 515);

  // Mission Clearance Notice
  ctx.fillStyle = '#065f46';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('Consular Validation: MEA eMigrate 2.0 Bilateral Verification Registry', 45, 480);
  ctx.fillText('Host Country Labor Accommodation Audited & Certified (Capacity: 400 Beds)', 45, 510);

  // Stamp & Sign
  ctx.fillStyle = '#64748b';
  ctx.font = '12px sans-serif';
  ctx.fillText('Director General of Commercial Licensing • Electronic Attestation Stamp', 45, 620);

  const dataUrl = canvas.toDataURL('image/png');
  const blobBin = atob(dataUrl.split(',')[1]);
  const array: number[] = [];
  for (let i = 0; i < blobBin.length; i++) array.push(blobBin.charCodeAt(i));
  return new File([new Uint8Array(array)], `trade_license_${tradeLicenseNo.toLowerCase()}.png`, {
    type: 'image/png',
  });
}

/**
 * Generate sample Manpower Demand Letter image for Foreign Employer
 */
export function generateSampleDemandLetterImage(
  businessName = 'Emirates Infra-Build Contracting LLC',
  demandQuota = 150,
  signatoryName = 'Ahmed Mansoor Al-Ketbi',
  country = 'United Arab Emirates'
): File {
  const canvas = document.createElement('canvas');
  canvas.width = 900;
  canvas.height = 700;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#0c2340';
  ctx.lineWidth = 3;
  ctx.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);

  // Letterhead
  ctx.fillStyle = '#0c2340';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText(businessName.toUpperCase(), 160, 60);

  ctx.font = '13px sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('Corporate Human Resources & Manpower Procurement Division', 240, 85);

  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(35, 105);
  ctx.lineTo(865, 105);
  ctx.stroke();

  // Addressed to Mission
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('To: Protector General of Emigrants & Consular Attestation Wing', 45, 140);
  ctx.fillText(`Embassy / Consulate General of India, ${country}`, 45, 165);

  ctx.font = 'bold 15px sans-serif';
  ctx.fillStyle = '#1e3a8a';
  ctx.fillText('SUBJECT: FORMAL SPECIMEN DEMAND LETTER FOR INDIAN MANPOWER', 45, 205);

  ctx.font = '14px sans-serif';
  ctx.fillStyle = '#0f172a';
  ctx.fillText('Dear Sir / Madam,', 45, 240);
  ctx.fillText(`We hereby place a requisition for Indian workers under MEA eMigrate 2.0 regulations.`, 45, 270);

  // Demand Quota (Key OCR field)
  ctx.font = 'bold 16px sans-serif';
  ctx.fillStyle = '#0c2340';
  ctx.fillText(`Total Manpower Demand Quota: ${demandQuota} Workers`, 45, 310);

  ctx.font = '14px sans-serif';
  ctx.fillStyle = '#334155';
  ctx.fillText('1. Construction Tradesmen & Masons: 60 Personnel (Basic Wage: AED 1,450/month)', 60, 345);
  ctx.fillText('2. Electricians & Plumbers: 50 Personnel (Basic Wage: AED 1,600/month)', 60, 375);
  ctx.fillText('3. Heavy Equipment Operators: 40 Personnel (Basic Wage: AED 1,850/month)', 60, 405);

  ctx.fillText('Statutory Terms: All wages equal or exceed MEA Minimum Referral Wage (MRW).', 45, 450);
  ctx.fillText('Accommodation, medical cover, and round-trip economy flights provided free of cost.', 45, 480);
  ctx.fillText('Passports shall remain strictly in custody of the employee in compliance with Indian law.', 45, 510);

  // Signatory
  ctx.font = 'bold 14px sans-serif';
  ctx.fillStyle = '#0f172a';
  ctx.fillText(`Authorized Corporate Signatory: ${signatoryName}`, 45, 580);
  ctx.fillText('Company Stamp: [Attested by Chamber of Commerce]', 520, 580);

  const dataUrl = canvas.toDataURL('image/png');
  const blobBin = atob(dataUrl.split(',')[1]);
  const array: number[] = [];
  for (let i = 0; i < blobBin.length; i++) array.push(blobBin.charCodeAt(i));
  return new File([new Uint8Array(array)], `demand_letter_quota_${demandQuota}.png`, {
    type: 'image/png',
  });
}

/**
 * Generate sample Bank Guarantee Bond image for Recruiting Agent
 */
export function generateSampleBankGuaranteeImage(
  agencyName = 'Hindustan Overseas Human Resources Pvt Ltd',
  bankName = 'State Bank of India',
  panNumber = 'AAACH9012K',
  amountLakhs = 50,
  isDeficient = false
): File {
  const canvas = document.createElement('canvas');
  canvas.width = 900;
  canvas.height = 700;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#0c2340';
  ctx.lineWidth = 4;
  ctx.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);

  // Bank Header
  ctx.fillStyle = '#0c2340';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText(bankName.toUpperCase(), 240, 60);

  ctx.font = 'bold 16px sans-serif';
  ctx.fillStyle = '#1e3a8a';
  ctx.fillText('IRREVOCABLE BANK GUARANTEE SECURITY DEED', 240, 90);

  ctx.font = '12px sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('Issued under Section 11 of the Emigration Act 1983 & Rule 25 Regulations', 230, 115);

  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(35, 130);
  ctx.lineTo(865, 130);
  ctx.stroke();

  // Guarantee Specifics
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('Beneficiary: The Protector General of Emigrants (PGE), Ministry of External Affairs, New Delhi', 45, 160);

  ctx.font = '14px sans-serif';
  ctx.fillText(`Account Holder / Recruiting Agent: ${agencyName}`, 45, 195);
  ctx.fillText(`Permanent Account Number (PAN): ${panNumber}`, 45, 225);

  // Guarantee Amount (Critical OCR field)
  const displayAmount = isDeficient ? '₹20,00,000 (Twenty Lakhs Only)' : '₹50,00,000 (Fifty Lakhs Only)';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillStyle = isDeficient ? '#991b1b' : '#065f46';
  ctx.fillText(`Bank Guarantee Bond Amount: ${displayAmount}`, 45, 270);

  ctx.font = '14px sans-serif';
  ctx.fillStyle = '#0f172a';
  ctx.fillText(`The bank unconditionally guarantees to pay PGE New Delhi the sum of ${displayAmount}`, 45, 310);
  ctx.fillText('upon receipt of first written demand stating default under the Emigration Act 1983.', 45, 340);
  ctx.fillText('Validity: 5 Years renewable until statutory cancellation by Ministry of External Affairs.', 45, 375);
  ctx.fillText('Claim Period: 6 Months post expiry date of the primary guarantee deed.', 45, 410);

  // Bank Official Stamp
  ctx.strokeStyle = '#1e3a8a';
  ctx.lineWidth = 2;
  ctx.strokeRect(520, 460, 320, 110);
  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText(`${bankName.toUpperCase()} • COMMERCIAL BRANCH`, 535, 490);
  ctx.fillText('STATUTORY GUARANTEE SEAL AFFIXED', 545, 520);
  ctx.fillText('AUTHORISED CHIEF MANAGER SIGNATURE', 540, 550);

  ctx.fillStyle = '#64748b';
  ctx.font = '12px monospace';
  ctx.fillText(`Guarantee Reference No: BG-SBI-2026-EMIG-${amountLakhs}L • Stamp Duty Paid`, 45, 620);

  const dataUrl = canvas.toDataURL('image/png');
  const blobBin = atob(dataUrl.split(',')[1]);
  const array: number[] = [];
  for (let i = 0; i < blobBin.length; i++) array.push(blobBin.charCodeAt(i));
  return new File([new Uint8Array(array)], `bank_guarantee_${amountLakhs}_lakhs.png`, {
    type: 'image/png',
  });
}

/**
 * Generate sample CA Audited Balance Sheet & Solvency Certificate for Recruiting Agent
 */
export function generateSampleCaCertificateImage(
  agencyName = 'Hindustan Overseas Human Resources Pvt Ltd',
  proprietorName = 'Sanjivani K. Deshmukh',
  netWorthLakhs = 75,
  turnoverLakhs = [24, 35, 48, 62, 75]
): File {
  const canvas = document.createElement('canvas');
  canvas.width = 900;
  canvas.height = 700;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#0c2340';
  ctx.lineWidth = 3;
  ctx.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);

  ctx.fillStyle = '#0c2340';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('K. R. MEHTA & ASSOCIATES • CHARTERED ACCOUNTANTS', 180, 60);

  ctx.font = 'bold 15px sans-serif';
  ctx.fillStyle = '#1e3a8a';
  ctx.fillText('STATUTORY AUDITED FINANCIAL SOLVENCY & TURNOVER CERTIFICATE', 150, 90);

  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(35, 110);
  ctx.lineTo(865, 110);
  ctx.stroke();

  ctx.fillStyle = '#0f172a';
  ctx.font = '14px sans-serif';
  ctx.fillText(`To the Protector General of Emigrants (PGE), MEA, New Delhi`, 45, 145);
  ctx.fillText(`Entity Audited: ${agencyName}`, 45, 175);
  ctx.fillText(`Managing Director / Proprietor: ${proprietorName}`, 45, 205);

  ctx.font = 'bold 15px sans-serif';
  ctx.fillStyle = '#0c2340';
  ctx.fillText(`Certified Net Worth: ₹${netWorthLakhs} Lakhs (Solvency Threshold Satisfied)`, 45, 245);

  ctx.font = '14px sans-serif';
  ctx.fillStyle = '#334155';
  ctx.fillText('5-Year Audited Annual Financial Turnovers:', 45, 285);
  ctx.fillText(`• FY 2021-22: ₹${turnoverLakhs[0]} Lakhs`, 65, 315);
  ctx.fillText(`• FY 2022-23: ₹${turnoverLakhs[1]} Lakhs`, 65, 345);
  ctx.fillText(`• FY 2023-24: ₹${turnoverLakhs[2]} Lakhs`, 65, 375);
  ctx.fillText(`• FY 2024-25: ₹${turnoverLakhs[3]} Lakhs`, 65, 405);
  ctx.fillText(`• FY 2025-26: ₹${turnoverLakhs[4]} Lakhs`, 65, 435);

  ctx.font = 'bold 14px sans-serif';
  ctx.fillStyle = '#065f46';
  ctx.fillText('Audit Conclusion: Positive solvency ratio, liquid assets exceed ₹25 Lakh statutory minimum.', 45, 485);
  ctx.fillText('Rule 25 Maximum Service Fee Ledger: No illegal capitation charges recorded.', 45, 515);

  ctx.font = '13px sans-serif';
  ctx.fillStyle = '#0f172a';
  ctx.fillText('Chartered Accountant Membership No: ICAI-099412', 45, 580);
  ctx.fillText('Unique Document Identification Number (UDIN): 26099412BKLL9921', 45, 610);

  const dataUrl = canvas.toDataURL('image/png');
  const blobBin = atob(dataUrl.split(',')[1]);
  const array: number[] = [];
  for (let i = 0; i < blobBin.length; i++) array.push(blobBin.charCodeAt(i));
  return new File([new Uint8Array(array)], `ca_solvency_certificate_${netWorthLakhs}l.png`, {
    type: 'image/png',
  });
}
