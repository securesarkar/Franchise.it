import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Brain, CheckCircle2 } from 'lucide-react';

// ── Question Bank ─────────────────────────────────────────────────────────────
interface Question {
  id: number;
  category: 'personality' | 'business' | 'risk' | 'leadership' | 'operational';
  text: string;
  options: { label: string; value: string; score: Record<string, number> }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1, category: 'personality',
    text: 'When facing a new challenge, your first instinct is to:',
    options: [
      { label: 'Research thoroughly before acting', value: 'A', score: { analytical: 2, risk: 0 } },
      { label: 'Jump in and learn as you go', value: 'B', score: { analytical: 0, risk: 2 } },
      { label: 'Consult with others for guidance', value: 'C', score: { collaborative: 2, risk: 1 } },
      { label: 'Create a structured plan first', value: 'D', score: { analytical: 2, structured: 2 } },
    ],
  },
  {
    id: 2, category: 'risk',
    text: 'You have ₹50 lakhs to invest. Which option appeals to you most?',
    options: [
      { label: 'Safe FD with guaranteed 7% returns', value: 'A', score: { risk: 0, conservative: 3 } },
      { label: 'Diversified mutual funds — moderate risk', value: 'B', score: { risk: 1, balanced: 2 } },
      { label: 'High-growth startup — potential 10x', value: 'C', score: { risk: 3, aggressive: 3 } },
      { label: 'Franchise business with proven model', value: 'D', score: { risk: 2, entrepreneurial: 3 } },
    ],
  },
  {
    id: 3, category: 'leadership',
    text: 'How would your colleagues describe your leadership style?',
    options: [
      { label: 'Visionary — big-picture thinker', value: 'A', score: { visionary: 3, detail: 0 } },
      { label: 'Collaborative — team consensus', value: 'B', score: { collaborative: 3, autonomous: 0 } },
      { label: 'Results-driven — outcomes first', value: 'C', score: { driven: 3, empathetic: 0 } },
      { label: 'Supportive — develop people', value: 'D', score: { empathetic: 3, driven: 1 } },
    ],
  },
  {
    id: 4, category: 'business',
    text: 'A franchise opportunity needs 18 months to break even. You:',
    options: [
      { label: 'Walk away — too long to wait', value: 'A', score: { patience: 0, risk: 0 } },
      { label: 'Negotiate to reduce the timeline', value: 'B', score: { negotiation: 3, driven: 2 } },
      { label: 'Accept it if the long-term returns are strong', value: 'C', score: { patience: 3, analytical: 2 } },
      { label: 'Ask for more data before deciding', value: 'D', score: { analytical: 3, patience: 1 } },
    ],
  },
  {
    id: 5, category: 'operational',
    text: 'Your ideal daily work environment is:',
    options: [
      { label: 'High energy, customer-facing interactions', value: 'A', score: { extrovert: 3, operational: 2 } },
      { label: 'Strategic planning & analysis behind the scenes', value: 'B', score: { analytical: 3, introvert: 2 } },
      { label: 'Managing and coaching a team', value: 'C', score: { leadership: 3, collaborative: 2 } },
      { label: 'Building systems and processes', value: 'D', score: { structured: 3, operational: 3 } },
    ],
  },
  {
    id: 6, category: 'risk',
    text: 'What worries you most about owning a franchise?',
    options: [
      { label: 'Losing my initial investment', value: 'A', score: { risk: 0, conservative: 2 } },
      { label: 'Not having full creative control', value: 'B', score: { autonomous: 3, creative: 2 } },
      { label: 'Managing employees effectively', value: 'C', score: { leadership: 2, operational: 1 } },
      { label: 'Market changes affecting the business', value: 'D', score: { analytical: 2, risk: 1 } },
    ],
  },
  {
    id: 7, category: 'personality',
    text: 'How do you typically make important decisions?',
    options: [
      { label: 'Data and numbers guide me', value: 'A', score: { analytical: 3, gut: 0 } },
      { label: 'Gut feeling and intuition', value: 'B', score: { gut: 3, analytical: 0 } },
      { label: 'I weigh both data and intuition', value: 'C', score: { analytical: 2, gut: 2 } },
      { label: 'Advice from trusted mentors', value: 'D', score: { collaborative: 3, conservative: 1 } },
    ],
  },
  {
    id: 8, category: 'business',
    text: 'Which franchise sector excites you most?',
    options: [
      { label: 'Food & Beverage (QSR, cafes, restaurants)', value: 'A', score: { food: 3, operational: 2 } },
      { label: 'Education & Skill Development', value: 'B', score: { education: 3, empathetic: 2 } },
      { label: 'Health, Wellness & Fitness', value: 'C', score: { health: 3, driven: 2 } },
      { label: 'Retail & Consumer Brands', value: 'D', score: { retail: 3, extrovert: 2 } },
    ],
  },
  {
    id: 9, category: 'leadership',
    text: 'When a team member is underperforming, you:',
    options: [
      { label: 'Have a direct conversation about expectations', value: 'A', score: { driven: 2, direct: 3 } },
      { label: 'Identify root cause and coach them', value: 'B', score: { empathetic: 3, leadership: 2 } },
      { label: 'Give them a structured improvement plan', value: 'C', score: { structured: 3, leadership: 2 } },
      { label: 'Consider whether they are in the right role', value: 'D', score: { analytical: 2, leadership: 3 } },
    ],
  },
  {
    id: 10, category: 'risk',
    text: 'The franchise brand you love has high franchise fees. You:',
    options: [
      { label: 'Pass — too expensive upfront', value: 'A', score: { risk: 0, conservative: 3 } },
      { label: 'Explore financing options aggressively', value: 'B', score: { risk: 2, driven: 3 } },
      { label: 'Negotiate the fees with the franchisor', value: 'C', score: { negotiation: 3, risk: 1 } },
      { label: 'Evaluate ROI carefully before deciding', value: 'D', score: { analytical: 3, balanced: 2 } },
    ],
  },
  {
    id: 11, category: 'operational',
    text: 'How hands-on do you plan to be in day-to-day operations?',
    options: [
      { label: 'Very hands-on — I will be on the floor daily', value: 'A', score: { operational: 3, extrovert: 2 } },
      { label: 'Mostly strategic — hire good managers', value: 'B', score: { visionary: 3, delegator: 3 } },
      { label: 'Balanced — involved but not micro-managing', value: 'C', score: { balanced: 3, leadership: 2 } },
      { label: 'Flexible — depends on business needs', value: 'D', score: { adaptive: 3, balanced: 1 } },
    ],
  },
  {
    id: 12, category: 'personality',
    text: 'In a meeting with differing opinions, you typically:',
    options: [
      { label: 'Advocate strongly for your view', value: 'A', score: { driven: 3, direct: 2 } },
      { label: 'Listen first, then offer your perspective', value: 'B', score: { collaborative: 2, empathetic: 3 } },
      { label: 'Find the common ground between views', value: 'C', score: { collaborative: 3, balanced: 2 } },
      { label: 'Ask clarifying questions to understand all sides', value: 'D', score: { analytical: 3, collaborative: 2 } },
    ],
  },
  {
    id: 13, category: 'business',
    text: 'Your ideal franchisor relationship is:',
    options: [
      { label: 'Very supportive — hand-holding is fine', value: 'A', score: { support: 3, conservative: 1 } },
      { label: 'Collaborative — we work as partners', value: 'B', score: { collaborative: 3, balanced: 2 } },
      { label: 'Hands-off — give me the playbook and step back', value: 'C', score: { autonomous: 3, driven: 2 } },
      { label: 'Flexible — different support at different stages', value: 'D', score: { adaptive: 3, balanced: 2 } },
    ],
  },
  {
    id: 14, category: 'risk',
    text: 'How much of your total savings would you comfortably invest in a franchise?',
    options: [
      { label: 'Less than 20%', value: 'A', score: { risk: 0, conservative: 3 } },
      { label: '20–40%', value: 'B', score: { risk: 1, balanced: 2 } },
      { label: '40–70%', value: 'C', score: { risk: 2, entrepreneurial: 2 } },
      { label: 'More than 70% — all-in for the right opportunity', value: 'D', score: { risk: 3, aggressive: 3 } },
    ],
  },
  {
    id: 15, category: 'personality',
    text: 'What motivates you most about owning a franchise?',
    options: [
      { label: 'Financial freedom and wealth creation', value: 'A', score: { driven: 2, entrepreneurial: 3 } },
      { label: 'Building something with a trusted brand', value: 'B', score: { collaborative: 2, structured: 2 } },
      { label: 'Creating local employment and community impact', value: 'C', score: { empathetic: 3, leadership: 2 } },
      { label: 'Proving my entrepreneurial skills', value: 'D', score: { driven: 3, autonomous: 2 } },
    ],
  },
];

// ── Score → Profile ───────────────────────────────────────────────────────────
function computeProfile(answers: Record<number, string>) {
  const totals: Record<string, number> = {};

  QUESTIONS.forEach((q) => {
    const chosen = q.options.find((o) => o.value === answers[q.id]);
    if (!chosen) return;
    Object.entries(chosen.score).forEach(([key, val]) => {
      totals[key] = (totals[key] || 0) + val;
    });
  });

  // Risk tolerance 0-10
  const riskTolerance = Math.min(10, Math.round((totals.risk || 0) * 10 / 6));

  // Leadership style
  const leadershipMap: [string, string][] = [
    ['visionary', 'Visionary Leader'],
    ['empathetic', 'Empathetic Coach'],
    ['driven', 'Results Driver'],
    ['collaborative', 'Collaborative Builder'],
  ];
  let leadershipStyle = 'Balanced Manager';
  let lMax = 0;
  leadershipMap.forEach(([key, label]) => {
    if ((totals[key] || 0) > lMax) { lMax = totals[key]; leadershipStyle = label; }
  });

  // Decision making
  const decisionMaking = (totals.analytical || 0) > (totals.gut || 0)
    ? 'Data-Driven Analyst'
    : (totals.gut || 0) > (totals.collaborative || 0)
    ? 'Intuitive Entrepreneur'
    : 'Collaborative Decision Maker';

  // Work ethic
  const workEthic = Math.min(10, Math.round(((totals.driven || 0) + (totals.operational || 0)) * 10 / 12));

  // Communication style
  const communicationStyle = (totals.extrovert || 0) > (totals.introvert || 0)
    ? 'Outgoing & Direct'
    : 'Thoughtful & Analytical';

  // Suitable categories
  const categoryMap: Record<string, string> = {
    food: 'Food & Beverage',
    education: 'Education & Training',
    health: 'Health & Wellness',
    retail: 'Retail & Consumer Brands',
  };
  const suitableCategories: string[] = Object.entries(categoryMap)
    .filter(([key]) => (totals[key] || 0) >= 2)
    .map(([, label]) => label);

  if (suitableCategories.length === 0) suitableCategories.push('Technology & Services', 'Business Support');

  return { riskTolerance, leadershipStyle, decisionMaking, workEthic, communicationStyle, suitableCategories };
}

// ── PsychometricTest Component ────────────────────────────────────────────────
interface PsychometricTestProps {
  onComplete: (result: ReturnType<typeof computeProfile>) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  personality: '🧠 Personality',
  business: '💼 Business Mindset',
  risk: '⚡ Risk Appetite',
  leadership: '👥 Leadership',
  operational: '⚙️ Operations',
};

export function PsychometricTest({ onComplete }: PsychometricTestProps) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selected, setSelected]  = useState<string | null>(null);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [finished, setFinished]   = useState(false);

  const q = QUESTIONS[current];
  const total = QUESTIONS.length;
  const progress = ((current) / total) * 100;
  const isAnswered = !!selected || !!answers[q.id];
  const displaySelected = selected ?? answers[q.id] ?? null;

  const handleSelect = (value: string) => setSelected(value);

  const handleNext = () => {
    if (!displaySelected) return;
    const newAnswers = { ...answers, [q.id]: displaySelected };
    setAnswers(newAnswers);

    if (current < total - 1) {
      setDirection('forward');
      setSelected(null);
      setCurrent((c) => c + 1);
    } else {
      setFinished(true);
      const result = computeProfile(newAnswers);
      setTimeout(() => onComplete(result), 1800);
    }
  };

  const handleBack = () => {
    if (current === 0) return;
    setDirection('back');
    setSelected(null);
    setCurrent((c) => c - 1);
  };

  const variants = {
    enter: (dir: 'forward' | 'back') => ({
      opacity: 0, x: dir === 'forward' ? 48 : -48,
    }),
    center: { opacity: 1, x: 0 },
    exit: (dir: 'forward' | 'back') => ({
      opacity: 0, x: dir === 'forward' ? -48 : 48,
    }),
  };

  if (finished) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-[400px] gap-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <motion.div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #e8b84b, #7c3aed)' }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
        >
          <CheckCircle2 className="w-10 h-10 text-white" />
        </motion.div>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Analysis Complete!</h3>
          <p className="text-[var(--text-secondary)]">Building your personalised franchise profile…</p>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ background: '#e8b84b' }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #e8b84b, #7c3aed)' }}>
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-[var(--text-muted)] text-xs uppercase tracking-widest">Psychometric Analysis</p>
            <p className="text-white/70 text-xs mt-0.5">{CATEGORY_LABELS[q.category]}</p>
          </div>
          <span className="ml-auto text-[var(--text-muted)] text-xs">
            {current + 1} / {total}
          </span>
        </div>

        {/* Progress bar */}
        <div className="psych-progress-track">
          <div className="psych-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={q.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Question */}
          <h3 className="text-lg font-semibold text-white mb-6 leading-snug">{q.text}</h3>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {q.options.map((option) => {
              const isChosen = displaySelected === option.value;
              return (
                <motion.button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`
                    w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 focus:outline-none
                    ${isChosen
                      ? 'border-[rgba(212,168,58,0.6)] bg-[rgba(212,168,58,0.07)] shadow-[0_0_20px_rgba(212,168,58,0.1)]'
                      : 'border-[rgba(139,144,220,0.1)] bg-[rgba(9,12,26,0.6)] hover:border-[rgba(139,144,220,0.22)] hover:bg-[rgba(9,12,26,0.8)]'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200
                      ${isChosen ? 'border-[#e8b84b] bg-[#e8b84b]' : 'border-[rgba(139,144,220,0.25)]'}
                    `}>
                      {isChosen && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2.5 h-2.5 rounded-full bg-[#05070f]"
                        />
                      )}
                    </div>
                    <span className={`text-sm ${isChosen ? 'text-white font-medium' : 'text-[var(--text-secondary)]'}`}>
                      {option.label}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          disabled={current === 0}
          className="flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>

        <motion.button
          onClick={handleNext}
          disabled={!isAnswered}
          whileHover={isAnswered ? { scale: 1.02 } : {}}
          whileTap={isAnswered ? { scale: 0.98 } : {}}
          className={`
            flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200
            ${isAnswered
              ? 'bg-gradient-to-r from-[#e8b84b] to-[#b8921f] text-[#05070f] shadow-[0_4px_20px_rgba(212,168,58,0.35)] cursor-pointer'
              : 'bg-[rgba(139,144,220,0.06)] text-[var(--text-muted)] cursor-not-allowed'
            }
          `}
        >
          {current === total - 1 ? 'Complete Analysis' : 'Next Question'}
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
}

export { computeProfile };
export type { Question };
