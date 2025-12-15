/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#1e293b',
        },
      },
    },
  },
  plugins: [],
};
