import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, X, TrendingUp } from 'lucide-react';
import type { HistoryEntry } from '../types';

interface SparklineProps {
  data: number[];
}

function Sparkline({ data }: SparklineProps) {
  if (data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const W = 400, H = 72, pad = 6;

  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (W - pad * 2);
    const y = H - pad - ((v - min) / range) * (H - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const areaPath = `${pad},${H} ${pts.join(' ')} ${W - pad},${H}`;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }} aria-hidden>
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent-color)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--accent-color)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPath} fill="url(#sparkGrad)" />
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke="var(--accent-color)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Latest dot */}
      {(() => {
        const last = pts[pts.length - 1].split(',');
        return <circle cx={last[0]} cy={last[1]} r="3.5" fill="var(--accent-color)" />;
      })()}
    </svg>
  );
}

interface Props {
  history: HistoryEntry[];
  onClose: () => void;
}

export default function HistoryPanel({ history, onClose }: Props) {
  const wpmSeries = useMemo(() => [...history].reverse().slice(-20).map(h => h.wpm), [history]);
  const bestWpm   = history.length > 0 ? Math.max(...history.map(h => h.wpm)) : 0;
  const avgWpm    = history.length > 0 ? Math.round(history.reduce((s, h) => s + h.wpm, 0) / history.length) : 0;
  const bestAcc   = history.length > 0 ? Math.max(...history.map(h => h.accuracy)) : 0;

  return (
    <motion.div
      className="overlay"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal modal--wide glass-panel"
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BarChart2 size={18} color="var(--accent-color)" />
            <h2>Progress History</h2>
          </div>
          <button className="secondary small icon-btn" onClick={onClose}><X size={15} /></button>
        </div>

        {history.length === 0 ? (
          <p className="empty-state">No history yet — complete your first test!</p>
        ) : (
          <>
            <div className="history-summary">
              <div className="history-stat"><span className="history-stat-val">{bestWpm}</span><span className="history-stat-lbl">Best WPM</span></div>
              <div className="history-stat"><span className="history-stat-val">{avgWpm}</span><span className="history-stat-lbl">Avg WPM</span></div>
              <div className="history-stat"><span className="history-stat-val">{bestAcc}%</span><span className="history-stat-lbl">Best Acc</span></div>
              <div className="history-stat"><span className="history-stat-val">{history.length}</span><span className="history-stat-lbl">Total Runs</span></div>
            </div>

            {wpmSeries.length >= 2 && (
              <div className="history-chart">
                <div className="history-chart-label">
                  <TrendingUp size={12} /> WPM — last {wpmSeries.length} sessions
                </div>
                <Sparkline data={wpmSeries} />
              </div>
            )}

            <div className="history-list">
              {history.slice(0, 40).map((entry, i) => (
                <div key={entry.id} className="history-row">
                  <span className="history-num">#{i + 1}</span>
                  <span className="history-wpm">{entry.wpm} <small>WPM</small></span>
                  <span className="history-acc">{entry.accuracy}%</span>
                  <span className="history-time">{entry.duration}s</span>
                  <span className={`difficulty-badge difficulty-badge--${entry.difficulty}`}>{entry.difficulty}</span>
                  <span className="history-file" title={entry.file}>{entry.file}</span>
                  <span className="history-date">{entry.date}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
