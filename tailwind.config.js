// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gyoguma': {
          light: '#FFF3E0',    // 연한 고구마색 (배경)
          DEFAULT: '#D2691E',  // 기본 고구마색
          dark: '#8B4513',     // 진한 고구마색
        }
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar')
  ],
}