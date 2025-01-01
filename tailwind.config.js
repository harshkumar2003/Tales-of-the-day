/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  darkMode: 'class',
  theme: {
    extend: {
      borderRadius: {
        'custom-br': '55px',
        'custom-s-lg': '30px',
      },
      screens: {
        'sm': {'max': '767px'},
        'md': {'min': '768px', 'max': '1023px'},
        'lg': {'min': '1024px', 'max': '1279px'},
        'xl': {'min': '1280px', 'max': '1535px'},
        '2xl': {'min': '1536px'},
      },
      fontFamily: {
        'roboto-mono': ['Roboto Mono', 'monospace'],
        'Tiro': ['Tiro Devanagari Hindi', 'serif'],
        'crimson': ['Crimson Text', 'serif'],
        'Segoe': ['Segoe UI', 'sans-serif'],
        'Inter': ['Inter', 'sans-serif'],
        'Libre': ["Libre Caslon Text", "serif"],
        'asul':["Asul", "serif"]
        
        
        
      },
    },
  },
  plugins: [],
};
