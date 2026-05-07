import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        klein: {
          DEFAULT: "#002FA7",
          dark: "#001D6B",
          light: "#1B4FE0",
        },
        gold: "#FFD700",
        ink: "#0B0B10",
        cream: "#FAF8F4",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["Playfair Display", "Georgia", "serif"],
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        "fade-up": "fade-up 700ms cubic-bezier(0.2, 0.7, 0.2, 1) both",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
