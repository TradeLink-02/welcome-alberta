/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        pine: '#1d4434',
        'pine-mid': '#2d6652',
        'pine-light': '#e8f2ec',
        gold: '#c8922a',
        'gold-light': '#fdf3e3',
        rust: '#b54a2c',
        'rust-light': '#fbeee9',
        sky: '#2a5c8a',
        'sky-light': '#e8f0f7',
        paper: '#f5f2eb',
        'paper-warm': '#ede9df',
        ink: '#1a1a18',
        'ink-soft': '#4a4a45',
        'ink-faint': '#8a8a80',
      },
    },
  },
  plugins: [],
};


