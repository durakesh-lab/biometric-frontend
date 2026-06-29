import React, { useEffect, useMemo, useRef, useState } from "react";
import { TextField, MenuItem, Button, Grid, Card, CardContent, Typography, Divider, Box, Backdrop, CircularProgress } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Layout from "../../components/Layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { createbranch, createcompany, createDepartment, createEmployee, createPosition, getbranchList, getDepartmentList, getPositionList } from "@/store/authSlice";
import SuccessSnackbar from "../../components/common/successpopup";
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




let positions = [
  { label: "department", value: 1 },
  // { label: "Sales", value: 2 },
  // { label: "Engineering", value: 3 }
];



const initialValues = {
  companyId:"",
    name: '',
    owner: '',
    mailingAddress: '',
    email: '',
    phoneNumber: '',
    nominalCapital: '',
    industry: '',
    website: '',
    companyDescription: ''
  };
  
  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    companyId:Yup.string().required('Company Id is required'),
    name: Yup.string().required('Company name is required'),
    owner: Yup.string().required('Owner name is required'),
    mailingAddress: Yup.string().required('Mailing address is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    nominalCapital: Yup.string().required('Nominal capital is required'),
    industry: Yup.string().required('Industry is required'),
    website: Yup.string().url('Invalid URL').required('Website is required'),
    companyDescription: Yup.string().required('Company description is required')
  });
  
  const CompanyForm = () => {
    const formikRef = useRef();
    const [open, setOpen] = useState(false); 
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
  
    // Sample industries for dropdown - you can replace with your actual data
    const industries = [
      { label: 'Information Technology', value: 'Information Technology' },
      { label: 'Finance', value: 'Finance' },
      { label: 'Healthcare', value: 'Healthcare' },
      { label: 'Manufacturing', value: 'Manufacturing' },
      { label: 'Retail', value: 'Retail' },
      { label: 'Education', value: 'Education' },
      { label: 'Other', value: 'Other' }
    ];
  

  const { createdEmplyeeData,getBranchListData,createdbranchData ,createdcompanyData} = useSelector(state => state.auth);
  const select2= useSelector(state => state.auth);
  const selector = useSelector(state => state.auth);
console.log(createdcompanyData,"????????????")
  positions = useMemo(() => {
    if (getBranchListData?.length) {
      return getBranchListData.map((e) => {
        return { label: e.area_name , value: e.id }
      })
    }
    else {
      return []
    }
  }, [getBranchListData?.length])

  useEffect(() => {
    if (createdcompanyData!=null && Object.keys(createdcompanyData).length && formikRef.current) {
      console.log({createdcompanyData})
      setLoading(false)
      setOpen("addcompany");
      formikRef.current.resetForm();
    }
  },  [createdcompanyData?.constructor?.name=="Object" ? Object.keys(createdcompanyData).length :""]);



  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };
  const handleSubmit = async (values) => {

    setLoading(true)
    dispatch(createcompany({ obj: values }));
  };
  
  const [positionsLoading, setPositionsLoading] = useState(true);

//   useEffect(() => {
//     dispatch(getbranchList()).then(() => setPositionsLoading(false));
//   }, [dispatch]);
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
              {loading ? "Submitting..." : ""}
            </Typography>
          </Box>
        </Backdrop>

        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>Add Company</Typography>
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
                    {/* Company Information Section */}

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Company Id*"
                        name="name"
                        value={values.companyId}
                        onChange={handleChange}
                        error={touched.companyId && Boolean(errors.companyId)}
                        helperText={touched.companyId && errors.companyId}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Company Name*"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                        variant="outlined"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Owner*"
                        name="owner"
                        value={values.owner}
                        onChange={handleChange}
                        error={touched.owner && Boolean(errors.owner)}
                        helperText={touched.owner && errors.owner}
                        variant="outlined"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Mailing Address*"
                        name="mailingAddress"
                        value={values.mailingAddress}
                        onChange={handleChange}
                        error={touched.mailingAddress && Boolean(errors.mailingAddress)}
                        helperText={touched.mailingAddress && errors.mailingAddress}
                        variant="outlined"
                        multiline
                        rows={3}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Email*"
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
                        label="Phone Number*"
                        name="phoneNumber"
                        value={values.phoneNumber}
                        onChange={handleChange}
                        error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                        helperText={touched.phoneNumber && errors.phoneNumber}
                        variant="outlined"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Nominal Capital*"
                        name="nominalCapital"
                        value={values.nominalCapital}
                        onChange={handleChange}
                        error={touched.nominalCapital && Boolean(errors.nominalCapital)}
                        helperText={touched.nominalCapital && errors.nominalCapital}
                        variant="outlined"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        select
                        label="Industry*"
                        name="industry"
                        value={values.industry}
                        onChange={handleChange}
                        error={touched.industry && Boolean(errors.industry)}
                        helperText={touched.industry && errors.industry}
                        variant="outlined"
                      >
                        {industries.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Website*"
                        name="website"
                        value={values.website}
                        onChange={handleChange}
                        error={touched.website && Boolean(errors.website)}
                        helperText={touched.website && errors.website}
                        variant="outlined"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Company Description*"
                        name="companyDescription"
                        value={values.companyDescription}
                        onChange={handleChange}
                        error={touched.companyDescription && Boolean(errors.companyDescription)}
                        helperText={touched.companyDescription && errors.companyDescription}
                        variant="outlined"
                        multiline
                        rows={4}
                      />
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
                        ) : "Submit"}
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

export default CompanyForm;
