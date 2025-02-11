/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6366f1", // Indigo-500
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#3b82f6", // Blue-500
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#818cf8", // Lighter indigo
          foreground: "#ffffff",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
