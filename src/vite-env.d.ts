/// <reference types="vite/client" />

// Extend HTML input element to support non-standard browser attributes
declare namespace React {
  interface InputHTMLAttributes<T> {
    webkitdirectory?: string;
    directory?: string;
  }
}
