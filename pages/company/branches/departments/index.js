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
  Fab} from '@mui/material';
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
    ChevronRight as ChevronRightIcon,
    Link, Home as HomeIcon,
  
} from '@mui/icons-material';
import { Breadcrumbs} from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import ApartmentIcon from '@mui/icons-material/Apartment';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { confirnDeleteAction, editDepartmentAction, getDepartmentList } from '@/store/authSlice';
import Layout from '../../../../components/Layout/Layout';
import MyComponent from '../../../../components/deletepopup';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import ViewDepartmentModal from '../../../../components/Dashboard/viewDepartment';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

const DepartmentlistPage = () => {
      const router = useRouter();
    console.log(router,"###############")
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
  const { getDepartmentListData } = useSelector(state => state.auth);
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




    useEffect(()=>{
              setSelectedBranch(router.query.id)
            //   console.log(router.query)
              setSelectedCompany(router.query.companyId)
    },[router.query.id])
  // Columns configuration
  const columns = [
    { id: 'checkbox', label: '', sortable: false },
    { id: 'srNo', label: 'SN.', sortable: false },
    { id: 'Id', label: 'Id', sortable: false },
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
  const fetchDepartments = async () => {
    if (!selectedBranch) return;
    
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

      let token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3001/department/${selectedBranch}`, {
          headers: { Authorization: token },
          params
        }
      );
      setDepartments(response.data?.data);
      setPagination({
        ...pagination,
        total_pages: Math.ceil(response.data.count / pagination.page_size),
        count: response.data.count
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

//   useEffect(() => {
//     if (selectedCompany) {
//       fetchBranches(selectedCompany);
//       setSelectedBranch(null); // Reset branch selection when company changes
//     }
//   }, [selectedCompany]);
  useEffect(() => {
    if (router.query.companyId) {
      fetchBranches(router.query.companyId);
    //   setSelectedBranch(null); // Reset branch selection when company changes
    }
  }, [router.query.companyId]);
  useEffect(() => {
    if (selectedBranch) {
      fetchDepartments();
      setNewDepartment(prev => ({ ...prev, branchId: selectedBranch }));
    }
  }, [selectedBranch, pagination.page, pagination.page_size, sorting, search, filters, deletepopup.editDepartmentData]);

  // Handle select all
const handleSelectAll = (event) => {
  if (event.target.checked) {
    const newSelected = departments.map(staff => staff._id); // Use _id instead of id if that's your key
    setSelected(newSelected);
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
    newSelected = [...selected, id];
  } else {
    newSelected = selected.filter(item => item !== id);
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
    fetchDepartments();
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      name: '',
      dept_code: '',
      ordering: ""
    });
  };

  // Handle menu click
   let [editcheckfield,seteditcheckfield]=useState({})

  const handleMenuClick = (event, department) => {
    setAnchorEl(event.currentTarget);
    setSelectedDepartment(department);
    seteditcheckfield({dept_code:staff.dept_code})
      setdeptCodeError("")
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
      let token = localStorage.getItem("token");
             if(Array.isArray(id)){
                  
                     var data = { Ids: id, action_type: "delete" };
                  var response = await axios.post(`http://localhost:3001/department/delete-bulk`,data, {
                    headers: { Authorization: token }
                  });
                 }
                 else{
                            var response = await axios.get(`http://localhost:3001/department/deleteUser/${id}`, {
              headers: { Authorization: token }
            });
                 }
      // const response = await axios.delete(`http://localhost:3001/department/${id}`, {
      //   headers: { Authorization: token }
      // });
      
      if(response?.data.detail) {
        setOpenSnackbar(response?.data.detail);
      } else {
        setOpenSnackbar({status: true, message: 'Department deleted successfully'});
        setSelected([]);
        setShowDelete(false);
        dispatch(confirnDeleteAction(false));
        fetchDepartments();
      }
    } catch (error) {
      console.error('Error deleting department:', error);
      setOpenSnackbar(error.response?.data?.detail || 'Error deleting department');
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
    setdeptCodeError("")
    if (selectedDepartment) {
      setCurrentDepartment(selectedDepartment);
      setEditModalOpen(true);
    }
    handleMenuClose();
  };

  const handleEditSubmit = async (values) => {
    try {
      values={...values,id:values._id}
      dispatch(editDepartmentAction(values));
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error updating department:', error);
    }
  };

  // Handle add department
  const handleAddDepartment = async (values) => {
    try {
      let token = localStorage.getItem("token");
      const response = await axios.post('http://localhost:3001/department', values, {
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

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  useEffect(() => {
    dispatch(getDepartmentList());
  }, [dispatch]);


  
    const debounce = (func, delay) => {
      let timeoutId;
      return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
        }, delay);
      };
    };
      const [deptCodeError, setdeptCodeError] = useState('');
      
      // Debounced validation functions
      const checkFieldsExists = debounce(async (value,field,id) => {
        if (!value){
          setdeptCodeError("")
           return 
        }
        try {
          let token = localStorage.getItem("token");
          const response = await axios.post(`http://localhost:3001/department/checkandverifyfields`, { field:"dept_code", dept_code: value }, {
            headers: { Authorization: token }
          });
          if(field=="dept_code"){
          setdeptCodeError(response.data.message ? 'dept code already exists' : '');
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
        Department List
      </Typography>
<Breadcrumbs
  separator={<ChevronRightIcon fontSize="small" />}
  aria-label="breadcrumb"
  sx={{ '& .MuiBreadcrumbs-separator': { mx: 1 } }}
>
  {/* Companies */}
<Box
  component="a"
  sx={{
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: 'inherit',
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline'
    }
  }}
  onClick={() => router.push("/company/companylist")}
>
  <BusinessIcon sx={{ mr: 0.5, fontSize: 20 }} />
  Companies
</Box>


  {/* Branches */}
  {/* <NextLink href="/company/branches" passHref legacyBehavior> */}
    <Box 
      component="a" 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        textDecoration: 'none', 
            cursor: 'pointer',

        color: 'inherit',
        '&:hover': {
          textDecoration: 'underline'
        }
      }}
        onClick={() => router.push({pathname:"/company/branches",query:{id:router.query.companyId}})}

    >
      <StoreIcon sx={{ mr: 0.5, fontSize: 20 }} />
      Branches
    </Box>
  {/* </NextLink> */}

  {/* Departments */}
  <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
    <ApartmentIcon sx={{ mr: 0.5, fontSize: 20 }} />
    Departments
  </Typography>
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
          {/* <Grid item xs={12} sm={6}>
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

          {/* Branch Selection - Only show if company is selected */}
          {/* {selectedCompany && (
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
          )} */}
          <Grid item xs={12} sm={6}>
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
        ? 'Loading company...'
        : companies.find((c) => c._id === selectedCompany)?.name || 'No company selected'}
    </Typography>
  </Box>
</Grid>

{selectedCompany && (
  <Grid item xs={12} sm={6}>
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
      <StoreIcon sx={{ marginRight: 1 }} />
      <Typography variant="body1">
        {loadingBranches
          ? 'Loading branch...'
          : branches.find((b) => b._id === selectedBranch)?.name || 'No branch selected'}
      </Typography>
    </Box>
  </Grid>
)}


          {/* Department Table - Only show if branch is selected */}
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
                 indeterminate={selected.length > 0 && selected.length < departments.length}
                 checked={departments.length > 0 && selected.length === departments.length}
                 onChange={handleSelectAll}
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
                          const isSelected = selected.includes(department._id);
                          return (
                            <TableRow
                              key={department.id}
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
                                         onChange={(event) => handleSelect(event, department._id)} // Pass _id here
                                       />
                              </TableCell>
                              
                              <TableCell>{getSerialNumber(index)}</TableCell>
                              <TableCell>{department._id}</TableCell>
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
                                  open={openMenu && selectedDepartment?.id === department.id}
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
                                  <MenuItem onClick={() => handleConfirmDelete(selectedDepartment._id)}>Delete</MenuItem>
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
                         onChange={(e)=>{handleChange(e); ;if(editcheckfield.dept_code!=e.target.value){ checkFieldsExists(e.target.value,"dept_code")} } }

                         error={(touched.dept_code && Boolean(errors.dept_code)) || Boolean(deptCodeError)}
    helperText={
      (touched.dept_code && errors.dept_code) || 
      deptCodeError
    }
                      
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
                  
                         onChange={(e)=>{handleChange(e); checkFieldsExists(e.target.value,"dept_code") } }

                         error={(touched.dept_code && Boolean(errors.dept_code)) || Boolean(deptCodeError)}
    helperText={
      (touched.dept_code && errors.dept_code) || 
      deptCodeError
    }
   
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

export default DepartmentlistPage;