import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
      },
      colors: {
        paper: "#f8f6f1",
        ink: "#1a1a18",
        muted: "#6b6560",
        rule: "#d9d4cc",
      },
    },
  },
  plugins: [],
};

export default config;
