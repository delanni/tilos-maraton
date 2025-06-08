/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,css}"],
  darkMode: "class",
  safelist: [
    // Theme colors
    "bg-background",
    "bg-background-accent",
    "bg-main",
    "bg-accent",
    "bg-card",
    "hover:bg-card-hover",
    "text-main",
    "text-text",
    "text-muted",
    "text-accent",
    "hover:bg-accent-hover",
    "border-border",
    "dark",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        "background-accent": "var(--color-background-accent)",
        main: "var(--color-main)",
        accent: "var(--color-accent)",
        "accent-hover": "var(--color-accent-hover)",
        text: "var(--color-text)",
        muted: "var(--color-text-muted)",
        border: "var(--color-border)",
        card: "var(--color-card)",
        "card-hover": "var(--color-card-hover)",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          "Fira Sans",
          "Droid Sans",
          "Helvetica Neue",
          "sans-serif",
        ],
        mono: ["source-code-pro", "Menlo", "Monaco", "Consolas", "Courier New", "monospace"],
      },
    },
  },
  plugins: [],
};
