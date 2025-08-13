'use client';

import React from 'react';
import { useTheme } from 'next-themes';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;

  const toggle = () => {
    if (currentTheme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggle}
      className="py-1 px-2 rounded-md border border-[var(--muted)]"
    >
      {currentTheme === 'dark' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
};

export default ThemeToggle;
