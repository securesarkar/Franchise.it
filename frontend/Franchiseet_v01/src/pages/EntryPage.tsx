import { useNavigate } from 'react-router-dom';
import { Handshake, ArrowRight, Users, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

const EntryPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d2a855]/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        className="relative z-10 w-full max-w-md text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Logo */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-[#d2a855] to-[#a88644] rounded-xl flex items-center justify-center shadow-lg shadow-[#d2a855]/20">
            <Handshake className="w-6 h-6 text-[#141414]" />
          </div>
          <div>
            <span className="text-2xl font-bold text-white tracking-tight">Franchise</span>
            <span className="text-2xl font-bold text-[#d2a855] tracking-tight">Match</span>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h1 className="text-4xl font-bold text-white mb-3 leading-tight">
            The smarter way to{' '}
            <span className="text-[#d2a855]">franchise</span>
          </h1>
          <p className="text-white/50 text-base leading-relaxed">
            Connect franchisors and franchisees through intelligent matching.
            Build your future with the right partnership.
          </p>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-2 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {[
            { icon: Users, label: 'For Franchisees' },
            { icon: Building2, label: 'For Franchisors' },
          ].map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm"
            >
              <Icon className="w-3.5 h-3.5 text-[#d2a855]" />
              {label}
            </span>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        >
          {/* Primary — Create Account */}
          <button
            onClick={() => navigate('/signup')}
            className="w-full group flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-gradient-to-r from-[#d2a855] to-[#a88644] text-[#141414] font-semibold text-base hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[#d2a855]/20"
          >
            Create Account
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Secondary — Login */}
          <button
            onClick={() => navigate('/login')}
            className="w-full flex items-center justify-center py-4 px-6 rounded-xl border border-white/15 text-white font-medium text-base hover:bg-white/5 hover:border-white/25 active:scale-[0.98] transition-all duration-200"
          >
            Login
          </button>
        </motion.div>

        {/* Footer note */}
        <motion.p
          className="text-white/30 text-xs mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default EntryPage;