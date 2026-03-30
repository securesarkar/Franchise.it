import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignupStore } from '../store/useSignupStore';
import { useStore } from '../store/useStore';
import {
  Briefcase, Building2, ArrowRight, ArrowLeft,
  CheckCircle2, Handshake, AlertCircle, Brain,
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { PsychometricTest } from '../components/PsychometricTest';

// ── Step Indicator ────────────────────────────────────────────────────────────
const StepIndicator = ({ current, total }: { current: number; total: number }) => (
  <div className="flex items-center justify-center gap-2 mb-8">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className={`h-1.5 rounded-full transition-all duration-400 ${
          i + 1 === current
            ? 'w-8 bg-[#e8b84b] shadow-[0_0_8px_rgba(232,184,75,0.5)]'
            : i + 1 < current
            ? 'w-4 bg-[#e8b84b]/40'
            : 'w-4 bg-white/8'
        }`}
      />
    ))}
    <span className="text-white/35 text-xs ml-2">Step {current} of {total}</span>
  </div>
);

// ── Role Config ───────────────────────────────────────────────────────────────
const ROLE_CONFIG = {
  franchisee: {
    icon: Briefcase,
    title: 'I am a Franchisee',
    description: 'Looking for franchise opportunities',
    bullets: [
      'Browse curated franchise opportunities',
      'Get matched based on your profile',
      'Connect directly with franchisors',
    ],
  },
  franchisor: {
    icon: Building2,
    title: 'I am a Franchisor',
    description: 'Looking to expand my brand',
    bullets: [
      'List your franchise opportunity',
      'Find qualified franchisee candidates',
      'Scale your brand intelligently',
    ],
  },
} as const;

type RoleKey = keyof typeof ROLE_CONFIG;

// ── Role Card ─────────────────────────────────────────────────────────────────
interface RoleCardProps {
  role: RoleKey;
  selected: boolean;
  hasError: boolean;
  onSelect: () => void;
}

const RoleCard = ({ role, selected, hasError, onSelect }: RoleCardProps) => {
  const { icon: Icon, title, description, bullets } = ROLE_CONFIG[role];
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.985 }}
      className={`
        relative w-full text-left p-6 rounded-2xl border transition-all duration-250 focus:outline-none
        ${selected
          ? 'border-[rgba(232,184,75,0.55)] bg-[rgba(232,184,75,0.06)] shadow-[0_0_30px_rgba(232,184,75,0.09)]'
          : hasError
          ? 'border-rose-500/40 bg-[rgba(9,12,26,0.7)] hover:border-rose-500/60'
          : 'border-[rgba(139,144,220,0.10)] bg-[rgba(9,12,26,0.7)] hover:border-[rgba(139,144,220,0.22)] hover:bg-[rgba(9,12,26,0.85)]'
        }
      `}
    >
      {selected && (
        <span className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#e8b84b] flex items-center justify-center">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#05070f]" />
        </span>
      )}

      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-200 ${
        selected
          ? 'bg-gradient-to-br from-[#e8b84b] to-[#b8921f] shadow-[0_0_20px_rgba(232,184,75,0.3)]'
          : 'bg-[rgba(139,144,220,0.07)]'
      }`}>
        <Icon className={`w-6 h-6 ${selected ? 'text-[#05070f]' : 'text-white/40'}`} />
      </div>

      <h3 className="text-base font-bold text-white mb-1">{title}</h3>
      <p className={`text-sm mb-4 ${selected ? 'text-white/65' : 'text-white/35'}`}>{description}</p>

      <ul className="space-y-2">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-center gap-2">
            <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 transition-colors ${selected ? 'text-[#e8b84b]' : 'text-white/18'}`} />
            <span className={`text-xs ${selected ? 'text-white/55' : 'text-white/28'}`}>{b}</span>
          </li>
        ))}
      </ul>

      {/* Franchisee badge */}
      {role === 'franchisee' && (
        <div className={`mt-4 flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg w-fit transition-all duration-200 ${
          selected
            ? 'bg-[rgba(124,58,237,0.15)] text-[#a78bfa] border border-[rgba(124,58,237,0.25)]'
            : 'bg-[rgba(139,144,220,0.05)] text-white/30 border border-[rgba(139,144,220,0.08)]'
        }`}>
          <Brain className="w-3 h-3" />
          Includes Psychometric Assessment
        </div>
      )}
    </motion.button>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
type PageView = 'role' | 'psychometric';

const RoleSelectionPage = () => {
  const navigate   = useNavigate();
  const { signupData, setSignupData, clearSignupData } = useSignupStore();
  const { setCurrentUser, setAuthenticated, setFirstVisit } = useStore();

  const [selectedRole, setSelectedRole] = useState<RoleKey | null>(null);
  const [roleTouched, setRoleTouched]   = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [view, setView]                 = useState<PageView>('role');

  useEffect(() => {
    if (!signupData?.fullName) navigate('/signup');
  }, []);

  if (!signupData?.fullName) return null;

  const roleError = roleTouched && !selectedRole ? 'Please select a role to continue' : '';

  const handleProceed = () => {
    setRoleTouched(true);
    if (!selectedRole) { toast.error('Please select your role to continue'); return; }

    if (selectedRole === 'franchisee') {
      // Show psychometric test before completing signup
      setView('psychometric');
      return;
    }

    completeSignup(selectedRole, null);
  };

  const handlePsychometricComplete = (result: any) => {
    completeSignup('franchisee', result);
  };

  const completeSignup = (role: RoleKey, psychResult: any) => {
    setIsLoading(true);

    setTimeout(() => {
      const isEmailVal = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      const email = isEmailVal(signupData.email ?? '') ? signupData.email! : '';
      const nameParts = signupData.fullName.split(' ');

      const newUser = {
        id: 'user_' + Date.now(),
        role,
        personalInfo: {
          firstName: nameParts[0] ?? '',
          lastName: nameParts.slice(1).join(' ') ?? '',
          email,
          phone: '', address: '', city: '', state: '', zipCode: '',
        },
        isProfileComplete: false,
        ...(psychResult ? { psychometricResult: psychResult } : {}),
      };

      setCurrentUser(newUser as any);
      setAuthenticated(true);
      setFirstVisit(false);
      setSignupData({ role });
      clearSignupData();
      setIsLoading(false);

      toast.success("Account created! Let's complete your profile.");
      navigate(role === 'franchisee' ? '/onboarding/franchisee' : '/onboarding/franchisor');
    }, 600);
  };

  // ── Psychometric view ────────────────────────────────────────────────────────
  if (view === 'psychometric') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)' }} />

        <motion.div
          className="relative z-10 w-full max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {/* Logo */}
          <button onClick={() => navigate('/home')}
            className="flex items-center justify-center gap-2 mb-10 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #e8b84b, #b8921f)' }}>
              <Handshake className="w-5 h-5 text-[#05070f]" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">Franchise</span>
              <span className="text-xl font-bold text-[#e8b84b]">Match</span>
            </div>
          </button>

          {/* Step indicator: 3 steps total (signup, role, psychometric) */}
          <StepIndicator current={3} total={3} />

          {/* Intro text */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              One more step, {signupData.fullName.split(' ')[0]}!
            </h2>
            <p className="text-[var(--text-secondary)] text-sm">
              Answer 15 quick questions so we can match you with the perfect franchise. Takes ~4 minutes.
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl p-7 shadow-2xl"
            style={{
              background: 'rgba(9, 12, 26, 0.85)',
              border: '1px solid rgba(139, 144, 220, 0.10)',
              backdropFilter: 'blur(20px)',
            }}>
            <PsychometricTest onComplete={handlePsychometricComplete} />
          </div>

          <div className="mt-5 text-center">
            <button onClick={() => setView('role')}
              className="flex items-center gap-1.5 text-white/35 hover:text-white/60 transition-colors mx-auto text-sm">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Role Selection
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Role selection view ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[130px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(212,168,58,0.06) 0%, transparent 70%)' }} />

      <motion.div
        className="relative z-10 w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Logo */}
        <button onClick={() => navigate('/home')}
          className="flex items-center justify-center gap-2 mb-12 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #e8b84b, #b8921f)' }}>
            <Handshake className="w-5 h-5 text-[#05070f]" />
          </div>
          <div>
            <span className="text-xl font-bold text-white">Franchise</span>
            <span className="text-xl font-bold text-[#e8b84b]">Match</span>
          </div>
        </button>

        <StepIndicator current={2} total={3} />

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Hey {signupData.fullName.split(' ')[0]}, what's your role?
          </h2>
          <p className="text-[var(--text-secondary)] text-sm">
            This helps us personalise your FranchiseMatch experience
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          {(['franchisee', 'franchisor'] as RoleKey[]).map((role) => (
            <RoleCard
              key={role}
              role={role}
              selected={selectedRole === role}
              hasError={!!roleError}
              onSelect={() => { setSelectedRole(role); setRoleTouched(true); }}
            />
          ))}
        </div>

        <AnimatePresence>
          {roleError && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16 }}
              className="flex items-center gap-1.5 text-xs text-rose-400 mb-4 justify-center"
            >
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {roleError}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.button
          onClick={handleProceed}
          disabled={isLoading}
          whileHover={selectedRole && !isLoading ? { scale: 1.01 } : {}}
          whileTap={selectedRole && !isLoading ? { scale: 0.98 } : {}}
          className={`
            w-full group flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl
            font-semibold text-sm transition-all duration-200
            ${selectedRole && !isLoading
              ? 'bg-gradient-to-r from-[#e8b84b] to-[#b8921f] text-[#05070f] shadow-[0_4px_24px_rgba(232,184,75,0.3)] cursor-pointer'
              : 'bg-white/5 text-white/25 cursor-not-allowed shadow-none'
            }
          `}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating your account…
            </span>
          ) : (
            <>
              {selectedRole === 'franchisee' ? 'Continue to Assessment' : 'Proceed'}
              <ArrowRight className={`w-4 h-4 transition-transform ${selectedRole ? 'group-hover:translate-x-0.5' : ''}`} />
            </>
          )}
        </motion.button>

        {!selectedRole && (
          <p className="text-center text-white/22 text-xs mt-2">Select a role to proceed</p>
        )}

        <div className="mt-5 text-center">
          <button onClick={() => navigate('/signup')}
            className="flex items-center gap-1.5 text-white/35 hover:text-white/65 transition-colors mx-auto text-sm">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Basic Info
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RoleSelectionPage;
