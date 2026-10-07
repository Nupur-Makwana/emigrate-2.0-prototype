import React from 'react';
import { ShieldCheck, HeartHandshake, BookOpen, Building, CheckCircle2 } from 'lucide-react';

export const WelfareSchemesView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
          Diaspora Welfare & Social Security
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-navy-900 mt-1">
          Statutory Welfare Schemes for Indian Emigrants
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Comprehensive social security net established by the Ministry of External Affairs for blue-collar overseas workers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* PBBY */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-navy-900 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-navy-900" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-navy-900">
                Pravasi Bharatiya Bima Yojana (PBBY)
              </h3>
              <span className="text-[11px] text-emerald-700 font-bold">Mandatory ₹10 Lakh Cover</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Covers accidental death, permanent total disability, medical treatment abroad, and repatriation of mortal remains. Policy premium is nominal (approx. ₹275 to ₹375 for 2 to 3 years).
          </p>
        </div>

        {/* MADAD */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg">
              <HeartHandshake className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-navy-900">
                MADAD Consular Redressal System
              </h3>
              <span className="text-[11px] text-blue-700 font-bold">Online MEA Grievance Portal</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Direct tracking of grievances registered with Indian Embassies regarding wage arrears, passport confiscation, physical harassment, or employer disputes.
          </p>
        </div>

        {/* PDOT */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 text-amber-800 rounded-lg">
              <BookOpen className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-navy-900">
                Pre-Departure Orientation Training (PDOT)
              </h3>
              <span className="text-[11px] text-amber-800 font-bold">Skill India MEA Program</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Cultural orientation, language basics, understanding labor contracts, emergency SOS mechanisms, and legal awareness prior to airport departure.
          </p>
        </div>

        {/* ICWF */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-50 text-purple-800 rounded-lg">
              <Building className="w-6 h-6 text-purple-700" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-navy-900">
                Indian Community Welfare Fund (ICWF)
              </h3>
              <span className="text-[11px] text-purple-700 font-bold">Mission On-Site Emergency Fund</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Provides boarding, lodging, emergency medical treatment, legal aid for stranded workers, and air passages for distressed workers.
          </p>
        </div>
      </div>
    </div>
  );
};
