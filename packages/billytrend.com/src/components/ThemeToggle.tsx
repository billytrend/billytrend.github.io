import { memo, useEffect, useState } from 'react';

function ThemeToggle() {
  const [dark, setDark] = useState<boolean>(() => {
    try {
      const val = localStorage.getItem('theme');
      if (val === 'dark') return true;
      if (val === 'light') return false;
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
      type="button"
      aria-pressed={dark}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => {
        const reduceMotion =
          window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const doc = document as unknown as {
          startViewTransition?: (cb: () => void) => { finished: Promise<void> };
        };
        // set wipe origin to top-right corner
        const root = document.documentElement;
        const cx = window.innerWidth; // 100% X
        const cy = 0; // 0% Y (top)
        root.style.setProperty('--vt-x', `${cx}px`);
        root.style.setProperty('--vt-y', `${cy}px`);
        const apply = () => {
          document.documentElement.classList.add('theme-switching');
          const root = document.documentElement;
          const next = !root.classList.contains('dark');
          root.classList.toggle('dark', next);
          try {
            localStorage.setItem('theme', next ? 'dark' : 'light');
          } catch {
            // localStorage write can fail (e.g., private mode); ignore
            void 0;
          }
          setDark(next);
          // remove the guard after transition frame
          if (typeof requestAnimationFrame === 'function') {
            requestAnimationFrame(() => {
              setTimeout(() => document.documentElement.classList.remove('theme-switching'), 0);
            });
          } else {
            document.documentElement.classList.remove('theme-switching');
          }
        };
        if (!doc.startViewTransition || reduceMotion) {
          apply();
          return;
        }
        doc.startViewTransition(apply);
      }}
      className="inline-flex items-center gap-2 px-3 py-1 border text-sm bg-transparent cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
      style={{ borderColor: 'var(--line)', borderRadius: '0' }}
    >
      {dark ? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="currentColor"
          className="text-yellow-400"
        >
          <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zm10.45 14.32l1.79 1.79 1.41-1.41-1.79-1.8-1.41 1.42zM12 4V1h-1v3h1zm0 19v-3h-1v3h1zM4 12H1v1h3v-1zm19 0h-3v1h3v-1zM6.76 19.16l-1.42 1.42-1.79-1.8 1.41-1.41 1.8 1.79zM19.16 6.76l1.42-1.42 1.79 1.8-1.41 1.41-1.8-1.79zM12 6a6 6 0 100 12A6 6 0 0012 6z" />
        </svg>
      ) : (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="currentColor"
          className="text-gray-600 dark:text-gray-300"
        >
          <path d="M21.752 15.002A9 9 0 1111 2.248a7 7 0 1010.752 12.754z" />
        </svg>
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}

export default memo(ThemeToggle);
