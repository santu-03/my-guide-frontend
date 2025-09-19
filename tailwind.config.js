/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: colors.violet,
        secondary: colors.emerald,
        glass: "rgba(255, 255, 255, 0.1)",   // 👈 custom transparent white
        darkGlass: "rgba(0, 0, 0, 0.3)",     // 👈 custom transparent black
      },
      scrollbar: {
        width: '.8px',
        thumb: '#4b8c4b',
        track: '#f1f1f1',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity:'0' }, '100%': { opacity:'1' } },
        slideUp: { '0%': { transform:'translateY(10px)', opacity:'0' }, '100%': { transform:'translateY(0)', opacity:'1' } }
      }
    },
  },
  plugins: [],
}
