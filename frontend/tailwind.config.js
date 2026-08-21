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
        agri: {
          50: '#f2f9f4',
          100: '#e1f3e7',
          200: '#c5e7d1',
          300: '#99d4b1',
          400: '#64b98c',
          500: '#3d9d6e',
          600: '#2c8057',
          700: '#246647',
          800: '#1f513a',
          900: '#1a4331',
          950: '#0d251b',
        },
        earth: {
          50: '#faf7f2',
          100: '#f2eae0',
          200: '#e5d5c1',
          300: '#d5bd9f',
          400: '#c29f7c',
          500: '#b48762',
          600: '#a67254',
          700: '#8a5a44',
          800: '#714b3b',
          900: '#5e3f33',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 2.5s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(100%)' },
        }
      }
    },
  },
  plugins: [],
}
