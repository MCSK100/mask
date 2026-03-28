/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        "neon-pink": "0 0 20px rgba(236, 72, 153, 0.45), 0 0 40px rgba(236, 72, 153, 0.2), inset 0 0 30px rgba(236, 72, 153, 0.08)",
        "neon-blue": "0 0 20px rgba(56, 189, 248, 0.45), 0 0 40px rgba(56, 189, 248, 0.2), inset 0 0 30px rgba(56, 189, 248, 0.08)",
        "neon-cyan": "0 0 16px rgba(34, 211, 238, 0.35), 0 0 32px rgba(168, 85, 247, 0.15)",
        "neon-magenta": "0 0 24px rgba(217, 70, 239, 0.4), 0 0 48px rgba(168, 85, 247, 0.2)",
        "bubble-me": "0 4px 24px rgba(168, 85, 247, 0.35), 0 0 1px rgba(244, 114, 182, 0.5)",
        "bubble-them": "0 4px 20px rgba(56, 189, 248, 0.2), 0 0 1px rgba(56, 189, 248, 0.4)"
      },
      backgroundImage: {
        "neon-logo": "linear-gradient(135deg, #e879f9 0%, #22d3ee 50%, #a855f7 100%)",
        "neon-chat-border": "linear-gradient(135deg, rgba(236,72,153,0.6), rgba(56,189,248,0.6), rgba(168,85,247,0.5))"
      }
    }
  },
  plugins: []
}
