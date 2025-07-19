import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Checkbox, 
  Container, 
  FormControlLabel, 
  Grid, 
  TextField, 
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout/Layout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';

const transformPermissionsData = (apiData) => {
  const transformed = {
    hierarchy: [],
    other: []
  };

  apiData.forEach(item => {
    if (['company', 'branch', 'staff'].includes(item.title.toLowerCase())) {
      transformed.hierarchy.push({
        id: item._id,
        keyword: item.title.charAt(0).toUpperCase() + item.title.slice(1),
        title: `${item.title.charAt(0).toUpperCase() + item.title.slice(1)} Permission`,
        sub_permission: item.subPermissions.map(sub => ({
          sub_id: sub._id,
          keyword: sub.title.charAt(0).toUpperCase() + sub.title.slice(1)
        }))
      });
    } else {
      transformed.other.push({
        id: item._id,
        keyword: item.title.charAt(0).toUpperCase() + item.title.slice(1),
        title: `${item.title.charAt(0).toUpperCase() + item.title.slice(1)} Permission`,
        sub_permission: item.subPermissions.map(sub => ({
          sub_id: sub._id,
          keyword: sub.title.charAt(0).toUpperCase() + sub.title.slice(1)
        }))
      });
    }
  });

  return transformed;
};

const AdminAddEditPermission = () => {
  const router = useRouter();
  const { profile_id } = router.query;
  
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState([]);
  const [subPermission, setSubPermission] = useState([]);
  const [errorTitleMessage, setErrorTitleMessage] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [permissionsData, setPermissionsData] = useState({ hierarchy: [], other: [] });
  const [allpermissions, setallpermissions] = useState([]);

  const handleAddPermission = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/permissions`);
      const transformedData = transformPermissionsData(data);
      setPermissionsData(transformedData);
      // setallpermissions(data);
    } catch (error) {
      showSnackbar('Failed to fetch permissions', 'error');
    }
  };

  useEffect(() => {
    handleAddPermission();
  }, []);

  useEffect(() => {
    if (profile_id) {
      const fetchRoleDetails = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/permissions/findpermissionsbyrole/${profile_id}`);
          const role = response.data[0];
          setTitle(role.role);
          setPermission(JSON.parse(role.permAndSubPerm).permission);
          setSubPermission(JSON.parse(role.permAndSubPerm).sub_permission);
        } catch (error) {
          showSnackbar('Failed to fetch role details', 'error');
        } finally {
          setLoading(false);
        }
      };
      fetchRoleDetails();
    }
  }, [profile_id]);
console.log(permission,"??????+===========")
  const handleTitleChange = (value) => {
    setTitle(value);
    if (!value) {
      setErrorTitleMessage('Title is required');
    } else {
      setErrorTitleMessage('');
    }
  };

  const handlePermissionChange = (permissionId) => {
    setPermission(prev => {
      if (prev.includes(permissionId)) {
        return prev.filter(id => id !== permissionId);
      } else {
        return [...prev, permissionId];
      }
    });
  };

  const handleSubPermissionChange = (subPermissionId) => {
    setSubPermission(prev => {
      if (prev.includes(subPermissionId)) {
        return prev.filter(id => id !== subPermissionId);
      } else {
        return [...prev, subPermissionId];
      }
    });
  };

  const isPermissionChecked = (permissionId) => {
    return permission.includes(permissionId);
  };

  const isSubPermissionChecked = (subPermissionId) => {
    return subPermission.includes(subPermissionId);
  };

  const saveProfile = async () => {
 
    // if (!title || errorTitleMessage) {
    //   setErrorTitleMessage('Please enter a valid title');
    //   return;
    // }
    // setLoading(true);
    try {
      const payload = {
        // title,
        role:profile_id,
        permission,
        sub_permission: subPermission
      };

      let response;

      if (profile_id) {
        response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/permissions/createpermissionsbyrole`, payload);
        showSnackbar('Profile updated successfully', 'success');
      } else {
        response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/roles`, payload);
        showSnackbar('Profile added successfully', 'success');
      }
      
      // router.push('/admin/roles_permission');
    } catch (error) {
      showSnackbar('Failed to save profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({...snackbar, open: false});
  };

  const renderPermissionSection = (category) => {
    const categoryData = permissionsData[category] || [];
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

    return (
      <Grid item xs={12} key={category}>
        <Paper elevation={3} sx={{ mb: 3 }}>
          <Box sx={{ 
            p: 2, 
            backgroundColor: '#0f2f810d', 
            borderBottom: '1px solid #ddd',
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px'
          }}>
            <Typography variant="h6" sx={{ color: '#0f2f82', fontWeight: 600 }}>
              {categoryName}
            </Typography>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Permission</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Sub Permission</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categoryData.map((option) => (
                  <TableRow key={option.id}>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isPermissionChecked(option.id)}
                            onChange={() => handlePermissionChange(option.id)}
                          />
                        }
                        label={option.keyword}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        {option.sub_permission.map((subOption) => (
                          <FormControlLabel
                            key={subOption.sub_id}
                            control={
                              <Checkbox
                                checked={isSubPermissionChecked(subOption.sub_id)}
                                onChange={() => handleSubPermissionChange(subOption.sub_id)}
                              />
                            }
                            label={subOption.keyword}
                          />
                        ))}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    );
  };

  return (
    <Layout> 
      <>
        <Head>
          <title>Add/Edit Role Permissions</title>
        </Head>

        <Container maxWidth="lg">
          <IconButton onClick={() => router.back()} aria-label="Go Back">
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {profile_id ? 'Edit' : 'Add'} Role Permissions
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Role Title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  error={!!errorTitleMessage}
                  helperText={errorTitleMessage}
                  disabled={loading}
                />
              </Grid>

              {Object.keys(permissionsData).map(category => 
                renderPermissionSection(category)
              )}

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={saveProfile}
                  disabled={loading || !!errorTitleMessage}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {profile_id ? 'Update' : 'Save'} Profile
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Container>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </>
    </Layout>
  );
};

export default AdminAddEditPermission;