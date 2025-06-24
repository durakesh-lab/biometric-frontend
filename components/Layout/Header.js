import React, { useState, useEffect } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Chip,
  Snackbar,
  Alert,

} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useDispatch, useSelector } from "react-redux";
import { onLogout, SelectCompanyBranchGlobal } from "@/store/authSlice";


// import { confirnDeleteAction, editCompanyAction, getCompanyList } from '@/store/authSlice';
// import { confirnDeleteAction, editCompanyAction, getCompanyList } from '@/store/authSlice';

import BranchlistPage from "../branchcomponentForSelection";
import CompanyListPage from "../companyforselection";
import Cookies from 'js-cookie';
import VisibilityIcon from "@mui/icons-material/Visibility";


export default function Header({ drawerWidth, onDrawerToggle }) {
  let dispatch = useDispatch();
   let selector = useSelector((state)=>{return(state.users.opencompanybranch)});
  const router = useRouter();
  const [anchorElAvatar, setAnchorElAvatar] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [selectModalOpen, setSelectModalOpen] = useState(false);
  const [viewDetailsModalOpen, setViewDetailsModalOpen] = useState(false);
  const [selected_Company, setSelected_Company] = useState("");
  const [Selection, setSelection] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

    const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };
  useEffect(() => {
    // Check for company and branch data in cookies
    const token = Cookies.get("usercompanyandbranch");
    if (token) {
      setUserToken(JSON.parse(token));
    }
  }, [Selection]);

  const handleAvatarClick = (event) => {
    setAnchorElAvatar(event.currentTarget);
  };

  const handleCloseSelection = () => {
    setAnchorElAvatar(null);
  };

  const handleLogout = () => {
    dispatch(onLogout());
    localStorage.removeItem("biometric_token");
    Cookies.remove("usercompanyandbranch");
    router.push("/login");
  };

  const handleSelectClick = () => {
    handleCloseSelection();
    setSelectModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectModalOpen(false);
    setSelected_Company("");
     dispatch(SelectCompanyBranchGlobal(false)) 
  };

  const handleViewDetails = () => {
    handleCloseSelection();
    setViewDetailsModalOpen(true);
  };

  const handleCloseViewDetails = () => {
    setViewDetailsModalOpen(false);
  };

  const handleSelectionComplete = (selectedData) => {
    // This would be called after selection in the modal
    Cookies.set("usercompanyandbranch", JSON.stringify(selectedData));
    setUserToken(selectedData);
    setSelectModalOpen(false);
    setSelected_Company("");
  };
  useEffect(()=>{
    if(selector==="open"){
      setSelectModalOpen(true)
    }
  },[selector])


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
            anchorEl={anchorElAvatar}
            open={Boolean(anchorElAvatar)}
            onClose={handleCloseSelection}
            PaperProps={{
              sx: { mt: 1, borderRadius: 2, boxShadow: 2, minWidth: 250 },
            }}
          >
            {!userToken ? (
              <MenuItem onClick={handleSelectClick} sx={{ color: "primary.main" }}>
                <Box sx={{ textAlign: "center", width: "100%" }}>
                  <Typography variant="body2">No company/branch selected</Typography>
                  <Typography variant="caption">Click to select</Typography>
                </Box>
              </MenuItem>
            ) : (
              <>
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Current Selection
                  </Typography>
                  
                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                    <BusinessIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="body2">{userToken?.company?.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {userToken?.company?._id}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                    <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="body2">{userToken?.branch?.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {userToken?.branch?._id}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Divider />
                
                <MenuItem onClick={handleViewDetails}>
                  <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
                  View Details
                </MenuItem>
                
                <MenuItem onClick={handleSelectClick}>
                  <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
                  Change Selection
                </MenuItem>
              </>
            )}
            
            <Divider />
            
            <MenuItem onClick={() => { handleCloseSelection(); }}>
              Profile
            </MenuItem>
            
            <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>

      {/* Selection Modal */}
      <Dialog open={selectModalOpen} onClose={handleModalClose} maxWidth="lg" fullWidth>
        <DialogTitle>Select Company and Branch</DialogTitle>
        <DialogContent>
          {selected_Company ? (
            <BranchlistPage 
              handleModalClose={handleModalClose} 
              setSelection={setSelection} 
              setselected_Company={setSelected_Company} 
              company_id={selected_Company} 
              handleSelectionComplete={handleSelectionComplete}
              setSnackbar={setSnackbar}
            />
          ) : (
            <CompanyListPage 
              setselected_Company={setSelected_Company} 
              handleSelectionComplete={handleSelectionComplete}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
 <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      {/* View Details Modal */}
      <Dialog open={viewDetailsModalOpen} onClose={handleCloseViewDetails} maxWidth="md" fullWidth>
        <DialogTitle>Company and Branch Details</DialogTitle>
        <DialogContent>
          {userToken && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Company Information</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2">Name:</Typography>
                  <Typography>{userToken.company.name}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Company ID:</Typography>
                  <Typography>{userToken.company.companyId}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Owner:</Typography>
                  <Typography>{userToken.company.owner}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Email:</Typography>
                  <Typography>{userToken.company.email}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Phone:</Typography>
                  <Typography>{userToken.company.phoneNumber}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Industry:</Typography>
                  <Typography>{userToken.company.industry}</Typography>
                </Box>
              </Box>

              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Branch Information</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2">Name:</Typography>
                  <Typography>{userToken.branch.name}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Branch Code:</Typography>
                  <Typography>{userToken.branch.branchCode}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Manager:</Typography>
                  <Typography>{userToken.branch.manager}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Address:</Typography>
                  <Typography>{userToken.branch.address}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Email:</Typography>
                  <Typography>{userToken.branch.email}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Phone:</Typography>
                  <Typography>{userToken.branch.phoneNumber}</Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDetails}>Close</Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
}