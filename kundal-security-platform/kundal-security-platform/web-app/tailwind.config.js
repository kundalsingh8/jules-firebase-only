/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#1E3A8A',
          emerald: '#10B981',
          slate: '#475569',
        }
      }
    },
  },
  plugins: [],
}
