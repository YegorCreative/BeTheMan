import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./types/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "hsl(var(--color-bg) / <alpha-value>)",
          elevated: "hsl(var(--color-bg-elevated) / <alpha-value>)",
          surface: "hsl(var(--color-surface) / <alpha-value>)",
        },
        fg: {
          DEFAULT: "hsl(var(--color-fg) / <alpha-value>)",
          muted: "hsl(var(--color-fg-muted) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--color-accent) / <alpha-value>)",
          soft: "hsl(var(--color-accent-soft) / <alpha-value>)",
        },
        border: "hsl(var(--color-border) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-main)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.2rem" }],
        sm: ["0.875rem", { lineHeight: "1.35rem" }],
        base: ["1rem", { lineHeight: "1.65rem" }],
        lg: ["1.125rem", { lineHeight: "1.8rem" }],
        xl: ["1.25rem", { lineHeight: "1.9rem" }],
        "2xl": ["1.5rem", { lineHeight: "2.2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.5rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.8rem" }],
        "5xl": ["3rem", { lineHeight: "1.1" }],
      },
      spacing: {
        "fluid-xs": "clamp(0.5rem, 0.4rem + 0.4vw, 0.75rem)",
        "fluid-sm": "clamp(0.75rem, 0.6rem + 0.6vw, 1rem)",
        "fluid-md": "clamp(1rem, 0.8rem + 1vw, 1.5rem)",
        "fluid-lg": "clamp(1.5rem, 1.2rem + 1.4vw, 2.25rem)",
        "fluid-xl": "clamp(2rem, 1.5rem + 2vw, 3rem)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        card: "var(--shadow-card)",
        glow: "var(--shadow-glow)",
      },
      backgroundImage: {
        "hero-gradient": "radial-gradient(circle at 20% 15%, hsl(var(--color-accent-soft) / 0.2), transparent 40%), radial-gradient(circle at 80% 0%, hsl(var(--color-accent) / 0.15), transparent 28%)",
        "surface-gradient": "linear-gradient(180deg, hsl(var(--color-surface) / 0.9), hsl(var(--color-bg-elevated) / 0.95))",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 500ms ease-out both",
        shimmer: "shimmer 2.2s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;