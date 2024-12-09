/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    colors: {
      reserved: "#47ada9",
      reserved1: "#FCC230",
      collected: "#06D6A0",
      soon: "#DA7416",

      empty: "#DEE0EB",
      merged: "#FC8630",
      split: "#FF445B",
      subBg: "#FCFCFE",
      mainBg: "#FCFCFE",
      primary: "#47ada9",
      secondary: "#5CBBF6",
      third: "#EFF0FD99",
      text: "#171717",
      sub: "#828ABA",
      label: "#828ABA",
      placeholder: "#828ABA",
      input: "#828ABA",

      warning: "#FF445B",
      success: "#0FB015",
      border: "#F1F1FF",
      error: "#FF445B",
      subTitle: "#828ABA",
      "custom-green": "#DAF0E9",

      "third-trans": "#F6F7FEB2",
      line: "#F5F6FF",
      customBlue: "#4F46E5",
      blue: "#1fb6ff",
      purple: "#7e5bef",
      pink: "#ff49db",
      orange: "#ff7849",
      green: "#13ce66",
      description: "#697E95",
      transparent: "transparent",
      current: "currentColor",
      red: "#FF445B",
      black: "#000000",
      white: "#ffffff",
    },
    screens: {
      xs: "425px",

      sm: "576px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "992px",
      // => @media (min-width: 992px) { ... }

      xl: "1200px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1400px",
      "3xl": "1600px",
      // => @media (min-width: 1536px) { ... }
    },
    backgroundImage: {
      "custom-gradient":
        "linear-gradient(92.54deg, #71E7A4 0.77%, #196BAC 98.18%)",

      "custom-gradient1":
        "linear-gradient(94.48deg, #61D1A7 4.13%, #2780AB 99.24%)",
    },
    minHeight: {
      "3/4": "75vh",
    },
    border: {
      "1/2": "0.5px",
    },

    extend: {
      boxShadow: {
        card: "0 4px 4px  rgba(35, 40, 105, 0.08)",
        "base-shadow": "0px 6px 20px 0px #47ada978",
        "base-shadow1": "0px 6px 20px 0px #F5F6FF",
      },
    },
    fontFamily: {
      inter: ["Inter", "sans-serif"],
      switzer: ["Switzer", "sans-serif"],
      "neo-sans": ["NeoSans", "sans-serif"],
      din: ["Din", "sans-serif"],
    },
    container: {
      center: true,
      padding: "1rem",
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
