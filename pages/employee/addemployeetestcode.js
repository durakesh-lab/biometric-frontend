import React, { useEffect, useRef, useState } from "react";
import { TextField, MenuItem, Button, Grid, Card, CardContent, Typography, Divider, Box } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Layout from "../../components/Layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { createEmployee } from "@/store/authSlice";
import SuccessSnackbar from "../../components/successpopup/successpopup";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      // main: "#0E9F6E",
      main: "#0E9F6E",
    },
    secondary: {
      main: "#1C242E",
    },
    background: {
      default: "#F9FAFB",
    },
  },
  typography: {
    // This sets the default font size for the <body> text in MUI
    fontSize: 10, 
    // You can also override specific variants like h1, h2, etc.
    // h1: { fontSize: "2rem" },
    // h2: { fontSize: "1.75rem" },
    // ...
  },
  // components: {
  //   MuiTextField: {
  //     styleOverrides: {
  //       root: {
  //         fontSize: "14px", // Reduce font size inside inputs
  //         "& .MuiInputBase-root": {
  //           fontSize: "14px", // Text inside input
  //           padding: "6px 10px", // Adjust padding
  //           minHeight: "40px", // Reduce height
  //         },
  //       },
  //     },
  //   },
  // },
});


// Updated options with their corresponding API values
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

const genders = ["Male", "Female", "Other"];

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

const initialValues = {
  // emp_code: "",
  // first_name: "",
  // last_name: "",
  // nickname: "",
  // device_password: "",
  // card_no: "",
  // department: "",
  // position: "",
  // hire_date: "",
  // gender: "",
  // birthday: "",
  // verify_mode: "",
  // emp_type: "",
  // contact_tel: "",
  // office_tel: "",
  // mobile: "",
  // national: "",
  // city: "",
  // address: "",
  // postcode: "",
  // email: "",
  // enroll_sn: "",
  // ssn: "",
  // religion: "",
  // enable_att: "",
  // enable_overtime: "",
  // enable_holiday: "",
  // dev_privilege: "",
  // self_password: "",
  // area: "",
  // app_status: "",
  // app_role: "",

  emp_code: "",
  first_name: "",
  last_name: "",
  nickname: "",
  device_password: "",
  card_no: "",
  department: "",
  position: "",
  hire_date: "",
  gender: "",
  verify_mode: 0, // Default to "Any"
  emp_type: "",
  contact_tel: "",
  office_tel: "",
  mobile: "",
  city: "",
  ssn: "",
  religion: "",
  dev_privilege: 0, // Default to "Employee"
  area: "",
  bio_photo: null,
  photo: null,
  passport: "",
  driver_license_motorcycle: "",
  driver_license_automobile: ""
};

const validationSchema = Yup.object({
  emp_code: Yup.string().required("Required"),
  first_name: Yup.string().required("Required"),
  department: Yup.string().required("Required"),
  position: Yup.string().required("Required"),
  emp_type: Yup.string().required("Required"),
  hire_date: Yup.string().required("Required"),
  area: Yup.string().required("Required"),






  // mobile: Yup.string()
  //   .matches(/^\d{10}$/, "Mobile must be 10 digits")
  //   .required("Required"),
  // national: Yup.string().required("Required"),
  // city: Yup.string().required("Required"),
  // address: Yup.string().required("Required"),
  // postcode: Yup.string().required("Required"),
  // email: Yup.string().email("Invalid email").required("Required"),


});

const EmployeeForm = () => {
  const formikRef = useRef();
  const { createdEmplyeeData } = useSelector(state => state.auth);
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    if (createdEmplyeeData && formikRef.current) {
      setOpen(true);
      formikRef.current.resetForm();
    }
  }, [createdEmplyeeData]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  const dispatch = useDispatch();
  const handleSubmit = async (values) => {
    const formData = new FormData();
    
    // Append all fields to formData
    Object.keys(values).forEach(key => {
      if (key === 'bio_photo' || key === 'photo') {
        if (values[key]) formData.append(key, values[key]);
      } else {
        formData.append(key, values[key]);
      }
    });

    dispatch(createEmployee({ obj: formData }));
  };

  const handleFileChange = (event, fieldName, setFieldValue) => {
    const file = event.target.files[0];
    setFieldValue(fieldName, file);
  };

  return (
    <Layout>   
          <ThemeProvider theme={theme}>

      <Card>

        <CardContent>
          <Typography variant="h5" gutterBottom>Add Employee</Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, setFieldValue }) => (
              <Form>
                <Grid container spacing={3}>
                  {/* Profile Section */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>Profile</Typography>
                    <Divider />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Employee ID*"
                      name="emp_code"
                      value={values.emp_code}
                      onChange={handleChange}
                      error={touched.emp_code && Boolean(errors.emp_code)}
                      helperText={touched.emp_code && errors.emp_code}
                      variant="outlined"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Department*"
                      name="department"
                      value={values.department}
                      onChange={handleChange}
                      error={touched.department && Boolean(errors.department)}
                      helperText={touched.department && errors.department}
                      variant="outlined"
                    >
                      {departments.map((dept) => (
                        <MenuItem key={dept.value} value={dept.value}>
                          {dept.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Position*"
                      name="position"
                      value={values.position}
                      onChange={handleChange}
                      error={touched.position && Boolean(errors.position)}
                      helperText={touched.position && errors.position}
                      variant="outlined"
                    >
                      {positions.map((position) => (
                        <MenuItem key={position.value} value={position.value}>
                          {position.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Employment Type*"
                      name="emp_type"
                      value={values.emp_type}
                      onChange={handleChange}
                      error={touched.emp_type && Boolean(errors.emp_type)}
                      helperText={touched.emp_type && errors.emp_type}
                      variant="outlined"
                    >
                      {employmentTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="First Name*"
                      name="first_name"
                      value={values.first_name}
                      onChange={handleChange}
                      error={touched.first_name && Boolean(errors.first_name)}
                      helperText={touched.first_name && errors.first_name}
                      variant="outlined"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="last_name"
                      value={values.last_name}
                      onChange={handleChange}
                      error={touched.last_name && Boolean(errors.last_name)}
                      helperText={touched.last_name && errors.last_name}
                      variant="outlined"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Area*"
                      name="area"
                      value={values.area}
                      onChange={handleChange}
                      error={touched.area && Boolean(errors.area)}
                      helperText={touched.area && errors.area}
                      variant="outlined"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Date of Joining*"
                      name="hire_date"
                      value={values.hire_date}
                      onChange={handleChange}
                      error={touched.hire_date && Boolean(errors.hire_date)}
                      helperText={touched.hire_date && errors.hire_date}
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                    />
                  </Grid>
                  
                  {/* Photo Upload */}
                  {/* <Grid item xs={12}>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="photo-upload"
                      type="file"
                      onChange={(e) => handleFileChange(e, 'photo', setFieldValue)}
                    />
                    <label htmlFor="photo-upload">
                      <Button variant="contained" component="span">
                        Upload Photo
                      </Button>
                    </label>
                    {values.photo && (
                      <Typography variant="body2" sx={{ ml: 2, display: 'inline' }}>
                        {values.photo.name}
                      </Typography>
                    )}
                  </Grid> */}
                  <Grid item xs={12} md={6}>
  <Box
    sx={{
      border: '1px dashed #ccc',
      borderRadius: '4px',
      padding: '16px',
      textAlign: 'center',
      height: '200px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      backgroundColor: values.photo ? 'transparent' : '#f5f5f5',
    }}
  >
    <input
      accept="image/*"
      style={{ display: 'none' }}
      id="photo-upload"
      type="file"
      onChange={(e) => handleFileChange(e, 'photo', setFieldValue)}
    />
    {values.photo ? (
      <>
        <img
          src={URL.createObjectURL(values.photo)}
          alt="Uploaded employee"
          style={{
            maxWidth: '100%',
            maxHeight: '180px',
            objectFit: 'contain'
          }}
        />
        <label htmlFor="photo-upload">
          <Button 
            variant="outlined" 
            component="span"
            sx={{ mt: 1 }}
          >
            Change Photo
          </Button>
        </label>
      </>
    ) : (
      <>
        <Typography variant="body1" sx={{ mb: 1 }}>
          UPLOAD PHOTO
        </Typography>
        <label htmlFor="photo-upload">
          <Button 
            variant="contained" 
            component="span"
          >
            Select File
          </Button>
        </label>
      </>
    )}
  </Box>
  {values.photo && (
    <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
      {values.photo.name}
    </Typography>
  )}
</Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                  </Grid>
                  
                  {/* Personal Information Section */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>Personal Information</Typography>
                    <Divider />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Aadhaar No."
                      name="ssn"
                      value={values.ssn}
                      onChange={handleChange}
                      error={touched.ssn && Boolean(errors.ssn)}
                      helperText={touched.ssn && errors.ssn}
                      variant="outlined"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nick Name"
                      name="nickname"
                      value={values.nickname}
                      onChange={handleChange}
                      error={touched.nickname && Boolean(errors.nickname)}
                      helperText={touched.nickname && errors.nickname}
                      variant="outlined"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Passport No."
                      name="passport"
                      value={values.passport}
                      onChange={handleChange}
                      error={touched.passport && Boolean(errors.passport)}
                      helperText={touched.passport && errors.passport}
                      variant="outlined"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Mobile"
                      name="mobile"
                      value={values.mobile}
                      onChange={handleChange}
                      error={touched.mobile && Boolean(errors.mobile)}
                      helperText={touched.mobile && errors.mobile}
                      variant="outlined"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Contact No."
                      name="contact_tel"
                      value={values.contact_tel}
                      onChange={handleChange}
                      error={touched.contact_tel && Boolean(errors.contact_tel)}
                      helperText={touched.contact_tel && errors.contact_tel}
                      variant="outlined"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Office Tel"
                      name="office_tel"
                      value={values.office_tel}
                      onChange={handleChange}
                      error={touched.office_tel && Boolean(errors.office_tel)}
                      helperText={touched.office_tel && errors.office_tel}
                      variant="outlined"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Card No."
                      name="card_no"
                      value={values.card_no}
                      onChange={handleChange}
                      error={touched.card_no && Boolean(errors.card_no)}
                      helperText={touched.card_no && errors.card_no}
                      variant="outlined"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Religion"
                      name="religion"
                      value={values.religion}
                      onChange={handleChange}
                      error={touched.religion && Boolean(errors.religion)}
                      helperText={touched.religion && errors.religion}
                      variant="outlined"
                    />
                  </Grid>
                  
                  {/* <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                  </Grid> */}
                  
                  {/* Gender Section */}
                  {/* <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>Gender</Typography>
                    <Divider />
                  </Grid> */}
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Gender"
                      name="gender"
                      value={values.gender}
                      onChange={handleChange}
                      error={touched.gender && Boolean(errors.gender)}
                      helperText={touched.gender && errors.gender}
                      variant="outlined"
                    >
                      {genders.map((gender) => (
                        <MenuItem key={gender} value={gender}>
                          {gender}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Motorcycle License"
                      name="driver_license_motorcycle"
                      value={values.driver_license_motorcycle}
                      onChange={handleChange}
                      error={touched.driver_license_motorcycle && Boolean(errors.driver_license_motorcycle)}
                      helperText={touched.driver_license_motorcycle && errors.driver_license_motorcycle}
                      variant="outlined"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Automobile License"
                      name="driver_license_automobile"
                      value={values.driver_license_automobile}
                      onChange={handleChange}
                      error={touched.driver_license_automobile && Boolean(errors.driver_license_automobile)}
                      helperText={touched.driver_license_automobile && errors.driver_license_automobile}
                      variant="outlined"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="City"
                      name="city"
                      value={values.city}
                      onChange={handleChange}
                      error={touched.city && Boolean(errors.city)}
                      helperText={touched.city && errors.city}
                      variant="outlined"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                  </Grid>
                  
                  {/* Device Settings Section */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>Device Settings</Typography>
                    <Divider />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Verification Mode"
                      name="verify_mode"
                      value={values.verify_mode}
                      onChange={handleChange}
                      error={touched.verify_mode && Boolean(errors.verify_mode)}
                      helperText={touched.verify_mode && errors.verify_mode}
                      variant="outlined"
                    >
                      {verificationModes.map((mode) => (
                        <MenuItem key={mode.value} value={mode.value}>
                          {mode.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Device Password"
                      name="device_password"
                      value={values.device_password}
                      onChange={handleChange}
                      error={touched.device_password && Boolean(errors.device_password)}
                      helperText={touched.device_password && errors.device_password}
                      variant="outlined"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Device Privilege"
                      name="dev_privilege"
                      value={values.dev_privilege}
                      onChange={handleChange}
                      error={touched.dev_privilege && Boolean(errors.dev_privilege)}
                      helperText={touched.dev_privilege && errors.dev_privilege}
                      variant="outlined"
                    >
                      {devicePrivileges.map((privilege) => (
                        <MenuItem key={privilege.value} value={privilege.value}>
                          {privilege.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Box display="flex" alignItems="center">
                      {/* <Typography variant="body1" sx={{ mr: 2 }}>
                        FP Registered(r10): 0
                      </Typography>
                      <Button variant="contained">Enroll</Button> */}
                    </Box>
                  </Grid>
                  
              {/* Photo Upload Section */}


{/* Bio Photo Upload Section */}
<Grid item xs={12} md={6}>
  <Box
    sx={{
      border: '1px dashed #ccc',
      borderRadius: '4px',
      padding: '16px',
      textAlign: 'center',
      height: '200px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      backgroundColor: values.bio_photo ? 'transparent' : '#f5f5f5',
    }}
  >
    <input
      accept="image/*"
      style={{ display: 'none' }}
      id="bio-photo-upload"
      type="file"
      onChange={(e) => handleFileChange(e, 'bio_photo', setFieldValue)}
    />
    {values.bio_photo ? (
      <>
        <img
          src={URL.createObjectURL(values.bio_photo)}
          alt="Uploaded bio photo"
          style={{
            maxWidth: '100%',
            maxHeight: '180px',
            objectFit: 'contain'
          }}
        />
        <label htmlFor="bio-photo-upload">
          <Button 
            variant="outlined" 
            component="span"
            sx={{ mt: 1 }}
          >
            Change Bio Photo
          </Button>
        </label>
      </>
    ) : (
      <>
        <Typography variant="body1" sx={{ mb: 1 }}>
          BIO-PHOTO
        </Typography>
        <label htmlFor="bio-photo-upload">
          <Button 
            variant="contained" 
            component="span"
          >
            Select File
          </Button>
        </label>
      </>
    )}
  </Box>
  {values.bio_photo && (
    <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
      {values.bio_photo.name}
    </Typography>
  )}
</Grid>
                  
                  {/* Submit Button */}
                  <Grid item xs={12}>
                    <Button 
                      fullWidth 
                      type="submit" 
                      variant="contained" 
                      color="primary"
                      size="large"
                      sx={{ mt: 3 }}
                    >
                      ADD
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
      </ThemeProvider>

      <SuccessSnackbar open={open} handleClose={handleClose} />
    </Layout>
  );
};

export default EmployeeForm;