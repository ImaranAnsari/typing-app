import { motion } from 'framer-motion';
import { FolderOpen, Code2, FileText } from 'lucide-react';

interface StartScreenProps {
  handleFolderSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTextFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function StartScreen({ handleFolderSelect, handleTextFileSelect }: StartScreenProps) {
  return (
    <motion.div 
      key="start"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="start-screen glass-panel"
    >
      <div className="giant-icon-circle">
        <FolderOpen size={40} color="var(--accent-color)" />
      </div>
      <h2>Select Workspace</h2>
      <p className="description">
        Choose your local Node.js project folder to practice coding, or upload PDF/TXT/MD files for text practice.
      </p>
      
      <div className="options-grid">
        <div className="option-card file-input-wrapper">
          <button className="primary option-btn" tabIndex={-1}>
            <Code2 size={28} />
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
        <div className="option-card file-input-wrapper">
          <button className="secondary option-btn" tabIndex={-1}>
            <FileText size={28} />
            Text / PDF / MD
          </button>
          <input 
            type="file" 
            accept=".txt,.pdf,.md,text/plain,application/pdf,text/markdown"
            multiple 
            onChange={handleTextFileSelect}
            className="folder-input"
            title="Upload Text, PDF, or MD files"
          />
        </div>
      </div>

      <p className="shortcut-hint">
        <kbd>Esc</kbd> skip snippet &nbsp;·&nbsp; <kbd>Enter</kbd> next after finish
      </p>
    </motion.div>
  );
}

export default StartScreen;
