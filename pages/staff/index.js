import React, { useState, useEffect, useMemo } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  TextField,
  Grid,
  InputAdornment,
  Checkbox,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Tooltip,
  Divider,
  Modal,
  CircularProgress,
  Snackbar,
  Alert,
  Fab
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterList as FilterIcon,
  ArrowDownward as ArrowDownIcon,
  ArrowUpward as ArrowUpIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  Business as BusinessIcon,
  AccountTree as BranchIcon,
  Person as PersonIcon,
  Badge as RoleIcon,
  Work as DepartmentIcon,
  VisibilityOff
} from '@mui/icons-material';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { confirnDeleteAction, editStaffAction, getStaffList } from '@/store/authSlice';
import Layout from '../../components/Layout/Layout';
import MyComponent from '../../components/deletepopup';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import ViewStaffModal from '../../components/Dashboard/viewstaff';

const StaffListPage = () => {
  // State for companies
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  // State for branches
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [loadingBranches, setLoadingBranches] = useState(false);

  // State for departments
  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  // State for table data and UI
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const dispatch = useDispatch();
  const deletepopup = useSelector((state) =>{return  state.users});
  const checkdelete = useSelector((state) =>{return  state.auth});

  const { getStaffListData } = useSelector(state => state.auth);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 10,
    total_pages: 1,
    count: 0
  });

  // Sorting state
  const [sorting, setSorting] = useState({
    field: 'id',
    direction: 'desc'
  });

  // Search state
  const [search, setSearch] = useState('');

  // Filter modal state
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    department: '',
    active_status: '',
    ordering: ""
  });

  // Add staff modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    role: '',
    active_status: 'Active',
    joining_date: '',
    date_of_birth: '',
    branchId: '',
    companyId: '',
    department: ''
  });

  // Menu state for actions
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const openMenu = Boolean(anchorEl);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  let [currentStaff, setCurrentStaff] = useState({});

  // View modal state
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedStaffView, setSelectedStaffView] = useState({});

  // Role types
  // const roleTypes = ['Super Admin', 'HR Admin', 'Manager', 'Employee', 'Guest'];
  const roleTypes = ['HR Admin', 'Manager', 'Employee', 'Guest'];

  // Status types
  const statusTypes = ['Active', 'Inactive'];

  // Columns configuration
  const columns = [
    { id: 'checkbox', label: '', sortable: false },
    { id: 'srNo', label: 'SN.', sortable: false },
    { id: 'firstName', label: 'First Name', sortable: true },
    { id: 'lastName', label: 'Last Name', sortable: true },
    { id: 'email', label: 'Email', sortable: true },
    { id: 'role', label: 'Role', sortable: true },
    { id: 'active_status', label: 'Status', sortable: true },
    { id: 'view', label: 'View', sortable: false },
    { id: 'actions', label: 'Actions', sortable: false }
  ];

  // Fetch companies data
  const fetchCompanies = async () => {
    try {
      setLoadingCompanies(true);
      let token = localStorage.getItem("token");
      
      const response = await axios.get(
        `http://localhost:3001/company`, {
          headers: { Authorization: token }
        }
      );
      
      setCompanies(response.data?.data);
      setLoadingCompanies(false);
    } catch (error) {
      console.error('Error fetching companies:', error);
      setLoadingCompanies(false);
    }
  };

  // Fetch branches data
  const fetchBranches = async (companyId) => {
    if (!companyId) return;
    
    try {
      setLoadingBranches(true);
      let token = localStorage.getItem("token");
      
      const response = await axios.get(
        `http://localhost:3001/company/${companyId}/branches`, {
          headers: { Authorization: token }
        }
      );
      
      setBranches(response.data?.data);
      setLoadingBranches(false);
    } catch (error) {
      console.error('Error fetching branches:', error);
      setLoadingBranches(false);
    }
  };

  // Fetch departments data
  const fetchDepartments = async (branchId) => {
    if (!branchId) return;
    
    try {
      setLoadingDepartments(true);
      let token = localStorage.getItem("token");
      
      const response = await axios.get(
        `http://localhost:3001/department/${branchId}`, {
          headers: { Authorization: token }
        }
      );
      
      setDepartments(response.data?.data);
      setLoadingDepartments(false);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setLoadingDepartments(false);
    }
  };

  // Fetch staff data
  const fetchStaff = async () => {
    if (!selectedBranch || !selectedCompany) return;
    
    try {
      setLoading(true);
      
      // Construct query params
      const params = {
        page: pagination.page,
        page_size: pagination.page_size,
        search: search,
        ordering: sorting.direction === 'desc' ? `-${sorting.field}` : sorting.field,
        ...filters
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null) {
          delete params[key];
        }
      });

// console.log(params,"paramsparamsparams###########")
      // const queryString = new URLSearchParams({
       
      //   // Add any other query params here if needed
      // }).toString();
      let token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:3001/users/allusers`,
        { branchId: selectedBranch, companyId: selectedCompany },
        {
          headers: { Authorization: token },
          params
        }
      );
      
      setStaff(response.data?.data);
      setPagination({
        ...pagination,
        total_pages: Math.ceil(response.data.count / pagination.page_size),
        count: response.data.count
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching staff:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      fetchBranches(selectedCompany);
      setSelectedBranch(null); // Reset branch selection when company changes
      setNewStaff(prev => ({ ...prev, companyId: selectedCompany }));
    }
  }, [selectedCompany]);

  useEffect(() => {
    if (selectedBranch) {
      fetchDepartments(selectedBranch);
      fetchStaff();
      setNewStaff(prev => ({ ...prev, branchId: selectedBranch }));
    }
  }, [selectedBranch, pagination.page, pagination.page_size, sorting, search, deletepopup?.edituserdata]);

  // Handle select all
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(staff.map(staff => staff.id));
      setShowDelete(true);
    } else {
      setSelected([]);
      setShowDelete(false);
    }
  };

  // Handle single select
  const handleSelect = (event, id) => {
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
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
    setShowDelete(newSelected.length > 0);
  };

  // Handle sort
  const handleSort = (field) => {
    const isAsc = sorting.field === field && sorting.direction === 'asc';
    setSorting({
      field: field,
      direction: isAsc ? 'desc' : 'asc'
    });
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  // Handle page size change
  const handlePageSizeChange = (event) => {
    setPagination({ ...pagination, page_size: event.target.value, page: 1 });
  };

  // Handle filter change
  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value
    });
  };

  // Apply filters
  const applyFilters = () => {
    setFilterOpen(false);
    setPagination({ ...pagination, page: 1 });
    fetchStaff();
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      firstName: '',
      lastName: '',
      email: '',
      role: '',
      department: '',
      active_status: '',
      ordering: ""
    });
  };

  // Handle menu click
  const handleMenuClick = (event, staff) => {
    setAnchorEl(event.currentTarget);
    setSelectedStaff(staff);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle delete confirmation
  const handleConfirmDelete = (id) => {
    dispatch(confirnDeleteAction("sure"));
    sessionStorage.setItem("deleteIds", JSON.stringify(id._id));
  };

  // Handle delete
  const handleDelete = async (id) => {
    id = JSON.parse(sessionStorage.getItem("deleteIds"));
    try {
      let token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:3001/users/deleteUser/${id}`, {
        headers: { Authorization: token }
      });
      
      if(response?.data.detail) {
        setOpenSnackbar(response?.data.detail);
      } else {
        setOpenSnackbar({status: true, message: 'Staff deleted successfully'});
        setSelected([]);
        setShowDelete(false);
        dispatch(confirnDeleteAction(false));
        fetchStaff();
      }
    } catch (error) {
      console.error('Error deleting staff:', error);
      setOpenSnackbar(error.response?.data?.detail || 'Error deleting staff');
    }
    handleMenuClose();
  };

  useEffect(() => {
    if (checkdelete?.confirnDelete === true) {
      handleDelete();
    }
  }, [checkdelete?.confirnDelete]);

  // Get serial number
  const getSerialNumber = (index) => {
    return (pagination.page - 1) * pagination.page_size + index + 1;
  };

  // Handle edit
  const handleEdit = () => {
    if (selectedStaff) {
      setCurrentStaff(selectedStaff);
      setEditModalOpen(true);
    }
    handleMenuClose();
  };

  const handleEditSubmit = async (values) => {
    try {
      values = {...values, id: values._id};
      dispatch(editStaffAction(values));
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error updating staff:', error);
    }
  };

  // Handle add staff
  const handleAddStaff = async (values) => {
    try {
      let token = localStorage.getItem("token");
      const response = await axios.post('http://localhost:3001/auth/register', values, {
        headers: { Authorization: token }
      });
      
      setOpenSnackbar({status: true, message: 'Staff added successfully'});
      setAddModalOpen(false);
      fetchStaff();
    } catch (error) {
      console.error('Error adding staff:', error);
      setOpenSnackbar(error.response?.data?.detail || 'Error adding staff');
    }
  };

  // Handle view click
  const handleViewClick = (staff) => {
    setSelectedStaffView(staff);
    setViewModalOpen(true);
  };

  // Handle snackbar close
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  // Validation schema
  const validationSchema = Yup.object({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    username: Yup.string().required("Required"),
    // password: Yup.string().required("Required"),
    role: Yup.string().required("Required"),
    active_status: Yup.string().required("Required"),
  });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

//   useEffect(() => {
//     dispatch(getStaffList());
//   }, [dispatch]);


// Helper functions for date validation
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const getMinBirthDate = () => {
  const today = new Date();
  const minBirthDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  return minBirthDate.toISOString().split('T')[0];
};
const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Layout>
        <Grid container spacing={3}>
          {/* Header Section */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={0} sx={{ flexWrap: 'wrap', rowGap: 2 }}>
              <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 600 }}>
                Staff List
              </Typography>
              
              <Box display="flex" alignItems="center" gap={1}>
                {showDelete && (
                  <Tooltip title={`Delete selected (${selected.length})`}>
                    <IconButton
                      color="error"
                      onClick={() => handleConfirmDelete(selected)}
                    >
                      <DeleteIcon />
                      <Typography variant="caption" sx={{ ml: 0.5 }}>
                        ({selected.length})
                      </Typography>
                    </IconButton>
                  </Tooltip>
                )}
                
                <Button
                  startIcon={<FilterIcon sx={{ color: 'text.secondary' }} />}
                  onClick={() => setFilterOpen(true)}
                  sx={{ 
                    backgroundColor: '#f5f5f5',
                    color: 'text.secondary',
                    '&:hover': {
                      backgroundColor: '#e0e0e0'
                    }
                  }}
                >
                  <Typography variant="body2">Sort & Filter</Typography>
                </Button>
                
                {/* Role Filter Dropdown */}
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={filters.role || ''}
                    label="Role"
                    onChange={(e) => handleFilterChange('role', e.target.value)}
                    sx={{ color: 'text.secondary' }}
                    startAdornment={
                      <InputAdornment position="start">
                        <RoleIcon fontSize="small" />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="">All Roles</MenuItem>
                    {roleTypes.map((role) => (
                      <MenuItem key={role} value={role}>
                        {role}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                {/* Department Filter Dropdown */}
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={filters.department || ''}
                    label="Department"
                    onChange={(e) => handleFilterChange('department', e.target.value)}
                    sx={{ color: 'text.secondary' }}
                    startAdornment={
                      <InputAdornment position="start">
                        <DepartmentIcon fontSize="small" />
                      </InputAdornment>
                    }
                    disabled={loadingDepartments || !selectedBranch}
                  >
                    <MenuItem value="">All Departments</MenuItem>
                    {departments.map((dept) => (
                      <MenuItem key={dept._id} value={dept._id}>
                        {dept.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: 200 }}
                />
              </Box>
            </Box>
          </Grid>

          {/* Company Selection */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="company-select-label">Select Company</InputLabel>
              <Select
                labelId="company-select-label"
                id="company-select"
                value={selectedCompany || ''}
                label="Select Company"
                onChange={(e) => setSelectedCompany(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <BusinessIcon />
                  </InputAdornment>
                }
                disabled={loadingCompanies}
              >
                {loadingCompanies ? (
                  <MenuItem disabled>
                    <CircularProgress size={24} />
                  </MenuItem>
                ) : (
                  companies?.map((company) => (
                    <MenuItem key={company._id} value={company._id}>
                      {company.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Grid>

          {/* Branch Selection - Only show if company is selected */}
          {selectedCompany && (
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="branch-select-label">Select Branch</InputLabel>
                <Select
                  labelId="branch-select-label"
                  id="branch-select"
                  value={selectedBranch || ''}
                  label="Select Branch"
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <BranchIcon />
                    </InputAdornment>
                  }
                  disabled={loadingBranches}
                >
                  {loadingBranches ? (
                    <MenuItem disabled>
                      <CircularProgress size={24} />
                    </MenuItem>
                  ) : branches.length === 0 ? (
                    <MenuItem disabled>
                      No branches available
                    </MenuItem>
                  ) : (
                    branches.map((branch) => (
                      <MenuItem key={branch._id} value={branch._id}>
                        {branch.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>
          )}

          {/* Staff Table - Only show if branch is selected */}
          {selectedBranch ? (
            <>
              <Grid item xs={12}>
                <TableContainer elevation={0} component={Paper} sx={{height: "350px"}}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#F3F4F6' }}>
                        {columns.map((column) => (
                          <TableCell 
                            key={column.id}
                            sx={{ 
                              position: 'sticky',
                              top: 0,
                              backgroundColor: '#F3F4F6',
                              zIndex: 1,
                              whiteSpace: 'nowrap',
                              textAlign: column.id === 'checkbox' ? 'left' : 'center',
                              verticalAlign: 'middle',
                              padding: column.id === 'checkbox' ? '0 0 0 16px' : '16px',
                            }}
                          >
                            {column.sortable ? (
                              <Box 
                                display="flex" 
                                alignItems="center" 
                                justifyContent="center"
                                sx={{ cursor: 'pointer', color: 'text.secondary' }}
                                onClick={() => handleSort(column.id)}
                              >
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {column.label}
                                </Typography>
                                {sorting.field === column.id ? (
                                  sorting.direction === 'asc' ? (
                                    <ArrowUpIcon fontSize="small" sx={{ ml: 0.5 }} />
                                  ) : (
                                    <ArrowDownIcon fontSize="small" sx={{ ml: 0.5 }} />
                                  )
                                ) : (
                                  <ArrowDownIcon fontSize="small" sx={{ ml: 0.5, opacity: 0.4 }} />
                                )}
                              </Box>
                            ) : column.id === 'checkbox' ? (
                              <Checkbox
                                indeterminate={selected.length > 0 && selected.length < staff.length}
                                checked={staff.length > 0 && selected.length === staff.length}
                                onChange={handleSelectAll}
                                sx={{ 
                                  padding: '8px',
                                  marginLeft: '-4px'
                                }}
                              />
                            ) : (
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {column.label}
                              </Typography>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={columns.length} align="center">
                            <CircularProgress 
                              size={60} 
                              thickness={4}
                              sx={{ 
                                color: (theme) => theme.palette.primary.main,
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)'
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ) : staff.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={columns.length} align="center">
                            No staff found for selected branch
                          </TableCell>
                        </TableRow>
                      ) : (
                        staff.map((staffMember, index) => {
                          const isSelected = selected.indexOf(staffMember.id) !== -1;
                          return (
                            <TableRow
                              key={staffMember.id}
                              hover
                              selected={isSelected}
                              sx={{
                                '& > td': {
                                  padding: '8px 16px',
                                  height: '40px'
                                }
                              }}
                            >
                              <TableCell padding="checkbox" sx={{ paddingLeft: '16px' }}>
                                <Checkbox
                                  checked={isSelected}
                                  onChange={(event) => handleSelect(event, staffMember.id)}
                                  sx={{ padding: '4px' }}
                                />
                              </TableCell>
                              
                              <TableCell>{getSerialNumber(index)}</TableCell>
                              <TableCell>{staffMember.firstName}</TableCell>
                              <TableCell>{staffMember.lastName}</TableCell>
                              <TableCell>{staffMember.email}</TableCell>
                              <TableCell>{staffMember.role}</TableCell>
                              <TableCell>
                                <Box 
                                  sx={{
                                    display: 'inline-block',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    backgroundColor: staffMember.active_status === 'Active' ? '#e6f7ee' : '#ffebee',
                                    color: staffMember.active_status === 'Active' ? '#00a65a' : '#f44336'
                                  }}
                                >
                                  {staffMember.active_status}
                                </Box>
                              </TableCell>
                              
                              <TableCell>
                                <IconButton 
                                  sx={{ color: 'text.secondary' }}
                                  onClick={() => handleViewClick(staffMember)}
                                >
                                  <ViewIcon />
                                </IconButton>
                              </TableCell>
                              
                              <TableCell>
                                <IconButton
                                  aria-label="more"
                                  aria-controls="long-menu"
                                  aria-haspopup="true"
                                  onClick={(e) => handleMenuClick(e, staffMember)}
                                  sx={{ color: 'text.secondary' }}
                                >
                                  <MoreVertIcon />
                                </IconButton>
                                <Menu
                                  id="long-menu"
                                  anchorEl={anchorEl}
                                  keepMounted
                                  open={openMenu && selectedStaff?.id === staffMember.id}
                                  onClose={handleMenuClose}
                                  PaperProps={{
                                    style: {
                                      width: '20ch',
                                      boxShadow: 'none',
                                    },
                                    elevation: 0,
                                  }}
                                >
                                  <MenuItem onClick={handleEdit}>Edit</MenuItem>
                                  <MenuItem onClick={() => handleConfirmDelete(selectedStaff)}>Delete</MenuItem>
                                </Menu>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              {/* Pagination */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                  <Box display="flex" justifyContent="flex-start" alignItems="center">
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Rows per page</InputLabel>
                      <Select
                        value={pagination.page_size}
                        label="Rows per page"
                        onChange={handlePageSizeChange}
                        sx={{ color: 'text.secondary' }}
                      >
                        {[5, 10, 25, 50, 100].map((size) => (
                          <MenuItem key={size} value={size}>
                            {size}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <Box display="flex" justifyContent="center" alignItems="center" sx={{ flex: 1 }}>
                    <Button
                      disabled={pagination.page === 1}
                      onClick={() => handlePageChange(1)}
                      sx={{ color: 'text.secondary', mr: 2 }}
                    >
                      First Page
                    </Button>

                    <Button
                      disabled={pagination.page === 1}
                      onClick={() => handlePageChange(pagination.page - 1)}
                      sx={{ color: 'text.secondary', mr: 2 }}
                    >
                      Previous
                    </Button>

                    <Typography variant="body2" sx={{ color: 'text.secondary', mx: 2 }}>
                      Page {pagination.page} of {pagination.total_pages}
                    </Typography>

                    <Button
                      disabled={pagination.page === pagination.total_pages}
                      onClick={() => handlePageChange(pagination.page + 1)}
                      sx={{ color: 'text.secondary', mr: 2 }}
                    >
                      Next
                    </Button>

                    <Button
                      disabled={pagination.page === pagination.total_pages}
                      onClick={() => handlePageChange(pagination.total_pages)}
                      sx={{ color: 'text.secondary' }}
                    >
                      Last Page
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </>
          ) : (
            <Grid item xs={12}>
              <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                minHeight="200px"
                sx={{ 
                  backgroundColor: '#f5f5f5',
                  borderRadius: 1,
                  p: 4,
                  textAlign: 'center'
                }}
              >
                <Typography variant="h6" color="textSecondary">
                  {selectedCompany 
                    ? (loadingBranches ? 'Loading branches...' : 'Please select a branch to view staff')
                    : 'Please select a company first'}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>

        {/* Filter Modal */}
        <Dialog open={filterOpen} onClose={() => setFilterOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Sort & Filter</DialogTitle>
          
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={filters.firstName}
                  onChange={(e) => handleFilterChange('firstName', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={filters.lastName}
                  onChange={(e) => handleFilterChange('lastName', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Email"
                  value={filters.email}
                  onChange={(e) => handleFilterChange('email', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={filters.role}
                    label="Role"
                    onChange={(e) => handleFilterChange('role', e.target.value)}
                  >
                    <MenuItem value="">All Roles</MenuItem>
                    {roleTypes.map((role) => (
                      <MenuItem key={role} value={role}>
                        {role}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={filters.department}
                    label="Department"
                    onChange={(e) => handleFilterChange('department', e.target.value)}
                    disabled={loadingDepartments || !selectedBranch}
                  >
                    <MenuItem value="">All Departments</MenuItem>
                    {departments.map((dept) => (
                      <MenuItem key={dept._id} value={dept._id}>
                        {dept.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.active_status}
                    label="Status"
                    onChange={(e) => handleFilterChange('active_status', e.target.value)}
                  >
                    <MenuItem value="">All Statuses</MenuItem>
                    {statusTypes.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions>
            <Button onClick={resetFilters} sx={{ color: 'text.secondary' }}>Reset</Button>
            <Button onClick={() => setFilterOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
            <Button onClick={applyFilters} variant="contained" sx={{ backgroundColor: '#616161', '&:hover': { backgroundColor: '#424242' } }}>Apply</Button>
          </DialogActions>
        </Dialog>

        {/* View Staff Modal */}
        <ViewStaffModal 
          staff={selectedStaffView}
          open={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
        />

        {/* Delete Confirmation Popup */}
        <MyComponent />

        {/* Edit Staff Modal */}
        <Modal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          aria-labelledby="edit-staff-modal"
          aria-describedby="edit-staff-form"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxWidth: 600,
            bgcolor: 'background.paper',
            p: 4,
            maxHeight: '90vh',
            overflowY: 'auto',
            borderRadius: 2,
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#888',
              borderRadius: '10px',
              '&:hover': {
                background: '#555',
              }
            },
            scrollbarWidth: 'thin',
            scrollbarColor: '#888 #f1f1f1',
          }}>
            <Typography variant="h5" gutterBottom>Edit Staff</Typography>
            <Divider sx={{ mb: 3 }} />
            <Formik
              initialValues={currentStaff}
              validationSchema={validationSchema}
              onSubmit={handleEditSubmit}
              enableReinitialize
            >
              {({ values, errors, touched, handleChange }) => (
                <Form>
                  <Grid container spacing={3}>
                    {console.log({values, errors, touched})}
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>Basic Information</Typography>
                      <Divider />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="First Name*"
                        name="firstName"
                        value={values.firstName}
                        onChange={handleChange}
                        error={touched.firstName && Boolean(errors.firstName)}
                        helperText={touched.firstName && errors.firstName}
                        variant="outlined"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Last Name*"
                        name="lastName"
                        value={values.lastName}
                        onChange={handleChange}
                        error={touched.lastName && Boolean(errors.lastName)}
                        helperText={touched.lastName && errors.lastName}
                        variant="outlined"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email*"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        variant="outlined"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Username*"
                        name="username"
                        value={values.username}
                        onChange={handleChange}
                        error={touched.username && Boolean(errors.username)}
                        helperText={touched.username && errors.username}
                        variant="outlined"
                      />
                    </Grid>
                    
                   {/* <Grid item xs={12} md={6}>
  <TextField
    fullWidth
    label="Password*"
    name="password"
    type={showPassword ? "text" : "password"}
    value={values.password}
    onChange={handleChange}
    error={touched.password && Boolean(errors.password)}
    helperText={touched.password && errors.password}
    variant="outlined"
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            onClick={() => setShowPassword(!showPassword)}
            edge="end"
          >
            {showPassword ? <VisibilityOff /> : <ViewIcon />}
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
</Grid> */}


                    
                    
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>Employment Details</Typography>
                      <Divider />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Role*</InputLabel>
                        <Select
                          name="role"
                          value={values.role}
                          label="Role*"
                          onChange={handleChange}
                          error={touched.role && Boolean(errors.role)}
                        >
                          {roleTypes.map((role) => (
                            <MenuItem key={role} value={role}>
                              {role}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Status*</InputLabel>
                        <Select
                          name="active_status"
                          value={values.active_status}
                          label="Status*"
                          onChange={handleChange}
                          error={touched.active_status && Boolean(errors.active_status)}
                        >
                          {statusTypes.map((status) => (
                            <MenuItem key={status} value={status}>
                              {status}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
             <TextField
  fullWidth
  label="Joining Date"
  name="joining_date"
  type="date"
  value={values.joining_date}
  onChange={handleChange}
  InputLabelProps={{
    shrink: true,
  }}
  inputProps={{
    max: getTodayDate() // Can't select dates after today
  }}
  variant="outlined"
/>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                     <TextField
  fullWidth
  label="Date of Birth"
  name="date_of_birth"
  type="date"
  value={values.date_of_birth}
  onChange={handleChange}
  InputLabelProps={{
    shrink: true,
  }}
  inputProps={{
    max: getMinBirthDate() // Must be at least 18 years ago
  }}
  variant="outlined"
/>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Department</InputLabel>
                        <Select
                          name="department"
                          value={values.department}
                          label="Department"
                          onChange={handleChange}
                          disabled={loadingDepartments}
                        >
                          {departments.length ? departments.map((dept) => (
                            <MenuItem key={dept._id} value={dept._id}>
                              {dept.name}
                            </MenuItem>
                          )) :   (
                    <MenuItem disabled>
                      No department available
                    </MenuItem>
                  ) 
                           }
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <Button 
                        fullWidth 
                        type="submit" 
                        variant="contained" 
                        color="primary"
                        size="large"
                        sx={{ mt: 3 }}
                      >
                        UPDATE STAFF
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Box>
        </Modal>

        {/* Add Staff Modal */}
        <Modal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          aria-labelledby="add-staff-modal"
          aria-describedby="add-staff-form"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxWidth: 600,
            bgcolor: 'background.paper',
            p: 4,
            maxHeight: '90vh',
            overflowY: 'auto',
            borderRadius: 2,
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#888',
              borderRadius: '10px',
              '&:hover': {
                background: '#555',
              }
            },
            scrollbarWidth: 'thin',
            scrollbarColor: '#888 #f1f1f1',
          }}>
            <Typography variant="h5" gutterBottom>Add New Staff</Typography>
            <Divider sx={{ mb: 3 }} />
            <Formik
              initialValues={newStaff}
              validationSchema={validationSchema}
              onSubmit={handleAddStaff}
            >
              {({ values, errors, touched, handleChange }) => (
                <Form>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>Basic Information</Typography>
                      <Divider />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="First Name*"
                        name="firstName"
                        value={values.firstName}
                        onChange={handleChange}
                        error={touched.firstName && Boolean(errors.firstName)}
                        helperText={touched.firstName && errors.firstName}
                        variant="outlined"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Last Name*"
                        name="lastName"
                        value={values.lastName}
                        onChange={handleChange}
                        error={touched.lastName && Boolean(errors.lastName)}
                        helperText={touched.lastName && errors.lastName}
                        variant="outlined"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email*"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        variant="outlined"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Username*"
                        name="username"
                        value={values.username}
                        onChange={handleChange}
                        error={touched.username && Boolean(errors.username)}
                        helperText={touched.username && errors.username}
                        variant="outlined"
                      />
                    </Grid>
                    
      <Grid item xs={12} md={6}>
  <TextField
    fullWidth
    label="Password*"
    name="password"
    type={showPassword ? "text" : "password"}
    value={values.password}
    onChange={handleChange}
    error={touched.password && Boolean(errors.password)}
    helperText={touched.password && errors.password}
    variant="outlined"
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            onClick={() => setShowPassword(!showPassword)}
            edge="end"
          >
            {showPassword ? <VisibilityOff /> : <ViewIcon />}
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
</Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>Employment Details</Typography>
                      <Divider />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Role*</InputLabel>
                        <Select
                          name="role"
                          value={values.role}
                          label="Role*"
                          onChange={handleChange}
                          error={touched.role && Boolean(errors.role)}
                        >
                          {roleTypes.map((role) => (
                            <MenuItem key={role} value={role}>
                              {role}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Status*</InputLabel>
                        <Select
                          name="active_status"
                          value={values.active_status}
                          label="Status*"
                          onChange={handleChange}
                          error={touched.active_status && Boolean(errors.active_status)}
                        >
                          {statusTypes.map((status) => (
                            <MenuItem key={status} value={status}>
                              {status}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                    <TextField
  fullWidth
  label="Joining Date"
  name="joining_date"
  type="date"
  value={values.joining_date}
  onChange={handleChange}
  InputLabelProps={{
    shrink: true,
  }}
  inputProps={{
    max: getTodayDate() // Can't select dates after today
  }}
  variant="outlined"
/>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
         <TextField
  fullWidth
  label="Date of Birth"
  name="date_of_birth"
  type="date"
  value={values.date_of_birth}
  onChange={handleChange}
  InputLabelProps={{
    shrink: true,
  }}
  inputProps={{
    max: getMinBirthDate() // Must be at least 18 years ago
  }}
  variant="outlined"
/>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Department</InputLabel>
                        <Select
                          name="department"
                          value={values.department}
                          label="Department"
                          onChange={handleChange}
                          disabled={loadingDepartments}
                        >
                          {departments.length ? departments.map((dept) => (
                            <MenuItem key={dept._id} value={dept._id}>
                              {dept.name}
                            </MenuItem>
                          )) :  (
                    <MenuItem disabled>
                      No department available
                    </MenuItem>
                  ) }
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <Button 
                        fullWidth 
                        type="submit" 
                        variant="contained" 
                        color="primary"
                        size="large"
                        sx={{ mt: 3 }}
                      >
                        ADD STAFF
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Box>
        </Modal>

        {/* Floating Add Button - Only show when branch is selected */}
        {selectedBranch && (
          <Box
            sx={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              zIndex: 1000,
            }}
          >
            <Fab 
              color="primary" 
              aria-label="add"
              onClick={() => setAddModalOpen(true)}
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
                boxShadow: 3,
              }}
            >
              <AddIcon />
            </Fab>
          </Box>
        )}

        {/* Snackbar for notifications */}
        <Snackbar
          open={Boolean(openSnackbar)}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={openSnackbar?.status ? "success" : "error"}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {openSnackbar?.message || openSnackbar}
          </Alert>
        </Snackbar>
      </Layout>
    </>
  );
};

export default StaffListPage;