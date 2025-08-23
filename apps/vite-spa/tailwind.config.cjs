module.exports = {
  // use class strategy so JS can toggle dark mode via the `dark` class
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        paper: '#f7f4ef', // warm paper-like background
        sumi: {
          DEFAULT: '#111827',
          muted: '#4b5563',
        },
        accent: {
          DEFAULT: '#4338ca', // deep indigo
          light: '#6d28d9',
        },
      },
      fontFamily: {
        sans: ['Noto Sans JP', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial'],
        serif: ['Noto Serif JP', 'ui-serif', 'Georgia'],
      },
      spacing: {
        content: '65ch',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.sumi.muted'),
            a: {
              color: theme('colors.accent.DEFAULT'),
              textDecoration: 'underline',
              textDecorationColor: 'transparent',
              '&:hover': {
                color: theme('colors.accent.light'),
                textDecorationColor: theme('colors.accent.DEFAULT'),
              },
            },
            h1: {
              color: theme('colors.sumi.DEFAULT'),
              fontWeight: '800',
            },
            h2: {
              color: theme('colors.sumi.DEFAULT'),
              fontWeight: '700',
            },
            blockquote: {
              borderLeftColor: theme('colors.gray.200'),
              color: theme('colors.sumi.muted'),
              fontStyle: 'normal',
              backgroundColor: 'transparent',
            },
            code: {
              backgroundColor: theme('colors.gray.100'),
              padding: '0.125rem 0.25rem',
              borderRadius: '0.25rem',
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
