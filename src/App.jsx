import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { generateSnippet, filterCodeFiles, filterTextFiles } from './utils/fileParser';
import Header from './components/Header';
import StartScreen from './components/StartScreen';
import StatsBar from './components/StatsBar';
import TypingArea from './components/TypingArea';
import ResultsPanel from './components/ResultsPanel';
import './index.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const MAX_LINES = 20;
const MIN_LINES = 8;

function App() {
  const [appState, setAppState] = useState('START');
  const [appMode, setAppMode] = useState('CODE');
  const [projectFiles, setProjectFiles] = useState([]);
  const [currentFileName, setCurrentFileName] = useState('');
  const [snippet, setSnippet] = useState('');

  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [errors, setErrors] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const containerRef = useRef(null);

  const handleFolderSelect = async (e) => {
    const validFiles = filterCodeFiles(Array.from(e.target.files));

    if (validFiles.length === 0) {
      alert("No suitable JS/TS files found in the selected directory.\nPlease select a Node.js/React project folder.");
      return;
    }

    setProjectFiles(validFiles);
    setAppMode('CODE');
    await loadRandomSnippet(validFiles, 'CODE');
  };

  const handleTextFileSelect = async (e) => {
    const validFiles = filterTextFiles(Array.from(e.target.files));

    if (validFiles.length === 0) {
      alert("Please select valid .txt, .pdf, or .md files.");
      return;
    }

    setProjectFiles(validFiles);
    setAppMode('TEXT');
    await loadRandomSnippet(validFiles, 'TEXT');

    e.target.value = null;
  };

  const loadRandomSnippet = async (files = projectFiles, mode = appMode) => {
    if (files.length === 0) return;

    let selectedText = '';
    let selectedFile = null;
    let attempts = 0;

    while (selectedText.length < 50 && attempts < 10) {
      selectedFile = files[Math.floor(Math.random() * files.length)];
      try {
        selectedText = await generateSnippet(selectedFile, mode, MAX_LINES, MIN_LINES);
      } catch (err) {
        console.error("Error reading file", err);
      }
      attempts++;
    }

    if (selectedText) {
      setCurrentFileName(selectedFile.name || selectedFile.webkitRelativePath);
      setSnippet(selectedText);
      resetTypingState();
      setAppState('IDLE');
    }
  };

  const resetTypingState = () => {
    setUserInput('');
    setStartTime(null);
    setErrors(0);
    setWpm(0);
    setCurrentTime(0);
    setAppState('IDLE');
    if (containerRef.current) containerRef.current.focus();
  };

  const handleGoBack = () => {
    setAppState('START');
    setProjectFiles([]);
    setCurrentFileName('');
    setSnippet('');
    setUserInput('');
    setStartTime(null);
    setErrors(0);
    setWpm(0);
    setCurrentTime(0);
  };

  const handleKeyDown = useCallback((e) => {
    if (appState === 'FINISHED' || appState === 'START') {
      if (e.key === 'Enter' && appState === 'FINISHED') {
        loadRandomSnippet();
      }
      return;
    }

    if (e.ctrlKey || e.metaKey || e.altKey) return;

    if (e.key === 'Escape') {
      loadRandomSnippet();
      return;
    }

    if (appState === 'IDLE' && e.key.length === 1) {
      setAppState('TYPING');
      setStartTime(Date.now());
    }

    if (e.key === 'Backspace') {
      setUserInput(prev => prev.slice(0, -1));
      e.preventDefault();
    } else if (e.key === 'Enter') {
      const nextChar = snippet[userInput.length];
      if (nextChar === '\n') {
        setUserInput(prev => prev + '\n');
      } else {
        setUserInput(prev => prev + '\n');
        setErrors(e => e + 1);
      }
      e.preventDefault();
    } else if (e.key.length === 1) {
      const nextChar = snippet[userInput.length];
      if (e.key !== nextChar) setErrors(errs => errs + 1);

      setUserInput(prev => {
        const newVal = prev + e.key;
        if (newVal.length >= snippet.length) {
          finishTest(newVal);
        }
        return newVal;
      });
      e.preventDefault();
    }
  }, [appState, snippet, userInput]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const finishTest = (finalInput) => {
    setAppState('FINISHED');
    const end = Date.now();

    const timeInMinutes = (end - startTime) / 60000;
    const wordsTyped = finalInput.length / 5;
    const calculatedWpm = Math.round(wordsTyped / timeInMinutes);
    setWpm(calculatedWpm);
  };

  useEffect(() => {
    let interval;
    if (appState === 'TYPING' && startTime) {
      interval = setInterval(() => {
        const now = Date.now();
        setCurrentTime(Math.floor((now - startTime) / 1000));

        const timeInMinutes = (now - startTime) / 60000;
        const wordsTyped = userInput.length / 5;
        setWpm(timeInMinutes > 0.05 ? Math.round(wordsTyped / timeInMinutes) : 0);
      }, 500);
    }
    return () => clearInterval(interval);
  }, [appState, startTime, userInput]);

  const accuracy = userInput.length > 0 ? Math.max(0, Math.round(((userInput.length - errors) / userInput.length) * 100)) : 100;

  return (
    <div className="app-container" ref={containerRef} tabIndex={-1} onClick={() => containerRef.current?.focus()}>
      <Header appMode={appMode} />

      <main className="main-content">
        <AnimatePresence mode="wait">
          {appState === 'START' && (
            <StartScreen
              handleFolderSelect={handleFolderSelect}
              handleTextFileSelect={handleTextFileSelect}
            />
          )}

          {appState !== 'START' && (
            <motion.div
              key="practice"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="practice-screen"
            >
              <StatsBar
                wpm={wpm}
                accuracy={accuracy}
                currentTime={currentTime}
                currentFileName={currentFileName}
                onSkip={() => loadRandomSnippet()}
                onBack={handleGoBack}
              />

              <TypingArea
                snippet={snippet}
                userInput={userInput}
                appState={appState}
              />

              <ResultsPanel
                appState={appState}
                onNext={() => loadRandomSnippet()}
                wpm={wpm}
                accuracy={accuracy}
                currentTime={currentTime}
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
    </div>
  );
}

export default App;
