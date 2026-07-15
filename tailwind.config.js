/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#D4AF37", // Gold
        secondary: "#1E1E1E", // Charcoal
        accent: "#111111", // Matte Black
        neutral: "#F8F6F2", // Warm White
        muted: "#2E2E2E", // Dark Gray
      },
      fontFamily: {
        playfair: ["'Playfair Display'", "serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
