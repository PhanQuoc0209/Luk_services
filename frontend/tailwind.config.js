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
      borderRadius: {
        DEFAULT: '9999px',
      },
      colors: {
        luk: {
          bg: 'var(--luk-bg)',
          card: 'var(--luk-card)',
          cardHover: 'var(--luk-card-hover)',
          border: 'var(--luk-border)',
          borderLight: 'var(--luk-border-light)',
          red: '#E11D48',
          blue: '#2563EB',
          text: 'var(--luk-text)',
          muted: 'var(--luk-muted)',
          dim: 'var(--luk-dim)',
        },
      },
      fontFamily: {
        heading: ["'Instrument Serif'", 'serif'],
        body: ['Barlow', 'sans-serif'],
        sans: ['Barlow', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
