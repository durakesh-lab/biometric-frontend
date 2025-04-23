import React, { useEffect, useMemo, useRef, useState } from "react";
import { TextField, MenuItem, Button, Grid, Card, CardContent, Typography, Divider, Box, Backdrop, CircularProgress } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Layout from "../../components/Layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { createDepartment, createEmployee, createPosition, getDepartmentList, getPositionList } from "@/store/authSlice";
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
  position_code : "",
  position_name :  "",
  parent_position:  "",
};


const validationSchema = Yup.object({
  position_code : Yup.string().required("Required"),
  position_name : Yup.string().required("Required"),
  parent_position: Yup.string().required("Required"),
});

const EmployeeForm = () => {
  const formikRef = useRef();
  const { createdEmplyeeData,getPositionListData,createdPositionData } = useSelector(state => state.auth);
  const select2= useSelector(state => state.auth);
console.log({createdPositionData,select2},"678")
  const selector = useSelector(state => state.auth);
  const [open, setOpen] = useState(false); 
   const [loading,setLoading]=useState(false)

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
     useEffect(()=>{
                       dispatch(getDepartmentList());
                      },[])
  useEffect(() => {
    if (createdPositionData!=null && Object.keys(createdPositionData).length && formikRef.current) {
      console.log({createdPositionData})
      setLoading(false)
      setOpen("addposition");
      formikRef.current.resetForm();
    }
  },  [createdPositionData?.constructor?.name=="Object" ? Object.keys(createdPositionData).length :""]);



  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };
  const dispatch = useDispatch();
  const handleSubmit = async (values) => {

    setLoading(true)
    dispatch(createPosition({ obj: values }));
  };
  
  const [positionsLoading, setPositionsLoading] = useState(true);

  useEffect(() => {
    dispatch(getPositionList()).then(() => setPositionsLoading(false));
  }, [dispatch]);
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
            <Typography variant="h5" gutterBottom>Add Position</Typography>
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
                        label="position code*"
                        name="position_code"
                        value={values.position_code }
                        onChange={ handleChange}
                        error={touched.position_code  && Boolean(errors.position_code )}
                        helperText={touched.position_code  && errors.position_code }
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="position Name*"
                        name="position_name"
                        value={values.position_name }
                        onChange={handleChange}
                        error={touched.position_name  && Boolean(errors.position_name )}
                        helperText={touched.position_name  && errors.position_name }
                        variant="outlined"
                      />
                    </Grid>
             
                    <Grid item xs={12} md={6}>
                    <TextField
  fullWidth
  select
  label="Select Parent position*"
  name="parent_position"
  value={values.parent_position}
  onChange={handleChange}
  error={touched.parent_position && Boolean(errors.parent_position)}
  helperText={touched.parent_position && errors.parent_position}
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
