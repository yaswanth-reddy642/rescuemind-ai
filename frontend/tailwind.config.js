/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#EF4444',
          'red-dark': '#DC2626',
          blue: '#2563EB',
          'blue-dark': '#1D4ED8',
          green: '#10B981',
          'green-dark': '#059669',
          yellow: '#F59E0B',
          dark: '#0F172A',
          card: 'rgba(255, 255, 255, 0.85)',
          'card-dark': 'rgba(15, 23, 42, 0.85)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        glow: '0 0 20px rgba(239, 68, 68, 0.4)',
      }
    },
  },
  plugins: [],
}
