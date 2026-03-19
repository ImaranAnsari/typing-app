import { motion, Variants } from 'framer-motion';
import { Zap, Trophy, BarChart2, Clock, Code2, FileText, ChevronRight, Shield } from 'lucide-react';
import type { HistoryEntry } from '../types';

const FEATURES = [
  { icon: <Code2 size={20} />, title: 'Code Practice', desc: 'Type from your own JS/TS/JSX/TSX files. Build real muscle memory for actual syntax.' },
  { icon: <FileText size={20} />, title: 'Text & PDF Mode', desc: 'Upload books, docs, or markdown files to practice prose at any length.' },
  { icon: <Trophy size={20} />, title: 'Leaderboard', desc: 'Top 10 personal scores saved locally. Always chasing a new best.' },
  { icon: <BarChart2 size={20} />, title: 'Progress Charts', desc: 'Every session logged — WPM, accuracy, duration. Watch yourself improve over time.' },
  { icon: <Clock size={20} />, title: 'Countdown Mode', desc: 'Race against the clock with adaptive timers tuned to Easy, Medium, or Hard.' },
  { icon: <Shield size={20} />, title: '100% Private', desc: 'Everything runs in your browser. No files ever leave your machine.' },
];

const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp: Variants = { 
  hidden: { opacity: 0, y: 20 }, 
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.45, ease: 'easeOut' } 
  } 
};

interface Props {
  onStart: () => void;
  leaderboard: HistoryEntry[];
  history: HistoryEntry[];
}

function StatBadge({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="landing-stat-badge">
      <span className="landing-stat-value">{value}</span>
      <span className="landing-stat-label">{label}</span>
    </div>
  );
}

export default function LandingPage({ onStart, leaderboard, history }: Props) {
  const bestWpm = leaderboard.length > 0 ? leaderboard[0].wpm : null;
  const totalRuns = history.length;
  const avgWpm = history.length > 0
    ? Math.round(history.reduce((s, h) => s + h.wpm, 0) / history.length)
    : null;

  return (
    <motion.div className="landing-page" variants={stagger} initial="hidden" animate="show">
      {/* Hero */}
      <motion.div className="landing-hero" variants={fadeUp}>
        <div className="landing-logo-ring">
          <Zap size={32} color="var(--accent-color)" />
        </div>
        <h1 className="landing-title">
          Type<span className="landing-title-accent">Node</span>
        </h1>
        <p className="landing-subtitle">
          Typing practice built for developers.<br />
          Use your own code. Track your progress. Ship faster.
        </p>

        {(bestWpm || totalRuns > 0) && (
          <div className="landing-personal-stats">
            {bestWpm && <StatBadge value={`${bestWpm}`} label="Best WPM" />}
            {avgWpm && <StatBadge value={`${avgWpm}`} label="Avg WPM" />}
            {totalRuns > 0 && <StatBadge value={totalRuns} label="Runs" />}
          </div>
        )}

        <motion.button
          className="primary landing-cta"
          onClick={onStart}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          Get Started <ChevronRight size={18} />
        </motion.button>

        <p className="landing-privacy-note">
          <Shield size={13} /> Everything runs locally — no uploads, no accounts.
        </p>
      </motion.div>

      <motion.div className="landing-divider" variants={fadeUp} />

      {/* Feature grid */}
      <motion.div className="landing-features" variants={stagger}>
        {FEATURES.map((f, i) => (
          <motion.div className="landing-feature-card glass-panel" key={i} variants={fadeUp}>
            <div className="landing-feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div className="landing-bottom-cta" variants={fadeUp}>
        <span>Ready to level up?</span>
        <button className="secondary small" onClick={onStart}>
          Start Practicing <ChevronRight size={14} />
        </button>
      </motion.div>
    </motion.div>
  );
}
