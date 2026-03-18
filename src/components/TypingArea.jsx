import React from 'react';

function TypingArea({ snippet, userInput, appState }) {
  const progress = snippet.length > 0 ? (userInput.length / snippet.length) * 100 : 0;

  const renderCharacters = () => {
    return snippet.split('').map((char, index) => {
      let className = 'char ';
      let isCursor = false;

      if (index < userInput.length) {
        className += userInput[index] === char ? 'correct' : 'incorrect';
      } else {
        className += 'untyped';
      }

      if (index === userInput.length && (appState === 'IDLE' || appState === 'TYPING')) {
        isCursor = true;
      }

      const displayChar = char === '\n' ? '↵\n' : char;

      return (
        <span key={index} className={className}>
          {isCursor && <span className="cursor" />}
          {displayChar}
        </span>
      );
    });
  };

  return (
    <div className={`typing-container glass-panel ${appState === 'IDLE' ? 'pulse-glow' : ''}`}>
      <div className="progress-bar-wrapper">
        <div
          className="progress-bar-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="typing-area code-font">
        {renderCharacters()}
        {userInput.length === snippet.length && appState !== 'FINISHED' && (
          <span className="cursor" />
        )}
      </div>
    </div>
  );
}

export default TypingArea;
