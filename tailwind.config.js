/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fffbe1',
          100: '#fff3b8',
          200: '#ffe570',
          300: '#ffd028',
          400: '#ffb705',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          dark: '#0f172a',
          slate: '#1e293b',
          card: '#1e293b',
          border: '#334155'
        }
      }
    },
  },
  plugins: [],
};
