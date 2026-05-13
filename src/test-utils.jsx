import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { render } from "@testing-library/react";
import store from "../store";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" }
  }
});

export function renderWithProviders(ui) {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          {ui}
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
}