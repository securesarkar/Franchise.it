import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

interface FloatingShape {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

// ── Cursor Glow ───────────────────────────────────────────────────────────────
function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const posRef  = useRef({ x: -999, y: -999 });
  const rafRef  = useRef<number>(0);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };

    const tick = () => {
      if (el) {
        el.style.left = posRef.current.x + 'px';
        el.style.top  = posRef.current.y + 'px';
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '380px', height: '380px',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 1,
        transform: 'translate(-50%, -50%)',
        background: 'radial-gradient(circle, rgba(212,168,58,0.05) 0%, rgba(124,58,237,0.035) 40%, transparent 70%)',
        filter: 'blur(24px)',
        willChange: 'left, top',
        transition: 'opacity 0.3s ease',
      }}
    />
  );
}

// ── Main Animated Background ──────────────────────────────────────────────────
export function AnimatedBackground() {
  const [shapes, setShapes] = useState<FloatingShape[]>([]);

  useEffect(() => {
    const generated: FloatingShape[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 180 + 40,
      duration: Math.random() * 22 + 16,
      delay: Math.random() * 6,
      opacity: Math.random() * 0.025 + 0.008,
    }));
    setShapes(generated);
  }, []);

  return (
    <>
      {/* Cursor energy field */}
      <CursorGlow />

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Animated orbs */}
        <div className="orb orb-gold" style={{ top: '-5%', left: '-10%' }} />
        <div className="orb orb-violet" style={{ top: '20%', right: '-15%' }} />
        <div className="orb orb-indigo" style={{ bottom: '5%', left: '30%' }} />

        {/* Light streak */}
        <div className="light-streak" style={{ top: '0', left: '-10%' }} />

        {/* Subtle floating ring shapes */}
        {shapes.map((shape) => (
          <motion.div
            key={shape.id}
            className="absolute rounded-full"
            style={{
              left: `${shape.x}%`,
              top:  `${shape.y}%`,
              width:  shape.size,
              height: shape.size,
              opacity: shape.opacity,
              border: '1px solid rgba(212,168,58,0.6)',
            }}
            animate={{ y: [0, -25, 0], x: [0, 12, 0], rotate: [0, 180, 360] }}
            transition={{ duration: shape.duration, delay: shape.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139,144,220,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139,144,220,1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Bottom gradient fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40"
          style={{ background: 'linear-gradient(to top, rgba(5,7,15,0.8), transparent)' }}
        />
      </div>
    </>
  );
}

export function ScrollProgressLine() {
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[100] origin-left"
      style={{ background: 'linear-gradient(90deg, #e8b84b, #7c3aed, #4f46e5)' }}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.1 }}
    />
  );
}

interface GlowButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export function GlowButton({ children, onClick, className = '', variant = 'primary' }: GlowButtonProps) {
  const variantStyles = {
    primary: 'btn-gold',
    secondary: 'btn-violet',
    outline: 'glass border border-[rgba(212,168,58,0.25)] text-[var(--text-primary)] hover:border-[rgba(212,168,58,0.55)]',
  };

  return (
    <motion.button
      onClick={onClick}
      className={`relative px-6 py-3 rounded-xl font-medium transition-all duration-300 overflow-hidden ${variantStyles[variant]} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
}

export function AnimatedCard({ children, className = '', hoverScale = 1.01 }: AnimatedCardProps) {
  return (
    <motion.div
      className={`card ${className}`}
      whileHover={{ scale: hoverScale, y: -4, boxShadow: '0 20px 48px rgba(0,0,0,0.6), 0 0 30px rgba(212,168,58,0.07)' }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function MagneticButton({ children, onClick, className = '' }: MagneticButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative px-6 py-3 rounded-xl font-medium ${className}`}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  );
}
