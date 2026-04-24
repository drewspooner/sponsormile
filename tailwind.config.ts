import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      colors: {
        potion: {
          ink: "#070512",
          glass: "rgba(15, 10, 28, 0.58)",
          violet: "#7c3aed",
          mint: "#34d399",
          coral: "#fb7185",
          glow: "#a78bfa",
        },
      },
      backgroundImage: {
        "potion-mesh":
          "radial-gradient(ellipse 80% 50% at 20% -20%, rgba(124,58,237,0.35), transparent), radial-gradient(ellipse 60% 40% at 90% 10%, rgba(52,211,153,0.2), transparent), radial-gradient(ellipse 50% 30% at 50% 100%, rgba(251,113,133,0.12), transparent)",
        "potion-shine":
          "linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.08) 45%, transparent 90%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-14px) scale(1.02)" },
        },
        "float-delayed": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% center" },
          "100%": { backgroundPosition: "-200% center" },
        },
        "border-glow": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.85" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        "float-delayed": "float-delayed 9s ease-in-out infinite",
        shimmer: "shimmer 4s ease-in-out infinite",
        "border-glow": "border-glow 3s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
