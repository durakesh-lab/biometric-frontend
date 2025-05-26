import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../src/store/authSlice';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Link,
  Grid,
  Avatar,
  Fade,
  Slide,
  Grow,
  Zoom,
  Snackbar,
  Alert
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import LoadingButtons from '../../components/login/signin_loading';

export default function Login() {
  const dispatch = useDispatch();
  const { loading, errorlogin, token } = useSelector((state) => state.auth);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeText, setActiveText] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const heroTexts = [
    "Precision Attendance Tracking",
    "Seamless Biometric Integration",
    "Real-time Attendance Analytics",
    "Automated Workforce Management"
  ];
  // Show snackbar when error occurs
  useEffect(() => {
    if (errorlogin) {
      setOpenSnackbar(true);
    }
  }, [errorlogin]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  // Rotate hero texts
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveText((prev) => (prev + 1) % heroTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Redirect to dashboard if token exists in localStorage
  useEffect(() => {
    if (localStorage.getItem("token")) {
      // router.push({
      //   pathname: '/dashboard',
      //   query: { from: "login" }
      // });
    }
  }, []);
  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  // Store token and redirect after successful login
  useEffect(() => {
    if (token?.access_token) {
      localStorage.setItem("token", token.access_token);
      router.push({
        pathname: '/dashboard',
        query: { from: "login" }
      });
    }
  }, [token]);

  return (
    <Grid container component="main" sx={{ height: '100vh', overflow: 'hidden' }}>
      {/* Left Section - Hero Image with Animated Text */}
      <Grid
        item
        xs={false}
        sm={6}
        md={7}
        sx={{
          position: 'relative',
          display: { xs: 'none', sm: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'primary.main',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
            zIndex: 1
          }}
        />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: 2
          }}
        >
          <img
            src="/images/biometric-technology-concept-illustration_114360-8724.avif"
            alt="Biometric Technology"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.15
            }}
          />
        </motion.div>
        
        <Box
          sx={{
            position: 'relative',
            zIndex: 3,
            textAlign: 'center',
            px: 4,
            color: 'common.white'
          }}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <FingerprintIcon sx={{ fontSize: 80, mb: 2 }} />
          </motion.div>
          
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
              Biometric Attendance
            </Typography>
          </motion.div>
          
          <Box sx={{ height: 80, position: 'relative' }}>
            {heroTexts.map((text, index) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: index === activeText ? 1 : 0,
                  y: index === activeText ? 0 : 20
                }}
                transition={{ duration: 0.5 }}
                style={{
                  position: 'absolute',
                  width: '100%',
                  left: 0
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 400 }}>
                  {text}
                </Typography>
              </motion.div>
            ))}
          </Box>
        </Box>
      </Grid>

      {/* Right Section - Login Form */}
      <Grid
        item
        xs={12}
        sm={6}
        md={5}
        component={Paper}
        elevation={6}
        square
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: (theme) => theme.palette.grey[50]
        }}
      >
        <Zoom in={true} style={{ transitionDelay: '300ms' }}>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              maxWidth: 400
            }}
          >
            <Avatar 
              sx={{ 
                m: 1, 
                bgcolor: 'primary.main',
                width: 56,
                height: 56
              }}
            >
              <LockOutlinedIcon fontSize="medium" />
            </Avatar>
            
            <Typography 
              component="h1" 
              variant="h4" 
              sx={{ 
                mb: 3, 
                fontWeight: 700,
                color: (theme) => theme.palette.primary.main
              }}
            >
              Welcome Back
            </Typography>
            
            <Box 
              component="form" 
              onSubmit={handleLogin} 
              sx={{ 
                width: '100%',
                mt: 3
              }}
            >
              <Fade in={true} style={{ transitionDelay: '400ms' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Fade>
              
              <Fade in={true} style={{ transitionDelay: '500ms' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  variant="outlined"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Fade>
              
              {/* <Fade in={true} style={{ transitionDelay: '600ms' }}> */}
             {!loading  ?  <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ 
                    mt: 3, 
                    mb: 2, 
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '1rem',
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: 'none'
                    }
                  }}
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
               
                </Button>
             :
                <LoadingButtons loading={loading} /> }
              {/* </Fade> */}
              
              

              {/* <Slide direction="up" in={true} style={{ transitionDelay: '700ms' }}>
                <Grid container justifyContent="center" sx={{ mt: 2 }}>
                  <Grid item>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Don't have an account?{' '}
                      <Link 
                        href="/register" 
                        sx={{ 
                          fontWeight: 600,
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        Sign Up
                      </Link>
                    </Typography>
                  </Grid>
                </Grid>
              </Slide> */}
            </Box>
          </Box>
        </Zoom>
      </Grid>

      {/* Error Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {errorlogin}
        </Alert>
      </Snackbar>
    </Grid>
  );
}