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
  Chip,
  IconButton
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
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
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#9c27b0",
    },
    background: {
      default: "#f5f7fa",
      paper: "#ffffff",
    },
    text: {
      primary: "#2d3748",
      secondary: "#718096",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: {
      fontWeight: 600,
      fontSize: "1.75rem",
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.1rem",
    },
    subtitle1: {
      fontWeight: 500,
      color: "#4a5568",
    },
    body1: {
      fontSize: "0.875rem",
    },
  },
  shape: {
    borderRadius: 8,
  },
});

const ViewBranchModal = ({ branch, open, onClose }) => {
  if (!branch) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const FieldRow = ({ icon, label, value, last = false }) => (
    <>
      <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'center' }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: '100%' }}>
          {React.cloneElement(icon, {
            fontSize: "small",
            color: "action",
            sx: { opacity: 0.7 }
          })}
          <Typography variant="subtitle1">{label}</Typography>
        </Stack>
      </Grid>
      <Grid item xs={12} sm={8} sx={{ display: 'flex', alignItems: 'center', pl: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {value || "Not specified"}
        </Typography>
      </Grid>
      {!last && (
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
        </Grid>
      )}
    </>
  );

  const Section = ({ title, icon, children }) => (
    <Paper elevation={0} sx={{ 
      p: 3, 
      mb: 3,
      border: '1px solid',
      borderColor: 'divider',
      backgroundColor: 'background.paper',
    }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        {React.cloneElement(icon, { color: "primary" })}
        <Typography variant="h6" sx={{ fontWeight: 600 }}>{title}</Typography>
      </Stack>
      <Divider sx={{ mb: 3 }} />
      <Grid container spacing={2}>
        {children}
      </Grid>
    </Paper>
  );

  return (
    <>   
     {/* <ThemeProvider theme={theme}> */}
      <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper sx={{
          width: { xs: '95%', sm: '90%', md: '800px' },
          maxHeight: '90vh',
          overflowY: 'auto',
          outline: 'none',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '10px',
            '&:hover': {
              background: '#555',
            }
          },
          scrollbarWidth: 'thin',
          scrollbarColor: '#888 #f1f1f1',
        }}>
          {/* Header */}
          <Box sx={{
            p: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid',
            borderColor: 'divider',
            position: 'sticky',
            top: 0,
            backgroundColor: 'background.paper',
            zIndex: 1,
          }}>
            <Typography variant="h5">Branch Details</Typography>
            <Box>
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          
          {/* Profile Header */}
          <Box sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ 
              width: 80, 
              height: 80, 
              mr: 3,
              bgcolor: 'primary.main',
              fontSize: '2rem'
            }}>
              <BranchIcon fontSize="inherit" />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>
                {branch.name || "Branch"}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {branch.branchCode || "No branch code"}
              </Typography>
            </Box>
          </Box>

          {/* Main Content */}
          <Box sx={{ p: 3, pt: 0 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Section 
                  title="Basic Information" 
                  icon={<BranchIcon />}
                >
                  <FieldRow 
                    icon={<BranchIcon />}
                    label="Branch Code" 
                    value={branch.branchCode}
                  />
                  <FieldRow 
                    icon={<BranchIcon />}
                    label="Branch Name" 
                    value={branch.name}
                  />
                  <FieldRow 
                    icon={<ManagerIcon />}
                    label="Manager" 
                    value={branch.manager}
                  />
                  <FieldRow 
                    icon={<AddressIcon />}
                    label="Address" 
                    value={branch.address}
                    last
                  />
                </Section>

                <Section 
                  title="Dates" 
                  icon={<DateIcon />}
                >
                  <FieldRow 
                    icon={<DateIcon />}
                    label="Created At" 
                    value={formatDate(branch.createdAt)}
                  />
                  <FieldRow 
                    icon={<DateIcon />}
                    label="Updated At" 
                    value={formatDate(branch.updatedAt)}
                    last
                  />
                </Section>
              </Grid>

              <Grid item xs={12} md={6}>
                <Section 
                  title="Contact Information" 
                  icon={<PhoneIcon />}
                >
                  <FieldRow 
                    icon={<PhoneIcon />}
                    label="Phone Number" 
                    value={branch.phoneNumber}
                  />
                  <FieldRow 
                    icon={<EmailIcon />}
                    label="Email" 
                    value={branch.email}
                    last
                  />
                </Section>

                <Section 
                  title="Additional Information" 
                  icon={<SettingsIcon />}
                >
                  <FieldRow 
                    icon={<SettingsIcon />}
                    label="Company ID" 
                    value={branch.companyId}
                    last
                  />
                </Section>
              </Grid>
            </Grid>

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              mt: 3,
              gap: 2
            }}>
              <Button
                variant="outlined"
                onClick={onClose}
              >
                Close
              </Button>
            </Box>
          </Box>
        </Paper>
      </Modal>
    {/* </ThemeProvider> */}
       </>
  );
};

export default ViewBranchModal;