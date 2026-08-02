import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        text: "var(--text-primary)",
        muted: "var(--text-secondary)",
        border: "var(--stroke-tertiary)",
        card: "var(--fill-elevated)",
        danger: "var(--status-error)",
        success: "var(--status-success)",
        warning: "var(--status-warning)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
    },
  },
  plugins: [],
} satisfies Config;