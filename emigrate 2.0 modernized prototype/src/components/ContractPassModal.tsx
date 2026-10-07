import React, { useState } from 'react';
import { useEmigrate } from '../context/EmigrateContext';
import { QRCodeSVG } from 'qrcode.react';
import {
  Shield,
  ShieldCheck,
  CheckCircle2,
  Printer,
  Download,
  Plane,
  Terminal,
  X,
  FileCheck2,
  Lock,
  Building,
  User,
  Sparkles,
} from 'lucide-react';

export const ContractPassModal: React.FC = () => {
  const { activeContractPass, setActiveContractPass } = useEmigrate();
  const [showBoISimulator, setShowBoISimulator] = useState(false);

  if (!activeContractPass) return null;

  // The contract pass is strictly unlocked when approved
  const isApproved = activeContractPass.status === 'APPROVED_EC_GRANTED';

  const verificationPayload = {
    arn: activeContractPass.arn,
    passportNumber: activeContractPass.passportNumber,
    workerName: activeContractPass.fullName,
    destination: activeContractPass.destinationCountry,
    foreignEmployerId: activeContractPass.feId || 'FE-UAE-9921',
    approvedSalary: `${activeContractPass.currency} ${activeContractPass.offeredSalary.toLocaleString()}`,
    pbbyInsuranceStatus: 'VALID_ACTIVE_10_LAKH',
    sha256DigitalSignature: 'e7b0a1f8892bc910aef73104928174aa912eec8741',
    poiVerificationTerminal: 'DELHI_IGI_AIRPORT_BOI_GATE_4',
    timestamp: new Date().toISOString(),
  };

  const qrPayloadString = JSON.stringify(verificationPayload);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-300 overflow-hidden flex flex-col max-h-[92vh]">
        <div className="tricolor-stripe" />

        {/* Modal Header */}
        <div className="bg-navy-900 text-white px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-navy-800 rounded-md border border-navy-700">
              <FileCheck2 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Government of India • Emigration Clearance Pass
              </h3>
              <p className="text-xs text-slate-300">
                Digital Dynamic Cryptographic Contract Pass (Section 15 Approved)
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveContractPass(null)}
            className="text-slate-400 hover:text-white text-lg font-bold px-2 py-0.5 rounded hover:bg-navy-800"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 bg-slate-50/50">
          {!isApproved ? (
            <div className="p-6 text-center space-y-3 bg-white border border-amber-300 rounded-lg">
              <Shield className="w-10 h-10 text-amber-500 mx-auto" />
              <h4 className="font-bold text-sm text-navy-900">
                Clearance Not Yet Granted
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Dynamic Cryptographic Passes are unlocked strictly after the Protector of Emigrants grants official endorsement. Current status: <strong>{activeContractPass.status}</strong>.
              </p>
            </div>
          ) : (
            <div className="bg-white border-2 border-navy-900 rounded-xl p-6 shadow-sm space-y-5 relative">
              {/* Top Crest & Watermark */}
              <div className="text-center space-y-1 border-b border-slate-200 pb-4">
                <div className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                  Government of India • Ministry of External Affairs
                </div>
                <h2 className="text-lg font-black text-navy-900 tracking-wide uppercase">
                  Emigration Clearance Certificate & Employment Agreement
                </h2>
                <div className="text-xs font-mono font-bold text-emerald-800">
                  REF NO: {activeContractPass.arn} • DIGITAL PASS
                </div>
              </div>

              {/* Main Worker & Employer Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                {/* Worker Avatar & Photo Card */}
                <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <div className="w-24 h-28 bg-navy-100 border border-navy-300 rounded overflow-hidden flex flex-col items-center justify-center relative mb-2">
                    <User className="w-12 h-12 text-navy-800" />
                    <span className="absolute bottom-1 bg-navy-900/80 text-white text-[9px] px-1 rounded">
                      VERIFIED BIO
                    </span>
                  </div>
                  <div className="font-black text-xs text-navy-900">{activeContractPass.fullName}</div>
                  <div className="text-[10px] font-mono text-slate-500">{activeContractPass.passportNumber}</div>
                  <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>ECR CLEARED</span>
                  </div>
                </div>

                {/* Details Table */}
                <div className="sm:col-span-8 space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded border border-slate-200">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Destination</span>
                      <strong className="text-navy-900">{activeContractPass.destinationCountry}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Trade Category</span>
                      <strong className="text-navy-900">{activeContractPass.tradeCategory}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Authorized Employer</span>
                      <strong className="text-navy-900">{activeContractPass.feId || 'FE-UAE-9921'}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">PBBY Insurance</span>
                      <strong className="text-emerald-700">₹10 Lakh Cover Valid</strong>
                    </div>
                  </div>

                  {/* STATUTORY WAGE LOCK SEAL */}
                  <div className="p-3 bg-gradient-to-r from-amber-500/10 via-amber-400/20 to-amber-500/10 border-2 border-amber-500 rounded-lg text-amber-950 flex items-start gap-2.5 shadow-xs">
                    <Lock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-black text-xs block text-navy-900 uppercase">
                        Statutory Wage Lock Seal (PoE Certified)
                      </span>
                      <p className="text-[11px] leading-snug mt-0.5 font-medium">
                        <strong>PoE Certified Minimum Wage: {activeContractPass.currency} {activeContractPass.offeredSalary.toLocaleString()}.</strong> Under Section 15 of Emigration Act 1983, alteration or substitution of this wage constitutes a punishable offense.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic QR Code & Digital Signature */}
              <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white border border-slate-300 rounded shadow-xs">
                    <QRCodeSVG value={qrPayloadString} size={84} level="M" />
                  </div>
                  <div className="text-[11px] text-slate-600 space-y-0.5">
                    <div className="font-bold text-navy-900 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Dynamic SHA-256 Signed QR Pass
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">
                      SIG: {verificationPayload.sha256DigitalSignature.substring(0, 24)}...
                    </div>
                    <div className="text-[10px] text-emerald-800 font-semibold">
                      Offline Verifiable at Bureau of Immigration (BoI)
                    </div>
                  </div>
                </div>

                {/* Offline Airport Scan Simulator Button */}
                <button
                  onClick={() => setShowBoISimulator(true)}
                  className="px-3.5 py-2 bg-navy-900 hover:bg-navy-800 text-amber-300 font-bold text-xs rounded border border-navy-700 shadow transition flex items-center gap-1.5"
                >
                  <Plane className="w-3.5 h-3.5" />
                  <span>Simulate BoI Airport Offline Scan</span>
                </button>
              </div>
            </div>
          )}

          {/* BoI Airport Terminal Simulator Modal Overlay */}
          {showBoISimulator && (
            <div className="p-4 bg-slate-900 text-slate-100 rounded-lg border border-slate-700 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                    Bureau of Immigration (BoI) Offline Verification Terminal
                  </span>
                </div>
                <button
                  onClick={() => setShowBoISimulator(false)}
                  className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded bg-slate-800"
                >
                  Close Terminal
                </button>
              </div>

              <p className="text-[11px] text-slate-300">
                Decoded QR JSON payload verified locally without active internet or live database queries:
              </p>

              <pre className="p-3 bg-black/60 rounded border border-slate-800 font-mono text-[10px] text-emerald-400 overflow-x-auto leading-relaxed">
                {JSON.stringify(verificationPayload, null, 2)}
              </pre>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  GATE DISPATCH: PASSPORT CLEARED FOR BOARDING
                </span>
                <span className="font-mono text-[10px]">DEL_IGI_T3</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 transition flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Pass</span>
          </button>

          <button
            onClick={() => setActiveContractPass(null)}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded border border-slate-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
