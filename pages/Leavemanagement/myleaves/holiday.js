import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  Button,
  Paper,
  useTheme,
  Drawer,
  TextField,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  TextareaAutosize,
  Divider,
  Tabs,
  Tab
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  CalendarToday as CalendarViewIcon,
  List as ListViewIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  Event as EventIcon
} from '@mui/icons-material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import { format, addYears, startOfYear, endOfYear } from 'date-fns';
import HolidaysByCalenderPage from '../../../components/leaves-management/users/holidayscalender';
import { zindexheader } from '@/store/authSlice';
import { useDispatch } from 'react-redux';
import Layout from '../../../components/Layout/Layout';
import LeaveManagementTabs from '../../../components/leaves-management/leavessection';

const HolidayManagement = () => {
  let dispatch=useDispatch()
  const theme = useTheme();
  const calendarRef = useRef(null);
  const [currentYear, setCurrentYear] = useState(2025);
  const [view, setView] = useState('list'); // 'list' or 'calendar'
  const [calendarView, setCalendarView] = useState('dayGridMonth'); // 'dayGridMonth', 'timeGridWeek', 'list'
  const [holidays, setHolidays] = useState([
    {
      id: '240375000000286193',
      name: 'Special Holiday',
      dates: ['2025-06-18', '2025-06-19', '2025-06-20'],
      location: '-',
      shift: 'General',
      classification: 'Holiday',
      description: 'Stay at home',
      color: '#ff9f89'
    },
    {
      id: '240375000000308001',
      name: 'Festival',
      dates: ['2025-07-05', '2025-07-06', '2025-07-07', '2025-07-08'],
      location: '-',
      shift: 'General',
      classification: 'Holiday',
      description: '',
      color: '#90caf9'
    }
  ]);
  const [filter, setFilter] = useState('myHolidays'); // 'myHolidays', 'allHolidays', 'allShift'
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentHoliday, setCurrentHoliday] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: startOfYear(new Date(2025, 0, 1)),
    end: endOfYear(new Date(2025, 0, 1))
  });

  // Handle year navigation
  const handlePreviousYear = () => {
    const newYear = currentYear - 1;
    setCurrentYear(newYear);
    const newDateRange = {
      start: startOfYear(new Date(newYear, 0, 1)),
      end: endOfYear(new Date(newYear, 0, 1))
    };
    setDateRange(newDateRange);
    if (calendarRef.current) {
      calendarRef.current.getApi().gotoDate(newDateRange.start);
    }
  };

  const handleNextYear = () => {
    const newYear = currentYear + 1;
    setCurrentYear(newYear);
    const newDateRange = {
      start: startOfYear(new Date(newYear, 0, 1)),
      end: endOfYear(new Date(newYear, 0, 1))
    };
    setDateRange(newDateRange);
    if (calendarRef.current) {
      calendarRef.current.getApi().gotoDate(newDateRange.start);
    }
  };

  // Handle view toggle between list and calendar
  const toggleView = () => {
    setView(view === 'list' ? 'calendar' : 'list');
  };

  // Handle calendar view change (month/week/list)
  const handleCalendarViewChange = (newView) => {
    setCalendarView(newView);
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(newView);
    }
  };

  // Handle holiday CRUD operations
  const handleAddHoliday = () => {
    setCurrentHoliday({
      id: Date.now().toString(),
      name: '',
      dates: [],
      location: '-',
      shift: 'General',
      classification: 'Holiday',
      description: '',
      color: '#90caf9'
    });
    dispatch(zindexheader(0))
    setDrawerOpen(true);
  };

  const handleEditHoliday = (holiday) => {
    setCurrentHoliday(holiday);
       dispatch(zindexheader(0))
    setDrawerOpen(true);
  };

  const handleDeleteHoliday = (id) => {
    setHolidays(holidays.filter(h => h.id !== id));
  };

  const handleSaveHoliday = () => {
    if (currentHoliday) {
      if (currentHoliday.id) {
        // Update existing holiday
        setHolidays(holidays.map(h => 
          h.id === currentHoliday.id ? currentHoliday : h
        ));
      } else {
        // Add new holiday
        setHolidays([...holidays, currentHoliday]);
      }
    }
    setDrawerOpen(false);
    dispatch(zindexheader(null))
  };

  // Format events for FullCalendar
  const calendarEvents = holidays.flatMap(holiday => 
    holiday.dates.map(date => ({
      id: holiday.id,
      title: holiday.name,
      start: date,
      allDay: true,
      color: holiday.color,
      extendedProps: {
        ...holiday
      }
    }))
  );

  // Handle calendar navigation
  const handleCalendarNavigate = (direction) => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      if (direction === 'prev') {
        calendarApi.prev();
      } else {
        calendarApi.next();
      }
      const view = calendarApi.view;
      setDateRange({
        start: view.activeStart,
        end: view.activeEnd
      });
    }
  };

  return (
      <Layout>  
          <LeaveManagementTabs />
    <Paper sx={{ p: 2, borderRadius: 2, boxShadow: theme.shadows[1], height: '100%' }}>
      {/* Header with navigation and controls */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={handlePreviousYear}>
            <ChevronLeftIcon />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EventIcon color="primary" />
            <Typography variant="h6">
              {format(dateRange.start, 'yyyy')} Holidays
            </Typography>
          </Box>
          
          <IconButton onClick={handleNextYear}>
            <ChevronRightIcon />
          </IconButton>
          
          <Typography variant="body1">
            {format(dateRange.start, 'MMM d, yyyy')} - {format(dateRange.end, 'MMM d, yyyy')}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={toggleView} color={view === 'list' ? 'primary' : 'default'}>
            {view === 'list' ? <CalendarViewIcon /> : <ListViewIcon />}
          </IconButton>
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>View</InputLabel>
            <Select
              value={filter}
              label="View"
              onChange={(e) => setFilter(e.target.value)}
            >
              <MenuItem value="myHolidays">My Holidays</MenuItem>
              {/* <MenuItem value="allHolidays">All Holidays</MenuItem>
              <MenuItem value="allShift">All Shift General</MenuItem> */}
            </Select>
          </FormControl>
          
          {/* <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleAddHoliday}
          >
            Add Holiday
          </Button> */}
          
          <IconButton>
            <FilterIcon />
          </IconButton>
          
          <IconButton>
            <MoreIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Main content area */}
      <Box sx={{ height: 'calc(100% - 64px)', overflow: 'auto' }}>
        {view === 'list' ? (
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Shifts</TableCell>
                <TableCell>Holiday Classification</TableCell>
                <TableCell>Description</TableCell>
                {/* <TableCell width={100}>Actions</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {holidays.map((holiday) => (
                <TableRow key={holiday.id}>
                  <TableCell>{holiday.name}</TableCell>
                  <TableCell>
                    {holiday.dates.map(date => (
                      <Box key={date} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        {format(new Date(date), 'EEE, MMM d, yyyy')}
                      </Box>
                    ))}
                  </TableCell>
                  <TableCell>{holiday.location}</TableCell>
                  <TableCell>{holiday.shift}</TableCell>
                  <TableCell>{holiday.classification}</TableCell>
                  <TableCell>{holiday.description}</TableCell>
                  {/* <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleEditHoliday(holiday)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => handleDeleteHoliday(holiday.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
           <HolidaysByCalenderPage holidays={holidays} />
        )}
      </Box>

      {/* Holiday Edit/Add Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() =>{ setDrawerOpen(false);dispatch(zindexheader(null))}}
        sx={{
          '& .MuiDrawer-paper': {
            width: '40%',
            minWidth: 400,
            p: 3
          }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3 
        }}>
          <Typography variant="h6">
            {currentHoliday?.id ? 'Edit Holiday' : 'Add Holiday'}
          </Typography>
          <IconButton onClick={() =>{ setDrawerOpen(false);dispatch(zindexheader(null))}}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Name"
            fullWidth
            value={currentHoliday?.name || ''}
            onChange={(e) => setCurrentHoliday({...currentHoliday, name: e.target.value})}
          />
          
          <Box>
            <Typography variant="subtitle2" gutterBottom>Date</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="From"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={currentHoliday?.dates?.[0] || ''}
                onChange={(e) => {
                  const dates = [...(currentHoliday?.dates || [])];
                  dates[0] = e.target.value;
                  setCurrentHoliday({...currentHoliday, dates});
                }}
              />
              <TextField
                label="To"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={currentHoliday?.dates?.[currentHoliday?.dates?.length - 1] || ''}
                onChange={(e) => {
                  const dates = [...(currentHoliday?.dates || [])];
                  if (dates.length > 1) {
                    dates[dates.length - 1] = e.target.value;
                  } else {
                    dates.push(e.target.value);
                  }
                  setCurrentHoliday({...currentHoliday, dates});
                }}
              />
            </Box>
          </Box>
          
          <FormControl fullWidth>
            <InputLabel>Classification</InputLabel>
            <Select
              label="Classification"
              value={currentHoliday?.classification || 'Holiday'}
              onChange={(e) => setCurrentHoliday({...currentHoliday, classification: e.target.value})}
            >
              <MenuItem value="Holiday">Holiday</MenuItem>
              <MenuItem value="Public Holiday">Public Holiday</MenuItem>
              <MenuItem value="Company Holiday">Company Holiday</MenuItem>
            </Select>
          </FormControl>
          
          <Box>
            <Typography variant="subtitle2" gutterBottom>Applicable for</Typography>
            <FormControl fullWidth>
              <InputLabel>Shift</InputLabel>
              <Select
                label="Shift"
                value={currentHoliday?.shift || 'General'}
                onChange={(e) => setCurrentHoliday({...currentHoliday, shift: e.target.value})}
              >
                <MenuItem value="General">General</MenuItem>
                <MenuItem value="Morning">Morning</MenuItem>
                <MenuItem value="Evening">Evening</MenuItem>
                <MenuItem value="Night">Night</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <TextField
            label="Description"
            multiline
            rows={4}
            fullWidth
            value={currentHoliday?.description || ''}
            onChange={(e) => setCurrentHoliday({...currentHoliday, description: e.target.value})}
          />
          
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              No of day(s) before when the reminder email is to be sent
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Days</InputLabel>
              <Select
                label="Days"
                value={7} // Default value
              >
                <MenuItem value={1}>1 Day</MenuItem>
                <MenuItem value={3}>3 Days</MenuItem>
                <MenuItem value={7}>7 Days</MenuItem>
                <MenuItem value={14}>14 Days</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Notify applicable employees via feeds"
          />
          
          <FormControlLabel
            control={<Checkbox />}
            label="Reprocess leave applications based on this added holiday"
          />
          
          <Typography variant="caption" color="textSecondary">
            Note: Shift based holiday will override the location based holiday.
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() =>{ setDrawerOpen(false);dispatch(zindexheader(null))}}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSaveHoliday}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Paper>
     </Layout> 
  );
};

export default HolidayManagement;