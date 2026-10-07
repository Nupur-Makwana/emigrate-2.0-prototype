import React, { useState, useEffect, useRef } from 'react';
import { useEmigrate } from '../context/EmigrateContext';
import {
  MessageSquare,
  X,
  Send,
  Mic,
  MicOff,
  Headphones,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Ticket,
  ChevronDown,
  PhoneCall,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'mitra';
  text: string;
  timestamp: string;
  card?: 'track' | 'ticket' | 'mrw' | 'rule25';
}

export const EmigrateMitra: React.FC = () => {
  const {
    isMitraOpen,
    setIsMitraOpen,
    prefilledMitraQuery,
    setPrefilledMitraQuery,
    createSupportTicket,
    emigrants,
  } = useEmigrate();

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketMobile, setTicketMobile] = useState('+91-9876543210');
  const [ticketEmail, setTicketEmail] = useState('pravasi@example.com');
  const [ticketSubject, setTicketSubject] = useState('Urgent Help regarding Emigration Clearance');
  const [generatedTicketId, setGeneratedTicketId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'mitra',
      text: 'Namaste! I am eMigrate Mitra (ई-माइग्रेट सहायक), your 24x7 bilingual migration welfare guide. How may I assist you with your ECR clearance, MRW wages, or licensed agents today?',
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<number[]>([]);

  // Clear pending timers when the widget unmounts
  useEffect(() => {
    const timers = timersRef;
    return () => timers.current.forEach((t) => window.clearTimeout(t));
  }, []);

  // Scroll to bottom on message update
  useEffect(() => {
    if (isMitraOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isMitraOpen]);

  const handleSend = (queryText?: string) => {
    const query = queryText || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');

    // Generate responsive reply based on content
    const replyTimer = window.setTimeout(() => {
      let replyText = '';
      let cardType: ChatMessage['card'] | undefined = undefined;

      const lower = query.toLowerCase();

      if (lower.includes('rule 25') || lower.includes('fee limit') || lower.includes('agent charge') || lower.includes('cost')) {
        replyText =
          'Under Rule 25 of the Emigration Rules, a licensed Recruiting Agent cannot charge more than ₹30,000 + GST. All visa and flight expenses must be paid by the employer. Demanding more is illegal.';
        cardType = 'rule25';
      } else if (lower.includes('wage') || lower.includes('mrw') || lower.includes('minimum salary')) {
        replyText =
          'The Minimum Referral Wage (MRW) ensures zero wage theft. For example: Construction Mason in UAE is AED 1,250; Driver in Saudi Arabia is SAR 1,550. Employers cannot pay below this MEA baseline.';
        cardType = 'mrw';
      } else if (lower.includes('pbby') || lower.includes('insurance')) {
        replyText =
          'Pravasi Bharatiya Bima Yojana (PBBY) provides mandatory ₹10 Lakh accidental death and disability cover. The policy is linked to your passport and verified before departure.';
      } else if (lower.includes('arn') || lower.includes('track') || lower.includes('status')) {
        replyText =
          'To track your application, enter your ARN (e.g. ARN-2026-DXB-9012) into the Track Application modal or type it here. Your clearance status updates in real-time as officers complete scrutiny.';
        cardType = 'track';
      } else if (lower.includes('ecr') || lower.includes('passport')) {
        replyText =
          'ECR (Emigration Check Required) passports require clearance before working in 18 notified countries. If you have passed 10th standard or higher, you qualify for ECNR status upon passport renewal.';
      } else {
        replyText =
          'I have noted your query. The MEA Pravasi Bharatiya Sahayata Kendra (PBSK) is also available 24x7 at toll-free 1800-11-3090. You can also generate an official support ticket below for direct officer follow-up.';
      }

      const mitraMsg: ChatMessage = {
        id: `m-${Date.now()}`,
        sender: 'mitra',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        card: cardType,
      };

      setMessages((prev) => [...prev, mitraMsg]);
    }, 600);
    timersRef.current.push(replyTimer);
  };

  // Always call the latest handleSend from the prefilled-query effect
  const handleSendRef = useRef(handleSend);
  handleSendRef.current = handleSend;

  // Handle prefilled query from form fields
  useEffect(() => {
    if (prefilledMitraQuery) {
      setIsMitraOpen(true);
      handleSendRef.current(prefilledMitraQuery);
      setPrefilledMitraQuery(null);
    }
  }, [prefilledMitraQuery, setIsMitraOpen, setPrefilledMitraQuery]);

  // Simulate voice input for low-literacy rural applicants
  const handleToggleVoice = () => {
    if (!isListening) {
      setIsListening(true);
      const voiceTimer = window.setTimeout(() => {
        setIsListening(false);
        handleSend('Check Minimum Referral Wage for Driver in Saudi Arabia');
      }, 2500);
      timersRef.current.push(voiceTimer);
    } else {
      setIsListening(false);
    }
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const tid = createSupportTicket(
      'Emigration Clearance Query',
      ticketSubject,
      'Applicant requested support via eMigrate Mitra assistant.',
      ticketMobile,
      ticketEmail
    );
    setGeneratedTicketId(tid);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-5 right-5 z-40">
        {!isMitraOpen ? (
          <button
            id="tour-mitra-fab"
            onClick={() => setIsMitraOpen(true)}
            className="group flex items-center gap-2.5 bg-navy-900 hover:bg-navy-800 text-white pl-4 pr-5 py-3 rounded-full shadow-2xl border-2 border-amber-400 transition transform hover:scale-105"
            aria-label="Open eMigrate Mitra Assistant"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-amber-400 text-navy-900 flex items-center justify-center font-bold shadow-xs">
                <Sparkles className="w-4 h-4 fill-current" />
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5 border-2 border-navy-900" />
            </div>
            <div className="text-left leading-tight">
              <div className="text-xs font-bold text-amber-400">eMigrate Mitra</div>
              <div className="text-[10px] text-slate-300">24x7 Help Assistant</div>
            </div>
          </button>
        ) : null}
      </div>

      {/* Floating Chat Window */}
      {isMitraOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col h-[520px] animate-in slide-in-from-bottom-5 duration-200">
          <div className="tricolor-stripe" />

          {/* Chat Header */}
          <div className="bg-navy-900 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-400 text-navy-900 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-white flex items-center gap-1.5">
                  <span>eMigrate Mitra • ई-माइग्रेट सहायक</span>
                </h3>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  PBSK Sovereign AI Gateway Online
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsMitraOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-navy-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Action Chips Bar */}
          <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 flex gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
            <button
              onClick={() => handleSend('What is Rule 25 recruitment fee limit?')}
              className="bg-white hover:bg-slate-200 text-navy-900 px-2 py-0.5 rounded border border-slate-300 whitespace-nowrap font-medium transition"
            >
              Rule 25 Fee Cap (₹30k)
            </button>
            <button
              onClick={() => handleSend('Check Minimum Wage for my country')}
              className="bg-white hover:bg-slate-200 text-navy-900 px-2 py-0.5 rounded border border-slate-300 whitespace-nowrap font-medium transition"
            >
              MRW Wages
            </button>
            <button
              onClick={() => handleSend('How does PBBY insurance work?')}
              className="bg-white hover:bg-slate-200 text-navy-900 px-2 py-0.5 rounded border border-slate-300 whitespace-nowrap font-medium transition"
            >
              PBBY Insurance
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs bg-slate-50/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-xl leading-relaxed shadow-xs ${
                    m.sender === 'user'
                      ? 'bg-navy-900 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  <p>{m.text}</p>

                  {/* Context Cards */}
                  {m.card === 'rule25' && (
                    <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-amber-900 bg-amber-50 p-2 rounded">
                      <strong>Section 25 Notice:</strong> If an agent demands cash, flight charges, or medical fees, report them to MEA immediately at <strong>1800-11-3090</strong>.
                    </div>
                  )}

                  {m.card === 'mrw' && (
                    <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-emerald-900 bg-emerald-50 p-2 rounded">
                      <strong>Protection:</strong> Your employment contract must match or exceed the statutory MRW before clearance is granted.
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}

            {isListening && (
              <div className="flex items-center gap-2 p-2.5 bg-red-50 text-red-700 rounded border border-red-200 text-xs animate-pulse">
                <Mic className="w-4 h-4 text-red-600 animate-spin" />
                <span>Simulating voice transcription: Listening to dialect input...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Helpdesk Ticket Escalation Prompt */}
          <div className="bg-slate-100 px-3 py-1.5 border-t border-slate-200 flex items-center justify-between text-[11px]">
            <span className="text-slate-600 font-medium">Unresolved issue?</span>
            <button
              onClick={() => setShowTicketModal(true)}
              className="text-navy-900 hover:text-navy-800 font-bold flex items-center gap-1"
            >
              <Ticket className="w-3 h-3 text-amber-600" />
              <span>Send Query to PBSK Helpdesk</span>
            </button>
          </div>

          {/* Chat Input Controls */}
          <div className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`p-2 rounded-full transition ${
                isListening ? 'bg-red-600 text-white animate-pulse' : 'text-slate-500 hover:bg-slate-100'
              }`}
              title="Voice Input (Speech-to-Text Simulation)"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder="Ask Mitra in English, हिन्दी, etc..."
              className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-full focus:ring-2 focus:ring-navy-900 focus:outline-none"
            />

            <button
              type="button"
              onClick={() => handleSend()}
              className="p-2 bg-navy-900 hover:bg-navy-800 text-white rounded-full transition"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Direct PBSK Helpdesk Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full border border-slate-300 overflow-hidden">
            <div className="tricolor-stripe" />
            <div className="bg-navy-900 text-white px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-white">
                  Lodge Official PBSK Support Ticket
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowTicketModal(false);
                  setGeneratedTicketId(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {generatedTicketId ? (
              <div className="p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-emerald-700" />
                </div>
                <h4 className="font-bold text-sm text-navy-900">Ticket Dispatched to PBSK Helpdesk</h4>
                <div className="p-3 bg-slate-100 border border-slate-200 rounded font-mono font-bold text-navy-900 text-base">
                  {generatedTicketId}
                </div>
                <p className="text-xs text-slate-600">
                  Our 24x7 Pravasi Bharatiya Sahayata Kendra officer will review your grievance and contact you at {ticketMobile}.
                </p>
                <button
                  onClick={() => {
                    setShowTicketModal(false);
                    setGeneratedTicketId(null);
                  }}
                  className="px-4 py-2 bg-navy-900 text-white text-xs font-bold rounded"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateTicket} className="p-5 space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject / Query Topic</label>
                  <input
                    type="text"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Number (with country code)</label>
                  <input
                    type="text"
                    value={ticketMobile}
                    onChange={(e) => setTicketMobile(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email ID</label>
                  <input
                    type="email"
                    value={ticketEmail}
                    onChange={(e) => setTicketEmail(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowTicketModal(false)}
                    className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-navy-900 text-white rounded font-bold hover:bg-navy-800"
                  >
                    Generate Ticket
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
