import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { 
  Box, 
  Typography, 
  Button, 
  CircularProgress, 
  Alert, 
  Snackbar,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Paper,
  Stack
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Person as StaffIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Transgender as GenderIcon,
  Save as SaveIcon,
  ArrowBack as BackIcon
} from "@mui/icons-material";
import Layout from "../../../components/Layout/Layout";
import { jwtDecode } from "jwt-decode";

const genders = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const roleTypes = ['Admin', 'Manager', 'Staff', 'Supervisor'];
const statusTypes = ['Active', 'Inactive'];

// Utility functions for date validation
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const getMinBirthDate = () => {
  const today = new Date();
  const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  return minDate.toISOString().split('T')[0];
};

const validationSchema = Yup.object({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  gender: Yup.string().required("Required"),
  mobile: Yup.string().required("Required"),
  email: Yup.string()
    .email("Invalid email")
    .required("Required")
    .test(
      'email-exists',
      'Email already exists',
      () => !emailError
    ),
  username: Yup.string()
    .required("Required")
    .test(
      'username-exists',
      'username already exists',
      () => !usernameError
    ),
  role: Yup.string().required("Required"),
  active_status: Yup.string().required("Required"),
  date_of_birth: Yup.date()
    .max(new Date(getMinBirthDate()), "Must be at least 18 years old"),
  joining_date: Yup.date()
    .max(new Date(), "Joining date cannot be in the future")
});

const EditStaffPage = () => {
  const router = useRouter();
  const [staffData, setStaffData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [emailError, setEmailError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get user ID from token
        const token = localStorage.getItem("biometric_token");
        const decoded = jwtDecode(token);
        const userId = decoded.sub;
        
        // Fetch staff data
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/users/getuser/${userId}`);
        console.log(response.data);
        setStaffData(response.data);
        
        // Fetch departments (if needed)
        // const deptResponse = await axios.get("/api/departments");
        // setDepartments(deptResponse.data);
        
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (values) => {
    try {
      // Get user ID from token
      const token = localStorage.getItem("biometric_token");
      const decoded = jwtDecode(token);
      const userId = decoded.sub;
      
      const response = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/users/updateuser/${userId}`, values);
      setSnackbar({
        open: true,
        message: "Profile updated successfully",
        severity: "success"
      });
      
      // Optionally redirect back to profile after delay
      setTimeout(() => router.push("/profile"), 2000);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to update profile",
        severity: "error"
      });
    }
  };

  const checkFieldExists = async (value, fieldName) => {
    if (!value || !staffData || value === staffData[fieldName]) return;
    
    try {
      const response = await axios.post("/api/staff/check-field", {
        field: fieldName,
        value: value
      });
      
      if (fieldName === 'email') {
        setEmailError(response.data.exists);
      } else if (fieldName === 'username') {
        setUsernameError(response.data.exists);
      }
    } catch (err) {
      console.error("Error checking field:", err);
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

  // Format dates for display in date inputs
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <Layout>
      <Box sx={{ p: 4 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => router.back()}
          sx={{ mb: 3 }}
        >
          Back to Profile
        </Button>

        <Typography variant="h4" sx={{ mb: 3 }}>Edit Profile</Typography>

        <Paper elevation={0} sx={{ 
          p: 4, 
          border: '1px solid',
          borderColor: 'divider',
        }}>
          <Formik
            initialValues={{
              ...staffData,
              date_of_birth: formatDateForInput(staffData.date_of_birth),
              joining_date: formatDateForInput(staffData.joining_date)
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <Form>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>Basic Information</Typography>
                    <Divider sx={{ mb: 3 }} />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="First Name*"
                      name="firstName"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.firstName && Boolean(errors.firstName)}
                      helperText={touched.firstName && errors.firstName}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Last Name*"
                      name="lastName"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.lastName && Boolean(errors.lastName)}
                      helperText={touched.lastName && errors.lastName}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Gender*"
                      name="gender"
                      value={values.gender}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.gender && Boolean(errors.gender)}
                      helperText={touched.gender && errors.gender}
                    >
                      {genders.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Mobile*"
                      name="mobile"
                      value={values.mobile}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.mobile && Boolean(errors.mobile)}
                      helperText={touched.mobile && errors.mobile}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email*"
                      name="email"
                      value={values.email}
                      onChange={(e) => {
                        handleChange(e);
                        checkFieldExists(e.target.value, "email");
                      }}
                      onBlur={handleBlur}
                      error={(touched.email && Boolean(errors.email)) || emailError}
                      helperText={
                        (touched.email && errors.email) || 
                        (emailError && "Email already exists")
                      }
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Username*"
                      name="username"
                      value={values.username}
                      onChange={(e) => {
                        handleChange(e);
                        checkFieldExists(e.target.value, "username");
                      }}
                      onBlur={handleBlur}
                      error={(touched.username && Boolean(errors.username)) || usernameError}
                      helperText={
                        (touched.username && errors.username) || 
                        (usernameError && "Username already exists")
                      }
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Employment Details</Typography>
                    <Divider sx={{ mb: 3 }} />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Role*</InputLabel>
                      <Select
                        name="role"
                        value={values.role}
                        label="Role*"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.role && Boolean(errors.role)}
                      >
                        {roleTypes.map((role) => (
                          <MenuItem key={role} value={role}>
                            {role}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Status*</InputLabel>
                      <Select
                        name="active_status"
                        value={values.active_status}
                        label="Status*"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.active_status && Boolean(errors.active_status)}
                      >
                        {statusTypes.map((status) => (
                          <MenuItem key={status} value={status}>
                            {status}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Date of Birth"
                      name="date_of_birth"
                      type="date"
                      value={values.date_of_birth}
                      onChange={handleChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        max: getMinBirthDate()
                      }}
                      error={touched.date_of_birth && Boolean(errors.date_of_birth)}
                      helperText={touched.date_of_birth && errors.date_of_birth}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Joining Date"
                      name="joining_date"
                      type="date"
                      value={values.joining_date}
                      onChange={handleChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        max: getTodayDate()
                      }}
                      error={touched.joining_date && Boolean(errors.joining_date)}
                      helperText={touched.joining_date && errors.joining_date}
                    />
                  </Grid>

                  {/* Department field if needed */}
                  {/* <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Department</InputLabel>
                      <Select
                        name="department"
                        value={values.department}
                        label="Department"
                        onChange={handleChange}
                        disabled={loadingDepartments}
                      >
                        {departments.map((dept) => (
                          <MenuItem key={dept._id} value={dept._id}>
                            {dept.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid> */}

                  <Grid item xs={12} sx={{ mt: 3 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={<SaveIcon />}
                      sx={{ mr: 2 }}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => router.back()}
                      size="large"
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Paper>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default EditStaffPage;