/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Bricolage Grotesque", "Hanken Grotesk", "sans-serif"],
        sans: ["Hanken Grotesk", "system-ui", "sans-serif"],
        mono: ["Space Mono", "ui-monospace", "monospace"],
        hand: ["Shantell Sans", "cursive"],
        serif: ["Fraunces", "Georgia", "serif"],
      },
      colors: {
        ink: {
          DEFAULT: "#14202B",
          soft: "#4A6173",
          faint: "#8AA6B8",
        },
        brand: {
          DEFAULT: "#F0531C",
          deep: "#D2410E",
        },
        tool: "#0D99FF",
        canvas: {
          DEFAULT: "#AFD8F0",
          deep: "#3E97E2",
          light: "#ACD8F4",
        },
        soft: "#F1F6FA",
        frame: "#FFFFFF",
        supari: {
          primary: "#F0531C",
          secondary: "#D2410E",
          paper: "#ffffff",
          ink: "#14202B",
          black: "#14202B",
        },
      },
      boxShadow: {
        omd: "0 20px 50px -32px rgba(20,19,16,.32)",
        card: "0 20px 46px -30px rgba(20,30,45,.42), 0 5px 16px -12px rgba(20,30,45,.28)",
      },
      borderRadius: {
        omd: "18px",
      },
    },
  },
  plugins: [],
}
