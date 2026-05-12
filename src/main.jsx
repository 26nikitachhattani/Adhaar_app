import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

import { Provider } from "react-redux"
import store from "./store"

import { BrowserRouter } from "react-router-dom"

import { ThemeProvider, createTheme } from '@mui/material/styles'

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
  <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </Provider>
)