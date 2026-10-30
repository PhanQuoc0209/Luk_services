/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        luk: {
          bg: 'var(--luk-bg)',
          card: 'var(--luk-card)',
          cardHover: 'var(--luk-card-hover)',
          border: 'var(--luk-border)',
          borderLight: 'var(--luk-border-light)',
          red: '#E11D48',
          redDark: '#BE123C',
          redSubtle: 'rgba(225, 29, 72, 0.12)',
          blue: '#2563EB',
          blueHover: '#1D4ED8',
          blueLight: '#3B82F6',
          blueSubtle: 'rgba(37, 99, 235, 0.14)',
          text: 'var(--luk-text)',
          muted: 'var(--luk-muted)',
          dim: 'var(--luk-dim)',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
