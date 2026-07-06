import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';
import Layout from '../../../components/Layout/Layout';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  Divider,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CloseIcon from '@mui/icons-material/Close';

const SECTION_ORDER = [
  'Dashboard',
  'Permissions',
  'Organization',
  'Leaves Management',
  'Manage Users',
  'Profile Management',
  'Biometric Device',
  'Settings',
];

const titleCase = (value = '') =>
  value
    .toString()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

const normalizePermissionSections = (apiData = []) => {
  const sections = apiData.map((item) => {
    const rawSubPermissions = Array.isArray(item?.subPermissions)
      ? item.subPermissions
      : Array.isArray(item?.sub_permission)
        ? item.sub_permission
        : [];

    return {
      id: String(item?._id ?? item?.id ?? item?.title ?? ''),
      label: titleCase(item?.title ?? item?.keyword ?? 'Untitled'),
      subPermissions: rawSubPermissions.map((sub) => ({
        id: String(sub?._id ?? sub?.sub_id ?? sub?.id ?? sub?.title ?? ''),
        label: titleCase(sub?.title ?? sub?.keyword ?? 'Untitled'),
      })),
    };
  });

  return sections.sort((a, b) => {
    const aIndex = SECTION_ORDER.indexOf(a.label);
    const bIndex = SECTION_ORDER.indexOf(b.label);

    if (aIndex !== -1 || bIndex !== -1) {
      const safeA = aIndex === -1 ? SECTION_ORDER.length : aIndex;
      const safeB = bIndex === -1 ? SECTION_ORDER.length : bIndex;
      return safeA - safeB || a.label.localeCompare(b.label);
    }

    return a.label.localeCompare(b.label);
  });
};

function PermissionGroupCard({
  section,
  isPermissionChecked,
  isSubPermissionChecked,
  onTogglePermission,
  onToggleSubPermission,
}) {
  const actionCount = section.subPermissions.length;

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: '1px solid #E5EAF1',
        overflow: 'hidden',
        bgcolor: '#FFFFFF',
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
      }}
    >
      <Box
        sx={{
          px: { xs: 2, md: 2.5 },
          py: 1.75,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          bgcolor: '#F7F8FC',
          borderBottom: '1px solid #E5EAF1',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.25} sx={{ minWidth: 0 }}>
          <Checkbox
            checked={isPermissionChecked(section.id)}
            onChange={() => onTogglePermission(section.id)}
            sx={{
              p: 0.4,
              color: '#CBD5E1',
              '&.Mui-checked': {
                color: '#16A874',
              },
            }}
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: 15,
                fontWeight: 800,
                color: '#111827',
                lineHeight: 1.2,
              }}
            >
              {section.label}
            </Typography>
          </Box>
        </Stack>

        <Typography
          sx={{
            fontSize: 12.5,
            color: '#94A3B8',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          {actionCount} action(s)
        </Typography>
      </Box>

      <Box sx={{ bgcolor: '#FFFFFF' }}>
        {section.subPermissions.length > 0 ? (
          section.subPermissions.map((subPermission, index) => (
            <Box
              key={subPermission.id}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1.25,
                px: { xs: 2.5, md: 3 },
                py: 1.05,
                borderTop: index === 0 ? 'none' : '1px solid #F1F5F9',
              }}
            >
              <Checkbox
                checked={isSubPermissionChecked(subPermission.id)}
                onChange={() => onToggleSubPermission(subPermission.id)}
                sx={{
                  p: 0.4,
                  color: '#CBD5E1',
                  '&.Mui-checked': {
                    color: '#16A874',
                  },
                }}
              />
              <Typography
                sx={{
                  mt: 0.55,
                  fontSize: 14,
                  color: '#475569',
                  fontWeight: 500,
                  lineHeight: 1.35,
                }}
              >
                {subPermission.label}
              </Typography>
            </Box>
          ))
        ) : (
          <Box sx={{ px: 3, py: 2 }}>
            <Typography sx={{ fontSize: 13.5, color: '#94A3B8' }}>
              No sub permissions configured
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}

const AdminAddEditPermission = () => {
  const router = useRouter();
  const { profile_id } = router.query;

  const [title, setTitle] = useState('');
  const [permissionSections, setPermissionSections] = useState([]);
  const [permission, setPermission] = useState([]);
  const [subPermission, setSubPermission] = useState([]);
  const [sectionsLoading, setSectionsLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const showSnackbar = useCallback((message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  }, []);

  const fetchPermissionSections = useCallback(async () => {
    setSectionsLoading(true);
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/permissions`);
      setPermissionSections(normalizePermissionSections(Array.isArray(data) ? data : []));
    } catch (error) {
      setPermissionSections([]);
      showSnackbar('Failed to fetch permissions', 'error');
    } finally {
      setSectionsLoading(false);
    }
  }, [showSnackbar]);

  const fetchRoleDetails = useCallback(async () => {
    if (!profile_id) return;

    setRoleLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/permissions/findpermissionsbyrole/${profile_id}`
      );
      const role = response.data?.[0];

      if (!role) {
        throw new Error('Role not found');
      }

      const parsedPermissions =
        typeof role.permAndSubPerm === 'string'
          ? JSON.parse(role.permAndSubPerm)
          : role.permAndSubPerm || {};

      setTitle(role.role || '');
      setPermission((parsedPermissions.permission || []).map(String));
      setSubPermission((parsedPermissions.sub_permission || []).map(String));
    } catch (error) {
      showSnackbar('Failed to fetch role details', 'error');
    } finally {
      setRoleLoading(false);
    }
  }, [profile_id, showSnackbar]);

  useEffect(() => {
    void fetchPermissionSections();
  }, [fetchPermissionSections]);

  useEffect(() => {
    if (profile_id) {
      void fetchRoleDetails();
    }
  }, [fetchRoleDetails, profile_id]);

  const permissionSet = useMemo(() => new Set(permission.map(String)), [permission]);
  const subPermissionSet = useMemo(() => new Set(subPermission.map(String)), [subPermission]);

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleCloseEditor = () => {
    router.push('/permission');
  };

  const handlePermissionToggle = (permissionId) => {
    const key = String(permissionId);
    setPermission((prev) => {
      if (prev.map(String).includes(key)) {
        return prev.filter((id) => String(id) !== key);
      }
      return [...prev, key];
    });
  };

  const handleSubPermissionToggle = (subPermissionId) => {
    const key = String(subPermissionId);
    setSubPermission((prev) => {
      if (prev.map(String).includes(key)) {
        return prev.filter((id) => String(id) !== key);
      }
      return [...prev, key];
    });
  };

  const isPermissionChecked = (permissionId) => permissionSet.has(String(permissionId));
  const isSubPermissionChecked = (subPermissionId) => subPermissionSet.has(String(subPermissionId));

  const saveProfile = async () => {
    if (!profile_id) return;

    setSaving(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/permissions/createpermissionsbyrole`, {
        role: profile_id,
        permission,
        sub_permission: subPermission,
      });

      showSnackbar('Profile updated successfully', 'success');
    } catch (error) {
      showSnackbar('Failed to save profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const isLoading = sectionsLoading || roleLoading;
  const editorTitle = title ? `Edit access — ${title}` : 'Edit access';

  return (
    <Layout>
      <Head>
        <title>Edit Role Permissions</title>
      </Head>

      <Dialog
        open
        onClose={handleCloseEditor}
        maxWidth={false}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(15, 23, 42, 0.38)',
            backdropFilter: 'blur(4px)',
          },
        }}
        PaperProps={{
          sx: {
            width: 'min(1120px, calc(100vw - 24px))',
            height: 'min(88vh, 920px)',
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 24px 80px rgba(15, 23, 42, 0.24)',
            bgcolor: '#FFFFFF',
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box
            sx={{
              px: { xs: 2, md: 3 },
              py: 2,
              borderBottom: '1px solid #E5EAF1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.4} sx={{ minWidth: 0 }}>
              <Avatar
                variant="rounded"
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  bgcolor: '#E8F8F1',
                  color: '#16A874',
                }}
              >
                <BadgeOutlinedIcon sx={{ fontSize: 20 }} />
              </Avatar>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: { xs: 19, md: 22 },
                    fontWeight: 800,
                    lineHeight: 1.15,
                    color: '#111827',
                  }}
                >
                  {editorTitle}
                </Typography>
              </Box>
            </Stack>

            <IconButton
              onClick={handleCloseEditor}
              aria-label="Close editor"
              sx={{
                color: '#64748B',
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              px: { xs: 2, md: 3 },
              py: 2.5,
              flex: 1,
              overflowY: 'auto',
              bgcolor: '#FFFFFF',
            }}
          >
            <Typography
              sx={{
                mb: 2.25,
                fontSize: 14,
                color: '#64748B',
                lineHeight: 1.7,
              }}
            >
              Tick a permission to grant the whole feature, or expand to grant specific actions.
            </Typography>

            {isLoading ? (
              <Box
                sx={{
                  minHeight: 420,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Stack spacing={2} alignItems="center">
                  <CircularProgress color="primary" />
                  <Typography sx={{ color: '#64748B', fontWeight: 600 }}>
                    Loading permission editor...
                  </Typography>
                </Stack>
              </Box>
            ) : (
              <Stack spacing={1.5}>
                {permissionSections.map((section) => (
                  <PermissionGroupCard
                    key={section.id}
                    section={section}
                    isPermissionChecked={isPermissionChecked}
                    isSubPermissionChecked={isSubPermissionChecked}
                    onTogglePermission={handlePermissionToggle}
                    onToggleSubPermission={handleSubPermissionToggle}
                  />
                ))}

                {permissionSections.length === 0 && (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      border: '1px solid #E5EAF1',
                      bgcolor: '#FFFFFF',
                    }}
                  >
                    <Typography sx={{ color: '#64748B' }}>
                      No permissions were returned from the server.
                    </Typography>
                  </Paper>
                )}
              </Stack>
            )}

        </Box>

          <Divider sx={{ borderColor: '#E5EAF1' }} />

          <Box
            sx={{
              px: { xs: 2, md: 3 },
              py: 2.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: 1.5,
            }}
          >
            <Button
              variant="contained"
              onClick={saveProfile}
              disabled={saving || isLoading}
              sx={{
                minWidth: 150,
                height: 46,
                px: 2.5,
                borderRadius: 2,
                bgcolor: '#16A874',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                boxShadow: '0 8px 18px rgba(22, 168, 116, 0.25)',
                '&:hover': {
                  bgcolor: '#138B61',
                },
              }}
            >
              {saving ? <CircularProgress size={18} color="inherit" /> : 'Update Profile'}
            </Button>
          </Box>
        </Box>
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

export default AdminAddEditPermission;
