


// import React, { useEffect } from "react";
// import { TextField, MenuItem, Button, Grid } from "@mui/material";
// import { Formik, Form } from "formik";
// import * as Yup from "yup";
// import Layout from "../../components/Layout/Layout";
// import { useDispatch } from "react-redux";
// import { createEmployee } from "@/store/authSlice";
// import axios from "axios";

// const departments = ["HR", "Sales", "Engineering"];
// const positions = ["Manager", "Developer", "Analyst"];
// const genders = ["M", "F", "Other"];
// const verificationModes = ["Fingerprint", "Card", "PIN"];
// const employmentTypes = ["Full-Time", "Part-Time", "Contract"];
// const enableOptions = ["True", "False"];
// const devicePrivileges = ["Employee", "Administrator", "Supervisor"];
// const mobileAppStatuses = ["Enabled", "Disabled"];
// const appRoles = ["User", "Admin"];

// const initialValues = {
//   emp_code: "",
//   first_name: "",
//   last_name: "",
//   nickname: "",
//   device_password: "",
//   card_no: "",
//   department: "",
//   position: "",
//   hire_date: "",
//   gender: "",
//   birthday: "",
//   verify_mode: "",
//   emp_type: "",
//   contact_tel: "",
//   office_tel: "",
//   mobile: "",
//   national: "",
//   city: "",
//   address: "",
//   postcode: "",
//   email: "",
//   enroll_sn: "",
//   ssn: "",
//   religion: "",
//   enable_att: "",
//   enable_overtime: "",
//   enable_holiday: "",
//   dev_privilege: "",
//   self_password: "",
//   area: "",
//   app_status: "",
//   app_role: "",
// };

// const validationSchema = Yup.object({
//   emp_code: Yup.string().required("Required"),
//   first_name: Yup.string().required("Required"),
//   last_name: Yup.string().required("Required"),
//   nickname: Yup.string().required("Required"),
//   device_password: Yup.string().required("Required"),
//   card_no: Yup.string().required("Required"),
//   department: Yup.string().required("Required"),
//   position: Yup.string().required("Required"),
//   hire_date: Yup.string().required("Required"),
//   gender: Yup.string().required("Required"),
//   birthday: Yup.string().required("Required"),
//   verify_mode: Yup.string().required("Required"),
//   emp_type: Yup.string().required("Required"),
//   contact_tel: Yup.string().required("Required"),
//   office_tel: Yup.string().required("Required"),
//   mobile: Yup.string()
//     .matches(/^\d{10}$/, "Mobile must be 10 digits")
//     .required("Required"),
//   national: Yup.string().required("Required"),
//   city: Yup.string().required("Required"),
//   address: Yup.string().required("Required"),
//   postcode: Yup.string().required("Required"),
//   email: Yup.string().email("Invalid email").required("Required"),
//   enroll_sn: Yup.string().required("Required"),
//   ssn: Yup.string().required("Required"),
//   religion: Yup.string().required("Required"),
//   enable_att: Yup.string().required("Required"),
//   enable_overtime: Yup.string().required("Required"),
//   enable_holiday: Yup.string().required("Required"),
//   dev_privilege: Yup.string().required("Required"),
//   self_password: Yup.string().required("Required"),
//   area: Yup.string().required("Required"),
//   app_status: Yup.string().required("Required"),
//   app_role: Yup.string().required("Required"),
// });

// const EmployeeForm = () => {
//     let dispatch=useDispatch()
//   const handleSubmit = async (values) => {
//     dispatch(createEmployee({obj:values}))
   
//   };

//   return (
//     <Layout>   
//     <Formik
//       initialValues={initialValues}
//       validationSchema={validationSchema}
//       onSubmit={handleSubmit}
//     >
//       {({ values, errors, touched, handleChange }) => {
//         console.log({values, errors, touched,})
//         return (
//         <Form>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Employee ID"
//                 name="emp_code"
//                 value={values.emp_code}
//                 onChange={handleChange}
//                 error={touched.emp_code && Boolean(errors.emp_code)}
//                 helperText={touched.emp_code && errors.emp_code}
//                 variant="outlined"
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="First Name"
//                 name="first_name"
//                 value={values.first_name}
//                 onChange={handleChange}
//                 error={touched.first_name && Boolean(errors.first_name)}
//                 helperText={touched.first_name && errors.first_name}
//                 variant="outlined"
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Last Name"
//                 name="last_name"
//                 value={values.last_name}
//                 onChange={handleChange}
//                 error={touched.last_name && Boolean(errors.last_name)}
//                 helperText={touched.last_name && errors.last_name}
//                 variant="outlined"
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Nick Name"
//                 name="nickname"
//                 value={values.nickname}
//                 onChange={handleChange}
//                 error={touched.nickname && Boolean(errors.nickname)}
//                 helperText={touched.nickname && errors.nickname}
//                 variant="outlined"
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Device Password"
//                 name="device_password"
//                 value={values.device_password}
//                 onChange={handleChange}
//                 error={
//                   touched.device_password && Boolean(errors.device_password)
//                 }
//                 helperText={touched.device_password && errors.device_password}
//                 variant="outlined"
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 select
//                 label="Department"
//                 name="department"
//                 value={values.department}
//                 onChange={handleChange}
//                 error={touched.department && Boolean(errors.department)}
//                 helperText={touched.department && errors.department}
//                 variant="outlined"
//               >
//                 {departments.map((dept) => (
//                   <MenuItem key={dept} value={dept}>
//                     {dept}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 select
//                 label="Position"
//                 name="position"
//                 value={values.position}
//                 onChange={handleChange}
//                 error={touched.position && Boolean(errors.position)}
//                 helperText={touched.position && errors.position}
//                 variant="outlined"
//               >
//                 {positions.map((position) => (
//                   <MenuItem key={position} value={position}>
//                     {position}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>
//             <Grid item xs={12}>
//   <TextField
//     fullWidth
//     label="Date of Joining"
//     name="hire_date"
//     value={values.hire_date}
//     onChange={handleChange}
//     error={touched.hire_date && Boolean(errors.hire_date)}
//     helperText={touched.hire_date && errors.hire_date}
//     type="date"
//     InputLabelProps={{ shrink: true }}
//     variant="outlined"
//   />
// </Grid>
// <Grid item xs={12}>
//   <TextField
//     fullWidth
//     select
//     label="Gender"
//     name="gender"
//     value={values.gender}
//     onChange={handleChange}
//     error={touched.gender && Boolean(errors.gender)}
//     helperText={touched.gender && errors.gender}
//     variant="outlined"
//   >
//     {genders.map((gender) => (
//       <MenuItem key={gender} value={gender}>
//         {gender}
//       </MenuItem>
//     ))}
//   </TextField>
// </Grid>
// <Grid item xs={12}>
//   <TextField
//     fullWidth
//     label="Birthday"
//     name="birthday"
//     value={values.birthday}
//     onChange={handleChange}
//     error={touched.birthday && Boolean(errors.birthday)}
//     helperText={touched.birthday && errors.birthday}
//     type="date"
//     InputLabelProps={{ shrink: true }}
//     variant="outlined"
//   />
// </Grid>
// <Grid item xs={12}>
//   <TextField
//     fullWidth
//     select
//     label="Verification Mode"
//     name="verify_mode"
//     value={values.verify_mode}
//     onChange={handleChange}
//     error={touched.verify_mode && Boolean(errors.verify_mode)}
//     helperText={touched.verify_mode && errors.verify_mode}
//     variant="outlined"
//   >
//     {verificationModes.map((mode) => (
//       <MenuItem key={mode} value={mode}>
//         {mode}
//       </MenuItem>
//     ))}
//   </TextField>
// </Grid>
// <Grid item xs={12}>
//   <TextField
//     fullWidth
//     select
//     label="Employment Type"
//     name="emp_type"
//     value={values.emp_type}
//     onChange={handleChange}
//     error={touched.emp_type && Boolean(errors.emp_type)}
//     helperText={touched.emp_type && errors.emp_type}
//     variant="outlined"
//   >
//     {employmentTypes.map((type) => (
//       <MenuItem key={type} value={type}>
//         {type}
//       </MenuItem>
//     ))}
//   </TextField>
// </Grid>
// <Grid item xs={12}>
//   <TextField
//     fullWidth
//     label="Area"
//     name="area"
//     value={values.area}
//     onChange={handleChange}
//     error={touched.area && Boolean(errors.area)}
//     helperText={touched.area && errors.area}
//     variant="outlined"
//   />
// </Grid>
// <Grid item xs={12}>
//   <TextField
//     fullWidth
//     label="Workflow Role"
//     name="workflow_role"
//     value={values.workflow_role}
//     onChange={handleChange}
//     error={touched.workflow_role && Boolean(errors.workflow_role)}
//     helperText={touched.workflow_role && errors.workflow_role}
//     variant="outlined"
//   />
// </Grid>
// <Grid item xs={12}>
//   <TextField
//     fullWidth
//     label="Password"
//     name="self_password"
//     value={values.self_password}
//     onChange={handleChange}
//     error={touched.self_password && Boolean(errors.self_password)}
//     helperText={touched.self_password && errors.self_password}
//     type="password"
//     variant="outlined"
//   />
// </Grid>
// <Grid item xs={12}> 
// <TextField
//     fullWidth
//     label="card no"
//     name="card_no"
//     value={values.card_no}
//     onChange={handleChange}
//     error={touched.card_no && Boolean(errors.card_no)}
//     helperText={touched.card_no && errors.card_no}
//     variant="outlined"
//   />
//   </Grid>
// <Grid item xs={12}>
//   <TextField
//     fullWidth
//     select
//     label="Enable Holiday"
//     name="enable_holiday"
//     value={values.enable_holiday}
//     onChange={handleChange}
//     error={touched.enable_holiday && Boolean(errors.enable_holiday)}
//     helperText={touched.enable_holiday && errors.enable_holiday}
//     variant="outlined"
//   >
//     {enableOptions.map((option) => (
//       <MenuItem key={option} value={option}>
//         {option}
//       </MenuItem>
//     ))}
//   </TextField>
// </Grid>
// <Grid item xs={12}>
//   <TextField
//     fullWidth
//     select
//     label="Enable Overtime"
//     name="enable_overtime"
//     value={values.enable_overtime}
//     onChange={handleChange}
//     error={touched.enable_overtime && Boolean(errors.enable_overtime)}
//     helperText={touched.enable_overtime && errors.enable_overtime}
//     variant="outlined"
//   >
//     {enableOptions.map((option) => (
//       <MenuItem key={option} value={option}>
//         {option}
//       </MenuItem>
//     ))}
//   </TextField>
// </Grid>
// <Grid item xs={12}>
//   <TextField
//     fullWidth
//     label="Religion"
//     name="religion"
//     value={values.religion}
//     onChange={handleChange}
//     error={touched.religion && Boolean(errors.religion)}
//     helperText={touched.religion && errors.religion}
//     variant="outlined"
//   />
// </Grid>
// <Grid item xs={12}>
//   <TextField
//     fullWidth
//     label="Aadhaar No."
//     name="ssn"
//     value={values.ssn}
//     onChange={handleChange}
//     error={touched.ssn && Boolean(errors.ssn)}
//     helperText={touched.ssn && errors.ssn}
//     variant="outlined"
//   />
// </Grid>
// <Grid item xs={12}>
//   <TextField
//     fullWidth
//     label="Enroll Device"
//     name="enroll_sn"
//     value={values.enroll_sn}
//     onChange={handleChange}
//     error={touched.enroll_sn && Boolean(errors.enroll_sn)}
//     helperText={touched.enroll_sn && errors.enroll_sn}
//     variant="outlined"
//   />
// </Grid>
// <Grid item xs={12}>
//   <TextField
//     fullWidth
//     label="Email"
//     name="email"
//     value={values.email}
//     onChange={handleChange}
//     error={touched.email && Boolean(errors.email)}
//     helperText={touched.email && errors.email}
//     variant="outlined"
//   />
// </Grid>
// <Grid item xs={12}>
//   <TextField
//     fullWidth
//     label="Pincode"
//     name="postcode"
//     value={values.postcode}
//     onChange={handleChange}
//     error={touched.postcode && Boolean(errors.postcode)}
//     helperText={touched.postcode && errors.postcode}
//     variant="outlined"
//   />
// </Grid>
// <Grid item xs={12}>
//   <TextField
//     fullWidth
//     label="Permanent Address"
//     name="address"
//     value={values.address}
//     onChange={handleChange}
//     error={touched.address && Boolean(errors.address)}
//     helperText={touched.address && errors.address}
//     variant="outlined"
//   />
// </Grid>
// <Grid item xs={12}>
//   <TextField
//     fullWidth
//     label="City"
//     name="city"
//     value={values.city}
//     onChange={handleChange}
//     error={touched.city && Boolean(errors.city)}
//     helperText={touched.city && errors.city}
//     variant="outlined"
//   />
// </Grid>
// <Grid item xs={12}>
//   <TextField
//     fullWidth
//     label="Nationality"
//     name="national"
//     value={values.national}
//     onChange={handleChange}
//     error={touched.national && Boolean(errors.national)}
//     helperText={touched.national && errors.national}
//     variant="outlined"
//   />
// </Grid>
// <Grid item xs={12}>
//   <TextField
//     fullWidth
//     label="Mobile"
//     name="mobile"
//     value={values.mobile}
//     onChange={handleChange}
//     error={touched.mobile && Boolean(errors.mobile)}
//     helperText={touched.mobile && errors.mobile}
//     variant="outlined"
//   />
// </Grid>
// <Grid item xs={12}>
//   <TextField
//     fullWidth
//     label="Office Tel"
//     name="office_tel"
//     value={values.office_tel}
//     onChange={handleChange}
//     error={touched.office_tel && Boolean(errors.office_tel)}
//     helperText={touched.office_tel && errors.office_tel}
//     variant="outlined"
//   />
// </Grid>
// <Grid item xs={12}>
//   <TextField
//     fullWidth
//     label="Contact No."
//     name="contact_tel"
//     value={values.contact_tel}
//     onChange={handleChange}
//     error={touched.contact_tel && Boolean(errors.contact_tel)}
//     helperText={touched.contact_tel && errors.contact_tel}
//     variant="outlined"
//   />
// </Grid>

// <Grid item xs={12}>
//   <TextField
//     fullWidth
//     select
//     label="Enable Attendance"
//     name="enable_att"
//     value={values.enable_att}
//     onChange={handleChange}
//     error={touched.enable_att && Boolean(errors.enable_att)}
//     helperText={touched.enable_att && errors.enable_att}
//     variant="outlined"
//   >
//     {enableOptions.map((option) => (
//       <MenuItem key={option} value={option}>
//         {option}
//       </MenuItem>
//     ))}
//   </TextField>
// </Grid>
// <Grid item xs={12}>
//   <TextField
//     fullWidth
//     select
//     label="Device Privilege"
//     name="dev_privilege"
//     value={values.dev_privilege}
//     onChange={handleChange}
//     error={touched.dev_privilege && Boolean(errors.dev_privilege)}
//     helperText={touched.dev_privilege && errors.dev_privilege}
//     variant="outlined"
//   >
//     {devicePrivileges.map((privilege) => (
//       <MenuItem key={privilege} value={privilege}>
//         {privilege}
//       </MenuItem>
//     ))}
//   </TextField>
// </Grid>
// <Grid item xs={12}>
//   <TextField
//     fullWidth
//     select
//     label="Mobile App Status"
//     name="app_status"
//     value={values.app_status}
//     onChange={handleChange}
//     error={touched.app_status && Boolean(errors.app_status)}
//     helperText={touched.app_status && errors.app_status}
//     variant="outlined"
//   >
//     {mobileAppStatuses.map((status) => (
//       <MenuItem key={status} value={status}>
//         {status}
//       </MenuItem>
//     ))}
//   </TextField>
// </Grid>
// <Grid item xs={12}>
//   <TextField
//     fullWidth
//     select
//     label="APP Role"
//     name="app_role"
//     value={values.app_role}
//     onChange={handleChange}
//     error={touched.app_role && Boolean(errors.app_role)}
//     helperText={touched.app_role && errors.app_role}
//     variant="outlined"
//   >
//     {appRoles.map((role) => (
//       <MenuItem key={role} value={role}>
//         {role}
//       </MenuItem>
//     ))}
//   </TextField>
// </Grid>

//             {/* Add all other fields in a similar way */}
//             <Grid item xs={12}>
//               <Button fullWidth type="submit" variant="contained" color="primary">
//                 ADD
//               </Button>
//             </Grid>
//           </Grid>
//         </Form>
//       )}}
//     </Formik>
//     </Layout>
//   );
// };

// export default EmployeeForm;
