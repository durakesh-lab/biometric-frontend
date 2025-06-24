import React, { useEffect, useState } from "react";
import { Grid, Paper, Typography, Box, Snackbar, Alert,  IconButton } from "@mui/material";
import Layout from "../../components/Layout/Layout";
// Dashboard components
import DashboardHeader from "../../components/Dashboard/DashboardHeader";
import DonutChart from "../../components/Dashboard/DonutChart";
import TeamPerformanceChart from "../../components/Dashboard/TeamPerformanceChart";
import EmployeeStatusTable from "../../components/Dashboard/EmployeeStatusTable";
import EventsAndMeetings from "../../components/Dashboard/EventsAndMeetings";
import Birthdays from "../../components/Dashboard/Birthdays";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useSearchParams } from 'next/navigation';
import { getPositionList } from "@/store/authSlice";
import { jwtDecode } from "jwt-decode";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CloseIcon from '@mui/icons-material/Close';
export default function Dashboard() {

  let dispatch=useDispatch()
  const searchParams = useSearchParams();
  const showSuccess = searchParams.get('from') === 'login';
  const pathname = usePathname();
let router=useRouter()
let selector=useSelector((state)=>{return (state.auth)})
let [userdata,setuserdata]=useState({})
let data={}

  const from = searchParams.get('from');
useEffect(()=>{
  dispatch(getPositionList({page:1,page_size:10}))
  setuserdata(jwtDecode(localStorage.getItem("biometric_token")))
  console.log(jwtDecode(localStorage.getItem("biometric_token")),"??????????@@@@@@@")
},[])
const handleCloseSnackbar = (event, reason) => {
  if (reason === 'clickaway') {
    return;
  }
  router.replace(pathname)
};
  return (
    <Layout>
      
      <Box sx={{ 
        display: "flex", 
        flexDirection: "column",
        mt: 1, // Adjust this value based on your AppBar height
        width: '100%'
      }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" fontWeight="bold">
            Dashboard
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Default / Home
          </Typography>
          </Box>
      <Box sx={{ mb: 2 }}>
        {/* TOP ROW: Greeting Card, Quick Stats, Donut Chart */}
        <Grid container spacing={2}>
          {/* Greeting Card (left) */}
          <Grid item xs={12} md={3}>
    <DashboardHeader userdata={userdata} />
  </Grid>

          {/* Quick Stats (middle) */}
          <Grid item xs={12} md={6} lg={6}>
            <Grid container spacing={2} sx={{ height: "100%" }}>
            <Grid item xs={4}>
  <Paper
    elevation={0}
    sx={{
      p: 1, // Reduce padding
      height: "50px", // Reduce height
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Typography variant="h6" gutterBottom sx={{fontFamily:"sans-serif",fontWeight:500, fontSize: "0.7rem", mb: 0.1 }}>
      Total Present
    </Typography>
    <Typography sx={{color:"black"}} variant="h6" color="primary">
      99
    </Typography>
  </Paper>
</Grid>

<Grid item xs={4}>
  <Paper
    elevation={0}
    sx={{
      p: 1,
      color:"color",
      margin: '0px 12px' ,
      height: "50px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Typography variant="h6" gutterBottom sx={{fontFamily:"sans-serif",fontWeight:500,color:"black", fontSize: "0.7rem", mb: 0.1 }}>
      Total Absent
    </Typography>
    <Typography sx={{color:"black"}} variant="h6" color="primary">
      15
    </Typography>
  </Paper>
</Grid>

<Grid item xs={4}>
  <Paper
    elevation={0}
    sx={{
      p: 1,
      height: "50px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      
    }}
  >
    <Typography variant="h6" gutterBottom sx={{fontFamily:"sans-serif",fontWeight:500, fontSize: "0.7rem", mb: 0.1 }}>
      Total On Leave
    </Typography>
    <Typography sx={{color:"black"}} variant="h6" color="primary">
      06
    </Typography>
  </Paper>
</Grid>
                      {/* TEAM PERFORMANCE (Full Width) */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Team Performance
              </Typography>
              <TeamPerformanceChart />
            </Paper>
          </Grid>
        </Grid>
            </Grid>
          </Grid>

          {/* Donut Chart (right) */}
          <Grid item xs={12} md={3}>
    <DonutChart />
  </Grid>
        </Grid>



        {/* BOTTOM ROW: Employee Status, Events, Birthdays */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
  {/* Employee Status (left) - takes full width on mobile, 6/12 on desktop */}
  <Grid item xs={12} md={6}>
    <Paper elevation={0} sx={{ p: 2, height: '60%' }}>
      <EmployeeStatusTable />
    </Paper>
  </Grid>

  {/* Right column - Events and Birthdays */}
  <Grid item xs={12} md={6}>
    <Grid container spacing={2}>
      {/* Events and Meetings - top right */}
      <Grid item xs={12} md={6}>
        <Paper elevation={0} sx={{ p: 2, height: '100%' }}>
          <EventsAndMeetings />
        </Paper>
      </Grid>
      
      {/* Birthdays - bottom right */}
      <Grid item xs={12} md={6}>
        <Paper elevation={0} sx={{ p: 2, height: '100%' }}>
          <Birthdays />
        </Paper>
      </Grid>
    </Grid>
  </Grid>
</Grid>
      </Box>
      {/* {success login} */}
            {/* <Snackbar
              open={showSuccess}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <Alert 
                onClose={handleCloseSnackbar} 
                severity="success"
                variant="filled"
                sx={{ width: '100%' }}
              >
                {"Login Successfully"}
              </Alert>
            </Snackbar> */}



                   <Snackbar
              open={Boolean(showSuccess)}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <Alert 
                icon={ <CheckCircleIcon fontSize="inherit" />}
                onClose={handleCloseSnackbar}
                severity= "success" 
                variant="filled"
                sx={{ 
                  width: '100%',
                  backgroundColor: '#0e9f6e' ,
                  color: 'white',
                  '& .MuiAlert-icon': {
                    color: 'white',
                    alignItems: 'center'
                  }
                }}
                action={
                  <IconButton 
                    size="small" 
                    onClick={handleCloseSnackbar} 
                    style={{ color: 'white' }}
                  >
                    <CloseIcon />
                  </IconButton>
                }
              >
                {"Login Successfully"}
              </Alert>
            </Snackbar>

            </Box>
    </Layout>
  );
}
