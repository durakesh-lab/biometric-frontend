// pages/_app.js
import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Skeleton, Stack } from "@mui/material";
import "@fontsource/roboto";
import "@fontsource/poppins";
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
    fontFamily: "Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    h1: { fontFamily: "Poppins, sans-serif" },
    h2: { fontFamily: "Poppins, sans-serif" },
    h3: { fontFamily: "Poppins, sans-serif" },
    h4: { fontFamily: "Poppins, sans-serif" },
    h5: { fontFamily: "Poppins, sans-serif" },
    h6: { fontFamily: "Poppins, sans-serif", fontWeight: 600 },
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

function PageSkeletonLoader() {
  const chipStyles = {
    borderRadius: 999,
    bgcolor: "rgba(14, 159, 110, 0.12)",
  };

  const textLineStyles = {
    bgcolor: "rgba(33, 37, 41, 0.08)",
  };

  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, md: 4 },
        background:
          "linear-gradient(135deg, rgba(14, 159, 110, 0.08) 0%, rgba(248, 249, 250, 0.96) 45%, rgba(255, 255, 255, 0.98) 100%)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Box
        sx={{
          width: "min(100%, 1080px)",
          borderRadius: 6,
          border: "1px solid rgba(14, 159, 110, 0.12)",
          boxShadow: "0 30px 80px rgba(15, 23, 42, 0.10)",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          p: { xs: 2, sm: 3, md: 4 },
          overflow: "hidden",
        }}
      >
        <Stack spacing={3}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ minHeight: 72 }}
          >
            <Skeleton
              variant="circular"
              width={56}
              height={56}
              animation="wave"
              sx={{ bgcolor: "rgba(14, 159, 110, 0.14)" }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Skeleton
                variant="text"
                width={140}
                height={18}
                animation="wave"
                sx={chipStyles}
              />
              <Skeleton
                variant="text"
                width="62%"
                height={56}
                animation="wave"
                sx={textLineStyles}
              />
            </Box>
            <Skeleton
              variant="rounded"
              width={108}
              height={36}
              animation="wave"
              sx={chipStyles}
            />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Skeleton
                variant="rounded"
                height={280}
                animation="wave"
                sx={{
                  borderRadius: 4,
                  bgcolor: "rgba(14, 159, 110, 0.10)",
                }}
              />

              <Stack
                direction="row"
                spacing={1.5}
                sx={{ mt: 2, flexWrap: "wrap" }}
              >
                {[0, 1, 2].map((item) => (
                  <Skeleton
                    key={item}
                    variant="rounded"
                    width={96 + item * 18}
                    height={28}
                    animation="wave"
                    sx={chipStyles}
                  />
                ))}
              </Stack>
            </Box>

            <Box sx={{ width: { xs: "100%", md: 420 }, flexShrink: 0 }}>
              <Skeleton
                variant="text"
                width="48%"
                height={44}
                animation="wave"
                sx={textLineStyles}
              />
              <Skeleton
                variant="text"
                width="84%"
                height={28}
                animation="wave"
                sx={textLineStyles}
              />

              <Skeleton
                variant="rounded"
                height={64}
                animation="wave"
                sx={{
                  mt: 3,
                  borderRadius: 3,
                  bgcolor: "rgba(33, 37, 41, 0.08)",
                }}
              />
              <Skeleton
                variant="rounded"
                height={64}
                animation="wave"
                sx={{
                  mt: 2,
                  borderRadius: 3,
                  bgcolor: "rgba(33, 37, 41, 0.08)",
                }}
              />
              <Skeleton
                variant="rounded"
                height={56}
                animation="wave"
                sx={{
                  mt: 3,
                  borderRadius: 3,
                  bgcolor: "rgba(14, 159, 110, 0.12)",
                }}
              />

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mt: 3 }}
              >
                <Skeleton
                  variant="text"
                  width={120}
                  height={24}
                  animation="wave"
                  sx={textLineStyles}
                />
                <Skeleton
                  variant="text"
                  width={150}
                  height={24}
                  animation="wave"
                  sx={textLineStyles}
                />
              </Stack>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}

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
    if (typeof document === "undefined") return undefined;

    const { body, documentElement } = document;
    const previousBodyOverflow = body.style.overflow;
    const previousHtmlOverflow = documentElement.style.overflow;

    if (pageLoading) {
      body.style.overflow = "hidden";
      documentElement.style.overflow = "hidden";
    } else {
      body.style.overflow = previousBodyOverflow;
      documentElement.style.overflow = previousHtmlOverflow;
    }

    return () => {
      body.style.overflow = previousBodyOverflow;
      documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [pageLoading]);

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
  }, [router, router.pathname]);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* <PermisissionRole /> */}
        {pageLoading && (
          <PageSkeletonLoader />
        )}
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  );
}
