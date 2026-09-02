import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useRouter } from 'next/router';
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { loginUser } from '../../src/store/authSlice';

const heroFeatures = [
  {
    icon: FingerprintIcon,
    title: 'Fast sign-in',
    description: 'Quick access for daily attendance tasks.',
  },
  {
    icon: LockOutlinedIcon,
    title: '2FA ready',
    description: 'Extra protection for staff accounts.',
  },
];

export default function Login() {
  const dispatch = useDispatch();
  const { loading, errorlogin, token, twoFactorError } = useSelector((state) => state.auth);
  const router = useRouter();
  const theme = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const isTwoFactorStep = Boolean(token?.multifactorauth);
  const snackbarMessage = localError || errorlogin || twoFactorError || '';

  useEffect(() => {
    if (errorlogin || twoFactorError || localError) {
      setOpenSnackbar(true);
    }
  }, [errorlogin, twoFactorError, localError]);

  useEffect(() => {
    if (token?.access_token && !token?.multifactorauth) {
      localStorage.setItem('biometric_token', token.access_token);
      if (token?.refresh_token) {
        localStorage.setItem('biometric_refresh_token', token.refresh_token);
      }
      router.push({
        pathname: '/dashboard',
        query: { from: 'login' },
      });
    }
  }, [token, router]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const root = document.documentElement;
    const body = document.body;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousRootHeight = root.style.height;
    const previousBodyHeight = body.style.height;

    root.style.overflow = 'hidden';
    root.style.height = '100%';
    body.style.overflow = 'hidden';
    body.style.height = '100%';

    return () => {
      root.style.overflow = previousRootOverflow;
      root.style.height = previousRootHeight;
      body.style.overflow = previousBodyOverflow;
      body.style.height = previousBodyHeight;
    };
  }, []);

  const handleCloseSnackbar = (_event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLocalError('');
    dispatch(loginUser({ email, password }));
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!token?.multifactorauth) {
      setLocalError('Please sign in again to request a verification code.');
      return;
    }

    setTwoFactorLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verifycode`,
        { username: email, password, code }
      );

      const verification = response.data;

      if (verification?.status && verification?.access_token) {
        localStorage.setItem('biometric_token', verification.access_token);
        if (verification?.refresh_token) {
          localStorage.setItem('biometric_refresh_token', verification.refresh_token);
        }
        router.push({
          pathname: '/dashboard',
          query: { from: 'login' },
        });
        return;
      }

      throw new Error(verification?.message || 'Verification failed. Please try again.');
    } catch (error) {
      setLocalError(
        error?.response?.data?.message ||
          error?.message ||
          'Unable to verify the code. Please try again.'
      );
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const handleResendCode = () => {
    if (!email || !password) {
      setLocalError('Enter your email and password first to resend the code.');
      return;
    }

    setLocalError('');
    dispatch(loginUser({ email, password }));
  };

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 3,
      backgroundColor: '#F8FBFA',
      transition: 'all 0.2s ease',
      '& fieldset': {
        borderColor: 'rgba(15, 23, 42, 0.12)',
      },
      '&:hover fieldset': {
        borderColor: alpha(theme.palette.primary.main, 0.35),
      },
      '&.Mui-focused': {
        backgroundColor: '#FFFFFF',
        boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.08)}`,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main,
        borderWidth: 1.5,
      },
    },
    '& .MuiInputLabel-root': {
      color: theme.palette.text.secondary,
    },
  };

  const codeFieldSx = {
    ...fieldSx,
    '& .MuiOutlinedInput-input': {
      textAlign: 'center',
      letterSpacing: '0.3em',
      fontSize: '1.1rem',
      fontWeight: 700,
    },
  };

  const buttonSx = {
    py: 1.35,
    borderRadius: 3,
    fontSize: '1rem',
    fontWeight: 700,
    textTransform: 'none',
    color: '#FFFFFF',
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #0A7C57 100%)`,
    boxShadow: '0 18px 35px rgba(14, 159, 110, 0.22)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      background: `linear-gradient(135deg, #0B8F64 0%, #0A6F4E 100%)`,
      boxShadow: '0 20px 42px rgba(14, 159, 110, 0.28)',
      transform: 'translateY(-1px)',
    },
    '&.Mui-disabled': {
      color: 'rgba(255, 255, 255, 0.88)',
      background: alpha(theme.palette.primary.main, 0.65),
    },
  };

  return (
    <Box
      component="main"
      sx={{
        position: 'relative',
        minHeight: '100svh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, sm: 3 },
        py: { xs: 2, sm: 3 },
        background: `
          radial-gradient(circle at top left, ${alpha(theme.palette.primary.main, 0.12)} 0, transparent 30%),
          radial-gradient(circle at 85% 15%, rgba(15, 23, 42, 0.05) 0, transparent 16%),
          linear-gradient(180deg, #F5FBF8 0%, #EDF7F2 100%)
        `,
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        '&::-webkit-scrollbar': {
          width: 0,
          height: 0,
          display: 'none',
        },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 1060,
          overflow: 'hidden',
          borderRadius: { xs: 4, md: 6 },
          border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
          boxShadow: '0 24px 70px rgba(15, 23, 42, 0.1)',
          backgroundColor: '#FFFFFF',
        }}
      >
        <Grid container sx={{ minHeight: { md: 560 } }}>
          <Grid
            item
            xs={12}
            md={5}
            sx={{
              display: { xs: 'none', md: 'flex' },
              position: 'relative',
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: 5,
              color: '#FFFFFF',
              background: 'linear-gradient(160deg, #0E9F6E 0%, #0B8F64 46%, #09614A 100%)',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                background:
                  'radial-gradient(circle at 18% 20%, rgba(255,255,255,0.12) 0, transparent 22%), radial-gradient(circle at 88% 18%, rgba(255,255,255,0.08) 0, transparent 18%), radial-gradient(circle at 72% 76%, rgba(255,255,255,0.08) 0, transparent 22%)',
              }}
            />

            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: alpha(theme.palette.common.white, 0.14),
                    color: '#FFFFFF',
                    boxShadow: '0 18px 30px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <FingerprintIcon />
                </Avatar>
                <Box>
                  <Typography
                    variant="overline"
                    sx={{
                      display: 'block',
                      color: alpha(theme.palette.common.white, 0.8),
                      letterSpacing: '0.2em',
                      lineHeight: 1.2,
                    }}
                  >
                    Secure Portal
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      letterSpacing: '-0.04em',
                      lineHeight: 1.1,
                    }}
                  >
                    Biometric Attendance
                  </Typography>
                </Box>
              </Box>

              <Typography
                sx={{
                  mt: 2.5,
                  maxWidth: 330,
                  color: alpha(theme.palette.common.white, 0.9),
                  fontSize: '1rem',
                  lineHeight: 1.75,
                }}
              >
                Fast, secure sign in for attendance and workforce access.
              </Typography>
            </Box>

            <Stack spacing={1.2} sx={{ position: 'relative', zIndex: 1 }}>
              {heroFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Box
                    key={feature.title}
                    sx={{
                      display: 'flex',
                      gap: 1.5,
                      p: 1.5,
                      borderRadius: 3,
                      backgroundColor: alpha(theme.palette.common.white, 0.09),
                      border: `1px solid ${alpha(theme.palette.common.white, 0.12)}`,
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: 2.25,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: alpha(theme.palette.common.white, 0.12),
                        flexShrink: 0,
                      }}
                    >
                      <Icon sx={{ fontSize: 20, color: '#FFFFFF' }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.98rem' }}>
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: alpha(theme.palette.common.white, 0.82), lineHeight: 1.5 }}
                      >
                        {feature.description}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </Grid>

          <Grid
            item
            xs={12}
            md={7}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: { xs: 2.5, sm: 4, md: 6 },
              py: { xs: 3.5, sm: 4.5, md: 5 },
              background: 'linear-gradient(180deg, #FFFFFF 0%, #FBFCFB 100%)',
            }}
          >
            <Box sx={{ width: '100%', maxWidth: 460 }}>
              <Box
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  alignItems: 'center',
                  gap: 1.5,
                  mb: 3,
                }}
              >
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                    color: theme.palette.primary.main,
                  }}
                >
                  <FingerprintIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                    Biometric Attendance
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Secure portal sign in
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 3 }}>
                <Box>
                  <Typography
                    component="h1"
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      letterSpacing: '-0.04em',
                    }}
                  >
                    {isTwoFactorStep ? 'Verify Code' : 'Welcome Back'}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      color: 'text.secondary',
                      lineHeight: 1.6,
                    }}
                  >
                    {isTwoFactorStep
                      ? 'Enter the 6-digit code sent to your email.'
                      : 'Sign in to continue.'}
                  </Typography>
                </Box>

                <Avatar
                  sx={{
                    width: 50,
                    height: 50,
                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                    color: theme.palette.primary.main,
                  }}
                >
                  <LockOutlinedIcon />
                </Avatar>
              </Box>

              <Box component="form" onSubmit={isTwoFactorStep ? handleVerifyCode : handleLogin}>
                <Stack spacing={2}>
                  {!isTwoFactorStep ? (
                    <>
                      <TextField
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={fieldSx}
                      />

                      <TextField
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={fieldSx}
                      />
                    </>
                  ) : (
                    <>
                      <TextField
                        required
                        fullWidth
                        id="verificationCode"
                        label="Verification Code"
                        name="verificationCode"
                        autoFocus
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        inputProps={{
                          maxLength: 6,
                          inputMode: 'numeric',
                          pattern: '[0-9]*',
                          autoComplete: 'one-time-code',
                        }}
                        sx={codeFieldSx}
                      />

                      <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                        Check your email and enter the code to continue.
                      </Typography>
                    </>
                  )}

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    endIcon={
                      !loading && !twoFactorLoading ? <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} /> : undefined
                    }
                    sx={buttonSx}
                    disabled={loading || twoFactorLoading}
                  >
                    {loading || twoFactorLoading ? (
                      <>
                        <CircularProgress size={22} color="inherit" sx={{ mr: 1 }} />
                        {isTwoFactorStep ? 'Verifying...' : 'Signing In...'}
                      </>
                    ) : isTwoFactorStep ? (
                      'Verify Code'
                    ) : (
                      'Sign In'
                    )}
                  </Button>

                  {isTwoFactorStep && (
                    <Button
                      type="button"
                      variant="text"
                      onClick={handleResendCode}
                      disabled={loading || twoFactorLoading}
                      sx={{
                        alignSelf: 'center',
                        textTransform: 'none',
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.06),
                        },
                      }}
                    >
                      Resend code
                    </Button>
                  )}
                </Stack>
              </Box>

              <Typography
                variant="caption"
                sx={{
                  mt: 2.25,
                  display: 'block',
                  color: 'text.secondary',
                }}
              >
                Authorized access only.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          variant="filled"
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
