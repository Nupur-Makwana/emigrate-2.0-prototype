import React, { useState } from 'react';
import { useEmigrate } from '../context/EmigrateContext';
import { SupportedLanguage, FontScale } from '../types/emigrate';
import { LoginModal } from './Modals/LoginModal';
import { InfoModal } from './Modals/InfoModal';
import {
  Globe,
  HelpCircle,
  Info,
  Shield,
  User,
  LogOut,
  ChevronDown,
  BookOpen,
  FileText,
  Briefcase,
  Users,
  Sun,
  Moon,
  Sparkles,
  Award,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    logout,
    language,
    setLanguage,
    fontScale,
    setFontScale,
    darkMode,
    setDarkMode,
    activeView,
    setActiveView,
    setTutorialOpen,
  } = useEmigrate();

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [cscLoginOpen, setCscLoginOpen] = useState(false);
  const [infoModalType, setInfoModalType] = useState<string | null>(null);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [helpDropdownOpen, setHelpDropdownOpen] = useState(false);
  const [resourcesMenuOpen, setResourcesMenuOpen] = useState(false);
  const [activeResourceTab, setActiveResourceTab] = useState<'emigrant' | 'employer' | 'ra' | 'exporter'>('emigrant');

  const languageLabels: Record<SupportedLanguage, string> = {
    en: 'English',
    hi: 'हिन्दी',
    ta: 'தமிழ்',
    te: 'తెలుగు',
    kn: 'ಕನ್ನಡ',
    bn: 'বাংলা',
    mr: 'मराठी',
    gu: 'ગુજરાતી',
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'emigrant', label: 'Emigrant' },
    { id: 'employer', label: 'Employer' },
    { id: 'project-exporter', label: 'Project Exporter' },
    { id: 'recruiting-agent', label: 'Recruiting Agent' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white shadow-md border-b border-slate-200">
        {/* Tricolor Ribbon Top Accent */}
        <div className="tricolor-stripe" />

        {/* 1. Institutional Top Strip (Deep Navy #0c2340) */}
        <div
          id="tour-top-strip"
          className="bg-navy-900 text-slate-200 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between border-b border-navy-800"
        >
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            {/* About Us Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setAboutDropdownOpen(!aboutDropdownOpen);
                  setHelpDropdownOpen(false);
                }}
                className="hover:text-amber-400 flex items-center gap-1 font-medium transition py-0.5"
              >
                <span>About Us</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {aboutDropdownOpen && (
                <div className="absolute left-0 mt-1 w-56 bg-white text-slate-800 rounded shadow-xl border border-slate-200 py-1 z-50 animate-in fade-in duration-100">
                  <button
                    onClick={() => {
                      setInfoModalType('about');
                      setAboutDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-xs font-medium"
                  >
                    About eMigrate 2.0 System
                  </button>
                  <button
                    onClick={() => {
                      setInfoModalType('pbsk');
                      setAboutDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-xs font-medium"
                  >
                    PBSK 24x7 Support Center
                  </button>
                  <button
                    onClick={() => {
                      setInfoModalType('about');
                      setAboutDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-xs font-medium"
                  >
                    OE & PGE Division (MEA)
                  </button>
                  <button
                    onClick={() => {
                      setActiveView('directory');
                      setAboutDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-xs font-medium"
                  >
                    PoE Regional Jurisdictions
                  </button>
                </div>
              )}
            </div>

            {/* Help Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setHelpDropdownOpen(!helpDropdownOpen);
                  setAboutDropdownOpen(false);
                }}
                className="hover:text-amber-400 flex items-center gap-1 font-medium transition py-0.5"
              >
                <span>Help & FAQs</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {helpDropdownOpen && (
                <div className="absolute left-0 mt-1 w-56 bg-white text-slate-800 rounded shadow-xl border border-slate-200 py-1 z-50 animate-in fade-in duration-100">
                  <button
                    onClick={() => {
                      setTutorialOpen(true);
                      setHelpDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-xs font-medium flex items-center justify-between"
                  >
                    <span>Guided Portal Tutorial</span>
                    <span className="text-[10px] bg-amber-100 text-amber-900 px-1 rounded">7 Steps</span>
                  </button>
                  <button
                    onClick={() => {
                      setInfoModalType('escalation');
                      setHelpDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-xs font-medium"
                  >
                    MEA Escalation Matrix
                  </button>
                  <button
                    onClick={() => {
                      setInfoModalType('about');
                      setHelpDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-xs font-medium"
                  >
                    ECR vs ECNR Rulebook
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setTutorialOpen(true)}
              className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition"
            >
              <Sparkles className="w-3 h-3" />
              <span>Re-take Tutorial</span>
            </button>
          </div>

          {/* Right utility items: Language, Font Scale, Theme */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Indian Language Selector */}
            <div className="flex items-center gap-1 bg-navy-800 px-2 py-0.5 rounded border border-navy-700">
              <Globe className="w-3 h-3 text-amber-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="bg-transparent text-white text-xs font-medium focus:outline-none cursor-pointer"
              >
                {Object.entries(languageLabels).map(([code, label]) => (
                  <option key={code} value={code} className="bg-navy-900 text-white">
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Accessibility (A-, A, A+) */}
            <div className="flex items-center bg-navy-800 rounded border border-navy-700 overflow-hidden">
              <button
                onClick={() => setFontScale('sm')}
                className={`px-2 py-0.5 text-xs font-semibold ${fontScale === 'sm' ? 'bg-amber-400 text-navy-900' : 'hover:bg-navy-700'}`}
                title="Decrease font size"
              >
                A-
              </button>
              <button
                onClick={() => setFontScale('base')}
                className={`px-2 py-0.5 text-xs font-semibold border-x border-navy-700 ${fontScale === 'base' ? 'bg-amber-400 text-navy-900' : 'hover:bg-navy-700'}`}
                title="Normal font size"
              >
                A
              </button>
              <button
                onClick={() => setFontScale('lg')}
                className={`px-2 py-0.5 text-xs font-semibold ${fontScale === 'lg' ? 'bg-amber-400 text-navy-900' : 'hover:bg-navy-700'}`}
                title="Increase font size"
              >
                A+
              </button>
            </div>

            {/* Dark/Light toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1 rounded bg-navy-800 hover:bg-navy-700 border border-navy-700 transition"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-3 h-3 text-amber-400" /> : <Moon className="w-3 h-3 text-slate-300" />}
            </button>
          </div>
        </div>

        {/* 2. Institutional Branding Strip (Clean White) */}
        <div className="px-4 py-3 flex items-center justify-between gap-4 bg-white">
          {/* Left: Ashoka Lion Capital MEA Emblem */}
          <div className="flex items-center gap-3.5">
            {/* SVG Ashoka Lion MEA Crest */}
            <div className="w-12 h-14 flex flex-col items-center justify-center border-r border-slate-200 pr-3.5 flex-shrink-0">
              <svg viewBox="0 0 100 120" className="w-9 h-11 text-navy-900" fill="currentColor">
                {/* Simplified Sovereign Ashoka Lion Emblem Representation */}
                <circle cx="50" cy="20" r="12" fill="#d97706" />
                <path d="M35 32 C35 25, 65 25, 65 32 L60 48 L40 48 Z" fill="#0c2340" />
                <rect x="30" y="48" width="40" height="8" rx="2" fill="#d97706" />
                <circle cx="50" cy="52" r="3" fill="#ffffff" />
                {/* Ashoka Chakra base */}
                <circle cx="50" cy="72" r="14" fill="none" stroke="#0c2340" strokeWidth="3" />
                <circle cx="50" cy="72" r="3" fill="#0c2340" />
                <path d="M42 62 L58 82 M58 62 L42 82 M50 58 L50 86 M36 72 L64 72" stroke="#0c2340" strokeWidth="1.5" />
                {/* Satyameva Jayate Plinth */}
                <rect x="25" y="90" width="50" height="7" rx="1" fill="#0c2340" />
                <path d="M30 100 L70 100" stroke="#0c2340" strokeWidth="2" />
              </svg>
              <span className="text-[7.5px] font-bold tracking-widest uppercase text-navy-900 mt-0.5">
                सत्यमेव जयते
              </span>
            </div>

            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                Ministry of External Affairs • विदेश मंत्रालय
              </div>
              <div className="text-sm font-extrabold text-navy-900 leading-tight">
                Government of India • भारत सरकार
              </div>
            </div>
          </div>

          {/* Center: Official eMigrate 2.0 Logo */}
          <div
            onClick={() => setActiveView('home')}
            className="cursor-pointer flex items-center gap-2.5 text-center sm:text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-navy-900 text-white flex items-center justify-center font-black text-xl shadow-xs border border-navy-800">
              <span className="text-amber-400">e</span>M
            </div>
            <div>
              <div className="text-xl font-black text-navy-900 tracking-tight leading-none flex items-center gap-1.5">
                <span>eMigrate</span>
                <span className="text-xs bg-amber-500 text-navy-900 font-extrabold px-1.5 py-0.5 rounded">
                  2.0
                </span>
              </div>
              <div className="text-[11px] font-bold text-emerald-800 tracking-wider">
                सरल, सुरक्षित प्रवासन • Safe, Orderly Migration
              </div>
            </div>
          </div>

          {/* Right: Authentication & Portal Action Buttons */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-lg border border-slate-300">
                <div className="w-8 h-8 rounded-full bg-navy-900 text-amber-400 flex items-center justify-center font-bold text-xs">
                  {currentUser.role === 'POE' ? 'POE' : currentUser.role === 'PGE' ? 'PGE' : 'MIS'}
                </div>
                <div className="text-left hidden sm:block pr-2">
                  <div className="text-xs font-bold text-navy-900 leading-none">
                    {currentUser.role === 'POE'
                      ? 'PoE Officer'
                      : currentUser.role === 'PGE'
                      ? 'PGE (Higher Officer)'
                      : 'Mission Officer'}
                  </div>
                  <div className="text-[10px] text-slate-500">{currentUser.username}</div>
                </div>
                <button
                  onClick={() => {
                    if (currentUser.role === 'POE') setActiveView('poe-dashboard');
                    else if (currentUser.role === 'PGE') setActiveView('pge-dashboard');
                    else setActiveView('mission-dashboard');
                  }}
                  className="px-2.5 py-1 text-xs font-bold bg-navy-900 hover:bg-navy-800 text-white rounded transition"
                >
                  Dashboard
                </button>
                <button
                  onClick={logout}
                  className="p-1 text-slate-500 hover:text-red-600 rounded transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="tour-login-btn"
                  onClick={() => setLoginModalOpen(true)}
                  className="px-3.5 py-1.5 text-xs font-bold bg-navy-900 hover:bg-navy-800 text-white rounded shadow-xs border border-navy-900 flex items-center gap-1.5 transition"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Registered User Login</span>
                </button>
                <button
                  onClick={() => setCscLoginOpen(true)}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-navy-900 rounded border border-slate-300 flex items-center gap-1.5 transition hidden sm:flex"
                >
                  <Users className="w-3.5 h-3.5 text-emerald-700" />
                  <span>CSC Login</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 3. Primary Navigation Bar (Deep Navy Ribbon) */}
        <nav id="tour-main-nav" className="bg-navy-900 text-white px-4">
          <div className="flex items-center justify-between overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-1 text-xs font-semibold whitespace-nowrap">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    setResourcesMenuOpen(false);
                  }}
                  className={`px-3 py-2.5 transition border-b-2 flex items-center gap-1.5 ${
                    activeView === item.id
                      ? 'border-amber-400 text-amber-400 bg-navy-800 font-bold'
                      : 'border-transparent text-slate-200 hover:text-white hover:bg-navy-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {/* Resources Tab with dropdown options */}
              <div className="relative">
                <button
                  onClick={() => {
                    setActiveView('resources');
                    setResourcesMenuOpen(!resourcesMenuOpen);
                  }}
                  className={`px-3 py-2.5 transition border-b-2 flex items-center gap-1 ${
                    activeView === 'resources' || resourcesMenuOpen
                      ? 'border-amber-400 text-amber-400 bg-navy-800'
                      : 'border-transparent text-slate-200 hover:text-white hover:bg-navy-800'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Resources</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {/* Mega Menu Dropdown */}
                {resourcesMenuOpen && (
                  <div className="absolute left-0 mt-0 w-[580px] bg-white text-slate-900 shadow-2xl rounded-b-lg border border-slate-200 z-50 overflow-hidden animate-in fade-in duration-100">
                    <div className="p-2.5 bg-navy-900 text-white flex items-center justify-between text-xs">
                      <span className="font-bold">eMigrate 2.0 Sovereign Document Portal</span>
                      <button
                        onClick={() => {
                          setActiveView('resources');
                          setResourcesMenuOpen(false);
                        }}
                        className="text-amber-400 hover:underline text-[11px] font-bold"
                      >
                        Open Full Repository →
                      </button>
                    </div>

                    <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700">
                      <button
                        onClick={() => setActiveResourceTab('emigrant')}
                        className={`p-2.5 text-left border-b-2 ${activeResourceTab === 'emigrant' ? 'border-navy-900 text-navy-900 bg-white' : 'border-transparent'}`}
                      >
                        Emigrant Resources
                      </button>
                      <button
                        onClick={() => setActiveResourceTab('employer')}
                        className={`p-2.5 text-left border-b-2 ${activeResourceTab === 'employer' ? 'border-navy-900 text-navy-900 bg-white' : 'border-transparent'}`}
                      >
                        Employer Guidelines
                      </button>
                      <button
                        onClick={() => setActiveResourceTab('ra')}
                        className={`p-2.5 text-left border-b-2 ${activeResourceTab === 'ra' ? 'border-navy-900 text-navy-900 bg-white' : 'border-transparent'}`}
                      >
                        Recruiting Agents
                      </button>
                    </div>

                    <div className="p-4 text-xs">
                      {activeResourceTab === 'emigrant' && (
                        <div className="space-y-2">
                          <h4 className="font-bold text-navy-900 text-sm">Emigrant Welfare & Rights</h4>
                          <ul className="space-y-1.5 text-slate-600">
                            <li
                              onClick={() => {
                                setActiveView('resources');
                                setResourcesMenuOpen(false);
                              }}
                              className="hover:text-navy-900 cursor-pointer flex items-center gap-1.5"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                              Kit for Emigrants (Handbook)
                            </li>
                            <li
                              onClick={() => {
                                setActiveView('resources');
                                setResourcesMenuOpen(false);
                              }}
                              className="hover:text-navy-900 cursor-pointer flex items-center gap-1.5"
                            >
                              <FileText className="w-3.5 h-3.5 text-blue-600" />
                              PBBY Insurance Claim & Online Purchase Guide
                            </li>
                            <li
                              onClick={() => {
                                setActiveView('resources');
                                setResourcesMenuOpen(false);
                              }}
                              className="hover:text-navy-900 cursor-pointer flex items-center gap-1.5"
                            >
                              <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                              Standard Model Employment Contract (Bilingual)
                            </li>
                          </ul>
                        </div>
                      )}

                      {activeResourceTab === 'employer' && (
                        <div className="space-y-2">
                          <h4 className="font-bold text-navy-900 text-sm">Foreign Employer (FE) Framework</h4>
                          <ul className="space-y-1.5 text-slate-600">
                            <li
                              onClick={() => {
                                setActiveView('resources');
                                setResourcesMenuOpen(false);
                              }}
                              className="hover:text-navy-900 cursor-pointer"
                            >
                              • Instructions for Employer Registration with Process Flow
                            </li>
                            <li
                              onClick={() => {
                                setActiveView('resources');
                                setResourcesMenuOpen(false);
                              }}
                              className="hover:text-navy-900 cursor-pointer"
                            >
                              • List of Job Designation as on Visa
                            </li>
                            <li
                              onClick={() => {
                                setActiveView('resources');
                                setResourcesMenuOpen(false);
                              }}
                              className="hover:text-navy-900 cursor-pointer"
                            >
                              • PAC List (Prior Approval Category Entities)
                            </li>
                          </ul>
                        </div>
                      )}

                      {activeResourceTab === 'ra' && (
                        <div className="space-y-2">
                          <h4 className="font-bold text-navy-900 text-sm">Recruiting Agent Regulations</h4>
                          <ul className="space-y-1.5 text-slate-600">
                            <li
                              onClick={() => {
                                setActiveView('resources');
                                setResourcesMenuOpen(false);
                              }}
                              className="hover:text-navy-900 cursor-pointer"
                            >
                              • List of State RAs & Registered Agency Register
                            </li>
                            <li
                              onClick={() => {
                                setActiveView('resources');
                                setResourcesMenuOpen(false);
                              }}
                              className="hover:text-navy-900 cursor-pointer"
                            >
                              • FORM I & II (Recruiting Agent License Application)
                            </li>
                            <li
                              onClick={() => {
                                setActiveView('resources');
                                setResourcesMenuOpen(false);
                              }}
                              className="hover:text-navy-900 cursor-pointer"
                            >
                              • Revised Checklist - Process RA Renewal & ₹50L Guarantee
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="bg-slate-100 p-2.5 flex items-center justify-between border-t border-slate-200">
                      <button
                        onClick={() => {
                          setActiveView('resources');
                          setResourcesMenuOpen(false);
                        }}
                        className="text-xs text-navy-900 font-bold hover:underline"
                      >
                        Explore All 30+ MEA Resources →
                      </button>
                      <button
                        onClick={() => setResourcesMenuOpen(false)}
                        className="text-xs text-slate-500 font-bold hover:text-slate-800"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Other Static Links */}
              <button
                onClick={() => {
                  setInfoModalType('jobs');
                  setResourcesMenuOpen(false);
                }}
                className="px-3 py-2.5 border-b-2 border-transparent text-slate-200 hover:text-white hover:bg-navy-800 transition"
              >
                Job Opportunities
              </button>

              <button
                onClick={() => {
                  setActiveView('welfare');
                  setResourcesMenuOpen(false);
                }}
                className={`px-3 py-2.5 transition border-b-2 ${
                  activeView === 'welfare'
                    ? 'border-amber-400 text-amber-400 bg-navy-800 font-bold'
                    : 'border-transparent text-slate-200 hover:text-white hover:bg-navy-800'
                }`}
              >
                Welfare Schemes
              </button>

              <button
                onClick={() => {
                  setActiveView('directory');
                  setResourcesMenuOpen(false);
                }}
                className={`px-3 py-2.5 transition border-b-2 ${
                  activeView === 'directory'
                    ? 'border-amber-400 text-amber-400 bg-navy-800 font-bold'
                    : 'border-transparent text-slate-200 hover:text-white hover:bg-navy-800'
                }`}
              >
                Directory
              </button>

              <button
                onClick={() => {
                  setInfoModalType('rti');
                  setResourcesMenuOpen(false);
                }}
                className="px-3 py-2.5 border-b-2 border-transparent text-slate-200 hover:text-white hover:bg-navy-800 transition"
              >
                RTI
              </button>

              <button
                onClick={() => {
                  setActiveView('alerts');
                  setResourcesMenuOpen(false);
                }}
                className={`px-3 py-2.5 transition border-b-2 ${
                  activeView === 'alerts'
                    ? 'border-amber-400 text-amber-400 bg-navy-800 font-bold'
                    : 'border-transparent text-slate-200 hover:text-white hover:bg-navy-800'
                }`}
              >
                Alerts
              </button>
            </div>

            {/* Officer Dashboard Tab when logged in */}
            {currentUser && (
              <div className="flex items-center pl-4 py-1">
                {currentUser.role === 'POE' ? (
                  <button
                    onClick={() => setActiveView('poe-dashboard')}
                    className={`px-3 py-1.5 text-xs font-bold rounded flex items-center gap-1.5 transition ${
                      activeView === 'poe-dashboard'
                        ? 'bg-amber-400 text-navy-900 shadow'
                        : 'bg-navy-800 text-amber-300 hover:bg-navy-700'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>PoE Frontline Check-in</span>
                  </button>
                ) : currentUser.role === 'PGE' ? (
                  <button
                    onClick={() => setActiveView('pge-dashboard')}
                    className={`px-3 py-1.5 text-xs font-bold rounded flex items-center gap-1.5 transition ${
                      activeView === 'pge-dashboard'
                        ? 'bg-amber-400 text-navy-900 shadow'
                        : 'bg-navy-800 text-amber-300 hover:bg-navy-700'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>PGE Higher Officer Desk</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveView('mission-dashboard')}
                    className={`px-3 py-1.5 text-xs font-bold rounded flex items-center gap-1.5 transition ${
                      activeView === 'mission-dashboard'
                        ? 'bg-amber-400 text-navy-900 shadow'
                        : 'bg-navy-800 text-amber-300 hover:bg-navy-700'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Indian Mission Console</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Login Modals */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        isCsc={false}
      />
      <LoginModal
        isOpen={cscLoginOpen}
        onClose={() => setCscLoginOpen(false)}
        isCsc={true}
      />

      {/* Info Modals */}
      <InfoModal
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
      />
    </>
  );
};
