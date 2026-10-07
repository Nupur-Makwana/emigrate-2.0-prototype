import React, { useState } from 'react';
import { useEmigrate } from '../context/EmigrateContext';
import { RESOURCES_DATA } from '../data/seedData';
import { ResourceItem } from '../types/emigrate';
import {
  BookOpen,
  Search,
  Filter,
  FileText,
  Download,
  ExternalLink,
  Video,
  CheckSquare,
  ShieldAlert,
  Sparkles,
  Info,
  CheckCircle2,
  Building2,
  User,
  Scale,
  FileCheck,
  ChevronDown,
  ChevronRight,
  Eye,
  Shield,
  Printer,
  X,
  FileBadge2,
} from 'lucide-react';

export const ResourcesView: React.FC = () => {
  const { setActiveView, setTutorialOpen, setPrefilledMitraQuery, setIsMitraOpen } = useEmigrate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [previewDoc, setPreviewDoc] = useState<ResourceItem | null>(null);
  const [downloadSuccessItem, setDownloadSuccessItem] = useState<string | null>(null);

  // Systematic Categories aligned with official MEA eMigrate portals
  const categorySections = [
    {
      id: 'emigrant',
      title: 'Emigrant Resources & Pre-Departure Guides',
      subtitle: 'Mandatory handbooks, PBBY insurance claim forms, model bilingual contracts, and fee notices for overseas workers.',
      icon: User,
      color: 'blue',
      badge: 'Migrant Workers & Families',
    },
    {
      id: 'employer',
      title: 'Foreign Employer (FE) Resources & Attestation Flow',
      subtitle: 'Corporate registration SOPs, job designations mapped to GCC visas, Prior Approval Category (PAC) rosters, and chamber demand formats.',
      icon: Building2,
      color: 'emerald',
      badge: 'Overseas Companies & Sponsors',
    },
    {
      id: 'ra',
      title: 'Recruiting Agent (RA) Manuals & Statutory Compliance',
      subtitle: 'Licensed RA state directories, Form I & II licensing applications, bank guarantee guidelines, monthly returns SOP, and caution notices.',
      icon: CheckSquare,
      color: 'purple',
      badge: 'Licensed Agencies & MDs',
    },
    {
      id: 'acts_orders',
      title: 'Acts, Rules, Orders & Gazetted Circulars',
      subtitle: 'The Emigration Act 1983, Emigration Rules, Rule 25 fee transparency orders, and Minimum Referral Wage (MRW) gazetted schedules.',
      icon: Scale,
      color: 'amber',
      badge: 'Legislative & Sovereign Enactments',
    },
  ];

  // Filtered resources
  const getResourcesForCategory = (catId: string) => {
    return RESOURCES_DATA.filter((item) => {
      const matchCat = item.category === catId;
      const matchType = selectedType === 'all' || item.type === selectedType;
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.docCode && item.docCode.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchType && matchSearch;
    });
  };

  const handleDownload = (item: ResourceItem) => {
    setDownloadSuccessItem(item.title);
    setTimeout(() => setDownloadSuccessItem(null), 3500);
  };

  const handleAction = (item: ResourceItem) => {
    if (item.id === 'em-03') {
      setActiveView('emigrant');
    } else if (item.id === 'fe-01') {
      setActiveView('employer');
    } else if (item.id === 'ra-05') {
      setActiveView('recruiting-agent');
    } else {
      setPreviewDoc(item);
    }
  };

  const getTypeBadge = (type: ResourceItem['type']) => {
    switch (type) {
      case 'pdf':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
            <FileText className="w-3 h-3 text-red-600" /> PDF DOCUMENT
          </span>
        );
      case 'form':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
            <FileCheck className="w-3 h-3 text-blue-700" /> STATUTORY FORM
          </span>
        );
      case 'guide':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
            <BookOpen className="w-3 h-3 text-emerald-700" /> MANUAL / GUIDE
          </span>
        );
      case 'checklist':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
            <CheckSquare className="w-3 h-3 text-purple-700" /> CHECKLIST
          </span>
        );
      case 'video':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
            <Video className="w-3 h-3 text-amber-700" /> TRAINING VIDEO
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
            <ExternalLink className="w-3 h-3" /> WEB SERVICE
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* 1. Top Sovereign Banner */}
      <div className="bg-navy-900 text-white rounded-xl p-6 sm:p-7 shadow-lg border border-navy-800 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Ministry of External Affairs • Sovereign Document Repository</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            eMigrate 2.0 Official Resources & Statutory Documentation
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            All official forms, bilingual employment contracts, gazette notifications, PBBY insurance claim proformas, and fee schedules published under the Emigration Act 1983.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap z-10">
          <button
            onClick={() => setTutorialOpen(true)}
            className="px-3.5 py-2 bg-navy-800 hover:bg-navy-700 text-amber-300 font-bold text-xs rounded-lg border border-navy-700 transition flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Portal Tour</span>
          </button>
          <button
            onClick={() => {
              setPrefilledMitraQuery('What are the key forms and documents needed for eMigrate clearance?');
              setIsMitraOpen(true);
            }}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-navy-900 font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-sm"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Ask Mitra Assistant</span>
          </button>
        </div>
      </div>

      {downloadSuccessItem && (
        <div className="p-3.5 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-between shadow-md animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Official Digitally Signed Document downloaded: <strong>{downloadSuccessItem}</strong></span>
          </div>
          <span className="text-[11px] bg-emerald-700 px-2 py-0.5 rounded font-mono">NIC-DS-VERIFIED</span>
        </div>
      )}

      {/* 2. Systematic Search & Filter Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Universal Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, keyword (e.g. PBBY, Rule 25, Bank Guarantee, Contract, Form I)..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-900 focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Format Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-700 text-xs flex items-center gap-1 whitespace-nowrap">
            <Filter className="w-3.5 h-3.5 text-slate-500" /> Format:
          </span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg bg-white text-xs font-medium focus:ring-2 focus:ring-navy-900 focus:outline-none cursor-pointer"
          >
            <option value="all">All Document Types</option>
            <option value="pdf">PDF Documents</option>
            <option value="form">Statutory Forms</option>
            <option value="guide">Manuals & Guides</option>
            <option value="checklist">Checklists & Proformas</option>
            <option value="video">Training Videos</option>
          </select>
        </div>

        {/* Quick Category Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-700 text-xs whitespace-nowrap">Category:</span>
          <select
            value={activeCategoryFilter}
            onChange={(e) => setActiveCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg bg-white text-xs font-medium focus:ring-2 focus:ring-navy-900 focus:outline-none cursor-pointer"
          >
            <option value="all">Show All Categories</option>
            <option value="emigrant">Emigrant Resources</option>
            <option value="employer">Foreign Employer (FE)</option>
            <option value="ra">Recruiting Agent (RA)</option>
            <option value="acts_orders">Acts & Statutory Orders</option>
          </select>
        </div>
      </div>

      {/* 3. Section Jump Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 font-bold whitespace-nowrap text-[11px] uppercase tracking-wider">
          Jump to Category:
        </span>
        {categorySections.map((sec) => (
          <a
            key={sec.id}
            href={`#section-${sec.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(`section-${sec.id}`)?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-navy-900 hover:text-white text-slate-700 font-bold border border-slate-200 transition whitespace-nowrap flex items-center gap-1.5 shadow-xs"
          >
            <span>{sec.title.split('&')[0].trim()}</span>
            <span className="px-1.5 py-0.2 bg-white text-navy-900 rounded-full text-[10px] font-mono">
              {RESOURCES_DATA.filter((r) => r.category === sec.id).length}
            </span>
          </a>
        ))}
      </div>

      {/* 4. Categorized Sections (Each category has its own dedicated section!) */}
      <div className="space-y-10">
        {categorySections
          .filter((sec) => activeCategoryFilter === 'all' || activeCategoryFilter === sec.id)
          .map((sec) => {
            const items = getResourcesForCategory(sec.id);
            const Icon = sec.icon;

            return (
              <section
                key={sec.id}
                id={`section-${sec.id}`}
                className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden scroll-mt-24"
              >
                {/* Category Section Header */}
                <div className="p-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-navy-900 text-amber-400 mt-0.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base sm:text-lg font-black text-navy-900">
                          {sec.title}
                        </h2>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-navy-100 text-navy-800 border border-navy-200">
                          {sec.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 max-w-3xl leading-relaxed">
                        {sec.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                      {items.length} Documents Available
                    </span>
                  </div>
                </div>

                {/* Structured Resource Items Grid */}
                {items.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="p-5 hover:bg-slate-50/80 transition flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                      >
                        {/* Left Info */}
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            {getTypeBadge(item.type)}
                            {item.docCode && (
                              <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                {item.docCode}
                              </span>
                            )}
                            {item.isPopular && (
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                ★ HIGH DEMAND
                              </span>
                            )}
                          </div>

                          <h3 className="font-bold text-sm text-navy-900 leading-snug">
                            {item.title}
                          </h3>

                          <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
                            {item.description}
                          </p>

                          <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                            <span>Format: {item.type.toUpperCase()}</span>
                            {item.fileSize && <span>File Size: {item.fileSize}</span>}
                            <span>Issuing Authority: Ministry of External Affairs</span>
                          </div>
                        </div>

                        {/* Right Action Buttons */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => setPreviewDoc(item)}
                            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold text-xs rounded-lg border border-slate-300 transition flex items-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-600" />
                            <span>Preview</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleAction(item)}
                            className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-xs"
                          >
                            <Download className="w-3.5 h-3.5 text-amber-400" />
                            <span>
                              {item.type === 'form'
                                ? 'Access Form'
                                : item.type === 'video'
                                ? 'Watch Video'
                                : 'Download PDF'}
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    No documents found matching "{searchQuery}" in this category.
                  </div>
                )}
              </section>
            );
          })}
      </div>

      {/* 5. Statutory Authenticity & Verification Footer Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-xs text-amber-950 flex items-start gap-3.5 shadow-xs">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="block font-bold text-sm text-amber-900">
            Official Ministry of External Affairs Publication Standard:
          </strong>
          <p className="leading-relaxed text-slate-800">
            All forms, model employment contracts, and statutory schedules available in this repository are maintained by the Protector General of Emigrants (PGE) Division. Emigrants and recruiting agents are advised to strictly verify that contracts include standard bilingual Arabic/English terms and conform to Minimum Referral Wages.
          </p>
        </div>
      </div>

      {/* 6. Interactive Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-300 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="tricolor-stripe" />

            {/* Header */}
            <div className="bg-navy-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-navy-800 rounded-md border border-navy-700">
                  <FileBadge2 className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Official Document Scrutiny & Download
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    National Informatics Centre (NIC) Digitally Signed Publication
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-white text-lg font-bold px-2 py-0.5 rounded hover:bg-navy-800"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Document Code
                  </span>
                  <span className="font-mono text-xs font-bold text-navy-900">
                    {previewDoc.docCode || 'MEA-GOI-PUB-2026'}
                  </span>
                </div>
                {getTypeBadge(previewDoc.type)}
              </div>

              <div>
                <h4 className="font-bold text-base text-navy-900 leading-snug">
                  {previewDoc.title}
                </h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {previewDoc.description}
                </p>
              </div>

              {/* Document Overview Box */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  Statutory Metadata & Digital Authenticity:
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                  <div>• Issuing Authority: MEA, New Delhi</div>
                  <div>• Digital Seal: NIC Class-3 PKI</div>
                  <div>• Applicable To: ECR 18 Countries</div>
                  <div>• File Format: PDF / A-1b (Archival)</div>
                  <div>• File Size: {previewDoc.fileSize || '2.4 MB'}</div>
                  <div>• Verification Hash: SHA-256 (Tamper-Proof)</div>
                </div>
              </div>

              {/* Key Clauses & Scope */}
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-950 space-y-1">
                <strong className="block font-bold text-blue-900">Summary of Key Provisions:</strong>
                <p className="text-[11px] leading-relaxed text-slate-700">
                  This document serves as an authorized sovereign reference for emigration clearance, contract verification, and dispute settlement. Use official eMigrate 2.0 application forms for electronic submissions.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Government of India • Ministry of External Affairs</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded border border-slate-300"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleDownload(previewDoc);
                    setPreviewDoc(null);
                  }}
                  className="px-4 py-1.5 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded flex items-center gap-1.5 shadow"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download Signed PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
