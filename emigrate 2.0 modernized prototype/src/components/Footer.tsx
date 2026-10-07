import React from 'react';
import { useEmigrate } from '../context/EmigrateContext';
import { Shield, ExternalLink, Globe2, Phone, Mail, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView } = useEmigrate();

  return (
    <footer className="bg-navy-900 text-slate-300 border-t border-navy-800 text-xs">
      {/* Tricolor stripe */}
      <div className="tricolor-stripe" />

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Column 1: MEA Institutional Profile */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white font-extrabold text-sm">
            <div className="w-8 h-8 rounded bg-navy-800 border border-navy-700 flex items-center justify-center font-black text-amber-400">
              eM
            </div>
            <span>eMigrate 2.0 System</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Sovereign Digital Public Infrastructure (DPI) of the Ministry of External Affairs, Government of India, administering the Emigration Act 1983.
          </p>
          <div className="text-[11px] text-amber-400 font-semibold">
            सरल, सुरक्षित प्रवासन • Safe, Orderly, Legal Migration
          </div>
        </div>

        {/* Column 2: Quick Sovereign Portals */}
        <div className="space-y-2">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider">
            Important Portals
          </h4>
          <ul className="space-y-1.5 text-[11px] text-slate-400">
            <li>
              <a href="https://mea.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition flex items-center gap-1">
                <span>Ministry of External Affairs (MEA)</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </li>
            <li>
              <a href="https://madad.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition flex items-center gap-1">
                <span>MADAD Consular Grievances</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </li>
            <li>
              <a href="https://passportindia.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition flex items-center gap-1">
                <span>Passport Seva Portal</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </li>
            <li>
              <a href="https://india.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition flex items-center gap-1">
                <span>National Portal of India</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Citizen Services */}
        <div className="space-y-2">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider">
            Citizen Services
          </h4>
          <ul className="space-y-1.5 text-[11px] text-slate-400">
            <li>
              <button onClick={() => setActiveView('emigrant')} className="hover:text-amber-400 transition text-left">
                Apply for Emigrant Clearance (ECR)
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView('employer')} className="hover:text-amber-400 transition text-left">
                Foreign Employer Attestation
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView('recruiting-agent')} className="hover:text-amber-400 transition text-left">
                Recruiting Agent Licensing
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView('directory')} className="hover:text-amber-400 transition text-left">
                Protector of Emigrants Directory
              </button>
            </li>
          </ul>
        </div>

        {/* Column 4: PBSK 24x7 Helpline */}
        <div className="space-y-2">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider">
            PBSK 24x7 Helpline
          </h4>
          <div className="text-[11px] text-slate-400 space-y-1">
            <div className="text-amber-400 font-bold text-sm font-mono">
              1800-11-3090 (Toll Free)
            </div>
            <div>International: +91-11-4050-3090</div>
            <div>WhatsApp SOS: +91-8000-123-090</div>
            <div>Email: helpline@mea.gov.in</div>
          </div>
          <div className="pt-2 text-[10px] text-slate-500">
            Akbar Bhawan, Chanakyapuri, New Delhi 110021
          </div>
        </div>
      </div>

      {/* Bottom NIC & Copyright Bar */}
      <div className="bg-navy-950 px-4 py-4 border-t border-navy-800 text-[11px] text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            Website Content Managed by <strong>Ministry of External Affairs, Government of India</strong>. Designed, Developed, and Hosted by <strong>National Informatics Centre (NIC)</strong>.
          </div>
          <div className="flex items-center gap-3 text-slate-400 flex-wrap justify-center">
            <span>Last Updated: 05 Oct 2026</span>
            <span>•</span>
            <span>eMigrate 2.0 (Rel. Sovereign DPI)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
