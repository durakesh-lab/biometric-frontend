import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  IconButton,
  Tooltip,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  TextField,
  Button,
  Divider,
  Collapse,
  Paper,
  useTheme,
  Popover,
  ClickAwayListener
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  FilterList as FilterListIcon,
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp as ArrowDropUpIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  CalendarToday as CalendarIcon,
    ChevronLeft as PrevIcon,
  ChevronRight as NextIcon,
} from '@mui/icons-material';

import ReactPaginate from 'react-paginate';

const LeaveRequestTracker = () => {
 const theme = useTheme();
  const [selected, setSelected] = useState([]);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null)
  const [period, setPeriod] = useState('366');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [leaveType, setLeaveType] = useState('-1');
  const [employeeStatus, setEmployeeStatus] = useState('3');
  const [directReportsOnly, setDirectReportsOnly] = useState(false);

    // Pagination state
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);


  // Sample data
  const leaveRequests = [
    {
      id: '240375000000305015',
      employee: { name: 'Clarkson Walter', code: 'S3' },
      leaveType: 'Earned Leave',
      type: 'Paid',
      period: '01-Jul-2025 - 03-Jul-2025',
      daysTaken: '3 Day(s)',
      requestDate: '30-Jun-2025'
    },
    {
      id: '240375000000305001',
      employee: { name: 'Lilly Williams', code: 'S2' },
      leaveType: 'Casual Leave',
      type: 'Paid',
      period: '30-Jun-2025 - 02-Jul-2025',
      daysTaken: '3 Day(s)',
      requestDate: '30-Jun-2025'
    },
    {
      id: '240375000000286217',
      employee: { name: 'Lilly Williams', code: 'S2' },
      leaveType: 'Casual Leave',
      type: 'Paid',
      period: '23-Jun-2025 - 25-Jun-2025',
      daysTaken: '3 Day(s)',
      requestDate: '13-Jun-2025'
    }
    
  ];

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = leaveRequests.map((request) => request.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleApplyFilter = () => {
    // Filter logic here
    handleFilterClose();
  };

  const handleResetFilter = () => {
    setPeriod('366');
    setFromDate('');
    setToDate('');
    setLeaveType('-1');
    setEmployeeStatus('3');
    setDirectReportsOnly(false);
  };

  const filterOpen = Boolean(filterAnchorEl);
  const filterId = filterOpen ? 'filter-popover' : undefined;





      // Calculate paginated data
  const paginatedRequests = leaveRequests.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
    // Handle rows per page change
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1); // Reset to first page when changing rows per page
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  return (
<Paper sx={{ p: 2, borderRadius: 2, boxShadow: theme.shadows[1] }}>
      {/* Header with action buttons */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2,
        position: 'relative'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Select
            value="leave"
            size="small"
            sx={{ minWidth: 120 }}
            IconComponent={ArrowDropDownIcon}
          >
            <MenuItem value="leave">Leave</MenuItem>
          </Select>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Action buttons that appear when rows are selected */}
          {selected.length > 0 && (
            <Box sx={{ 
              display: 'flex', 
              position: 'absolute', 
              left: 0, 
              right: 0, 
              justifyContent: 'center',
              gap: 1
            }}>
              <Button 
                variant="contained" 
                color="primary" 
                size="small"
                startIcon={<CheckIcon />}
                sx={{ minWidth: 'auto' }}
              >
                Approve
              </Button>
              <Button 
                variant="outlined" 
                color="error" 
                size="small"
                startIcon={<DeleteIcon />}
                sx={{ minWidth: 'auto' }}
              >
                Delete
              </Button>
            </Box>
          )}
          
          <Button 
            variant="outlined" 
            size="small"
            onClick={handleFilterClick}
            startIcon={<FilterListIcon />}
            sx={{ 
              minWidth: 'auto',
              borderRight: `1px solid ${theme.palette.divider}`,
              borderRadius: '4px 0 0 4px'
            }}
          >
            Filter
          </Button>
          {/* <Button 
            variant="contained" 
            color="primary" 
            size="small"
            sx={{ 
              minWidth: 'auto',
              borderRadius: '0 4px 4px 0'
            }}
          >
            Add Request
          </Button> */}
          <IconButton size="small">
            <MoreVertIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Zoho-like Filter Popover */}
      <Popover
        id={filterId}
        open={filterOpen}
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
        PaperProps={{
          sx: {
            width: 600,
            maxHeight: '80vh',
            overflow: 'auto',
            p: 2,
            borderRadius: 2,
            boxShadow: theme.shadows[4]
          }
        }}
      >
        {/* <ClickAwayListener onClickAway={handleFilterClose}> */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Filter</Typography>
              <IconButton size="small" onClick={handleFilterClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer',
                  mb: 1,
                  p: 1,
                  backgroundColor: theme.palette.grey[100],
                  borderRadius: 1
                }}
              >
                <ArrowDropDownIcon fontSize="small" />
                <Typography variant="subtitle2" sx={{ ml: 1 }}>System filters</Typography>
              </Box>
              
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                gap: 2, 
                ml: 3,
                mt: 1
              }}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Period</InputLabel>
                  <Select
                    value={period}
                    label="Period"
                    onChange={(e) => setPeriod(e.target.value)}
                  >
                    <MenuItem value="7">Last 7 Days</MenuItem>
                    <MenuItem value="30">Last 30 Days</MenuItem>
                    <MenuItem value="90">Last Quarter</MenuItem>
                    <MenuItem value="180">Last Half Year</MenuItem>
                    <MenuItem value="366">This Year</MenuItem>
                    <MenuItem value="custom">Custom</MenuItem>
                  </Select>
                </FormControl>
                
                <TextField
                  label="From"
                  size="small"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: <CalendarIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
                  }}
                  disabled={period !== 'custom'}
                />
                
                <TextField
                  label="To"
                  size="small"
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: <CalendarIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
                  }}
                  disabled={period !== 'custom'}
                />
                
                <FormControl size="small" fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={leaveType}
                    label="Type"
                    onChange={(e) => setLeaveType(e.target.value)}
                  >
                    <MenuItem value="-1">All</MenuItem>
                    <MenuItem value="0">Paid</MenuItem>
                    <MenuItem value="1">Unpaid</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl size="small" fullWidth>
                  <InputLabel>Leave Type</InputLabel>
                  <Select
                    multiple
                    value={[]}
                    label="Leave Type"
                    renderValue={() => 'All Leave Types'}
                  >
                    <MenuItem value="earned">Earned Leave</MenuItem>
                    <MenuItem value="casual">Casual Leave</MenuItem>
                    <MenuItem value="sick">Sick Leave</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl size="small" fullWidth>
                  <InputLabel>Employee</InputLabel>
                  <Select
                    multiple
                    value={[]}
                    label="Employee"
                    renderValue={() => 'All Employees'}
                  >
                    <MenuItem value="1">Clarkson Walter</MenuItem>
                    <MenuItem value="2">Lilly Williams</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl size="small" fullWidth>
                  <InputLabel>User/Employee Profile</InputLabel>
                  <Select
                    value={employeeStatus}
                    label="User/Employee Profile"
                    onChange={(e) => setEmployeeStatus(e.target.value)}
                  >
                    <MenuItem value="1">All Users</MenuItem>
                    <MenuItem value="2">All Employee Profiles</MenuItem>
                    <MenuItem value="3">All Users & Employee Profiles</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl size="small" fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    multiple
                    value={[]}
                    label="Department"
                    renderValue={() => 'Select Department'}
                  >
                    <MenuItem value="hr">HR</MenuItem>
                    <MenuItem value="finance">Finance</MenuItem>
                    <MenuItem value="it">IT</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl size="small" fullWidth>
                  <InputLabel>Designation</InputLabel>
                  <Select
                    multiple
                    value={[]}
                    label="Designation"
                    renderValue={() => 'All Designations'}
                  >
                    <MenuItem value="manager">Manager</MenuItem>
                    <MenuItem value="developer">Developer</MenuItem>
                    <MenuItem value="analyst">Analyst</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 1,
              p: 1,
              backgroundColor: theme.palette.grey[100],
              borderRadius: 1
            }}>
              <Checkbox 
                size="small" 
                checked={directReportsOnly}
                onChange={(e) => setDirectReportsOnly(e.target.checked)}
              />
              <Typography variant="body2">Show only direct reportees</Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button 
                variant="outlined" 
                size="small"
                onClick={handleResetFilter}
              >
                Reset
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                size="small"
                onClick={handleApplyFilter}
              >
                Apply
              </Button>
            </Box>
          </Box>
        {/* </ClickAwayListener> */}
      </Popover>

      {/* Table */}
   <Box sx={{ 
  overflowX: 'auto',
  minHeight: 400, // Set a minimum height for the table container
  position: 'relative' // Needed for absolute positioning of empty state
}}>
  <Table sx={{ 
    minWidth: 800,
    height: '100%' // Make table fill the container height
  }}>
    <TableHead>
      <TableRow>
        <TableCell sx={{ width: 60 }}>
          <Tooltip title="More">
            <IconButton size="small">
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </TableCell>
        <TableCell sx={{ width: 60, textAlign: 'center' }}>
          <Checkbox
            size="small"
            indeterminate={selected.length > 0 && selected.length < leaveRequests.length}
            checked={leaveRequests.length > 0 && selected.length === leaveRequests.length}
            onChange={handleSelectAllClick}
          />
        </TableCell>
        <TableCell sx={{ minWidth: 200 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            Employee Name
            <Tooltip title="Sort">
              <IconButton size="small" sx={{ ml: 0.5 }}>
                <ArrowDropDownIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
        <TableCell sx={{ minWidth: 200 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            Leave type
            <Tooltip title="Sort">
              <IconButton size="small" sx={{ ml: 0.5 }}>
                <ArrowDropDownIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
        <TableCell sx={{ minWidth: 100 }}>Type</TableCell>
        <TableCell sx={{ minWidth: 200 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            Leave period
            <Tooltip title="Sort">
              <IconButton size="small" sx={{ ml: 0.5 }}>
                <ArrowDropDownIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
        <TableCell sx={{ minWidth: 100 }}>Days/hours taken</TableCell>
        <TableCell sx={{ minWidth: 100 }}>Date of request</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {paginatedRequests.length > 0 ? (
        paginatedRequests.map((request) => {
          const isItemSelected = isSelected(request.id);
          return (
            <TableRow 
              key={request.id} 
              hover
              selected={isItemSelected}
            >
              <TableCell>
                <Tooltip title="More">
                  <IconButton size="small">
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                <Checkbox 
                  size="small"
                  checked={isItemSelected}
                  onChange={(event) => handleClick(event, request.id)}
                />
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" component="span" sx={{ mr: 1 }}>
                    {request.employee.code} -
                  </Typography>
                  <Typography variant="body2" component="span" fontWeight="medium">
                    {request.employee.name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{request.leaveType}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{request.type}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{request.period}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{request.daysTaken}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{request.requestDate}</Typography>
              </TableCell>
            </TableRow>
          );
        })
      ) : (
        <TableRow style={{ height: 400 - 48 }}> {/* Adjust height based on header height */}
          <TableCell colSpan={8} align="center">
            <Typography variant="body2" color="textSecondary">
              No leave requests found
            </Typography>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</Box>

   {/* Pagination */}
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Typography variant="body2">
          Total Record Count: {leaveRequests.length}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Records per page</InputLabel>
            <Select
              value={rowsPerPage}
              label="Records per page"
              onChange={handleRowsPerPageChange}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={30}>30</MenuItem>
              <MenuItem value={40}>40</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={75}>75</MenuItem>
              <MenuItem value={100}>100</MenuItem>
              <MenuItem value={200}>200</MenuItem>
            </Select>
          </FormControl>
          
          <Box 
            sx={{
              '& .pagination': {
                display: 'flex',
                listStyle: 'none',
                padding: 0,
                margin: 0,
                alignItems: 'center',
              },
              '& .pagination li': {
                margin: '0 4px',
              },
              '& .pagination li a': {
                padding: '6px 12px',
                textDecoration: 'none',
                borderRadius: '4px',
                border: `1px solid ${theme.palette.divider}`,
                fontSize: theme.typography.body2.fontSize,
                color: theme.palette.text.primary,
                display: 'block',
              },
              '& .pagination li.selected a': {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                borderColor: theme.palette.primary.main,
                fontWeight: 500,
              },
              '& .pagination li.disabled a': {
                color: theme.palette.text.disabled,
                pointerEvents: 'none',
              },
              '& .pagination li.previous a, & .pagination li.next a': {
                display: 'flex',
                alignItems: 'center',
              },
            }}
          >
            <ReactPaginate
              previousLabel={<PrevIcon fontSize="small" />}
              nextLabel={<NextIcon fontSize="small" />}
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={Math.ceil(leaveRequests.length / rowsPerPage)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={({ selected }) => handlePageChange(selected + 1)}
              containerClassName={'pagination'}
              activeClassName={'selected'}
              previousClassName={'previous'}
              nextClassName={'next'}
              disabledClassName={'disabled'}
              forcePage={page - 1}
              pageClassName={'page-item'}
              pageLinkClassName={'page-link'}
              previousLinkClassName={'page-link'}
              nextLinkClassName={'page-link'}
            />
          </Box>
        </Box>
      </Box>
        </Paper>
  );
};

export default LeaveRequestTracker;