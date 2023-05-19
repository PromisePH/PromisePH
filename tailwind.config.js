/** @type {import('tailwindcss').Config} */
export default {
  important: true,
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
        'caribbean-green': '#00CC8D',
        'aluminium': '#818384',
      },
      fontSize: {
        '1xs': ['0.625em', '0.75rem'], /* 10px */
        '2xs': ['0.50em', '0.50rem'], /* 8px */
      },
      maxWidth: {
        '1xs': '13rem', /* 208px */
        '2xs': '10rem', /* 160px */
      },
    }
  },
  plugins: [],
}

