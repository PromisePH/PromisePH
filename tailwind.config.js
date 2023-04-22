/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
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
        'burning-orange': '#FF6934',
        'periwinkle': '#C5D0E6',
      },
    }
  },
  plugins: [],
}

