import { motion } from 'framer-motion';
import { FolderOpen, Code2, FileText, Clock } from 'lucide-react';
import { DIFFICULTY_SETTINGS } from '../constants';
import type { Difficulty } from '../types';

interface Props {
  handleFolderSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTextFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  countdownMode: boolean;
  setCountdownMode: (v: boolean) => void;
}

export default function StartScreen({
  handleFolderSelect, handleTextFileSelect,
  difficulty, setDifficulty,
  countdownMode, setCountdownMode,
}: Props) {
  return (
    <motion.div
      key="start"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="start-screen glass-panel"
    >
      <div className="giant-icon-circle">
        <FolderOpen size={38} color="var(--accent-color)" />
      </div>
      <h2>Select Workspace</h2>
      <p className="description">
        Load your Node.js project for code practice, or upload PDF/TXT/MD files for text practice.
      </p>

      {/* Difficulty */}
      <div className="settings-block">
        <span className="settings-label">Difficulty</span>
        <div className="difficulty-pills">
          {(Object.entries(DIFFICULTY_SETTINGS) as [Difficulty, typeof DIFFICULTY_SETTINGS[Difficulty]][]).map(([key, val]) => (
            <button
              key={key}
              className={`difficulty-pill${difficulty === key ? ' active' : ''}`}
              onClick={() => setDifficulty(key)}
            >
              {val.label}
            </button>
          ))}
        </div>
      </div>

      {/* Countdown toggle */}
      <div className="settings-block">
        <span className="settings-label">
          <Clock size={13} style={{ marginRight: 6 }} />
          Countdown Mode
          {countdownMode && (
            <span className="countdown-hint">
              {DIFFICULTY_SETTINGS[difficulty].countdownSecs}s
            </span>
          )}
        </span>
        <button
          className={`toggle-btn${countdownMode ? ' on' : ''}`}
          onClick={() => setCountdownMode(!countdownMode)}
          aria-label="Toggle countdown mode"
        >
          <span className="toggle-knob" />
        </button>
      </div>

      {/* File inputs */}
      <div className="options-grid">
        <div className="option-card">
          <button className="option-btn primary" tabIndex={-1}>
            <Code2 size={22} />
            Code Folder
          </button>
          <input
            type="file"
            webkitdirectory="true"
            directory="true"
            multiple
            onChange={handleFolderSelect}
            className="folder-input"
          />
        </div>
        <div className="option-card">
          <button className="option-btn secondary" tabIndex={-1}>
            <FileText size={22} />
            Text / PDF / MD
          </button>
          <input
            type="file"
            accept=".txt,.pdf,.md,text/plain,application/pdf,text/markdown"
            multiple
            onChange={handleTextFileSelect}
            className="folder-input"
          />
        </div>
      </div>

      <p className="shortcut-hint">
        <kbd>Esc</kbd> to skip snippet &nbsp;·&nbsp; <kbd>Enter</kbd> to continue after finishing
      </p>
    </motion.div>
  );
}