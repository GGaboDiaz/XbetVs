/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#eaeefe',
          500: '#6c63ff',
          700: '#4338ca'
        },
        premium: '#d4af37'
      },
      boxShadow: {
        soft: '0 8px 30px rgba(0,0,0,0.25)'
      },
      borderRadius: {
        '2xl': '1.25rem'
      }
    },
  },
  plugins: [],
}