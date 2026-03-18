import { Target, Clock, Zap, FolderOpen, RefreshCw, Home } from 'lucide-react';
import { wpmColorClass, accColorClass } from '../utils/statColors';

interface StatsBarProps {
  wpm: number;
  accuracy: number;
  currentTime: number;
  currentFileName: string;
  onSkip: () => void;
  onBack: () => void;
}

function StatsBar({ wpm, accuracy, currentTime, currentFileName, onSkip, onBack }: StatsBarProps) {
  return (
    <div className="top-bar">
      <div className="stats-container">
        <div className="stat-box">
          <div className="stat-label">
            <Zap size={14} /> WPM
          </div>
          <span className={`stat-value ${wpmColorClass(wpm)}`}>{wpm}</span>
        </div>
        <div className="stat-box">
          <div className="stat-label">
            <Target size={14} /> ACC
          </div>
          <span className={`stat-value ${accColorClass(accuracy)}`}>{accuracy}%</span>
        </div>
        <div className="stat-box">
          <div className="stat-label">
            <Clock size={14} /> TIME
          </div>
          <span className="stat-value">{currentTime}s</span>
        </div>
      </div>

      <div className="controls-container">
        <div className="file-pill" title={currentFileName || 'Loading...'}>
          <FolderOpen size={16} style={{ flexShrink: 0 }} />
          <span className="file-name-text">
            {currentFileName || 'Loading...'}
          </span>
        </div>
        <button className="secondary small" onClick={onSkip} title="Skip Snippet (Esc)">
          <RefreshCw size={16} /> Skip
        </button>
        <button className="secondary small" onClick={onBack} title="Back to Start Screen">
          <Home size={16} /> Back
        </button>
      </div>
    </div>
  );
}

export default StatsBar;
