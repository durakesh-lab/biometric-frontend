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
  DialogContentText,
  Breadcrumbs
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
  VisibilityOff,
   ChevronRight as ChevronRightIcon,Group as GroupIcon
} from '@mui/icons-material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CloseIcon from '@mui/icons-material/Close';
import StoreIcon from '@mui/icons-material/Store';
import ApartmentIcon from '@mui/icons-material/Apartment';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { confirnDeleteAction, editStaffAction, getStaffList } from '@/store/authSlice';
import Layout, { theme } from '../../../../components/Layout/Layout';
import MyComponent from '../../../../components/deletepopup';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import ViewStaffModal from '../../../../components/Dashboard/viewstaff';
import { Download as DownloadIcon } from '@mui/icons-material';
import { Upload as UploadIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';
import ImportEmployeeModal from '../../../../components/Employee/importmodal';
import ReactPaginate from 'react-paginate';

const genders = [ { label: "Male", value: "M" }, { label: "Female", value: "F" }];

const StaffListPage = () => {
  // State for companies
  let router=useRouter()
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
    gender:"",
    mobile:"",
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

    const [exportModalOpen, setExportModalOpen] = useState(false);
  

        useEffect(()=>{
                  setSelectedBranch(router.query.id)
                //   console.log(router.query)
                  setSelectedCompany(router.query.companyId)
        },[router.query.id])

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
      let token = localStorage.getItem("biometric_token");
      
      const response = await axios.get(
       `${process.env.NEXT_PUBLIC_BASE_URL}/department/${branchId}`, {
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
// Fetch staff data
const fetchStaff = async () => {
  if (!selectedBranch || !selectedCompany) return;
  
  try {
    setLoading(true);
    
    // Construct query params - use current pagination state
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
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/users/allusers`,
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
    //   setSelectedBranch(null); // Reset branch selection when company changes
      setNewStaff(prev => ({ ...prev, companyId: selectedCompany }));
    }
  }, [selectedCompany]);

  useEffect(() => {
    if (selectedBranch) {
      fetchDepartments(selectedBranch);
      fetchStaff();
      setNewStaff(prev => ({ ...prev, branchId: selectedBranch }));
    }
  }, [selectedBranch, pagination.page,filters, pagination.page_size, sorting, search, deletepopup?.edituserdata]);

  // Handle select all
const handleSelectAll = (event) => {
  if (event.target.checked) {
    const newSelected = staff.map(staff => staff._id); // Use _id instead of id if that's your key
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
  setPagination(prev => ({
    ...prev,
    page: 1  // Reset to page 1 when filters change
  }));
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

  let [editcheckfield,seteditcheckfield]=useState({})
  // Handle menu click
  const handleMenuClick = (event, staff) => {
    setAnchorEl(event.currentTarget);
    setSelectedStaff(staff);
    seteditcheckfield({username:staff.username,email:staff.email})
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
            var response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/users/delete-bulk`,data, {
              headers: { Authorization: token }
            });
           }
           else{
                      var response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/users/deleteUser/${id}`, {
        headers: { Authorization: token }
      });
           }
    //   const response = await axios.get(`http://localhost:3001/users/deleteUser/${id}`, {
    //     headers: { Authorization: token }
    //   });
      
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
 setUsernameError("");
 setEmailError("")
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
      let token = localStorage.getItem("biometric_token");
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/register`, values, {
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


  const handleManageEmployees=(id)=>{
router.push({
  pathname: '/company/branches/staff',
  query: { id: id ,companyId:router.query.id }
});
}

  const handleManagegroups=(id)=>{
router.push({
  pathname: '/managegroup',
  query: { branchId: selectedBranch ,companyId:selectedCompany }
});
}
  // Validation schema
  const validationSchema = Yup.object({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
        gender: Yup.string().required("Required"),
    mobile: Yup.string().required("Required"),
          email: Yup.string()
            .email("Invalid email")
            .required("Required")
            .test(
              'email-exists',
              'Email already exists',
              () => !emailError // This will be updated by our debounced function
            ),
              username: Yup.string()
                .required("Required")
                .test(
                  'username-exists',
                  'username already exists',
                  () => !usernameError // This will be updated by our debounced function
                ),
    // username: Yup.string().required("Required"),
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
// const [branch, setShowPassword] = useState(false);


// useMemo(()=>{
//  branches.map((branch) => (
//                       <MenuItem key={branch._id} value={branch._id}>
//                         {branch.name}
//                       </MenuItem>
//                     ))
// },[])

  // Add this function to handle the export
  const handleExportEmployees = () => {
    try {

      // Create CSV content
      const headers = [
        "username", "First Name", "Last Name","email", "Date of Joining", "Date OF Birth", 
        "Mobile", "Gender", 'active_status', "Department Code", 
        "Department Name",  "Company Id","branch Code",
       
      ].join(",");
      
      const rows = staff.map(employee => {
        return [
          employee.username || '',
          employee.firstName || '',
          employee.lastName || '',
          employee.email || '',
            employee.joining_date || '',
          employee.date_of_birth || '',
          employee.mobile || '',
           employee.gender || '',
              employee.active_status || '',
          employee.dept_code || '',
          employee.dept_name|| '',
          employee.company_Id|| '',
          employee.branchCode|| '',
        
          '' // Aadhaar No. (not in your data)
        ].map(field => `"${field}"`).join(",");
      });
      
      const csvContent = [headers, ...rows].join("\n");
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'employees_export.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setOpenSnackbar({status:"success",message:"Record exported successfully"});
      setExportModalOpen(false);
    } catch (error) {
      console.error('Error exporting employees:', error);
    }
  };



  const debounce = (func, delay) => {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };
    const [emailError, setEmailError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    
    // Debounced validation functions
    const checkFieldsExists = debounce(async (value,field,id) => {
      if (!value){
        setUsernameError("")
         setEmailError("")
         return 
      }
      try {
        let token = localStorage.getItem("biometric_token");
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/users/checkandverifyfields`,field=="username" ? { field:"username", username: value,id }:{ field:"email", email: value ,id}, {
          headers: { Authorization: token }
        });
        if(field=="username"){
        setUsernameError(response.data.message ? 'username already exists' : '');
        }
        else{
              setEmailError(response.data.message ? 'Email already exists' : '');
        }
      } catch (error) {
        console.error('Error checking company ID:', error);
      }
    }, 1000);



      const [importModalOpen, setImportModalOpen] = useState(false);
      const handleImportEmployees = async (formData) => {
        try {
          let token = localStorage.getItem("biometric_token");
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/users/import`, 
            formData,
            {
              headers: { 
                Authorization: token,
                'Content-Type': 'multipart/form-data'
              }
            }
          );
          // setOpen("importsuccess");
          console.log(response,"response",{response})
          setOpenSnackbar({status: true, message:response?.data?.count +" "+ 'Staff imported successfully'});
          fetchStaff();
        } catch (error) {
          console.error('Error importing employees:', error);
        }
      };
  return (
    <>
      <Layout>

        <Grid container spacing={3}>
          {/* Header Section */}
          <Grid item xs={12}>
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
                  <GroupIcon sx={{ mr: 0.5, fontSize: 20 }} />
                  Staff
                </Typography>
              </Breadcrumbs>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={0} sx={{ flexWrap: 'wrap', rowGap: 2 }}>
              <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 600 }}>
                Staff List
              </Typography>
     
<Box display="flex" alignItems="center" gap={1} sx={{ 
  flexDirection: { xs: 'column', sm: 'row' },
  width: '100%',
  '& > *': {
    width: { xs: '100%', sm: 'auto' },
    mb: { xs: 1, sm: 0 }
  }
}}>
  {showDelete && (
    <Tooltip title={`Delete selected (${selected.length})`}>
      <IconButton
        color="error"
        onClick={() => handleConfirmDelete(selected)}
        sx={{ alignSelf: 'flex-start' }}
      >
        <DeleteIcon />
        <Typography variant="caption" sx={{ ml: 0.5 }}>
          ({selected.length})
        </Typography>
      </IconButton>
    </Tooltip>
  )}
    <Dialog open={exportModalOpen} onClose={() => setExportModalOpen(false)}>
  <DialogTitle>Export Employees</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Are you sure you want to export {staff.length} staff to a CSV file?
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setExportModalOpen(false)} color="primary">
      Cancel
    </Button>
    <Button onClick={handleExportEmployees} color="primary" variant="contained">
      Export
    </Button>
  </DialogActions>
</Dialog>
  {/* This Box will push everything to the right */}
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto', flexDirection: { xs: 'column', sm: 'row' }, width: { xs: '100%', sm: 'auto' } }}>
    {/* Export Button */}
{/* <Button 
  variant="outlined" 
  color="primary"
  startIcon={<GroupIcon />}
  sx={{ textTransform: "none", width: { xs: '100%', sm: 'auto' } }}
  onClick={() => handleManagegroups()}
>
  Manage Group
</Button> */}

<Button
  startIcon={<UploadIcon />}
  onClick={() => setExportModalOpen(true)}
  variant="outlined"
  color="primary"
  sx={{ textTransform: "none", width: { xs: '100%', sm: 'auto' } }}
>
  Export
</Button>


    {/* Import Button */}
    <Button
      startIcon={<DownloadIcon />}
      onClick={() => setImportModalOpen(true)}
      variant="outlined"
      color="primary"
      sx={{ textTransform: "none",width: { xs: '100%', sm: 'auto' } }}
    >
      Import
    </Button>

    {/* Filter Button */}
    <Button
      startIcon={<FilterIcon />}
      onClick={() => setFilterOpen(true)}
      sx={{ 
        backgroundColor: '#f5f5f5',
        color: 'text.secondary',
        '&:hover': { backgroundColor: '#e0e0e0' },width: { xs: '100%', sm: 'auto' },
        textTransform: "none"
      }}
    >
      <Typography variant="body2">Sort & Filter</Typography>
    </Button>

    {/* Role Filter - Full width on mobile */}
    <FormControl size="small" sx={{ minWidth: 120, width: { xs: '100%', sm: 'auto' } }}>
      <InputLabel>Role</InputLabel>
      <Select
        value={filters.role || ''}
        label="Role"
        onChange={(e) => {
          handleFilterChange('role', e.target.value);
          setPagination(prev => ({ ...prev, page: 1 }));
        }}
        sx={{ color: 'text.secondary' }}
        startAdornment={
          <InputAdornment position="start">
            <RoleIcon fontSize="small" />
          </InputAdornment>
        }
      >
        <MenuItem value="">All Roles</MenuItem>
        {roleTypes.map((role) => (
          <MenuItem key={role} value={role}>{role}</MenuItem>
        ))}
      </Select>
    </FormControl>

    {/* Department Filter - Full width on mobile */}
    <FormControl size="small" sx={{ minWidth: 120, width: { xs: '100%', sm: 'auto' } }}>
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
          <MenuItem key={dept._id} value={dept._id}>{dept.name}</MenuItem>
        ))}
      </Select>
    </FormControl>

    {/* Search Field - Full width on mobile */}
    <TextField
      variant="outlined"
      size="small"
      placeholder="Search..."
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setPagination(prev => ({ ...prev, page: 1 }));
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
                  companies?.map((company) => (
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
          {/* Staff Table - Only show if branch is selected */}
          {selectedBranch ? (
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
  >                  <Table>
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
                         const isSelected = selected.includes(staffMember._id);
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
          onChange={(event) => handleSelect(event, staffMember._id)} // Pass _id here
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
                                  <MenuItem onClick={() => handleConfirmDelete(selectedStaff._id)}>Delete</MenuItem>
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
  value={filters.role || ''}
  label="Role"
  onChange={(e) => {
    handleFilterChange('role', e.target.value);
    setPagination(prev => ({
      ...prev,
      page: 1  // Reset to page 1 when role filter changes
    }));
  }}
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
                            <Grid item xs={12} md={6}>
                                                       <TextField
                                                         fullWidth
                                                         select
                                                         label="Gender"
                                                         name="gender"
                                                         value={values.gender}
                                                         onChange={handleChange}
                                                         error={touched.gender && Boolean(errors.gender)}
                                                         helperText={touched.gender && errors.gender}
                                                         variant="outlined"
                                                       >
                                                         {genders.map((option) => (
                                                           <MenuItem key={option.value} value={option.value}>
                                                             {option.label}
                                                           </MenuItem>
                                                         ))}
                                                       </TextField>
                                                     </Grid>
                                                      <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Mobile*"
                        name="mobile"
                        value={values.mobile}
                        onChange={handleChange}
                        error={touched.mobile && Boolean(errors.mobile)}
                        helperText={touched.mobile && errors.mobile}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email*"
                        name="email"
                        value={values.email}
                         onChange={(e)=>{handleChange(e);if(editcheckfield.email!=e.target.value){ checkFieldsExists(e.target.value,"email")} } }

                        error={(touched.email && Boolean(errors.email)) || Boolean(emailError)}
    helperText={
      (touched.email && errors.email) || 
      emailError
    }
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Username*"
                        name="username"
                        value={values.username}
                       onChange={(e)=>{handleChange(e);if(editcheckfield.username!=e.target.value){ checkFieldsExists(e.target.value,"username")} } }

                          error={(touched.username && Boolean(errors.username)) || Boolean(usernameError)}
    helperText={
      (touched.username && errors.username) || 
      usernameError
    }
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
                        onClick={() => setImportModalOpen(true)}
                        variant="contained"
                        color="primary"
                      sx={{ mr: 3,textTransform:"none" }}
                      >
                        Update Staff
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
                  {console.log({values, errors, touched})}
                  {console.log(usernameError,"????usernameErrorrr")}
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>Basic Information</Typography>
                      <Divider />
                    </Grid>
                     <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Username*"
                        name="username"
                        value={values.username}
                        onChange={(e)=>{handleChange(e); checkFieldsExists(e.target.value,"username") } }

                         error={(touched.username && Boolean(errors.username)) || Boolean(usernameError)}
    helperText={
      (touched.username && errors.username) || 
      usernameError
    }
                        variant="outlined"
                      />
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
                      <Grid item xs={12} md={6}>
                                                       <TextField
                                                         fullWidth
                                                         select
                                                         label="Gender"
                                                         name="gender"
                                                         value={values.gender}
                                                         onChange={handleChange}
                                                         error={touched.gender && Boolean(errors.gender)}
                                                         helperText={touched.gender && errors.gender}
                                                         variant="outlined"
                                                       >
                                                         {genders.map((option) => (
                                                           <MenuItem key={option.value} value={option.value}>
                                                             {option.label}
                                                           </MenuItem>
                                                         ))}
                                                       </TextField>
                                                     </Grid>
                                                   
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email*"
                        name="email"
                        value={values.email}
                      onChange={(e)=>{handleChange(e); checkFieldsExists(e.target.value,"email") } }
                          error={(touched.email && Boolean(errors.email)) || Boolean(emailError)}
    helperText={
      (touched.email && errors.email) || 
      emailError
    }
                        variant="outlined"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Mobile*"
                        name="mobile"
                        value={values.mobile}
                        onChange={handleChange}
                        error={touched.mobile && Boolean(errors.mobile)}
                        helperText={touched.mobile && errors.mobile}
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
                      sx={{ mr: 3,textTransform:"none" }}
                      >
                        Add Staff
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
                  onClick={() =>{setAddModalOpen(true); setUsernameError("");setEmailError("")}}
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

{/* import staff files */}
 
<ImportEmployeeModal 
  open={importModalOpen}
  onClose={() => setImportModalOpen(false)}
  onImport={handleImportEmployees}
/>
   


        {/* Snackbar for notifications */}
       <Snackbar
  open={Boolean(openSnackbar)}
  autoHideDuration={6000}
  onClose={handleCloseSnackbar}
  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
>
  <Alert 
    icon={openSnackbar?.status ? <CheckCircleIcon fontSize="inherit" /> : <ErrorIcon fontSize="inherit" />}
    onClose={handleCloseSnackbar}
    severity={openSnackbar?.status ? "success" : "error"}
    variant="filled"
    sx={{ 
      width: '100%',
      backgroundColor: openSnackbar?.status ? '#0e9f6e' : '#d32f2f',
      color: 'white',
      '& .MuiAlert-icon': {
        color: 'white',
        alignItems: 'center'
      }
    }}
    action={
      <IconButton 
        size="small" 
        onClick={handleCloseSnackbar} 
        style={{ color: 'white' }}
      >
        <CloseIcon />
      </IconButton>
    }
  >
    {openSnackbar?.message || openSnackbar}
  </Alert>
</Snackbar>
      </Layout>
    </>
  );
};

export default StaffListPage;