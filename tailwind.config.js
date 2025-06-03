/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css}"
  ],
  safelist: [
    // Backgrounds
    'bg-white', 'bg-gray-50', 'bg-gray-100', 'bg-red-500', 'bg-blue-100', 'bg-blue-500', 'bg-blue-600', 'bg-blue-700',
    // Text colors
    'text-white', 'text-gray-700', 'text-gray-900', 'text-blue-600', 'text-blue-700',
    // Shadows
    'shadow-sm', 'shadow-md',
    // Hover states
    'hover:bg-gray-100', 'hover:text-blue-600'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
