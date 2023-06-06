import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import Theme from './components/Theme'

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <ColorModeScript initialColorMode={Theme.config.initialColorMode} />
    <ChakraProvider theme={Theme}>
      <App />
    </ChakraProvider>
  </>
)
