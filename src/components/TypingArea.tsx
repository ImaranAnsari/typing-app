type AppState = 'START' | 'IDLE' | 'TYPING' | 'FINISHED';

interface Props {
  snippet: string;
  userInput: string;
  appState: AppState;
}

export default function TypingArea({ snippet, userInput, appState }: Props) {
  const progress = snippet.length > 0 ? (userInput.length / snippet.length) * 100 : 0;

  const renderCharacters = () =>
    snippet.split('').map((char, index) => {
      let cls = 'char ';
      if (index < userInput.length) {
        cls += userInput[index] === char ? 'correct' : 'incorrect';
      } else {
        cls += 'untyped';
      }
      const isCursor = index === userInput.length && (appState === 'IDLE' || appState === 'TYPING');
      const display = char === '\n' ? '↵\n' : char;

      return (
        <span key={index} className={cls}>
          {isCursor && <span className="cursor" />}
          {display}
        </span>
      );
    });

  return (
    <div className={`typing-container glass-panel${appState === 'IDLE' ? ' pulse-glow' : ''}`}>
      {/* Progress bar */}
      <div className="progress-bar-wrapper">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
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