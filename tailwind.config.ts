import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: {
      DEFAULT: "#e5e7eb",   // gris clair pour les bordures
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
    },
        primary: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        accent: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
        },
        dark: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
        elevated: "0 10px 40px -10px rgba(0, 0, 0, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.04)",
        glow: "0 0 40px -10px rgba(34, 197, 94, 0.3)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "hero-reveal": "heroReveal 1.1s cubic-bezier(0.22, 1, 0.36, 1) both",
        "hero-kenburns": "heroKenburns 22s ease-in-out infinite alternate",
        "hero-glow-pulse": "heroGlowPulse 5s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        heroReveal: {
          "0%": { filter: "blur(10px)", transform: "scale(0.96) translateY(12px)" },
          "100%": { filter: "blur(0)", transform: "scale(1) translateY(0)" },
        },
        heroKenburns: {
          "0%": { transform: "scale(1) translate(0, 0)" },
          "100%": { transform: "scale(1.12) translate(-2%, -1%)" },
        },
        heroGlowPulse: {
          "0%, 100%": {
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.12), 0 25px 50px -12px rgba(0,0,0,0.5), 0 0 60px -15px rgba(34, 197, 94, 0.35)",
          },
          "50%": {
            boxShadow:
              "0 0 0 1px rgba(251, 146, 60, 0.35), 0 30px 60px -12px rgba(0,0,0,0.55), 0 0 80px -10px rgba(251, 146, 60, 0.45)",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
