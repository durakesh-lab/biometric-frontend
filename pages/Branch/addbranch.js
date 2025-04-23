import React, { useEffect, useMemo, useRef, useState } from "react";
import { TextField, MenuItem, Button, Grid, Card, CardContent, Typography, Divider, Box, Backdrop, CircularProgress } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Layout from "../../components/Layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { createbranch, createDepartment, createEmployee, createPosition, getbranchList, getDepartmentList, getPositionList } from "@/store/authSlice";
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




let positions = [
  { label: "department", value: 1 },
  // { label: "Sales", value: 2 },
  // { label: "Engineering", value: 3 }
];



const initialValues = {
  area_code  : "",
  area_name  :  "",
  parent_area:  "",
};


const validationSchema = Yup.object({
  area_code  : Yup.string().required("Required"),
  area_name  : Yup.string().required("Required"),
  parent_area: Yup.string().required("Required"),
});

const EmployeeForm = () => {
  const formikRef = useRef();
  const { createdEmplyeeData,getBranchListData,createdbranchData } = useSelector(state => state.auth);
  const select2= useSelector(state => state.auth);
  const selector = useSelector(state => state.auth);
  const [open, setOpen] = useState(false); 
   const [loading,setLoading]=useState(false)

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
    if (createdbranchData!=null && Object.keys(createdbranchData).length && formikRef.current) {
      console.log({createdbranchData})
      setLoading(false)
      setOpen("addbranch");
      formikRef.current.resetForm();
    }
  },  [createdbranchData?.constructor?.name=="Object" ? Object.keys(createdbranchData).length :""]);



  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };
  const dispatch = useDispatch();
  const handleSubmit = async (values) => {

    setLoading(true)
    dispatch(createbranch({ obj: values }));
  };
  
  const [positionsLoading, setPositionsLoading] = useState(true);

  useEffect(() => {
    dispatch(getbranchList()).then(() => setPositionsLoading(false));
  }, [dispatch]);
  console.log(open,"openopenopen999999999999999")
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
            <Typography variant="h5" gutterBottom>Add Branch</Typography>
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
                    {/* <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>Profile</Typography>
                      <Divider />
                    </Grid> */}
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Branch code*"
                        name="area_code"
                        value={values.area_code  }
                        onChange={ handleChange}
                        error={touched.area_code   && Boolean(errors.area_code  )}
                        helperText={touched.area_code   && errors.area_code  }
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Branch Name*"
                        name="area_name"
                        value={values.area_name  }
                        onChange={handleChange}
                        error={touched.area_name   && Boolean(errors.area_name  )}
                        helperText={touched.area_name   && errors.area_name  }
                        variant="outlined"
                      />
                    </Grid>
             
                    <Grid item xs={12} md={6}>
                    <TextField
  fullWidth
  select
  label="Select Parent Branch*"
  name="parent_area"
  value={values.parent_area}
  onChange={handleChange}
  error={touched.parent_area && Boolean(errors.parent_area)}
  helperText={touched.parent_area && errors.parent_area}
  variant="outlined"
>
  {positionsLoading ? (
    <MenuItem disabled>Loading...</MenuItem>
  ) : (
    positions.map((position) => (
      <MenuItem key={position.value} value={position.value}>
        {position.label}
      </MenuItem>
    ))
  )}
</TextField>
                    </Grid>

                    
                    {/* <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                    </Grid> */}
                    
                    
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
