import React, { useState } from 'react';
import { useEmigrate } from '../context/EmigrateContext';
import { Briefcase, Building2, CheckCircle2, Shield, Upload, FileText } from 'lucide-react';

export const ProjectExporterForm: React.FC = () => {
  const { setActiveView } = useEmigrate();
  const [submitted, setSubmitted] = useState(false);
  const [exporterName, setExporterName] = useState('L&T Hydrocarbon Projects International');
  const [projectTitle, setProjectTitle] = useState('Offshore Gas Compression Facility Turnkey Package');
  const [destinationCountry, setDestinationCountry] = useState('Qatar');
  const [contractValueINR, setContractValueINR] = useState(450); // in Crores
  const [deploymentManpower, setDeploymentManpower] = useState(280);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 animate-in fade-in">
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden text-center p-8 space-y-4">
          <div className="tricolor-stripe" />
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-emerald-700" />
          </div>
          <h2 className="text-xl font-bold text-navy-900">
            Project Exporter Clearance Dossier Lodged
          </h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Your turnkey overseas deployment permit has been submitted under Chapter VI of the Emigration Rules. Reference No: <strong>PE-2026-EXP-4401</strong>.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setActiveView('home')}
              className="px-5 py-2 bg-navy-900 text-white font-bold text-xs rounded hover:bg-navy-800 transition"
            >
              Return to Portal Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          Ministry of External Affairs • Form PE-01
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-navy-900">
          Project Exporter Overseas Deployment Clearance
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          For Indian engineering, construction, and infrastructure companies deploying skilled personnel abroad on turnkey overseas projects.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <div className="tricolor-stripe" />
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Project Exporter Entity Name *
              </label>
              <input
                type="text"
                value={exporterName}
                onChange={(e) => setExporterName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Overseas Project Title *
              </label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Destination Country *
              </label>
              <input
                type="text"
                value={destinationCountry}
                onChange={(e) => setDestinationCountry(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Estimated Contract Value (₹ Crores) *
              </label>
              <input
                type="number"
                value={contractValueINR}
                onChange={(e) => setContractValueINR(Number(e.target.value))}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Total Indian Personnel to be Deployed *
              </label>
              <input
                type="number"
                value={deploymentManpower}
                onChange={(e) => setDeploymentManpower(Number(e.target.value))}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Project Exim Bank Guarantee Ref *
              </label>
              <input
                type="text"
                defaultValue="EXIM-BG-2026-9921"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded font-mono"
              />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded">
            <strong>Mandatory Document:</strong> Exim Bank Project Clearance Certificate and signed Ministry of External Affairs project indemnity bond.
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-navy-900 text-white font-bold rounded hover:bg-navy-800 transition"
            >
              Submit Project Exporter Dossier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
