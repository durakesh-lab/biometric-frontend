import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Divider
} from '@mui/material';
import {
  Close,
  CalendarToday,
  ArrowBack,
  ArrowForward,
  FastForward,
  FastRewind,
  Search
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const ShiftAssignmentDrawer = () => {
  const [open, setOpen] = useState(false);
  const [shift, setShift] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reason, setReason] = useState('');
  const [updatePastEntries, setUpdatePastEntries] = useState(false);

  const shifts = [
    'Morning Shift (9AM-5PM)',
    'Evening Shift (2PM-10PM)',
    'Night Shift (10PM-6AM)',
    'Flexi Shift',
    'Weekend Shift'
  ];

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpen(open);
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log({
      shift,
      startDate,
      endDate,
      reason,
      updatePastEntries
    });
    setOpen(false);
  };

  return (
    <>
      {/* Button to open the drawer */}
      <Button variant="contained" onClick={toggleDrawer(true)}>
        Assign Shift
      </Button>

      {/* The drawer component */}
      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 450,
            boxSizing: 'border-box',
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography variant="h6">Assign shift</Typography>
          <IconButton onClick={toggleDrawer(false)}>
            <Close />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ p: 2, overflowY: 'auto', height: '100%' }}>
          {/* Shift Selection */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="shift-label">Shift name</InputLabel>
            <Select
              labelId="shift-label"
              value={shift}
              label="Shift name"
              onChange={(e) => setShift(e.target.value)}
            >
              {shifts.map((shiftOption) => (
                <MenuItem key={shiftOption} value={shiftOption}>
                  {shiftOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Date Range */}
          <Typography variant="subtitle2" gutterBottom>
            Dates
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    fullWidth 
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <CalendarToday fontSize="small" sx={{ mr: 1, color: 'action.active' }} />
                      )
                    }}
                  />
                )}
                components={{
                  LeftArrowIcon: ArrowBack,
                  RightArrowIcon: ArrowForward,
                  NextIcon: FastForward,
                  PreviousIcon: FastRewind
                }}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    fullWidth 
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <CalendarToday fontSize="small" sx={{ mr: 1, color: 'action.active' }} />
                      )
                    }}
                  />
                )}
                components={{
                  LeftArrowIcon: ArrowBack,
                  RightArrowIcon: ArrowForward,
                  NextIcon: FastForward,
                  PreviousIcon: FastRewind
                }}
              />
            </Box>
          </LocalizationProvider>

          {/* Reason */}
          <TextField
            fullWidth
            label="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            multiline
            rows={2}
            sx={{ mb: 3 }}
          />

          {/* Update Past Entries (Hidden by default) */}
          <Box sx={{ display: 'none', mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Update past days' attendance entries
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              You have selected past dates. By enabling the checkbox below, settings of the selected shift will overwrite settings of the previous shift including overtime, present/absence status, payable hours, grace period policy, compensatory off credit and absent schedule.
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={updatePastEntries}
                  onChange={(e) => setUpdatePastEntries(e.target.checked)}
                />
              }
              label="Update past days' attendance entries"
            />
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ 
          p: 2, 
          borderTop: '1px solid', 
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2
        }}>
          <Button 
            variant="outlined" 
            onClick={toggleDrawer(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default ShiftAssignmentDrawer;