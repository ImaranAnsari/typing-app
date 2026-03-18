import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RefreshCw, Zap, Target, Clock } from 'lucide-react';
import { wpmColorClass, accColorStyle } from '../utils/statColors';

type AppState = 'START' | 'IDLE' | 'TYPING' | 'FINISHED';

interface ResultsPanelProps {
  appState: AppState;
  onNext: () => void;
  wpm: number;
  accuracy: number;
  currentTime: number;
}

function ResultsPanel({ appState, onNext, wpm, accuracy, currentTime }: ResultsPanelProps) {
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
              <div className="results-icon">
                <Trophy size={28} />
              </div>
              <div className="results-text">
                <h3>Test Completed!</h3>
                <p>Press Enter or click Next to continue.</p>
              </div>
            </div>
            <button className="primary small" onClick={onNext}>
              Next Snippet <RefreshCw size={16} />
            </button>
          </div>

          <div className="results-stats">
            <div className="result-stat">
              <span className={`result-stat-value ${wpmColorClass(wpm)}`}>
                <Zap size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                {wpm}
              </span>
              <span className="result-stat-label">WPM</span>
            </div>
            <div className="result-stat">
              <span className="result-stat-value" style={{ color: accColorStyle(accuracy) }}>
                <Target size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                {accuracy}%
              </span>
              <span className="result-stat-label">Accuracy</span>
            </div>
            <div className="result-stat">
              <span className="result-stat-value" style={{ color: 'var(--text-primary)' }}>
                <Clock size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                {currentTime}s
              </span>
              <span className="result-stat-label">Time</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ResultsPanel;
