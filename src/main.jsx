import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

import {
  ThemeProvider,
  createTheme
} from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      mode: 'light'
    }
  }
})

ReactDOM.createRoot(
  document.getElementById('root')
).render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
)