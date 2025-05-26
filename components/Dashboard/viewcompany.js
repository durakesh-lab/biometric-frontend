// import React from "react";
// import {
//   Modal,
//   Box,
//   Typography,
//   Divider,
//   Grid,
//   Chip,
//   Button,
//   Avatar,
//   Paper,
//   Stack,
//   Link
// } from "@mui/material";
// import BadgeIcon from '@mui/icons-material/Badge';

// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import {
//   Business as CompanyIcon,
//   Person as OwnerIcon,
//   Email as EmailIcon,
//   Phone as PhoneIcon,
//   LocationOn as AddressIcon,
//   AttachMoney as CapitalIcon,
//   Category as IndustryIcon,
//   Language as WebsiteIcon,
//   Description as DescriptionIcon,
//   Settings as SettingsIcon
// } from "@mui/icons-material";
// import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#0E9F6E",
//     },
//     background: {
//       default: "#F8F9FA",
//       paper: "#FFFFFF",
//     },
//     secondary: {
//       main: "#3B82F6",
//     },
//   },
//   typography: {
//     fontFamily: "'Inter', sans-serif",
//   },
// });

// const ViewCompanyModal = ({ company, open, onClose }) => {
//   if (!company) return null;

//   // Helper functions
//   const formatWebsite = (url) => {
//     if (!url) return "--";
//     return (
//       <Link href={url.startsWith('http') ? url : `https://${url}`} target="_blank" rel="noopener">
//         {url}
//       </Link>
//     );
//   };

//   // Reusable components
//   const FieldRow = ({ label, value, icon }) => (
//     <>
//       <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Box sx={{ mr: 1, color: 'text.secondary' }}>
//           {icon}
//         </Box>
//         <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
//       </Grid>
//       <Grid item xs={8}>
//         <Typography variant="body1" sx={{ fontWeight: value !== "--" ? 500 : 400 }}>
//           {value || "--"}
//         </Typography>
//       </Grid>
//     </>
//   );

//   const Section = ({ title, icon, children }) => (
//     <Paper elevation={0} sx={{ 
//       p: 3, 
//       mb: 3, 
//       borderRadius: 2, 
//       border: '1px solid #e0e0e0',
//       backgroundColor: '#fafafa'
//     }}>
//       <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
//         {icon}
//         <Typography variant="h6" sx={{ fontWeight: 600 }}>{title}</Typography>
//       </Stack>
//       <Divider sx={{ mb: 2 }} />
//       <Grid container spacing={2}>
//         {children}
//       </Grid>
//     </Paper>
//   );

//   return (
//     <ThemeProvider theme={theme}>
//       <Modal open={open} onClose={onClose}>
//         <Box sx={{
//           position: 'absolute',
//           top: '50%',
//           left: '50%',
//           transform: 'translate(-50%, -50%)',
//           width: '90%',
//           maxWidth: 800,
//           bgcolor: 'background.paper',
//           boxShadow: 24,
//           p: 0,
//           maxHeight: '90vh',
//           overflowY: 'auto',
//           borderRadius: 2
//         }}>
//           {/* Header */}
//           <Box sx={{
//             p: 3,
//             bgcolor: 'primary.main',
//             color: 'white',
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             borderTopLeftRadius: 2,
//             borderTopRightRadius: 2
//           }}>
//             <Typography variant="h5" sx={{ fontWeight: 600 }}>Company Details</Typography>
//             <Chip 
//               label="Active" 
//               color="success"
//               sx={{ color: 'white', fontWeight: 600 }}
//             />
//           </Box>
          
//           {/* Main Content */}
//           <Box sx={{ p: 3 }}>
//             {/* Profile Header */}
//             <Box sx={{ 
//               display: 'flex', 
//               alignItems: 'center', 
//               mb: 4,
//               p: 3,
//               backgroundColor: '#f5f5f5',
//               borderRadius: 2
//             }}>
//               <Avatar sx={{ 
//                 width: 80, 
//                 height: 80, 
//                 bgcolor: 'primary.main',
//                 fontSize: '2rem',
//                 mr: 3
//               }}>
//                 <CompanyIcon fontSize="large" />
//               </Avatar>
//               <Box>
//                 <Typography variant="h4" sx={{ fontWeight: 700 }}>
//                   {company.name || "Company"}
//                 </Typography>
//                 <Typography variant="subtitle1" color="text.secondary">
//                   {company.industry || "No industry specified"}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Company Information */}
//             <Grid container spacing={3}>
//               <Grid item xs={12}>
//                 <Section title="Basic Information" icon={<CompanyIcon color="primary" />}>
                 
//                   <FieldRow 
//                     label="Company Id" 
//                     value={company.companyId} 
//                     icon={<BadgeIcon fontSize="small" />}
//                   />
//                    <FieldRow 
//                     label="Company Name" 
//                     value={company.name} 
//                     icon={<CompanyIcon fontSize="small" />}
//                   />
//                   <FieldRow 
//                     label="Owner" 
//                     value={company.owner} 
//                     icon={<OwnerIcon fontSize="small" />}
//                   />
//                   <FieldRow 
//                     label="Email" 
//                     value={company.email} 
//                     icon={<EmailIcon fontSize="small" />}
//                   />
//                   <FieldRow 
//                     label="Phone Number" 
//                     value={company.phoneNumber} 
//                     icon={<PhoneIcon fontSize="small" />}
//                   />
//                 </Section>

//                 <Section title="Business Details" icon={<BusinessCenterIcon color="primary" />}>
//                   <FieldRow 
//                     label="Industry" 
//                     value={company.industry} 
//                     icon={<IndustryIcon fontSize="small" />}
//                   />
//                   <FieldRow 
//                     label="Nominal Capital" 
//                     value={company.nominalCapital} 
//                     icon={<CapitalIcon fontSize="small" />}
//                   />
//                   <FieldRow 
//                     label="Website" 
//                     value={formatWebsite(company.website)} 
//                     icon={<WebsiteIcon fontSize="small" />}
//                   />
//                 </Section>

//                 <Section title="Address Information" icon={<AddressIcon color="primary" />}>
//                   <FieldRow 
//                     label="Mailing Address" 
//                     value={company.mailingAddress} 
//                     icon={<AddressIcon fontSize="small" />}
//                   />
//                 </Section>

//                 <Section title="Description" icon={<DescriptionIcon color="primary" />}>
//                   <Grid item xs={12}>
//                     <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
//                       <Box sx={{ mr: 1, color: 'text.secondary', mt: 0.5 }}>
//                         <DescriptionIcon fontSize="small" />
//                       </Box>
//                       <Box>
//                         <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
//                           Company Description
//                         </Typography>
//                         <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
//                           {company.companyDescription || "No description available"}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   </Grid>
//                 </Section>

//                 {/* Additional Information Section */}
//                 <Section title="Additional Information" icon={<SettingsIcon color="primary" />}>
//                   <FieldRow 
//                     label="Branches" 
//                     value={company.branches?.length || "0"} 
//                     icon={<SettingsIcon fontSize="small" />}
//                   />
//                 </Section>
//               </Grid>
//             </Grid>

//             <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
//               <Button
//                 variant="contained"
//                 onClick={onClose}
//                 sx={{ 
//                   px: 4,
//                   py: 1,
//                   fontWeight: 600,
//                   textTransform: 'none',
//                   borderRadius: 1
//                 }}
//               >
//                 Close
//               </Button>
//             </Box>
//           </Box>
//         </Box>
//       </Modal>
//     </ThemeProvider>
//   );
// };

// export default ViewCompanyModal;





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
  Link,
  IconButton
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import BadgeIcon from '@mui/icons-material/Badge';
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
  Settings as SettingsIcon,
  Edit as EditIcon,
  MoreVert as MoreIcon
} from "@mui/icons-material";
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

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
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
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

const ViewCompanyModal = ({ company, open, onClose }) => {
  if (!company) return null;

  const formatWebsite = (url) => {
    if (!url) return "Not specified";
    return (
      <Link 
        href={url.startsWith('http') ? url : `https://${url}`} 
        target="_blank" 
        rel="noopener"
        sx={{
          color: theme.palette.primary.main,
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline'
          }
        }}
      >
        {url.replace(/^https?:\/\//, '')}
      </Link>
    );
  };

  const FieldRow = ({ icon, label, value, last = false }) => (
    <>
      <Grid item xs={12} sm={4}  sx={{ display: 'flex', alignItems: 'center' }} >
        <Stack direction="row" alignItems="center" spacing={1.5}  sx={{ width: '100%' }}>
          {React.cloneElement(icon, {
            fontSize: "small",
            color: "action",
            sx: { opacity: 0.7 }
          })}
          <Typography variant="subtitle1">{label}</Typography>
        </Stack>
      </Grid>
      <Grid item xs={12} sm={8}  sx={{ display: 'flex', alignItems: 'center' }} >
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
        {icon}
        <Typography variant="h6" sx={{ fontWeight: 600 }}>{title}</Typography>
      </Stack>
      <Divider sx={{ mb: 3 }} />
      <Grid container spacing={2}>
        {children}
      </Grid>
    </Paper>
  );

  return (
      <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper sx={{
          width: { xs: '95%', sm: '90%', md: '800px' },
          maxHeight: '90vh',
          overflowY: 'auto',
          outline: 'none',
                overflowY: 'auto',
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
      scrollbarWidth: 'thin', // For Firefox
      scrollbarColor: '#888 #f1f1f1', // For Firefox
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
            <Typography variant="h5">Company Details</Typography>
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
              <CompanyIcon fontSize="inherit" />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>
                {company.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {company.industry || "No industry specified"}
              </Typography>
              {/* <Chip 
                label="Active" 
                size="small" 
                color="success" 
                sx={{ 
                  mt: 1,
                  fontSize: '0.75rem',
                  height: '24px'
                }} 
              /> */}
            </Box>
          </Box>

          {/* Main Content */}
          <Box sx={{ p: 3, pt: 0 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Section 
                  title="Basic Information" 
                  icon={<CompanyIcon color="primary" />}
                >
                  <FieldRow 
                    icon={<BadgeIcon />}
                    label="Company ID" 
                    value={company.companyId}
                  />
                  <FieldRow 
                    icon={<OwnerIcon />}
                    label="Owner" 
                    value={company.owner}
                  />
                  <FieldRow 
                    icon={<EmailIcon />}
                    label="Email" 
                    value={company.email}
                  />
                  <FieldRow 
                    icon={<PhoneIcon />}
                    label="Phone" 
                    value={company.phoneNumber}
                    last
                  />
                </Section>

                <Section 
                  title="Address" 
                  icon={<AddressIcon color="primary" />}
                >
                  <FieldRow 
                    icon={<AddressIcon />}
                    label="Mailing Address" 
                    value={company.mailingAddress}
                    last
                  />
                </Section>
              </Grid>

              <Grid item xs={12} md={6}>
                <Section 
                  title="Business Details" 
                  icon={<BusinessCenterIcon color="primary" />}
                >
                  <FieldRow 
                    icon={<IndustryIcon />}
                    label="Industry" 
                    value={company.industry}
                  />
                  <FieldRow 
                    icon={<CapitalIcon />}
                    label="Capital" 
                    value={company.nominalCapital}
                  />
                  <FieldRow 
                    icon={<WebsiteIcon />}
                    label="Website" 
                    value={formatWebsite(company.website)}
                    last
                  />
                </Section>

                <Section 
                  title="Description" 
                  icon={<DescriptionIcon color="primary" />}
                >
                  <Grid item xs={12}>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                      {company.companyDescription || "No description available"}
                    </Typography>
                  </Grid>
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
              {/* <Button
                variant="contained"
                startIcon={<EditIcon />}
              >
                Edit Profile
              </Button> */}
            </Box>
          </Box>
        </Paper>
      </Modal>
  );
};

export default ViewCompanyModal;