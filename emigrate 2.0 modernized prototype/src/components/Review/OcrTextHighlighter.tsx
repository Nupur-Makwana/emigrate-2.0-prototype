import React, { useState } from 'react';
import { Search, Sparkles, FileText, Check, AlertTriangle, Copy } from 'lucide-react';

interface OcrTextHighlighterProps {
  rawText: string;
  documentTitle: string;
  confidence?: number;
  passportNo?: string;
  salary?: number;
  currency?: string;
  workerName?: string;
}

export const OcrTextHighlighter: React.FC<OcrTextHighlighterProps> = ({
  rawText,
  documentTitle,
  confidence = 92,
  passportNo,
  salary,
  currency = 'AED',
  workerName,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [copied, setCopied] = useState(false);

  // Collect keywords to highlight
  const keywords: string[] = [
    'PASSPORT',
    'REPUBLIC OF INDIA',
    'CONTRACT',
    'SALARY',
    'WAGE',
    'MONTHLY',
    'REMUNERATION',
    'MRW',
    'ECR',
    'ECNR',
    'PBBY',
    'INSURANCE',
    'EMPLOYER',
    'EMPLOYEE',
    'WORKING HOURS',
    'ACCOMMODATION',
    'SIGNATURE',
  ];

  if (passportNo) keywords.push(passportNo.trim());
  if (salary) {
    keywords.push(salary.toString());
    keywords.push(salary.toLocaleString());
  }
  if (currency) keywords.push(currency.trim());
  if (workerName) {
    workerName.split(' ').forEach((part) => {
      if (part.length > 2) keywords.push(part);
    });
  }
  if (filterQuery.trim()) {
    keywords.push(filterQuery.trim());
  }

  // Regex for highlighting Indian Passport format [A-Z][0-9]{7}
  const passportRegex = /\b([A-Z][0-9]{7})\b/g;

  // Function to render highlighted text
  const renderHighlightedContent = () => {
    if (!rawText) {
      return (
        <div className="p-4 text-center text-slate-400 italic">
          No raw OCR text available for this document.
        </div>
      );
    }

    const lines = rawText.split('\n');

    // Build unique escape regex for keywords
    const escapedKeywords = Array.from(new Set(keywords))
      .filter((k) => k && k.length >= 2)
      .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    // Combined regex for keywords and passport patterns
    const combinedRegex = new RegExp(
      `(\\b(?:${escapedKeywords.join('|')})\\b|[A-Z][0-9]{7}|(?:AED|SAR|QAR|KWD|OMR|BHD|INR)\\s*\\d+(?:,\\d+)*)`,
      'gi'
    );

    return lines.map((line, lineIdx) => {
      if (!line.trim()) return <div key={lineIdx} className="h-3" />;

      // Split line by matching keywords
      const parts = line.split(combinedRegex);

      return (
        <div key={lineIdx} className="flex hover:bg-slate-800/40 px-2 py-0.5 rounded leading-relaxed font-mono text-[11px]">
          <span className="w-8 text-slate-500 select-none text-right pr-3 text-[10px]">
            {lineIdx + 1}
          </span>
          <span className="flex-1 text-slate-200">
            {parts.map((part, partIdx) => {
              if (combinedRegex.test(part)) {
                // Determine highlight style based on keyword type
                const isPassport = passportNo && part.toUpperCase().includes(passportNo.toUpperCase());
                const isSalary = salary && part.includes(salary.toString());

                return (
                  <mark
                    key={partIdx}
                    className={`px-1 py-0.2 rounded font-bold transition ${
                      isPassport
                        ? 'bg-emerald-400 text-slate-950 ring-1 ring-emerald-300'
                        : isSalary
                        ? 'bg-amber-400 text-slate-950 ring-1 ring-amber-300'
                        : 'bg-yellow-300 text-slate-950'
                    }`}
                  >
                    {part}
                  </mark>
                );
              }
              return <span key={partIdx}>{part}</span>;
            })}
          </span>
        </div>
      );
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-950 text-slate-100 rounded-xl border border-slate-800 overflow-hidden shadow-lg animate-in fade-in">
      {/* Top Console Bar */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-xs text-white">
            Raw OCR Text Extraction: <span className="text-amber-300">{documentTitle}</span>
          </span>
          <span
            className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
              confidence >= 80
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                : confidence >= 60
                ? 'bg-amber-950 text-amber-400 border border-amber-800'
                : 'bg-red-950 text-red-400 border border-red-800 animate-pulse'
            }`}
          >
            {confidence}% Confidence {confidence < 60 ? '[BLURRY/FLAGGED]' : '[OK]'}
          </span>
        </div>

        {/* Filter Input & Copy Button */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Highlight keyword..."
              className="pl-7 pr-2 py-1 text-[11px] bg-slate-800 border border-slate-700 rounded text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 w-36"
            />
            <Search className="w-3 h-3 text-slate-400 absolute left-2 top-2" />
          </div>

          <button
            onClick={handleCopy}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 rounded border border-slate-700 transition flex items-center gap-1"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>
        </div>
      </div>

      {/* Highlights Legend Strip */}
      <div className="px-3 py-1.5 bg-slate-900/60 border-b border-slate-800/80 flex items-center gap-3 text-[10px] text-slate-400 flex-wrap">
        <span className="font-semibold text-slate-500 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" /> Critical Keywords Highlighted:
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-emerald-400 inline-block" /> Passport Match
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-amber-400 inline-block" /> Wage & Currency
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-yellow-300 inline-block" /> Contract Terms
        </span>
        <span className="text-slate-500 ml-auto font-mono">
          {rawText.length} characters • {rawText.split('\n').length} lines
        </span>
      </div>

      {/* Scrollable OCR Text View */}
      <div className="p-3 max-h-72 overflow-y-auto space-y-0.5 select-text bg-black/40">
        {renderHighlightedContent()}
      </div>
    </div>
  );
};
