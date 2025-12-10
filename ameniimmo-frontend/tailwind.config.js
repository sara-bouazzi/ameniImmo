/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef2f3',
          100: '#fde6e7',
          200: '#fad0d3',
          300: '#f6a9af',
          400: '#f07a86',
          500: '#e54d5e',
          600: '#d12d42',
          700: '#8B1538', // Couleur principale du logo
          800: '#7a1230',
          900: '#6b112c',
        },
        secondary: {
          50: '#f7f7f7',
          100: '#e3e3e3',
          200: '#c8c8c8',
          300: '#a4a4a4',
          400: '#818181',
          500: '#666666',
          600: '#515151',
          700: '#3D3D3D', // Gris du logo
          800: '#2d2d2d',
          900: '#1a1a1a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(139, 21, 56, 0.1), 0 10px 20px -2px rgba(139, 21, 56, 0.05)',
        'glow': '0 0 20px rgba(139, 21, 56, 0.3)',
      },
    },
  },
  plugins: [],
}
