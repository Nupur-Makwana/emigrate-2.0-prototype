import React, { useState } from 'react';
import { MRW_MATRIX, ECR_COUNTRIES } from '../../data/seedData';
import { DollarSign, Search, ShieldCheck, Info } from 'lucide-react';

interface MrwLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MrwLookupModal: React.FC<MrwLookupModalProps> = ({ isOpen, onClose }) => {
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (!isOpen) return null;

  const filteredMRW = MRW_MATRIX.filter((item) => {
    const matchCountry = selectedCountry === 'All' || item.country === selectedCountry;
    const matchTrade = item.trade.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCountry && matchTrade;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full border border-slate-300 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="tricolor-stripe" />

        {/* Header */}
        <div className="bg-navy-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-navy-800 rounded-md border border-navy-700">
              <DollarSign className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Statutory Minimum Referral Wage (MRW) Lookup
              </h3>
              <p className="text-xs text-slate-300">
                Rule-Based Sovereign Wage Baselines for 18 Notified ECR Destinations
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

        {/* Filter Controls */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search trade category (e.g. Mason, Driver, Nurse)..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-navy-900 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="w-full sm:w-64">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white focus:ring-2 focus:ring-navy-900 focus:outline-none"
            >
              <option value="All">All Destination Countries</option>
              {Array.from(new Set(MRW_MATRIX.map((m) => m.country))).map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Statutory Notice */}
        <div className="bg-amber-50 px-6 py-2.5 border-b border-amber-200 flex items-center gap-2 text-xs text-amber-900">
          <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0" />
          <span>
            <strong>Legal Notice:</strong> Under Section 15 of Emigration Act 1983, no Indian worker may be recruited or cleared for a wage lower than the prescribed MRW.
          </span>
        </div>

        {/* Table Content */}
        <div className="overflow-y-auto flex-1 p-6">
          <table className="w-full text-left border-collapse gov-table border border-slate-200">
            <thead>
              <tr>
                <th>Country</th>
                <th>Trade Category</th>
                <th>Minimum Wage (Local)</th>
                <th>Equivalent (INR Approx.)</th>
                <th>Enforcement Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredMRW.length > 0 ? (
                filteredMRW.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="font-semibold text-navy-900">{item.country}</td>
                    <td className="font-medium text-slate-800">{item.trade}</td>
                    <td>
                      <span className="font-bold text-slate-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {item.currency} {item.minimumWageLocal.toLocaleString()}
                      </span>
                    </td>
                    <td className="text-slate-600 font-mono">
                      ₹{item.minimumWageINR.toLocaleString()}
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" /> Statutory Gate
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-slate-500 text-xs">
                    No trade benchmarks found matching your query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <Info className="w-3.5 h-3.5" /> Benchmarks revised periodically by Protector General of Emigrants (PGE)
          </div>
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
