import { motion } from 'framer-motion';
import { Trophy, X } from 'lucide-react';
import type { HistoryEntry } from '../types';

interface Props {
  leaderboard: HistoryEntry[];
  onClose: () => void;
}

export default function LeaderboardPanel({ leaderboard, onClose }: Props) {
  return (
    <motion.div
      className="overlay"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal glass-panel"
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Trophy size={18} color="var(--accent-color)" />
            <h2>Top Scores</h2>
          </div>
          <button className="secondary small icon-btn" onClick={onClose}><X size={15} /></button>
        </div>

        {leaderboard.length === 0 ? (
          <p className="empty-state">Complete a test to get on the board!</p>
        ) : (
          <div className="leaderboard-list">
            {leaderboard.map((entry, i) => (
              <div key={entry.id} className={`lb-row lb-row--${i < 3 ? `top${i + 1}` : 'normal'}`}>
                <span className="lb-rank">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </span>
                <div className="lb-main">
                  <span className="lb-wpm">{entry.wpm} <small>WPM</small></span>
                  <span className="lb-acc">{entry.accuracy}%</span>
                </div>
                <div className="lb-meta">
                  <span className={`difficulty-badge difficulty-badge--${entry.difficulty}`}>{entry.difficulty}</span>
                  <span className="lb-date">{entry.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
