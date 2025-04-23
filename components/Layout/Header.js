import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Typography,
  Avatar,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import { useDispatch } from "react-redux";
import { onLogout } from "@/store/authSlice";

export default function Header({ drawerWidth, onDrawerToggle }) {
  let dispatch = useDispatch();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(onLogout());
    localStorage.removeItem("token"); 
    router.push("/login");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        bgcolor: "#fff",
        color: "#374151",
        borderBottom: "1px solid #E5E7EB",
        boxShadow: "none",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* LEFT SECTION: Brand + Search */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ maxWidth: 300, display: { xs: "none", md: "block" } }}>
            <TextField
              placeholder="Search..."
              variant="outlined"
              size="small"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#F9FAFB",
                  "& fieldset": { borderColor: "#E5E7EB" },
                  "&:hover fieldset": { borderColor: "#D1D5DB" },
                  "&.Mui-focused fieldset": { borderColor: "#10B981" },
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "#9CA3AF",
                  opacity: 1,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#9CA3AF" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>

        {/* RIGHT SECTION: Icons + Avatar */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton>
            <NotificationsIcon sx={{ color: "#6B7280" }} />
          </IconButton>
          <IconButton>
            <SettingsIcon sx={{ color: "#6B7280" }} />
          </IconButton>
          
          {/* Avatar with Clickable Menu */}
          <IconButton onClick={handleAvatarClick}>
            <Avatar src="/images/user-avatar.jpg" alt="User" sx={{ width: 32, height: 32 }} />
          </IconButton>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              sx: { mt: 1, borderRadius: 2, boxShadow: 2 },
            }}
          >
            <MenuItem onClick={() => { handleClose(); }}>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}