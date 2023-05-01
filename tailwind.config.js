/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif']
      },
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        'white': '#ffffff',
        'purple': '#3f3cbb',
        'black-pearl': '#1E252B',
        'bunker': '#262D34',
        'midnight': '#2C353D',
        'orange-red': '#FF4401',
        'periwinkle': '#C5D0E6',
        'Caribbean-green': '#00CC8D',
      },
    }
  },
  plugins: [],
}

