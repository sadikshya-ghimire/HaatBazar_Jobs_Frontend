/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0092B8',
          dark: '#007A9C',
          light: '#00B8DB',
          lighter: '#CEFAFE',
        },
      },
    },
  },
  plugins: [],
};
