/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F19', // Deep navy/black
        surface: '#161B26',    // Slate grey card background
        border: '#242C3D',     // Cool grey borders
        textMuted: '#94A3B8',  // Soft grey prose
        income: '#10B981',     // Emerald Green
        expense: '#F43F5E',    // Rose Red
        accent: '#3B82F6'      // Corporate Blue
      }
    },
  },
  plugins: [],
}