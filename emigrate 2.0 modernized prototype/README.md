# eMigrate 2.0 Modernization Portal (Prototype)

Front-end prototype of a Digital Public Infrastructure portal for emigration clearance (MEA, Government of India): emigrant / employer / recruiting-agent / project-exporter forms, officer dashboards (POE, PGE, Mission), MRW wage lookup, QR contract passes, the rule-based "eMigrate Mitra" help assistant, and **client-side OCR document pre-validation** (Tesseract.js + PDF.js, runs in the browser).

> Prototype only. Data is kept in the browser's `localStorage`; there is no backend and **no API keys**. Demo logins (POE / PGE / MISSION) are client-side only and must not be used in production. Do not upload real passports/contracts to a public demo.

## Run locally
```
npm install
npm run dev      # http://localhost:3000
npm run build    # production build -> dist/
npm run preview  # serve the production build
npm run lint     # type-check
```
The first OCR run downloads the Tesseract engine and English language data from a public CDN, so an internet connection is needed once per browser.

## Deploy on Vercel
Import the repo; Vite is auto-detected (build `npm run build`, output `dist`). No environment variables needed.
