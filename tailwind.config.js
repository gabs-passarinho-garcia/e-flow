/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#DAF819', // Verde amarelo do design
          700: '#D3FB16', // Verde amarelo mais claro
          800: '#B8D500', // Verde amarelo escuro
          900: '#14532d',
        },
        accent: {
          blue: '#A1D0FE',
          purple: '#685BC6',
          red: '#FE5729',
          orange: '#FB3F20',
        },
      },
    },
  },
  plugins: [],
}

