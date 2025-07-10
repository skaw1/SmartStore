/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-dark': '#111827',
        'background-light': '#F9FAFB',
        'background-dark': '#0D1117',
        'accent': 'var(--color-accent)',
        'accent-text': 'var(--color-accent-text)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}