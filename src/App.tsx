import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateSnippet, filterCodeFiles, filterTextFiles } from './utils/fileParser';
import { DIFFICULTY_SETTINGS, THEMES } from './constants';
import type { AppState, AppMode, Difficulty, ThemeKey, HistoryEntry, PageView } from './types';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import StartScreen from './components/StartScreen';
import StatsBar from './components/StatsBar';
import TypingArea from './components/TypingArea';
import ResultsPanel from './components/ResultsPanel';
import LeaderboardPanel from './components/LeaderboardPanel';
import HistoryPanel from './components/HistoryPanel';
import './index.css';

function loadLS<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? '') ?? fallback; }
  catch { return fallback; }
}
function saveLS(key: string, val: unknown) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* ignore */ }
}

function App() {
  const [page, setPage]             = useState<PageView>('LANDING');
  const [appState, setAppState]     = useState<AppState>('START');
  const [appMode, setAppMode]       = useState<AppMode>('CODE');
  const [projectFiles, setProjectFiles] = useState<File[]>([]);
  const [currentFileName, setCurrentFileName] = useState('');
  const [snippet, setSnippet]       = useState('');

  const [difficulty, setDifficulty] = useState<Difficulty>(loadLS('tn_difficulty', 'medium'));
  const [countdownMode, setCountdownMode] = useState<boolean>(loadLS('tn_countdown', false));
  const [countdown, setCountdown]   = useState<number | null>(null);
  const [theme, setTheme]           = useState<ThemeKey>(loadLS('tn_theme', 'github'));

  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showHistory, setShowHistory]         = useState(false);

  // Typing state
  const [userInput, setUserInput]   = useState('');
  const [startTime, setStartTime]   = useState<number | null>(null);
  const [errors, setErrors]         = useState(0);
  const [wpm, setWpm]               = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Persistent data
  const [leaderboard, setLeaderboard] = useState<HistoryEntry[]>(loadLS('tn_leaderboard', []));
  const [history, setHistory]         = useState<HistoryEntry[]>(loadLS('tn_history', []));

  const containerRef = useRef<HTMLDivElement>(null);

  // ── Apply theme CSS variables ──────────────────────────────────────────────
  useEffect(() => {
    const t = THEMES[theme];
    if (!t) return;
    const root = document.documentElement;
    root.style.setProperty('--bg-color',       t.bg);
    root.style.setProperty('--accent-color',   t.accent);
    root.style.setProperty('--success',        t.success);
    root.style.setProperty('--panel-bg',       t.panel);
    root.style.setProperty('--accent-glow',    t.accentGlow);
    root.style.setProperty('--text-primary',   t.textPrimary);
    root.style.setProperty('--text-secondary', t.textSecondary);
    root.style.setProperty('--border-color',   t.borderColor);
    root.setAttribute('data-theme', t.isLight ? 'light' : 'dark');
    saveLS('tn_theme', theme);
  }, [theme]);

  useEffect(() => { saveLS('tn_difficulty', difficulty); }, [difficulty]);
  useEffect(() => { saveLS('tn_countdown', countdownMode); }, [countdownMode]);

  // ── Snippet loading ────────────────────────────────────────────────────────
  const loadRandomSnippet = useCallback(async (
    files: File[]   = projectFiles,
    mode: AppMode   = appMode,
    diff: Difficulty = difficulty,
  ) => {
    if (files.length === 0) return;
    const settings = DIFFICULTY_SETTINGS[diff];
    let selectedText = '';
    let selectedFile: File | null = null;
    let attempts = 0;

    while (selectedText.length < 30 && attempts < 12) {
      selectedFile = files[Math.floor(Math.random() * files.length)];
      try {
        selectedText = await generateSnippet(
          selectedFile, mode,
          settings.lineRange[1], settings.lineRange[0],
          settings.wordRange,
        );
      } catch (err) { console.error(err); }
      attempts++;
    }

    if (selectedText && selectedFile) {
      setCurrentFileName(selectedFile.name || selectedFile.webkitRelativePath);
      setSnippet(selectedText);
      setUserInput('');
      setStartTime(null);
      setErrors(0);
      setWpm(0);
      setCurrentTime(0);
      setCountdown(null);
      setAppState('IDLE');
      setPage('PRACTICE');
      setTimeout(() => containerRef.current?.focus(), 50);
    }
  }, [projectFiles, appMode, difficulty]);

  // ── File handlers ──────────────────────────────────────────────────────────
  const handleFolderSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const validFiles = filterCodeFiles(Array.from(e.target.files ?? []));
    if (validFiles.length === 0) { alert('No suitable JS/TS files found.'); return; }
    setProjectFiles(validFiles);
    setAppMode('CODE');
    await loadRandomSnippet(validFiles, 'CODE', difficulty);
  };

  const handleTextFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const validFiles = filterTextFiles(Array.from(e.target.files ?? []));
    if (validFiles.length === 0) { alert('Please select valid .txt, .pdf, or .md files.'); return; }
    setProjectFiles(validFiles);
    setAppMode('TEXT');
    await loadRandomSnippet(validFiles, 'TEXT', difficulty);
    e.target.value = '';
  };

  const handleGoBack = () => {
    setAppState('START');
    setPage('START');
    setProjectFiles([]);
    setSnippet('');
    setUserInput('');
    setStartTime(null);
    setErrors(0);
    setWpm(0);
    setCurrentTime(0);
    setCountdown(null);
  };

  // ── Save result ────────────────────────────────────────────────────────────
  const saveResult = useCallback((finalWpm: number, finalAcc: number, finalTime: number, finalErrors: number) => {
    const entry: HistoryEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      wpm: finalWpm,
      accuracy: finalAcc,
      duration: finalTime,
      errors: finalErrors,
      difficulty,
      mode: appMode,
      file: currentFileName,
    };
    setHistory(prev => {
      const next = [entry, ...prev].slice(0, 50);
      saveLS('tn_history', next);
      return next;
    });
    setLeaderboard(prev => {
      const next = [...prev, entry].sort((a, b) => b.wpm - a.wpm).slice(0, 10);
      saveLS('tn_leaderboard', next);
      return next;
    });
  }, [difficulty, appMode, currentFileName]);

  // ── Finish test ────────────────────────────────────────────────────────────
  const finishTest = useCallback((finalInput: string) => {
    setAppState('FINISHED');
    const end = Date.now();
    const timeInMinutes = (end - (startTime ?? end)) / 60000;
    const finalWpm = Math.round((finalInput.length / 5) / timeInMinutes);
    const finalTime = Math.floor((end - (startTime ?? end)) / 1000);
    const finalErrors = errors;
    const finalAcc = finalInput.length > 0
      ? Math.max(0, Math.round(((finalInput.length - finalErrors) / finalInput.length) * 100))
      : 100;
    setWpm(finalWpm);
    saveResult(finalWpm, finalAcc, finalTime, finalErrors);
  }, [startTime, errors, saveResult]);

  // ── Countdown timer ────────────────────────────────────────────────────────
  useEffect(() => {
    if (appState !== 'TYPING' || !countdownMode || countdown === null) return;
    if (countdown <= 0) { finishTest(userInput); return; }
    const t = setTimeout(() => setCountdown(c => (c ?? 1) - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, appState, countdownMode, finishTest, userInput]);

  // ── Keyboard handler ───────────────────────────────────────────────────────
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (appState === 'FINISHED' || appState === 'START') {
      if (e.key === 'Enter' && appState === 'FINISHED') loadRandomSnippet();
      return;
    }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'Escape') { loadRandomSnippet(); return; }

    if (appState === 'IDLE' && e.key.length === 1) {
      setAppState('TYPING');
      setStartTime(Date.now());
      if (countdownMode) setCountdown(DIFFICULTY_SETTINGS[difficulty].countdownSecs);
    }

    if (e.key === 'Backspace') {
      setUserInput(prev => prev.slice(0, -1));
      e.preventDefault();
    } else if (e.key === 'Enter') {
      if (snippet[userInput.length] !== '\n') setErrors(n => n + 1);
      setUserInput(prev => prev + '\n');
      e.preventDefault();
    } else if (e.key.length === 1) {
      if (e.key !== snippet[userInput.length]) setErrors(n => n + 1);
      setUserInput(prev => {
        const next = prev + e.key;
        if (next.length >= snippet.length) finishTest(next);
        return next;
      });
      e.preventDefault();
    }
  }, [appState, snippet, userInput, countdownMode, difficulty, loadRandomSnippet, finishTest]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // ── Live WPM + timer ───────────────────────────────────────────────────────
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (appState === 'TYPING' && startTime) {
      interval = setInterval(() => {
        const now = Date.now();
        setCurrentTime(Math.floor((now - startTime) / 1000));
        const mins = (now - startTime) / 60000;
        setWpm(mins > 0.05 ? Math.round((userInput.length / 5) / mins) : 0);
      }, 500);
    }
    return () => clearInterval(interval);
  }, [appState, startTime, userInput]);

  const accuracy = userInput.length > 0
    ? Math.max(0, Math.round(((userInput.length - errors) / userInput.length) * 100))
    : 100;

  const displayTime = countdownMode && countdown !== null ? countdown : currentTime;
  const isCountingDown = countdownMode && countdown !== null;

  return (
    <div
      className="app-container"
      ref={containerRef}
      tabIndex={-1}
      onClick={() => containerRef.current?.focus()}
    >
      <Header
        appMode={appMode}
        theme={theme}
        setTheme={setTheme}
        onLeaderboard={() => setShowLeaderboard(true)}
        onHistory={() => setShowHistory(true)}
        showNav={page !== 'LANDING'}
        onHome={() => setPage('LANDING')}
      />

      <main className="main-content">
        <AnimatePresence mode="wait">
          {page === 'LANDING' && (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LandingPage
                onStart={() => setPage('START')}
                leaderboard={leaderboard}
                history={history}
              />
            </motion.div>
          )}

          {page === 'START' && (
            <motion.div key="start" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <StartScreen
                handleFolderSelect={handleFolderSelect}
                handleTextFileSelect={handleTextFileSelect}
                difficulty={difficulty}
                setDifficulty={setDifficulty}
                countdownMode={countdownMode}
                setCountdownMode={setCountdownMode}
              />
            </motion.div>
          )}

          {page === 'PRACTICE' && appState !== 'START' && (
            <motion.div
              key="practice"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="practice-screen"
            >
              <StatsBar
                wpm={wpm}
                accuracy={accuracy}
                currentTime={displayTime}
                currentFileName={currentFileName}
                onSkip={() => loadRandomSnippet()}
                onBack={handleGoBack}
                countdownMode={isCountingDown}
                difficulty={difficulty}
              />

              <TypingArea
                snippet={snippet}
                userInput={userInput}
                appState={appState}
              />

              <ResultsPanel
                appState={appState}
                wpm={wpm}
                accuracy={accuracy}
                currentTime={currentTime}
                errors={errors}
                onNext={() => loadRandomSnippet()}
                onLeaderboard={() => setShowLeaderboard(true)}
              />

              {appState === 'IDLE' && (
                <p className="idle-text">
                  Start typing to begin &nbsp;·&nbsp; <kbd>Esc</kbd> to skip
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showLeaderboard && (
          <LeaderboardPanel leaderboard={leaderboard} onClose={() => setShowLeaderboard(false)} />
        )}
        {showHistory && (
          <HistoryPanel history={history} onClose={() => setShowHistory(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
