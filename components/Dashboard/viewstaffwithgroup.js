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
  Stack,
  IconButton
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
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
  Code as CodeIcon,
  Phone as PhoneIcon,
  Transgender as GenderIcon,
  Edit as EditIcon,
  Group as GroupIcon,
  Schedule as ScheduleIcon,
  Palette as ColorIcon,
  Description as DescriptionIcon
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
    h5: {
      fontSize: "1.5rem",
      fontWeight: 600,
    },
    h6: {
      fontSize: "1.125rem",
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: "0.875rem",
      fontWeight: 500,
      color: "text.secondary",
    },
    body1: {
      fontSize: "0.775rem",
      fontWeight: 500,
    },
  },
});

const ViewStaffModalwithgroup = ({ staff, open, onClose }) => {
  if (!staff) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    
    // Handle Excel date format (numeric values)
    if (!isNaN(dateString)) {
      const excelEpoch = new Date(1899, 11, 30);
      const days = parseInt(dateString);
      const milliseconds = days * 24 * 60 * 60 * 1000;
      const date = new Date(excelEpoch.getTime() + milliseconds);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    
    // Handle string dates
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // If the date string is in format "dd-mm-yyyy"
        const parts = dateString.split('-');
        if (parts.length === 3) {
          const formattedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
          return formattedDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        }
        return dateString; // Return as is if we can't parse it
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString; // Return as is if we can't parse it
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "Not specified";
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateTimeString;
    }
  };

  const getStatusColor = (status) => {
    return status === "Active" ? "success" : "error";
  };

  const FieldRow = ({ icon, label, value, last = false }) => (
    <>
      <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'center' }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: '8px',
            backgroundColor: 'rgba(25, 118, 210, 0.1)'
          }}>
            {React.cloneElement(icon, {
              fontSize: "small",
              color: "primary",
            })}
          </Box>
          <Typography variant="subtitle1">{label}</Typography>
        </Stack>
      </Grid>
      <Grid item xs={12} sm={8} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography 
          variant="body1" 
          sx={{ 
            wordBreak: 'break-word',
            ml: 3,
          }}
        >
          {value || "Not specified"}
        </Typography>
      </Grid>
      {!last && (
        <Grid item xs={12} sx={{ py: 1 }}>
          <Divider sx={{ my: 0 }} />
        </Grid>
      )}
    </>
  );

  const Section = ({ title, icon, children }) => (
    <Paper elevation={0} sx={{ 
      p: 2, 
      mb: 2,
      border: '1px solid',
      borderColor: 'divider',
    }}>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
        {React.cloneElement(icon, { color: "primary", fontSize: "medium" })}
        <Typography variant="h6">{title}</Typography>
      </Stack>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={1}>
        {children}
      </Grid>
    </Paper>
  );

  const hasGroupInfo = staff.groupId && staff.groupName;

  return (
    <ThemeProvider theme={theme}>
      <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper sx={{
          width: { xs: '95%', sm: '90%', md: '800px' },
          maxHeight: '90vh',
          overflowY: 'auto',
          outline: 'none',
        }}>
          {/* Header */}
          <Box sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid',
            borderColor: 'divider',
            position: 'sticky',
            top: 0,
            backgroundColor: 'background.paper',
            zIndex: 1
          }}>
            <Typography variant="h5">Staff Details</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip 
                label={staff.active_status || "Unknown"} 
                color={getStatusColor(staff.active_status)}
                size="small"
                sx={{ 
                  fontWeight: 500,
                  fontSize: '0.75rem'
                }} 
              />
              <IconButton onClick={onClose} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          
          {/* Profile Header */}
          <Box sx={{ 
            p: 2, 
            display: 'flex', 
            alignItems: 'center',
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}>
            <Avatar sx={{ 
              width: 64, 
              height: 64, 
              mr: 2,
              bgcolor: 'primary.main',
              fontSize: '1.75rem'
            }}>
              <StaffIcon fontSize="inherit" />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                {staff.firstName || ""} {staff.lastName || ""}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {staff.role || "No role specified"}
              </Typography>
            </Box>
          </Box>

          {/* Main Content */}
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Section title="Basic Information" icon={<InfoIcon />}>
                  <FieldRow 
                    icon={<CodeIcon />}
                    label="Staff ID" 
                    value={staff._id}
                  />
                  <FieldRow 
                    icon={<StaffIcon />}
                    label="Username" 
                    value={staff.username}
                  />
                  <FieldRow 
                    icon={<EmailIcon />}
                    label="Email" 
                    value={staff.email}
                  />
                  <FieldRow 
                    icon={<PhoneIcon />}
                    label="Mobile" 
                    value={staff.mobile}
                  />
                  <FieldRow 
                    icon={<RoleIcon />}
                    label="Role" 
                    value={staff.role}
                    last
                  />
                </Section>

                <Section title="Personal Details" icon={<StaffIcon />}>
                  <FieldRow 
                    icon={<StaffIcon />}
                    label="First Name" 
                    value={staff.firstName}
                  />
                  <FieldRow 
                    icon={<StaffIcon />}
                    label="Last Name" 
                    value={staff.lastName}
                  />
                  <FieldRow 
                    icon={<GenderIcon />}
                    label="Gender" 
                    value={staff.gender}
                  />
                  <FieldRow 
                    icon={<DobIcon />}
                    label="Date of Birth" 
                    value={formatDate(staff.date_of_birth)}
                    last
                  />
                </Section>
              </Grid>

              <Grid item xs={12} md={6}>
                <Section title="Employment Information" icon={<CompanyIcon />}>
                  <FieldRow 
                    icon={<JoinDateIcon />}
                    label="Date of Joining" 
                    value={formatDate(staff.joining_date)}
                  />
                  <FieldRow 
                    icon={<BranchIcon />}
                    label="Department" 
                    value={staff.dept_name}
                  />
                  <FieldRow 
                    icon={<CodeIcon />}
                    label="Department Code" 
                    value={staff.dept_code}
                  />
                  <FieldRow 
                    icon={<BranchIcon />}
                    label="Branch Code" 
                    value={staff.branchCode}
                  />
                  <FieldRow 
                    icon={<CompanyIcon />}
                    label="Company ID" 
                    value={staff.company_Id}
                    last
                  />
                </Section>

                {/* Group Information Section */}
                {hasGroupInfo ? (
                  <Section title="Group Information" icon={<GroupIcon />}>
                    <FieldRow 
                      icon={<CodeIcon />}
                      label="Group ID" 
                      value={staff.groupId}
                    />
                    <FieldRow 
                      icon={<GroupIcon />}
                      label="Group Name" 
                      value={staff.groupName}
                    />
                    <FieldRow 
                      icon={<ColorIcon />}
                      label="Group Color" 
                      value={staff.groupColor}
                    />
                    <FieldRow 
                      icon={<ScheduleIcon />}
                      label="Start Time" 
                      value={formatDateTime(staff.groupStartTime)}
                    />
                    <FieldRow 
                      icon={<ScheduleIcon />}
                      label="End Time" 
                      value={formatDateTime(staff.groupEndTime)}
                    />
                    <FieldRow 
                      icon={<DescriptionIcon />}
                      label="Description" 
                      value={staff.groupDescription}
                      last
                    />
                  </Section>
                ) : (
                  <Section title="Group Information" icon={<GroupIcon />}>
                    <Grid item xs={12} sx={{ py: 2, textAlign: 'center' }}>
                      <Typography variant="body1" color="text.secondary">
                        No group assigned to this staff member
                      </Typography>
                    </Grid>
                  </Section>
                )}
              </Grid>
            </Grid>

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              mt: 3,
              gap: 1.5
            }}>
              <Button
                variant="outlined"
                onClick={onClose}
                size="small"
                sx={{
                  borderColor: 'divider',
                  color: 'text.secondary'
                }}
              >
                Close
              </Button>
            </Box>
          </Box>
        </Paper>
      </Modal>
    </ThemeProvider>
  );
};

export default ViewStaffModalwithgroup;