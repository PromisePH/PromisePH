import { extendTheme } from "@chakra-ui/react"

const config = {
  useSystemColorMode: false,
  initialColorMode: 'dark',
  colors: {
    brand: {
      blackpearl: '#1E252B',
      bunker: '#262D34',
      midnight: '#2C353D',
      orangered: '#FF4401',
      periwinkle: '#C5D0E6',
    },
  },
}

const Theme = extendTheme({ config })
export default Theme