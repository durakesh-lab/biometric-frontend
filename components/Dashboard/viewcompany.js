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
  Link
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Business as CompanyIcon,
  Person as OwnerIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as AddressIcon,
  AttachMoney as CapitalIcon,
  Category as IndustryIcon,
  Language as WebsiteIcon,
  Description as DescriptionIcon,
  Settings as SettingsIcon
} from "@mui/icons-material";
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

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

const ViewCompanyModal = ({ company, open, onClose }) => {
  if (!company) return null;

  // Helper functions
  const formatWebsite = (url) => {
    if (!url) return "--";
    return (
      <Link href={url.startsWith('http') ? url : `https://${url}`} target="_blank" rel="noopener">
        {url}
      </Link>
    );
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
            <Typography variant="h5" sx={{ fontWeight: 600 }}>Company Details</Typography>
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
                <CompanyIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {company.name || "Company"}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {company.industry || "No industry specified"}
                </Typography>
              </Box>
            </Box>

            {/* Company Information */}
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Section title="Basic Information" icon={<CompanyIcon color="primary" />}>
                  <FieldRow 
                    label="Company Name" 
                    value={company.name} 
                    icon={<CompanyIcon fontSize="small" />}
                  />
                  <FieldRow 
                    label="Owner" 
                    value={company.owner} 
                    icon={<OwnerIcon fontSize="small" />}
                  />
                  <FieldRow 
                    label="Email" 
                    value={company.email} 
                    icon={<EmailIcon fontSize="small" />}
                  />
                  <FieldRow 
                    label="Phone Number" 
                    value={company.phoneNumber} 
                    icon={<PhoneIcon fontSize="small" />}
                  />
                </Section>

                <Section title="Business Details" icon={<BusinessCenterIcon color="primary" />}>
                  <FieldRow 
                    label="Industry" 
                    value={company.industry} 
                    icon={<IndustryIcon fontSize="small" />}
                  />
                  <FieldRow 
                    label="Nominal Capital" 
                    value={company.nominalCapital} 
                    icon={<CapitalIcon fontSize="small" />}
                  />
                  <FieldRow 
                    label="Website" 
                    value={formatWebsite(company.website)} 
                    icon={<WebsiteIcon fontSize="small" />}
                  />
                </Section>

                <Section title="Address Information" icon={<AddressIcon color="primary" />}>
                  <FieldRow 
                    label="Mailing Address" 
                    value={company.mailingAddress} 
                    icon={<AddressIcon fontSize="small" />}
                  />
                </Section>

                <Section title="Description" icon={<DescriptionIcon color="primary" />}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Box sx={{ mr: 1, color: 'text.secondary', mt: 0.5 }}>
                        <DescriptionIcon fontSize="small" />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                          Company Description
                        </Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                          {company.companyDescription || "No description available"}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Section>

                {/* Additional Information Section */}
                <Section title="Additional Information" icon={<SettingsIcon color="primary" />}>
                  <FieldRow 
                    label="Branches" 
                    value={company.branches?.length || "0"} 
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

export default ViewCompanyModal;