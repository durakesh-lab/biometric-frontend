import React, { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';
import Layout from '../../components/Layout/Layout';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CheckIcon from '@mui/icons-material/Check';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import ViewModuleOutlinedIcon from '@mui/icons-material/ViewModuleOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';

const MATRIX_ROWS = [
  {
    label: 'Dashboard',
    description: 'View dashboard · Export stats',
  },
  {
    label: 'Permissions',
    description: 'Manage Permission · Add Permission · Add Sub-Permission · Edit role access',
  },
  {
    label: 'Organization',
    description: 'All Company · Branches · Departments · Create · Edit · Delete',
  },
  {
    label: 'Leaves Management',
    description: 'My Leaves · My Branch Users · Apply leave · Approve / Reject · Manage holidays · Shifts',
  },
  {
    label: 'Manage Users',
    description: 'Manage Group · Assign Group · Create group',
  },
  {
    label: 'Profile Management',
    description: 'My Profile · My Branch Users · Users Profile · Add user · Edit user · Import / Export',
  },
  {
    label: 'Biometric Device',
    description: 'Devices · Attendance · Enrollment · Sync logs · Update device IP',
  },
  {
    label: 'Settings',
    description: 'General Setting · Manage 2FA · Email config',
  },
];

const MATRIX_FEATURES = MATRIX_ROWS.map((row) => row.label);

const ROLE_CARDS = [
  {
    profile_id: 1,
    title: 'Super Admin',
    subtitle: 'Full, unrestricted access',
    assignedUsers: 0,
    icon: WorkspacePremiumOutlinedIcon,
    iconBg: '#F1E8FF',
    iconColor: '#7C3AED',
    badgeBg: '#F3F4F6',
    badgeColor: '#475569',
    chipBg: '#F0E7FF',
    chipColor: '#6D28D9',
    permissions: ['All permissions'],
    access: MATRIX_FEATURES,
    fullAccess: true,
    footerNote: 'Locked - always full access',
  },
  {
    profile_id: 2,
    title: 'HR Admin',
    subtitle: 'People & organization admin',
    assignedUsers: 1,
    icon: BadgeOutlinedIcon,
    iconBg: '#E8F8F1',
    iconColor: '#0E9F6E',
    badgeBg: '#F3F4F6',
    badgeColor: '#475569',
    chipBg: '#E7F7F1',
    chipColor: '#1F7A5A',
    permissions: [
      'Dashboard',
      'Permissions',
      'Organization',
      'Leaves Management',
      'Manage Users',
      'Profile Management',
      'Settings',
    ],
    access: [
      'Dashboard',
      'Permissions',
      'Organization',
      'Leaves Management',
      'Manage Users',
      'Profile Management',
      'Settings',
    ],
    fullAccess: false,
  },
  {
    profile_id: 3,
    title: 'Manager',
    subtitle: 'Branch-scoped management',
    assignedUsers: 1,
    icon: WorkOutlineOutlinedIcon,
    iconBg: '#E8F1FF',
    iconColor: '#3B82F6',
    badgeBg: '#F3F4F6',
    badgeColor: '#475569',
    chipBg: '#E7F7F1',
    chipColor: '#1F7A5A',
    permissions: [
      'Dashboard',
      'Leaves Management',
      'Profile Management',
      'Biometric Device',
    ],
    access: ['Dashboard', 'Leaves Management', 'Profile Management', 'Biometric Device'],
    fullAccess: false,
  },
  {
    profile_id: 4,
    title: 'Employee',
    subtitle: 'Self-service access',
    assignedUsers: 8,
    icon: PersonOutlineOutlinedIcon,
    iconBg: '#FFF3DB',
    iconColor: '#F59E0B',
    badgeBg: '#F3F4F6',
    badgeColor: '#475569',
    chipBg: '#E7F7F1',
    chipColor: '#1F7A5A',
    permissions: ['Dashboard', 'Leaves Management', 'Profile Management'],
    access: ['Dashboard', 'Leaves Management', 'Profile Management'],
    fullAccess: false,
  },
  {
    profile_id: 5,
    title: 'Guest',
    subtitle: 'Limited / read-only',
    assignedUsers: 0,
    icon: PersonOffOutlinedIcon,
    iconBg: '#F0EBFF',
    iconColor: '#6D28D9',
    badgeBg: '#F3F4F6',
    badgeColor: '#475569',
    chipBg: '#E7F7F1',
    chipColor: '#1F7A5A',
    permissions: ['Dashboard'],
    access: ['Dashboard'],
    fullAccess: false,
  },
];

function RoleCard({ role, onEdit }) {
  const RoleIcon = role.icon;

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: 4,
        border: '1px solid #E7EDF3',
        boxShadow: '0 10px 28px rgba(15, 23, 42, 0.05)',
        overflow: 'hidden',
        bgcolor: '#FFFFFF',
      }}
    >
      <CardContent
        sx={{
          height: '100%',
          p: 2.5,
          display: 'flex',
          flexDirection: 'column',
          '&:last-child': { pb: 2.5 },
        }}
      >
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={2}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0 }}>
            <Avatar
              variant="rounded"
              sx={{
                width: 56,
                height: 56,
                borderRadius: 3,
                bgcolor: role.iconBg,
                color: role.iconColor,
                boxShadow: '0 8px 18px rgba(15, 23, 42, 0.06)',
              }}
            >
              <RoleIcon sx={{ fontSize: 30 }} />
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: 20,
                  fontWeight: 800,
                  lineHeight: 1.15,
                  color: '#0F172A',
                }}
              >
                {role.title}
              </Typography>
              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: 13.5,
                  lineHeight: 1.35,
                  color: '#6B7280',
                }}
              >
                {role.subtitle}
              </Typography>
            </Box>
          </Stack>

          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.5,
              minWidth: 68,
              px: 1.25,
              py: 0.75,
              borderRadius: 999,
              bgcolor: role.badgeBg,
              color: role.badgeColor,
              boxShadow: 'inset 0 0 0 1px rgba(148, 163, 184, 0.12)',
            }}
          >
            <Typography sx={{ fontSize: 14, fontWeight: 800, lineHeight: 1 }}>
              {role.assignedUsers}
            </Typography>
            <GroupOutlinedIcon sx={{ fontSize: 18 }} />
          </Box>
        </Stack>

        <Stack direction="row" flexWrap="wrap" useFlexGap gap={1} sx={{ mt: 2.25 }}>
          {role.permissions.map((permission) => (
            <Chip
              key={permission}
              label={permission}
              sx={{
                height: 32,
                borderRadius: 999,
                bgcolor: role.chipBg,
                color: role.chipColor,
                fontWeight: 700,
                fontSize: 12.5,
                '& .MuiChip-label': {
                  px: 1.4,
                },
              }}
            />
          ))}
        </Stack>

        <Divider sx={{ my: 2.5, borderColor: 'rgba(15, 23, 42, 0.08)' }} />

        {role.fullAccess ? (
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 'auto', minHeight: 44 }}>
            <LockOutlinedIcon sx={{ fontSize: 18, color: '#94A3B8' }} />
            <Typography sx={{ fontSize: 14, color: '#64748B', fontWeight: 500 }}>
              {role.footerNote}
            </Typography>
          </Stack>
        ) : (
          <Button
            onClick={() => onEdit(role.profile_id)}
            variant="outlined"
            startIcon={<EditOutlinedIcon sx={{ fontSize: 18, color: '#F97316' }} />}
            sx={{
              mt: 'auto',
              width: 'fit-content',
              minWidth: 136,
              height: 42,
              px: 2,
              borderRadius: 2,
              borderColor: '#8EDFC0',
              color: '#0E9F6E',
              fontSize: 14,
              fontWeight: 800,
              textTransform: 'none',
              bgcolor: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(14, 159, 110, 0.08)',
              '&:hover': {
                borderColor: '#0E9F6E',
                bgcolor: 'rgba(14, 159, 110, 0.04)',
              },
            }}
          >
            Edit access
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function MatrixStatusBox({ checked, locked }) {
  return (
    <Box
      aria-hidden="true"
      sx={{
        width: 22,
        height: 22,
        mx: 'auto',
        borderRadius: '4px',
        border: checked ? '1px solid transparent' : '1.5px solid #C8D0DB',
        bgcolor: checked ? (locked ? '#D5D7DB' : '#16A874') : '#FFFFFF',
        boxShadow: checked
          ? locked
            ? 'inset 0 0 0 1px rgba(255,255,255,0.25)'
            : '0 6px 14px rgba(22, 168, 116, 0.22)'
          : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {checked ? <CheckIcon sx={{ fontSize: 16, color: '#FFFFFF' }} /> : null}
    </Box>
  );
}

function MatrixView({ roles }) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        border: '1px solid #E7EDF3',
        boxShadow: '0 10px 28px rgba(15, 23, 42, 0.05)',
        overflow: 'hidden',
        bgcolor: '#FFFFFF',
      }}
    >
      <Box
        sx={{
          px: { xs: 2, md: 3 },
          py: { xs: 2, md: 2.5 },
          borderBottom: '1px solid #E7EDF3',
          display: 'flex',
          alignItems: 'baseline',
          gap: 1.5,
          flexWrap: 'wrap',
        }}
      >
        <Typography sx={{ fontSize: { xs: 18, md: 20 }, fontWeight: 800, color: '#0F172A' }}>
          Permission Matrix
        </Typography>
        <Typography sx={{ fontSize: { xs: 13.5, md: 15 }, color: '#6B7280', fontWeight: 500 }}>
          tick to grant - saves instantly
        </Typography>
      </Box>

      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 980, tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow
              sx={{
                bgcolor: '#F8FAFC',
                '& .MuiTableCell-root': {
                  py: 2.25,
                  borderBottom: '1px solid #E7EDF3',
                },
              }}
            >
              <TableCell
                sx={{
                  width: '42%',
                  fontWeight: 800,
                  color: '#334155',
                  fontSize: 14,
                }}
              >
                Permission
              </TableCell>

              {roles.map((role) => {
                const RoleIcon = role.icon;

                return (
                  <TableCell
                    key={role.profile_id}
                    align="center"
                    sx={{
                      width: '11.6%',
                      minWidth: 124,
                      fontWeight: 800,
                      color: '#334155',
                    }}
                  >
                    <Stack alignItems="center" spacing={0.75}>
                      <Avatar
                        variant="rounded"
                        sx={{
                          width: 30,
                          height: 30,
                          borderRadius: 2,
                          bgcolor: role.iconBg,
                          color: role.iconColor,
                        }}
                      >
                        <RoleIcon sx={{ fontSize: 16 }} />
                      </Avatar>
                      <Typography sx={{ fontSize: 13.25, fontWeight: 700, color: '#475569' }}>
                        {role.title}
                      </Typography>
                    </Stack>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {MATRIX_ROWS.map((row) => (
              <TableRow
                key={row.label}
                hover
                sx={{
                  '&:last-child td, &:last-child th': { borderBottom: 0 },
                  '&:hover': { bgcolor: '#FBFCFD' },
                  '& .MuiTableCell-root': {
                    py: 2.1,
                    borderBottom: '1px solid #E7EDF3',
                    verticalAlign: 'middle',
                  },
                }}
              >
                <TableCell>
                  <Typography
                    sx={{
                      fontSize: 15.5,
                      lineHeight: 1.25,
                      fontWeight: 800,
                      color: '#111827',
                    }}
                  >
                    {row.label}
                  </Typography>
                  <Typography
                    sx={{
                      mt: 0.45,
                      fontSize: 12.5,
                      lineHeight: 1.45,
                      color: '#6B7280',
                    }}
                  >
                    {row.description}
                  </Typography>
                </TableCell>

                {roles.map((role) => {
                  const hasAccess = role.fullAccess || role.access.includes(row.label);

                  return (
                    <TableCell key={`${role.profile_id}-${row.label}`} align="center">
                      <MatrixStatusBox checked={hasAccess} locked={role.fullAccess} />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

const PermissionPage = () => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState('matrix');
  const [inputPermission, setInputPermission] = useState('');
  const [selectedPermission, setSelectedPermission] = useState('');
  const [showAddPermissionModal, setShowAddPermissionModal] = useState(false);
  const [showAddSubPermissionModal, setShowAddSubPermissionModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [permissions, setPermissions] = useState([]);

  const showSnackbar = useCallback((message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  }, []);

  const fetchPermissions = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/permissions`);
      setPermissions(Array.isArray(response.data) ? response.data : []);
    } catch (fetchError) {
      showSnackbar('Failed to fetch permissions', 'error');
    }
  }, [showSnackbar]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleOpenAddPermission = () => {
    setInputPermission('');
    setError(false);
    setShowAddPermissionModal(true);
  };

  const handleOpenAddSubPermission = () => {
    setInputPermission('');
    setSelectedPermission('');
    setError(false);
    setShowAddSubPermissionModal(true);
  };

  const handleCloseAddPermission = () => {
    setShowAddPermissionModal(false);
    setError(false);
  };

  const handleCloseAddSubPermission = () => {
    setShowAddSubPermissionModal(false);
    setError(false);
  };

  const handleAddPermission = async () => {
    const nextPermission = inputPermission.trim();

    if (!nextPermission) {
      setError(true);
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/permissions`, {
        title: nextPermission,
      });
      await fetchPermissions();
      setInputPermission('');
      setShowAddPermissionModal(false);
      showSnackbar('Permission added successfully', 'success');
    } catch (addError) {
      showSnackbar('Failed to add permission', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubPermission = async () => {
    const nextSubPermission = inputPermission.trim();

    if (!nextSubPermission || !selectedPermission) {
      setError(true);
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/permissions/sub`, {
        title: nextSubPermission,
        parentPermission: selectedPermission,
      });
      await fetchPermissions();
      setInputPermission('');
      setSelectedPermission('');
      setShowAddSubPermissionModal(false);
      showSnackbar('Sub-permission added successfully', 'success');
    } catch (addError) {
      showSnackbar('Failed to add sub-permission', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditRole = (profileId) => {
    router.push(`/permission/editpermissions/${profileId}`);
  };

  const roleCount = ROLE_CARDS.length;
  const permissionCount = MATRIX_ROWS.length;
  const subPermissionCount = permissions.length
    ? permissions.reduce((count, permission) => {
        const subPermissions = permission.subPermissions || permission.sub_permission || [];
        return count + subPermissions.length;
      }, 0)
    : 35;

  return (
    <Layout>
      <Head>
        <title>Roles and Permissions</title>
      </Head>

      <Box sx={{ width: '100%' }}>
        <Box sx={{ mx: 'auto', width: '100%', maxWidth: 1560 }}>
          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            alignItems={{ xs: 'flex-start', lg: 'center' }}
            justifyContent="space-between"
            gap={2}
            sx={{ mb: 2.5 }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: 28, md: 40 },
                  lineHeight: 1.05,
                  letterSpacing: '-0.03em',
                  fontWeight: 800,
                  color: '#111827',
                }}
              >
                Roles & Permissions
              </Typography>

              <Stack direction="row" flexWrap="wrap" gap={1.25} sx={{ mt: 2 }}>
                <Chip
                  label={`${roleCount} roles`}
                  sx={{
                    height: 34,
                    px: 0.5,
                    borderRadius: 999,
                    bgcolor: '#EEF2F7',
                    color: '#4B5563',
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                />
                <Chip
                  label={`${permissionCount} permissions`}
                  sx={{
                    height: 34,
                    px: 0.5,
                    borderRadius: 999,
                    bgcolor: '#E4F6EE',
                    color: '#1E8B60',
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                />
                <Chip
                  label={`${subPermissionCount} sub-permissions`}
                  sx={{
                    height: 34,
                    px: 0.5,
                    borderRadius: 999,
                    bgcolor: '#E7F0FF',
                    color: '#3B82F6',
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                />
              </Stack>
            </Box>

            <Box
              sx={{
                display: 'inline-flex',
                p: 0.5,
                borderRadius: 2,
                border: '1px solid #E5E7EB',
                bgcolor: '#FFFFFF',
                boxShadow: '0 8px 20px rgba(15, 23, 42, 0.05)',
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              <Button
                onClick={() => setViewMode('cards')}
                startIcon={<ViewModuleOutlinedIcon sx={{ fontSize: 18 }} />}
                sx={{
                  flex: 1,
                  minWidth: 120,
                  px: 2.5,
                  py: 1.1,
                  borderRadius: 1.5,
                  color: viewMode === 'cards' ? '#FFFFFF' : '#475569',
                  bgcolor: viewMode === 'cards' ? '#18A36E' : 'transparent',
                  boxShadow: viewMode === 'cards' ? '0 10px 24px rgba(24, 163, 110, 0.22)' : 'none',
                  fontWeight: 800,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: viewMode === 'cards' ? '#15915F' : 'rgba(15, 23, 42, 0.04)',
                  },
                }}
              >
                Cards
              </Button>
              <Button
                onClick={() => setViewMode('matrix')}
                startIcon={<TableChartOutlinedIcon sx={{ fontSize: 18 }} />}
                sx={{
                  flex: 1,
                  minWidth: 120,
                  px: 2.5,
                  py: 1.1,
                  borderRadius: 1.5,
                  color: viewMode === 'matrix' ? '#FFFFFF' : '#475569',
                  bgcolor: viewMode === 'matrix' ? '#18A36E' : 'transparent',
                  boxShadow: viewMode === 'matrix' ? '0 10px 24px rgba(24, 163, 110, 0.22)' : 'none',
                  fontWeight: 800,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: viewMode === 'matrix' ? '#15915F' : 'rgba(15, 23, 42, 0.04)',
                  },
                }}
              >
                Matrix
              </Button>
            </Box>
          </Stack>

          <Box
            sx={{
              display: 'flex',
              alignItems: { xs: 'flex-start', md: 'center' },
              gap: 1.5,
              p: { xs: 2, md: 2.25 },
              borderRadius: 3,
              border: '1px solid #CBEBD9',
              bgcolor: '#EFFAF4',
              color: '#2F6E5C',
              boxShadow: '0 8px 20px rgba(15, 23, 42, 0.03)',
            }}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#DDF4E9',
                flexShrink: 0,
              }}
            >
              <InfoOutlinedIcon sx={{ fontSize: 20, color: '#1D9A69' }} />
            </Box>

            <Typography
              component="div"
              sx={{
                fontSize: { xs: 13.5, md: 14 },
                lineHeight: 1.65,
                color: '#2B6C5A',
                fontWeight: 500,
              }}
            >
              <Box component="span" sx={{ fontWeight: 800 }}>
                Permissions
              </Box>{' '}
              = the app&apos;s fixed menu sections and their actions (defined by developers).
              Roles are the <Box component="span" sx={{ fontWeight: 800 }}>fixed set</Box> (Super
              Admin to Guest). Admins only <Box component="span" sx={{ fontWeight: 800 }}>
                assign access
              </Box>{' '}
              here - pick a role, edit access, and tick a whole section or individual actions.
            </Typography>
          </Box>

          <Box sx={{ mt: 2.5 }}>
            {viewMode === 'cards' ? (
              <Grid container spacing={3}>
                {ROLE_CARDS.map((role) => (
                  <Grid item xs={12} md={6} lg={4} key={role.profile_id}>
                    <RoleCard role={role} onEdit={handleEditRole} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <MatrixView roles={ROLE_CARDS} />
            )}
          </Box>

          <Stack direction="row" gap={1.5} sx={{ mt: 2.75, flexWrap: 'wrap' }}>
            <Button
              onClick={handleOpenAddPermission}
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{
                minWidth: 170,
                height: 56,
                px: 2.5,
                borderRadius: 2,
                borderColor: '#8EDFC0',
                color: '#0E9F6E',
                bgcolor: '#FFFFFF',
                boxShadow: '0 6px 18px rgba(14, 159, 110, 0.06)',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                '&:hover': {
                  borderColor: '#0E9F6E',
                  bgcolor: 'rgba(14, 159, 110, 0.04)',
                },
              }}
            >
              Add Permission
            </Button>

            <Button
              onClick={handleOpenAddSubPermission}
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{
                minWidth: 200,
                height: 56,
                px: 2.5,
                borderRadius: 2,
                borderColor: '#8EDFC0',
                color: '#0E9F6E',
                bgcolor: '#FFFFFF',
                boxShadow: '0 6px 18px rgba(14, 159, 110, 0.06)',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                '&:hover': {
                  borderColor: '#0E9F6E',
                  bgcolor: 'rgba(14, 159, 110, 0.04)',
                },
              }}
            >
              Add Sub-Permission
            </Button>

            <Button
              variant="outlined"
              href="/admin/add_role"
              startIcon={<AddIcon />}
              sx={{
                minWidth: 150,
                height: 56,
                px: 2.5,
                borderRadius: 2,
                borderColor: '#8EDFC0',
                color: '#0E9F6E',
                bgcolor: '#FFFFFF',
                boxShadow: '0 6px 18px rgba(14, 159, 110, 0.06)',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                '&:hover': {
                  borderColor: '#0E9F6E',
                  bgcolor: 'rgba(14, 159, 110, 0.04)',
                },
              }}
            >
              Add Profile
            </Button>
          </Stack>
        </Box>
      </Box>

      <Dialog
        open={showAddPermissionModal}
        onClose={handleCloseAddPermission}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 4,
          },
        }}
      >
        <DialogTitle sx={{ px: 3, pt: 3, pb: 1, fontWeight: 800, color: '#0F172A' }}>
          Add Permission
        </DialogTitle>
        <DialogContent sx={{ px: 3, pb: 2 }}>
          <TextField
            fullWidth
            label="Permission title"
            value={inputPermission}
            onChange={(e) => setInputPermission(e.target.value)}
            error={error && !inputPermission.trim()}
            helperText={error && !inputPermission.trim() ? 'This field is required' : ''}
            sx={{ mt: 1.5 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseAddPermission} sx={{ textTransform: 'none', fontWeight: 700 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddPermission}
            disabled={loading}
            sx={{
              minWidth: 110,
              textTransform: 'none',
              fontWeight: 800,
              bgcolor: '#0E9F6E',
              '&:hover': { bgcolor: '#0B875D' },
            }}
          >
            {loading ? <CircularProgress size={18} color="inherit" /> : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showAddSubPermissionModal}
        onClose={handleCloseAddSubPermission}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 4,
          },
        }}
      >
        <DialogTitle sx={{ px: 3, pt: 3, pb: 1, fontWeight: 800, color: '#0F172A' }}>
          Add Sub-Permission
        </DialogTitle>
        <DialogContent sx={{ px: 3, pb: 2 }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Sub-permission title"
              value={inputPermission}
              onChange={(e) => setInputPermission(e.target.value)}
              error={error && !inputPermission.trim()}
              helperText={error && !inputPermission.trim() ? 'This field is required' : ''}
              sx={{ mt: 1 }}
            />

            <FormControl fullWidth error={error && !selectedPermission}>
              <InputLabel id="parent-permission-label">Parent Permission</InputLabel>
              <Select
                labelId="parent-permission-label"
                value={selectedPermission}
                onChange={(e) => setSelectedPermission(e.target.value)}
                label="Parent Permission"
              >
                <MenuItem value="">Select permission</MenuItem>
                {permissions.map((permission) => (
                  <MenuItem
                    key={permission._id || permission.id || permission.title}
                    value={permission._id || permission.id || permission.title}
                  >
                    {permission.title || permission.name || 'Untitled permission'}
                  </MenuItem>
                ))}
              </Select>
              {error && !selectedPermission && (
                <Typography variant="caption" sx={{ mt: 0.75, color: 'error.main' }}>
                  This field is required
                </Typography>
              )}
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseAddSubPermission} sx={{ textTransform: 'none', fontWeight: 700 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddSubPermission}
            disabled={loading}
            sx={{
              minWidth: 110,
              textTransform: 'none',
              fontWeight: 800,
              bgcolor: '#0E9F6E',
              '&:hover': { bgcolor: '#0B875D' },
            }}
          >
            {loading ? <CircularProgress size={18} color="inherit" /> : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default PermissionPage;
