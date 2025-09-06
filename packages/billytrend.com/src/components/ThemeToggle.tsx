import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState<boolean>(() => {
    try {
      const val = localStorage.getItem('theme');
      if (val === 'dark') return true;
      if (val === 'light') return false;
      // fallback to system preference
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <button
      aria-pressed={dark}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setDark((d) => !d)}
      className="inline-flex items-center gap-2 px-3 py-1 border rounded text-sm bg-transparent"
    >
      {dark ? (
        <span className="fas fa-sun text-yellow-300" aria-hidden />
      ) : (
        <span className="fas fa-moon text-gray-600" aria-hidden />
      )}
      <span>{dark ? 'Light' : 'Dark'}</span>
    </button>
  );
}
