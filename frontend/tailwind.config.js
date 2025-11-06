/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0A1128',
        secondary: '#1E2749',
        accent: '#273469',
        nbared: '#eb1433',
        nbared2: '#bf132c',
        light: '#F4F5F7',
        dark: '#2C2C2C',
        silver: '#D9D9D9',
      }
    },
  },
  plugins: [],
}

