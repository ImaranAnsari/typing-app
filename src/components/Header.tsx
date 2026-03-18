import { Code2 } from 'lucide-react';

interface HeaderProps {
  appMode: 'CODE' | 'TEXT';
}

function Header({ appMode }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="icon-wrapper glass-element">
        <Code2 size={24} color="var(--accent-color)" />
      </div>
      <div className="header-text">
        <h1>TypeNode</h1>
        <p>{appMode === 'CODE' ? 'Code typing practice' : 'Text typing practice'}</p>
      </div>
    </header>
  );
}

export default Header;
