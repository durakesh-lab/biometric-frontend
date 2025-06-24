import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Switch,
  TextField,
  FormControlLabel,
  Divider,
  CircularProgress,
  Alert,
  Grid,
  Snackbar,
  IconButton
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import EmailIcon from '@mui/icons-material/Email';
import SaveIcon from '@mui/icons-material/Save';
import Layout from '../../components/Layout/Layout';
import axios from 'axios';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const TwoFactorAuthSettings = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [settings, setSettings] = useState({
  twoFAEnabled: false,
  email: '',
  appPassword: ''
});
const [showPassword, setShowPassword] = useState(false);

const handleTogglePassword = () => {
  setShowPassword(prev => !prev);
};

const [formData, setFormData] = useState({
  twoFAEnabled: false,
  email: '',
  appPassword: ''
});

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch data from API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        let token = localStorage.getItem("biometric_token");
        const response = await axios.get(
          `http://localhost:3001/settings/2factor-authentication`, {
            headers: { Authorization: token }
          }
        );
        
setSettings({
  twoFAEnabled: response.data.datavalue,
  email: response.data.email || 'user@example.com',
  appPassword: response.data.appPassword || ''
});

setFormData({
  twoFAEnabled: response.data.datavalue,
  email: response.data.email || 'user@example.com',
  appPassword: response.data.appPassword || ''
});

        
        setLoading(false);
      } catch (err) {
        showSnackbar('Failed to load 2FA settings', 'error');
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleToggleChange = (event) => {
    setFormData({
      ...formData,
      twoFAEnabled: event.target.checked
    });
  };

  const handleEmailChange = (event) => {
    setFormData({
      ...formData,
      email: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      let token = localStorage.getItem("biometric_token");
      await axios.post(
        `http://localhost:3001/settings/2factor-authentication`,
        formData,
        {
          headers: { Authorization: token }
        }
      );
      
      setSettings(formData);
      showSnackbar('2FA settings updated successfully!');
    } catch (err) {
      showSnackbar('Failed to update 2FA settings', 'error');
    } finally {
      setLoading(false);
    }
  };

const hasChanges = 
  formData.twoFAEnabled !== settings.twoFAEnabled ||
  formData.email !== settings.email ||
  formData.appPassword !== settings.appPassword;


  if (loading && !settings.email) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Layout> 
  <Card variant="outlined" sx={{ mb: 3 }}>
  <CardContent>
    <Box mb={2}>
      <Typography variant="h5" component="div" gutterBottom>
        General Settings
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box display="flex" alignItems="center">
        <SecurityIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6" component="div">
          Two-Factor Authentication
        </Typography>
      </Box>
    </Box>

          
          <Typography variant="body2" color="text.secondary" mb={3}>
            Secure your account with 2FA security. When enabled, you'll need to enter
            both your password and a verification code sent to your email.
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box mb={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.twoFAEnabled}
                        onChange={handleToggleChange}
                        color="primary"
                      />
                    }
                    label={
                      <Box>
                        <Typography>2FA Status</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formData.twoFAEnabled ? 'Enabled' : 'Disabled'}
                        </Typography>
                      </Box>
                    }
                    labelPlacement="end"
                    sx={{ alignItems: 'center' }}
                  />
                </Box>
              </Grid>
              
     <Grid item xs={12} md={6}>
  <TextField
    fullWidth
    label="Verification Email"
    variant="outlined"
    value={formData.email}
    onChange={handleEmailChange}
    InputProps={{
      startAdornment: (
        <EmailIcon color="action" sx={{ mr: 1 }} />
      ),
    }}
    helperText="Code will be sent by this email"
    margin="normal"
  />

  <TextField
    fullWidth
    label="App Password"
    type={showPassword ? 'text' : 'password'}
    variant="outlined"
    value={formData.appPassword}
    onChange={(e) => setFormData({ ...formData, appPassword: e.target.value })}
    InputProps={{
      endAdornment: (
        <IconButton onClick={handleTogglePassword} edge="end">
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      ),
    }}
    helperText="Only Available is 2FA is enable in your mail id"
    margin="normal"
    sx={{ mt: 2 }}
  />
</Grid>

            </Grid>
            
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            
            <Box display="flex" justifyContent="flex-end" mt={3}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                disabled={loading || !hasChanges}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Saving...
                  </>
                ) : (
                  'Save Settings'
                )}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

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
  );
};

export default TwoFactorAuthSettings;