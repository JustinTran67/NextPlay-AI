/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Fonts
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      // Custom Colors
      colors: {
        primary: '#0A1128',
        secondary: '#1E2749',
        accent: '#273469',
        nbared: '#eb1433',
        nbared2: '#bf132c',
        light: '#F4F5F7',
        dark: '#2C2C2C',
        silver: '#D9D9D9',
      },
      // Animations
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        growIn: {
          '0%': { opacity: 0, transform: 'scale(0.2)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.8s ease-out forwards',
        oneSpin: "spin 1s",
        slowSpin: "spin 3s linear infinite",
        growIn: 'growIn 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
}

