import React, { useState } from "react";
import {
  Drawer,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Box,
  Avatar,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from "@mui/icons-material";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { SelectCompanyBranchGlobal } from "@/store/authSlice";
import Cookies from "js-cookie";

// ── theme tokens (matched to the demo) ───────────────────────────
const GREEN = "#0E9F6E";
const GREEN_DARK = "#0b7d57";
const GREEN_LIGHT = "#E6F6F0";
const HEADING = "#9AA3AD";

const menuGroups = [
  {
    heading: "GENERAL",
    items: [
      { label: "Dashboard", icon: "📊", color: "#10B981", link: "/dashboard" },
      // Hidden for now — Permissions / RBAC is deferred until after the device demo.
      // Re-enable here when the roles/permissions phase resumes.
      // {
      //   label: "Permissions",
      //   icon: "🔑",
      //   color: "#6366F1",
      //   subItems: [{ label: "Manage Permission", link: "/permission" }],
      // },
      {
        label: "Organization",
        icon: "🏢",
        color: "#2563EB",
        subItems: [
          { label: "All Company", link: "/company/companylist" },
          { label: "Branches", link: "/company/branches" },
          { label: "Departments", link: "/department/departmentlist" },
        ],
      },
    ],
  },
  {
    heading: "LEAVES MANAGEMENT",
    items: [
      {
        label: "Leaves Management",
        icon: "📅",
        color: "#F59E0B",
        subItems: [
          { label: "My Leaves", link: "/leavemanagement/myleaves/summary" },
          { label: "My Branch Users", link: "/leavemanagement/branchusers/summary" },
        ],
      },
    ],
  },
  {
    heading: "EMPLOYEE MANAGEMENT",
    items: [
      // Hidden for now — "Manage Users / Manage Group" belongs to the deferred
      // roles/permissions/grouping work and still uses the old User data.
      // Re-enable here when that phase resumes.
      // {
      //   label: "Manage Users",
      //   icon: "👥",
      //   color: "#8B5CF6",
      //   subItems: [{ label: "Manage Group", link: "/managegroup" }],
      // },
      {
        label: "Employees",
        icon: "🪪",
        color: "#14B8A6",
        subItems: [
          { label: "My Profile", link: "/profilemanagement/myprofile" },
          // Hidden for now — redundant with Employee Directory while there is a
          // single admin (no branch-scoped Managers). Re-enable when RBAC returns;
          // it then becomes the Manager's own-branch view.
          // { label: "Branch Employees", link: "/profilemanagement/branchusers" },
          { label: "Employee Directory", link: "/profilemanagement/allusers" },
        ],
      },
    ],
  },
  {
    heading: "BIOMETRIC DEVICE",
    items: [
      { label: "Devices", icon: "📟", color: "#0EA5E9", link: "/devices" },
      { label: "Attendance", icon: "🕒", color: "#F97316", link: "/attendance" },
      { label: "Enrollment", icon: "📝", color: "#EC4899", link: "/enrollment" },
    ],
  },
  {
    heading: "SETTING",
    items: [
      {
        label: "Setting",
        icon: "⚙️",
        color: "#64748B",
        subItems: [
          { label: "General Setting", link: "/settings/generalsetting" },
          { label: "Audit Log", link: "/settings/auditlog" },
        ],
      },
    ],
  },
];

export default function Sidebar({ drawerWidth = 240, mobileOpen, handleDrawerToggle }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(null);

  const isItemActive = (item) => {
    if (item.link) return router.pathname === item.link;
    if (item.subItems) return item.subItems.some((s) => router.pathname === s.link);
    return false;
  };
  const isSubItemActive = (link) => router.pathname === link;
  const handleToggle = (label) => setOpenMenu((prev) => (prev === label ? null : label));
  const handleClickItem = (link) => link && router.push(link);

  // sub-items that require a company/branch selection before navigating
  const handleSubClick = (sub) => {
    if (sub.label === "Manage Group") {
      if (Cookies.get("usercompanyandbranch")) handleClickItem(sub.link);
      else dispatch(SelectCompanyBranchGlobal("open"));
    } else {
      handleClickItem(sub.link);
    }
  };

  // ── shared nav content (rendered in both mobile + desktop drawers) ──
  const navContent = (
    <Box 
      sx={{ 
        display: "flex", 
        flexDirection: "column", 
        height: "100%", 
        overflowY: "auto", 
        pt: 2,
        backgroundColor: "#FFFFFF",
        "&::-webkit-scrollbar": {
          width: "5px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#E2E8F0",
          borderRadius: "10px",
        }
      }}
    >
      {menuGroups.map((group) => (
        <Box key={group.heading} sx={{ mb: 2 }}>
          <Typography
            sx={{
              color: "#64748B",
              fontWeight: 700,
              fontSize: 9.5,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              px: 3,
              mt: 1.5,
              mb: 0.75,
              display: "block",
            }}
          >
            {group.heading}
          </Typography>

          <List disablePadding>
            {group.items.map((item) => {
              const hasSubItems = !!item.subItems;
              const isActive = isItemActive(item);
              const isOpen = openMenu === item.label || isActive;

              return (
                <React.Fragment key={item.label}>
                  <ListItem disablePadding sx={{ px: 2, my: 0.35 }}>
                    <ListItemButton
                      onClick={() =>
                        hasSubItems ? handleToggle(item.label) : handleClickItem(item.link)
                      }
                      sx={{
                        px: 2,
                        py: 1,
                        borderRadius: "10px",
                        color: isActive ? "#0b7d57" : "#475569",
                        backgroundColor: isActive 
                          ? "rgba(14, 159, 110, 0.06)" 
                          : (isOpen ? "#F8FAFC" : "transparent"),
                        border: isActive 
                          ? "1px solid rgba(14, 159, 110, 0.15)" 
                          : (isOpen ? "1px solid #E2E8F0" : "1px solid transparent"),
                        boxShadow: isActive ? "0px 2px 8px rgba(14, 159, 110, 0.02)" : "none",
                        position: "relative",
                        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": { 
                          backgroundColor: isActive 
                            ? "rgba(14, 159, 110, 0.1)" 
                            : "#F8FAFC", 
                          color: isActive ? "#0b7d57" : "#0F172A",
                          border: isActive 
                            ? "1px solid rgba(14, 159, 110, 0.2)" 
                            : "1px solid #E2E8F0",
                          "& .menu-label": {
                            transform: "translateX(3px)",
                          },
                          "& .menu-icon-box": {
                            transform: "scale(1.05)",
                          }
                        },
                        "&.Mui-selected": {
                          backgroundColor: "rgba(14, 159, 110, 0.06)",
                          color: "#0b7d57",
                          "&:hover": {
                            backgroundColor: "rgba(14, 159, 110, 0.1)",
                          }
                        },
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          top: "25%",
                          height: "50%",
                          width: "3px",
                          borderRadius: "0 4px 4px 0",
                          backgroundColor: "#0E9F6E",
                          opacity: isActive ? 1 : 0,
                          transform: isActive ? "scaleY(1)" : "scaleY(0.4)",
                          transition: "all 0.2s ease",
                        }
                      }}
                    >
                      {item.icon && (
                        <ListItemIcon
                          className="menu-icon"
                          sx={{ 
                            minWidth: "auto",
                            mr: 1.5,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            className="menu-icon-box"
                            sx={{
                              width: 30,
                              height: 30,
                              borderRadius: "8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: isActive ? `${item.color}22` : `${item.color}0D`,
                              border: isActive ? `1px solid ${item.color}50` : `1px solid ${item.color}20`,
                              boxShadow: isActive ? `0px 2px 8px ${item.color}25` : "none",
                              fontSize: 15,
                              transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                            }}
                          >
                            {item.icon}
                          </Box>
                        </ListItemIcon>
                      )}
                      <ListItemText
                        className="menu-label"
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: 13.5,
                          fontWeight: isActive ? 600 : 500,
                          sx: { transition: "transform 0.2s ease" }
                        }}
                      />
                      {hasSubItems &&
                        (isOpen ? (
                          <ExpandLess sx={{ fontSize: 16, color: "#64748B" }} />
                        ) : (
                          <ExpandMore sx={{ fontSize: 16, color: "#64748B" }} />
                        ))}
                    </ListItemButton>
                  </ListItem>

                  {hasSubItems && (
                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                      <List 
                        component="div" 
                        disablePadding 
                        sx={{ 
                          position: "relative", 
                          pl: 3, 
                          ml: 4.75, 
                          mb: 0.5,
                          borderLeft: "1px dashed #CBD5E1" 
                        }}
                      >
                        {item.subItems.map((sub) => {
                          const subActive = isSubItemActive(sub.link);
                          return (
                            <ListItem disablePadding key={sub.label} sx={{ my: 0.25, pr: 2 }}>
                              <ListItemButton
                                onClick={() => handleSubClick(sub)}
                                sx={{
                                  py: 0.7,
                                  px: 2,
                                  borderRadius: "8px",
                                  color: subActive ? "#0E9F6E" : "#475569",
                                  backgroundColor: subActive ? "#FFFFFF" : "transparent",
                                  border: subActive ? "1px solid #E2E8F0" : "1px solid transparent",
                                  boxShadow: subActive ? "0px 2px 6px rgba(0,0,0,0.02)" : "none",
                                  position: "relative",
                                  transition: "all 0.2s ease",
                                  "&:hover": { 
                                    backgroundColor: subActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.6)",
                                    color: "#0F172A",
                                    border: subActive ? "1px solid #E2E8F0" : "1px solid #F1F5F9",
                                    "&::before": {
                                      backgroundColor: "#475569",
                                      width: "5px",
                                      height: "5px",
                                    }
                                  },
                                  ...(subActive && {
                                    fontWeight: 600,
                                    "&::before": {
                                      backgroundColor: "#0E9F6E",
                                      width: "7px",
                                      height: "7px",
                                      boxShadow: "0px 0px 6px rgba(14, 159, 110, 0.6)",
                                    }
                                  }),
                                  "&::before": {
                                    content: '""',
                                    position: "absolute",
                                    left: -15.5,
                                    top: "50%",
                                    width: "4px",
                                    height: "4px",
                                    borderRadius: "50%",
                                    backgroundColor: "#CBD5E1",
                                    transform: "translateY(-50%)",
                                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                  }
                                }}
                              >
                                <ListItemText
                                  primary={sub.label}
                                  primaryTypographyProps={{
                                    fontSize: 12.5,
                                    fontWeight: subActive ? 600 : 500,
                                  }}
                                />
                              </ListItemButton>
                            </ListItem>
                          );
                        })}
                      </List>
                    </Collapse>
                  )}
                </React.Fragment>
              );
            })}
          </List>
        </Box>
      ))}

      {/* Appearance section integrated cleanly */}
      <Box sx={{ px: 2.5, pt: 1.5, pb: 1, backgroundColor: "#FFFFFF" }}>
        <Typography
          sx={{
            color: "#64748B",
            fontWeight: 700,
            fontSize: 9.5,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            mb: 1.25,
            px: 0.5,
            display: "block",
          }}
        >
          Appearance
        </Typography>
        <Box 
          sx={{ 
            display: "flex", 
            backgroundColor: "#F1F5F9", 
            p: 0.5, 
            borderRadius: "12px",
            gap: 0.5,
            border: "1px solid #E2E8F0"
          }}
        >
          {[
            { icon: <LightModeIcon sx={{ fontSize: 17 }} />, label: "Light", value: "light" },
            { icon: <DarkModeIcon sx={{ fontSize: 17 }} />, label: "Dark", value: "dark" }
          ].map((mode, i) => {
            const isActive = i === 0; // default light mode
            return (
              <Box
                key={mode.value}
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.75,
                  py: 0.75,
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  color: isActive ? "#0E9F6E" : "#64748B",
                  backgroundColor: isActive ? "#FFFFFF" : "transparent",
                  boxShadow: isActive ? "0px 2px 6px rgba(15, 23, 42, 0.05)" : "none",
                  border: isActive ? "1px solid #E2E8F0" : "1px solid transparent",
                  "&:hover": {
                    ...(!isActive && { color: "#0F172A" })
                  }
                }}
              >
                {mode.icon}
                <Typography sx={{ fontSize: 11.5, fontWeight: isActive ? 600 : 500 }}>
                  {mode.label}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Profile quick access card */}
      <Box sx={{ px: 2, mb: 2, mt: "auto", pt: 1.5, pb: 1, backgroundColor: "#FFFFFF" }}>
        <Divider sx={{ mb: 2, borderColor: "#E2E8F0" }} />
        
        <Box 
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 1.25,
            p: 1.25,
            borderRadius: "12px",
            backgroundColor: "#F8FAFC",
            border: "1px solid #E2E8F0",
            boxShadow: "0px 4px 12px rgba(15, 23, 42, 0.02)",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: "#F1F5F9",
              borderColor: "#CBD5E1",
            }
          }}
        >
          <Avatar 
            sx={{ 
              width: 36, 
              height: 36, 
              fontSize: 13, 
              fontWeight: 700,
              background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              boxShadow: "0px 2px 8px rgba(16, 185, 129, 0.2)"
            }}
          >
            SA
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#0F172A", lineHeight: 1.2, noWrap: true, textOverflow: "ellipsis", overflow: "hidden" }}>
              Super Admin
            </Typography>
            <Typography sx={{ fontSize: 11, color: "#64748B", lineHeight: 1.2, noWrap: true, textOverflow: "ellipsis", overflow: "hidden" }}>
              admin@biometric.com
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  const brand = (
    <Toolbar
      sx={{
        display: "flex",
        alignItems: "center",
        px: 3,
        minHeight: 76,
        borderBottom: "1px solid #E2E8F0",
        backgroundColor: "#FFFFFF",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <img
          src="/images/biometric_logo.png"
          alt="Biometric Logo"
          style={{ 
            width: 32, 
            height: "auto",
            filter: "drop-shadow(0px 2px 8px rgba(16, 185, 129, 0.15))",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1) rotate(5deg)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1) rotate(0deg)"}
        />
        <Typography variant="h6" noWrap sx={{ fontWeight: 800, fontSize: 19, letterSpacing: "-0.02em", color: "#0F172A" }}>
          Biometric
        </Typography>
      </Box>
    </Toolbar>
  );

  const paperSx = {
    boxSizing: "border-box",
    width: drawerWidth,
    backgroundColor: "#FFFFFF",
    borderRight: "1px solid #E2E8F0",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.01)",
  };

  return (
    <>
      {/* Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: "block", md: "none" }, "& .MuiDrawer-paper": paperSx }}
      >
        {brand}
        {navContent}
      </Drawer>

      {/* Desktop */}
      <Drawer
        variant="permanent"
        open
        sx={{ display: { xs: "none", md: "block" }, "& .MuiDrawer-paper": paperSx }}
      >
        {brand}
        {navContent}
      </Drawer>
    </>
  );
}
