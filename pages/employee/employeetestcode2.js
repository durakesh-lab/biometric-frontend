import React, { useEffect, useRef, useState } from "react";
import { TextField, MenuItem, Button, Grid } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Layout from "../../components/Layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { createEmployee } from "@/store/authSlice";
import SuccessSnackbar from "../../components/successpopup/successpopup";

// Updated options with their corresponding API values
const departments = [
  { label: "HR", value: 1 },
  { label: "Sales", value: 2 },
  { label: "Engineering", value: 3 }
];

const positions = [
  { label: "Manager", value: 1 },
  // { label: "Developer", value: 2 },
  // { label: "Analyst", value: 3 }
];

const genders = ["M", "F", "Other"];

const verificationModes = [
  { label: "Fingerprint", value: 1 },
  { label: "Card", value: 2 },
  { label: "PIN", value: 3 }
  // Add more as needed
];

const employmentTypes = [
  { label: "Permanent", value: 1 },
  { label: "Temporary", value: 2 }
];

const enableOptions = [
  { label: "True", value: "True" },
  { label: "False", value: "False" }
];

const devicePrivileges = [
  { label: "Employee", value: 0 },
  { label: "Register", value: 2 },
  { label: "System Administrator", value: 6 },
  { label: "Super Administrator", value: 14 }
];

const mobileAppStatuses = [
  { label: "Enabled", value: 1 },
  { label: "Disabled", value: 0 }
];

const appRoles = [
  { label: "Employee", value: 1 },
  { label: "Administrator", value: 2 }
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
  hire_date: "",
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
};

const validationSchema = Yup.object({
  emp_code: Yup.string().required("Required"),
  first_name: Yup.string().required("Required"),
  // last_name: Yup.string().required("Required"),
  // nickname: Yup.string().required("Required"),
  device_password: Yup.string().required("Required"),
  // card_no: Yup.string().required("Required"),
  department: Yup.string().required("Required"),
  // position: Yup.string().required("Required"),
  // hire_date: Yup.string().required("Required"),
  // gender: Yup.string().required("Required"),
  // birthday: Yup.string().required("Required"),
  // verify_mode: Yup.string().required("Required"),
  // emp_type: Yup.string().required("Required"),
  contact_tel: Yup.string().required("Required"),
  office_tel: Yup.string().required("Required"),
  mobile: Yup.string()
    .matches(/^\d{10}$/, "Mobile must be 10 digits")
    .required("Required"),
  // national: Yup.string().required("Required"),
  // city: Yup.string().required("Required"),
  // address: Yup.string().required("Required"),
  // postcode: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  // enroll_sn: Yup.string().required("Required"),
  // ssn: Yup.string().required("Required"),
  // religion: Yup.string().required("Required"),
  // enable_att: Yup.string().required("Required"),
  // enable_overtime: Yup.string().required("Required"),
  // enable_holiday: Yup.string().required("Required"),
  // dev_privilege: Yup.string().required("Required"),
  self_password: Yup.string().required("Required"),
  area: Yup.string().required("Required"),
  // app_status: Yup.string().required("Required"),
  // app_role: Yup.string().required("Required"),
});

const EmployeeForm = () => {

  const formikRef = useRef();
  const {createdEmplyeeData} = useSelector(state => state.auth);
  useEffect(() => {
    if (createdEmplyeeData && formikRef.current) {
      setOpen(true);
      formikRef.current.resetForm();
    }
  }, [createdEmplyeeData]);
  const [open, setOpen] = useState(false);
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const dispatch = useDispatch();
  const handleSubmit = async (values) => {
    // Convert numeric strings to numbers where needed
    const apiValues = {
      ...values,
      emp_code: Number(values.emp_code),
      device_password: Number(values.device_password),
      card_no: Number(values.card_no),
      department: Number(values.department),
      position: Number(values.position),
      verify_mode: Number(values.verify_mode),
      emp_type: Number(values.emp_type),
      contact_tel: Number(values.contact_tel),
      office_tel: Number(values.office_tel),
      mobile: Number(values.mobile),
      postcode: Number(values.postcode),
      ssn: Number(values.ssn),
      dev_privilege: Number(values.dev_privilege),
      self_password: Number(values.self_password),
      area: Number(values.area),
      app_status: Number(values.app_status),
      app_role: Number(values.app_role),
      // These should already be "True"/"False" strings from the form
      enable_att: values.enable_att,
      enable_overtime: values.enable_overtime,
      enable_holiday: values.enable_holiday,
    };
    dispatch(createEmployee({ obj: {...apiValues,area:1} }));
  };

  return (
    <Layout>   
      <Formik
      innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange }) => (
          <Form>
            <Grid container spacing={2}>
              {/* Employee ID */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Employee ID"
                  name="emp_code"
                  value={values.emp_code}
                  onChange={handleChange}
                  error={touched.emp_code && Boolean(errors.emp_code)}
                  helperText={touched.emp_code && errors.emp_code}
                  variant="outlined"
                />
              </Grid>

              {/* Name Fields */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="first_name"
                  value={values.first_name}
                  onChange={handleChange}
                  error={touched.first_name && Boolean(errors.first_name)}
                  helperText={touched.first_name && errors.first_name}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
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
              <Grid item xs={12}>
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

              {/* Device Password */}
              <Grid item xs={12}>
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

              {/* Department Dropdown */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Department"
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

              {/* Position Dropdown */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Position"
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

              {/* Date Fields */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Date of Joining"
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
              
              {/* Gender Dropdown */}
              <Grid item xs={12}>
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

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Birthday"
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

              {/* Verification Mode Dropdown */}
              <Grid item xs={12}>
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

              {/* Employment Type Dropdown */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Employment Type"
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

              {/* Area */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Area"
                  name="area"
                  value={values.area}
                  onChange={handleChange}
                  error={touched.area && Boolean(errors.area)}
                  helperText={touched.area && errors.area}
                  variant="outlined"
                />
              </Grid>

              {/* Password */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  name="self_password"
                  value={values.self_password}
                  onChange={handleChange}
                  error={touched.self_password && Boolean(errors.self_password)}
                  helperText={touched.self_password && errors.self_password}
                  type="password"
                  variant="outlined"
                />
              </Grid>

              {/* Card No */}
              <Grid item xs={12}> 
                <TextField
                  fullWidth
                  label="card no"
                  name="card_no"
                  value={values.card_no}
                  onChange={handleChange}
                  error={touched.card_no && Boolean(errors.card_no)}
                  helperText={touched.card_no && errors.card_no}
                  variant="outlined"
                />
              </Grid>

              {/* Enable Holiday Dropdown */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Enable Holiday"
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

              {/* Enable Overtime Dropdown */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Enable Overtime"
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

              {/* Religion */}
              <Grid item xs={12}>
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

              {/* Aadhaar No. */}
              <Grid item xs={12}>
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

              {/* Enroll Device */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Enroll Device"
                  name="enroll_sn"
                  value={values.enroll_sn}
                  onChange={handleChange}
                  error={touched.enroll_sn && Boolean(errors.enroll_sn)}
                  helperText={touched.enroll_sn && errors.enroll_sn}
                  variant="outlined"
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12}>
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

              {/* Pincode */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Pincode"
                  name="postcode"
                  value={values.postcode}
                  onChange={handleChange}
                  error={touched.postcode && Boolean(errors.postcode)}
                  helperText={touched.postcode && errors.postcode}
                  variant="outlined"
                />
              </Grid>

              {/* Address */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Permanent Address"
                  name="address"
                  value={values.address}
                  onChange={handleChange}
                  error={touched.address && Boolean(errors.address)}
                  helperText={touched.address && errors.address}
                  variant="outlined"
                />
              </Grid>

              {/* City */}
              <Grid item xs={12}>
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

              {/* Nationality */}
              <Grid item xs={12}>
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

              {/* Mobile */}
              <Grid item xs={12}>
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

              {/* Office Tel */}
              <Grid item xs={12}>
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

              {/* Contact No. */}
              <Grid item xs={12}>
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

              {/* Enable Attendance Dropdown */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Enable Attendance"
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

              {/* Device Privilege Dropdown */}
              <Grid item xs={12}>
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

              {/* Mobile App Status Dropdown */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Mobile App Status"
                  name="app_status"
                  value={values.app_status}
                  onChange={handleChange}
                  error={touched.app_status && Boolean(errors.app_status)}
                  helperText={touched.app_status && errors.app_status}
                  variant="outlined"
                >
                  {mobileAppStatuses.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* APP Role Dropdown */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="APP Role"
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
                <Button fullWidth type="submit" variant="contained" color="primary">
                  ADD
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
      <SuccessSnackbar open={open} handleClose={handleClose} />
        </Layout>
  );
};

export default EmployeeForm;
