import React, { useState } from 'react';
import { useEmigrate } from '../context/EmigrateContext';
import { EmigrantApplication, RARegistration } from '../types/emigrate';
import { StandardApplicationReview } from './Review/StandardApplicationReview';
import { RecruitingAgentReviewModal } from './Review/RecruitingAgentReviewModal';
import {
  Award,
  ShieldCheck,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  Building2,
  Check,
} from 'lucide-react';

export const PgeDashboard: React.FC = () => {
  const {
    emigrants,
    recruitingAgents,
    setActiveContractPass,
    setActiveRaCertificate,
  } = useEmigrate();

  const [activeTab, setActiveTab] = useState<'forwarded' | 'all' | 'ra_licenses'>('forwarded');
  const [selectedApp, setSelectedApp] = useState<EmigrantApplication | null>(null);
  const [selectedRA, setSelectedRA] = useState<RARegistration | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Applications forwarded by POE
  const forwardedApps = emigrants.filter(
    (app) => app.status === 'PENDING_PGE_APPROVAL' || app.status === 'FLAGGED_PGE_REVIEW'
  );

  const filteredApps = (activeTab === 'forwarded' ? forwardedApps : emigrants).filter((app) => {
    return (
      app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.arn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.passportNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.destinationCountry.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getStatusBadge = (status: EmigrantApplication['status']) => {
    switch (status) {
      case 'APPROVED_EC_GRANTED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> EC Granted (PGE Endorsed)
          </span>
        );
      case 'PENDING_PGE_APPROVAL':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded border border-blue-300 animate-pulse">
            <Clock className="w-3 h-3 text-blue-700" /> Forwarded from PoE
          </span>
        );
      case 'PENDING_POE':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
            <Clock className="w-3 h-3 text-amber-600" /> Frontline PoE Desk
          </span>
        );
      case 'FLAGGED_INCORRECT':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded border border-rose-300">
            <AlertTriangle className="w-3 h-3 text-rose-600" /> Deficiencies Flagged
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded border border-red-300">
            <XCircle className="w-3 h-3 text-red-600" /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* PGE Higher Officer Executive Strip */}
      <div className="bg-navy-900 text-white p-5 rounded-xl border border-navy-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center">
            <Award className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>Higher Officer Approval Wing • Ministry of External Affairs</span>
              <span className="bg-amber-400 text-navy-900 px-1.5 py-0.2 rounded font-black text-[9px]">
                FINAL AUTHORITY
              </span>
            </div>
            <h1 className="text-xl font-black text-white">
              Protector General of Emigrants (PGE) Executive Desk
            </h1>
            <p className="text-xs text-slate-300">
              Sovereign Emigration Clearance (EC) Grant Authority & Appellate Determination
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-slate-200">Forwarded by PoE</div>
            <div className="text-xl font-mono font-black text-amber-400">
              {forwardedApps.length} Ready for EC Grant
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-lg px-4 pt-2 gap-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('forwarded')}
          className={`py-2.5 px-4 border-b-2 flex items-center gap-2 transition ${
            activeTab === 'forwarded'
              ? 'border-navy-900 text-navy-900 bg-slate-50 rounded-t'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4 text-blue-600" />
          <span>Forwarded from PoE (Action Required)</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-full bg-blue-700 text-white text-[10px]">
            {forwardedApps.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`py-2.5 px-4 border-b-2 flex items-center gap-2 transition ${
            activeTab === 'all'
              ? 'border-navy-900 text-navy-900 bg-slate-50 rounded-t'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>All Sovereign Emigrant Files</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px]">
            {emigrants.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('ra_licenses')}
          className={`py-2.5 px-4 border-b-2 flex items-center gap-2 transition ${
            activeTab === 'ra_licenses'
              ? 'border-navy-900 text-navy-900 bg-slate-50 rounded-t'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Recruiting Agent Licensing Approvals</span>
        </button>
      </div>

      {/* Applications Table View */}
      {activeTab !== 'ra_licenses' ? (
        <div className="bg-white rounded-b-xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ARN, applicant name, passport..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-navy-900 focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
            </div>

            <div className="text-xs text-slate-600 font-medium">
              Higher Officer SLA: <strong className="text-navy-900">48-Hour Statutory Turnaround</strong>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse gov-table">
              <thead>
                <tr>
                  <th>ARN & Date</th>
                  <th>Applicant Name & Passport</th>
                  <th>Destination & Trade</th>
                  <th>Offered Wage</th>
                  <th>PoE Officer Finding</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.length > 0 ? (
                  filteredApps.map((app) => (
                    <tr key={app.arn} className="hover:bg-slate-50 transition">
                      <td>
                        <div className="font-mono font-bold text-navy-900">{app.arn}</div>
                        <div className="text-[11px] text-slate-500">{app.submissionDate}</div>
                      </td>
                      <td>
                        <div className="font-bold text-slate-900">{app.fullName}</div>
                        <div className="text-[11px] font-mono text-slate-600">
                          {app.passportNumber} ({app.ecrStatus})
                        </div>
                      </td>
                      <td>
                        <div className="font-semibold text-slate-800">{app.destinationCountry}</div>
                        <div className="text-[11px] text-slate-500">{app.tradeCategory}</div>
                      </td>
                      <td>
                        <div className="font-bold text-navy-900 font-mono">
                          {app.currency} {app.offeredSalary.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-emerald-700 font-semibold">
                          {app.aiTelemetry.wageCompliant ? '✓ Above MRW' : '⚠ Below MRW'}
                        </div>
                      </td>
                      <td className="max-w-xs">
                        {app.poeForwardRemarks ? (
                          <div className="text-[11px] text-slate-700 line-clamp-2 bg-blue-50/60 p-1 rounded border border-blue-100">
                            <span className="font-bold text-blue-900">PoE:</span> {app.poeForwardRemarks}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Direct Submission</span>
                        )}
                      </td>
                      <td>{getStatusBadge(app.status)}</td>
                      <td className="text-right">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="px-3.5 py-1 bg-navy-900 hover:bg-navy-800 text-amber-300 rounded text-xs font-bold transition inline-flex items-center gap-1.5 shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Conduct Final Scrutiny</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-500 text-xs">
                      No applications currently in queue matching your filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* RA Licensing Scrutiny & PGE Grant of Registration */
        <div className="bg-white rounded-b-xl shadow-xs border border-slate-200 overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-bold text-base text-navy-900">
                PGE Section 11 Recruiting Agent Licensure Register
              </h3>
              <p className="text-xs text-slate-500">
                Final approval and issuance of Certificate of Registration (RC) for Indian Manpower Agencies
              </p>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-300">
              ₹50 Lakh Sovereign Security Bond Gate
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recruitingAgents.map((ra) => (
              <div
                key={ra.raId}
                className="p-5 border border-slate-200 rounded-lg bg-slate-50/60 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-navy-900">{ra.agencyName}</h4>
                    <span className="font-mono text-xs font-bold text-navy-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {ra.raId}
                    </span>
                  </div>
                  {ra.status === 'APPROVED' ? (
                    <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                      PGE Licensed Active
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-100 text-amber-800 rounded-full border border-amber-300">
                      Pending Scrutiny
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <div><strong>Managing Director:</strong> {ra.proprietorName}</div>
                  <div><strong>Registered Office:</strong> {ra.rocAddress}</div>
                  <div><strong>Primary Bank:</strong> {ra.bankName}</div>
                  <div><strong>Net Worth:</strong> ₹{ra.netWorthLakhs} Lakhs • <strong>Solvency:</strong> Verified</div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Guarantee Verified
                  </span>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => setActiveRaCertificate(ra)}
                      className="text-slate-600 hover:text-navy-900 font-semibold text-[11px] underline"
                    >
                      Certificate
                    </button>
                    <button
                      onClick={() => setSelectedRA(ra)}
                      className="px-3 py-1.5 bg-navy-900 hover:bg-navy-800 text-white rounded font-bold text-xs transition inline-flex items-center gap-1.5 shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect & Audit Dossier</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Render Standardized Review Modal when clicked */}
      {selectedApp && (
        <StandardApplicationReview
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          viewerRole="PGE"
        />
      )}

      {/* Render Recruiting Agent Review Modal with PGE permissions */}
      {selectedRA && (
        <RecruitingAgentReviewModal
          ra={selectedRA}
          onClose={() => setSelectedRA(null)}
          viewerRole="PGE"
        />
      )}
    </div>
  );
};
