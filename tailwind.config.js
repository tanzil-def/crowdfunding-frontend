/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    
    extend: {
      colors: {
        // New primary color added
        primary: "#10b981", 
        sun: "#ffeb3b",
        light: {
          backgroundColor: "#fff",
          cardBgColor: "#f9f9fa",
          primaryTextColor: "#333",
          secondaryTextColor: "#666",
        },
        dark: {
          backgroundColor: "#13131a",
          cardBgColor: "#1c1c24",
          primaryTextColor: "#fff",
          secondaryTextColor: "#808191",
        },
      },
      fontFamily: {
        DM: ["DM Sans", "sans-serif"],
        sans: ["Graphik", "sans-serif"],
        serif: ["Merriweather", "serif"],
      },
      height: {
        "85vh": "calc(100vh - 15vh)",
        "90vh": "calc(100vh - 10vh)",
      },
      boxShadow: {
        custom: "0px 0px 16px rgba(0, 0, 0, 0.2)",
      },
      spacing: {
        128: "32rem",
        144: "36rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      backgroundImage: {
        hero: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=870&q=80')",
      },
    },
  },
  plugins: [],
};