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
  Work as PositionIcon,
  SupervisorAccount as ParentPositionIcon,
  Code as CodeIcon,
  Settings as SettingsIcon
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

const ViewPositionModal = ({employee: department, open, onClose }) => {
  if (!department) return null;

  // Helper functions
  const formatBoolean = (value) => {
    if (value === null || value === undefined) return "--";
    return value ? "Yes" : "No";
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
            <Typography variant="h5" sx={{ fontWeight: 600 }}>Position Details</Typography>
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
                <PositionIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {department.position_name || "Position"}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {department.position_code || "No code"}
                </Typography>
              </Box>
            </Box>

            {/* Department Information */}
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Section title="Position Information" icon={<PositionIcon color="primary" />}>
                  <FieldRow 
                    label="Position Code" 
                    value={department.position_code} 
                    icon={<CodeIcon fontSize="small" />}
                  />
                  <FieldRow 
                    label="Position Name" 
                    value={department.position_name} 
                    icon={<PositionIcon fontSize="small" />}
                  />
                  <FieldRow 
                    label="Parent Position Code" 
                    value={department.parent_position?.position_code || "--"} 
                    icon={<ParentPositionIcon fontSize="small" />}
                  />
                  <FieldRow 
                    label="Parent Position Name" 
                    value={department.parent_position?.position_name || "--"} 
                    icon={<ParentPositionIcon fontSize="small" />}
                  />
                </Section>

                {/* Additional Settings Section */}
                <Section title="Additional Information" icon={<SettingsIcon color="primary" />}>
                  <FieldRow 
                    label="Created At" 
                    value={new Date(department.created_at).toLocaleString()} 
                    icon={<SettingsIcon fontSize="small" />}
                  />
                  <FieldRow 
                    label="Updated At" 
                    value={new Date(department.updated_at).toLocaleString()} 
                    icon={<SettingsIcon fontSize="small" />}
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

export default ViewPositionModal;