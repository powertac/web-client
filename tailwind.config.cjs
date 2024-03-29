/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
    },
    fontFamily: {
      "sans": ["Inter", "sans-serif"],
      "mono": ["Inconsolata", "monospace"]
    },
    extend: {},
  },
  plugins: [],
}
