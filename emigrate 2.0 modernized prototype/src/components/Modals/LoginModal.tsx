import React, { useState } from 'react';
import { useEmigrate } from '../../context/EmigrateContext';
import { UserRole } from '../../types/emigrate';
import { Shield, KeyRound, UserCheck, AlertCircle, Building, CheckCircle, Sparkles } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  isCsc?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, isCsc = false }) => {
  const { login } = useEmigrate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'POE' | 'PGE' | 'MISSION' | 'CSC'>('POE');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isCsc || role === 'CSC') {
      login('PUBLIC', 'CSC_VILLAGE_OFFICER_DEL');
      onClose();
      return;
    }

    // Role-based validation
    if (role === 'POE') {
      if (username.toUpperCase() === 'POE' && password === 'POE@123') {
        login('POE', 'Protector of Emigrants (PoE Delhi)');
        onClose();
      } else {
        setError('Invalid PoE credentials. Use demo shortcut: POE / POE@123');
      }
    } else if (role === 'PGE') {
      if (username.toUpperCase() === 'PGE' && password === 'PGE@123') {
        login('PGE', 'Protector General of Emigrants (Higher Officer Desk)');
        onClose();
      } else {
        setError('Invalid PGE credentials. Use demo shortcut: PGE / PGE@123');
      }
    } else if (role === 'MISSION') {
      if (username.toUpperCase() === 'MISSION' && password === 'MISSION@123') {
        login('MISSION', 'Consular Executive (Embassy of India, UAE)');
        onClose();
      } else {
        setError('Invalid Mission credentials. Use demo shortcut: MISSION / MISSION@123');
      }
    }
  };

  const handleFillDemo = (targetRole: 'POE' | 'PGE' | 'MISSION') => {
    setRole(targetRole);
    if (targetRole === 'POE') {
      setUsername('POE');
      setPassword('POE@123');
    } else if (targetRole === 'PGE') {
      setUsername('PGE');
      setPassword('PGE@123');
    } else {
      setUsername('MISSION');
      setPassword('MISSION@123');
    }
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full border border-slate-300 overflow-hidden">
        {/* Tricolor Stripe */}
        <div className="tricolor-stripe" />

        {/* Header */}
        <div className="bg-navy-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-navy-800 rounded-md border border-navy-700">
              <Shield className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {isCsc ? 'Common Services Centre (CSC) Gateway' : 'Sovereign Administrative Login'}
              </h3>
              <p className="text-xs text-slate-300">
                {isCsc ? 'Assisted Digital India Filing Terminal' : 'MEA Sovereign Authentication Portal'}
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

        {/* Demo Fast Track Pill */}
        {!isCsc && (
          <div className="bg-amber-50 border-b border-amber-200 p-3 text-xs text-amber-900 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Evaluator Demo Shortcuts:</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleFillDemo('POE')}
                className="px-2 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded font-semibold text-[11px] text-navy-900 transition flex items-center justify-center gap-1"
              >
                <UserCheck className="w-3 h-3 text-emerald-600" />
                Fill PoE (PoE@123)
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('PGE')}
                className="px-2 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded font-semibold text-[11px] text-navy-900 transition flex items-center justify-center gap-1"
              >
                <Shield className="w-3 h-3 text-amber-600" />
                Fill PGE (PGE@123)
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('MISSION')}
                className="px-2 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded font-semibold text-[11px] text-navy-900 transition flex items-center justify-center gap-1"
              >
                <Building className="w-3 h-3 text-blue-600" />
                Fill Mission
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!isCsc ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Select Institutional Role
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setRole('POE');
                    setError(null);
                  }}
                  className={`py-2 px-2 text-xs font-semibold rounded border text-left flex flex-col gap-0.5 transition ${
                    role === 'POE'
                      ? 'bg-navy-900 text-white border-navy-900'
                      : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-1 font-bold">
                    <Shield className="w-3.5 h-3.5" />
                    <span>PoE Officer</span>
                  </div>
                  <div className="text-[10px] opacity-80">Frontline Scrutiny</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole('PGE');
                    setError(null);
                  }}
                  className={`py-2 px-2 text-xs font-semibold rounded border text-left flex flex-col gap-0.5 transition ${
                    role === 'PGE'
                      ? 'bg-navy-900 text-white border-navy-900'
                      : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-1 font-bold">
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span>PGE (Higher)</span>
                  </div>
                  <div className="text-[10px] opacity-80">Final EC Grant</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole('MISSION');
                    setError(null);
                  }}
                  className={`py-2 px-2 text-xs font-semibold rounded border text-left flex flex-col gap-0.5 transition ${
                    role === 'MISSION'
                      ? 'bg-navy-900 text-white border-navy-900'
                      : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-1 font-bold">
                    <Building className="w-3.5 h-3.5 text-blue-400" />
                    <span>Mission</span>
                  </div>
                  <div className="text-[10px] opacity-80">Employer Attest</div>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded text-xs text-blue-900">
              <strong>Common Services Centre VLE Mode:</strong> Assisted submission portal for Gram Panchayat VLE operators filing on behalf of rural migrant workers.
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isCsc ? 'CSC VLE Operator ID' : 'Official Username / Government ID'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={isCsc ? 'e.g. VLE-UP-99214' : role === 'POE' ? 'POE' : 'MISSION'}
                required
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-navy-900 focus:outline-none"
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Secure Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-navy-900 focus:outline-none"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 text-red-700 rounded text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-navy-900 hover:bg-navy-800 text-white font-bold text-sm rounded shadow transition flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              {isCsc ? 'Access CSC Terminal' : `Authenticate as ${role === 'POE' ? 'PoE Executive' : 'Mission Officer'}`}
            </button>
          </div>
        </form>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-[11px] text-slate-500 text-center">
          National Informatics Centre (NIC) Sovereign Security Layer • 256-bit TLS Encrypted
        </div>
      </div>
    </div>
  );
};
