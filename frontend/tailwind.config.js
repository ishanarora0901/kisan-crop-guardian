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
        forest: {
          50: '#f0f7f3',
          100: '#dceee3',
          200: '#bcdecb',
          300: '#92c7ad',
          400: '#64ab8b',
          500: '#418f70',
          600: '#307359',
          700: '#275c48',
          800: '#0b4635', // Reference deep forest green
          850: '#093c2d',
          900: '#073325',
          950: '#041c14',
        },
        sage: {
          50: '#f7faf8',  // Soft crisp medical/agri canvas background
          100: '#ebf5ef', // Soft mint pills and icon backgrounds
          200: '#d5e9dc', // Soft borders
          300: '#b6d7c2',
          400: '#89bea0',
          500: '#5da07c',
        },
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
      boxShadow: {
        'organic': '0 4px 20px -2px rgba(11, 70, 53, 0.06), 0 2px 6px -1px rgba(11, 70, 53, 0.04)',
        'organic-lg': '0 12px 30px -4px rgba(11, 70, 53, 0.08), 0 4px 12px -2px rgba(11, 70, 53, 0.04)',
        'forest': '0 10px 25px -5px rgba(11, 70, 53, 0.3)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Noto Sans Gurmukhi"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Georgia', 'serif'],
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
