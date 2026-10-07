import React, { useState } from 'react';
import { useEmigrate } from '../../context/EmigrateContext';
import { Building2, Search, CheckCircle2, ShieldAlert, Award, AlertTriangle, FileCheck } from 'lucide-react';

interface VerifyRaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VerifyRaModal: React.FC<VerifyRaModalProps> = ({ isOpen, onClose }) => {
  const { recruitingAgents } = useEmigrate();
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredRAs = recruitingAgents.filter(
    (ra) =>
      ra.agencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ra.raId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ra.proprietorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full border border-slate-300 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="tricolor-stripe" />

        {/* Header */}
        <div className="bg-navy-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-navy-800 rounded-md border border-navy-700">
              <Building2 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Verify Registered Recruiting Agent (RA)
              </h3>
              <p className="text-xs text-slate-300">
                Official MEA Register of Authorized Overseas Placement Agencies
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-bold px-2 py-0.5 rounded hover:bg-navy-800"
          >
            ✕
          </button>
        </div>

        {/* Rule 25 Statutory Warning Banner */}
        <div className="bg-rose-50 border-b border-rose-200 p-3.5 text-xs text-rose-900 flex items-start gap-2.5">
          <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">STATUTORY RULE 25 ADVISORY:</strong>
            Under Rule 25 of Emigration Rules, no registered Recruiting Agent may charge service fees exceeding <strong>₹30,000 + GST</strong>. Any agent demanding more or demanding payments in cash without an official GST invoice is committing a cognizable offense.
          </div>
        </div>

        {/* Search */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by RA License No (e.g. RA-DEL-0418) or Agency Name..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-navy-900 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* List of Agents */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {filteredRAs.length > 0 ? (
            filteredRAs.map((ra) => (
              <div
                key={ra.raId}
                className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition bg-white shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-navy-900">{ra.agencyName}</h4>
                      {ra.status === 'APPROVED' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> MEA Licensed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-300">
                          <AlertTriangle className="w-3 h-3 text-amber-600" /> Verification In Progress
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      <span className="font-semibold text-slate-700">License ID:</span>{' '}
                      <span className="font-mono font-bold text-navy-900 bg-slate-100 px-1.5 py-0.5 rounded">
                        {ra.raId}
                      </span>{' '}
                      • <span className="font-semibold text-slate-700">Managing Proprietor:</span> {ra.proprietorName}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      <span className="font-semibold text-slate-600">Registered Address:</span> {ra.rocAddress}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-[11px] text-slate-500 block">Bank Guarantee</span>
                    <span className="text-xs font-bold text-slate-800">₹50 Lakh Deposited</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-blue-600" />
                    PAN: {ra.panNumber} • Bank: {ra.bankName}
                  </span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <FileCheck className="w-3.5 h-3.5" /> Rule 25 Compliant
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No registered agency found with that name/ID.</p>
              <p className="text-xs text-slate-500 mt-1">
                Caution: If an agent claims to be authorized but is not found in this registry, do not pay any money.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded border border-slate-300 transition"
          >
            Close Registry
          </button>
        </div>
      </div>
    </div>
  );
};
