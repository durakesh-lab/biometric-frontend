import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Container, 
  Grid, 
  Modal, 
  TextField, 
  Typography, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import Head from 'next/head';
import Layout from '../../components/Layout/Layout';
import axios from 'axios';

const PermissionPage = () => {
  const [inputPermission, setInputPermission] = useState("");
  const [selectedPermission, setSelectedPermission] = useState("");
  const [showAddPermissionModal, setShowAddPermissionModal] = useState(false);
  const [showAddSubPermissionModal, setShowAddSubPermissionModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    fetchPermissions();
    // Fetch roles from your roles API
    fetchRoles();
  }, []);

  const fetchPermissions = async () => {
    try {
      const response = await axios.get('http://localhost:3001/permissions');
      setPermissions(response.data);
    } catch (error) {
      showSnackbar('Failed to fetch permissions', 'error');
    }
  };

  const fetchRoles = async () => {
    try {
      // Replace with your actual roles API endpoint
      // const response = await axios.get('/api/roles');
     let r= [
  { profile_id: 1, title: 'HR Manager', permissions: ['Dashboard Access', 'User Management'] },
  { profile_id: 2, title: 'Manager', permissions: ['Dashboard Access', 'Content Management'] },
  { profile_id: 3, title: 'Employee', permissions: ['Dashboard Access'] },
  { profile_id: 4, title: 'Guest', permissions: [] },
];
setRoles(r)
      // setRoles(response.data);
    } catch (error) {
      showSnackbar('Failed to fetch roles', 'error');
    }
  };

  const handleAddPermission = async () => {
    if (!inputPermission) {
      setError(true);
      return;
    }
    
    setLoading(true);
    try {
      await axios.post('http://localhost:3001/permissions', { title: inputPermission });
      await fetchPermissions();
      setInputPermission("");
      setShowAddPermissionModal(false);
      showSnackbar('Permission added successfully', 'success');
    } catch (error) {
      showSnackbar('Failed to add permission', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubPermission = async () => {
    if (!inputPermission || !selectedPermission) {
      setError(true);
      return;
    }
    
    setLoading(true);
    try {
      await axios.post('http://localhost:3001/permissions/sub', {
        title: inputPermission,
        parentPermission: selectedPermission
      });
      await fetchPermissions();
      setInputPermission("");
      setSelectedPermission("");
      setShowAddSubPermissionModal(false);
      showSnackbar('Sub-permission added successfully', 'success');
    } catch (error) {
      showSnackbar('Failed to add sub-permission', 'error');
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

  return (
    <>
      <Layout>   
        <Head>
          <title>Roles and Permissions</title>
        </Head>

        <Container maxWidth="lg">
          <Box sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Roles And Permissions
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3, gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={() => setShowAddPermissionModal(true)}
                startIcon={<span>+</span>}
              >
                Add Permission
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => setShowAddSubPermissionModal(true)}
                startIcon={<span>+</span>}
              >
                Add Sub-Permission
              </Button>
              <Button 
                variant="outlined" 
                href="/admin/add_role"
                startIcon={<span>+</span>}
              >
                Add Profile
              </Button>
            </Box>

            <Grid container spacing={3}>
              {roles.map((role) => (
                <Grid item xs={12} sm={6} md={4} key={role.profile_id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" component="div">
                          {role.title}
                        </Typography>
                        <Button 
                          size="small" 
                          href={`/permission/editpermissions/${role.title}`}
                          variant="contained"
                        >
                          Edit
                        </Button>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Permissions: {role.permissions?.join(', ') || 'None'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>

        {/* Add Permission Modal */}
        <Modal
          open={showAddPermissionModal}
          onClose={() => setShowAddPermissionModal(false)}
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 1
          }}>
            <Typography variant="h6" component="h2" mb={2}>
              Add Permission
            </Typography>
            <TextField
              fullWidth
              label="Permission Title"
              value={inputPermission}
              onChange={(e) => setInputPermission(e.target.value)}
              error={error && !inputPermission}
              helperText={error && !inputPermission ? "This field is required" : ""}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button onClick={() => setShowAddPermissionModal(false)}>Cancel</Button>
              <Button 
                variant="contained" 
                onClick={handleAddPermission}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Submit'}
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Add Sub-Permission Modal */}
        <Modal
          open={showAddSubPermissionModal}
          onClose={() => setShowAddSubPermissionModal(false)}
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 1
          }}>
            <Typography variant="h6" component="h2" mb={2}>
              Add Sub-Permission
            </Typography>
            <TextField
              fullWidth
              label="Sub-Permission Title"
              value={inputPermission}
              onChange={(e) => setInputPermission(e.target.value)}
              error={error && !inputPermission}
              helperText={error && !inputPermission ? "This field is required" : ""}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Parent Permission</InputLabel>
              <Select
                value={selectedPermission}
                onChange={(e) => setSelectedPermission(e.target.value)}
                label="Parent Permission"
                error={error && !selectedPermission}
              >
                <MenuItem value="">Select Permission</MenuItem>
                {permissions.map((permission) => (
                  <MenuItem key={permission._id} value={permission._id}>
                    {permission.title}
                  </MenuItem>
                ))}
              </Select>
              {error && !selectedPermission && (
                <Typography variant="caption" color="error">
                  This field is required
                </Typography>
              )}
            </FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button onClick={() => setShowAddSubPermissionModal(false)}>Cancel</Button>
              <Button 
                variant="contained" 
                onClick={handleAddSubPermission}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Submit'}
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Snackbar for notifications */}
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
      </Layout>
    </>
  );
};

export default PermissionPage;