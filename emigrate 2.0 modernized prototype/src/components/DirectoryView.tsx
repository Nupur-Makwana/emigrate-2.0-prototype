import React, { useState } from 'react';
import { POE_OFFICES } from '../data/seedData';
import { MapPin, Search, Mail, Phone, Building } from 'lucide-react';

export const DirectoryView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = POE_OFFICES.filter(
    (p) =>
      p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.officerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
            Protector General of Emigrants (PGE) Hierarchy
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-navy-900 mt-1">
            Directory of Protector of Emigrants (PoE) Regional Offices
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            10 jurisdictional protectorate offices administering emigration clearances and grievance redressal nationwide.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by city, officer name, or state..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-navy-900 focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((poe) => (
          <div
            key={poe.id}
            className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3 flex flex-col justify-between hover:border-navy-900 transition"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-navy-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {poe.id}
                </span>
                <span className="text-xs text-slate-500 font-semibold">{poe.state}</span>
              </div>
              <h3 className="font-bold text-sm text-navy-900 mt-2">{poe.designation}</h3>
              <div className="text-xs font-semibold text-slate-700">{poe.officerName}</div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {poe.address}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-mono">{poe.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-mono">{poe.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
