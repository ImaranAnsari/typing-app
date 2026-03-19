import { useState, useRef, useEffect } from 'react';
import { Code2, Trophy, BarChart2, Home, Palette, ChevronDown, Sun, Moon } from 'lucide-react';
import { THEMES } from '../constants';
import type { ThemeKey, AppMode } from '../types';

interface HeaderProps {
  appMode: AppMode;
  theme: ThemeKey;
  setTheme: (t: ThemeKey) => void;
  onLeaderboard: () => void;
  onHistory: () => void;
  showNav: boolean;
  onHome: () => void;
}

export default function Header({ appMode, theme, setTheme, onLeaderboard, onHistory, showNav, onHome }: HeaderProps) {
  const [themeOpen, setThemeOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const isLight = THEMES[theme]?.isLight;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setThemeOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Quick dark/light toggle
  const toggleLightDark = () => {
    if (isLight) setTheme('github');
    else setTheme('light');
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="glass-element">
          <Code2 size={22} color="var(--accent-color)" />
        </div>
        <div className="header-text">
          <h1>TypeNode</h1>
          <p>{appMode === 'CODE' ? 'Code practice' : 'Text practice'}</p>
        </div>
      </div>

      <div className="header-right">
        {/* Light / Dark quick toggle */}
        <button className="secondary small icon-btn" onClick={toggleLightDark} title="Toggle light/dark">
          {isLight ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {/* Theme picker */}
        <div className="theme-dropdown" ref={dropRef}>
          <button className="secondary small icon-btn" onClick={() => setThemeOpen(v => !v)} title="Theme">
            <Palette size={15} />
            <span className="theme-label-text">{THEMES[theme]?.label}</span>
            <ChevronDown size={13} style={{ opacity: 0.6 }} />
          </button>
          {themeOpen && (
            <div className="theme-menu glass-panel">
              {(Object.entries(THEMES) as [ThemeKey, typeof THEMES[ThemeKey]][]).map(([key, val]) => (
                <button
                  key={key}
                  className={`theme-option${theme === key ? ' active' : ''}`}
                  onClick={() => { setTheme(key); setThemeOpen(false); }}
                >
                  <span className="theme-dot" style={{ background: val.accent }} />
                  {val.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {showNav && (
          <>
            <button className="secondary small icon-btn" onClick={onHistory} title="History">
              <BarChart2 size={15} /> <span className="nav-label">History</span>
            </button>
            <button className="secondary small icon-btn" onClick={onLeaderboard} title="Scores">
              <Trophy size={15} /> <span className="nav-label">Scores</span>
            </button>
            <button className="secondary small icon-btn" onClick={onHome} title="Home">
              <Home size={15} />
            </button>
          </>
        )}
      </div>
    </header>
  );
}