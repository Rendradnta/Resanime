/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Contoh jika Anda ingin menggunakan font Inter
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'), // Plugin untuk video player
  ],
}