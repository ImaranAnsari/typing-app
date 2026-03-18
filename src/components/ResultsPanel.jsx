import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RefreshCw } from 'lucide-react';

function ResultsPanel({ appState, onNext }) {
  return (
    <AnimatePresence>
      {appState === 'FINISHED' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="results-panel glass-panel"
        >
          <div className="results-info">
            <div className="results-icon">
              <Trophy size={28} />
            </div>
            <div className="results-text">
              <h3>Test Completed!</h3>
              <p>Amazing work typing real code.</p>
            </div>
          </div>
          <button className="primary" onClick={onNext}>
            Next Snippet <RefreshCw size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ResultsPanel;
