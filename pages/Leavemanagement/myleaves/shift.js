import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, Typography, Button, IconButton, Menu, MenuItem, Paper, 
  Tabs, Tab, Drawer, Divider, TextField, Select, FormControl, 
  InputLabel, Textarea, FormControlLabel, Checkbox, Stack
} from '@mui/material';
import { 
  CalendarViewDay, CalendarViewMonth, MoreVert, Close,
  ArrowBack, ArrowForward, CalendarToday, Search,
  FastForward, FastRewind, ChevronLeft, ChevronRight
} from '@mui/icons-material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { 
  format, addDays, addWeeks, addMonths, 
  startOfWeek, endOfWeek, startOfMonth, endOfMonth,
  isSameMonth, isSameWeek
} from 'date-fns';
import LeaveManagementTabs from '../../../components/leaves  management/leavessection';
import Layout from '../../../components/Layout/Layout';

const ShiftManagementPage = () => {
  const [view, setView] = useState('week');
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateRange, setDateRange] = useState({
    start: startOfWeek(new Date()),
    end: endOfWeek(new Date())
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const calendarRef = useRef(null);

  // Update calendar view when view type changes
  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(view === 'week' ? 'timeGridWeek' : 'dayGridMonth');
    }
  }, [view]);

  // Handle view change between week and month
  const handleViewChange = (newView) => {
    setView(newView);
    if (newView === 'week') {
      setDateRange({
        start: startOfWeek(selectedDate),
        end: endOfWeek(selectedDate)
      });
    } else {
      setDateRange({
        start: startOfMonth(selectedDate),
        end: endOfMonth(selectedDate)
      });
    }
  };

  // Handle navigation (previous/next)
  const handleNavigate = (direction) => {
    let newDate;
    if (view === 'week') {
      newDate = direction === 'prev' 
        ? addWeeks(dateRange.start, -1) 
        : addWeeks(dateRange.start, 1);
      setDateRange({
        start: startOfWeek(newDate),
        end: endOfWeek(newDate)
      });
    } else {
      newDate = direction === 'prev' 
        ? addMonths(dateRange.start, -1) 
        : addMonths(dateRange.start, 1);
      setDateRange({
        start: startOfMonth(newDate),
        end: endOfMonth(newDate)
      });
    }
    setSelectedDate(newDate);
    
    // Update calendar view
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(newDate);
    }
  };

  // Handle date selection from picker
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (view === 'week') {
      setDateRange({
        start: startOfWeek(date),
        end: endOfWeek(date)
      });
    } else {
      setDateRange({
        start: startOfMonth(date),
        end: endOfMonth(date)
      });
    }
    
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(date);
    }
    setShowDatePicker(false);
  };

  // Handle date click on calendar
  const handleDateClick = (arg) => {
    const clickedDate = new Date(arg.date);
    setSelectedDate(clickedDate);
  };

  // More options menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Calendar events
  const events = [
    {
      id: '1',
      title: 'General Shift',
      start: '2025-06-01T09:00:00',
      end: '2025-06-01T18:00:00',
      color: '#4CAF50',
      extendedProps: {
        type: 'shift'
      }
    },
    {
      id: '2',
      title: 'Casual Leave',
      start: '2025-06-23',
      end: '2025-06-25',
      color: '#FF9800',
      extendedProps: {
        type: 'leave'
      }
    },
    {
      id: '3',
      title: 'Holiday',
      start: '2025-06-18',
      end: '2025-06-20',
      color: '#F44336',
      extendedProps: {
        type: 'holiday'
      }
    }
  ];

  // Format date range display
  const formatDateRange = () => {
    return `${format(dateRange.start, 'dd-MMM-yyyy')} - ${format(dateRange.end, 'dd-MMM-yyyy')}`;
  };

  return (
    <Layout>  
      <LeaveManagementTabs />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100vh' }}>
          {/* Header with navigation controls */}
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center">
                {/* Navigation arrows */}
                <IconButton onClick={() => handleNavigate('prev')} color="primary">
                  <ChevronLeft />
                </IconButton>
                
                {/* Date range display with calendar picker */}
                <Box sx={{ position: 'relative', mx: 1 }}>
                  <Button 
                    variant="text"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      fontWeight: 'bold',
                      color: 'primary.main'
                    }}
                  >
                    {formatDateRange()}
                    <CalendarToday sx={{ ml: 1, fontSize: '1rem' }} />
                  </Button>
                  
                  {showDatePicker && (
                    <Box sx={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      zIndex: 10,
                      bgcolor: 'background.paper',
                      boxShadow: 3,
                      borderRadius: 1,
                      p: 2,
                      mt: 1
                    }}>
                      <DatePicker
                        openTo={view === 'week' ? 'day' : 'month'}
                        views={view === 'week' ? ['year', 'month', 'day'] : ['year', 'month']}
                        value={selectedDate}
                        onChange={handleDateSelect}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </Box>
                  )}
                </Box>
                
                <IconButton onClick={() => handleNavigate('next')} color="primary">
                  <ChevronRight />
                </IconButton>
                
                {/* View toggle */}
                <Button 
                  variant={view === 'week' ? 'contained' : 'outlined'} 
                  onClick={() => handleViewChange('week')}
                  sx={{ mx: 1 }}
                >
                  Weekly
                </Button>
                <Button 
                  variant={view === 'month' ? 'contained' : 'outlined'} 
                  onClick={() => handleViewChange('month')}
                  sx={{ mx: 1 }}
                >
                  Monthly
                </Button>
              </Box>
              
              {/* Right side actions */}
              <Box display="flex" alignItems="center">
                <Button 
                  variant="contained" 
                  color="primary" 
                  sx={{ mr: 2 }}
                  onClick={() => {;setIsDrawerOpen(true)}}
                >
                  Assign Shift
                </Button>
                <IconButton onClick={handleMenuOpen}>
                  <MoreVert />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleMenuClose}>Import</MenuItem>
                  <MenuItem onClick={handleMenuClose}>Export</MenuItem>
                  <MenuItem onClick={handleMenuClose}>Download as PDF</MenuItem>
                  <MenuItem onClick={handleMenuClose}>Print</MenuItem>
                </Menu>
              </Box>
            </Box>
          </Paper>

          {/* Calendar */}
          <Paper elevation={3} sx={{ flex: 1, p: 2, overflow: 'hidden' }}>
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView={view === 'month' ? 'dayGridMonth' : 'timeGridWeek'}
              headerToolbar={false}
              height="100%"
              events={events}
              dateClick={handleDateClick}
              weekends={true}
              initialDate={selectedDate}
              eventContent={(eventInfo) => (
                <Box sx={{ 
                  p: 0.5, 
                  borderRadius: 1, 
                  backgroundColor: eventInfo.event.backgroundColor,
                  color: '#fff',
                  fontSize: '0.85rem'
                }}>
                  <div>{eventInfo.event.title}</div>
                  {eventInfo.event.extendedProps.type === 'shift' && (
                    <div>{eventInfo.timeText}</div>
                  )}
                </Box>
              )}
              dayHeaderContent={(arg) => (
                <Box sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                  <div>{arg.text.split(' ')[0]}</div>
                  <div>{arg.text.split(' ')[1]}</div>
                </Box>
              )}
              dayCellContent={(arg) => (
                <Box sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                  {arg.dayNumberText}
                </Box>
              )}
            />
          </Paper>

          {/* Assign Shift Drawer (right side) */}
          <Drawer
            anchor="right"
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            sx={{
              '& .MuiDrawer-paper': {
                width: 400,
                boxSizing: 'border-box',
              },
            }}
          >
            <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Header */}
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Assign Shift</Typography>
                <IconButton onClick={() => setIsDrawerOpen(false)}>
                  <Close />
                </IconButton>
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              {/* Form */}
              <Box component="form" sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Stack spacing={3} sx={{ flex: 1 }}>
                  {/* Shift Name */}
                  <FormControl fullWidth>
                    <InputLabel>Shift Name</InputLabel>
                    <Select
                      label="Shift Name"
                      required
                    >
                      <MenuItem value="general">General</MenuItem>
                      <MenuItem value="morning">Morning</MenuItem>
                      <MenuItem value="evening">Evening</MenuItem>
                      <MenuItem value="night">Night</MenuItem>
                    </Select>
                  </FormControl>
                  
                  {/* Date Range */}
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>Dates</Typography>
                    <Box display="flex" gap={2}>
                      <DatePicker
                        label="Start Date"
                        value={dateRange.start}
                        onChange={(newValue) => {
                          if (newValue) {
                            setDateRange(prev => ({
                              start: newValue,
                              end: view === 'week' 
                                ? endOfWeek(newValue) 
                                : endOfMonth(newValue)
                            }));
                          }
                        }}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                      <DatePicker
                        label="End Date"
                        value={dateRange.end}
                        onChange={(newValue) => {
                          if (newValue) {
                            setDateRange(prev => ({
                              ...prev,
                              end: newValue
                            }));
                          }
                        }}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </Box>
                  </Box>
                  
                  {/* Reason */}
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>Reason</Typography>
                   <TextField
  multiline
  minRows={3}
  placeholder="Reason"
  sx={{ width: '100%' }}
/>
                  </Box>
                  
                  {/* Update past days checkbox */}
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Update past days' attendance entries"
                  />
                  
                  <Typography variant="body2" color="text.secondary">
                    You have selected past dates. By enabling the checkbox above, settings of the selected shift will overwrite settings of the previous shift including overtime, present/absence status, payable hours, grace period policy, compensatory off credit and absent schedule.
                  </Typography>
                </Stack>
                
                {/* Footer buttons */}
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button variant="outlined" onClick={() => setIsDrawerOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="contained" color="primary">
                    Submit
                  </Button>
                </Box>
              </Box>
            </Box>
          </Drawer>
        </Box>
      </LocalizationProvider>
    </Layout> 
  );
};

export default ShiftManagementPage;