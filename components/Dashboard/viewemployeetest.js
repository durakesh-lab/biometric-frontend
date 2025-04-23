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
  Person as PersonIcon,
  Work as WorkIcon,
  ContactMail as ContactIcon,
  Settings as SettingsIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Cake as CakeIcon,
  Home as HomeIcon,
  Fingerprint as FingerprintIcon,
  AdminPanelSettings as AdminIcon,
  Lock as LockIcon,
  Event as EventIcon,
  Badge as BadgeIcon
} from "@mui/icons-material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0E9F6E",
    },
    secondary: {
      main: "#3B82F6",
    },
    background: {
      default: "#F9FAFB",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
});

// Your dropdown options
const departments = [
  { label: "HR", value: 1 },
  { label: "Sales", value: 2 },
  { label: "Engineering", value: 3 }
];

const positions = [
  { label: "Manager", value: 1 },
  { label: "Developer", value: 2 },
  { label: "Analyst", value: 3 }
];

const genders = [ { label: "Male", value: "M" }, { label: "Female", value: "F" }];

const verificationModes = [
  { label: "Any", value: 0 },
  { label: "Fingerprint", value: 1 },
  { label: "Card", value: 2 },
  { label: "PIN", value: 3 }
];

const employmentTypes = [
  { label: "Permanent", value: 1 },
  { label: "Temporary", value: 2 }
];

const devicePrivileges = [
  { label: "Employee", value: 0 },
  { label: "Register", value: 2 },
  { label: "System Administrator", value: 6 },
  { label: "Super Administrator", value: 14 }
];

const enableOptions = [
  { label: "No", value: "False" },
  { label: "Yes", value: "True" }
];

const appRoles = [
  { label: "Employee", value: 1 },
  { label: "Administrator", value: 2 }
];

const appStatuses = [
  { label: "Enable", value: 1 },
  { label: "Disable", value: 0 }
];


const ViewEmployeeModal = ({ employee, open, onClose }) => {
  if (!employee) return null;

  // Enhanced helper functions
  const formatDate = (dateString) => {
    if (!dateString) return "--";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

 
  const formatBoolean = (value) => {
    if (value === null || value === undefined) return "--";
    return value ? "Yes" : "No";
  };

  const formatSelectValue = (value, options) => {
    if (value === null || value === undefined) return "--";
    const option = options.find(opt => opt.value === value);
    return option ? option.label : "--";
  };

  const formatPrivilege = (value) => {
    const privileges = {
      0: "Employee",
      2: "Register",
      6: "System Administrator",
      14: "Super Administrator"
    };
    return value in privileges ? privileges[value] : "--";
  };

  const formatArea = (areaArray) => {
    if (!areaArray || !Array.isArray(areaArray) || areaArray.length === 0) return "--";
    return areaArray.map(area => area.area_name).join(", ");
  };

  // Reusable field row component with icons
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

  // Section component
  const Section = ({ title, icon, children }) => (
    <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
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
          maxWidth: 1200,
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
            <Typography variant="h5" sx={{ fontWeight: 600 }}>Employee Details</Typography>
            <Chip 
              label={employee.app_status === 1 ? "Active" : "Inactive"} 
              color={employee.app_status === 1 ? "success" : "error"}
              sx={{ color: 'white', fontWeight: 600 }}
            />
          </Box>
          
          {/* Main Content */}
          <Box sx={{ p: 3 }}>
            {/* Profile Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Avatar sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: 'primary.main',
                fontSize: '2rem',
                mr: 3
              }}>
                {employee.first_name?.charAt(0)}{employee.last_name?.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {employee.first_name} {employee.last_name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {employee.position?.position_name || "No position"} • {employee.department?.dept_name || "No department"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Employee ID: {employee.emp_code || "--"}
                </Typography>
              </Box>
            </Box>

            {/* Profile Section */}
            <Section title="Profile" icon={<PersonIcon color="primary" />}>
              <FieldRow 
                label="Employee ID" 
                value={employee.emp_code} 
                icon={<BadgeIcon fontSize="small" />}
              />
              <FieldRow 
                label="Nick Name" 
                value={employee.nickname} 
                icon={<PersonIcon fontSize="small" />}
              />
              <FieldRow 
                label="Department" 
                value={employee.department?.dept_name || "--"} 
                icon={<WorkIcon fontSize="small" />}
              />
              <FieldRow 
                label="Position" 
                value={employee.position?.position_name || "--"} 
                icon={<WorkIcon fontSize="small" />}
              />
              <FieldRow 
                label="Employment Type" 
                value={formatSelectValue(employee.emp_type, employmentTypes)} 
                icon={<WorkIcon fontSize="small" />}
              />
              <FieldRow 
                label="Area" 
                value={formatArea(employee.area)} 
                icon={<WorkIcon fontSize="small" />}
              />
              <FieldRow 
                label="Date of Joining" 
                value={formatDate(employee.hire_date)} 
                icon={<EventIcon fontSize="small" />}
              />
              <FieldRow 
                label="Birthday" 
                value={formatDate(employee.birthday)} 
                icon={<CakeIcon fontSize="small" />}
              />
            </Section>

            {/* Personal Information Section */}
            <Section title="Personal Information" icon={<ContactIcon color="secondary" />}>
              <FieldRow 
                label="Aadhaar No." 
                value={employee.ssn} 
                icon={<FingerprintIcon fontSize="small" />}
              />
              <FieldRow 
                label="Card No." 
                value={employee.card_no} 
                icon={<BadgeIcon fontSize="small" />}
              />
              <FieldRow 
                label="Mobile" 
                value={employee.mobile} 
                icon={<PhoneIcon fontSize="small" />}
              />
              <FieldRow 
                label="Contact No." 
                value={employee.contact_tel} 
                icon={<PhoneIcon fontSize="small" />}
              />
              <FieldRow 
                label="Office Tel" 
                value={employee.office_tel} 
                icon={<PhoneIcon fontSize="small" />}
              />
              <FieldRow 
                label="Email" 
                value={employee.email} 
                icon={<EmailIcon fontSize="small" />}
              />
              <FieldRow 
                label="Gender" 
                value={formatSelectValue(employee.gender, genders)} 
                icon={<PersonIcon fontSize="small" />}
              />
              <FieldRow 
                label="Nationality" 
                value={employee.national} 
                icon={<HomeIcon fontSize="small" />}
              />
              <FieldRow 
                label="City" 
                value={employee.city} 
                icon={<HomeIcon fontSize="small" />}
              />
              <FieldRow 
                label="Address" 
                value={employee.address} 
                icon={<HomeIcon fontSize="small" />}
              />
              <FieldRow 
                label="Postcode" 
                value={employee.postcode} 
                icon={<HomeIcon fontSize="small" />}
              />
              <FieldRow 
                label="Religion" 
                value={employee.religion} 
                icon={<HomeIcon fontSize="small" />}
              />
              <FieldRow 
                label="Enroll SN" 
                value={employee.enroll_sn} 
                icon={<FingerprintIcon fontSize="small" />}
              />
            </Section>

            {/* Device Settings Section */}
            <Section title="Device Settings" icon={<SettingsIcon color="action" />}>
              <FieldRow 
                label="Verification Mode" 
                value={formatSelectValue(employee.verify_mode, verificationModes)} 
                icon={<FingerprintIcon fontSize="small" />}
              />
              <FieldRow 
                label="Device Password" 
                value={employee.device_password ? "••••••••" : "--"} 
                icon={<LockIcon fontSize="small" />}
              />
              <FieldRow 
                label="Self Password" 
                value={employee.self_password ? "••••••••" : "--"} 
                icon={<LockIcon fontSize="small" />}
              />
              <FieldRow 
                label="Enable Attendance" 
                value={formatBoolean(employee.enable_att)} 
                icon={<EventIcon fontSize="small" />}
              />
              <FieldRow 
                label="Enable Overtime" 
                value={formatBoolean(employee.enable_overtime)} 
                icon={<EventIcon fontSize="small" />}
              />
              <FieldRow 
                label="Enable Holiday" 
                value={formatBoolean(employee.enable_holiday)} 
                icon={<EventIcon fontSize="small" />}
              />
              <FieldRow 
                label="Device Privilege" 
                value={formatPrivilege(employee.dev_privilege)} 
                icon={<AdminIcon fontSize="small" />}
              />
            </Section>

            {/* App Settings Section */}
            <Section title="App Settings" icon={<AdminPanelSettingsIcon color="action" />}>
              <FieldRow 
                label="App Status" 
                value={formatSelectValue(employee.app_status, appStatuses)} 
                icon={<SettingsIcon fontSize="small" />}
              />
              <FieldRow 
                label="App Role" 
                value={formatSelectValue(employee.app_role, appRoles)} 
                icon={<AdminIcon fontSize="small" />}
              />
            </Section>

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

export default ViewEmployeeModal;