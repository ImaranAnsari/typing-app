import { Target, Clock, Zap, FolderOpen, RefreshCw, ArrowLeft, AlertCircle } from 'lucide-react';
import { wpmColorClass, accColorClass } from '../utils/statColors';
import type { Difficulty } from '../types';

interface Props {
  wpm: number;
  accuracy: number;
  currentTime: number;
  currentFileName: string;
  onSkip: () => void;
  onBack: () => void;
  countdownMode: boolean;
  difficulty: Difficulty;
}

export default function StatsBar({ wpm, accuracy, currentTime, currentFileName, onSkip, onBack, countdownMode, difficulty }: Props) {
  const isLowTime = countdownMode && currentTime <= 10 && currentTime > 0;

  return (
    <div className="top-bar">
      <div className="stats-container">
        <div className="stat-box">
          <div className="stat-label"><Zap size={13} /> WPM</div>
          <span className={`stat-value ${wpmColorClass(wpm)}`}>{wpm}</span>
        </div>
        <div className="stat-box">
          <div className="stat-label"><Target size={13} /> ACC</div>
          <span className={`stat-value ${accColorClass(accuracy)}`}>{accuracy}%</span>
        </div>
        <div className={`stat-box${isLowTime ? ' stat-box--danger' : ''}`}>
          <div className="stat-label">
            {isLowTime ? <AlertCircle size={13} /> : <Clock size={13} />}
            {countdownMode ? 'LEFT' : 'TIME'}
          </div>
          <span className="stat-value" style={isLowTime ? { color: 'var(--error)' } : {}}>{currentTime}s</span>
        </div>
      </div>

      <div className="controls-container">
        <span className={`difficulty-badge difficulty-badge--${difficulty}`}>
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </span>
        <div className="file-pill">
          <FolderOpen size={14} />
          <span className="file-name-text">{currentFileName || 'Loading...'}</span>
        </div>
        <button className="secondary small" onClick={onSkip}><RefreshCw size={14} /> Skip</button>
        <button className="secondary small" onClick={onBack}><ArrowLeft size={14} /> Back</button>
      </div>
    </div>
  );
}