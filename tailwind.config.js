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
          DEFAULT: '#D9F804', // O Verde Neon principal
          50: '#FBFEEO',
          100: '#F7FDC8',
          200: '#EEFB9B',
          300: '#E4F963',
          400: '#D9F804', // Use este para botões principais
          500: '#B5CF03',
          600: '#92A702',
          900: '#1A1A1A',
        },
        secondary: {
          purple: '#5B4EFF', // Roxo (rotas/detalhes)
          blue: '#89CFF0',   // Azul claro
          orange: '#FF5F2D', // Laranja
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
        'float': '0 10px 30px -10px rgba(0, 0, 0, 0.15)', // Sombra mais marcada para elementos flutuantes
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