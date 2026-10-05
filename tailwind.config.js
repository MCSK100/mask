/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
theme: {
    extend: {
      fontFamily: {
        display: ["Londrina Solid", "Karla", "sans-serif"],
        sans: ["Karla", "system-ui", "sans-serif"],
      },
      colors: {
        supari: {
          primary: "#f72b2b",
          secondary: "#cb3e42",
          paper: "#ffffff",
          ink: "#0c090c",
          black: "#000000",
        },
      },
    }
  },
  plugins: []
}
