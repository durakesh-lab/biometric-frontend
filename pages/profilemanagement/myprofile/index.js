import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  Grid,
  Chip,
  Button,
  Avatar,
  Paper,
  Stack,
  CircularProgress,
  Alert,
  Snackbar
} from "@mui/material";
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
  Edit as EditIcon
} from "@mui/icons-material";
import axios from "axios";
import { useRouter } from "next/router";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { jwtDecode } from "jwt-decode";
import Layout from "../../../components/Layout/Layout";

const ProfilePage = () => {
  const router = useRouter();
  const [staffData, setStaffData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasEditPermission, setHasEditPermission] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [processing, setProcessing] = useState(false);
 
  useEffect(() => {
    const fetchStaffProfile = async (id) => {
      try {
       
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/users/getuser/`+id);
        setStaffData(response.data);
        setHasEditPermission(response.data.editstatus);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile");
        setLoading(false);
      }
    };
let token=localStorage.getItem("biometric_token")
  let data=jwtDecode(token)
    fetchStaffProfile(data.sub);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    return status === "Active" ? "success" : "error";
  };

  const FieldRow = ({ icon, label, value }) => (
    <Grid container spacing={2} sx={{ mb: 2 }}>
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
        <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
          {value || "Not specified"}
        </Typography>
      </Grid>
    </Grid>
  );

  const Section = ({ title, icon, children }) => (
    <Paper elevation={0} sx={{ 
      p: 3, 
      mb: 3,
      border: '1px solid',
      borderColor: 'divider',
    }}>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
        {React.cloneElement(icon, { color: "primary", fontSize: "medium" })}
        <Typography variant="h6">{title}</Typography>
      </Stack>
      <Divider sx={{ mb: 3 }} />
      {children}
    </Paper>
  );

  const handleEditRequest = async () => {
    setConfirmOpen(false);
    setProcessing(true);
    try {
      const response = await axios.post("/api/staff/edit-request", {
        staffId: staffData._id
      });
      
      setSnackbar({
        open: true,
        message: response.data.message,
        severity: "success"
      });
      
      if (response.data.hasEditPermission) {
        setHasEditPermission(true);
        router.push(`/staff/edit/${staffData._id}`);
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to send edit request",
        severity: "error"
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleEditClick = () => {
    if (hasEditPermission) {
      router.push(`/profilemanagement/myprofile/editprofile`);
    } else {
      setConfirmOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!staffData) return null;



  return (
         <Layout> 
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">My Profile</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* <Chip 
            label={staffData.active_status || "Unknown"} 
            color={getStatusColor(staffData.active_status)}
            size="medium"
            sx={{ fontWeight: 500 }}
          /> */}
<Button
  variant="contained"
  color="primary"
  onClick={handleEditClick}
  // disabled={!hasEditPermission || processing} // ❌ disable if no permission or processing
  startIcon={processing ? <CircularProgress size={20} /> : <EditIcon />}
>
  Edit Profile
</Button>

        </Box>
      </Box>

      {/* Profile Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        mb: 4,
        p: 3,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1
      }}>
        <Avatar sx={{ 
          width: 80, 
          height: 80, 
          mr: 3,
          bgcolor: 'primary.main',
          fontSize: '2rem'
        }}>
          {staffData.firstName?.charAt(0)}{staffData.lastName?.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>
            {staffData.firstName || ""} {staffData.lastName || ""}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {staffData.role || "No role specified"}
          </Typography>
        </Box>
      </Box>

      {/* Profile Content */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Section title="Basic Information" icon={<InfoIcon />}>
            <FieldRow 
              icon={<CodeIcon />}
              label="Staff ID" 
              value={staffData._id}
            />
            <FieldRow 
              icon={<StaffIcon />}
              label="Username" 
              value={staffData.username}
            />
            <FieldRow 
              icon={<EmailIcon />}
              label="Email" 
              value={staffData.email}
            />
            <FieldRow 
              icon={<PhoneIcon />}
              label="Mobile" 
              value={staffData.mobile}
            />
            <FieldRow 
              icon={<RoleIcon />}
              label="Role" 
              value={staffData.role}
            />
          </Section>

          <Section title="Personal Details" icon={<StaffIcon />}>
            <FieldRow 
              icon={<StaffIcon />}
              label="First Name" 
              value={staffData.firstName}
            />
            <FieldRow 
              icon={<StaffIcon />}
              label="Last Name" 
              value={staffData.lastName}
            />
            <FieldRow 
              icon={<GenderIcon />}
              label="Gender" 
              value={staffData.gender}
            />
            <FieldRow 
              icon={<DobIcon />}
              label="Date of Birth" 
              value={formatDate(staffData.date_of_birth)}
            />
          </Section>
        </Grid>

        <Grid item xs={12} md={6}>
          <Section title="Employment Information" icon={<CompanyIcon />}>
            <FieldRow 
              icon={<JoinDateIcon />}
              label="Date of Joining" 
              value={formatDate(staffData.joining_date)}
            />
            <FieldRow 
              icon={<BranchIcon />}
              label="Department" 
              value={staffData?.department?.name}
            />
            <FieldRow 
              icon={<CodeIcon />}
              label="Department Code" 
              value={staffData?.department?.dept_code}
            />
          </Section>
        </Grid>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      >
        <DialogTitle> Edit Permission</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You Dont't have permission to edit this profile. A Manager will allow you to edit profile.
            {/* Are you sure you want to proceed? */}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>ok</Button>
          {/* <Button onClick={handleEditRequest} color="primary" autoFocus>
            Confirm
          </Button> */}
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
     </Layout>
  );
};

export default ProfilePage;