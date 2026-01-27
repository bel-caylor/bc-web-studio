const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./src/**/*.{html,njk,md,mdx,js}",
    "./src/**/*.11ty.js",
    "./src/_includes/**/*.{html,njk,md,mdx,js}",
    "./src/_includes/**/*.11ty.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        heading: ["Space Grotesk", "Inter", ...defaultTheme.fontFamily.sans],
        mono: ["IBM Plex Mono", ...defaultTheme.fontFamily.mono],
      },
      colors: {
        primary: {
          DEFAULT: "#0F1B3D", // Deep midnight navy (hero-safe)
          light: "#1E2F5F",   // Cool steel navy
          medium: "#2C3E6A",  // Blue-gray depth
          dark: "#0B132B",    // Near-black navy for overlays
        },

        accent: {
          DEFAULT: "#B0302A", // Muted crimson (primary CTA)
          light: "#D94A44",
          medium: "#9E2B26",
          dark: "#7E1F1C",
        },

        electric: {
          DEFAULT: "#3FA9F5", // Electric blue (links/focus/highlights)
          light: "#6EC1FF",
          dark: "#1E78C8",
        },

        teal: {
          DEFAULT: "#2DD4BF", // Tasteful cyan/teal (badges/status)
          light: "#5EEAD4",
          dark: "#0F766E",
        },

        violet: {
          DEFAULT: "#6366F1", // Optional soft violet (secondary accents)
          light: "#818CF8",
          dark: "#4338CA",
        },

        background: {
          DEFAULT: "#F7F9FC",
          lightest: "#FBFCFE",
          lighter: "#EEF2F7",
          light: "#E6ECF2",
          medium: "#DCE3EB",
        },
      },
    },
  },
  plugins: [],
}
