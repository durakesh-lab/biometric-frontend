import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Divider,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Chip,
  Box,
  Paper,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  Close,
  Edit,
  Info,
  MoreVert,
  CalendarToday,
  ArrowBack,
  ArrowForward,
  Save,
  Add,
  Person
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const LeaveApplicationForm = ({ open, onClose }) => {
  const [leaveType, setLeaveType] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [timeOption, setTimeOption] = useState('Hours');
  const [reason, setReason] = useState('');
  const [teamEmail, setTeamEmail] = useState('');
  const [employee] = useState({
    id: '240375000000281005',
    name: 'Rajat Gour',
    avatar: null
  });

  const leaveTypes = [
    'Casual Leave',
    'Sick Leave',
    'Earned Leave',
    'Paternity Leave',
    'Leave Without Pay'
  ];

  const handleSubmit = () => {
    // Handle form submission
    console.log({
      leaveType,
      fromDate,
      toDate,
      timeOption,
      reason,
      teamEmail
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          height: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ 
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 2,
        px: 3
      }}>
        <Box display="flex" alignItems="center">
          <Typography variant="h6" component="div">Apply Leave</Typography>
          
          {/* Employee Info */}
          <Box display="flex" alignItems="center" ml={3}>
            <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
              {employee.avatar ? (
                <img src={employee.avatar} alt={employee.name} />
              ) : (
                <Person fontSize="small" />
              )}
            </Avatar>
            <Typography variant="body2">{employee.name}</Typography>
          </Box>
          
          {/* Status Badges */}
          <Box display="flex" alignItems="center" ml={2}>
            <Chip 
              label="Draft" 
              color="primary" 
              size="small" 
              sx={{ mr: 1, bgcolor: 'primary.light' }} 
            />
            <Chip 
              label="Sample Data" 
              color="success" 
              size="small" 
            />
          </Box>
        </Box>
        
        {/* Header Actions */}
        <Box display="flex" alignItems="center">
          <Tooltip title="Edit">
            <IconButton color="inherit" size="small" sx={{ mr: 1 }}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Info">
            <IconButton color="inherit" size="small" sx={{ mr: 1 }}>
              <Info fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="More options">
            <IconButton color="inherit" size="small" sx={{ mr: 1 }}>
              <MoreVert fontSize="small" />
            </IconButton>
          </Tooltip>
          <IconButton 
            edge="end" 
            color="inherit" 
            onClick={onClose}
            aria-label="close"
            size="small"
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Form Content */}
      <DialogContent dividers sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
        <Box sx={{ p: 3 }}>
          {/* Leave Section */}
          <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Leave</Typography>
            <Divider sx={{ mb: 3 }} />

            {/* Employee ID (Hidden) */}
            <Box sx={{ display: 'none', mb: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Employee ID</InputLabel>
                <Select
                  value={employee.id}
                  label="Employee ID"
                  disabled
                >
                  <MenuItem value={employee.id}>
                    {employee.name} ({employee.id})
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Leave Type */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="leave-type-label">Leave type *</InputLabel>
              <Select
                labelId="leave-type-label"
                value={leaveType}
                label="Leave type *"
                onChange={(e) => setLeaveType(e.target.value)}
                required
              >
                <MenuItem value="" disabled>Select</MenuItem>
                {leaveTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Available Leave */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2">
                Available Leave: <Chip label="9 days" color="success" size="small" />
              </Typography>
            </Box>

            {/* Time Options (Hidden by default) */}
            <Box sx={{ display: 'none', mb: 3 }}>
              <Typography variant="body2" gutterBottom sx={{ fontWeight: 500 }}>Apply with</Typography>
              <FormControl component="fieldset">
                <RadioGroup 
                  row 
                  value={timeOption} 
                  onChange={(e) => setTimeOption(e.target.value)}
                >
                  <FormControlLabel
                    value="Hours"
                    control={<Radio size="small" />}
                    label="Start time and total hours"
                  />
                  <FormControlLabel
                    value="Startend"
                    control={<Radio size="small" />}
                    label="Start time and end time"
                  />
                </RadioGroup>
              </FormControl>
            </Box>

            {/* Date Range */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <DatePicker
                  label="From *"
                  value={fromDate}
                  onChange={(newValue) => setFromDate(newValue)}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      fullWidth 
                      required 
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <CalendarToday fontSize="small" sx={{ mr: 1, color: 'action.active' }} />
                        )
                      }}
                    />
                  )}
                />
                <DatePicker
                  label="To *"
                  value={toDate}
                  onChange={(newValue) => setToDate(newValue)}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      fullWidth 
                      required 
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <CalendarToday fontSize="small" sx={{ mr: 1, color: 'action.active' }} />
                        )
                      }}
                    />
                  )}
                />
              </Box>
            </LocalizationProvider>

            {/* Compensatory Days (Hidden by default) */}
            <Box sx={{ display: 'none', mb: 3 }}>
              <Typography variant="body2" gutterBottom sx={{ fontWeight: 500 }}>Compensated with</Typography>
              <Table size="small" sx={{ border: '1px solid', borderColor: 'divider' }}>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ border: 'none' }}>
                      There are no valid compensatory work days to list here
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>

            {/* Leave Days Summary (Hidden by default) */}
            <Box sx={{ display: 'none', mb: 3 }}>
              <Table size="small" sx={{ border: '1px solid', borderColor: 'divider' }}>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={2} sx={{ fontWeight: 600 }}>Total</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>0</TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </Box>

            {/* Team Email */}
            <TextField
              fullWidth
              label="Team Email ID"
              value={teamEmail}
              onChange={(e) => setTeamEmail(e.target.value)}
              sx={{ mb: 3 }}
            />

            {/* Reason */}
            <TextField
              fullWidth
              label="Reason for leave *"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              multiline
              rows={4}
              required
            />
          </Paper>
        </Box>
      </DialogContent>

      {/* Footer Actions */}
      <DialogActions sx={{ 
        p: 2, 
        justifyContent: 'space-between',
        borderTop: '1px solid',
        borderColor: 'divider'
      }}>
        <Box>
          <Button 
            variant="outlined" 
            sx={{ mr: 1 }}
            startIcon={<ArrowBack />}
            disabled
          >
            Previous
          </Button>
          <Button 
            variant="outlined"
            endIcon={<ArrowForward />}
            disabled
          >
            Next
          </Button>
        </Box>
        <Box>
          <Button 
            variant="outlined" 
            sx={{ mr: 1 }}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<Save />}
            onClick={handleSubmit}
          >
            Submit
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            sx={{ ml: 1 }}
            startIcon={<Add />}
          >
            Submit and New
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default LeaveApplicationForm;