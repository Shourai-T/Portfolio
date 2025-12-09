/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#292929',
        'dark-text': '#ffffff',
        'dark-text-secondary': '#d0d0d0',
        'dark-border': 'rgba(255,255,255,0.08)',
        'dark-icon-muted': 'rgba(255,255,255,0.6)',
        'dark-hover': 'rgba(255,255,255,0.1)',
      },
      scale: {
        '102': '1.02',
        '103': '1.03',
      },
    },
  },
  plugins: [],
};
