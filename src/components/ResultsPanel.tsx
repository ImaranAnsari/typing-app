import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RefreshCw, BarChart2 } from 'lucide-react';
import { wpmColorClass, accColorClass } from '../utils/statColors';

interface Props {
  appState: string;
  wpm: number;
  accuracy: number;
  currentTime: number;
  errors: number;
  onNext: () => void;
  onLeaderboard: () => void;
}

export default function ResultsPanel({ appState, wpm, accuracy, currentTime, errors, onNext, onLeaderboard }: Props) {
  return (
    <AnimatePresence>
      {appState === 'FINISHED' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="results-panel glass-panel"
        >
          <div className="results-top">
            <div className="results-info">
              <div className="results-icon"><Trophy size={26} /></div>
              <div className="results-text">
                <h3>Test Complete!</h3>
                <p>Great work — result saved.</p>
              </div>
            </div>

            <div className="results-stats">
              <div className="result-stat">
                <span className={`result-stat-value ${wpmColorClass(wpm)}`}>{wpm}</span>
                <span className="result-stat-label">WPM</span>
              </div>
              <div className="result-stat">
                <span className={`result-stat-value ${accColorClass(accuracy)}`}>{accuracy}%</span>
                <span className="result-stat-label">Accuracy</span>
              </div>
              <div className="result-stat">
                <span className="result-stat-value">{currentTime}s</span>
                <span className="result-stat-label">Time</span>
              </div>
              <div className="result-stat">
                <span className={`result-stat-value${errors > 5 ? ' bad' : errors > 0 ? ' warning' : ' good'}`}>{errors}</span>
                <span className="result-stat-label">Errors</span>
              </div>
            </div>
          </div>

          <div className="results-actions">
            <button className="secondary small" onClick={onLeaderboard}>
              <BarChart2 size={15} /> Scores
            </button>
            <button className="primary small" onClick={onNext} style={{ width: 'auto' }}>
              Next Snippet <RefreshCw size={15} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}