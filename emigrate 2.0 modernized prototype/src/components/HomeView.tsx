import React, { useState } from 'react';
import { useEmigrate } from '../context/EmigrateContext';
import { MEA_ADVISORIES, POE_OFFICES } from '../data/seedData';
import { TrackArnModal } from './Modals/TrackArnModal';
import { MrwLookupModal } from './Modals/MrwLookupModal';
import { VerifyRaModal } from './Modals/VerifyRaModal';
import {
  Search,
  ShieldCheck,
  Building2,
  PhoneCall,
  DollarSign,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Info,
  MapPin,
  Mail,
  Phone,
  FileText,
  UserCheck,
  Globe2,
  Sparkles,
  BookOpen,
  Award,
  Users,
  ShieldAlert,
  Volume2,
  VolumeX,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    setActiveView,
    serverDowntimeActive,
    setServerDowntimeActive,
    setPrefilledMitraQuery,
    setIsMitraOpen,
    setTutorialOpen,
  } = useEmigrate();

  // Modals state
  const [trackArnOpen, setTrackArnOpen] = useState(false);
  const [mrwLookupOpen, setMrwLookupOpen] = useState(false);
  const [verifyRaOpen, setVerifyRaOpen] = useState(false);

  // Video card state
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [activeVideoChapter, setActiveVideoChapter] = useState(0);
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  // Flash cards state
  const [activeFlashCard, setActiveFlashCard] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Welfare Scheme active tab
  const [activeSchemeTab, setActiveSchemeTab] = useState<'pbby' | 'madad' | 'pdot' | 'icwf'>('pbby');

  // PoE directory search
  const [poeSearch, setPoeSearch] = useState('');

  const filteredPoes = POE_OFFICES.filter(
    (poe) =>
      poe.city.toLowerCase().includes(poeSearch.toLowerCase()) ||
      poe.state.toLowerCase().includes(poeSearch.toLowerCase()) ||
      poe.officerName.toLowerCase().includes(poeSearch.toLowerCase())
  );

  // 6 Interactive Flash Cards explaining eMigrate Portal
  const flashCards = [
    {
      id: 1,
      tag: 'Core Concept',
      title: 'What is eMigrate 2.0?',
      frontSummary:
        'Sovereign Digital Public Infrastructure (DPI) built by the Ministry of External Affairs (MEA), Government of India.',
      frontPoints: [
        'Unifies 5 key stakeholders: Workers, Employers, Agents, PoE Offices & Embassies',
        'Direct electronic oversight over overseas recruitment to 18 notified ECR countries',
        'Eliminates exploitative middlemen & sub-agents through sovereign verification',
      ],
      backTitle: 'Statutory Authority & Mission',
      backContent:
        'Operated under the Emigration Act 1983. eMigrate 2.0 guarantees that every Indian worker deployed abroad has an authentic employment visa, legally validated wages, and full consular protection.',
      stat: '100% Sovereign MEA Governance',
    },
    {
      id: 2,
      tag: 'Worker Protection',
      title: 'Mandatory ECR Clearance',
      frontSummary:
        'Statutory pre-departure clearance required for non-matriculate passport holders traveling for overseas work.',
      frontPoints: [
        'Prevents contract substitution and unauthorized worker deployment',
        'Online application filed directly or through licensed Recruiting Agents',
        'Two-tier review: Frontline PoE Scrutiny → Final Grant by Higher Officer (PGE)',
      ],
      backTitle: 'How ECR Protects You',
      backContent:
        'Workers with ECR passports receive verified bilingual contracts in English & Arabic. No applicant can be cleared without pre-departure biometric verification and statutory insurance.',
      stat: '8.4M+ Clearances Granted',
    },
    {
      id: 3,
      tag: 'Wage Safeguard',
      title: 'Minimum Referral Wages (MRW)',
      frontSummary:
        'Statutory wage floors set by Indian Embassies for every specific trade and host country.',
      frontPoints: [
        'Foreign employers cannot pay below the prescribed MEA wage baseline',
        'Automated algorithmic checks block non-compliant contracts immediately',
        'Guaranteed statutory overtime, lodging, transport & medical coverage',
      ],
      backTitle: 'Zero Wage Undercutting',
      backContent:
        'Example: A Mason in UAE must receive at least AED 1,250/month; in Saudi Arabia SAR 1,400/month. Any contract below this is automatically flagged by eMigrate AI triage.',
      stat: 'Enforced Across 18 GCC & ECR Nations',
    },
    {
      id: 4,
      tag: 'Corporate Verification',
      title: 'Foreign Employer (FE) Attestation',
      frontSummary:
        'Direct consular verification of overseas companies by Indian Diplomatic Missions.',
      frontPoints: [
        'Commercial registration verified with host country Department of Economic Development',
        'Labor accommodation inspected to prevent overcrowded, unsafe worker camps',
        'Strict worker quota allocations tied to verified corporate capacity',
      ],
      backTitle: 'No Ghost Employers',
      backContent:
        'Indian Embassies in Abu Dhabi, Riyadh, Doha, Kuwait, Muscat, and Manama attest corporate credentials before any demand letter can be issued to recruit Indian workers.',
      stat: '42,000+ Attested Companies',
    },
    {
      id: 5,
      tag: 'Agency Accountability',
      title: 'Licensed Recruiting Agents (Rule 25)',
      frontSummary:
        'Only MEA-licensed recruiting agents (holding valid RA-ID) are permitted to recruit Indian citizens.',
      frontPoints: [
        'Statutory service fee strictly capped at maximum ₹30,000 + GST',
        'Mandatory ₹50 Lakh bank guarantee maintained with MEA for worker safety',
        'Sub-agents and unregistered brokers are strictly illegal and face police FIRs',
      ],
      backTitle: 'Rule 25 Transparency',
      backContent:
        'Foreign employers are legally liable for visa costs, air tickets, and medical tests. Licensed agents cannot charge workers for visas or demand excess commissions.',
      stat: '1,842 Registered MEA Agents',
    },
    {
      id: 6,
      tag: 'Social Security',
      title: 'PBBY Insurance (₹10 Lakh)',
      frontSummary:
        'Pravasi Bharatiya Bima Yojana provides comprehensive social security for overseas workers.',
      frontPoints: [
        '₹10 Lakh coverage for accidental death or permanent disability abroad',
        'Hospitalization, medical repatriation, and family travel assistance',
        'Cashless settlement facilitated directly through Indian Missions and MADAD',
      ],
      backTitle: '24x7 Claim Support',
      backContent:
        'All emigrants granted clearance must hold an active PBBY policy from empanelled public sector insurance companies (SBI General, New India, Oriental, etc.).',
      stat: '₹10 Lakh Mandatory Cover',
    },
  ];

  // Video Chapters
  const videoChapters = [
    { title: '01: What is eMigrate?', timestamp: '00:00', duration: '01:15' },
    { title: '02: How to Apply for EC', timestamp: '01:15', duration: '01:15' },
    { title: '03: Wages & PBBY Insurance', timestamp: '02:30', duration: '01:15' },
    { title: '04: Beware of Sub-Agents', timestamp: '03:45', duration: '00:45' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Scrolling Marquee Ticker */}
      <div className="bg-amber-500 text-navy-900 px-4 py-2 border-b border-amber-600 flex items-center gap-3 overflow-hidden text-xs font-bold shadow-xs">
        <span className="bg-navy-900 text-amber-400 px-2 py-0.5 rounded text-[11px] uppercase tracking-wider flex-shrink-0 flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5" /> MEA Advisory
        </span>
        <div className="overflow-hidden relative w-full">
          <div className="whitespace-nowrap animate-marquee flex gap-12 pr-12 w-max font-semibold">
            {[...MEA_ADVISORIES, ...MEA_ADVISORIES].map((adv, idx) => (
              <span key={idx} className="inline-block">
                • {adv}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 2. REVOLUTIONARY HERO SECTION: Strong Introduction, Flash Cards & Explainer Video */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Main Hero Header Card (Deep Navy #0c2340 Sovereign Banner) */}
        <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-slate-900 text-white rounded-2xl p-6 sm:p-10 shadow-2xl border border-navy-700 relative overflow-hidden">
          {/* Subtle Institutional Watermark */}
          <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none translate-x-12 translate-y-12">
            <ShieldCheck className="w-96 h-96" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Strong Institutional Introduction */}
            <div id="tour-emigrant-hero" className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 bg-navy-800/90 border border-amber-400/40 px-3 py-1 rounded-full text-xs text-amber-300 font-semibold shadow-xs">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Ministry of External Affairs • Sovereign Digital Public Infrastructure (DPI)</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight tracking-tight">
                eMigrate 2.0: Safe, Orderly & Sovereign Migration Corridor
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl font-normal">
                eMigrate 2.0 is the official unified platform of the Government of India for the protection and welfare of Indian overseas migrant workers. Operating under the Emigration Act 1983, it enforces statutory Minimum Referral Wages (MRW), authenticates foreign employers via Indian Embassies, regulates licensed recruiting agents, and ensures 100% verified ₹10 Lakh PBBY insurance coverage.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-3 items-center">
                <button
                  type="button"
                  onClick={() => setActiveView('emigrant')}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-navy-950 font-black text-xs rounded-xl shadow-lg transition flex items-center gap-2"
                >
                  <span>Apply for Emigration Clearance</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setTrackArnOpen(true)}
                  className="px-4 py-2.5 bg-navy-800 hover:bg-navy-700 text-white font-bold text-xs rounded-xl border border-navy-600 transition flex items-center gap-2 shadow-sm"
                >
                  <Search className="w-3.5 h-3.5 text-amber-400" />
                  <span>Track Application by ARN</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTutorialOpen(true)}
                  className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs rounded-xl border border-white/20 transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Guided Portal Walkthrough</span>
                </button>
              </div>

              {/* Key Safeguard Metrics Strip */}
              <div className="pt-4 border-t border-navy-700/80 grid grid-cols-3 gap-3 text-xs text-slate-300">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Wage Protection</span>
                  <strong className="text-white text-xs sm:text-sm">Mandatory MRW Gate</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Statutory Insurance</span>
                  <strong className="text-emerald-400 text-xs sm:text-sm">₹10 Lakh PBBY Cover</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Fee Transparency</span>
                  <strong className="text-amber-300 text-xs sm:text-sm">Rule 25 (≤ ₹30,000)</strong>
                </div>
              </div>
            </div>

            {/* Right Column: Embedded Explainer Video Player */}
            <div id="tour-video-review" className="lg:col-span-5 bg-navy-950/80 rounded-xl border border-navy-700 overflow-hidden shadow-xl flex flex-col justify-between">
              {/* Video Header Strip */}
              <div className="p-3 bg-navy-950 border-b border-navy-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                  <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
                    Official MEA Explainer Video
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsVideoMuted(!isVideoMuted)}
                    className="text-slate-400 hover:text-white p-1 rounded hover:bg-navy-800 transition"
                    title={isVideoMuted ? 'Unmute' : 'Mute'}
                  >
                    {isVideoMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                  <span className="text-[10px] text-slate-400 font-mono">04:30 MIN</span>
                </div>
              </div>

              {/* Embedded Player Display Canvas */}
              <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                {isVideoPlaying ? (
                  <div className="w-full h-full bg-gradient-to-b from-slate-900 to-black p-5 flex flex-col justify-between text-center animate-in fade-in">
                    <div className="flex items-center justify-between text-[11px] text-amber-400 font-mono">
                      <span>MEA EDUCATIONAL BROADCAST</span>
                      <span>CHAPTER {activeVideoChapter + 1}/4</span>
                    </div>

                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/40">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-white">
                        {videoChapters[activeVideoChapter].title}
                      </h4>
                      <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                        {activeVideoChapter === 0 &&
                          'eMigrate 2.0 directly links Indian citizens with verified foreign employers, eliminating fake visas and unregistered sub-agents.'}
                        {activeVideoChapter === 1 &&
                          'Learn step-by-step how to submit passport details, upload the employment contract, and verify machine-readable MRZ.'}
                        {activeVideoChapter === 2 &&
                          'Never accept a wage below statutory Minimum Referral Wages. PBBY provides ₹10 Lakh cashless accidental protection.'}
                        {activeVideoChapter === 3 &&
                          'Warning: Sub-agents are illegal under Section 10 of the Emigration Act. Only deal with registered Recruiting Agents.'}
                      </p>
                    </div>

                    <div className="space-y-2">
                      {/* Simulated Progress Bar */}
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-400 h-full transition-all duration-300"
                          style={{ width: `${((activeVideoChapter + 1) / 4) * 100}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>{videoChapters[activeVideoChapter].timestamp}</span>
                        <button
                          onClick={() => setIsVideoPlaying(false)}
                          className="text-amber-400 font-bold hover:underline"
                        >
                          Pause Video
                        </button>
                        <span>04:30</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center group cursor-pointer"
                    onClick={() => setIsVideoPlaying(true)}>
                    {/* Video Background Graphic */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10" />
                    <div className="absolute inset-0 bg-slate-900 opacity-90" />

                    <div className="relative z-20 space-y-3">
                      <div className="w-14 h-14 rounded-full bg-amber-500 text-navy-950 flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition">
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded uppercase">
                          Watch Explainer Video
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1">
                          How the eMigrate Portal Works (Safe Migration)
                        </h4>
                        <p className="text-[11px] text-slate-300 max-w-xs mx-auto mt-0.5">
                          Click to play the official MEA orientation film on worker rights, wages, and clearances.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Chapter Bookmarks */}
              <div className="p-2.5 bg-navy-900 border-t border-navy-800 grid grid-cols-2 gap-1.5 text-[10px]">
                {videoChapters.map((chap, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveVideoChapter(idx);
                      setIsVideoPlaying(true);
                    }}
                    className={`p-1.5 rounded text-left transition flex items-center justify-between ${
                      activeVideoChapter === idx && isVideoPlaying
                        ? 'bg-amber-500 text-navy-950 font-bold'
                        : 'bg-navy-950 text-slate-300 hover:bg-navy-800'
                    }`}
                  >
                    <span className="truncate">{chap.title}</span>
                    <span className="font-mono text-[9px] opacity-75">{chap.timestamp}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. INTERACTIVE FLASH CARDS SECTION: Explaining eMigrate 2.0 Key Pillars */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-500 text-navy-950">
                  <Sparkles className="w-4 h-4" />
                </span>
                <h2 className="text-lg sm:text-xl font-black text-navy-900">
                  Interactive Flash Cards: Master the eMigrate Portal
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any flash card to flip and inspect core sovereign safeguards, legal mandates, and process workflows.
              </p>
            </div>

            {/* Flash Card Switcher Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveFlashCard((prev) => (prev > 0 ? prev - 1 : flashCards.length - 1));
                  setIsCardFlipped(false);
                }}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition border border-slate-300"
                title="Previous Flash Card"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono font-bold text-navy-900 px-2">
                Card {activeFlashCard + 1} of {flashCards.length}
              </span>
              <button
                type="button"
                onClick={() => {
                  setActiveFlashCard((prev) => (prev < flashCards.length - 1 ? prev + 1 : 0));
                  setIsCardFlipped(false);
                }}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition border border-slate-300"
                title="Next Flash Card"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Flash Cards Carousel / Focus View */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* Left: Quick Card Selector Pill List */}
            <div className="md:col-span-4 space-y-2">
              {flashCards.map((card, idx) => (
                <button
                  key={card.id}
                  onClick={() => {
                    setActiveFlashCard(idx);
                    setIsCardFlipped(false);
                  }}
                  className={`w-full p-3 rounded-xl text-left transition border flex items-center justify-between ${
                    activeFlashCard === idx
                      ? 'bg-navy-900 text-white border-navy-900 shadow-md ring-2 ring-amber-400/40'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider block ${
                        activeFlashCard === idx ? 'text-amber-400' : 'text-slate-500'
                      }`}
                    >
                      {card.tag}
                    </span>
                    <span className="font-bold text-xs block">{card.title}</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      activeFlashCard === idx ? 'bg-navy-800 text-amber-300' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    0{idx + 1}
                  </span>
                </button>
              ))}
            </div>

            {/* Right: The Active Flippable Flash Card */}
            <div className="md:col-span-8">
              {(() => {
                const current = flashCards[activeFlashCard];
                return (
                  <div
                    onClick={() => setIsCardFlipped(!isCardFlipped)}
                    className="cursor-pointer group relative bg-gradient-to-br from-slate-50 via-white to-amber-50/40 p-6 sm:p-8 rounded-2xl border-2 border-slate-300 hover:border-navy-900 shadow-lg transition-all min-h-[320px] flex flex-col justify-between"
                  >
                    {/* Top Stripe */}
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-navy-900 text-amber-400 font-bold text-[10px] uppercase tracking-wider">
                          {current.tag}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">
                          eMigrate 2.0 Explainer Card
                        </span>
                      </div>
                      <span className="text-xs font-bold text-navy-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 text-amber-700" />
                        <span>Click to Flip Card</span>
                      </span>
                    </div>

                    {/* Card Content based on Flipped state */}
                    {!isCardFlipped ? (
                      <div className="space-y-4 py-4 animate-in fade-in">
                        <h3 className="text-xl sm:text-2xl font-black text-navy-900">
                          {current.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                          {current.frontSummary}
                        </p>
                        <div className="space-y-2 pt-1">
                          {current.frontPoints.map((pt, pidx) => (
                            <div key={pidx} className="flex items-start gap-2 text-xs text-slate-600">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                              <span>{pt}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 py-4 animate-in fade-in">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block">
                          Legal Safeguard & Operational Detail:
                        </span>
                        <h3 className="text-lg sm:text-xl font-black text-navy-900">
                          {current.backTitle}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                          {current.backContent}
                        </p>
                      </div>
                    )}

                    {/* Card Footer Metric */}
                    <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
                      <span className="font-bold text-navy-900 font-mono">
                        Key Metric: <strong className="text-emerald-700">{current.stat}</strong>
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {isCardFlipped ? 'Showing Back • Click to view Front' : 'Showing Front • Click to view Back'}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* 4. Live Sovereign Statistics Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="p-3 bg-blue-50 text-navy-900 rounded-xl border border-blue-200">
              <Building2 className="w-6 h-6 text-navy-900" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-navy-900 font-mono">1,842</div>
              <div className="text-[11px] font-bold text-slate-600 uppercase">
                Licensed Recruiting Agents
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200">
              <UserCheck className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-navy-900 font-mono">42,890</div>
              <div className="text-[11px] font-bold text-slate-600 uppercase">
                Active GCC Vacancies
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="p-3 bg-amber-50 text-amber-800 rounded-xl border border-amber-200">
              <FileText className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-navy-900 font-mono">8,421,902</div>
              <div className="text-[11px] font-bold text-slate-600 uppercase">
                Clearances Granted
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="p-3 bg-purple-50 text-purple-800 rounded-xl border border-purple-200">
              <ShieldCheck className="w-6 h-6 text-purple-700" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-navy-900 font-mono">9,120,440</div>
              <div className="text-[11px] font-bold text-slate-600 uppercase">
                Active PBBY Policies
              </div>
            </div>
          </div>
        </div>

        {/* 5. Quick Services Sovereign Grid */}
        <div id="tour-services-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Track by ARN (3 Options) */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-navy-900 transition">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-navy-50 text-navy-900 flex items-center justify-center font-bold">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-navy-900">Track Application by ARN</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Check real-time emigration clearance status across Emigrants, Foreign Employers (FE), and Recruiting Agents (RA).
              </p>
            </div>
            <button
              onClick={() => setTrackArnOpen(true)}
              className="w-full py-2.5 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Track Application (ARN)</span>
              <ChevronRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>

          {/* Card 2: Minimum Referral Wages (MRW) Lookup */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-navy-900 transition">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                <DollarSign className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="font-bold text-base text-navy-900">Statutory Wage Matrix (MRW)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Verify MEA-mandated minimum monthly referral wages for specific trades across GCC and 18 notified ECR nations.
              </p>
            </div>
            <button
              onClick={() => setMrwLookupOpen(true)}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Inspect Wage Benchmarks</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: Verify Licensed Recruiting Agent */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-navy-900 transition">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-900 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 text-amber-700" />
              </div>
              <h3 className="font-bold text-base text-navy-900">Verify Recruiting Agent (RA)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Validate authorized MEA registration certificate, check active bank guarantee, and view caution lists against unregistered brokers.
              </p>
            </div>
            <button
              onClick={() => setVerifyRaOpen(true)}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold text-xs rounded-lg transition flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Verify Licensed Agent</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 6. PoE Regional Directory Accordion */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-bold text-base text-navy-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-navy-900" />
                Protector of Emigrants (PoE) Regional Directory
              </h3>
              <p className="text-xs text-slate-500">
                10 Statutory Offices of the Ministry of External Affairs across India
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={poeSearch}
                onChange={(e) => setPoeSearch(e.target.value)}
                placeholder="Search by city, officer or state..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-navy-900 focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredPoes.map((poe) => (
              <div
                key={poe.id}
                className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white hover:border-navy-900 transition space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <strong className="text-navy-900 font-bold text-sm">
                    {poe.city} ({poe.state})
                  </strong>
                  <span className="font-mono text-[10px] bg-slate-200 px-1.5 py-0.5 rounded font-bold">
                    {poe.id}
                  </span>
                </div>
                <div className="text-slate-700 font-medium">{poe.officerName}</div>
                <div className="text-[11px] text-slate-500 leading-snug">{poe.address}</div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                  <span className="flex items-center gap-1 font-mono">
                    <Phone className="w-3 h-3 text-slate-400" /> {poe.phone}
                  </span>
                  <a
                    href={`mailto:${poe.email}`}
                    className="text-navy-900 hover:underline flex items-center gap-1 font-mono font-medium"
                  >
                    <Mail className="w-3 h-3 text-slate-400" /> {poe.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Modals */}
      <TrackArnModal isOpen={trackArnOpen} onClose={() => setTrackArnOpen(false)} />
      <MrwLookupModal isOpen={mrwLookupOpen} onClose={() => setMrwLookupOpen(false)} />
      <VerifyRaModal isOpen={verifyRaOpen} onClose={() => setVerifyRaOpen(false)} />
    </div>
  );
};
