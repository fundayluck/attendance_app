/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      backgroundImage: {
        'Background-login': "url('../assets/images/LoginBackground.png')",
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
