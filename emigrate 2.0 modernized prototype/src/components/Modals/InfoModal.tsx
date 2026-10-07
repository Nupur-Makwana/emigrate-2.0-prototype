import React from 'react';
import { Info, HelpCircle, PhoneCall, Shield, FileText, CheckCircle, ExternalLink } from 'lucide-react';

interface InfoModalProps {
  type: string | null;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const renderContent = () => {
    switch (type) {
      case 'about':
        return {
          title: 'About eMigrate 2.0 System',
          subtitle: 'Ministry of External Affairs, Overseas Employment & Protectorate Division',
          icon: Info,
          body: (
            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <p>
                <strong>eMigrate 2.0</strong> is the next-generation sovereign Digital Public Infrastructure (DPI) implemented by the Ministry of External Affairs (MEA), Government of India, pursuant to the <strong>Emigration Act, 1983</strong>.
              </p>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <h4 className="font-bold text-navy-900 mb-1">Core Constitutional Mission</h4>
                <p>
                  To transform overseas migration for Indian citizens into a transparent, safe, orderly, and ethical process, safeguarding vulnerable workers from exploitation, human trafficking, and unauthorized sub-agents.
                </p>
              </div>
              <h4 className="font-bold text-navy-900 text-sm">Key Architectural Pillars:</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Automated AI/OCR algorithmic pre-validation of passport bio-pages (MRZ)</li>
                <li>Statutory Minimum Referral Wage (MRW) strict rule enforcement</li>
                <li>Asynchronous real-time underwriting integration with Pravasi Bharatiya Bima Yojana (PBBY)</li>
                <li>Dynamic cryptographic QR contracts replacing easily forged static paper clearances</li>
                <li>Integrated multi-tier officer workflows across 10 PoE protectorates and overseas Indian Missions</li>
              </ul>
            </div>
          ),
        };
      case 'pbsk':
        return {
          title: 'PBSK 24x7 Pravasi Bharatiya Sahayata Kendra',
          subtitle: 'Round-the-Clock Helpline & Grievance Redressal Mechanism',
          icon: PhoneCall,
          body: (
            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <p>
                The <strong>Pravasi Bharatiya Sahayata Kendra (PBSK)</strong> operates 24 hours a day, 365 days a year from New Delhi, offering counseling, emergency rescue assistance, legal aid referrals, and status tracking for overseas Indian workers.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[11px] text-slate-500 uppercase font-bold block">Toll-Free Within India</span>
                  <span className="text-base font-bold text-navy-900 font-mono">1800-11-3090</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[11px] text-slate-500 uppercase font-bold block">International Calling</span>
                  <span className="text-base font-bold text-navy-900 font-mono">+91-11-4050-3090</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[11px] text-slate-500 uppercase font-bold block">WhatsApp SOS Helpline</span>
                  <span className="text-base font-bold text-emerald-700 font-mono">+91-8000-123-090</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[11px] text-slate-500 uppercase font-bold block">Official Email</span>
                  <span className="text-xs font-bold text-blue-700 font-mono">helpline@mea.gov.in</span>
                </div>
              </div>
              <p className="text-slate-500">
                Operates in 11 Indian languages: Hindi, English, Punjabi, Malayalam, Tamil, Telugu, Kannada, Bengali, Odia, Marathi, and Gujarati.
              </p>
            </div>
          ),
        };
      case 'escalation':
        return {
          title: 'MEA Escalation Matrix & Officer Hierarchies',
          subtitle: 'Institutional Grievance Redressal Protocol',
          icon: Shield,
          body: (
            <div className="space-y-3 text-xs text-slate-700">
              <p>
                If an application or dispute remains unaddressed within the stipulated service level agreement (SLA), applicants may escalate along the sovereign hierarchy:
              </p>
              <div className="space-y-2">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <strong className="text-navy-900 block font-bold">Level 1: Jurisdictional Protector of Emigrants (PoE)</strong>
                  <span className="text-slate-500">SLA: 48 Hours • Covers document triage, deficiency notices, and initial endorsement.</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <strong className="text-navy-900 block font-bold">Level 2: Protector General of Emigrants (PGE)</strong>
                  <span className="text-slate-500">SLA: 5 Working Days • Joint Secretary level appellate review for rejected clearances or wage disputes.</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <strong className="text-navy-900 block font-bold">Level 3: Head of Mission / Consular Chief</strong>
                  <span className="text-slate-500">For overseas disputes involving Foreign Employers, accommodation violations, or passport retention.</span>
                </div>
              </div>
            </div>
          ),
        };
      case 'rti':
        return {
          title: 'Right to Information (RTI) Disclosures',
          subtitle: 'Section 4(1)(b) Proactive Disclosures under RTI Act 2005',
          icon: FileText,
          body: (
            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <p>
                In compliance with the Right to Information Act, 2005, the Ministry of External Affairs proactively publishes operational guidelines, recruitment statistics, approved agency rosters, and appellate authorities.
              </p>
              <div className="border border-slate-200 rounded p-3 bg-slate-50 space-y-1.5">
                <div><strong>Central Public Information Officer (CPIO):</strong> Under Secretary (OE-I), MEA, Akbar Bhawan, Chanakyapuri, New Delhi.</div>
                <div><strong>First Appellate Authority:</strong> Director (Overseas Employment), MEA, New Delhi.</div>
                <div><strong>Online RTI Portal:</strong> <span className="text-blue-600 font-mono">rtionline.gov.in</span></div>
              </div>
            </div>
          ),
        };
      case 'jobs':
        return {
          title: 'Verified Overseas Job Opportunities in GCC',
          subtitle: 'Embassy-Attested Foreign Employer Vacancies Only',
          icon: CheckCircle,
          body: (
            <div className="space-y-3 text-xs text-slate-700">
              <p>
                All job vacancies displayed on eMigrate 2.0 originate exclusively from <strong>Foreign Employers attested by the Indian Embassy</strong>. Never apply for overseas jobs advertised through informal messaging groups or unregistered agents.
              </p>
              <div className="space-y-2">
                <div className="p-3 border border-slate-200 rounded hover:border-slate-300">
                  <div className="flex justify-between font-bold text-navy-900">
                    <span>Electricians & Instrument Techs (50 Vacancies)</span>
                    <span className="text-emerald-700">AED 1,800 + Free Accomm.</span>
                  </div>
                  <div className="text-slate-500 mt-0.5">Employer: Al-Habtoor LLC, Dubai • Attestation: CGI-DXB-9921</div>
                </div>
                <div className="p-3 border border-slate-200 rounded hover:border-slate-300">
                  <div className="flex justify-between font-bold text-navy-900">
                    <span>Heavy Vehicle Trailor Drivers (35 Vacancies)</span>
                    <span className="text-emerald-700">SAR 1,850 + Food Allowance</span>
                  </div>
                  <div className="text-slate-500 mt-0.5">Employer: Saudi Logistics Corp, Riyadh • Attestation: EOI-RUH-4412</div>
                </div>
                <div className="p-3 border border-slate-200 rounded hover:border-slate-300">
                  <div className="flex justify-between font-bold text-navy-900">
                    <span>Staff Nurses - Critical Care (20 Vacancies)</span>
                    <span className="text-emerald-700">KWD 320 + Housing</span>
                  </div>
                  <div className="text-slate-500 mt-0.5">Employer: Ministry of Health, Kuwait • Attestation: EOI-KWT-0021</div>
                </div>
              </div>
            </div>
          ),
        };
      default:
        return {
          title: 'Information & Guidelines',
          subtitle: 'Ministry of External Affairs Official Portal',
          icon: HelpCircle,
          body: <p className="text-xs text-slate-700">Official documentation and statutory guidelines.</p>,
        };
    }
  };

  const content = renderContent();
  const IconComponent = content.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-lg shadow-2xl max-w-xl w-full border border-slate-300 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="tricolor-stripe" />
        <div className="bg-navy-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-navy-800 rounded-md border border-navy-700">
              <IconComponent className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">{content.title}</h3>
              <p className="text-xs text-slate-300">{content.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-bold px-2 py-0.5 rounded hover:bg-navy-800"
          >
            ✕
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">{content.body}</div>
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded border border-slate-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
