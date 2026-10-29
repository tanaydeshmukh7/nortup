/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        northup: {
          bg: "#0B0908",
          secondary: "#15100E",
          brown: "#26130E",
          orange: "#FF4D0A",
          amber: "#FF8738",
          white: "#F5F1ED",
          muted: "#BDB4AE",
          border: "rgba(255, 255, 255, 0.12)",
          card: "#15100E",
          surface: "#1E1613",
          pill: "#241A16",
        }
      },
      fontFamily: {
        keania: ["'Keania One'", "cursive"],
        mono: ["'IBM Plex Mono'", "monospace"],
        jaro: ["'Jaro'", "sans-serif"],
        anton: ["'Anton'", "sans-serif"],
        hammer: ["'Hammersmith One'", "sans-serif"],
        inter: ["'Inter'", "sans-serif"],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        ambientPulse: {
          '0%, 100%': { opacity: '0.45' },
          '50%': { opacity: '0.7' },
        }
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        'marquee-fast': 'marquee 18s linear infinite',
        ambientPulse: 'ambientPulse 6s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
