# eMigrate 2.0 Modernization Portal (Prototype)

A front-end prototype of a digital portal for **emigration clearance** under the Ministry of External Affairs (MEA), Government of India. It shows how Indian workers, foreign employers, recruiting agents and government officers could handle emigration clearance online, with automatic checks on wages, insurance and documents.

> **Prototype only.** There is no backend, no database and **no API keys**. All data is sample data kept in your browser (`localStorage`). Do not upload real passports or contracts to a public demo.

---

## Features

**For applicants and businesses**
- Emigration clearance application for workers (multi-step form)
- Foreign Employer (FE) registration
- Recruiting Agent (RA) registration
- Project Exporter registration
- Track an application by ARN
- Minimum Referral Wage (MRW) lookup by country and job
- Verify a recruiting agent's licence
- Welfare schemes, resources, directory and MEA alerts
- **eMigrate Mitra**: a help chatbot with quick answers and support tickets (rule-based, not AI)
- Language, dark mode and font-size controls, plus a guided first-visit tutorial

**For officers (demo logins)**
- **POE**: Protector of Emigrants dashboard, reviews and endorses applications
- **PGE**: Protector General of Emigrants dashboard, higher-level review
- **Mission**: Indian Mission dashboard, reviews employer and agent registrations

**Document checking (OCR)**
- Upload a passport scan, contract and photo as PNG, JPG or PDF (up to 3 pages)
- Text is read **in your browser** with Tesseract.js (images) and PDF.js (PDF pages)
- The passport number is compared with the form, and the contract salary with the statutory MRW
- Low-confidence or blurry scans are flagged for manual review
- Employer and agent documents (trade licence, demand letter, PAN, bank guarantee) are read the same way
- "Sample document" buttons generate test scans so you can try it without real files

**Automatic triage**
- Each application gets an AI-style score from simple rules: wage compliance, PBBY insurance status, passport match and scan legibility. It is a formula, not a machine-learning model.

---

## Languages and technologies

| Technology | Used for |
|---|---|
| **TypeScript** (`.ts`, `.tsx`) | All application code, with types for applications, employers, agents and tickets |
| **React 19** | Building the interface from reusable components |
| **Vite 8** | Development server and production build |
| **Tailwind CSS 4** | Styling (plus a small amount of custom CSS in `src/index.css`) |
| **HTML / CSS / JSON** | Page shell (`index.html`), styles, and config files |
| **Tesseract.js** | OCR in the browser |
| **PDF.js (`pdfjs-dist`)** | Rendering PDF pages so they can be read by OCR |
| **qrcode.react** | QR codes on contract passes and certificates |
| **lucide-react** | Icons |

---

## Project structure

```
src/
  App.tsx                 Switches between screens
  main.tsx                App entry point
  index.css               Tailwind, navy colour palette, animations
  types/emigrate.ts       Data types
  data/seedData.ts        Sample data (wages, agents, schemes, alerts, directory)
  context/                Global state (applications, login, tickets, settings)
  services/
    ocrService.ts         OCR, PDF reading, field extraction, text highlighting
    sampleDocs.ts         Generates sample test scans on a canvas
  utils/
    pdfWorker.ts          Shared PDF.js worker setup
    ocrPipeline.ts        Alternative OCR pipeline (not currently used)
  components/             Forms, dashboards, modals, certificates, review screens
```

---

## Run on your laptop

https://emigrate-20-modernize-prototype.vercel.app/

## Limitations

- No backend: data lives only in the browser and clears if browser data is cleared.
- OCR accuracy depends on scan quality. Results are decision support, not proof. If a contract salary cannot be read, the form falls back to the salary typed in.
- QR codes carry plain data and are not digitally signed.
- Logins are demo-only and the chatbot is keyword-based.
- Uploaded document previews are not saved after a page reload.

---

## Possible next steps

A real backend and database, real authentication, digitally signed QR codes, server-side document storage with encryption, and integration with official passport and insurance verification services.
