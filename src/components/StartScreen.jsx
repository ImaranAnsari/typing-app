import React from 'react';
import { motion } from 'framer-motion';
import { FolderOpen, Code2, FileText } from 'lucide-react';

function StartScreen({ handleFolderSelect, handleTextFileSelect }) {
  return (
    <motion.div 
      key="start"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="start-screen glass-panel"
    >
      <div className="giant-icon-circle">
        <FolderOpen size={48} color="var(--accent-color)" />
      </div>
      <h2>Select Workspace</h2>
      <p className="description">
        Choose your local Node.js project folder to practice coding, or upload PDF/TXT/MD files for text practice.
      </p>
      
      <div className="options-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', width: '100%', marginTop: '1rem' }}>
        <div className="file-input-wrapper" style={{ height: '140px' }}>
          <button className="primary file-button" tabIndex={-1} style={{ width: '100%', height: '100%', flexDirection: 'column', gap: '12px', fontSize: '1.1rem' }}>
            <Code2 size={32} />
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
        <div className="file-input-wrapper" style={{ height: '140px' }}>
          <button className="secondary file-button" style={{ width: '100%', height: '100%', flexDirection: 'column', gap: '12px', fontSize: '1.1rem', borderColor: 'var(--accent-color)', color: 'var(--accent-color)' }} tabIndex={-1}>
            <FileText size={32} />
            Text/PDF/MD Files
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
    </motion.div>
  );
}

export default StartScreen;
