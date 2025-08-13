import { type Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // enable class strategy
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Map semantic names to CSS variables so existing code can use `bg-background` or `text-foreground`
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        primary: "var(--primary)",
        "btn-bg": "var(--btn-bg)",
        "btn-text": "var(--btn-text)",
      },
    },
  },
  plugins: [],
};

export default config;
