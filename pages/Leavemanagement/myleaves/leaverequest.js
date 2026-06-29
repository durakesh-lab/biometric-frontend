import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  Button,
  Typography,
  useTheme,
  Popover,
  Divider,
  ListItemIcon,
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  ArrowBack as BackIcon,
  Fullscreen as FullscreenIcon,
  FilterList as FilterIcon,
  ChevronLeft as PrevIcon,
  ChevronRight as NextIcon,
  CalendarToday as CalendarIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  ImportExport as ImportExportIcon,
  FileDownload as ExportIcon,
  FileUpload as ImportIcon,
} from '@mui/icons-material';
import ReactPaginate from 'react-paginate';
import LeaveManagementTabs from '../../../components/leaves-management/leavessection';
import Layout from '../../../components/Layout/Layout';
import LeaveApplicationForm from '../../../components/leaves-management/applyleave';

const LeaveRequestsTable = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [selected, setSelected] = useState([]);

  const leaveRequests = [
    {
      id: '240375000000286205',
      employeeId: '1',
      employeeName: 'rajat gour',
      leaveType: 'Casual Leave',
      leaveCategory: 'Paid',
      leavePeriod: '23-Jun-2025 - 25-Jun-2025',
      daysTaken: '3 Day(s)',
      requestDate: '13-Jun-2025',
    },
    // Add more leave requests as needed
  ];

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFilterOpen = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleActionMenuOpen = (event) => {
    setActionAnchorEl(event.currentTarget);
  };

  const handleActionMenuClose = () => {
    setActionAnchorEl(null);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = leaveRequests.map((request) => request.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleCheckboxClick = (event, id) => {
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

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const filterOpen = Boolean(filterAnchorEl);
  const filterId = filterOpen ? 'filter-popover' : undefined;

  const actionOpen = Boolean(actionAnchorEl);
  const actionId = actionOpen ? 'action-popover' : undefined;
  const [openForm, setOpenForm] = useState(false);

  return (
    <Layout> 
      <LeaveManagementTabs />
        <LeaveApplicationForm
                      open={openForm} 
                      onClose={() => setOpenForm(false)} 
                    />
      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Left side content if needed */}
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button     onClick={() => setOpenForm(true)} variant="contained" color="primary">
              Add Request
            </Button>
            <IconButton 
              aria-label="filter"
              onClick={handleFilterOpen}
              sx={{
                backgroundColor: filterOpen ? theme.palette.action.selected : 'inherit',
              }}
            >
              <FilterIcon />
            </IconButton>
            <IconButton 
              aria-label="more options"
              onClick={handleActionMenuOpen}
              sx={{
                backgroundColor: actionOpen ? theme.palette.action.selected : 'inherit',
              }}
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Filter Popover */}
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
          sx={{
            '& .MuiPaper-root': {
              width: '400px',
              maxHeight: '80vh',
              overflow: 'auto',
              p: 2,
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Filter</Typography>
            <IconButton size="small" onClick={handleFilterClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl size="small" fullWidth>
              <InputLabel>Period</InputLabel>
              <Select value="366" label="Period">
                <MenuItem value="366">This Year</MenuItem>
                <MenuItem value="30">This Month</MenuItem>
                <MenuItem value="7">This Week</MenuItem>
                <MenuItem value="0">Custom</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl size="small" fullWidth>
              <TextField
                label="From"
                type="date"
                InputLabelProps={{ shrink: true }}
                disabled={false}
              />
            </FormControl>
            
            <FormControl size="small" fullWidth>
              <TextField
                label="To"
                type="date"
                InputLabelProps={{ shrink: true }}
                disabled={false}
              />
            </FormControl>
            
            <FormControl size="small" fullWidth>
              <InputLabel>Type</InputLabel>
              <Select value="-1" label="Type">
                <MenuItem value="-1">All</MenuItem>
                <MenuItem value="0">Paid</MenuItem>
                <MenuItem value="3">Unpaid</MenuItem>
                <MenuItem value="1">On Duty</MenuItem>
                <MenuItem value="4">Compensatory Off</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl size="small" fullWidth>
              <InputLabel>Leave Type</InputLabel>
              <Select multiple value={[]} label="Leave Type">
                <MenuItem value="240375000000281016">Absent</MenuItem>
                <MenuItem value="240375000000281062">Casual Leave</MenuItem>
                <MenuItem value="240375000000281070">Earned Leave</MenuItem>
                <MenuItem value="240375000000281066">Sick Leave</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button variant="outlined" onClick={handleFilterClose}>Reset</Button>
            <Button variant="contained" color="primary" onClick={handleFilterClose}>Apply</Button>
          </Box>
        </Popover>

        {/* Action Menu Popover */}
        <Popover
          id={actionId}
          open={actionOpen}
          anchorEl={actionAnchorEl}
          onClose={handleActionMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <Box sx={{ p: 1 }}>
            <MenuItem onClick={handleActionMenuClose}>
              <ListItemIcon>
                <ImportIcon fontSize="small" />
              </ListItemIcon>
              Import
            </MenuItem>
            <MenuItem onClick={handleActionMenuClose}>
              <ListItemIcon>
                <ExportIcon fontSize="small" />
              </ListItemIcon>
              Export
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleActionMenuClose}>Refresh</MenuItem>
          </Box>
        </Popover>

        {/* Table */}
        <TableContainer component={Paper} sx={{height: 'calc(100vh - 250px)', // Example: 100vh minus header, tabs, buttons, pagination, etc.
 boxShadow: 'none', border: `1px solid ${theme.palette.divider}` }}>
          <Table aria-label="leave requests table" size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                <TableCell width="60px">
                  <IconButton size="small" disabled>
                    <MoreIcon fontSize="small" />
                  </IconButton>
                </TableCell>
                <TableCell width="40px" align="center">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < leaveRequests.length}
                    checked={leaveRequests.length > 0 && selected.length === leaveRequests.length}
                    onChange={handleSelectAllClick}
                    size="small"
                  />
                </TableCell>
                <TableCell width="200px">
                  <Typography variant="subtitle2">Employee Name</Typography>
                </TableCell>
                <TableCell width="200px">
                  <Typography variant="subtitle2">Leave type</Typography>
                </TableCell>
                <TableCell width="100px">
                  <Typography variant="subtitle2">Type</Typography>
                </TableCell>
                <TableCell width="200px">
                  <Typography variant="subtitle2">Leave period</Typography>
                </TableCell>
                <TableCell width="100px">
                  <Typography variant="subtitle2">Days/hours taken</Typography>
                </TableCell>
                <TableCell width="100px">
                  <Typography variant="subtitle2">Date of request</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaveRequests.map((request) => {
                const isItemSelected = isSelected(request.id);
                return (
                  <TableRow
                    key={request.id}
                    hover
                    selected={isItemSelected}
                    sx={{
                      '&:last-child td': { borderBottom: 0 },
                      '&.Mui-selected': { backgroundColor: theme.palette.action.selected },
                    }}
                  >
                    <TableCell>
                      <IconButton
                        size="small"
                        aria-label="more"
                        onClick={handleMenuOpen}
                      >
                        <MoreIcon fontSize="small" />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                      >
                        <MenuItem onClick={handleMenuClose}>View</MenuItem>
                        <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
                        <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
                      </Menu>
                    </TableCell>
                    <TableCell align="center">
                      <Checkbox
                        checked={isItemSelected}
                        onChange={(event) => handleCheckboxClick(event, request.id)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {request.employeeId} - {request.employeeName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{request.leaveType}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{request.leaveCategory}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{request.leavePeriod}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{request.daysTaken}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{request.requestDate}</Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

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
      </Box>
    </Layout>
  );
};

export default LeaveRequestsTable;