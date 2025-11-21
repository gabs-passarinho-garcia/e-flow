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
          DEFAULT: '#D9F804', // O Verde Neon do botão "Registre-se"
          50: '#FBFEEO',
          100: '#F7FDC8',
          200: '#EEFB9B',
          300: '#E4F963',
          400: '#D9F804', // Main Brand Color
          500: '#B5CF03',
          600: '#92A702',
          900: '#1A1A1A',
        },
        secondary: {
          purple: '#5B4EFF', // Roxo dos detalhes (barras de progresso)
          blue: '#89CFF0',   // Azul claro das formas
          orange: '#FF5F2D', // Laranja dos detalhes
        },
        gray: {
          50: '#F9F9F9',
          100: '#F3F3F3',
          200: '#E5E5E5',
          800: '#333333',
          900: '#111111',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'float': '0 10px 30px -10px rgba(0, 0, 0, 0.1)',
        'nav': '0 -4px 20px rgba(0,0,0,0.05)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}