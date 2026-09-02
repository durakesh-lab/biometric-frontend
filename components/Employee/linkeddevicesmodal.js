import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Button,
  Chip,
  Paper,
  Divider,
  Stack,
  Avatar
} from '@mui/material';
import {
  Close as CloseIcon,
  Devices as DevicesIcon,
  Fingerprint as FingerprintIcon,
  CheckCircle as CheckCircleIcon,
  Sensors as SensorsIcon,
  Person as PersonIcon
} from '@mui/icons-material';

const LinkedDevicesModal = ({ open, onClose, staff }) => {
  if (!staff) return null;

  const linkedDevices = staff.linkedDevices || [];
  const fullName = `${staff.firstName || ''} ${staff.lastName || ''}`.trim() || 'Employee';

  // Sort devices so Online/Active devices always appear at the top
  const sortedDevices = React.useMemo(() => {
    return [...linkedDevices].sort((a, b) => {
      const statusA = (typeof a === 'object' && a?.status) ? String(a.status).toLowerCase() : '';
      const statusB = (typeof b === 'object' && b?.status) ? String(b.status).toLowerCase() : '';
      const isOnlineA = statusA === 'online' || statusA === 'active';
      const isOnlineB = statusB === 'online' || statusB === 'active';

      if (isOnlineA && !isOnlineB) return -1;
      if (!isOnlineA && isOnlineB) return 1;
      return 0;
    });
  }, [linkedDevices]);

  // Extract initials for the avatar
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'EM';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }
      }}
    >
      {/* Modal Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 2.5, sm: 3 },
          py: 2.5,
          background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)',
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
          {/* Avatar with Initials */}
          <Avatar
            sx={{
              width: 52,
              height: 52,
              fontSize: '18px',
              fontWeight: 800,
              color: '#FFFFFF',
              background: 'linear-gradient(135deg, #10B981 0%, #047857 100%)',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
              border: '2px solid #FFFFFF',
              flexShrink: 0,
            }}
          >
            {initials}
          </Avatar>

          <Box sx={{ minWidth: 0 }}>
            {/* 1st Line: Employee Name & ID */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
              <Typography
                sx={{
                  color: '#0F172A',
                  fontWeight: 800,
                  fontSize: { xs: '18px', sm: '20px' },
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                }}
              >
                {fullName}
              </Typography>
              {staff.deviceUserId && (
                <Box
                  component="span"
                  sx={{
                    px: 1.25,
                    py: 0.35,
                    borderRadius: '20px',
                    bgcolor: '#DEF7EC',
                    color: '#03543F',
                    fontWeight: 800,
                    fontSize: '13px',
                    border: '1px solid #A7F3D0',
                    display: 'inline-flex',
                    alignItems: 'center',
                    lineHeight: 1,
                  }}
                >
                  ID {staff.deviceUserId}
                </Box>
              )}
            </Box>

            {/* 2nd Line: Subtitle with larger font size */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                mt: 0.5,
              }}
            >
              <DevicesIcon sx={{ fontSize: 17, color: '#0E9F6E' }} />
              <Typography
                sx={{
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: 1.3,
                }}
              >
                Linked Biometric Hardware & Terminals
              </Typography>
            </Box>
          </Box>
        </Box>

        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            color: '#9CA3AF',
            bgcolor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            '&:hover': { color: '#111827', bgcolor: '#F3F4F6' }
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Modal Content */}
      <DialogContent sx={{ p: 3, backgroundColor: '#F9FAFB' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151' }}>
            Assigned Devices & Terminals
          </Typography>
          <Chip
            size="small"
            icon={<SensorsIcon sx={{ fontSize: '14px !important', color: '#047857 !important' }} />}
            label={`${linkedDevices.length} ${linkedDevices.length === 1 ? 'Device' : 'Devices'}`}
            sx={{
              bgcolor: '#DEF7EC',
              color: '#047857',
              fontWeight: 700,
              fontSize: '12px',
              border: '1px solid #A7F3D0'
            }}
          />
        </Box>

        {linkedDevices.length > 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              maxHeight: '380px',
              overflowY: 'auto',
              pr: 0.5,
              '&::-webkit-scrollbar': { width: '5px' },
              '&::-webkit-scrollbar-track': { background: '#F3F4F6', borderRadius: '4px' },
              '&::-webkit-scrollbar-thumb': { background: '#D1D5DB', borderRadius: '4px' },
              '&::-webkit-scrollbar-thumb:hover': { background: '#9CA3AF' },
            }}
          >
            {sortedDevices.map((dev, index) => {
              const devName = typeof dev === 'string' ? dev : (dev.name || dev.serialNumber || `Terminal ${index + 1}`);
              const devSerial = typeof dev === 'object' && dev.serialNumber ? dev.serialNumber : null;
              const devStatus = typeof dev === 'object' && dev.status ? dev.status : 'Active';
              const isOnline = devStatus.toLowerCase() === 'online' || devStatus.toLowerCase() === 'active';

              return (
                <Paper
                  key={(typeof dev === 'object' && dev._id) ? dev._id : index}
                  variant="outlined"
                  sx={{
                    p: 1.75,
                    borderRadius: '12px',
                    borderColor: '#E5E7EB',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: '#10B981',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.08)',
                      transform: 'translateY(-1px)',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: '10px',
                        bgcolor: isOnline ? '#ECFDF5' : '#F3F4F6',
                        color: isOnline ? '#059669' : '#6B7280',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        border: isOnline ? '1px solid #A7F3D0' : '1px solid #E5E7EB',
                      }}
                    >
                      <FingerprintIcon fontSize="small" />
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: '#111827',
                          fontSize: '13.5px',
                        }}
                        noWrap
                      >
                        {devName}
                      </Typography>
                      {devSerial && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#6B7280',
                            fontFamily: 'monospace',
                            fontSize: '11px',
                            display: 'block',
                            mt: 0.25,
                          }}
                        >
                          Serial: {devSerial}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Chip
                    size="small"
                    label={devStatus}
                    sx={{
                      fontSize: '11px',
                      fontWeight: 600,
                      height: '22px',
                      bgcolor: isOnline ? '#DEF7EC' : '#F3F4F6',
                      color: isOnline ? '#03543F' : '#6B7280',
                      border: isOnline ? '1px solid #A7F3D0' : '1px solid #E5E7EB',
                      flexShrink: 0,
                    }}
                  />
                </Paper>
              );
            })}
          </Box>
        ) : (
          <Paper
            variant="outlined"
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: '12px',
              borderColor: '#E5E7EB',
              bgcolor: '#FFFFFF',
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                bgcolor: '#F3F4F6',
                color: '#9CA3AF',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1.5,
              }}
            >
              <DevicesIcon />
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', mb: 0.5 }}>
              No Linked Devices
            </Typography>
            <Typography variant="caption" sx={{ color: '#6B7280' }}>
              This employee is not currently mapped to any biometric terminals.
            </Typography>
          </Paper>
        )}
      </DialogContent>

      {/* Modal Actions */}
      <DialogActions sx={{ px: 3, py: 1.75, borderTop: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', justifyContent: 'flex-end' }}>
        <Button
          onClick={onClose}
          variant="contained"
          size="small"
          sx={{
            backgroundColor: '#0E9F6E',
            color: '#FFFFFF',
            textTransform: 'none',
            borderRadius: '8px',
            px: 2.5,
            py: 0.75,
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#047857',
              boxShadow: 'none',
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LinkedDevicesModal;
