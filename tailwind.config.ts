import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#08080a",
        onyx: "#040406",
        carbon: "#121317",
        graphite: "#1c1d22",
        slateBorder: "#2e3038",
        smoke: "#464853",
        ash: "#5e616e",
        steel: "#777a88",
        fog: "#9194a1",
        mist: "#acafb9",
        silver: "#c7c9d1",
        bone: "#e2e3e9",
        "paper-white": "#ffffff",
        copper: "#cc9166",
        "gilded-gradient": "#ae9357",
      },
      fontFamily: {
        sans: ["var(--font-cairo)", "var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "var(--font-cairo)", "serif"],
        display: ["var(--font-playfair)", "var(--font-cairo)", "serif"],
      },
      borderRadius: {
        card: "10px",
        pill: "9999px",
      },
      backgroundImage: {
        "gilded-gradient":
          "linear-gradient(103deg, rgb(174, 147, 87), rgb(255, 240, 204) 40%, rgb(174, 147, 87) 70%, rgba(189, 157, 79, 0))",
      },
    },
  },
  plugins: [],
};
export default config;
