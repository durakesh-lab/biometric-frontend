import React, { useState } from "react";
import { Box, Toolbar, useMediaQuery } from "@mui/material";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import "@fontsource/roboto";
import "@fontsource/poppins";

import Header from "./Header";
import Sidebar from "./Sidebar";

const drawerWidth = 220;

// Custom theme: Roboto (body) + Poppins (headings)
export const theme = createTheme({
  palette: {
    primary: {
      main: "#0E9F6E",
    },
    background: {
      default: "#F8F9FA",
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
    h6: { fontFamily: "Poppins, sans-serif" },
    fontSize: 10,
    body2: { color: "black" },
  },
});

export default function Layout({ children }) {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <Sidebar 
          drawerWidth={drawerWidth} 
          mobileOpen={mobileOpen} 
          handleDrawerToggle={handleDrawerToggle} 
        />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            overflowX: "hidden",
          }}
        >
          <Header 
            drawerWidth={drawerWidth} 
            onDrawerToggle={handleDrawerToggle} 
          />
          <Toolbar />
          <Box
            sx={{
              p: { xs: 1, sm: 3 },
              width: "100%",
              overflow: "hidden",
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
