/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sarabun: ['Sarabun', 'sans-serif'],
      },
      colors: {
        'ehp-input': '#f5f8fa',
        'ehp-placeholder': '#798aa3',
        'ehp-title': '#1d212d',
      },
    },
  },
  plugins: [],
}
