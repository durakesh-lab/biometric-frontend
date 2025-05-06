import React from "react";
import {
  Modal,
  Box,
  Typography,
  Divider,
  Grid,
  Button,
  Avatar,
  Paper,
  Stack,
  Chip
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Business as BranchIcon,
  Person as ManagerIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as AddressIcon,
  Settings as SettingsIcon,
  CalendarToday as DateIcon
} from "@mui/icons-material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0E9F6E",
    },
    background: {
      default: "#F8F9FA",
      paper: "#FFFFFF",
    },
    secondary: {
      main: "#3B82F6",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
});

const ViewBranchModal = ({ branch, open, onClose }) => {
  if (!branch) return null;

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return "--";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // Reusable components
  const FieldRow = ({ label, value, icon }) => (
    <>
      <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ mr: 1, color: 'text.secondary' }}>
          {icon}
        </Box>
        <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography variant="body1" sx={{ fontWeight: value !== "--" ? 500 : 400 }}>
          {value || "--"}
        </Typography>
      </Grid>
    </>
  );

  const Section = ({ title, icon, children }) => (
    <Paper elevation={0} sx={{ 
      p: 3, 
      mb: 3, 
      borderRadius: 2, 
      border: '1px solid #e0e0e0',
      backgroundColor: '#fafafa'
    }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        {icon}
        <Typography variant="h6" sx={{ fontWeight: 600 }}>{title}</Typography>
      </Stack>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        {children}
      </Grid>
    </Paper>
  );

  return (
    <ThemeProvider theme={theme}>
      <Modal open={open} onClose={onClose}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 800,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 0,
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: 2
        }}>
          {/* Header */}
          <Box sx={{
            p: 3,
            bgcolor: 'primary.main',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2
          }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>Branch Details</Typography>
            <Chip 
              label="Active" 
              color="success"
              sx={{ color: 'white', fontWeight: 600 }}
            />
          </Box>
          
          {/* Main Content */}
          <Box sx={{ p: 3 }}>
            {/* Profile Header */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 4,
              p: 3,
              backgroundColor: '#f5f5f5',
              borderRadius: 2
            }}>
              <Avatar sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: 'primary.main',
                fontSize: '2rem',
                mr: 3
              }}>
                <BranchIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {branch.name || "Branch"}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {branch.phoneNumber || "No phone number"}
                </Typography>
              </Box>
            </Box>

            {/* Branch Information */}
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Section title="Basic Information" icon={<BranchIcon color="primary" />}>
                  <FieldRow 
                    label="Branch Name" 
                    value={branch.name} 
                    icon={<BranchIcon fontSize="small" />}
                  />
                  <FieldRow 
                    label="Manager" 
                    value={branch.manager} 
                    icon={<ManagerIcon fontSize="small" />}
                  />
                  <FieldRow 
                    label="Address" 
                    value={branch.address} 
                    icon={<AddressIcon fontSize="small" />}
                  />
                </Section>

                <Section title="Contact Information" icon={<PhoneIcon color="primary" />}>
                  <FieldRow 
                    label="Phone Number" 
                    value={branch.phoneNumber} 
                    icon={<PhoneIcon fontSize="small" />}
                  />
                  <FieldRow 
                    label="Email" 
                    value={branch.email} 
                    icon={<EmailIcon fontSize="small" />}
                  />
                </Section>

                {/* Additional Information Section */}
                <Section title="Additional Information" icon={<SettingsIcon color="primary" />}>
                  <FieldRow 
                    label="Company ID" 
                    value={branch.companyId} 
                    icon={<SettingsIcon fontSize="small" />}
                  />
                  <FieldRow 
                    label="Created At" 
                    value={formatDate(branch.createdAt)} 
                    icon={<DateIcon fontSize="small" />}
                  />
                  <FieldRow 
                    label="Updated At" 
                    value={formatDate(branch.updatedAt)} 
                    icon={<DateIcon fontSize="small" />}
                  />
                </Section>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="contained"
                onClick={onClose}
                sx={{ 
                  px: 4,
                  py: 1,
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 1
                }}
              >
                Close
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </ThemeProvider>
  );
};

export default ViewBranchModal;