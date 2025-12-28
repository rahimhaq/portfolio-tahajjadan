/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mendefinisikan palet warna biru kustom
        primary: '#2563eb', // Biru utama (blue-600)
        // secondary: '#1e40af', // Biru lebih gelap (blue-800)
        // accent: '#60a5fa', // Biru terang (blue-400)
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Pastikan import font ini di index.css jika mau
      }
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}

