import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Divider,
  Button,
  Popover,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  CalendarToday,
  FilterList,
  ExpandMore,
  Close,
  Check
} from '@mui/icons-material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format, addWeeks, subWeeks, addMonths, subMonths, parseISO } from 'date-fns';

const LeaveManagementView = () => {
  const [currentDateRange, setCurrentDateRange] = useState({
    start: '2025-06-29',
    end: '2025-07-05'
  });
  const [viewType, setViewType] = useState('week'); // 'week', 'month', 'list'
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [expandedDays, setExpandedDays] = useState([]);

  // Sample leave data
  const leaveData = {
    '2025-06-30': [
      {
        id: '1',
        employeeId: 'S2',
        employeeName: 'Lilly Williams',
        leaveType: 'Casual Leave',
        photo: '/user-photos/lilly.jpg'
      }
    ],
    '2025-07-01': [
      {
        id: '1',
        employeeId: 'S2',
        employeeName: 'Lilly Williams',
        leaveType: 'Casual Leave',
        photo: '/user-photos/lilly.jpg'
      },
      {
        id: '2',
        employeeId: 'S3',
        employeeName: 'Clarkson Walter',
        leaveType: 'Earned Leave',
        photo: '/user-photos/clarkson.jpg'
      }
    ],
    '2025-07-02': [
      {
        id: '1',
        employeeId: 'S2',
        employeeName: 'Lilly Williams',
        leaveType: 'Casual Leave',
        photo: '/user-photos/lilly.jpg'
      },
      {
        id: '2',
        employeeId: 'S3',
        employeeName: 'Clarkson Walter',
        leaveType: 'Earned Leave',
        photo: '/user-photos/clarkson.jpg'
      }
    ],
    '2025-07-03': [
      {
        id: '2',
        employeeId: 'S3',
        employeeName: 'Clarkson Walter',
        leaveType: 'Earned Leave',
        photo: '/user-photos/clarkson.jpg'
      }
    ]
  };

  const handlePrevPeriod = () => {
    if (viewType === 'week') {
      const newStart = subWeeks(parseISO(currentDateRange.start), 1);
      const newEnd = subWeeks(parseISO(currentDateRange.end), 1);
      setCurrentDateRange({
        start: format(newStart, 'yyyy-MM-dd'),
        end: format(newEnd, 'yyyy-MM-dd')
      });
    } else if (viewType === 'month') {
      const newStart = subMonths(parseISO(currentDateRange.start), 1);
      setCurrentDateRange({
        start: format(newStart, 'yyyy-MM-01'),
        end: format(new Date(newStart.getFullYear(), newStart.getMonth() + 1, 0), 'yyyy-MM-dd')
      });
    }
  };

  const handleNextPeriod = () => {
    if (viewType === 'week') {
      const newStart = addWeeks(parseISO(currentDateRange.start), 1);
      const newEnd = addWeeks(parseISO(currentDateRange.end), 1);
      setCurrentDateRange({
        start: format(newStart, 'yyyy-MM-dd'),
        end: format(newEnd, 'yyyy-MM-dd')
      });
    } else if (viewType === 'month') {
      const newStart = addMonths(parseISO(currentDateRange.start), 1);
      setCurrentDateRange({
        start: format(newStart, 'yyyy-MM-01'),
        end: format(new Date(newStart.getFullYear(), newStart.getMonth() + 1, 0), 'yyyy-MM-dd')
      });
    }
  };

  const handleDayClick = (day) => {
    setExpandedDays(prev =>
      prev.includes(day) 
        ? prev.filter(d => d !== day) 
        : [...prev, day]
    );
  };

  const handleFilterOpen = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const renderLeaveEvent = (event) => (
    <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5 }}>
      <Box sx={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        bgcolor: getLeaveColor(event.leaveType),
        mr: 1
      }} />
      <Typography variant="body2">
        {event.employeeName} - {event.leaveType}
      </Typography>
    </Box>
  );

  const getLeaveColor = (leaveType) => {
    const colors = {
      'Casual Leave': '#4CAF50',
      'Earned Leave': '#2196F3',
      'Sick Leave': '#FF9800',
      default: '#9E9E9E'
    };
    return colors[leaveType] || colors.default;
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Header with navigation */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handlePrevPeriod}>
            <ChevronLeft />
          </IconButton>
          
          <IconButton>
            <CalendarToday />
          </IconButton>
          
          <IconButton onClick={handleNextPeriod}>
            <ChevronRight />
          </IconButton>
          
          <Typography variant="h6" sx={{ mx: 2 }}>
            {format(parseISO(currentDateRange.start), 'dd-MMM-yyyy')} - {format(parseISO(currentDateRange.end), 'dd-MMM-yyyy')}
          </Typography>
        </Box>
        
        <Box>
          <IconButton 
            onClick={() => setViewType('list')}
            color={viewType === 'list' ? 'primary' : 'default'}
          >
            <Typography>List</Typography>
          </IconButton>
          <IconButton 
            onClick={() => setViewType('week')}
            color={viewType === 'week' ? 'primary' : 'default'}
          >
            <Typography>Week</Typography>
          </IconButton>
          <IconButton 
            onClick={() => setViewType('month')}
            color={viewType === 'month' ? 'primary' : 'default'}
          >
            <Typography>Month</Typography>
          </IconButton>
          
          <IconButton onClick={handleFilterOpen}>
            <FilterList />
          </IconButton>
        </Box>
      </Box>

      {/* Filter Popover */}
      <Popover
        open={Boolean(filterAnchorEl)}
        anchorEl={filterAnchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ p: 2, width: 300 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Filter</Typography>
            <IconButton onClick={handleFilterClose} size="small">
              <Close />
            </IconButton>
          </Box>
          
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Period</InputLabel>
            <Select value="custom" label="Period">
              <MenuItem value="last-week">Last Week</MenuItem>
              <MenuItem value="this-week">This Week</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            label="From"
            type="date"
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
            value={currentDateRange.start}
          />
          
          <TextField
            label="To"
            type="date"
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
            value={currentDateRange.end}
          />
          
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Department</InputLabel>
            <Select multiple value={['management']} label="Department">
              <MenuItem value="management">Management</MenuItem>
              <MenuItem value="development">Development</MenuItem>
              <MenuItem value="hr">HR</MenuItem>
            </Select>
          </FormControl>
          
          <FormControlLabel
            control={<Checkbox />}
            label="Show only reportees"
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button variant="outlined" onClick={handleFilterClose}>
              Reset
            </Button>
            <Button variant="contained" onClick={handleFilterClose}>
              Apply
            </Button>
          </Box>
        </Box>
      </Popover>

      {/* Main Content */}
      {viewType === 'list' && (
        <Box>
          {Object.entries(leaveData).map(([date, leaves]) => (
            <Accordion 
              key={date}
              expanded={expandedDays.includes(date)}
              onChange={() => handleDayClick(date)}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  width: '100%',
                  justifyContent: 'space-between'
                }}>
                  <Typography>
                    {format(parseISO(date), 'dd-MMM-yyyy')}
                    {date === '2025-07-02' && ' (Today)'}
                  </Typography>
                  <Typography color="text.secondary">
                    Leave count: {leaves.length}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ width: '100%' }}>
                  {leaves.map(leave => (
                    <Box key={leave.id} sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      py: 1,
                      borderBottom: '1px solid',
                      borderColor: 'divider'
                    }}>
                      <Avatar 
                        src={leave.photo} 
                        alt={leave.employeeName}
                        sx={{ width: 40, height: 40, mr: 2 }}
                      />
                      <Box>
                        <Typography>
                          {leave.employeeId} - {leave.employeeName}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: getLeaveColor(leave.leaveType),
                            mr: 1
                          }} />
                          <Typography variant="body2" color="text.secondary">
                            {leave.leaveType}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}

      {viewType === 'week' && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <FullCalendar
            plugins={[timeGridPlugin]}
            initialView="timeGridWeek"
            initialDate={currentDateRange.start}
            headerToolbar={false}
            height="auto"
            events={Object.entries(leaveData).flatMap(([date, leaves]) =>
              leaves.map(leave => ({
                title: `${leave.employeeName} - ${leave.leaveType}`,
                start: date,
                allDay: true,
                color: getLeaveColor(leave.leaveType)
              }))
            )}
          />
        </Paper>
      )}

      {viewType === 'month' && (
        <Paper sx={{ p: 2 }}>
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            initialDate={currentDateRange.start}
            headerToolbar={false}
            height="auto"
            events={Object.entries(leaveData).flatMap(([date, leaves]) =>
              leaves.map(leave => ({
                title: `${leave.employeeName} - ${leave.leaveType}`,
                start: date,
                allDay: true,
                color: getLeaveColor(leave.leaveType)
              }))
            )}
          />
        </Paper>
      )}
    </Box>
  );
};

export default LeaveManagementView;