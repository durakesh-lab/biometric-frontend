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
  ChevronRight as ChevronRightIcon,
  Group as GroupIcon,
  Edit as EditIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon
} from '@mui/icons-material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CloseIcon from '@mui/icons-material/Close';
import StoreIcon from '@mui/icons-material/Store';
import ApartmentIcon from '@mui/icons-material/Apartment';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { confirnDeleteAction, editStaffAction, getStaffList } from '@/store/authSlice';
import Layout, { theme } from '../../components/Layout/Layout';
import MyComponent from '../../components/common/deletepopup';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import ViewStaffModal from '../../components/Dashboard/viewstaff';
import { Download as DownloadIcon } from '@mui/icons-material';
import { Upload as UploadIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';
import ImportEmployeeModal from '../../components/Employee/importmodal';
import ReactPaginate from 'react-paginate';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

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
    branch: '',
    ordering: ""
  });

  // All branches (for the Directory's Branch filter dropdown)
  const [allBranches, setAllBranches] = useState([]);

  // Add staff modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    firstName: '',
    lastName: '',
    gender: "",
    mobile: "",
    email: '',
    employeeCode: '',
    deviceUserId: '',
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
          let usersdata=Cookies.get("usercompanyandbranch")
          if(usersdata){
            let data=JSON.parse(usersdata)
            setSelectedBranch(data.branch._id)
           setSelectedCompany(data.company._id)
          }
  
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
    { id: 'deviceUserId', label: 'Device ID', sortable: false },
    { id: 'active_status', label: 'Status', sortable: true },
    { id: 'branch', label: 'Branch', sortable: false },
    { id: 'department', label: 'Department', sortable: false },
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

  // Fetch ALL branches (across companies) for the Directory's Branch filter.
  const fetchAllBranches = async () => {
    try {
      let token = localStorage.getItem("biometric_token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/branch`, {
          headers: { Authorization: token }
        }
      );
      setAllBranches(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching all branches:', error);
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
  // Employee Directory shows EVERY employee — no branch selection required.
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
      `${process.env.NEXT_PUBLIC_BASE_URL}/employees/list-all`,
      {},
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
    fetchAllBranches();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      fetchBranches(selectedCompany);
    //   setSelectedBranch(null); // Reset branch selection when company changes
      setNewStaff(prev => ({ ...prev, companyId: selectedCompany }));
    }
  }, [selectedCompany]);

  // Load the full directory on mount + whenever paging / filters / search change.
  useEffect(() => {
    fetchStaff();
  }, [pagination.page, filters, pagination.page_size, sorting, search, deletepopup?.edituserdata]);

  // Keep the department list + add-form branch in sync when a branch is picked in the Add modal.
  useEffect(() => {
    if (selectedBranch) {
      fetchDepartments(selectedBranch);
      setNewStaff(prev => ({ ...prev, branchId: selectedBranch }));
    }
  }, [selectedBranch]);

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

               var data = { ids: id };
            var response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/employees/delete-bulk`,data, {
              headers: { Authorization: token }
            });
           }
           else{
                      var response = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/employees/${id}`, {
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

  // Open the Edit modal with the same fields as Add. Pre-load the employee's
  // company/branch so the Company → Branch → Department dropdowns are populated.
  const openEditEmployee = (staffMember) => {
    setEmailError("");
    setSelectedCompany(staffMember.companyId || null);
    setSelectedBranch(staffMember.branchId || null);
    if (staffMember.companyId) fetchBranches(staffMember.companyId);
    if (staffMember.branchId) fetchDepartments(staffMember.branchId);
    setCurrentStaff({
      ...staffMember,
      department: staffMember.dept_id || staffMember.deptId || '',
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (values) => {
    try {
      let token = localStorage.getItem("biometric_token");
      await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/employees/${values._id}`, values, {
        headers: { Authorization: token }
      });
      setOpenSnackbar({ status: true, message: 'Employee updated successfully' });
      setEditModalOpen(false);
      fetchStaff();
    } catch (error) {
      console.error('Error updating employee:', error);
      setOpenSnackbar(error.response?.data?.message || 'Error updating employee');
    }
  };

  const handleAllowEditToggle = async (staffMember) => {
    let token = localStorage.getItem("biometric_token");
    let Staffdata = { ...staffMember, id: staffMember._id, editstatus: staffMember?.editstatus ? false : true };
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/edituser/` + Staffdata.id, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': "application/json"
      },
      body: JSON.stringify(Staffdata),
    });
    if (response.ok) {
      setOpenSnackbar({ status: true, message: staffMember?.editstatus ? "edit disabled for user" : "edit enabled for user" });
      fetchStaff();
    }
  };

  // Handle add staff
  const handleAddStaff = async (values) => {
    try {
      let token = localStorage.getItem("biometric_token");
      // Employee record only — NO username / password / role.
      const apiValues = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email || undefined,
        mobile: values.mobile || undefined,
        gender: values.gender || undefined,
        employeeCode: values.employeeCode || undefined,
        deviceUserId: values.deviceUserId || undefined,
        department: values.department || undefined,
        companyId: values.companyId || selectedCompany,
        branchId: values.branchId || selectedBranch,
      };
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/employees`, apiValues, {
        headers: { Authorization: token }
      });

      setOpenSnackbar({status: true, message: 'Employee added successfully'});
      setAddModalOpen(false);
      fetchStaff();
    } catch (error) {
      console.error('Error adding employee:', error);
      setOpenSnackbar(error.response?.data?.message || error.response?.data?.detail || 'Error adding employee');
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
  // Validation schema — employees need only a name + branch. Email is OPTIONAL
  // (employees have no login). Role/username/password are gone entirely.
  const validationSchema = Yup.object({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().notRequired(),
    gender: Yup.string().notRequired(),
    mobile: Yup.string().notRequired(),
    email: Yup.string()
      .email("Invalid email")
      .notRequired()
      .test(
        'email-exists',
        'Email already exists',
        () => !emailError // This will be updated by our debounced function
      ),
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
         setEmailError("")
         return
      }
      try {
        let token = localStorage.getItem("biometric_token");
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/employees/checkandverifyfields`,{ field:"email", email: value ,id}, {
          headers: { Authorization: token }
        });
        setEmailError(response.data.message ? 'Email already exists' : '');
      } catch (error) {
        console.error('Error checking email:', error);
      }
    }, 1000);



      const [importModalOpen, setImportModalOpen] = useState(false);
      const handleImportEmployees = async (formData) => {
        try {
          let token = localStorage.getItem("biometric_token");
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/employees/import`,
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

        <Box sx={{ my: 3 }}>
          {/* Header Section */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} sx={{ flexWrap: 'wrap', rowGap: 2 }}>
            <Box>
              <Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Employee Directory
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                Complete directory of organization employees
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              {showDelete && (
                <Tooltip title={`Delete selected (${selected.length})`}>
                  <IconButton
                    color="error"
                    onClick={() => handleConfirmDelete(selected)}
                  >
                    <DeleteIcon />
                    <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 600 }}>
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

              <Button
                startIcon={<UploadIcon />}
                onClick={() => setExportModalOpen(true)}
                variant="outlined"
                sx={{ 
                  textTransform: "none", 
                  borderColor: '#E5E7EB', 
                  color: '#4B5563', 
                  borderRadius: '6px',
                  px: 2,
                  '&:hover': { borderColor: '#D1D5DB', backgroundColor: '#F9FAFB' } 
                }}
              >
                Export
              </Button>

              {/* <Button
                startIcon={<DownloadIcon />}
                onClick={() => setImportModalOpen(true)}
                variant="outlined"
                sx={{ 
                  textTransform: "none", 
                  borderColor: '#E5E7EB', 
                  color: '#4B5563', 
                  borderRadius: '6px',
                  px: 2,
                  '&:hover': { borderColor: '#D1D5DB', backgroundColor: '#F9FAFB' } 
                }}
              >
                Import
              </Button> */}

              <Button
                onClick={() => { setAddModalOpen(true); setUsernameError(""); setEmailError(""); }}
                variant="contained"
                sx={{ 
                  textTransform: "none", 
                  backgroundColor: '#0E9F6E', 
                  color: '#FFFFFF', 
                  borderRadius: '6px',
                  fontWeight: 600,
                  boxShadow: 'none',
                  px: 2.5,
                  py: 1,
                  '&:hover': { backgroundColor: '#047857', boxShadow: 'none' }
                }}
              >
                + Add Employee
              </Button>
            </Box>
          </Box>

          {/* Employee Directory always shows every employee — no branch selection needed */}
          {(
            <Paper elevation={0} sx={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', mb: 3 }}>
              {/* Filters row inside the card */}
              <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', borderBottom: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', flexWrap: 'wrap' }}>
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Search name / email / role..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPagination(prev => ({ ...prev, page: 1 }));
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#9CA3AF' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    width: 300,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      '& fieldset': { borderColor: '#E5E7EB' },
                      '&:hover fieldset': { borderColor: '#D1D5DB' },
                    }
                  }}
                />

                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <Select
                    value={filters.active_status || ''}
                    displayEmpty
                    onChange={(e) => {
                      handleFilterChange('active_status', e.target.value);
                      setPagination(prev => ({ ...prev, page: 1 }));
                    }}
                    sx={{ 
                      borderRadius: '8px',
                      color: '#4B5563',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E5E7EB' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#D1D5DB' },
                    }}
                  >
                    <MenuItem value="">All status</MenuItem>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>

                {/* Branch filter — narrow the directory to one branch */}
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <Select
                    value={filters.branch || ''}
                    displayEmpty
                    onChange={(e) => {
                      handleFilterChange('branch', e.target.value);
                      setPagination(prev => ({ ...prev, page: 1 }));
                    }}
                    sx={{
                      borderRadius: '8px',
                      color: '#4B5563',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E5E7EB' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#D1D5DB' },
                    }}
                  >
                    <MenuItem value="">All Branches</MenuItem>
                    {allBranches.map((b) => (
                      <MenuItem key={b._id} value={b._id}>{b.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Optional Department Filter */}
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <Select
                    value={filters.department || ''}
                    displayEmpty
                    onChange={(e) => handleFilterChange('department', e.target.value)}
                    sx={{ 
                      borderRadius: '8px',
                      color: '#4B5563',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E5E7EB' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#D1D5DB' },
                    }}
                    disabled={loadingDepartments || !selectedBranch}
                  >
                    <MenuItem value="">All Departments</MenuItem>
                    {departments.map((dept) => (
                      <MenuItem key={dept._id} value={dept._id}>{dept.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ overflowX: 'auto' }}>
                <TableContainer
                  elevation={0}
                  sx={{
                    height: { xs: 600, sm: 400, md: 450 },
                    maxHeight: '70vh',
                    overflowY: 'auto',
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
                        {columns.map((column) => (
                          <TableCell 
                            key={column.id}
                            sx={{ 
                              position: 'sticky',
                              top: 0,
                              backgroundColor: '#F9FAFB',
                              zIndex: 1,
                              whiteSpace: 'nowrap',
                              textAlign: column.id === 'checkbox' ? 'left' : 'center',
                              verticalAlign: 'middle',
                              padding: column.id === 'checkbox' ? '0 0 0 16px' : '16px',
                              fontWeight: 600,
                              color: '#4B5563',
                              borderBottom: '1px solid #E5E7EB',
                            }}
                          >
                            {column.sortable ? (
                              <Box 
                                display="flex" 
                                alignItems="center" 
                                justifyContent="center"
                                sx={{ cursor: 'pointer' }}
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
                            <CircularProgress size={40} sx={{ my: 4 }} />
                          </TableCell>
                        </TableRow>
                      ) : staff.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={columns.length} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                            No employees found
                          </TableCell>
                        </TableRow>
                      ) : (
                        staff.map((staffMember, index) => {
                          const isSelected = selected.includes(staffMember._id);
                          return (
                            <TableRow
                              key={staffMember._id}
                              hover
                              selected={isSelected}
                              sx={{
                                '& > td': {
                                  padding: '12px 16px',
                                }
                              }}
                            >
                              <TableCell padding="checkbox" sx={{ paddingLeft: '16px' }}>
                                <Checkbox
                                  checked={isSelected}
                                  onChange={(event) => handleSelect(event, staffMember._id)}
                                />
                              </TableCell>
                              
                              <TableCell align="center">{getSerialNumber(index)}</TableCell>
                              <TableCell align="center">{staffMember.firstName}</TableCell>
                              <TableCell align="center">{staffMember.lastName}</TableCell>
                              <TableCell align="center">{staffMember.email}</TableCell>
                              <TableCell align="center">
                                {staffMember.deviceUserId ? (
                                  <Box
                                    sx={{
                                      display: 'inline-block',
                                      padding: '4px 8px',
                                      borderRadius: '6px',
                                      backgroundColor: '#DEF7EC',
                                      color: '#03543F',
                                      fontSize: '12px',
                                      fontWeight: 600,
                                    }}
                                  >
                                    #{staffMember.deviceUserId}
                                  </Box>
                                ) : (
                                  <Typography variant="caption" sx={{ color: '#9CA3AF' }}>
                                    Not linked
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell align="center">
                                <Box 
                                  sx={{
                                    display: 'inline-block',
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    backgroundColor: staffMember.active_status === 'Active' ? '#DEF7EC' : '#FDE8E8',
                                    color: staffMember.active_status === 'Active' ? '#03543F' : '#9B1C1C',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                  }}
                                >
                                  {staffMember.active_status}
                                </Box>
                              </TableCell>
                              <TableCell align="center">{staffMember.branch_name || '-'}</TableCell>
                              <TableCell align="center">{staffMember.dept_name || '-'}</TableCell>
                              
                              <TableCell align="center">
                                <Box display="flex" justifyContent="center" gap={0.5}>
                                  <Tooltip title="View Details">
                                    <IconButton 
                                      size="small"
                                      sx={{ color: '#9CA3AF', '&:hover': { color: '#4B5563' } }}
                                      onClick={() => handleViewClick(staffMember)}
                                    >
                                      <ViewIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  
                                  <Tooltip title="Edit Profile">
                                    <IconButton
                                      size="small"
                                      sx={{ color: '#9CA3AF', '&:hover': { color: '#4B5563' } }}
                                      onClick={() => openEditEmployee(staffMember)}
                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>

                                  <Tooltip title="Delete">
                                    <IconButton 
                                      size="small"
                                      sx={{ color: '#EF4444', '&:hover': { color: '#DC2626' } }}
                                      onClick={() => handleConfirmDelete(staffMember._id)}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {/* Pagination */}
              <Box display="flex" justifyContent="space-between" alignItems="center" p={2} sx={{ borderTop: '1px solid #E5E7EB', backgroundColor: '#FFFFFF' }}>
                <Box display="flex" alignItems="center">
                  <FormControl size="small" sx={{ minWidth: 100 }}>
                    <Select
                      value={pagination.page_size}
                      onChange={handlePageSizeChange}
                      sx={{ borderRadius: '6px', color: 'text.secondary' }}
                    >
                      {[5, 10, 25, 50, 100].map((size) => (
                        <MenuItem key={size} value={size}>
                          {size} per page
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
            
                <Box 
                  sx={{
                    '& .pagination': {
                      display: 'flex',
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      gap: '4px',
                    },
                    '& .pagination li a': {
                      padding: '6px 12px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      color: '#4B5563',
                      textDecoration: 'none',
                      display: 'inline-block',
                    },
                    '& .pagination li.selected a': {
                      backgroundColor: '#0E9F6E',
                      color: '#FFFFFF',
                      borderColor: '#0E9F6E',
                      fontWeight: 600,
                    },
                    '& .pagination li.disabled a': {
                      opacity: 0.5,
                      cursor: 'not-allowed',
                    }
                  }}
                >
                  <ReactPaginate
                    previousLabel={'‹'}
                    nextLabel={'›'}
                    breakLabel={'...'}
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
                  />
                </Box>
                
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Showing {staff.length} of {pagination.count}
                </Typography>
              </Box>
            </Paper>
          )}
        </Box>

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
            <Typography variant="h5" gutterBottom>Edit Employee</Typography>
            <Divider sx={{ mb: 3 }} />
            <Formik
              initialValues={currentStaff}
              validationSchema={validationSchema}
              onSubmit={handleEditSubmit}
              enableReinitialize
            >
              {({ values, errors, touched, handleChange, setFieldValue }) => (
                <Form>
                  {/* Same "Attendance Profile Only" banner as Add, for consistency */}
                  <Box sx={{ display:'flex', alignItems:'center', gap:1.5, bgcolor:'#E6F6F0', color:'#03543F', p:2, borderRadius:'8px', mb:3 }}>
                    <Typography variant="body2" sx={{ fontWeight:500, fontSize:'13.5px', lineHeight:1.5 }}>
                      🔒 <strong>Attendance Profile Only.</strong> This record is used to map attendance logs from biometric hardware. This employee will not receive credentials to log into the web portal.
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
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
                        label="Last Name"
                        name="lastName"
                        value={values.lastName}
                        onChange={handleChange}
                        error={touched.lastName && Boolean(errors.lastName)}
                        helperText={touched.lastName && errors.lastName}
                        variant="outlined"
                      />
                    </Grid>
                                                      <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Mobile (optional)"
                        name="mobile"
                        value={values.mobile}
                        onChange={handleChange}
                        error={touched.mobile && Boolean(errors.mobile)}
                        helperText={touched.mobile && errors.mobile}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email (optional)"
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
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Employee Code (optional)"
                        name="employeeCode"
                        value={values.employeeCode || ''}
                        onChange={handleChange}
                        placeholder="e.g. EMP-1006"
                        variant="outlined"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
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


                    
                    
                    {/* Company → Branch → Department (same as Add) */}
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Company*</InputLabel>
                        <Select
                          name="companyId"
                          value={values.companyId || selectedCompany || ''}
                          label="Company*"
                          onChange={(e) => {
                            const v = e.target.value;
                            setFieldValue('companyId', v);
                            setFieldValue('branchId', '');
                            setFieldValue('department', '');
                            setSelectedCompany(v);
                          }}
                          sx={{ borderRadius: '8px' }}
                        >
                          {companies.map((c) => (
                            <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Branch*</InputLabel>
                        <Select
                          name="branchId"
                          value={values.branchId || selectedBranch || ''}
                          label="Branch*"
                          onChange={(e) => {
                            const v = e.target.value;
                            setFieldValue('branchId', v);
                            setFieldValue('department', '');
                            setSelectedBranch(v);
                          }}
                          disabled={loadingBranches || !(values.companyId || selectedCompany)}
                          sx={{ borderRadius: '8px' }}
                        >
                          {branches.map((b) => (
                            <MenuItem key={b._id} value={b._id}>{b.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Department</InputLabel>
                        <Select
                          name="department"
                          value={values.department || ''}
                          label="Department"
                          onChange={handleChange}
                          disabled={loadingDepartments || !(values.branchId || selectedBranch)}
                          sx={{ borderRadius: '8px' }}
                        >
                          {departments.length ? departments.map((dept) => (
                            <MenuItem key={dept._id} value={dept._id}>{dept.name}</MenuItem>
                          )) : (
                            <MenuItem disabled>No departments available</MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Device User ID (optional)"
                        name="deviceUserId"
                        value={values.deviceUserId || ''}
                        onChange={handleChange}
                        placeholder="map in Enrollment"
                        variant="outlined"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Status*</InputLabel>
                        <Select
                          name="active_status"
                          value={values.active_status || 'Active'}
                          label="Status*"
                          onChange={handleChange}
                          sx={{ borderRadius: '8px' }}
                        >
                          {statusTypes.map((status) => (
                            <MenuItem key={status} value={status}>{status}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        sx={{
                          textTransform: "none",
                          backgroundColor: '#0E9F6E',
                          color: '#FFFFFF',
                          borderRadius: '8px',
                          fontWeight: 600,
                          py: 1.2,
                          boxShadow: 'none',
                          '&:hover': { backgroundColor: '#047857', boxShadow: 'none' }
                        }}
                      >
                        Update Employee
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
            width: '90%',
            maxWidth: 600,
            bgcolor: 'background.paper',
            p: 4,
            maxHeight: '90vh',
            overflowY: 'auto',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
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
          }}>
            {/* Modal Title & Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" component="h2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Add Employee Record
              </Typography>
              <IconButton 
                onClick={() => setAddModalOpen(false)}
                size="small"
                sx={{ color: '#9CA3AF', '&:hover': { color: '#4B5563' } }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            
            <Divider sx={{ mb: 3 }} />

            <Formik
              initialValues={newStaff}
              validationSchema={validationSchema}
              onSubmit={handleAddStaff}
            >
              {({ values, errors, touched, handleChange, setFieldValue }) => (
                <Form>
                  {/* Attendance sync banner */}
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1.5,
                      bgcolor: '#E6F6F0', 
                      color: '#03543F', 
                      p: 2, 
                      borderRadius: '8px', 
                      mb: 3 
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '13.5px', lineHeight: 1.5 }}>
                      🔒 <strong>Attendance Profile Only.</strong> This record is used to map attendance logs from biometric hardware. This employee will not receive credentials to log into the web portal.
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name*"
                        name="firstName"
                        value={values.firstName}
                        onChange={handleChange}
                        error={touched.firstName && Boolean(errors.firstName)}
                        helperText={touched.firstName && errors.firstName}
                        variant="outlined"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        value={values.lastName}
                        onChange={handleChange}
                        error={touched.lastName && Boolean(errors.lastName)}
                        helperText={touched.lastName && errors.lastName}
                        variant="outlined"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email (optional)"
                        name="email"
                        value={values.email}
                        onChange={(e) => {
                          handleChange(e);
                          checkFieldsExists(e.target.value, "email");
                        }}
                        error={(touched.email && Boolean(errors.email)) || Boolean(emailError)}
                        helperText={(touched.email && errors.email) || emailError}
                        variant="outlined"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Mobile (optional)"
                        name="mobile"
                        value={values.mobile}
                        onChange={handleChange}
                        error={touched.mobile && Boolean(errors.mobile)}
                        helperText={touched.mobile && errors.mobile}
                        variant="outlined"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      />
                    </Grid>

                    {/* Company → Branch → Department: selectable right here, no context switch */}
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Company*</InputLabel>
                        <Select
                          name="companyId"
                          value={values.companyId || selectedCompany || ''}
                          label="Company*"
                          onChange={(e) => {
                            const v = e.target.value;
                            setFieldValue('companyId', v);
                            setFieldValue('branchId', '');
                            setFieldValue('department', '');
                            setSelectedCompany(v);
                          }}
                          sx={{ borderRadius: '8px' }}
                        >
                          {companies.map((c) => (
                            <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Branch*</InputLabel>
                        <Select
                          name="branchId"
                          value={values.branchId || selectedBranch || ''}
                          label="Branch*"
                          onChange={(e) => {
                            const v = e.target.value;
                            setFieldValue('branchId', v);
                            setFieldValue('department', '');
                            setSelectedBranch(v);
                          }}
                          disabled={loadingBranches || !(values.companyId || selectedCompany)}
                          sx={{ borderRadius: '8px' }}
                        >
                          {branches.map((b) => (
                            <MenuItem key={b._id} value={b._id}>{b.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Department</InputLabel>
                        <Select
                          name="department"
                          value={values.department}
                          label="Department"
                          onChange={handleChange}
                          disabled={loadingDepartments || !(values.branchId || selectedBranch)}
                          sx={{ borderRadius: '8px' }}
                        >
                          {departments.length ? departments.map((dept) => (
                            <MenuItem key={dept._id} value={dept._id}>
                              {dept.name}
                            </MenuItem>
                          )) : (
                            <MenuItem disabled>No departments available</MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Employee Code (optional)"
                        name="employeeCode"
                        value={values.employeeCode || ''}
                        onChange={handleChange}
                        placeholder="e.g. EMP-1006"
                        variant="outlined"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Device User ID (optional)"
                        name="deviceUserId"
                        value={values.deviceUserId || ''}
                        onChange={handleChange}
                        placeholder="leave blank — map in Enrollment"
                        variant="outlined"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        type="submit"                     
                        variant="contained"
                        sx={{ 
                          textTransform: "none",
                          backgroundColor: '#0E9F6E',
                          color: '#FFFFFF',
                          borderRadius: '8px',
                          fontWeight: 600,
                          py: 1.2,
                          boxShadow: 'none',
                          '&:hover': { backgroundColor: '#047857', boxShadow: 'none' }
                        }}
                      >
                        Add Employee
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Box>
        </Modal>

        {/* FAB Removed in favor of top-right toolbar button */}

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