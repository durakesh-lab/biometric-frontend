import React, { useEffect, useMemo, useRef, useState } from "react";
import { TextField, MenuItem, Button, Grid, Card, CardContent, Typography, Divider, Box, Backdrop, CircularProgress } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Layout from "../../components/Layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { createEmployee, getDepartmentList, getPositionList } from "@/store/authSlice";
import SuccessSnackbar from "../../components/successpopup/successpopup";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      // main: "#4CAF50", // green accent
      main: "#0E9F6E",
    },
    background: {
      default: "#F8F9FA", // off-white
      paper: "#FFFFFF",
    },
    secondary: {
      main: "#1C242E",
    },
 
  },
  typography: {
    fontSize: 10,
  },
});




let departments = [
  // { label: "department", value: 1 },
  // { label: "Sales", value: 2 },
  // { label: "Engineering", value: 3 }
];

let positions = [
  // { label: "positions", value: 1 },
  // { label: "Developer", value: 2 },
  // { label: "Analyst", value: 3 }
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
const area = [
  { label: "area", value: 1 },
];

const initialValues = {
  emp_code: "",
  first_name: "",
  last_name: "",
  nickname: "",
  device_password: "",
  card_no: "",
  department: "",
  position: "",
  hire_date: new Date().toISOString().split('T')[0],
  gender: "",
  birthday: "",
  verify_mode: "",
  emp_type: "",
  contact_tel: "",
  office_tel: "",
  mobile: "",
  national: "",
  city: "",
  address: "",
  postcode: "",
  email: "",
  enroll_sn: "",
  ssn: "",
  religion: "",
  enable_att: "",
  enable_overtime: "",
  enable_holiday: "",
  dev_privilege: "",
  self_password: "",
  area: "",
  app_status: "",
  app_role: "",
  flow_role: []
};


const validationSchema = Yup.object({
  emp_code: Yup.string().required("Required"),
  first_name: Yup.string().required("Required"),
  department: Yup.string().required("Required"),
  position: Yup.string().required("Required"),
  enable_att: Yup.string().required("Required"),
  enable_holiday: Yup.string().required("Required"),
  enable_overtime: Yup.string().required("Required"),
  area: Yup.string().required("Required"),
  emp_type:Yup.string().required("Required"),
  hire_date:Yup.string().required("Required"),
  mobile: Yup.string()
    .nullable()
    .matches(/^\d{10}$/, "Mobile must be 10 digits")
    .notRequired()
    .test("valid-mobile", "Mobile must be 10 digits", value => {
      if (!value) return true;
      return /^\d{10}$/.test(value);
    }),

  contact_tel: Yup.string()
    .nullable()
    .test("valid-contact", "Contact Tel must be 10 digits", value => {
      if (!value) return true;
      return /^\d{10}$/.test(value);
    }),

  office_tel: Yup.string()
    .nullable()
    .test("valid-office", "Office Tel must be 10 digits", value => {
      if (!value) return true;
      return /^\d{10}$/.test(value);
    }),

  email: Yup.string()
    .nullable()
    .email("Invalid email")
    .notRequired()
    .test("valid-email", "Invalid email", value => {
      if (!value) return true;
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }),

});

const EmployeeForm = () => {
    const [errorAlert, setErrorAlert] = useState({ show: false, message: "" });
  
  const formikRef = useRef();
  const { createdEmplyeeData,getPositionListData } = useSelector(state => state.auth);
  const {getDepartmentListData} = useSelector(state => state.auth);
  const [open, setOpen] = useState(true); 
   const [loading,setLoading]=useState(false)

   departments = useMemo(() => {
    if (getDepartmentListData?.length) {
      return getDepartmentListData.map((e) => {
        return { label: e.dept_name, value: e.id }
      })
    }
    else {
      return []
    }
  }, [getDepartmentListData?.length])

  useEffect(() => {
    if (createdEmplyeeData && formikRef.current) {
      setLoading(false)
      setOpen("addemployee");
      formikRef.current.resetForm();
    }
  }, [createdEmplyeeData]);



  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };
  const dispatch = useDispatch();
  const handleSubmit = async (values) => {

    setLoading(true)
    dispatch(createEmployee({ obj: values }));
  };

  const [positionsLoading, setPositionsLoading] = useState(true);

  useEffect(() => {
    dispatch(getPositionList()).then(() => setPositionsLoading(false));
  }, [dispatch]);
console.log(getPositionListData,"getPositionListDatagetPositionListData@@@@@@@@@@")
       useEffect(()=>{
        dispatch(getDepartmentList());
        },[])
          positions = useMemo(() => {
            if (getPositionListData?.length) {
              return getPositionListData.map((e) => {
                return { label: e.position_name, value: e.id }
              })
            }
            else {
              return []
            }
          }, [getPositionListData?.length])
  return (
    <Layout>   
      <ThemeProvider theme={theme}>
      <Backdrop
          sx={{
            color: '#fff',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }}
          open={loading}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: 2
          }}>
            <CircularProgress 
              size={60} 
              thickness={4}
              sx={{ 
                color: theme.palette.primary.main,
                animationDuration: '1000ms' 
              }} 
            />
            <Typography variant="h6" color="white">
              {loading ? "Submitting..." :""}
            </Typography>
          </Box>
        </Backdrop>

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
              {({ values, errors, touched, handleChange, setFieldValue, isSubmitting }) => (
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
                        onChange={ handleChange}
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
                        label="Enter Position*"
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
                        select
                        label="Area*"
                        name="area"
                        value={values.area}
                        onChange={handleChange}
                        error={touched.area && Boolean(errors.area)}
                        helperText={touched.area && errors.area}
                        variant="outlined"
                      >
                        {area.map((type) => (
                          <MenuItem key={type.value} value={type.value}>
                            {type.label}
                          </MenuItem>
                        ))}
                      </TextField>
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
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Date of Birth"
                        name="birthday"
                        value={values.birthday}
                        onChange={handleChange}
                        error={touched.birthday && Boolean(errors.birthday)}
                        helperText={touched.birthday && errors.birthday}
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                      />
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
                        label="Email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        variant="outlined"
                      />
                    </Grid>
                    
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
                        label="Nationality"
                        name="national"
                        value={values.national}
                        onChange={handleChange}
                        error={touched.national && Boolean(errors.national)}
                        helperText={touched.national && errors.national}
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
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Address"
                        name="address"
                        value={values.address}
                        onChange={handleChange}
                        error={touched.address && Boolean(errors.address)}
                        helperText={touched.address && errors.address}
                        variant="outlined"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Postcode"
                        name="postcode"
                        value={values.postcode}
                        onChange={handleChange}
                        error={touched.postcode && Boolean(errors.postcode)}
                        helperText={touched.postcode && errors.postcode}
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
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Enroll SN"
                        name="enroll_sn"
                        value={values.enroll_sn}
                        onChange={handleChange}
                        error={touched.enroll_sn && Boolean(errors.enroll_sn)}
                        helperText={touched.enroll_sn && errors.enroll_sn}
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
                        label="Self Password"
                        name="self_password"
                        value={values.self_password}
                        onChange={handleChange}
                        error={touched.self_password && Boolean(errors.self_password)}
                        helperText={touched.self_password && errors.self_password}
                        variant="outlined"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        select
                        label="Enable Attendance*"
                        name="enable_att"
                        value={values.enable_att}
                        onChange={handleChange}
                        error={touched.enable_att && Boolean(errors.enable_att)}
                        helperText={touched.enable_att && errors.enable_att}
                        variant="outlined"
                      >
                        {enableOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        select
                        label="Enable Overtime*"
                        name="enable_overtime"
                        value={values.enable_overtime}
                        onChange={handleChange}
                        error={touched.enable_overtime && Boolean(errors.enable_overtime)}
                        helperText={touched.enable_overtime && errors.enable_overtime}
                        variant="outlined"
                      >
                        {enableOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        select
                        label="Enable Holiday*"
                        name="enable_holiday"
                        value={values.enable_holiday}
                        onChange={handleChange}
                        error={touched.enable_holiday && Boolean(errors.enable_holiday)}
                        helperText={touched.enable_holiday && errors.enable_holiday}
                        variant="outlined"
                      >
                        {enableOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
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
                    
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                    </Grid>
                    
                    {/* App Settings Section */}
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>App Settings</Typography>
                      <Divider />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        select
                        label="App Status"
                        name="app_status"
                        value={values.app_status}
                        onChange={handleChange}
                        error={touched.app_status && Boolean(errors.app_status)}
                        helperText={touched.app_status && errors.app_status}
                        variant="outlined"
                      >
                        {appStatuses.map((status) => (
                          <MenuItem key={status.value} value={status.value}>
                            {status.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        select
                        label="App Role"
                        name="app_role"
                        value={values.app_role}
                        onChange={handleChange}
                        error={touched.app_role && Boolean(errors.app_role)}
                        helperText={touched.app_role && errors.app_role}
                        variant="outlined"
                      >
                        {appRoles.map((role) => (
                          <MenuItem key={role.value} value={role.value}>
                            {role.label}
                          </MenuItem>
                        ))}
                      </TextField>
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
                        disabled={isSubmitting || loading}
                      >
                        {loading ? (
                          <>
                            <CircularProgress 
                              size={24} 
                              sx={{ 
                                color: 'white',
                                mr: 2 
                              }} 
                            />
                            Processing...
                          </>
                        ) : "ADD"}
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