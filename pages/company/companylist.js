import React, { useState, useEffect } from 'react';
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
  Chip,
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
  Backdrop,
  CircularProgress,
  Skeleton,
  Snackbar,
  Alert,
  SnackbarContent
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { 
  Search as SearchIcon,
  FilterList as FilterIcon,
  ArrowDownward as ArrowDownIcon,
  ArrowUpward as ArrowUpIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { confirnDeleteAction,editCompanyAction } from '@/store/authSlice';
// import { confirnDeleteAction, editCompanyAction, getCompanyList } from '@/store/authSlice';
// import { confirnDeleteAction, editCompanyAction, getCompanyList } from '@/store/authSlice';

import Layout, { theme } from '../../components/Layout/Layout';
import SuccessSnackbar from '../../components/common/successpopup';
import MyComponent from '../../components/common/deletepopup';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import ViewCompanyModal from '../../components/Dashboard/viewcompany';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Router, { useRouter } from 'next/router';
import ReactPaginate from 'react-paginate';
const CompanyListPage = () => {
  // State for table data and UI
  let router=useRouter()
  const [companies, setCompanies] = useState([]);
  let [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const deletepopup = useSelector((state) => state.auth);
  const selectodata = useSelector(state => state.auth);
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
    companyId:"",
    name: '',
    owner: '',
    email: '',
    phoneNumber: '',
    industry: '',
    ordering: ""
  });
 let reduxdata=useSelector((state)=>{if(state.users.getPermission){return((state.users.getPermission))}else{return(state.users.getPermission)} })
  var rolepermission={}
var allpermission={}
 if(reduxdata?.rolepermission){
 rolepermission=JSON.parse( reduxdata.rolepermission)
 allpermission=reduxdata.allpermission
 }  
  // Dropdown options
  const [dropdownOptions, setDropdownOptions] = useState({
    industries: ['Information Technology', 'Finance', 'Healthcare', 'Manufacturing', 'Retail'],
    ordering: [
      { id: 'name', label: 'Company Name', sortable: true },
      { id: 'owner', label: 'Owner', sortable: true },
      { id: 'email', label: 'Email', sortable: true },
      { id: 'phoneNumber', label: 'Phone Number', sortable: true },
      { id: 'industry', label: 'Industry', sortable: true },
    ]
  });

  // Menu state for actions
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const openMenu = Boolean(anchorEl);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState({});

  // View modal state
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedCompanyView, setSelectedCompanyView] = useState({});

  // Columns configuration
  const columns = [
    { id: 'checkbox', label: '', sortable: false },
    { id: 'srNo', label: 'SN.', sortable: false },
    // { id: 'Id', label: 'Id', sortable: false },
    { id: 'CompanyId', label: 'Company Code', sortable: true },
    { id: 'name', label: 'Company Name', sortable: true },
    { id: 'owner', label: 'Owner', sortable: true },
    { id: 'email', label: 'Email', sortable: true },
    { id: 'phoneNumber', label: 'Phone Number', sortable: true },
    { id: 'industry', label: 'Industry', sortable: true },
    { id: 'view', label: 'View', sortable: false },
    ...((allpermission?.length && rolepermission.permission.includes(allpermission[1]._id)) ? [{ id: 'managebranchesw', label: 'Manage', sortable: false }]:[]),
    { id: 'actions', label: 'Actions', sortable: false }
  ];
  console.log(allpermission,"987555555555")
  // Fetch companies data
  const fetchCompanies = async (page=1,page_size=10) => {
    try {
      setLoading(true);
      
      // Construct query params
      const params = {
        page: page,
        page_size:page_size,
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
        `${process.env.NEXT_PUBLIC_BASE_URL}/company`, {
          headers: { Authorization: token },
          params
        }
      );
//     let response={data:{data:   [{
//         "id": 1745927114285,
//         "name": "Company 7",
//         "owner": "John Doe",
//         "mailingAddress": "123 Main Street, City, Country",
//         "email": "contact@company5.com",
//         "phoneNumber": "+1234567890",
//         "nominalCapital": "500000 USD",
//         "industry": "Information Technology",
//         "website": "https://company2.com",
//         "companyDescription": "A leading IT service provider.",
//         "branches": []
//     },
//     {
//         "id": 1745927859946,
//         "name": "Company 8",
//         "owner": "John Doe 8",
//         "mailingAddress": "123 Main Street, City, Country",
//         "email": "contact@company5.com",
//         "phoneNumber": "+1234567890",
//         "nominalCapital": "500000 USD",
//         "industry": "Information Technology",
//         "website": "https://company2.com",
//         "companyDescription": "A leading IT service provider.",
//         "branches": []
//     }
// ]}, count:15}
// response.data=response.data.slice(2)
      setCompanies(response.data?.data);
      setPagination({
        ...pagination,
        page,
        page_size,
        total_pages: Math.ceil(response?.data?.count / page_size),
        count: response.data.count
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching companies:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [ sorting, search, deletepopup.editCompanyData]);

  // Handle select all
const handleSelectAll = (event) => {
  if (event.target.checked) {
    const newSelected = companies.map((company) => company._id); // Use _id instead of id if that's your key
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
    fetchCompanies(newPage,pagination.page_size)
  };

  // Handle page size change
  const handlePageSizeChange = (event) => {
    setPagination({ ...pagination, page_size: event.target.value, page: 1 });
     fetchCompanies(pagination.page,event.target.value)
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
    fetchCompanies();
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      name: '',
      owner: '',
      email: '',
      phoneNumber: '',
      industry: '',
      ordering: ""
    });
  };


  let [editcheckfield,seteditcheckfield]=useState({})
  // Handle menu click
  const handleMenuClick = (event, staff) => {
    setAnchorEl(event.currentTarget);
    setSelectedCompany(staff);
    seteditcheckfield({companyId:staff.companyId,email:staff.email})
  };
  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle delete confirmation
  const handleConfirmDelete = (id) => {
    dispatch(confirnDeleteAction("sure"));
    sessionStorage.setItem("deleteIds", JSON.stringify(id));
    handleMenuClose();
  };

  // Handle delete
  const handleDelete = async (id) => {
    id = JSON.parse(sessionStorage.getItem("deleteIds"));
    try {
      let token = localStorage.getItem("biometric_token");
      const authHeader = token?.startsWith("Bearer ") ? token : `Bearer ${token}`;
     if(Array.isArray(id)){
      
         var data = { companyIds: id, action_type: "delete" };
      var deleteresponse = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/company/delete-bulk`,data, {
        headers: { Authorization: authHeader }
      });
     }
     else{
  //  var data = { companyIds: Array.isArray(id) ? id : [id], action_type: "delete" };
      var deleteresponse = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/company/`+id, {
        headers: { Authorization: authHeader }
      });
     }
      if(deleteresponse?.data.detail) {
        setOpenSnackbar(deleteresponse?.data.detail)
      } else {
        setOpenSnackbar({status: true, message: deleteresponse?.data.message})
        setSelected([]);
        setShowDelete(false);
        dispatch(confirnDeleteAction(false));
        setOpen("deletecompany");
        fetchCompanies();
      }
    } catch (error) {
      console.error('Error deleting companies:', error);
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

  const { editCompanyData } = useSelector(state => state.auth);
  useEffect(() => {
    if (editCompanyData!=undefined && Object.keys(editCompanyData).length) {
      setOpen("editcompany");
    }
  }, [editCompanyData]);

  const handleEdit = () => {
    setCompanyIdError("")
    setEmailError("")
    if (selectedCompany) {
      setCurrentCompany(selectedCompany);
      setEditModalOpen(true);
    }
    handleMenuClose();
  };

  const handleEditSubmit = async (values) => {
    try {
      const payload = { ...values, id: values._id };
      await dispatch(editCompanyAction(payload)).unwrap();
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error updating company:', error);
    }
  };

  const initialValues = {
    ...currentCompany
  };

  const validationSchema = Yup.object({
    // companyId:Yup.string().required('Company Id is required'),
  companyId: Yup.string()
    .required('Company Id is required')
    .test(
      'companyId-exists',
      'Company ID already exists',
      () => !companyIdError // This will be updated by our debounced function
    ),
  name: Yup.string().required("Required"),
  owner: Yup.string().required("Required"),
  email: Yup.string()
    .email("Invalid email")
    .required("Required")
    .test(
      'email-exists',
      'Email already exists',
      () => !emailError // This will be updated by our debounced function
    ),
  phoneNumber: Yup.string().required("Required"),
  industry: Yup.string().required("Required"),
  mailingAddress: Yup.string().required("Required"),
  nominalCapital: Yup.string().required("Required"),
  });

  // Handle view click
  const handleViewClick = (company) => {
    setSelectedCompanyView(company);
    setViewModalOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 3000);
  }, [])

//   useEffect(() => {
//     dispatch(getCompanyList());
//   }, [])

  // snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };


const industries = [
  { label: 'Information Technology', value: 'Information Technology' },
  { label: 'Finance', value: 'Finance' },
  { label: 'Healthcare', value: 'Healthcare' },
  { label: 'Manufacturing', value: 'Manufacturing' },
  { label: 'Retail', value: 'Retail' },
  { label: 'Education', value: 'Education' },
  { label: 'Other', value: 'Other' }
];
const handleManageBranches=(id)=>{
handleMenuClose();
router.push({
  pathname: '/company/branches',
  query: { id: id }
});
}

// utils/debounce.js
const debounce = (func, delay) => {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};
// Inside the add company modal form
const [emailError, setEmailError] = useState('');
const [companyIdError, setCompanyIdError] = useState('');

// Debounced validation functions
const checkCompanyIdExists = debounce(async (value,field) => {
  if (!value){
    setCompanyIdError("")
     setEmailError("")
     return 
  }
  try {
    let token = localStorage.getItem("biometric_token");
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/company/checkandverifyfields`,field=="companyId" ? { field:"companyId", companyId: value }:{ field:"company_email", email: value }, {
      headers: { Authorization: token }
    });
    if(field=="companyId"){
    setCompanyIdError(response.data.message ? 'Company ID already exists' : '');
    }
    else{
          setEmailError(response.data.message ? 'Email already exists' : '');
    }
  } catch (error) {
    console.error('Error checking company ID:', error);
  }
}, 1000);


 return (
    <>
      <Layout>
        <Grid container spacing={3}>
          {/* Header Section */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={0} sx={{ flexWrap: 'wrap', rowGap: 2 }}>
              <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 600 }}>
                Company List
              </Typography>
              
              <Box display="flex" alignItems="center" gap={1}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => router.push('/company/addcompany')}
                  sx={{
                    textTransform: 'none',
                    boxShadow: 'none',
                    backgroundColor: '#0E9F6E',
                    '&:hover': {
                      backgroundColor: '#0b7d57',
                      boxShadow: 'none',
                    },
                  }}
                >
                  Add Company
                </Button>

                {showDelete && (
                  <Tooltip title={`Delete selected (${selected.length})`}>
                    <IconButton
                      color="error"
                      onClick={() => {handleConfirmDelete(selected)}}
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

          {/* Company Table */}
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
  indeterminate={selected.length > 0 && selected.length < companies.length}
  checked={companies.length > 0 && selected.length === companies.length}
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
                        <>
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
                        </>
                      </TableCell>
                    </TableRow>
                  ) : companies.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} align="center">
                        No Company found
                      </TableCell>
                    </TableRow>
                  ) : ( companies.length &&
                    companies.map((company, index) => {
                      const isSelected = selected.indexOf(company._id) !== -1;
                      return (
                        <>  
                          <TableRow
                            key={company._id}
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
  checked={selected.indexOf(company._id) !== -1}  // Make sure to use _id if that's your key
  onChange={(event) => handleSelect(event, company._id)}  // Use _id if that's your key
  sx={{ padding: '4px' }}
/>
                            </TableCell>
                            
                            <TableCell>{getSerialNumber(index)}</TableCell>
                             {/* <TableCell>{company?._id}</TableCell> */}
                            <TableCell>{company?.companyId}</TableCell>

                            <TableCell>{company?.name}</TableCell>
                            <TableCell>{company?.owner}</TableCell>
                            <TableCell>{company?.email}</TableCell>
                            <TableCell>{company?.phoneNumber}</TableCell>
                            <TableCell>{company?.industry}</TableCell>
                            
                            <TableCell>
                              <IconButton 
                                sx={{ color: 'text.secondary' }}
                                onClick={() => handleViewClick(company)}
                              >
                                <ViewIcon />
                              </IconButton>
                            </TableCell>
                              {(allpermission?.length && rolepermission?.permission?.includes(allpermission?.[1]?._id)) ? 
                            <TableCell>
                            
  <Button 
    variant="contained" 
    size="small" 
    sx={{ textTransform: 'capitalize',   boxShadow: 'none', // Removes button shadow
    '&:hover': {
      boxShadow: 'none', // Prevents shadow on hover too
    } }}
    onClick={() => handleManageBranches(company._id)}
  >
     Branches 
  </Button>
</TableCell> :"" }
                            <TableCell>
                              <IconButton
                                aria-label="more"
                                aria-controls="long-menu"
                                aria-haspopup="true"
                                onClick={(e) => handleMenuClick(e, company)}
                                sx={{ color: 'text.secondary' }}
                              >
                                <MoreVertIcon />
                              </IconButton>
                              <Menu
                                id="long-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={openMenu && selectedCompany?._id === company._id}
                                onClose={handleMenuClose}
                                PaperProps={{
                                  style: {
                                    width: '20ch',
                                    boxShadow: 'none',
                                  },
                                  elevation: 0,
                                }}
                              >
                                <MenuItem onClick={() => handleManageBranches(company._id)}>
                                  Manage Branches
                                </MenuItem>
                                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                                <MenuItem onClick={() => handleConfirmDelete(selectedCompany?._id)}>Delete</MenuItem>
                              </Menu>
                            </TableCell>
                          </TableRow>
                        </>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            </Box>
          </Grid>

          {/* Pagination */}
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



        </Grid>

        {/* Filter Modal */}
        <Dialog open={filterOpen} onClose={() => setFilterOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Sort & Filter</DialogTitle>
          
          <DialogContent dividers>
            <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Company Id"
                  value={filters.companyId}
                  onChange={(e) => handleFilterChange('companyId', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Company Name"
                  value={filters.name}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Owner"
                  value={filters.owner}
                  onChange={(e) => handleFilterChange('owner', e.target.value)}
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
              
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Industry</InputLabel>
                  <Select
                    value={filters.industry}
                    label="Industry"
                    onChange={(e) => handleFilterChange('industry', e.target.value)}
                  >
                    {dropdownOptions.industries.map((industry) => (
                      <MenuItem key={industry} value={industry}>
                        {industry}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Ordering</InputLabel>
                  <Select
                    value={filters.ordering}
                    label="Ordering"
                    onChange={(e) => handleFilterChange('ordering', e.target.value)}
                  >
                    {dropdownOptions.ordering.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.label}
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

        {/* View Company Modal */}
        <ViewCompanyModal 
          company={selectedCompanyView}
          open={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
        />

        {/* Edit Company Modal */}
        <Modal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          aria-labelledby="edit-company-modal"
          aria-describedby="edit-company-form"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              maxWidth: 900,
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
                },
              },
              scrollbarWidth: 'thin',
              scrollbarColor: '#888 #f1f1f1',
            }}
          >
            <Typography variant="h5" gutterBottom>Edit Company</Typography>
            <Divider sx={{ mb: 3 }} />

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleEditSubmit}
              enableReinitialize
            >
              {({ values, errors, touched, handleChange }) => (
                <Form>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Company Id*"
                        name="companyId"
                        value={values.companyId}
                        onChange={(e) => {
                          handleChange(e);
                          if (editcheckfield.companyId !== e.target.value) {
                            checkCompanyIdExists(e.target.value, 'companyId');
                          }
                        }}
                        error={(touched.companyId && Boolean(errors.companyId)) || Boolean(companyIdError)}
                        helperText={(touched.companyId && errors.companyId) || companyIdError}
                        variant="outlined"
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Company Name*"
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
                        label="Owner*"
                        name="owner"
                        value={values.owner}
                        onChange={handleChange}
                        error={touched.owner && Boolean(errors.owner)}
                        helperText={touched.owner && errors.owner}
                        variant="outlined"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Mailing Address*"
                        name="mailingAddress"
                        value={values.mailingAddress}
                        onChange={handleChange}
                        error={touched.mailingAddress && Boolean(errors.mailingAddress)}
                        helperText={touched.mailingAddress && errors.mailingAddress}
                        variant="outlined"
                        multiline
                        rows={3}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Email*"
                        name="email"
                        value={values.email}
                        onChange={(e) => {
                          handleChange(e);
                          if (editcheckfield.email !== e.target.value) {
                            checkCompanyIdExists(e.target.value, 'company_email');
                          }
                        }}
                        error={(touched.email && Boolean(errors.email)) || Boolean(emailError)}
                        helperText={(touched.email && errors.email) || emailError}
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
                        label="Nominal Capital*"
                        name="nominalCapital"
                        value={values.nominalCapital || ''}
                        onChange={handleChange}
                        error={touched.nominalCapital && Boolean(errors.nominalCapital)}
                        helperText={touched.nominalCapital && errors.nominalCapital}
                        variant="outlined"
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        select
                        label="Industry*"
                        name="industry"
                        value={values.industry || ''}
                        onChange={handleChange}
                        error={touched.industry && Boolean(errors.industry)}
                        helperText={touched.industry && errors.industry}
                        variant="outlined"
                      >
                        {industries.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Website"
                        name="website"
                        value={values.website || ''}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Company Description"
                        name="companyDescription"
                        value={values.companyDescription || ''}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={4}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        sx={{ mt: 3, textTransform: 'none' }}
                      >
                        UPDATE COMPANY
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Box>
        </Modal>

        {/* Success Snackbar */}
        <SuccessSnackbar open={open} handleClose={handleClose} />
        <MyComponent />
        
        {/* Delete Confirmation Popup */}



        {/* Error Snackbar */}
        {/* {(openSnackbar.status || openSnackbar) && 
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert 
              onClose={handleCloseSnackbar} 
              severity={openSnackbar.status ? "success" : "error"}
              variant="filled"
              sx={{ width: '100%' }}
            >
              {openSnackbar.status ? openSnackbar.message : openSnackbar}
            </Alert>
          </Snackbar>
        } */}
       {(openSnackbar.status || openSnackbar) && 
  <Snackbar
  open={openSnackbar}
  autoHideDuration={2000}
  onClose={handleCloseSnackbar}
  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
>
  <SnackbarContent
    style={{ 
      backgroundColor: openSnackbar.status ? '#0e9f6e' : '#d32f2f', 
      color: 'white' 
    }}
    message={
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {openSnackbar.status ? (
          <CheckCircleIcon style={{ marginRight: 8 }} />
        ) : (
          <ErrorIcon style={{ marginRight: 8 }} />
        )}
        {openSnackbar.status ? openSnackbar.message : openSnackbar}
      </div>
    }
    action={
      <IconButton 
        size="small" 
        onClick={handleCloseSnackbar} 
        style={{ color: 'white' }}
      >
        <CloseIcon />
      </IconButton>
    }
  />
</Snackbar>
          }



      </Layout>
    </>
  );
};

export default CompanyListPage;
