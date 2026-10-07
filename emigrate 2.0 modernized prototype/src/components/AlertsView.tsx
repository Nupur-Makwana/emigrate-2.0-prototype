import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { MEA_ADVISORIES } from '../data/seedData';

export const AlertsView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
          Protector General of Emigrants (PGE)
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-navy-900 mt-1">
          Active MEA Public Advisories & Statutory Warnings
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Official statutory notifications issued under the Emigration Act 1983 for the protection of overseas Indian workers.
        </p>
      </div>

      <div className="space-y-4">
        {MEA_ADVISORIES.map((adv, idx) => (
          <div
            key={idx}
            className="p-4 bg-white border-l-4 border-amber-500 rounded-r-lg shadow-xs border border-slate-200 space-y-1.5"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-navy-900">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Sovereign Advisory Circular #{idx + 101}/2026/MEA-OE</span>
              <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-mono">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {adv}
            </p>
          </div>
        ))}

        {/* Detailed Fraudulent Scam Warning Card */}
        <div className="p-5 bg-rose-50 border border-rose-200 rounded-lg space-y-3">
          <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>CRITICAL WARNING: Cyber Scam Compounds in South-East Asia</span>
          </div>
          <p className="text-xs text-rose-950 leading-relaxed">
            The Ministry of External Affairs advises Indian nationals to exercise extreme caution when responding to overseas job advertisements for "Digital Marketing Executive", "Data Entry Operator", or "Customer Support" in Cambodia, Myanmar, and Laos. Fraudulent syndicates lure Indian youth on tourist visas and force them into illicit cyber crime centers.
          </p>
          <div className="text-xs font-bold text-rose-900">
            Rule: Always insist on verified eMigrate 2.0 clearance and an employment visa before traveling.
          </div>
        </div>
      </div>
    </div>
  );
};
