// pages/_app.js
import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "../styles/globals.css";
import { Provider } from "react-redux";
import { store } from "../src/store/store"; // Adjust the path if needed
import 'bootstrap/dist/css/bootstrap.min.css';
export const theme = createTheme({
  palette: {
    primary: {
      // main: "#4CAF50", // green accent
      main: "#0E9F6E",
    },
    background: {
      default: "#F8F9FA", // off-white
      paper: "#FFFFFF",
    },
    text: {
      primary: "#212529",
      secondary: "#6c757d",
    },
  },
  typography: {
    fontFamily:
      "Inwsster, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h6: { fontWeight: 600 },
    body2: { color: "#6c757d" },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: "#FFFFFF",
          color: "#212529",
          borderBottom: "1px solid #e0e0e0",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#FFFFFF",
          borderRight: "1px solid #e0e0e0",
        },
      },
    },
  },
});

export default function MyApp({ Component, pageProps }) {
    React.useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);
  return (
<Provider store={store}>
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Component {...pageProps} />
  </ThemeProvider>
</Provider>

  );
}
