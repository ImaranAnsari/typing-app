export type AppState = 'START' | 'IDLE' | 'TYPING' | 'FINISHED';
export type AppMode = 'CODE' | 'TEXT';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type ThemeKey = 'github' | 'dracula' | 'monokai' | 'nord' | 'solarized' | 'light';
export type PageView = 'LANDING' | 'START' | 'PRACTICE';

export interface DifficultyConfig {
    label: string;
    wordRange: [number, number];
    lineRange: [number, number];
    countdownSecs: number;
}

export interface ThemeConfig {
    label: string;
    bg: string;
    accent: string;
    success: string;
    panel: string;
    accentGlow: string;
    textPrimary: string;
    textSecondary: string;
    borderColor: string;
    isLight?: boolean;
}

export interface HistoryEntry {
    id: number;
    date: string;
    time: string;
    wpm: number;
    accuracy: number;
    duration: number;
    errors: number;
    difficulty: Difficulty;
    mode: AppMode;
    file: string;
}