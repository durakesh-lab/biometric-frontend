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
  Fab,
  Breadcrumbs,
  Link
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
  Home as HomeIcon,
  ChevronRight as ChevronRightIcon,
  GroupWork as DepartmentIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { confirnDeleteAction, editBranchAction, getbranchList } from '@/store/authSlice';
import Layout, { theme } from '../../../components/Layout/Layout';
import MyComponent from '../../../components/deletepopup';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import ViewBranchModal from '../../../components/Dashboard/viewbranch';
import { useRouter } from 'next/router';
import ReactPaginate from 'react-paginate';

const BranchlistPage = () => {
  const router = useRouter();
  // State for companies
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedCompanyName, setSelectedCompanyName] = useState('');
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  // State for table data and UI
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const dispatch = useDispatch();
  const deletepopup = useSelector((state) => state.auth);
  const { getBranchListData } = useSelector(state => state.auth);
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
    branchCode:"",
    name: '',
    manager: '',
    email: '',
    phoneNumber: '',
    ordering: ""
  });

  // Add branch modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newBranch, setNewBranch] = useState({
    branchCode:"",
    name: '',
    manager: '',
    address: '',
    phoneNumber: '',
    email: '',
    companyId: ''
  });

  // Menu state for actions
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const openMenu = Boolean(anchorEl);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  let [currentBranch, setCurrentBranch] = useState({});

  // View modal state
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedBranchView, setSelectedBranchView] = useState({});


  useEffect(()=>{
    console.log(router.query.id,"55555555555")
    setSelectedCompany(router.query.id)
    
  },[router.query.id])


  // Columns configuration
  const columns = [
    { id: 'checkbox', label: '', sortable: false },
    { id: 'srNo', label: 'SN.', sortable: false },
        // { id: 'Id', label: 'Id', sortable: false },
    { id: 'branchCode', label: 'branch code', sortable: false },
    { id: 'name', label: 'Branch Name', sortable: true },
    { id: 'manager', label: 'Manager', sortable: true },
    { id: 'address', label: 'Address', sortable: true },
    { id: 'phoneNumber', label: 'Phone Number', sortable: true },
    { id: 'email', label: 'Email', sortable: true },
    { id: 'view', label: 'View', sortable: false },
    { id: 'manage', label: 'Manage', sortable: false },
      {
    id: 'employees',
    label: 'Employees',
    sortable: false
  },
    { id: 'actions', label: 'Actions', sortable: false }
  ];

  // Handle department navigation
  const handleDepartmentClick = (branchId) => {
    router.push({
      pathname: '/dashboard/departments',
      query: { branchId }
    });
  };

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
      
      setCompanies(response.data?.data);
      setLoadingCompanies(false);
    } catch (error) {
      console.error('Error fetching companies:', error);
      setLoadingCompanies(false);
    }
  };

  // Fetch branches data
  const fetchBranches = async () => {
    if (!selectedCompany) return;
    
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

      let token = localStorage.getItem("biometric_token");
      const response = await axios.get(
       `${process.env.NEXT_PUBLIC_BASE_URL}/company/${selectedCompany}/branches`, {
          headers: { Authorization: token },
          params
        }
      );
      setBranches(response.data?.data);
      setPagination({
        ...pagination,
        total_pages: Math.ceil(response.data.count / pagination.page_size),
        count: response.data.count
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching branches:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      fetchBranches();
      setNewBranch(prev => ({ ...prev, companyId: selectedCompany }));
      // Find and set the company name for breadcrumbs
      const company = companies.find(c => c._id === selectedCompany);
      if (company) {
        setSelectedCompanyName(company.name);
      }
    }
  }, [selectedCompany, pagination.page, pagination.page_size, sorting, search, deletepopup.editBranchData]);

  // Handle select all
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = branches.map((company) => company._id);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
    setShowDelete(event.target.checked);
  };

  // Handle single select
  const handleSelect = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter((item) => item !== id);
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
    fetchBranches();
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      branchCode:"",
      name: '',
      manager: '',
      email: '',
      phoneNumber: '',
      ordering: ""
    });
  };
 let [editcheckfield,seteditcheckfield]=useState({})
  // Handle menu click
  const handleMenuClick = (event, branch) => {
    setAnchorEl(event.currentTarget);
    setSelectedBranch(branch);
        seteditcheckfield({branchCode:branch.branchCode})
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle delete confirmation
  const handleConfirmDelete = (id) => {
    dispatch(confirnDeleteAction("sure"));
    sessionStorage.setItem("deleteIds", JSON.stringify(id));
  };

  // Handle delete
  const handleDelete = async (id) => {
    id = JSON.parse(sessionStorage.getItem("deleteIds"));
    try {
      let token = localStorage.getItem("biometric_token");
     if(Array.isArray(id)){
      
         var data = { Ids: id, action_type: "delete" };
      var response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/branch/delete-bulk`,data, {
        headers: { Authorization: token }
      });
     }
     else{
            var response = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/branch/${id}`, {
        headers: { Authorization: token }
      });
     }

      if(response?.data.detail) {
        setOpenSnackbar(response?.data.detail);
      } else {
        setOpenSnackbar({status: true, message: 'Branch deleted successfully'});
        setSelected([]);
        setShowDelete(false);
        dispatch(confirnDeleteAction(false));
        fetchBranches();
      }
    } catch (error) {
      console.error('Error deleting branch:', error);
      setOpenSnackbar(error.response?.data?.detail || 'Error deleting branch');
    }
    handleMenuClose();
  };

  useEffect(() => {
    if (deletepopup?.confirnDelete === true) {
      handleDelete();
    }
  }, [deletepopup?.confirnDelete]);

  // Get serial number
  const getSerialNumber = (index) => {
    return (pagination.page - 1) * pagination.page_size + index + 1;
  };

  // Handle edit
  const handleEdit = () => {
    setbranchCodeError("")
    if (selectedBranch) {
      setCurrentBranch(selectedBranch);
      setEditModalOpen(true);
    }
    handleMenuClose();
  };

  const handleEditSubmit = async (values) => {
    try {
      values={...values,id:values._id}
      dispatch(editBranchAction(values));
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error updating branch:', error);
    }
  };

  // Handle add branch
  const handleAddBranch = async (values) => {
    try {
      let token = localStorage.getItem("biometric_token");
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/branch`, values, {
        headers: { Authorization: token }
      });
      
      setOpenSnackbar({status: true, message: 'Branch added successfully'});
      setAddModalOpen(false);
      fetchBranches();
    } catch (error) {
      console.error('Error adding branch:', error);
      setOpenSnackbar(error.response?.data?.detail || 'Error adding branch');
    }
  };

  // Handle view click
  const handleViewClick = (branch) => {
    setSelectedBranchView(branch);
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
    manager: Yup.string().required("Required"),
    address: Yup.string().required("Required"),
    phoneNumber: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
     branchCode: Yup.string()
                    .required("Required")
                    .test(
                      'username-exists',
                      'username already exists',
                      () => !branchCodeError // This will be updated by our debounced function
                    ),
  });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  useEffect(() => {
    dispatch(getbranchList());
  }, [dispatch]);

const handleManageBranches=(id)=>{
router.push({
  pathname: '/company/branches/departments',
  query: { id: id ,companyId:router.query.id }
});
}
const handleManageEmployees=(id)=>{
router.push({
  pathname: '/company/branches/staff',
  query: { id: id ,companyId:router.query.id }
});
}










  const debounce = (func, delay) => {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };
    const [branchCodeError, setbranchCodeError] = useState('');
    
    // Debounced validation functions
    const checkFieldsExists = debounce(async (value,field,id) => {
      if (!value){
        setbranchCodeError("")
         return 
      }
      try {
        let token = localStorage.getItem("biometric_token");
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/branch/checkandverifyfields`, { field:"branch_code", branchCode: value }, {
          headers: { Authorization: token }
        });
        if(field=="branch_code"){
        setbranchCodeError(response.data.message ? 'branch code already exists' : '');
        }
        else{
              // setEmailError(response.data.message ? 'Email already exists' : '');
        }
      } catch (error) {
        console.error('Error checking company ID:', error);
      }
    }, 1000);
  return (
    <>
      <Layout>
        <Grid container spacing={3}>
          {/* Header Section with Breadcrumbs */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} sx={{ flexWrap: 'wrap', rowGap: 2 }}>
              <Box>
                <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 600, mb: 1 }}>
                  Branch List
                </Typography>
                <Breadcrumbs 
                  separator={<ChevronRightIcon fontSize="small" />} 
                  aria-label="breadcrumb"
                  sx={{ '& .MuiBreadcrumbs-separator': { mx: 1 } }}
                >
                  {/* <Link 
                    underline="hover" 
                    color="inherit" 
                    href="/dashboard" 
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
                    Home
                  </Link> */}
                  <Link 
                    underline="hover" 
                    color="inherit" 
                    onClick={() =>  router.push("/company/companylist")}
                    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                  >
                    <BusinessIcon sx={{ mr: 0.5, fontSize: 20 }} />
                    Companies
                  </Link>
                  {selectedCompany && (
                    <Typography 
                      color="text.primary" 
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      {selectedCompanyName || 'Branches'}
                    </Typography>
                  )}
                </Breadcrumbs>
              </Box>
              
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
          {/* <Grid item xs={12}>
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
          </Grid> */}
<Grid item xs={12}>
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      border: '1px solid #ccc',
      borderRadius: 1,
      padding: '8px 12px',
      minHeight: '56px',
      backgroundColor: '#f9f9f9',
    }}
  >
    <BusinessIcon sx={{ marginRight: 1 }} />
    <Typography variant="body1">
      {loadingCompanies
        ? 'Loading...'
        : companies.find(c => c._id === selectedCompany)?.name || 'No company selected'}
    </Typography>
  </Box>
</Grid>

          {/* Branch Table - Only show if company is selected */}
          {selectedCompany ? (
            <>
              <Grid item xs={12}>
            <Box sx={{ overflowX: 'auto' }}>
  <TableContainer
    elevation={0}
    component={Paper}
    sx={{
      height: {
        // xs: 'auto',
           xs: 600,
        sm: 300,
        md: 350,
      },
      maxHeight: '80vh',
      overflowY: 'auto',
      '&::-webkit-scrollbar': {
        width: '6px',
        height: '6px', // for horizontal scrollbar
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
        },
      },
      scrollbarWidth: 'thin', // Firefox
      scrollbarColor: '#888 #f1f1f1', // Firefox
    }}
  >
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
                                indeterminate={selected.length > 0 && selected.length < branches.length}
                                checked={branches.length > 0 && selected.length === branches.length}
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
                      ) : branches.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={columns.length} align="center">
                            No branches found for selected company
                          </TableCell>
                        </TableRow>
                      ) : (
                        branches.map((branch, index) => {
                          const isSelected = selected.indexOf(branch._id) !== -1;
                          return (
                            <TableRow
                              key={branch._id}
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
                                  onChange={(event) => handleSelect(event, branch._id)}
                                  sx={{ padding: '4px' }}
                                />
                              </TableCell>
                              
                              <TableCell>{getSerialNumber(index)}</TableCell>
                              {/* <TableCell>{branch._id}</TableCell> */}
                              <TableCell>{branch.branchCode}</TableCell>
                              <TableCell>{branch.name}</TableCell>
                              <TableCell>{branch.manager}</TableCell>
                              <TableCell>{branch.address}</TableCell>
                              <TableCell>{branch.phoneNumber}</TableCell>
                              <TableCell>{branch.email}</TableCell>
                              
                              <TableCell>
                                <IconButton 
                                  sx={{ color: 'text.secondary' }}
                                  onClick={() => handleViewClick(branch)}
                                >
                                  <ViewIcon />
                                </IconButton>
                              </TableCell>
                                <TableCell>
                                <Button 
                                  variant="contained" 
                                  size="small" 
                                  sx={{ textTransform: 'capitalize',   boxShadow: 'none', // Removes button shadow
    '&:hover': {
      boxShadow: 'none', // Prevents shadow on hover too
    } }}
                                  onClick={() => handleManageBranches(branch._id)}
                                >
                                   Departments 
                                </Button>
                              </TableCell>
                              <TableCell>
  <Button 
    variant="contained" 
    size="small" 
    sx={{ textTransform: 'capitalize', ml: 1,   boxShadow: 'none', // Removes button shadow
    '&:hover': {
      boxShadow: 'none', // Prevents shadow on hover too
    } }}
    onClick={() => handleManageEmployees(branch._id)}
  >
    Employees
  </Button>
</TableCell>
                              {/* <TableCell>
                                <Tooltip title="Manage Departments">
                                  <IconButton
                                    sx={{ color: 'text.secondary' }}
                                    onClick={() => handleDepartmentClick(branch._id)}
                                  >
                                    <DepartmentIcon />
                                  </IconButton>
                                </Tooltip>
                              </TableCell> */}
                              
                              <TableCell>
                                <IconButton
                                  aria-label="more"
                                  aria-controls="long-menu"
                                  aria-haspopup="true"
                                  onClick={(e) => handleMenuClick(e, branch)}
                                  sx={{ color: 'text.secondary' }}
                                >
                                  <MoreVertIcon />
                                </IconButton>
                                <Menu
                                  id="long-menu"
                                  anchorEl={anchorEl}
                                  keepMounted
                                  open={openMenu && selectedBranch?._id === branch._id}
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
                                  <MenuItem onClick={() => handleConfirmDelete(selectedBranch._id)}>Delete</MenuItem>
                                </Menu>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                </Box>
              </Grid>

              {/* Pagination */}
           <Grid item xs={12}>
             <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
               {/* Rows per page dropdown aligned to the left */}
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
           
               {/* React Paginate - Centered */}
               <Box 
                sx={{
               '& .pagination li.selected a': {
                 backgroundColor: theme.palette.primary.main,
                 color: theme.palette.primary.contrastText,
                 borderColor: theme.palette.primary.main,
                 fontWeight: 500,
                 fontSize: theme.typography.fontSize,
               },
               '& .pagination li a': {
                 fontSize: theme.typography.body2.fontSize,
                   color: theme.palette.text.primary,
           
               },
             }}
               >
                 <ReactPaginate
                   previousLabel={'Previous'}
                   nextLabel={'Next'}
                   breakLabel={'...'}
                   breakClassName={'break-me'}
                   pageCount={pagination.total_pages}
                   marginPagesDisplayed={2}
                   pageRangeDisplayed={3}
                   onPageChange={({ selected }) => handlePageChange(selected + 1)}
                   containerClassName={'pagination'}
                   activeClassName={'selected'}
                   previousClassName={'previous'}
                   nextClassName={'next'}
                   disabledClassName={'disabled'}
                   forcePage={pagination.page - 1}
                   pageClassName={'page-item'}
                   pageLinkClassName={'page-link'}
                   previousLinkClassName={'page-link'}
                   nextLinkClassName={'page-link'}
                 />
               </Box>
           
               {/* Empty box to balance the layout */}
               <Box sx={{ width: 120 }} /> {/* This matches the width of the rows selector */}
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
                  {loadingCompanies ? 'Loading companies...' : 'Please select a company to view branches'}
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
                  label="Branch Code"
                  value={filters.branchCode}
                  onChange={(e) => handleFilterChange('branchCode', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Branch Name"
                  value={filters.name}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Manager"
                  value={filters.manager}
                  onChange={(e) => handleFilterChange('manager', e.target.value)}
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
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={filters.phoneNumber}
                  onChange={(e) => handleFilterChange('phoneNumber', e.target.value)}
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

        {/* View Branch Modal */}
        <ViewBranchModal 
          branch={selectedBranchView}
          open={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
        />

        {/* Delete Confirmation Popup */}
        <MyComponent />

        {/* Edit Branch Modal */}
        <Modal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          aria-labelledby="edit-branch-modal"
          aria-describedby="edit-branch-form"
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
            <Typography variant="h5" gutterBottom>Edit Branch</Typography>
            <Divider sx={{ mb: 3 }} />
            <Formik
              initialValues={currentBranch}
              validationSchema={validationSchema}
              onSubmit={handleEditSubmit}
              enableReinitialize
            >
              {({ values, errors, touched, handleChange }) => (
                <Form>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>Branch Information</Typography>
                      <Divider />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="branch Code*"
                        name="branchCode"
                        value={values.branchCode}
                         onChange={(e)=>{handleChange(e); ;if(editcheckfield.branchCode!=e.target.value){ checkFieldsExists(e.target.value,"branch_code")} } }

                         error={(touched.branchCode && Boolean(errors.branchCode)) || Boolean(branchCodeError)}
    helperText={
      (touched.branchCode && errors.branchCode) || 
      branchCodeError
    }
   
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Branch Name*"
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
                        label="Manager*"
                        name="manager"
                        value={values.manager}
                        onChange={handleChange}
                        error={touched.manager && Boolean(errors.manager)}
                        helperText={touched.manager && errors.manager}
                        variant="outlined"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Address*"
                        name="address"
                        value={values.address}
                        onChange={handleChange}
                        error={touched.address && Boolean(errors.address)}
                        helperText={touched.address && errors.address}
                        variant="outlined"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Phone Number*"
                        name="phoneNumber"
                        value={values.phoneNumber}
                        onChange={handleChange}
                        error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                        helperText={touched.phoneNumber && errors.phoneNumber}
                        variant="outlined"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
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

                    <Grid item xs={12}>
                      <Button 
                        fullWidth 
                        type="submit" 
                        variant="contained" 
                        color="primary"
                        size="large"
                        sx={{ mt: 3,textTransform:"none" }}
                      >
                        Update Branch
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Box>
        </Modal>

        {/* Add Branch Modal */}
        <Modal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          aria-labelledby="add-branch-modal"
          aria-describedby="add-branch-form"
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
            <Typography variant="h5" gutterBottom>Add New Branch</Typography>
            <Divider sx={{ mb: 3 }} />
            <Formik
              initialValues={newBranch}
              validationSchema={validationSchema}
              onSubmit={handleAddBranch}
            >
              {({ values, errors, touched, handleChange }) => (
                <Form>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>Branch Information</Typography>
                      <Divider />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="branch Code*"
                        name="branchCode"
                        value={values.branchCode}
                         onChange={(e)=>{handleChange(e); checkFieldsExists(e.target.value,"branch_code") } }

                         error={(touched.branchCode && Boolean(errors.branchCode)) || Boolean(branchCodeError)}
    helperText={
      (touched.branchCode && errors.branchCode) || 
      branchCodeError
    }

                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Branch Name*"
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
                        label="Manager*"
                        name="manager"
                        value={values.manager}
                        onChange={handleChange}
                        error={touched.manager && Boolean(errors.manager)}
                        helperText={touched.manager && errors.manager}
                        variant="outlined"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Address*"
                        name="address"
                        value={values.address}
                        onChange={handleChange}
                        error={touched.address && Boolean(errors.address)}
                        helperText={touched.address && errors.address}
                        variant="outlined"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Phone Number*"
                        name="phoneNumber"
                        value={values.phoneNumber}
                        onChange={handleChange}
                        error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                        helperText={touched.phoneNumber && errors.phoneNumber}
                        variant="outlined"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
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

                    <Grid item xs={12}>
                      <Button 
                        fullWidth 
                        type="submit" 
                        variant="contained" 
                        color="primary"
                        size="large"
                        sx={{ mt: 3,textTransform:"none"  }}
                      >
                        Add Branch
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Box>
        </Modal>

        {/* Floating Add Button - Only show when company is selected */}
        {selectedCompany && (
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
              onClick={() =>{ setAddModalOpen(true);setbranchCodeError("")} }
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

export default BranchlistPage;