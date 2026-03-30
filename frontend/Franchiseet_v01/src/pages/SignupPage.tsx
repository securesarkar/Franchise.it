import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase';

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignupStore } from '../store/useSignupStore';
import { ArrowRight, ArrowLeft, Mail, Lock, User, Eye, EyeOff, Handshake, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const VALIDATORS = {
  fullName: (v: string) => (!v.trim() ? 'This field is required' : ''),
  email: (v: string) => {
    if (!v.trim()) return 'This field is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return 'Enter a valid email address';
    return '';
  },
  password: (v: string) => {
    if (!v) return 'This field is required';
    if (v.length < 6 || !/[a-zA-Z]/.test(v) || !/[0-9]/.test(v))
      return 'Password must be alphanumeric and at least 6 characters';
    return '';
  },
  confirmPassword: (v: string, pw: string) => {
    if (!v) return 'This field is required';
    if (v !== pw) return 'Passwords do not match';
    return '';
  },
};

const FieldError = ({ message }: { message: string }) => (
  <AnimatePresence>
    {message && (
      <motion.p
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.16 }}
        className="flex items-start gap-1.5 text-xs text-rose-400 mt-1.5 leading-snug"
      >
        <AlertCircle className="w-3 h-3 flex-shrink-0 mt-px" />
        {message}
      </motion.p>
    )}
  </AnimatePresence>
);

interface InputFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  placeholder?: string;
  icon: React.ReactNode;
  rightElement?: React.ReactNode;
  error: string;
  touched: boolean;
}

const InputField = ({ label, type = 'text', value, onChange, onBlur, placeholder, icon, rightElement, error, touched }: InputFieldProps) => {
  const showError = touched && !!error;
  return (
    <div>
      <label className="block text-sm font-medium text-white/60 mb-1.5">
        {label}
        <span className="text-[#e8b84b] ml-1">*</span>
      </label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`
            w-full rounded-xl text-white placeholder:text-white/20 text-sm py-3 pl-10
            focus:outline-none transition-all duration-200
            ${rightElement ? 'pr-11' : 'pr-4'}
            ${showError
              ? 'border border-rose-500/70 focus:border-rose-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]'
              : 'border border-[rgba(139,144,220,0.12)] focus:border-[rgba(124,58,237,0.45)] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.12)]'
            }
          `}
          style={{
            background: 'rgba(8, 10, 22, 0.8)',
            boxShadow: 'inset 0 1px 6px rgba(0,0,0,0.4)',
          }}
        />
        {rightElement && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightElement}</span>
        )}
      </div>
      <FieldError message={showError ? error : ''} />
    </div>
  );
};

const getStrength = (pw: string) => {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[a-zA-Z]/.test(pw) && /[0-9]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  const map = [
    { label: '', color: '' },
    { label: 'Weak', color: 'bg-rose-500' },
    { label: 'Fair', color: 'bg-amber-400' },
    { label: 'Good', color: 'bg-[#e8b84b]' },
    { label: 'Strong', color: 'bg-emerald-400' },
  ];
  return { level: score, ...map[score] };
};

const PasswordStrengthBar = ({ password }: { password: string }) => {
  const { level, label, color } = getStrength(password);
  if (!password || level === 0) return null;
  const labelColor = level === 1 ? 'text-rose-400' : level === 2 ? 'text-amber-400' : level === 3 ? 'text-[#e8b84b]' : 'text-emerald-400';
  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[1,2,3,4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= level ? color : 'bg-white/8'}`} />
        ))}
      </div>
      <p className={`text-xs ${labelColor}`}>{label}</p>
    </div>
  );
};

const StepIndicator = ({ current, total }: { current: number; total: number }) => (
  <div className="flex items-center justify-center gap-2 mb-8">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className={`h-1.5 rounded-full transition-all duration-300 ${
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

interface FormState { fullName: string; email: string; password: string; confirmPassword: string; }
type FieldKey = keyof FormState;

const SignupPage = () => {
  const navigate = useNavigate();
  const { setSignupData } = useSignupStore();

  const [form, setForm] = useState<FormState>({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({ fullName: false, email: false, password: false, confirmPassword: false });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [isLoading, setIsLoading]       = useState(false);

  const errors = useMemo<Record<FieldKey, string>>(() => ({
    fullName: VALIDATORS.fullName(form.fullName),
    email: VALIDATORS.email(form.email),
    password: VALIDATORS.password(form.password),
    confirmPassword: VALIDATORS.confirmPassword(form.confirmPassword, form.password),
  }), [form]);

  const isFormValid = useMemo(() => Object.values(errors).every((e) => e === ''), [errors]);

  const setField = (field: FieldKey) => (value: string) => setForm((p) => ({ ...p, [field]: value }));
  const touchField = (field: FieldKey) => () => setTouched((p) => ({ ...p, [field]: true }));
  const touchAll = () => setTouched({ fullName: true, email: true, password: true, confirmPassword: true });

  const handleContinue = async () => {
    touchAll();
    if (!isFormValid) { toast.error('Please fix the errors before continuing'); return; }
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email.trim(), form.password);
      await updateProfile(userCredential.user, { displayName: form.fullName.trim() });
      setSignupData({ fullName: form.fullName.trim(), email: form.email.trim(), password: form.password });
      navigate('/signup/role');
    } catch (error: any) {
      const msgs: Record<string, string> = {
        'auth/email-already-in-use': 'An account with this email already exists',
        'auth/weak-password': 'Password must be at least 6 characters',
        'auth/invalid-email': 'Invalid email address',
        'auth/network-request-failed': 'Network error. Check your connection.',
        'auth/operation-not-allowed': 'Email/password sign-up is not enabled in Firebase Auth.',
        'auth/configuration-not-found': 'Firebase authentication is not configured correctly.',
      };
      toast.error(msgs[error.code] || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(212,168,58,0.06) 0%, transparent 70%)' }} />

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Logo */}
        <button onClick={() => navigate('/home')}
          className="flex items-center justify-center gap-2 mb-12 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(232,184,75,0.25)]"
            style={{ background: 'linear-gradient(135deg, #e8b84b, #b8921f)' }}>
            <Handshake className="w-5 h-5 text-[#05070f]" />
          </div>
          <div>
            <span className="text-xl font-bold text-white">Franchise</span>
            <span className="text-xl font-bold text-[#e8b84b]">Match</span>
          </div>
        </button>

        <StepIndicator current={1} total={3} />

        {/* Form card */}
        <div className="rounded-2xl p-7 shadow-2xl"
          style={{
            background: 'rgba(9, 12, 26, 0.85)',
            border: '1px solid rgba(139, 144, 220, 0.09)',
            backdropFilter: 'blur(20px)',
          }}>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">Create your account</h2>
            <p className="text-white/45 text-sm">Fill in your details to get started</p>
          </div>

          <div className="space-y-5">
            <InputField label="Full Name" value={form.fullName} onChange={setField('fullName')}
              onBlur={touchField('fullName')} placeholder="John Doe"
              icon={<User className="w-4 h-4" />} error={errors.fullName} touched={touched.fullName} />

            <InputField label="Email Address" type="email" value={form.email} onChange={setField('email')}
              onBlur={touchField('email')} placeholder="john@example.com"
              icon={<Mail className="w-4 h-4" />} error={errors.email} touched={touched.email} />

            <div>
              <InputField label="Password" type={showPassword ? 'text' : 'password'}
                value={form.password} onChange={setField('password')} onBlur={touchField('password')}
                placeholder="Min. 6 chars with letters & numbers"
                icon={<Lock className="w-4 h-4" />}
                rightElement={
                  <button type="button" onClick={() => setShowPassword((s) => !s)}
                    className="text-white/25 hover:text-white/55 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                error={errors.password} touched={touched.password} />
              {form.password && !errors.password && <PasswordStrengthBar password={form.password} />}
            </div>

            <div>
              <InputField label="Confirm Password" type={showConfirm ? 'text' : 'password'}
                value={form.confirmPassword} onChange={setField('confirmPassword')} onBlur={touchField('confirmPassword')}
                placeholder="Re-enter your password"
                icon={<Lock className="w-4 h-4" />}
                rightElement={
                  <button type="button" onClick={() => setShowConfirm((s) => !s)}
                    className="text-white/25 hover:text-white/55 transition-colors">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                error={errors.confirmPassword} touched={touched.confirmPassword} />
              {form.confirmPassword && !errors.confirmPassword && (
                <p className="flex items-center gap-1.5 text-xs text-emerald-400 mt-1.5">
                  <span>✓</span> Passwords match
                </p>
              )}
            </div>
          </div>

          <div className="mt-7">
            <motion.button
              onClick={handleContinue}
              disabled={isLoading}
              whileHover={isFormValid && !isLoading ? { scale: 1.01 } : {}}
              whileTap={isFormValid && !isLoading ? { scale: 0.98 } : {}}
              className={`
                w-full group flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl
                font-semibold text-sm transition-all duration-200
                ${!isLoading && isFormValid
                  ? 'bg-gradient-to-r from-[#e8b84b] to-[#b8921f] text-[#05070f] shadow-[0_4px_24px_rgba(232,184,75,0.3)] cursor-pointer'
                  : 'bg-white/10 text-white/70 cursor-pointer border border-white/15'
                }
              `}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing…
                </span>
              ) : (
                <>
                  Continue
                  <ArrowRight className={`w-4 h-4 transition-transform ${isFormValid ? 'group-hover:translate-x-0.5' : ''}`} />
                </>
              )}
            </motion.button>

            {!isFormValid && (
              <p className="text-center text-white/22 text-xs mt-2">Complete all fields correctly to continue</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between text-sm">
          <button onClick={() => navigate('/entry')}
            className="flex items-center gap-1.5 text-white/35 hover:text-white/65 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
          <p className="text-white/35">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-[#e8b84b] hover:underline font-medium">
              Login
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
