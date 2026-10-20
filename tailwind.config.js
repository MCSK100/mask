/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["Space Mono", "ui-monospace", "monospace"],
        hand: ["Shantell Sans", "cursive"],
        serif: ["Playfair Display", "Georgia", "serif"],
      },
      colors: {
        ink: {
          DEFAULT: "#f3f1ed",
          soft: "#aab2ba",
          faint: "#8c9aa3",
        },
        brand: {
          DEFAULT: "#b9dceb",
          deep: "#d8eff8",
        },
        tool: "#b9dceb",
        canvas: {
          DEFAULT: "#080b10",
          deep: "#111820",
          light: "#18222c",
        },
        soft: "#18222c",
        frame: "#111820",
        supari: {
          primary: "#b9dceb",
          secondary: "#d8eff8",
          paper: "#111820",
          ink: "#f3f1ed",
          black: "#080b10",
        },
      },
      boxShadow: {
        omd: "0 20px 50px -32px rgba(0,0,0,.66)",
        card: "0 20px 46px -30px rgba(0,0,0,.7), 0 5px 16px -12px rgba(0,0,0,.5)",
      },
      borderRadius: {
        omd: "18px",
      },
    },
  },
  plugins: [],
}
