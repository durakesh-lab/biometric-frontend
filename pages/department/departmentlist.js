import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  Chip,
  Collapse,
  Modal,
  CircularProgress,
  Snackbar,
  Alert,
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
  TableView as TableViewIcon,
  ChevronRight as ChevronRightIcon,
  Apartment as DepartmentTreeIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { confirnDeleteAction, editDepartmentAction } from '@/store/authSlice';
import Layout from '../../components/Layout/Layout';
import MyComponent from '../../components/common/deletepopup';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import ViewDepartmentModal from '../../components/Dashboard/viewDepartment';

const DepartmentlistPage = () => {
  // State for companies
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  // State for branches
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [loadingBranches, setLoadingBranches] = useState(false);

  // State for table data and UI
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const dispatch = useDispatch();
  const deletepopup = useSelector((state) => state.auth);
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
    name: '',
    dept_code: '',
    ordering: ""
  });

  // Add department modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    dept_code: '',
    branchId: '',
    otherDetails: ''
  });

  // Menu state for actions
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const openMenu = Boolean(anchorEl);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  let [currentDepartment, setCurrentDepartment] = useState({});

  // View modal state
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedDepartmentView, setSelectedDepartmentView] = useState({});

  // View mode state
  const [viewMode, setViewMode] = useState('table');
  const [treeExpanded, setTreeExpanded] = useState({});

  const getDepartmentId = (department) => {
    if (!department) return null;
    if (typeof department === 'string') return department;
    return department._id || department.id || null;
  };

  const treeData = useMemo(() => {
    if (!selectedCompany || !selectedBranch || departments.length === 0) {
      return [];
    }

    const selectedCompanyData = companies.find((company) => company._id === selectedCompany);
    const selectedBranchData = branches.find((branch) => branch._id === selectedBranch);

    const companyKey = selectedCompanyData?._id || selectedCompany;
    const branchKey = selectedBranchData?._id || selectedBranch;

    return [
      {
        key: companyKey,
        name: selectedCompanyData?.name || 'Selected Company',
        count: departments.length,
        branches: [
          {
            key: branchKey,
            name: selectedBranchData?.name || 'Selected Branch',
            count: departments.length,
            departments: departments.map((department) => ({
              key: getDepartmentId(department),
              department,
            })),
          },
        ],
      },
    ];
  }, [branches, companies, departments, selectedBranch, selectedCompany]);

  const isTreeNodeExpanded = (key) => treeExpanded[key] ?? true;

  const toggleTreeNode = (key) => {
    setTreeExpanded((prev) => ({
      ...prev,
      [key]: !(prev[key] ?? true),
    }));
  };

  const handleViewModeChange = (mode) => {
    if (mode === viewMode) return;
    setViewMode(mode);
    setSelected([]);
    setShowDelete(false);
    setAnchorEl(null);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Columns configuration
  const columns = [
    { id: 'checkbox', label: '', sortable: false },
    { id: 'srNo', label: 'SN.', sortable: false },
    { id: 'name', label: 'Department Name', sortable: true },
    { id: 'dept_code', label: 'Department Code', sortable: true },
    { id: 'otherDetails', label: 'Details', sortable: true },
    { id: 'view', label: 'View', sortable: false },
    { id: 'actions', label: 'Actions', sortable: false }
  ];

  // Fetch companies data
  const fetchCompanies = async () => {
    try {
      setLoadingCompanies(true);
      let token = localStorage.getItem("biometric_token");
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/company`, {
          headers: { Authorization: token }
        }
      );
      
      setCompanies(response.data?.data || []);
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
      let token = localStorage.getItem("biometric_token");
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/company/${companyId}/branches`, {
          headers: { Authorization: token }
        }
      );
      
      setBranches(response.data?.data || []);
      setLoadingBranches(false);
    } catch (error) {
      console.error('Error fetching branches:', error);
      setLoadingBranches(false);
    }
  };

  // Fetch departments data
  const fetchDepartments = useCallback(async () => {
    if (!selectedBranch) return;
    
    try {
      setLoading(true);
      const isTreeView = viewMode === 'tree';
      
      // Construct query params
      const params = {
        search: search,
        ordering: sorting.direction === 'desc' ? `-${sorting.field}` : sorting.field,
        ...filters,
        ...(isTreeView
          ? {}
          : {
              page: pagination.page,
              page_size: pagination.page_size,
            }),
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null) {
          delete params[key];
        }
      });

      let token = localStorage.getItem("biometric_token");
      const response = await axios.get(
       `${process.env.NEXT_PUBLIC_BASE_URL}/department/${selectedBranch}`, {
          headers: { Authorization: token },
          params
        }
      );
      const departmentData = response.data?.data || [];
      const responseCount = response.data?.count ?? departmentData.length;
      setDepartments(departmentData);
      setPagination((prev) => ({
        ...prev,
        total_pages: isTreeView ? 1 : Math.max(Math.ceil(responseCount / (prev.page_size || 1)), 1),
        count: responseCount,
      }));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.page_size, search, selectedBranch, sorting, viewMode]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      fetchBranches(selectedCompany);
      setSelectedBranch(null); // Reset branch selection when company changes
      setSelected([]);
      setShowDelete(false);
    }
  }, [selectedCompany]);

  useEffect(() => {
    if (selectedBranch) {
      setNewDepartment(prev => ({ ...prev, branchId: selectedBranch }));
      setSelected([]);
      setShowDelete(false);
    } else {
      setDepartments([]);
      setSelected([]);
      setShowDelete(false);
    }
  }, [selectedBranch]);

  useEffect(() => {
    if (selectedBranch) {
      fetchDepartments();
    }
  }, [fetchDepartments, selectedBranch]);

  // Handle select all
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(departments.map((dept) => getDepartmentId(dept)).filter(Boolean));
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
    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
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
    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  // Apply filters
  const applyFilters = () => {
    setFilterOpen(false);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      name: '',
      dept_code: '',
      ordering: ""
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Handle menu click
  const handleMenuClick = (event, department) => {
    setAnchorEl(event.currentTarget);
    setSelectedDepartment(department);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle delete confirmation
  const handleConfirmDelete = (id) => {
    dispatch(confirnDeleteAction("sure"));
    const ids = (Array.isArray(id) ? id : [id])
      .map((item) => getDepartmentId(item))
      .filter(Boolean);
    sessionStorage.setItem("deleteIds", JSON.stringify(ids));
  };

  // Handle delete
  const handleDelete = useCallback(async () => {
    const storedIds = JSON.parse(sessionStorage.getItem("deleteIds") || '[]');
    const ids = Array.isArray(storedIds)
      ? storedIds
      : storedIds
        ? [storedIds]
        : [];
    if (!Array.isArray(ids) || ids.length === 0) {
      dispatch(confirnDeleteAction(false));
      setAnchorEl(null);
      return;
    }

    try {
      let token = localStorage.getItem("biometric_token");
      let response;

      if (Array.isArray(ids) && ids.length > 1) {
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/department/delete-bulk`,
          { Ids: ids },
          { headers: { Authorization: token } }
        );
      } else {
        const departmentId = Array.isArray(ids) ? ids[0] : ids;
        response = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/department/${departmentId}`, {
          headers: { Authorization: token }
        });
      }

      setOpenSnackbar({ status: true, message: response?.data?.message || 'Department deleted successfully' });
      setSelected([]);
      setShowDelete(false);
      dispatch(confirnDeleteAction(false));
      sessionStorage.removeItem("deleteIds");
      fetchDepartments();
    } catch (error) {
      console.error('Error deleting department:', error);
      setOpenSnackbar({
        status: false,
        message: error.response?.data?.detail || error.response?.data?.message || 'Error deleting department'
      });
    }
    setAnchorEl(null);
  }, [dispatch, fetchDepartments]);

  useEffect(() => {
    if (deletepopup?.confirnDelete === true) {
      handleDelete();
    }
  }, [deletepopup?.confirnDelete, handleDelete]);

  // Get serial number
  const getSerialNumber = (index) => {
    return (pagination.page - 1) * pagination.page_size + index + 1;
  };

  // Handle edit
  const handleEdit = () => {
    if (selectedDepartment) {
      setCurrentDepartment(selectedDepartment);
      setEditModalOpen(true);
    }
    handleMenuClose();
  };

  const handleEditSubmit = async (values) => {
    try {
      const payload = { ...values, id: values._id || values.id };
      await dispatch(editDepartmentAction(payload)).unwrap();
      setEditModalOpen(false);
      fetchDepartments();
    } catch (error) {
      console.error('Error updating department:', error);
    }
  };

  // Handle add department
  const handleAddDepartment = async (values) => {
    try {
      let token = localStorage.getItem("biometric_token");
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/department`, values, {
        headers: { Authorization: token }
      });
      
      setOpenSnackbar({status: true, message: 'Department added successfully'});
      setAddModalOpen(false);
      fetchDepartments();
    } catch (error) {
      console.error('Error adding department:', error);
      setOpenSnackbar(error.response?.data?.detail || 'Error adding department');
    }
  };

  // Handle view click
  const handleViewClick = (department) => {
    setSelectedDepartmentView(department);
    setViewModalOpen(true);
  };

  // Handle snackbar close
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    dept_code: Yup.string().required("Required"),
  });

  return (
    <>
      <Layout>
        <Grid container spacing={3}>
          {/* Header Section */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                mb: 0,
                gap: 2,
                flexWrap: 'wrap',
              }}
            >
              <Typography
                variant="subtitle1"
                component="h2"
                sx={{ fontWeight: 600, width: { xs: '100%', sm: 'auto' } }}
              >
                Department List
              </Typography>
              
              <Box
                sx={{
                  display: 'flex',
                  alignItems: { xs: 'stretch', sm: 'center' },
                  gap: 1,
                  flexWrap: 'wrap',
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                {selectedBranch && (
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setAddModalOpen(true)}
                    sx={{
                      textTransform: 'none',
                      boxShadow: 'none',
                      backgroundColor: '#0E9F6E',
                      width: { xs: '100%', sm: 'auto' },
                      '&:hover': {
                        backgroundColor: '#0b7d57',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    Add Department
                  </Button>
                )}

                {viewMode === 'table' && showDelete && (
                  <Tooltip title={`Delete selected (${selected.length})`}>
                    <Button
                      color="error"
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleConfirmDelete(selected)}
                      sx={{
                        textTransform: 'none',
                        width: { xs: '100%', sm: 'auto' },
                        borderColor: '#ef4444',
                        '&:hover': {
                          borderColor: '#b91c1c',
                        },
                      }}
                    >
                      Delete Selected ({selected.length})
                    </Button>
                  </Tooltip>
                )}

                <Button
                  startIcon={<FilterIcon sx={{ color: 'text.secondary' }} />}
                  onClick={() => setFilterOpen(true)}
                  sx={{ 
                    backgroundColor: '#f5f5f5',
                    color: 'text.secondary',
                    width: { xs: '100%', sm: 'auto' },
                    '&:hover': {
                      backgroundColor: '#e0e0e0'
                    }
                  }}
                >
                  <Typography variant="body2">Sort & Filter</Typography>
                </Button>

                <Box
                  sx={{
                    display: 'inline-flex',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: '#FFFFFF',
                    width: { xs: '100%', sm: 'auto' },
                  }}
                >
                  <Button
                    startIcon={<TableViewIcon />}
                    onClick={() => handleViewModeChange('table')}
                    sx={{
                      borderRadius: 0,
                      textTransform: 'none',
                      px: 2,
                      flex: 1,
                      color: viewMode === 'table' ? '#FFFFFF' : '#4B5563',
                      backgroundColor: viewMode === 'table' ? '#0E9F6E' : '#FFFFFF',
                      '&:hover': {
                        backgroundColor: viewMode === 'table' ? '#047857' : '#F9FAFB',
                      },
                    }}
                  >
                    Table View
                  </Button>
                  <Button
                    startIcon={<BranchIcon />}
                    onClick={() => handleViewModeChange('tree')}
                    sx={{
                      borderRadius: 0,
                      textTransform: 'none',
                      px: 2,
                      flex: 1,
                      borderLeft: '1px solid #E5E7EB',
                      color: viewMode === 'tree' ? '#FFFFFF' : '#4B5563',
                      backgroundColor: viewMode === 'tree' ? '#0E9F6E' : '#FFFFFF',
                      '&:hover': {
                        backgroundColor: viewMode === 'tree' ? '#047857' : '#F9FAFB',
                      },
                    }}
                  >
                    Tree View
                  </Button>
                </Box>
                
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPagination((prev) => ({ ...prev, page: 1 }));
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: { xs: '100%', sm: 200 } }}
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
                  companies.map((company) => (
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

          {/* Department Table - Only show if branch is selected */}
          {selectedBranch ? (
            <>
              <Box sx={{ display: viewMode === 'table' ? 'block' : 'none', width: '100%' }}>
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
                                indeterminate={selected.length > 0 && selected.length < departments.length}
                                checked={departments.length > 0 && selected.length === departments.length}
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
                      ) : departments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={columns.length} align="center">
                            No departments found for selected branch
                          </TableCell>
                        </TableRow>
                      ) : (
                        departments.map((department, index) => {
                          const departmentId = getDepartmentId(department);
                          const isSelected = selected.indexOf(departmentId) !== -1;
                          return (
                            <TableRow
                              key={departmentId}
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
                                  onChange={(event) => handleSelect(event, departmentId)}
                                  sx={{ padding: '4px' }}
                                />
                              </TableCell>
                              
                              <TableCell>{getSerialNumber(index)}</TableCell>
                              <TableCell>{department.name}</TableCell>
                              <TableCell>{department.dept_code}</TableCell>
                              <TableCell>{department.otherDetails}</TableCell>
                              
                              <TableCell>
                                <IconButton 
                                  sx={{ color: 'text.secondary' }}
                                  onClick={() => handleViewClick(department)}
                                >
                                  <ViewIcon />
                                </IconButton>
                              </TableCell>
                              
                              <TableCell>
                                <IconButton
                                  aria-label="more"
                                  aria-controls="long-menu"
                                  aria-haspopup="true"
                                  onClick={(e) => handleMenuClick(e, department)}
                                  sx={{ color: 'text.secondary' }}
                                >
                                  <MoreVertIcon />
                                </IconButton>
                                <Menu
                                  id="long-menu"
                                  anchorEl={anchorEl}
                                  keepMounted
                                  open={openMenu && getDepartmentId(selectedDepartment) === departmentId}
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
                                  <MenuItem onClick={() => handleConfirmDelete(selectedDepartment)}>Delete</MenuItem>
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
              </Box>

              {viewMode === 'tree' && (
                <Grid item xs={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      border: '1px solid #E5E7EB',
                      borderRadius: 2,
                      backgroundColor: '#FFFFFF',
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: 2,
                        flexWrap: 'wrap',
                        px: 3,
                        py: 2.5,
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#111827' }}>
                          Department Tree
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Simple hierarchical view by company, branch, and department.
                        </Typography>
                      </Box>
                      <Chip
                        label={`${departments.length} departments`}
                        sx={{
                          bgcolor: '#ECFDF5',
                          color: '#047857',
                          fontWeight: 600,
                        }}
                      />
                    </Box>

                    <Divider />

                    {loading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                        <CircularProgress size={36} />
                      </Box>
                    ) : treeData.length === 0 ? (
                      <Box sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
                        No departments found for selected branch
                      </Box>
                    ) : (
                      <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2, backgroundColor: '#FAFAFA' }}>
                        {treeData.map((company) => {
                          const companyNodeKey = `company-${company.key}`;
                          const companyOpen = isTreeNodeExpanded(companyNodeKey);

                          return (
                            <Paper
                              key={companyNodeKey}
                              variant="outlined"
                              sx={{
                                borderColor: '#E5E7EB',
                                borderRadius: 2,
                                overflow: 'hidden',
                                backgroundColor: '#FFFFFF',
                                boxShadow: 'none',
                              }}
                            >
                              <Box
                                onClick={() => toggleTreeNode(companyNodeKey)}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  gap: 2,
                                  px: 2.5,
                                  py: 2,
                                  cursor: 'pointer',
                                  backgroundColor: '#F8FFFB',
                                  borderLeft: '4px solid #0E9F6E',
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                                  <Box
                                    sx={{
                                      width: 40,
                                      height: 40,
                                      borderRadius: '12px',
                                      bgcolor: '#DCFCE7',
                                      color: '#0E9F6E',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      flexShrink: 0,
                                    }}
                                  >
                                    <BusinessIcon fontSize="small" />
                                  </Box>
                                  <Box sx={{ minWidth: 0 }}>
                                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#111827' }} noWrap>
                                      {company.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#6B7280' }}>
                                      {company.count} departments
                                    </Typography>
                                  </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Chip
                                    size="small"
                                    label={`${company.branches.length} branches`}
                                    sx={{
                                      bgcolor: '#ECFDF5',
                                      color: '#047857',
                                      fontWeight: 600,
                                    }}
                                  />
                                  <ChevronRightIcon
                                    sx={{
                                      color: '#6B7280',
                                      transform: companyOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                                      transition: 'transform 0.2s ease',
                                    }}
                                  />
                                </Box>
                              </Box>

                              <Collapse in={companyOpen} timeout="auto" unmountOnExit>
                                <Box sx={{ p: 2.25, pl: { xs: 2.25, sm: 4 }, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                  {company.branches.map((branch) => {
                                    const branchNodeKey = `branch-${company.key}-${branch.key}`;
                                    const branchOpen = isTreeNodeExpanded(branchNodeKey);

                                    return (
                                      <Paper
                                        key={branchNodeKey}
                                        variant="outlined"
                                        sx={{
                                          borderColor: '#E5E7EB',
                                          borderRadius: 2,
                                          overflow: 'hidden',
                                          backgroundColor: '#FFFFFF',
                                          boxShadow: 'none',
                                        }}
                                      >
                                        <Box
                                          onClick={() => toggleTreeNode(branchNodeKey)}
                                          sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            gap: 2,
                                            px: 2.5,
                                            py: 1.75,
                                            cursor: 'pointer',
                                            backgroundColor: '#F9FAFB',
                                            borderLeft: '4px solid #93C5FD',
                                          }}
                                        >
                                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                                            <Box
                                              sx={{
                                                width: 38,
                                                height: 38,
                                                borderRadius: '12px',
                                                bgcolor: '#E0ECFF',
                                                color: '#2563EB',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                              }}
                                            >
                                              <BranchIcon fontSize="small" />
                                            </Box>
                                            <Box sx={{ minWidth: 0 }}>
                                              <Typography variant="body1" sx={{ fontWeight: 700, color: '#111827' }} noWrap>
                                                {branch.name}
                                              </Typography>
                                              <Typography variant="caption" sx={{ color: '#6B7280' }}>
                                                {branch.count} departments
                                              </Typography>
                                            </Box>
                                          </Box>

                                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Chip
                                              size="small"
                                              label={`${branch.departments.length} departments`}
                                              sx={{
                                                bgcolor: '#EFF6FF',
                                                color: '#2563EB',
                                                fontWeight: 600,
                                              }}
                                            />
                                            <ChevronRightIcon
                                              sx={{
                                                color: '#6B7280',
                                                transform: branchOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                                                transition: 'transform 0.2s ease',
                                              }}
                                            />
                                          </Box>
                                        </Box>

                                        <Collapse in={branchOpen} timeout="auto" unmountOnExit>
                                          <Box sx={{ p: 2, pt: 1.5, display: 'flex', flexDirection: 'column', gap: 1.25, backgroundColor: '#FFFFFF' }}>
                                            {branch.departments.map((departmentNode) => {
                                              const department = departmentNode.department;
                                              const departmentId = departmentNode.key;

                                              return (
                                                <Paper
                                                  key={departmentId}
                                                  variant="outlined"
                                                  sx={{
                                                    borderColor: '#E5E7EB',
                                                    borderRadius: '12px',
                                                    overflow: 'hidden',
                                                    backgroundColor: '#FFFFFF',
                                                    boxShadow: 'none',
                                                  }}
                                                >
                                                  <Box
                                                    sx={{
                                                      display: 'flex',
                                                      justifyContent: 'space-between',
                                                      alignItems: { xs: 'flex-start', sm: 'center' },
                                                      gap: 2,
                                                      p: 1.75,
                                                      flexWrap: 'wrap',
                                                    }}
                                                  >
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                                                      <Box
                                                        sx={{
                                                          width: 38,
                                                          height: 38,
                                                          borderRadius: '12px',
                                                          bgcolor: '#F3F4F6',
                                                          color: '#6B7280',
                                                          display: 'flex',
                                                          alignItems: 'center',
                                                          justifyContent: 'center',
                                                          flexShrink: 0,
                                                        }}
                                                      >
                                                        <DepartmentTreeIcon fontSize="small" />
                                                      </Box>
                                                      <Box sx={{ minWidth: 0 }}>
                                                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#111827' }} noWrap>
                                                          {department.name}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: '#6B7280' }} noWrap>
                                                          Code: {department.dept_code || '--'}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: '#9CA3AF', display: 'block' }} noWrap>
                                                          {department.otherDetails || 'No additional details'}
                                                        </Typography>
                                                      </Box>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#6B7280' }}>
                                                      <IconButton
                                                        size="small"
                                                        onClick={() => handleViewClick(department)}
                                                        sx={{ color: 'inherit' }}
                                                      >
                                                        <ViewIcon fontSize="small" />
                                                      </IconButton>
                                                      <IconButton
                                                        aria-label="more"
                                                        aria-controls="long-menu"
                                                        aria-haspopup="true"
                                                        onClick={(e) => handleMenuClick(e, department)}
                                                        sx={{ color: 'inherit' }}
                                                        size="small"
                                                      >
                                                        <MoreVertIcon fontSize="small" />
                                                      </IconButton>
                                                      <Menu
                                                        id="long-menu"
                                                        anchorEl={anchorEl}
                                                        keepMounted
                                                        open={openMenu && getDepartmentId(selectedDepartment) === departmentId}
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
                                                        <MenuItem onClick={() => handleConfirmDelete(department)}>Delete</MenuItem>
                                                      </Menu>
                                                    </Box>
                                                  </Box>
                                                </Paper>
                                              );
                                            })}
                                          </Box>
                                        </Collapse>
                                      </Paper>
                                    );
                                  })}
                                </Box>
                              </Collapse>
                            </Paper>
                          );
                        })}
                      </Box>
                    )}
                  </Paper>
                </Grid>
              )}
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
                    ? (loadingBranches ? 'Loading branches...' : 'Please select a branch to view departments')
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
                  label="Department Name"
                  value={filters.name}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Department Code"
                  value={filters.dept_code}
                  onChange={(e) => handleFilterChange('dept_code', e.target.value)}
                />
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions>
            <Button onClick={resetFilters} sx={{ color: 'text.secondary' }}>Reset</Button>
            <Button onClick={() => setFilterOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
            <Button onClick={applyFilters} variant="contained" sx={{ backgroundColor: '#616161', '&:hover': { backgroundColor: '#424242' } }}>Apply</Button>
          </DialogActions>
        </Dialog>

        {/* View Department Modal */}
        <ViewDepartmentModal 
          department={selectedDepartmentView}
          open={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
        />

        {/* Delete Confirmation Popup */}
        <MyComponent />

        {/* Edit Department Modal */}
        <Modal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          aria-labelledby="edit-department-modal"
          aria-describedby="edit-department-form"
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
            <Typography variant="h5" gutterBottom>Edit Department</Typography>
            <Divider sx={{ mb: 3 }} />
            <Formik
              initialValues={currentDepartment}
              validationSchema={validationSchema}
              onSubmit={handleEditSubmit}
              enableReinitialize
            >
              {({ values, errors, touched, handleChange }) => (
                <Form>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>Department Information</Typography>
                      <Divider />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Department Name*"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                        variant="outlined"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Department Code*"
                        name="dept_code"
                        value={values.dept_code}
                        onChange={handleChange}
                        error={touched.dept_code && Boolean(errors.dept_code)}
                        helperText={touched.dept_code && errors.dept_code}
                        variant="outlined"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Other Details"
                        name="otherDetails"
                        value={values.otherDetails}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={3}
                      />
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
                        UPDATE DEPARTMENT
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Box>
        </Modal>

        {/* Add Department Modal */}
        <Modal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          aria-labelledby="add-department-modal"
          aria-describedby="add-department-form"
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
            <Typography variant="h5" gutterBottom>Add New Department</Typography>
            <Divider sx={{ mb: 3 }} />
            <Formik
              initialValues={newDepartment}
              validationSchema={validationSchema}
              onSubmit={handleAddDepartment}
            >
              {({ values, errors, touched, handleChange }) => (
                <Form>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>Department Information</Typography>
                      <Divider />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Department Name*"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                        variant="outlined"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Department Code*"
                        name="dept_code"
                        value={values.dept_code}
                        onChange={handleChange}
                        error={touched.dept_code && Boolean(errors.dept_code)}
                        helperText={touched.dept_code && errors.dept_code}
                        variant="outlined"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Other Details"
                        name="otherDetails"
                        value={values.otherDetails}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={3}
                      />
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
                        ADD DEPARTMENT
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Box>
        </Modal>

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

export default DepartmentlistPage;
