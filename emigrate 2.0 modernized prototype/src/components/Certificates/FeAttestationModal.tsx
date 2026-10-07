import React from 'react';
import { useEmigrate } from '../../context/EmigrateContext';
import { QRCodeSVG } from 'qrcode.react';
import {
  Building2,
  CheckCircle2,
  Printer,
  X,
  ShieldCheck,
  Lock,
} from 'lucide-react';

export const FeAttestationModal: React.FC = () => {
  const { activeFeCertificate, setActiveFeCertificate } = useEmigrate();

  if (!activeFeCertificate) return null;

  const verificationPayload = {
    docType: 'INDIAN_MISSION_FE_ATTESTATION',
    feId: activeFeCertificate.feId,
    businessName: activeFeCertificate.businessName,
    country: activeFeCertificate.country,
    tradeLicenseNo: activeFeCertificate.tradeLicenseNo,
    authorizedQuota: activeFeCertificate.demandQuotaRequested,
    jurisdictionMission: activeFeCertificate.jurisdictionMission,
    attestationStatus: 'CONSULAR_ATTESTED_VALID',
    sha256DigitalSignature: 'c8810afe4490123910abef77123991208912',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-300 overflow-hidden flex flex-col max-h-[92vh]">
        <div className="tricolor-stripe" />

        {/* Header */}
        <div className="bg-navy-900 text-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm text-white">
              Indian Diplomatic Mission • Employer Attestation Certificate
            </h3>
          </div>
          <button
            onClick={() => setActiveFeCertificate(null)}
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
                {activeFeCertificate.jurisdictionMission.toUpperCase()}
              </span>
              <h2 className="text-base sm:text-lg font-black text-navy-900 uppercase">
                Consular Attestation & Demand Quota Authorization
              </h2>
              <span className="text-xs font-mono font-bold text-emerald-800">
                FE-ID: {activeFeCertificate.feId} • Sovereign Emigration Registry
              </span>
            </div>

            <div className="text-left space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Foreign Employer Name</span>
                  <strong className="text-navy-900 text-sm">{activeFeCertificate.businessName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Organization Type</span>
                  <strong className="text-navy-900">{activeFeCertificate.orgType}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Commercial License / CR</span>
                  <strong className="text-navy-900 font-mono">{activeFeCertificate.tradeLicenseNo}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Authorized Quota</span>
                  <strong className="text-emerald-700 font-mono text-sm">
                    {activeFeCertificate.demandQuotaRequested} Indian Workers
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Signatory Person</span>
                  <span className="text-slate-800">{activeFeCertificate.signatoryName} ({activeFeCertificate.signatoryDesignation})</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Host Country</span>
                  <span className="text-slate-800">{activeFeCertificate.country}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-950 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-[11px]">
                  <strong>Consular Attestation Verified:</strong> The Indian Diplomatic Mission has verified the commercial standing, chamber of commerce registration, and accommodation standards. The employer is cleared to recruit Indian personnel through registered RAs or direct eMigrate channels.
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
                  <div className="font-bold text-navy-900">Mission Attestation Pass</div>
                  <div>Status: Embassy Authorized</div>
                  <div className="text-emerald-700 font-semibold">Offline Verifiable</div>
                </div>
              </div>

              <div className="text-right text-xs">
                <div className="text-[11px] font-bold text-navy-900">Consular Officer / Attache (Labour)</div>
                <div className="text-[10px] text-slate-500">{activeFeCertificate.jurisdictionMission}</div>
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
            onClick={() => setActiveFeCertificate(null)}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded border border-slate-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
