/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"], // Responsive design setup
  theme: {
    extend: {
      colors: {
        'sky-blue': '#60A5FA',
        'deep-blue': '#2563EB',
        'sunny-yellow': '#FCD34D',
        'rain-gray': '#6B7280',
        'storm-purple': '#7C3AED',
        'cloud-white': '#F3F4F6',
        'clear-night': '#1E3A8A',
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-in-out',
        'float': 'float 3s ease-in-out infinite',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}