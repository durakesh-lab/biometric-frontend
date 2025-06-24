import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Home as HomeIcon,
  CreditCard as CreditCardIcon,
  Group as GroupIcon,
  CalendarMonth as CalendarMonthIcon,
  WorkOutline as WorkOutlineIcon,
  PersonSearch as PersonSearchIcon,
  HelpOutline as HelpOutlineIcon,
  Settings as SettingsIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
    GroupWork as DepartmentIcon,
     Business as BusinessIcon
} from "@mui/icons-material";
import { useRouter } from "next/router";
import StoreIcon from '@mui/icons-material/Store';
import { useDispatch, useSelector } from "react-redux";
import { confirnDeleteAction, SelectCompanyBranchGlobal } from "@/store/authSlice";
import Cookies from "js-cookie";


export default function Sidebar({ drawerWidth = 240, mobileOpen, handleDrawerToggle }) {
    let dispatch = useDispatch();
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(null);  
 let reduxdata=useSelector((state)=>{if(state.users.getPermission){return((state.users.getPermission))}else{return(state.users.getPermission)} })
  var rolepermission={}
var allpermission={}
 if(reduxdata?.rolepermission){
 rolepermission=JSON.parse( reduxdata.rolepermission)
 allpermission=reduxdata.allpermission
 }
 
const menuGroups = [
  {
    heading: "GENERAL",
    items: [
      {
        label: "Dashboard",
        icon: <HomeIcon />,
        link: "/dashboard",
      },
      // {
      //   label: "Payroll",
      //   icon: <CreditCardIcon />,
      //   subItems: [
      //     { label: "Payslips", link: "/payroll/payslips" },
      //     { label: "Reports", link: "/payroll/reports" },
      //   ],
      // },
     ...(allpermission.length && rolepermission.permission.includes(allpermission[0]._id)
        ? [
            {
              label: "Company",
              icon: <BusinessIcon />,
              subItems: [
                { label: "All Company", link: "/company/companylist" },
              ],
            },
          ]
        : []), 
       {
        label: "Permissions",
        icon: <BusinessIcon />,
        subItems: [
          { label: "manage Permission", link: "/permission" }
          // { label: "Add Company", link: "/company/addcompany" },
        ],
      },
// ,
//       {
//         label: "Branch",
//         icon: <StoreIcon />,
//         subItems: [
//           { label: "All Branch", link: "/Branch/branchlist" },
//           // { label: "Add Branch", link: "/Branch/addbranch" },
//         ],
//       },
//       {
//         label: "Department",
//         icon: <DepartmentIcon />,
//         subItems: [
//           { label: "All Departments", link: "/department/departmentlist" },
//           // { label: "Add Department", link: "/department/adddepartment" },
//         ],
//       },
      // {
      //   label: "Employee",
      //   icon: <GroupIcon />,
      //   subItems: [
      //     { label: "All Employees", link: "/employee/employeelist" },
      //     // { label: "Add Employee", link: "/employee/addEmployee" },
      //   ],
      // },
      // {
      //   label: "Staff",
      //   icon: <GroupIcon />,
      //   subItems: [
      //     { label: "All Staff", link: "/staff" },
      //     // { label: "All employees", link: "/employee/employeelist" },
      //     // { label: "All Employees", link: "/employee/employeelist" },
      //     // { label: "Add Employee", link: "/employee/addEmployee" },
      //   ],
      // },
      // {
      //   label: "Position",
      //   icon: <GroupIcon />,
      //   subItems: [
      //     { label: "All Position", link: "/Position/Positionlist" },
      //     { label: "Add Position", link: "/Position/addPosition" },
      //   ],
      // },
      // {
      //   label: "Attendance",
      //   icon: <CalendarMonthIcon />,
      //   subItems: [
      //     { label: "Daily Attendance", link: "/attendance/daily" },
      //     { label: "Monthly Attendance", link: "/attendance/monthly" },
      //   ],
      // },
    ],
  },
  {
    heading: "USER MANAGEMENT",
    items: [
      {
        label: "Manage Users",
        icon: <WorkOutlineIcon />,
        subItems: [
          { label: "manage Group", link: "/managegroup" },
          // { label: "Post New Job", link: "/jobs/new" },
        ],
      },
       {
        label: "Profile Management",
        icon: <WorkOutlineIcon />,
        subItems: [
          { label: "My Profile", link: "/myprofile" },
          { label: "Users Profile", link: "/jobs/new" },
        ],
      },
      // {
      //   label: "Candidate",
      //   icon: <PersonSearchIcon />,
      //   subItems: [
      //     { label: "All Candidates", link: "/candidates/all" },
      //     { label: "Shortlisted", link: "/candidates/shortlisted" },
      //   ],
      // },
      // {
      //   label: "Calendar",
      //   icon: <CalendarMonthIcon />,
      //   subItems: [
      //     { label: "Events", link: "/calendar/events" },
      //     { label: "Reminders", link: "/calendar/reminders" },
      //   ],
      // },
    ],
  },
    {
    heading: "Setting",
    items: [
      {
        label: "Setting",
        icon: <WorkOutlineIcon />,
        subItems: [
          { label: "General Setting", link: "/settings/generalsetting" },
          // { label: "Post New Job", link: "/jobs/new" },
        ],
      },
    ],
  },
  // {
  //   heading: "SUPPORT",
  //   items: [
  //     {
  //       label: "Help center",
  //       icon: <HelpOutlineIcon />,
  //       link: "/help",
  //     },
  //     {
  //       label: "Setting",
  //       icon: <SettingsIcon />,
  //       link: "/settings",
  //     },
  //   ],
  // },
];
//  console.log(rolepermission.permission,allpermission,allpermission.length && allpermission,allpermission.length && rolepermission.permission.includes(allpermission[0]._id), "***************##############################",menuGroups)

  const isItemActive = (item) => {
    if (item.link) {
      return router.pathname === item.link;
    }
    if (item.subItems) {
      return item.subItems.some((subItem) => router.pathname === subItem.link);
    }
    return false;
  };

  const isSubItemActive = (link) => {
    return router.pathname === link;
  };

  const handleToggle = (label) => {
    setOpenMenu((prev) => (prev === label ? null : label));
  };

  const handleClickItem = (link) => {
    if (link) {
      router.push(link);
    }
  };

  return (
    <> 
    <Drawer
    variant="temporary"
    open={mobileOpen}
    onClose={handleDrawerToggle}
    ModalProps={{
      keepMounted: true, // Better open performance on mobile
    }}
    sx={{
      display: { xs: 'block', md: 'none' },
      '& .MuiDrawer-paper': {
        boxSizing: 'border-box',
        width: drawerWidth,
        backgroundColor: "#fff",
        borderRight: "1px solid #E5E7EB",
      },
    }}
  >
     <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 64,
            borderBottom: "1px solid #E5E7EB",
          }}
        >
        <Box sx={{ display: "flex", alignItems: "center",marginTop:"40%" }}>
          <img
            src="/images/biometric_logo.png"
            alt="StaffX Logos"
            style={{ width: 30, height: "auto", marginRight: 8 }}
          />
          {/* <Typography variant="h6" noWrap sx={{ fontWeight: "bold" }}>
            StaffX
          </Typography> */}
        </Box>
      </Toolbar>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflowY: "auto",
          pt: 2,
        }}
      >
        {menuGroups.map((group) => (
          <Box key={group.heading} sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              sx={{
                color: "#9CA3AF",
                fontWeight: "bold",
                textTransform: "uppercase",
                px: 2,
                mb: 1,
                display: "block",
              }}
            >
              {group.heading}
            </Typography>

            <List disablePadding>
              {group.items.map((item) => {
                const hasSubItems = !!item.subItems;
                // Keep menu open if it's toggled open or active
                const isOpen = openMenu === item.label || isItemActive(item);
                const isActive = isItemActive(item);
           
              if(item.label=="Manage Users"){
                confirnDeleteAction(true)
              }
                return (
                  <React.Fragment key={item.label}>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => {
                          if (hasSubItems) {
                            handleToggle(item.label);
                          } else {
                            handleClickItem(item.link);
                          }
                        }}
                        sx={{
                          px: 2,
                          py: 1,
                          marginX: 1,
                          borderRadius: 1,
                          "&:hover": {
                            backgroundColor: "#F3F4F6",
                          },
                          ...(isActive
                            ? {
                                backgroundColor: "#ECFDF5",
                                color: "#10B981",
                                "& .MuiListItemIcon-root": {
                                  color: "#10B981",
                                },
                                borderLeft: "3px solid #10B981",
                                pl: 1.75,
                              }
                            : {}),
                        }}
                      >
                        {item.icon && (
                          <ListItemIcon
                            sx={{
                              color: "inherit",
                              minWidth: "36px",
                            }}
                          >
                            {item.icon}
                          </ListItemIcon>
                        )}
                        <ListItemText primary={item.label} />
                        {hasSubItems && (isOpen ? <ExpandLess /> : <ExpandMore />)}
                      </ListItemButton>
                    </ListItem>
                    {hasSubItems && (
                      <Collapse in={isOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          {item.subItems.map((sub) => (
                            <ListItem disablePadding key={sub.label}>
                              <ListItemButton
                                sx={{
                                  pl: 4,
                                  py: 0.75,
                                  mx: 2,
                                  borderRadius: 1,
                                  "&:hover": {
                                    backgroundColor: "#F3F4F6",
                                  },
                                  ...(isSubItemActive(sub.link)
                                    ? {
                                        backgroundColor: "#ECFDF5",
                                        color: "#10B981",
                                        borderLeft: "3px solid #10B981",
                                        pl: 3.75,
                                      }
                                    : {}),
                                }}
                                onClick={() => handleClickItem(sub.link)}
                              >
                                <ListItemText primary={sub.label} />
                              </ListItemButton>
                            </ListItem>
                          ))}
                        </List>
                      </Collapse>
                    )}
                  </React.Fragment>
                );
              })}
            </List>
          </Box>
        ))}

        <Divider sx={{ mt: "auto", mb: 2 }} />

        <Box sx={{ px: 2, mb: 2 }}>
          <Typography
            variant="caption"
            sx={{
              color: "#9CA3AF",
              fontWeight: "bold",
              textTransform: "uppercase",
              mb: 1,
              display: "block",
            }}
          >
            Appearance
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#F3F4F6",
                },
              }}
            >
              <LightModeIcon sx={{ color: "#6B7280" }} />
            </Box>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#F3F4F6",
                },
              }}
            >
              <DarkModeIcon sx={{ color: "#6B7280" }} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Drawer>

<Drawer
variant="permanent"
sx={{
  display: { xs: 'none', md: 'block' },
  '& .MuiDrawer-paper': {
    boxSizing: 'border-box',
    width: drawerWidth,
    backgroundColor: "#fff",
    borderRight: "1px solid #E5E7EB",
  },
}}
open
>
<Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 64,
            borderBottom: "1px solid #E5E7EB",
          }}
        >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img
            src="/images/biometric_logo.png"
            alt="StaffX Logo"
            style={{ width: 30, height: "auto", marginRight: 8 }}
          />
          <Typography variant="h6" noWrap sx={{ fontWeight: "bold" }}>
            Biometric
          </Typography>
        </Box>
      </Toolbar>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflowY: "auto",
          pt: 2,
        }}
      >
        {menuGroups.map((group) => (
          <Box key={group.heading} sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              sx={{
                color: "#9CA3AF",
                fontWeight: "bold",
                textTransform: "uppercase",
                px: 2,
                mb: 1,
                display: "block",
              }}
            >
              {group.heading}
            </Typography>

            <List disablePadding>
              {group.items.map((item) => {
                const hasSubItems = !!item.subItems;
                // Keep menu open if it's toggled open or active
                const isOpen = openMenu === item.label || isItemActive(item);
                const isActive = isItemActive(item);

                return (
                  <React.Fragment key={item.label}>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => {
                          if (hasSubItems) {
                            handleToggle(item.label);
                          } else {
                            handleClickItem(item.link);
                          }
                        }}
                        sx={{
                          px: 2,
                          py: 1,
                          marginX: 1,
                          borderRadius: 1,
                          "&:hover": {
                            backgroundColor: "#F3F4F6",
                          },
                          ...(isActive
                            ? {
                                backgroundColor: "#ECFDF5",
                                color: "#10B981",
                                "& .MuiListItemIcon-root": {
                                  color: "#10B981",
                                },
                                borderLeft: "3px solid #10B981",
                                pl: 1.75,
                              }
                            : {}),
                        }}
                      >
                        {item.icon && (
                          <ListItemIcon
                            sx={{
                              color: "inherit",
                              minWidth: "36px",
                            }}
                          >
                            {item.icon}
                          </ListItemIcon>
                        )}
                        <ListItemText primary={item.label} />
                        {hasSubItems && (isOpen ? <ExpandLess /> : <ExpandMore />)}
                      </ListItemButton>
                    </ListItem>
                    {hasSubItems && (
                      <Collapse in={isOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          {item.subItems.map((sub) => (
                            <ListItem disablePadding key={sub.label}>
                              <ListItemButton
                                sx={{
                                  pl: 4,
                                  py: 0.75,
                                  mx: 2,
                                  borderRadius: 1,
                                  "&:hover": {
                                    backgroundColor: "#F3F4F6",
                                  },
                                  ...(isSubItemActive(sub.link)
                                    ? {
                                        backgroundColor: "#ECFDF5",
                                        color: "#10B981",
                                        borderLeft: "3px solid #10B981",
                                        pl: 3.75,
                                      }
                                    : {}),
                                }}
                                onClick={() =>{ if(sub.label=="manage Group" || sub.label=="Users Profile"){
                                  if(Cookies.get('usercompanyandbranch')){
                                   handleClickItem(sub.link)
                                  }
                                  else{
                   dispatch(SelectCompanyBranchGlobal("open")) 
         
               
              }
                                }else{
                                  handleClickItem(sub.link)
                                }}  }
                              >
                                <ListItemText primary={sub.label} />
                              </ListItemButton>
                            </ListItem>
                          ))}
                        </List>
                      </Collapse>
                    )}
                  </React.Fragment>
                );
              })}
            </List>
          </Box>
        ))}

        <Divider sx={{ mt: "auto", mb: 2 }} />

        <Box sx={{ px: 2, mb: 2 }}>
          <Typography
            variant="caption"
            sx={{
              color: "#9CA3AF",
              fontWeight: "bold",
              textTransform: "uppercase",
              mb: 1,
              display: "block",
            }}
          >
            Appearance
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#F3F4F6",
                },
              }}
            >
              <LightModeIcon sx={{ color: "#6B7280" }} />
            </Box>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#F3F4F6",
                },
              }}
            >
              <DarkModeIcon sx={{ color: "#6B7280" }} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Drawer>
    </>
  );
}
