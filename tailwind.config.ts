import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brasil: {
          green: "#009C3B",
          yellow: "#FFDF00",
          blue: "#002776",
          cyan: "#00C4C8",
        },
      },
      boxShadow: {
        sticker: "0 18px 45px rgba(0, 39, 118, 0.24)",
      },
    },
  },
  plugins: [],
};

export default config;
