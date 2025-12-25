/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Chicago flag blue
        'chicago-blue': {
          50: '#e6f4ff',
          100: '#b3deff',
          200: '#80c8ff',
          300: '#4db2ff',
          400: '#1a9cff',
          500: '#0087e6',
          600: '#006bb3',
          700: '#004f80',
          800: '#00334d',
          900: '#00171a',
        },
        // Warm accent for CTAs
        'warm': {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
