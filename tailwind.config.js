/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  safelist: ["animate-ring"],
  theme: {
    extend: {
      animation: {
        flip: "flip 1s ease-in-out infinite",
        ring: "ring 0.8s ease-in-out",
      },
      keyframes: {
        flip: {
          "0%": { transform: "rotateY(0deg)" },
          "50%": { transform: "rotateY(180deg)" },
          "100%": { transform: "rotateY(0deg)" },
        },
        ring: {
          "0%": { transform: "rotate(0deg)" },
          "20%": { transform: "rotate(-15deg)" },
          "40%": { transform: "rotate(15deg)" },
          "60%": { transform: "rotate(-10deg)" },
          "80%": { transform: "rotate(10deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
      },
    },
  },
  plugins: [],
};
