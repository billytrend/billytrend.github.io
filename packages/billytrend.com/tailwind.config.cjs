module.exports = {
  // use class strategy so JS can toggle dark mode via the `dark` class
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        paper: '#f5f2ea', // warm off-white paper
        ink: {
          DEFAULT: '#1a1a1a',
          muted: '#4a4a4a',
        },
        line: '#e6e2d9', // hairlines
        accent: {
          // muted sage/cedar accent for Japandi feel
          DEFAULT: '#6f8364',
          light: '#8ea383',
          dark: '#5b6b53',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Zen Kaku Gothic Antique', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      spacing: {
        content: '65ch',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.ink.muted'),
            a: {
              color: 'var(--accent)',
              textDecoration: 'none',
              borderBottom: '1px solid color-mix(in oklab, var(--accent) 40%, transparent)',
              paddingBottom: '2px',
              '&:hover': {
                color: 'var(--text)',
                backgroundImage: `linear-gradient(to right, color-mix(in oklab, var(--accent) 12%, transparent), transparent)`
              },
            },
            h1: {
              color: theme('colors.ink.DEFAULT'),
              fontWeight: '800',
              letterSpacing: '-0.02em',
            },
            h2: {
              color: theme('colors.ink.DEFAULT'),
              fontWeight: '700',
              letterSpacing: '-0.01em',
            },
            blockquote: {
              borderLeftColor: theme('colors.line'),
              color: theme('colors.ink.muted'),
              fontStyle: 'normal',
              backgroundColor: 'transparent',
            },
            code: {
              backgroundColor: 'color-mix(in oklab, var(--text) 8%, transparent)',
              padding: '0.125rem 0.25rem',
              borderRadius: '0',
              fontFamily: theme('fontFamily.mono').join(','),
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
