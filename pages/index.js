import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import BusinessCenterRoundedIcon from '@mui/icons-material/BusinessCenterRounded';
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import { motion } from 'framer-motion';

const featureItems = [
  {
    icon: SecurityRoundedIcon,
    title: 'Secure access',
    text: 'Protected sign in for your biometric portal.',
  },
  {
    icon: QueryStatsRoundedIcon,
    title: 'Live insights',
    text: 'Track attendance and branch activity in one place.',
  },
  {
    icon: AccessTimeRoundedIcon,
    title: 'Quick workflow',
    text: 'One simple entry point for daily use.',
  },
];

const previewStats = [
  { label: '2FA', value: 'Enabled' },
  { label: 'Branches', value: 'Ready' },
  { label: 'Insights', value: 'Live' },
];

const valueCards = [
  {
    icon: SecurityRoundedIcon,
    title: 'Multi-layer security',
    text: 'Password, biometric access, and 2FA help reduce unauthorized entry and improve accountability.',
  },
  {
    icon: QueryStatsRoundedIcon,
    title: 'Operational visibility',
    text: 'Monitor attendance trends, branch activity, and workforce patterns from one central view.',
  },
  {
    icon: AccessTimeRoundedIcon,
    title: 'Faster daily workflows',
    text: 'Give teams a simple, low-friction path for everyday sign-in and attendance capture.',
  },
  {
    icon: CheckCircleRoundedIcon,
    title: 'Audit-ready records',
    text: 'Maintain a clean operational trail for reporting, review, and compliance checks.',
  },
];

const workflowSteps = [
  {
    step: '01',
    title: 'Authenticate',
    text: 'Users sign in securely with credentials and verification controls.',
  },
  {
    step: '02',
    title: 'Record attendance',
    text: 'Capture attendance events with a clean and consistent flow.',
  },
  {
    step: '03',
    title: 'Review insights',
    text: 'Track activity, identify gaps, and improve workforce planning.',
  },
];

const audienceCards = [
  {
    icon: AdminPanelSettingsRoundedIcon,
    title: 'HR & admin teams',
    text: 'Keep attendance records, user access, and verification flows organized in one place.',
  },
  {
    icon: BusinessCenterRoundedIcon,
    title: 'Operations leaders',
    text: 'Monitor branch activity, employee movement, and day-to-day usage from a central view.',
  },
  {
    icon: FactCheckRoundedIcon,
    title: 'Security & audit',
    text: 'Review sign-in attempts, verification behavior, and control points with confidence.',
  },
  {
    icon: PeopleAltRoundedIcon,
    title: 'Everyday users',
    text: 'Give staff a simple, low-friction login experience they can use quickly every day.',
  },
];

const capabilityChecklist = [
  'Branch-aware attendance records',
  'Secure 2FA verification flow',
  'Role-friendly login experience',
  'Real-time operational visibility',
  'Clean reporting and review trail',
];

export default function Home() {
  const router = useRouter();
  const theme = useTheme();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    setHasToken(Boolean(localStorage.getItem('biometric_token')));
  }, []);

  const primaryLabel = hasToken ? 'Open Dashboard' : 'Sign In';
  const primaryAction = () => {
    router.push(hasToken ? '/dashboard' : '/login');
  };

  return (
    <>
      <Head>
        <title>Biometric Attendance</title>
        <meta
          name="description"
          content="Biometric attendance portal for secure login, attendance tracking, and workforce insights."
        />
      </Head>

      <Box
        component="main"
        sx={{
          minHeight: '100svh',
          position: 'relative',
          overflow: 'hidden',
          background: `
            radial-gradient(circle at top left, ${alpha(theme.palette.primary.main, 0.14)} 0, transparent 28%),
            radial-gradient(circle at 88% 18%, rgba(15, 23, 42, 0.06) 0, transparent 16%),
            linear-gradient(180deg, #F5FBF8 0%, #EDF7F2 100%)
          `,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            backgroundImage: `
              linear-gradient(${alpha(theme.palette.common.white, 0.2)} 1px, transparent 1px),
              linear-gradient(90deg, ${alpha(theme.palette.common.white, 0.15)} 1px, transparent 1px)
            `,
            backgroundSize: '56px 56px',
            opacity: 0.16,
          }}
        />

        <Container
          maxWidth="lg"
          sx={{
            position: 'relative',
            zIndex: 1,
            py: { xs: 2.5, sm: 3.5, md: 4.5 },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              mb: { xs: 3, md: 5 },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  color: theme.palette.primary.main,
                  boxShadow: `0 10px 28px ${alpha(theme.palette.primary.main, 0.12)}`,
                }}
              >
                <FingerprintIcon />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                  Biometric Attendance
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Secure portal for teams and branches
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              onClick={primaryAction}
              endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />}
              sx={{
                px: 2.5,
                py: 1.1,
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 700,
                boxShadow: '0 16px 28px rgba(14, 159, 110, 0.22)',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #0A7C57 100%)`,
                '&:hover': {
                  background: `linear-gradient(135deg, #0B8F64 0%, #0A6F4E 100%)`,
                  boxShadow: '0 18px 32px rgba(14, 159, 110, 0.28)',
                },
              }}
            >
              {primaryLabel}
            </Button>
          </Box>

          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
            <Grid item xs={12} md={5.2}>
              <Stack spacing={3}>
                <Chip
                  label="Biometric-first workforce access"
                  sx={{
                    alignSelf: 'flex-start',
                    px: 0.5,
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    color: theme.palette.primary.main,
                    fontWeight: 700,
                    letterSpacing: '0.01em',
                  }}
                />

                <Box>
                  <Typography
                    component="h1"
                    variant="h2"
                    sx={{
                      fontWeight: 800,
                      letterSpacing: '-0.05em',
                      lineHeight: 1.02,
                      maxWidth: 610,
                    }}
                  >
                    Secure attendance, faster sign-in, and live visibility.
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mt: 2,
                      color: 'text.secondary',
                      lineHeight: 1.75,
                      maxWidth: 560,
                      fontSize: '1.03rem',
                    }}
                  >
                    A polished landing page for biometric login, attendance tracking, branch
                    management, and real-time reporting. Everything starts from one simple portal.
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1.2} sx={{ flexWrap: 'wrap' }}>
                  {['2FA enabled', 'Fingerprint access', 'Live reporting'].map((label) => (
                    <Chip
                      key={label}
                      label={label}
                      variant="outlined"
                      sx={{
                        color: theme.palette.primary.main,
                        borderColor: alpha(theme.palette.primary.main, 0.18),
                        bgcolor: alpha(theme.palette.primary.main, 0.03),
                        fontWeight: 700,
                      }}
                    />
                  ))}
                </Stack>

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1.5}
                  sx={{ alignItems: { xs: 'stretch', sm: 'center' } }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={primaryAction}
                    endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />}
                    sx={{
                      px: 3,
                      py: 1.35,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 700,
                      boxShadow: '0 18px 35px rgba(14, 159, 110, 0.22)',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #0A7C57 100%)`,
                      '&:hover': {
                        background: `linear-gradient(135deg, #0B8F64 0%, #0A6F4E 100%)`,
                        boxShadow: '0 20px 42px rgba(14, 159, 110, 0.28)',
                      },
                    }}
                  >
                    {primaryLabel}
                  </Button>

                  <Button
                    variant="text"
                    onClick={() => router.push('/login')}
                    sx={{
                      px: 1.5,
                      py: 1.35,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.06),
                      },
                    }}
                  >
                    Go to Login
                  </Button>
                </Stack>

                <Grid container spacing={1.5}>
                  {[
                    {
                      label: '2FA',
                      value: 'Secure',
                    },
                    {
                      label: 'Branch',
                      value: 'Ready',
                    },
                    {
                      label: 'Reports',
                      value: 'Live',
                    },
                  ].map((item) => (
                    <Grid item xs={4} key={item.label}>
                      <Box
                        sx={{
                          p: 1.6,
                          borderRadius: 3,
                          backgroundColor: '#FFFFFF',
                          border: '1px solid rgba(15, 23, 42, 0.08)',
                          boxShadow: '0 12px 24px rgba(15, 23, 42, 0.04)',
                        }}
                      >
                        <Typography
                          variant="overline"
                          sx={{
                            display: 'block',
                            color: theme.palette.primary.main,
                            letterSpacing: '0.16em',
                            fontWeight: 700,
                            lineHeight: 1,
                          }}
                        >
                          {item.label}
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ mt: 0.8, fontWeight: 800, letterSpacing: '-0.03em' }}
                        >
                          {item.value}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6.8}>
              <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{ width: '100%' }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: { xs: 4, md: 6 },
                    p: { xs: 2.5, sm: 3, md: 3.5 },
                    background: 'linear-gradient(160deg, #0E9F6E 0%, #0B8F64 44%, #07533F 100%)',
                    color: '#FFFFFF',
                    boxShadow: '0 26px 70px rgba(15, 23, 42, 0.16)',
                    minHeight: { xs: 480, md: 620 },
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      pointerEvents: 'none',
                      background:
                        'radial-gradient(circle at 18% 20%, rgba(255,255,255,0.12) 0, transparent 22%), radial-gradient(circle at 88% 18%, rgba(255,255,255,0.08) 0, transparent 18%), radial-gradient(circle at 70% 78%, rgba(255,255,255,0.08) 0, transparent 22%)',
                    }}
                  />

                  <Stack spacing={2.2} sx={{ position: 'relative', zIndex: 1, height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                          Live portal preview
                        </Typography>
                        <Typography
                          variant="h5"
                          sx={{ fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1 }}
                        >
                          Attendance snapshot
                        </Typography>
                      </Box>

                      <Chip
                        icon={
                          <CheckCircleRoundedIcon sx={{ fontSize: 16, color: '#FFFFFF !important' }} />
                        }
                        label="Active"
                        sx={{
                          color: '#FFFFFF',
                          bgcolor: alpha(theme.palette.common.white, 0.12),
                          border: `1px solid ${alpha(theme.palette.common.white, 0.14)}`,
                          fontWeight: 700,
                          '& .MuiChip-icon': {
                            color: '#FFFFFF',
                          },
                        }}
                      />
                    </Box>

                    <Paper
                      elevation={0}
                      sx={{
                        p: { xs: 2, sm: 2.5 },
                        borderRadius: 4,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        color: theme.palette.text.primary,
                        boxShadow: '0 18px 34px rgba(0, 0, 0, 0.14)',
                      }}
                    >
                      <Grid container spacing={2} alignItems="stretch">
                        <Grid item xs={12} sm={7}>
                          <Box
                            sx={{
                              position: 'relative',
                              overflow: 'hidden',
                              minHeight: { xs: 220, sm: 360 },
                              borderRadius: 4,
                              background:
                                'linear-gradient(135deg, rgba(14, 159, 110, 0.14) 0%, rgba(255,255,255,0.8) 100%)',
                              border: '1px solid rgba(15, 23, 42, 0.08)',
                            }}
                          >
                            <Box
                              component="img"
                              src="/images/biometric-technology-concept-illustration_114360-8724.avif"
                              alt="Biometric illustration"
                              sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                filter: 'saturate(0.92) contrast(1.02)',
                              }}
                            />

                            <Chip
                              label="Biometric verified"
                              sx={{
                                position: 'absolute',
                                left: 16,
                                bottom: 16,
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                                fontWeight: 700,
                                backdropFilter: 'blur(12px)',
                              }}
                            />
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={5}>
                          <Stack spacing={1.2}>
                            {featureItems.map((item) => {
                              const Icon = item.icon;
                              return (
                                <Box
                                  key={item.title}
                                  sx={{
                                    display: 'flex',
                                    gap: 1.4,
                                    p: 1.4,
                                    borderRadius: 3,
                                    backgroundColor: '#F8FBFA',
                                    border: '1px solid rgba(15, 23, 42, 0.08)',
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: 40,
                                      height: 40,
                                      borderRadius: 2,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                      color: theme.palette.primary.main,
                                      flexShrink: 0,
                                    }}
                                  >
                                    <Icon sx={{ fontSize: 20 }} />
                                  </Box>
                                  <Box>
                                    <Typography sx={{ fontWeight: 800, fontSize: '0.96rem' }}>
                                      {item.title}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      sx={{ color: 'text.secondary', lineHeight: 1.45 }}
                                    >
                                      {item.text}
                                    </Typography>
                                  </Box>
                                </Box>
                              );
                            })}
                          </Stack>
                        </Grid>
                      </Grid>
                    </Paper>

                    <Grid container spacing={1.5}>
                      {previewStats.map((stat) => (
                        <Grid item xs={4} key={stat.label}>
                          <Box
                            sx={{
                              p: 1.6,
                              borderRadius: 3,
                              backgroundColor: alpha(theme.palette.common.white, 0.08),
                              border: `1px solid ${alpha(theme.palette.common.white, 0.12)}`,
                              backdropFilter: 'blur(10px)',
                            }}
                          >
                            <Typography
                              variant="overline"
                              sx={{
                                display: 'block',
                                color: alpha(theme.palette.common.white, 0.78),
                                letterSpacing: '0.15em',
                                fontWeight: 700,
                                lineHeight: 1,
                              }}
                            >
                              {stat.label}
                            </Typography>
                            <Typography
                              variant="h6"
                              sx={{ mt: 0.75, fontWeight: 800, letterSpacing: '-0.03em' }}
                            >
                              {stat.value}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Stack>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>

          <Box sx={{ mt: { xs: 4, md: 6 } }}>
            <Stack spacing={1}>
              <Chip
                label="Enterprise ready"
                sx={{
                  alignSelf: 'flex-start',
                  px: 0.5,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  color: theme.palette.primary.main,
                  fontWeight: 700,
                }}
              />
              <Typography
                component="h2"
                variant="h4"
                sx={{
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                  lineHeight: 1.08,
                  maxWidth: 760,
                }}
              >
                Built for industry teams that need security, speed, and clean reporting.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.7,
                  maxWidth: 760,
                }}
              >
                This landing page now reflects a real workforce product: secure login, branch-aware
                attendance, operational visibility, and audit-friendly workflows.
              </Typography>
            </Stack>

            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              {valueCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <Grid item xs={12} sm={6} lg={3} key={card.title}>
                    <motion.div
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.35, delay: index * 0.05 }}
                      style={{ height: '100%' }}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          height: '100%',
                          p: 2.2,
                          borderRadius: 4,
                          backgroundColor: '#FFFFFF',
                          border: '1px solid rgba(15, 23, 42, 0.08)',
                          boxShadow: '0 14px 30px rgba(15, 23, 42, 0.05)',
                        }}
                      >
                        <Box
                          sx={{
                            width: 46,
                            height: 46,
                            mb: 1.8,
                            borderRadius: 2.2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: theme.palette.primary.main,
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          }}
                        >
                          <Icon />
                        </Box>
                        <Typography sx={{ fontWeight: 800, fontSize: '1.02rem', mb: 0.9 }}>
                          {card.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                          {card.text}
                        </Typography>
                      </Paper>
                    </motion.div>
                  </Grid>
                );
              })}
            </Grid>
          </Box>

          <Grid container spacing={2} sx={{ mt: { xs: 1.5, md: 4 } }}>
            <Grid item xs={12} md={5}>
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
                  p: { xs: 2.2, sm: 2.6, md: 3 },
                  borderRadius: 4,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(15, 23, 42, 0.08)',
                  boxShadow: '0 14px 28px rgba(15, 23, 42, 0.05)',
                }}
              >
                <Typography
                  variant="overline"
                  sx={{
                    display: 'block',
                    color: theme.palette.primary.main,
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    mb: 1,
                  }}
                >
                  How it works
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 800, letterSpacing: '-0.04em', mb: 2 }}
                >
                  Simple enough for daily use, strong enough for business operations.
                </Typography>

                <Stack spacing={1.6}>
                  {workflowSteps.map((item) => (
                    <Box
                      key={item.step}
                      sx={{
                        display: 'flex',
                        gap: 1.5,
                        p: 1.5,
                        borderRadius: 3,
                        backgroundColor: '#F8FBFA',
                        border: '1px solid rgba(15, 23, 42, 0.06)',
                      }}
                    >
                      <Box
                        sx={{
                          width: 42,
                          height: 42,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: theme.palette.primary.main,
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          fontWeight: 800,
                          flexShrink: 0,
                        }}
                      >
                        {item.step}
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 800, fontSize: '0.98rem' }}>
                          {item.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.secondary', lineHeight: 1.5 }}
                        >
                          {item.text}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} md={7}>
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
                  p: { xs: 2.2, sm: 2.6, md: 3 },
                  borderRadius: 4,
                  color: '#FFFFFF',
                  background: 'linear-gradient(135deg, #0E9F6E 0%, #0A7C57 100%)',
                  boxShadow: '0 18px 38px rgba(14, 159, 110, 0.2)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    background:
                      'radial-gradient(circle at 85% 20%, rgba(255,255,255,0.14) 0, transparent 16%), radial-gradient(circle at 15% 85%, rgba(255,255,255,0.08) 0, transparent 18%)',
                  }}
                />

                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography
                    variant="overline"
                    sx={{
                      display: 'block',
                      color: alpha(theme.palette.common.white, 0.82),
                      letterSpacing: '0.18em',
                      fontWeight: 700,
                    }}
                  >
                    Why teams choose it
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 800, letterSpacing: '-0.04em', mt: 0.8 }}
                  >
                    One landing page. One system. One source of truth.
                  </Typography>

                  <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
                    {[
                      { title: 'Central control', text: 'Manage branches, users, and access from one place.' },
                      { title: 'Cleaner records', text: 'Reduce manual entry mistakes and duplicate work.' },
                      { title: 'Faster onboarding', text: 'Help new users understand the system in seconds.' },
                      { title: 'Decision support', text: 'Use attendance trends to improve planning.' },
                    ].map((item) => (
                      <Grid item xs={12} sm={6} key={item.title}>
                        <Box
                          sx={{
                            p: 1.8,
                            borderRadius: 3,
                            minHeight: 118,
                            backgroundColor: alpha(theme.palette.common.white, 0.08),
                            border: `1px solid ${alpha(theme.palette.common.white, 0.12)}`,
                            backdropFilter: 'blur(10px)',
                          }}
                        >
                          <Typography sx={{ fontWeight: 800, fontSize: '1rem', mb: 0.7 }}>
                            {item.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: alpha(theme.palette.common.white, 0.88), lineHeight: 1.55 }}
                          >
                            {item.text}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          <Paper
            elevation={0}
            sx={{
              mt: { xs: 3, md: 4 },
              p: { xs: 2.2, sm: 2.8, md: 3 },
              borderRadius: 4,
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              boxShadow: '0 14px 28px rgba(15, 23, 42, 0.05)',
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography
                  variant="overline"
                  sx={{
                    display: 'block',
                    color: theme.palette.primary.main,
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    mb: 1,
                  }}
                >
                  Ready for rollout
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 800, letterSpacing: '-0.04em', mb: 1 }}
                >
                  Start with the login and landing flow, then scale into the dashboard.
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                  The interface is now positioned like an industry-grade product landing page:
                  strong branding, clear value, and direct access into the authenticated experience.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack
                  direction={{ xs: 'column', sm: 'row', md: 'column' }}
                  spacing={1.2}
                  sx={{ alignItems: { xs: 'stretch', sm: 'flex-start', md: 'stretch' } }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={primaryAction}
                    endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />}
                    sx={{
                      py: 1.25,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 700,
                      boxShadow: '0 18px 35px rgba(14, 159, 110, 0.22)',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #0A7C57 100%)`,
                      '&:hover': {
                        background: `linear-gradient(135deg, #0B8F64 0%, #0A6F4E 100%)`,
                        boxShadow: '0 20px 42px rgba(14, 159, 110, 0.28)',
                      },
                    }}
                  >
                    {primaryLabel}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => router.push('/login')}
                    sx={{
                      py: 1.15,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 700,
                      borderColor: alpha(theme.palette.primary.main, 0.25),
                      color: theme.palette.primary.main,
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                      },
                    }}
                  >
                    Open login
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          <Box sx={{ mt: { xs: 4, md: 6 } }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={5}>
                <Paper
                  elevation={0}
                  sx={{
                    height: '100%',
                    p: { xs: 2.2, sm: 2.6, md: 3 },
                    borderRadius: 4,
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                    boxShadow: '0 14px 28px rgba(15, 23, 42, 0.05)',
                  }}
                >
                  <Typography
                    variant="overline"
                    sx={{
                      display: 'block',
                      color: theme.palette.primary.main,
                      fontWeight: 700,
                      letterSpacing: '0.18em',
                      mb: 1,
                    }}
                  >
                    Built for teams
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 800, letterSpacing: '-0.04em', mb: 1.5 }}
                  >
                    One portal for attendance, access, and reporting.
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: 'text.secondary', lineHeight: 1.7, mb: 2 }}
                  >
                    The landing page now communicates the full product story: secure entry,
                    branch-level oversight, and a clear workflow for everyday business use.
                  </Typography>

                  <Stack spacing={1.25}>
                    {capabilityChecklist.map((item) => (
                      <Box
                        key={item}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.1,
                          p: 1.2,
                          borderRadius: 2.5,
                          backgroundColor: '#F8FBFA',
                          border: '1px solid rgba(15, 23, 42, 0.06)',
                        }}
                      >
                        <CheckCircleRoundedIcon
                          sx={{ fontSize: 18, color: theme.palette.primary.main, flexShrink: 0 }}
                        />
                        <Typography sx={{ fontWeight: 600, lineHeight: 1.45 }}>{item}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </Grid>

              <Grid item xs={12} md={7}>
                <Paper
                  elevation={0}
                  sx={{
                    height: '100%',
                    p: { xs: 2.2, sm: 2.6, md: 3 },
                    borderRadius: 4,
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                    boxShadow: '0 14px 28px rgba(15, 23, 42, 0.05)',
                  }}
                >
                  <Typography
                    variant="overline"
                    sx={{
                      display: 'block',
                      color: theme.palette.primary.main,
                      fontWeight: 700,
                      letterSpacing: '0.18em',
                      mb: 1,
                    }}
                  >
                    Who it helps
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 800, letterSpacing: '-0.04em', mb: 2 }}
                  >
                    Designed for real workplace roles and daily operations.
                  </Typography>

                  <Grid container spacing={2}>
                    {audienceCards.map((card, index) => {
                      const Icon = card.icon;
                      return (
                        <Grid item xs={12} sm={6} key={card.title}>
                          <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.32, delay: index * 0.05 }}
                            style={{ height: '100%' }}
                          >
                            <Box
                              sx={{
                                height: '100%',
                                p: 2,
                                borderRadius: 3,
                                backgroundColor: '#F8FBFA',
                                border: '1px solid rgba(15, 23, 42, 0.06)',
                                boxShadow: '0 10px 22px rgba(15, 23, 42, 0.03)',
                              }}
                            >
                              <Box
                                sx={{
                                  width: 44,
                                  height: 44,
                                  mb: 1.5,
                                  borderRadius: 2.2,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: theme.palette.primary.main,
                                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                }}
                              >
                                <Icon />
                              </Box>
                              <Typography sx={{ fontWeight: 800, fontSize: '1rem', mb: 0.8 }}>
                                {card.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: 'text.secondary', lineHeight: 1.55 }}
                              >
                                {card.text}
                              </Typography>
                            </Box>
                          </motion.div>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
}
