import React, { useState } from 'react';
import { useEmigrate } from '../context/EmigrateContext';
import { EmigrantApplication, RARegistration } from '../types/emigrate';
import { StandardApplicationReview } from './Review/StandardApplicationReview';
import { RecruitingAgentReviewModal } from './Review/RecruitingAgentReviewModal';
import {
  Shield,
  FileText,
  Building2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Search,
  Filter,
  Send,
  Sparkles,
  Info,
} from 'lucide-react';

export const PoeDashboard: React.FC = () => {
  const { emigrants, recruitingAgents, setActiveRaCertificate } = useEmigrate();

  const [activeTab, setActiveTab] = useState<'emigrants' | 'ra'>('emigrants');
  const [selectedEmigrant, setSelectedEmigrant] = useState<EmigrantApplication | null>(null);
  const [selectedRA, setSelectedRA] = useState<RARegistration | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Filter Emigrant Applications
  const filteredEmigrants = emigrants.filter((app) => {
    const matchSearch =
      app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.arn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.passportNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.destinationCountry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || app.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getScoreBadge = (score: number) => {
    if (score >= 80) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          High Confidence {score}%
        </span>
      );
    } else if (score >= 60) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
          <Clock className="w-3 h-3 text-amber-600" />
          Medium Review {score}%
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
          <AlertTriangle className="w-3 h-3 text-rose-600" />
          Flagged Discrepancy {score}%
        </span>
      );
    }
  };

  const getStatusBadge = (status: EmigrantApplication['status']) => {
    switch (status) {
      case 'APPROVED_EC_GRANTED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> EC Granted (PGE)
          </span>
        );
      case 'PENDING_PGE_APPROVAL':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-300">
            <Send className="w-3 h-3 text-blue-600" /> Forwarded to PGE
          </span>
        );
      case 'PENDING_POE':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-300 animate-pulse">
            <Clock className="w-3 h-3 text-amber-600" /> Pending PoE Check-in
          </span>
        );
      case 'FLAGGED_INCORRECT':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-300">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Deficiencies Flagged
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-300">
            <XCircle className="w-3 h-3 text-red-600" /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner with Officer Badge */}
      <div className="bg-navy-900 text-white p-5 rounded-xl border border-navy-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center">
            <Shield className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>Point of Entry / First-Tier Verification Desk</span>
              <span className="bg-blue-600 text-white text-[9px] px-1.5 py-0.2 rounded font-bold">
                SCRUTINY & FORWARD ROLE
              </span>
            </div>
            <h1 className="text-xl font-black text-white">
              Protector of Emigrants (PoE) Executive Desk
            </h1>
            <p className="text-xs text-slate-300">
              Jurisdiction: PoE Delhi (Northern Region ECR Verification) • Reviewer Scrutiny & Higher Officer Routing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-slate-200">PoE Active Queue</div>
            <div className="text-xl font-mono font-black text-amber-400">
              {emigrants.filter((e) => e.status === 'PENDING_POE').length} Pending Check-in
            </div>
          </div>
        </div>
      </div>

      {/* Role Reminder Advisory */}
      <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-lg text-xs text-blue-950 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-700 flex-shrink-0" />
          <span>
            <strong>PoE Role Definition:</strong> The PoE officer conducts frontline document & MRW verification and identifies issues. <strong>The PoE officer cannot grant or approve an EC.</strong> Upon satisfactory check-in, forward the dossier to the Higher Officer (PGE) for final statutory grant.
          </span>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-lg px-4 pt-2 gap-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('emigrants')}
          className={`py-2.5 px-4 border-b-2 flex items-center gap-2 transition ${
            activeTab === 'emigrants'
              ? 'border-navy-900 text-navy-900 bg-slate-50 rounded-t'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Emigrant Clearance Applications (ECR Queue)</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-full bg-navy-900 text-white text-[10px]">
            {emigrants.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('ra')}
          className={`py-2.5 px-4 border-b-2 flex items-center gap-2 transition ${
            activeTab === 'ra'
              ? 'border-navy-900 text-navy-900 bg-slate-50 rounded-t'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Recruiting Agent (RA) Scrutiny Queue</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px]">
            {recruitingAgents.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Emigrant Applications Queue */}
      {activeTab === 'emigrants' && (
        <div className="bg-white rounded-b-xl shadow-xs border border-slate-200 overflow-hidden">
          {/* Filters & Search */}
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

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white font-medium focus:ring-2 focus:ring-navy-900 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING_POE">Pending PoE Check-in</option>
                <option value="PENDING_PGE_APPROVAL">Forwarded to Higher Officer</option>
                <option value="APPROVED_EC_GRANTED">Approved & Granted</option>
                <option value="FLAGGED_INCORRECT">Deficiencies Flagged</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse gov-table">
              <thead>
                <tr>
                  <th>ARN & Date</th>
                  <th>Applicant Name & Passport</th>
                  <th>Destination & Trade</th>
                  <th>Offered Wage</th>
                  <th>AI Triage Badge</th>
                  <th>Clearance Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmigrants.map((app) => (
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
                      <div className="text-[10px] text-slate-500">
                        {app.aiTelemetry.wageCompliant ? (
                          <span className="text-emerald-700 font-bold">✓ MRW Compliant</span>
                        ) : (
                          <span className="text-red-600 font-bold">⚠ Below MRW</span>
                        )}
                      </div>
                    </td>
                    <td>{getScoreBadge(app.aiScore)}</td>
                    <td>{getStatusBadge(app.status)}</td>
                    <td className="text-right">
                      <button
                        onClick={() => setSelectedEmigrant(app)}
                        className="px-3.5 py-1.5 bg-navy-900 hover:bg-navy-800 text-white rounded text-xs font-bold transition inline-flex items-center gap-1.5 shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect & Check In</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: RA Scrutiny Queue */}
      {activeTab === 'ra' && (
        <div className="bg-white rounded-b-xl shadow-xs border border-slate-200 overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-bold text-base text-navy-900">
                Recruiting Agent Financial Scrutiny Register
              </h3>
              <p className="text-xs text-slate-500">
                Statutory Bank Guarantee (₹50 Lakh) & Rule 25 Maximum Service Fee Audit
              </p>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-300">
              Rule 25 Ceiling Active: ≤ ₹30,000 + GST
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recruitingAgents.map((ra) => (
              <div
                key={ra.raId}
                className="p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-navy-900">{ra.agencyName}</h4>
                    <span className="font-mono text-xs font-bold text-navy-800 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {ra.raId}
                    </span>
                  </div>
                  {ra.status === 'APPROVED' ? (
                    <span className="px-2 py-0.5 text-[11px] font-bold bg-emerald-100 text-emerald-800 rounded border border-emerald-300">
                      Licensed
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[11px] font-bold bg-amber-100 text-amber-800 rounded border border-amber-300">
                      Pending Scrutiny
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <div><strong>Managing Director:</strong> {ra.proprietorName}</div>
                  <div><strong>PAN:</strong> {ra.panNumber} • <strong>Aadhaar:</strong> {ra.aadhaarNumber}</div>
                  <div><strong>Primary Bank:</strong> {ra.bankName}</div>
                  <div><strong>Declared Net Worth:</strong> ₹{ra.netWorthLakhs} Lakhs</div>
                  <div>
                    <strong>5-Year Audited Turnovers:</strong>{' '}
                    {ra.turnoverFiveYears.map((t, i) => `FY${22 + i}: ₹${t}L`).join(', ')}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>₹50 Lakh Guarantee Deposited</span>
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
                      className="px-3 py-1.5 bg-navy-900 hover:bg-navy-800 text-white rounded text-xs font-bold transition inline-flex items-center gap-1.5 shadow-xs"
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

      {/* Render the Standardized Review Modal with POE permissions */}
      {selectedEmigrant && (
        <StandardApplicationReview
          application={selectedEmigrant}
          onClose={() => setSelectedEmigrant(null)}
          viewerRole="POE"
        />
      )}

      {/* Render Recruiting Agent Scrutiny Modal with POE permissions */}
      {selectedRA && (
        <RecruitingAgentReviewModal
          ra={selectedRA}
          onClose={() => setSelectedRA(null)}
          viewerRole="POE"
        />
      )}
    </div>
  );
};
