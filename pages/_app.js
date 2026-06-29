// pages/_app.js
import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, CircularProgress, Typography } from "@mui/material";
import "../styles/globals.css";
import { Provider, useDispatch } from "react-redux";
import { store } from "../src/store/store"; // Adjust the path if needed
import 'bootstrap/dist/css/bootstrap.min.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { jwtDecode } from "jwt-decode";
import { getPermissionbyRole } from "@/store/authSlice";
import PermisissionRole from "../components/permission/permission";
import { useRouter } from "next/router";
import { installAxiosInterceptors } from "../src/api";
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

// Day 9: pages that do NOT require a logged-in user.
const PUBLIC_ROUTES = ['/login', '/register', '/'];

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [pageLoading, setPageLoading] = React.useState(false);

  React.useEffect(() => {
    const handleStart = (url) => {
      if (url !== router.asPath) {
        setPageLoading(true);
      }
    };
    const handleComplete = () => setPageLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  React.useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
    // Day 9: install global axios interceptors (Bearer header + 401→login) once.
    installAxiosInterceptors();
  }, []);

  // Day 9: route guard — redirect to /login if no token on a protected page.
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('biometric_token');
    const path = router.pathname;
    const isPublic = PUBLIC_ROUTES.includes(path);
    if (!token && !isPublic) {
      router.replace('/login');
    }
  }, [router.pathname]);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <PermisissionRole />
        {pageLoading && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(255, 255, 255, 0.75)",
              backdropFilter: "blur(5px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 99999,
            }}
          >
            <CircularProgress color="primary" size={50} thickness={4} />
            <Typography sx={{ mt: 2, fontWeight: 600, color: "text.primary", fontSize: 14 }}>
              Loading page...
            </Typography>
          </Box>
        )}
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  );
}
