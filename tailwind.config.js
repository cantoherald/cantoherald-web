/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      black: "#000",
      neon: "#09fc99",
      white: "#fff",
      error: "FF9494",
    },
    extend: {},
  },
  plugins: [require("daisyui")],
};
