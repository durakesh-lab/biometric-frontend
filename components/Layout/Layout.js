import React, { useState } from "react";
import { Box, Toolbar, useMediaQuery } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Header from "./Header";
import Sidebar from "./Sidebar";

const drawerWidth = 220;

const theme = createTheme({
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
    fontSize: 10,
    body2: { color: "black" },
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
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
          overflowX: 'hidden' // Prevent horizontal scroll
        }}
      >
        <Header 
          drawerWidth={drawerWidth} 
          onDrawerToggle={handleDrawerToggle}
        />
        <Toolbar /> {/* This creates space below the AppBar */}
        <Box sx={{ 
          p: { xs: 1, sm: 3 },
          width: '100%',
          overflow: 'hidden'
        }}>
          {children}
        </Box>
      </Box>
    </Box>
  </ThemeProvider>
);
}