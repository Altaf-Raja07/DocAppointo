/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Matches your logo: clean blue + soft teal accent + subtle border
        primary: "#2563eb",   // blue-600
        accent:  "#10b981",   // emerald-500
        border:  "#e5e7eb",   // gray-200 for subtle lines
      },
      gridTemplateColumns:{
        'auto': 'repeat(auto-fill, minmax(200px, 1fr))'
      }
    },
  },
  plugins: [],
}
