/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "primary": "#408A71",
        "on-primary": "#003829",
        "primary-container": "#559e84",
        "on-primary-container": "#003023",
        "background": "#000000",
        "surface": "#16130c",
        "surface-card": "#1A1A1A",
        "border-gray": "#262626",
        "text-primary": "#FFF7EB",
        "text-secondary": "#A3A3A3",
        "on-surface-variant": "#bec9c3",
        "secondary-container": "#474746",
        "on-secondary-container": "#b7b5b4",
        "error": "#ffb4ab",
        "on-error": "#690005",
        "error-container": "#93000a",
        "on-error-container": "#ffdad6",
        "surface-dim": "#16130c",
        "surface-bright": "#3d3931",
        "surface-container-lowest": "#100e08",
        "surface-container-low": "#1e1b14",
        "surface-container": "#221f18",
        "surface-container-high": "#2d2a22",
        "surface-container-highest": "#38342c",
        "on-background": "#fff7eb",
        "on-surface": "#fff7eb",
        "inverse-on-surface": "#343028",
        "surface-variant": "#38342c",
      },
      fontFamily: {
        sans: ["Geist", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"]
      },
      spacing: {
        "margin-mobile": "16px",
        "margin-desktop": "64px",
        "container-max": "1440px",
        "gutter": "24px",
        "unit": "4px",
        "stack-sm": "8px",
        "stack-md": "16px",
        "stack-lg": "24px",
        "margin-page": "32px",
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      }
    },
  },
  plugins: [],
}
