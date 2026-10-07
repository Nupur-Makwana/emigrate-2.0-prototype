import React from 'react';
import { useEmigrate } from '../../context/EmigrateContext';
import { QRCodeSVG } from 'qrcode.react';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Printer,
  X,
  Building2,
  Lock,
  Sparkles,
} from 'lucide-react';

export const RaCertificateModal: React.FC = () => {
  const { activeRaCertificate, setActiveRaCertificate } = useEmigrate();

  if (!activeRaCertificate) return null;

  const verificationPayload = {
    docType: 'MEA_RA_REGISTRATION_CERTIFICATE',
    raId: activeRaCertificate.raId,
    agencyName: activeRaCertificate.agencyName,
    proprietorName: activeRaCertificate.proprietorName,
    panNumber: activeRaCertificate.panNumber,
    bankGuarantee: 'INR_50_LAKH_ACTIVE',
    rule25Compliant: true,
    licensingAuthority: 'PROTECTOR_GENERAL_OF_EMIGRANTS_NEW_DELHI',
    sha256DigitalSignature: 'b91c44810aeef901237190adff0912187654321',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-300 overflow-hidden flex flex-col max-h-[92vh]">
        <div className="tricolor-stripe" />

        {/* Header */}
        <div className="bg-navy-900 text-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm text-white">
              MEA Recruiting Agent Certificate of Registration (RC)
            </h3>
          </div>
          <button
            onClick={() => setActiveRaCertificate(null)}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Certificate Layout */}
        <div className="p-6 overflow-y-auto space-y-5 bg-slate-50/50">
          <div className="bg-white border-2 border-navy-900 rounded-xl p-6 shadow-sm space-y-4 text-center relative">
            <div className="space-y-1 border-b border-slate-200 pb-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                Government of India • Ministry of External Affairs
              </span>
              <h2 className="text-base sm:text-lg font-black text-navy-900 uppercase">
                Certificate of Registration for Recruiting Agent
              </h2>
              <span className="text-xs font-mono font-bold text-emerald-800">
                Issued Under Section 11 of the Emigration Act, 1983
              </span>
            </div>

            <div className="text-left space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Registration No (RC ID)</span>
                  <strong className="text-navy-900 font-mono text-sm">{activeRaCertificate.raId}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Agency Name</span>
                  <strong className="text-navy-900">{activeRaCertificate.agencyName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Managing Proprietor</span>
                  <strong className="text-navy-900">{activeRaCertificate.proprietorName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">PAN / Tax ID</span>
                  <strong className="text-navy-900 font-mono">{activeRaCertificate.panNumber}</strong>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Registered Office</span>
                  <span className="text-slate-700">{activeRaCertificate.rocAddress}</span>
                </div>
              </div>

              {/* Rule 25 Statutory Seal */}
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-amber-950 flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-[11px]">
                  <strong>Statutory Guarantee Endorsement:</strong> Bank Guarantee of ₹50.00 Lakhs deposited with the Protector General of Emigrants. The holder is bound by Rule 25 maximum service fee ceiling (≤ ₹30,000 + GST).
                </div>
              </div>
            </div>

            {/* QR Code & Signature */}
            <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
              <div className="flex items-center gap-3 text-left">
                <div className="p-1.5 bg-white border border-slate-300 rounded shadow-xs">
                  <QRCodeSVG value={JSON.stringify(verificationPayload)} size={72} level="M" />
                </div>
                <div className="text-[10px] text-slate-500 space-y-0.5">
                  <div className="font-bold text-navy-900">Dynamic QR Certificate Pass</div>
                  <div>Status: PGE Endorsed Valid</div>
                  <div className="text-emerald-700 font-semibold">Offline Verifiable</div>
                </div>
              </div>

              <div className="text-right text-xs">
                <div className="text-[11px] font-bold text-navy-900">Protector General of Emigrants</div>
                <div className="text-[10px] text-slate-500">Ministry of External Affairs, New Delhi</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" /> Print Certificate
          </button>
          <button
            onClick={() => setActiveRaCertificate(null)}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded border border-slate-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
