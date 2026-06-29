import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Avatar, Button, IconButton, 
  Divider, Tabs, Tab, Chip, Stack, TextField, 
  InputAdornment, FormControl, InputLabel, Select, 
  MenuItem, Checkbox, FormControlLabel, Pagination,
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Card, CardHeader, CardContent,
  Badge, Tooltip, useTheme
} from '@mui/material';
import { 
  Search, FilterList, ChevronLeft, ChevronRight,
  CalendarToday, ArrowForward, ArrowBack, 
  MoreVert, Close, KeyboardArrowDown,
  KeyboardArrowUp, InfoOutlined
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Layout from '../../../components/Layout/Layout';
import ZohoHeader from '../../../components/leaves-management/users/topheader';
import EmployeeGrid from '../../../components/leaves-management/users/userslistingrid';
import { ZohoStyledTable } from '../../../components/leaves-management/users/reporteestable';
import LeaveManagementView from '../../../components/leaves-management/users/onleaves';
import LeaveRequestTracker from '../../../components/leaves-management/users/leaverequest';
import HolidayManagement from '../../../components/leaves-management/users/holidays';

const LeaveManagementPage = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date('2025-06-29'),
    end: new Date('2025-07-05')
  });

  // Sample data
  const employees = [
    {
      id: '1',
      name: 'Lilly Williams',
      code: 'S2',
      avatar: '/avatars/1.jpg',
      status: 'Casual Leave',
      daysBooked: 6,
      shift: 'General - 9:00 AM - 6:00 PM'
    },
    {
      id: '2',
      name: 'Clarkson Walter',
      code: 'S3',
      avatar: '/avatars/2.jpg',
      status: 'Yet to check-in',
      daysBooked: 3,
      shift: 'General - 9:00 AM - 6:00 PM'
    },
    // ... more employees
  ];

  const leaveTypes = [
    {
      id: '1',
      name: 'Casual Leave',
      icon: 'PI_caslv',
      available: 9,
      booked: 3,
      color: 'lv_bgclr2'
    },
    {
      id: '2',
      name: 'Earned Leave',
      icon: 'PI_erndlv',
      available: 12,
      booked: 0,
      color: 'lv_bgclr10'
    },
    // ... more leave types
  ];

  const leaveHistory = [
    {
      id: '1',
      date: '23-Jun-2025 - 25-Jun-2025',
      type: 'Casual Leave',
      days: 3,
      reason: 'personal reason'
    },
    {
      id: '2',
      date: '20-Jun-2025',
      type: 'Special Holiday',
      days: 1,
      reason: 'stay at home'
    },
    // ... more leave history
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
    setPage(1);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <Layout>  
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Leave Management</Typography>
       
      </Box>
            {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Reportees" />
          <Tab label="On Leave" />
          <Tab label="Leave Requests" />
           <Tab label="holidays" />

          {/* <Tab label="Leave Summary" />
          <Tab label="Leave Balance" /> */}
        </Tabs>
      </Paper>

        {tabValue === 0 && <>   
        <ZohoHeader setViewMode={setViewMode}  />

    {viewMode === 'grid' ?  <EmployeeGrid /> :
        <ZohoStyledTable employees={employees} />} 


            </>  }
 {tabValue === 1 && <>   
        <LeaveManagementView />


            </>  }
             {tabValue === 2 && <>   
        <LeaveRequestTracker />


            </>  }
                  {tabValue === 3 && <>   
        <HolidayManagement />


            </>  }
            
            
    <Box sx={{ p: 3 }}>
      {/* Header with navigation */}
  

  

  
    </Box>
     </Layout>
  );
};

export default LeaveManagementPage;