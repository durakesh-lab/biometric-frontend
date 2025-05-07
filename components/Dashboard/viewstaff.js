import React from "react";
import {
  Modal,
  Box,
  Typography,
  Divider,
  Grid,
  Chip,
  Button,
  Avatar,
  Paper,
  Stack
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Person as StaffIcon,
  Badge as RoleIcon,
  Email as EmailIcon,
  Business as CompanyIcon,
  AccountTree as BranchIcon,
  Cake as DobIcon,
  CalendarToday as JoinDateIcon,
  Info as InfoIcon,
  Code as CodeIcon
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

const ViewStaffModal = ({ staff, open, onClose }) => {
  if (!staff) return null;

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return "--";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Status chip color
  const getStatusColor = (status) => {
    return status === "Active" ? "success" : "error";
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
            <Typography variant="h5" sx={{ fontWeight: 600 }}>Staff Details</Typography>
            <Chip 
              label={staff.active_status || "Unknown"} 
              color={getStatusColor(staff.active_status)}
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
                <StaffIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {staff.firstName || ""} {staff.lastName || ""}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {staff.role || "No role specified"}
                </Typography>
              </Box>
            </Box>

            {/* Staff Information */}
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Section title="Basic Information" icon={<InfoIcon color="primary" />}>
                  <FieldRow 
                    label="Staff ID" 
                    value={staff._id} 
                    icon={<CodeIcon fontSize="small" />}
                  />
                  <FieldRow 
                    label="Username" 
                    value={staff.username} 
                    icon={<StaffIcon fontSize="small" />}
                  />
                  <FieldRow 
                    label="Email" 
                    value={staff.email} 
                    icon={<EmailIcon fontSize="small" />}
                  />
                  <FieldRow 
                    label="Role" 
                    value={staff.role} 
                    icon={<RoleIcon fontSize="small" />}
                  />
                </Section>

                <Section title="Personal Details" icon={<StaffIcon color="primary" />}>
                  <FieldRow 
                    label="First Name" 
                    value={staff.firstName} 
                    icon={<StaffIcon fontSize="small" />}
                  />
                  <FieldRow 
                    label="Last Name" 
                    value={staff.lastName} 
                    icon={<StaffIcon fontSize="small" />}
                  />
                  <FieldRow 
                    label="Date of Birth" 
                    value={formatDate(staff.date_of_birth)} 
                    icon={<DobIcon fontSize="small" />}
                  />
                </Section>

                <Section title="Employment Information" icon={<CompanyIcon color="primary" />}>
                  {/* <FieldRow 
                    label="Company ID" 
                    value={staff.companyId} 
                    icon={<CompanyIcon fontSize="small" />}
                  />
                  <FieldRow 
                    label="Branch ID" 
                    value={staff.branchId} 
                    icon={<BranchIcon fontSize="small" />}
                  /> */}
                   <FieldRow 
                    label="Date of Joining" 
                    value={formatDate(staff.joining_date)} 
                    icon={<DobIcon fontSize="small" />}
                  />
                  <FieldRow 
                    label="Department" 
                    value={staff.dept_name || "--"} 
                    icon={<BranchIcon fontSize="small" />}
                  />
                  <FieldRow 
                    label="Department Code" 
                    value={staff.dept_code || "--"} 
                    icon={<CodeIcon fontSize="small" />}
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

export default ViewStaffModal;