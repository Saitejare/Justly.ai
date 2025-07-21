import React from 'react';
import './Header.css';

interface HeaderProps {
  language: string;
  setLanguage: (lang: string) => void;
  collapsed?: boolean;
}

const LANGUAGES = [
  { label: 'English', value: 'English' },
  { label: 'हिंदी', value: 'हिंदी' },
  { label: 'తెలుగు', value: 'తెలుగు' },
];

const SIDEBAR_WIDTH = 300;
const SIDEBAR_COLLAPSED = 60;

const Header: React.FC<HeaderProps> = ({ language, setLanguage, collapsed = false }) => {
  const left = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH;
  const width = `calc(100% - ${left}px)`;
  return (
    <header
      className="header"
      style={{ left, width, transition: 'left 0.25s, width 0.25s' }}
    >
      <div className="logo-title">
        <img src="/justlyai-logo.png" alt="JustlyAI Logo" className="logo" />
        <span className="brand-title">JustlyAI <span className="brand-tagline">┃ Free Legal Help for Every Indian</span></span>
      </div>
      <div className="header-controls">
        <div className="language-select-wrapper">
          <select
            className="language-select"
            value={language}
            onChange={e => setLanguage(e.target.value)}
            aria-label="Select language"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.value} value={lang.value}>{lang.label}</option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};

export default Header; 