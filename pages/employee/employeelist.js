
import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  DialogContentText,
  Alert,
  Snackbar
} from '@mui/material';
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
import { confirnDeleteAction, editEmployeeAction, getDepartmentList, getPositionList } from '@/store/authSlice';
import Layout from '../../components/Layout/Layout';
import SuccessSnackbar from '../../components/successpopup/successpopup';
import MyComponent from '../../components/deletepopup';
import ViewEmployeeModal from '../../components/Dashboard/viewEmployee';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import ImportEmployeeModal from '../../components/Employee/importmodal';
import { Download as DownloadIcon } from '@mui/icons-material';
import { Upload as UploadIcon } from '@mui/icons-material';

const EmployeeListPage = () => {
  // State for table data and UI
  let departments = [
    // { label: "department", value: 1 },
    // { label: "Sales", value: 2 },
    // { label: "Engineering", value: 3 }
  ];
  
  let positions = [
    // { label: "positions", value: 1 },
    // { label: "Developer", value: 2 },
    // { label: "Analyst", value: 3 }
  ];
  const [employees, setEmployees] = useState([]);
  let [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const deletepopup = useSelector((state) => state.auth);
  const {getPositionListData,getDepartmentListData } = useSelector(state => state.auth);



  const [exportModalOpen, setExportModalOpen] = useState(false);

  // Add this function to handle the export
  const handleExportEmployees = () => {
    try {
      // Create CSV content
      const headers = [
        "Employee Id", "First Name", "Last Name", "Department Id", 
        "Department Name", "Position Code", "Position Name", 
        "Date of Joining", "Card No.", "Area Code", "Gender", 
        "Mobile", "Birthday", "Email", "Aadhaar No."
      ].join(",");
      
      const rows = employees.map(employee => {
        return [
          employee.emp_code || '',
          employee.first_name || '',
          employee.last_name || '',
          employee.department?.id || '',
          employee.department?.dept_name || '',
          employee.position?.position_code || '',
          employee.position?.position_name || '',
          employee.hire_date || '',
          employee.card_no || '',
          employee.area?.length ? employee.area[0].area_code : '',
          employee.gender || '',
          employee.mobile || '',
          employee.birthday || '',
          employee.email || '',
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
      
      setOpen("exportsuccess");
      setExportModalOpen(false);
    } catch (error) {
      console.error('Error exporting employees:', error);
    }
  };
  
  const [errorAlert, setErrorAlert] = useState({ show: false, message: "" });

  const [positionsLoading, setPositionsLoading] = useState(true);

  useEffect(() => {
    dispatch(getPositionList()).then(() => setPositionsLoading(false));
  }, [dispatch]);

       useEffect(()=>{
        dispatch(getDepartmentList());
        },[])
          positions = useMemo(() => {
            if (getPositionListData?.length) {
              return getPositionListData.map((e) => {
                return { label: e.position_name, value: e.id }
              })
            }
            else {
              return []
            }
          }, [getPositionListData?.length])
   departments = useMemo(() => {
    if (getDepartmentListData?.length) {
      return getDepartmentListData.map((e) => {
        return { label: e.dept_name, value: e.id }
      })
    }
    else {
      return []
    }
  }, [getDepartmentListData?.length])
  // import employeee by file states
  const [importModalOpen, setImportModalOpen] = useState(false);
  const handleImportEmployees = async (formData) => {
    try {
      let token = localStorage.getItem("biometric_token");
      const response = await axios.post(
        `http://localhost:7000/employee/importImployeeByFile`, 
        formData,
        {
          headers: { 
            Authorization: token,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setOpen("importsuccess");
      fetchEmployees();
    } catch (error) {
      console.error('Error importing employees:', error);
    }
  };
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
    emp_code: '',
    first_name: '',
    last_name: '',
    department: '',
    app_status: '',
    emp_code_icontains: '',
    departments: '',
    status: '',
    first_name_icontains: '',
    last_name_icontains: '',
    areas: '',
    positions: '',
    app_role: "",
    app_status: "",
    ordering: ""
  });

  // Dropdown options
  const [dropdownOptions, setDropdownOptions] = useState({
    departments: [{name: "Department", id: 1}],
    positions: [{name: "Position", id: 1}],
    areas: [{name: "Area", id: 1}],
    app_role: [{name: "employee", id: 1}, {name: "administrator", id: 2}],
    app_status: [{name: "Enable", id: 1}, {name: "Disable", id: 0}],
    ordering: [
      { id: 'emp_code', label: 'Employee ID', sortable: true },
      { id: 'first_name', label: 'First Name', sortable: true },
      { id: 'last_name', label: 'Last Name', sortable: true },
      { id: 'department', label: 'Department', sortable: true },
      { id: 'position', label: 'Position', sortable: true },
      { id: 'mobile', label: 'Mobile', sortable: true },
      { id: 'email', label: 'Email', sortable: true },
      { id: 'hire_date', label: 'Hire Date', sortable: true },
      { id: 'dev_privilege', label: 'Privilege', sortable: true },
      { id: 'enable_att', label: 'Attendance', sortable: true },
      { id: 'app_status', label: 'App Status', sortable: true },
      { id: '1', label: 'area', sortable: true },
      { id: 'app_role', label: 'app role', sortable: true },
    ]
  });

  // Menu state for actions
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const openMenu = Boolean(anchorEl);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState({});

  // View modal state
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedEmployeeView, setSelectedEmployeeView] = useState({});

  // Columns configuration
  const columns = [
    { id: 'checkbox', label: '', sortable: false },
    { id: 'srNo', label: 'SN.', sortable: false },
    { id: 'emp_code', label: 'Employee ID', sortable: true },
    { id: 'first_name', label: 'First Name', sortable: true },
    { id: 'last_name', label: 'Last Name', sortable: true },
    { id: 'department', label: 'Department', sortable: true },
    { id: 'position', label: 'Position', sortable: true },
    { id: 'mobile', label: 'Mobile', sortable: true },
    { id: 'email', label: 'Email', sortable: true },
    { id: 'hire_date', label: 'Hire Date', sortable: true },
    { id: 'dev_privilege', label: 'Privilege', sortable: true },
    { id: 'enable_att', label: 'Attendance', sortable: true },
    { id: 'app_status', label: 'App Status', sortable: true },
    { id: 'view', label: 'View', sortable: false },
    { id: 'actions', label: 'Actions', sortable: false }
  ];

  // Fetch employees data
  const fetchEmployees = async () => {
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
        `http://localhost:7000/employee/wer`, {
          headers: { Authorization: token },
          params
        }
      );

      setEmployees(response.data.data);
      setPagination({
        ...pagination,
        total_pages: Math.ceil(response.data.count / pagination.page_size),
        count: response.data.count
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [pagination.page, pagination.page_size, sorting, search, filters,open]);

  // Handle select all
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(employees.map(emp => emp.id));
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
    fetchEmployees();
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      emp_code: '',
      first_name: '',
      last_name: '',
      department: '',
      app_status: '',
      emp_code_icontains: '',
      departments: '',
      first_name_icontains: '',
      last_name_icontains: '',
      areas: '',
      positions: '',
      search: "",
      ordering: ""
    });
  };

  // Handle menu click
  const handleMenuClick = (event, employee) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmployee(employee);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
// let stu_dict={name:"rajat",contact:8987,address:"mp"}
//     stu_list=[]
//     stu_list[0]="rajat"
//     stu_list[1]=8987
//     stu_list[2]="mp"
  // Handle delete confirmation
  const handleConfirmDelete = (id,action_name) => {
    // dispatch(confirnDeleteAction("sure"));
    dispatch(confirnDeleteAction(action_name));
    sessionStorage.setItem("deleteIds", JSON.stringify({id,action_name}));
  };

  // Handle delete
  const handleDelete = async () => {
    let { id, action_name } = JSON.parse(sessionStorage.getItem("deleteIds"));
  
    if (action_name === "enable_app_status") {
      action_name = "enable_app_account";
    } else if (action_name === "disable_app_status") {
      action_name = "disable_app_account";
    } else {
      action_name = "delete";
    }
  
    try {
      let token = localStorage.getItem("biometric_token");
      let data = {
        object_ids: Array.isArray(id) ? id : [id],
        action_type: action_name || "delete"
      };
  
      await axios.post(`http://localhost:7000/employee/actionemployee`, data, {
        headers: { Authorization: token }
      });
  
      setSelected([]);
      setShowDelete(false);
      dispatch(confirnDeleteAction(false));
      setOpen("deleteeemployee");
      fetchEmployees();
    } catch (error) {
      if (error.response && error.response.status === 500) {
        console.error("Server error (500):", error.response.data);
        setErrorAlert({
          show: true,
          message: "Something went wrong on the server. Please try again later.",
        });
      } else {
        console.error("Error deleting employees:", error);
        setErrorAlert({
          show: true,
          message: "Failed to perform the action. Please check your connection or try again.",
        });
      }
    } finally {
      handleMenuClose();
    }
  };
  
  useEffect(() => {
    if (deletepopup?.confirnDelete === true) {
      handleDelete();
    }
  }, [deletepopup?.confirnDelete]);

  // Format boolean values
  const formatBoolean = (value) => {
    return value ? "Yes" : "No";
  };

  // Format privilege levels
  const formatPrivilege = (value) => {
    const privileges = {
      0: "Employee",
      2: "Register",
      6: "System Admin",
      14: "Super Admin"
    };
    return privileges[value] || value;
  };

  // Format app status
  const formatAppStatus = (value) => {
    return value === 1 ? "Enabled" : "Disabled";
  };

  // Get serial number
  const getSerialNumber = (index) => {
    return (pagination.page - 1) * pagination.page_size + index + 1;
  };

  // Edit section


  const genders = [ { label: "Male", value: "M" }, { label: "Female", value: "F" }];

  const verificationModes = [
    { label: "Any", value: 0 },
    { label: "Fingerprint", value: 1 },
    { label: "Card", value: 2 },
    { label: "PIN", value: 3 }
  ];

  const employmentTypes = [
    { label: "Permanent", value: 1 },
    { label: "Temporary", value: 2 }
  ];

  const devicePrivileges = [
    { label: "Employee", value: 0 },
    { label: "Register", value: 2 },
    { label: "System Administrator", value: 6 },
    { label: "Super Administrator", value: 14 }
  ];

  const enableOptions = [
    { label: "No", value: "False" },
    { label: "Yes", value: "True" }
  ];

  const appRoles = [
    { label: "Employee", value: 1 },
    { label: "Administrator", value: 2 }
  ];

  const appStatuses = [
    { label: "Enable", value: 1 },
    { label: "Disable", value: 0 }
  ];

  const { editEmployeeData } = useSelector(state => state.auth);

  useEffect(() => {
    if (editEmployeeData) {
      setOpen("editemployee");
    }
  }, [editEmployeeData]);

  const handleEdit = () => {
    if (selectedEmployee) {
      setCurrentEmployee(selectedEmployee);
      setEditModalOpen(true);
    }
    handleMenuClose();
  };

  const handleEditSubmit = async (values) => {
    try {
      dispatch(editEmployeeAction(values));
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };
console.log(employees,"employeesemployees@###############")
  const initialValues = {
    ...currentEmployee,
    department: currentEmployee?.department?.id,
    position: currentEmployee?.position?.id,
    enable_att: currentEmployee.enable_att == true ? "True" : "False",
    enable_overtime: currentEmployee.enable_overtime == true ? "True" : "False",
    enable_holiday: currentEmployee.enable_holiday == true ? "True" : "False",
    area: currentEmployee.area?.length && currentEmployee?.area[0].id,
  };

  const validationSchema = Yup.object({
    emp_code: Yup.string().required("Required"),
    first_name: Yup.string().required("Required"),
    department: Yup.string().required("Required"),
    position: Yup.string().required("Required"),
    enable_att: Yup.string().required("Required"),
    enable_holiday: Yup.string().required("Required"),
    enable_overtime: Yup.string().required("Required"),
    area: Yup.string().required("Required"),
    emp_type: Yup.string().required("Required"),
    hire_date: Yup.string().required("Required"),
    mobile: Yup.string()
      .nullable()
      .matches(/^\d{10}$/, "Mobile must be 10 digits")
      .notRequired()
      .test("valid-mobile", "Mobile must be 10 digits", value => {
        if (!value) return true;
        return /^\d{10}$/.test(value);
      }),
    contact_tel: Yup.string()
      .nullable()
      .test("valid-contact", "Contact Tel must be 10 digits", value => {
        if (!value) return true;
        return /^\d{10}$/.test(value);
      }),
    office_tel: Yup.string()
      .nullable()
      .test("valid-office", "Office Tel must be 10 digits", value => {
        if (!value) return true;
        return /^\d{10}$/.test(value);
      }),
    email: Yup.string()
      .nullable()
      .email("Invalid email")
      .notRequired()
      .test("valid-email", "Invalid email", value => {
        if (!value) return true;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      }),
  });

  // Handle view click
  const handleViewClick = (employee) => {
    setSelectedEmployeeView(employee);
    setViewModalOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };
useEffect(()=>{
  setLoading(true)
setTimeout(() => {
  setLoading(false)
}, 3000);
},[])

  return (
    <>
    <Layout>
      <Grid container spacing={3}>
        {/* Header Section */}
        <Grid item  xs={12}>
<Box display="flex" justifyContent="space-between" alignItems="center" mb={0} sx={{ flexWrap: 'wrap', rowGap: 2 }}>
  <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 600 }}>
    Employee List
  </Typography>
  
  <Box display="flex" alignItems="center" gap={1}>
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
    


    <Dialog open={exportModalOpen} onClose={() => setExportModalOpen(false)}>
  <DialogTitle>Export Employees</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Are you sure you want to export {employees.length} employees to a CSV file?
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
    color="primary"
    sx={{ mr: 1 }}
  >
    Export Employees
  </Button>
  

    <Button
      startIcon={<DownloadIcon />}
      onClick={() => setImportModalOpen(true)}
      variant="outlined"
      color="primary"
      sx={{ mr: 1 }}
    >
      Import Employees
    </Button>
    
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

        {/* Employee Table */}
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
                        top: 0, // Keeps the header row at the top of the scrolling area
                        backgroundColor: '#F3F4F6', // Matches the header background
                        zIndex: 1, // Ensures the header stays above the table rows
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
                          indeterminate={selected.length > 0 && selected.length < employees.length}
                          checked={employees.length > 0 && selected.length === employees.length}
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
                ) : employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                      No employees found
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((employee, index) => {
                    const isSelected = selected.indexOf(employee.id) !== -1;
                    
                    return (
                      <>  
                      <TableRow
                        key={employee.id}
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
                            onChange={(event) => handleSelect(event, employee.id)}
                            sx={{ padding: '4px' }}
                          />
                        </TableCell>
                        
                        <TableCell>{getSerialNumber(index)}</TableCell>
                        <TableCell>{employee.emp_code}</TableCell>
                        <TableCell>{employee.first_name}</TableCell>
                        <TableCell>{employee.last_name}</TableCell>
                        <TableCell>{employee.department?.dept_name || '-'}</TableCell>
                        <TableCell>{employee.position?.position_name || '-'}</TableCell>
                        <TableCell>{employee.mobile}</TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>
                          {employee.hire_date ? new Date(employee.hire_date).toLocaleDateString() : '-'}
                        </TableCell>
                        {console.log(employee.dev_privilege,"employee.dev_privilege############")}
                        <TableCell>
                        {(employee.dev_privilege || employee.dev_privilege==0) ? 
                              <Chip 
                              label={formatPrivilege(employee.dev_privilege)} 
                              color={
                                employee.dev_privilege ==null ? 'default':
                                employee.dev_privilege === 0 ? 'default' :
                                employee.dev_privilege === 2 ? 'primary' :
                                employee.dev_privilege === 6 ? 'secondary' : 'success'
                              }
                              size="small"
                            />
                          
                        :""} 
                    
                        </TableCell>
                        <TableCell>
                          {formatBoolean(employee.enable_att)}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={formatAppStatus(employee.app_status)} 
                            color={employee.app_status === 1 ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            sx={{ color: 'text.secondary' }}
                            onClick={() => handleViewClick(employee)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            aria-label="more"
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            onClick={(e) => handleMenuClick(e, employee)}
                            sx={{ color: 'text.secondary' }}
                          >
                            <MoreVertIcon />
                          </IconButton>
                          <Menu
                            id="long-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={openMenu}
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
                          

                            {selectedEmployee?.app_status ? 
                            <MenuItem onClick={() => handleConfirmDelete(selectedEmployee?.id,"disable_app_status")}>Disable App Status</MenuItem> :
                            <MenuItem onClick={() => handleConfirmDelete(selectedEmployee?.id,"enable_app_status")}>Enable App Status</MenuItem>
                          }
                            {/* <MenuItem onClick={() => handleConfirmDelete(selectedEmployee?.id,"enable_app_status")}>Delete</MenuItem> */}
                            <MenuItem onClick={() => handleConfirmDelete(selectedEmployee?.id,"sure")}>Delete</MenuItem>

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
        </Grid>
{errorAlert.show && 
<Snackbar open={errorAlert.show} autoHideDuration={6000}  onClose={() => setErrorAlert({ show: false, message: "" })}>
  <Alert
    onClose={() => setErrorAlert({ show: false, message: "" })}
    severity="error"
    variant="filled"
    sx={{ width: '100%' }}
  >
    {errorAlert.message}
  </Alert>
</Snackbar>   }
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

    {/* Pagination controls explicitly centered */}
    <Box display="flex" justifyContent="center" alignItems="center" sx={{ flex: 1 }}>
      <Button
        disabled={pagination.page === 1}
        onClick={() => handlePageChange(1)} // Navigate to the first page
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
        onClick={() => handlePageChange(pagination.total_pages)} // Navigate to the last page
        sx={{ color: 'text.secondary' }}
      >
        Last Page
      </Button>
    </Box>
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
                label="Employee Code"
                value={filters.emp_code}
                onChange={(e) => handleFilterChange('emp_code', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="First Name"
                value={filters.first_name}
                onChange={(e) => handleFilterChange('first_name', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Last Name"
                value={filters.last_name}
                onChange={(e) => handleFilterChange('last_name', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={filters.department}
                  label="Department"
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                >
                  {dropdownOptions.departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Position</InputLabel>
                <Select
                  value={filters.positions}
                  label="Position"
                  onChange={(e) => handleFilterChange('positions', e.target.value)}
                >
                  {dropdownOptions.positions.map((pos) => (
                    <MenuItem key={pos.id} value={pos.id}>
                      {pos.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Area</InputLabel>
                <Select
                  value={filters.areas}
                  label="Area"
                  onChange={(e) => handleFilterChange('areas', e.target.value)}
                >
                  {dropdownOptions.areas.map((area) => (
                    <MenuItem key={area.id} value={area.id}>
                      {area.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>App Role</InputLabel>
                <Select
                  value={filters.app_role}
                  label="App Role"
                  onChange={(e) => handleFilterChange('app_role', e.target.value)}
                >
                  {dropdownOptions.app_role.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>App status</InputLabel>
                <Select
                  value={filters.app_status}
                  label="App Status"
                  onChange={(e) => handleFilterChange('app_status', e.target.value)}
                >
                  {dropdownOptions.app_status.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name}
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
                  {dropdownOptions.ordering.map((dept) => {
                    return(
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.label}
                    </MenuItem>
                  )}
                  )}
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

      {/* View Employee Modal */}
      <ViewEmployeeModal 
        employee={selectedEmployeeView}
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
      />

      {/* Success Snackbar */}
      <SuccessSnackbar open={open} handleClose={handleClose} />
      
      {/* Delete Confirmation Popup */}
      <MyComponent />

      {/* Edit Employee Modal */}
      <> 
  
      {editModalOpen && (
     <Modal
       open={editModalOpen}
       onClose={() => setEditModalOpen(false)}
       aria-labelledby="edit-employee-modal"
       aria-describedby="edit-employee-form"
     >
       <Box sx={{
         position: 'absolute',
         top: '50%',
         left: '50%',
         transform: 'translate(-50%, -50%)',
         width: '80%',
         maxWidth: 1200,
         bgcolor: 'background.paper',
         // boxShadow: 24,
         p: 4,
         maxHeight: '90vh',
         overflowY: 'auto'
       }}>
         <Typography variant="h5" gutterBottom>Edit Employee</Typography>
         <Divider sx={{ mb: 3 }} />
         <Formik
           initialValues={ initialValues}
           validationSchema={validationSchema}
           onSubmit={handleEditSubmit}
           enableReinitialize
         >
           {({ values, errors, touched, handleChange, setFieldValue }) => (
             <Form>
               <Grid container spacing={3}>
                 {/* Profile Section */}
                 <Grid item xs={12}>
                   <Typography variant="h6" gutterBottom>Profile</Typography>
                   <Divider />
                 </Grid>
                 
                   <Grid item xs={12} md={6}>
                                       <TextField
                                         fullWidth
                                         label="Employee ID*"
                                         name="emp_code"
                                         value={values.emp_code}
                                         onChange={ handleChange}
                                         error={touched.emp_code && Boolean(errors.emp_code)}
                                         helperText={touched.emp_code && errors.emp_code}
                                         variant="outlined"
                                       />
                                     </Grid>
                 
                      
                                 <Grid item xs={12} md={6}>
                                   <TextField
                                     fullWidth
                                     select
                                     label="Department*"
                                     name="department"
                                     value={values.department}
                                     onChange={handleChange}
                                     error={touched.department && Boolean(errors.department)}
                                     helperText={touched.department && errors.department}
                                     variant="outlined"
                                   >
                                     {departments.map((dept) => (
                                       <MenuItem key={dept.value} value={dept.value}>
                                         {dept.label}
                                       </MenuItem>
                                     ))}
                                   </TextField>
                                 </Grid>
                                 
                                 <Grid item xs={12} md={6}>
                                   <TextField
                                     fullWidth
                                     select
                                     label="Position*"
                                     name="position"
                                     value={values.position}
                                     onChange={handleChange}
                                     error={touched.position && Boolean(errors.position)}
                                     helperText={touched.position && errors.position}
                                     variant="outlined"
                                   >
                                     {positions.map((position) => (
                                       <MenuItem key={position.value} value={position.value}>
                                         {position.label}
                                       </MenuItem>
                                     ))}
                                   </TextField>
                                 </Grid>
                                 
                                 <Grid item xs={12} md={6}>
                                   <TextField
                                     fullWidth
                                     select
                                     label="Employment Type*"
                                     name="emp_type"
                                     value={values.emp_type}
                                     onChange={handleChange}
                                     error={touched.emp_type && Boolean(errors.emp_type)}
                                     helperText={touched.emp_type && errors.emp_type}
                                     variant="outlined"
                                   >
                                     {employmentTypes.map((type) => (
                                       <MenuItem key={type.value} value={type.value}>
                                         {type.label}
                                       </MenuItem>
                                     ))}
                                   </TextField>
                                 </Grid>
                                 
                                 <Grid item xs={12} md={6}>
                                   <TextField
                                     fullWidth
                                     label="First Name*"
                                     name="first_name"
                                     value={values.first_name}
                                     onChange={handleChange}
                                     error={touched.first_name && Boolean(errors.first_name)}
                                     helperText={touched.first_name && errors.first_name}
                                     variant="outlined"
                                   />
                                 </Grid>
                                 
                                 <Grid item xs={12} md={6}>
                                   <TextField
                                     fullWidth
                                     label="Last Name"
                                     name="last_name"
                                     value={values.last_name}
                                     onChange={handleChange}
                                     error={touched.last_name && Boolean(errors.last_name)}
                                     helperText={touched.last_name && errors.last_name}
                                     variant="outlined"
                                   />
                                 </Grid>
                                 
                                 <Grid item xs={12} md={6}>
                                   <TextField
                                     fullWidth
                                     label="Nick Name"
                                     name="nickname"
                                     value={values.nickname}
                                     onChange={handleChange}
                                     error={touched.nickname && Boolean(errors.nickname)}
                                     helperText={touched.nickname && errors.nickname}
                                     variant="outlined"
                                   />
                                 </Grid>
                                 
                                 <Grid item xs={12} md={6}>
                                   <TextField
                                     fullWidth
                                     label="Area*"
                                     name="area"
                                     value={values.area}
                                     onChange={handleChange}
                                     error={touched.area && Boolean(errors.area)}
                                     helperText={touched.area && errors.area}
                                     variant="outlined"
                                   />
                                 </Grid>
                                 
                                 <Grid item xs={12} md={6}>
                                   <TextField
                                     fullWidth
                                     label="Date of Joining*"
                                     name="hire_date"
                                     value={values.hire_date}
                                     onChange={handleChange}
                                     error={touched.hire_date && Boolean(errors.hire_date)}
                                     helperText={touched.hire_date && errors.hire_date}
                                     type="date"
                                     InputLabelProps={{ shrink: true }}
                                     variant="outlined"
                                   />
                                 </Grid>
                                 
                                 <Grid item xs={12} md={6}>
                                   <TextField
                                     fullWidth
                                     label="Birthday"
                                     name="birthday"
                                     value={values.birthday}
                                     onChange={handleChange}
                                     error={touched.birthday && Boolean(errors.birthday)}
                                     helperText={touched.birthday && errors.birthday}
                                     type="date"
                                     InputLabelProps={{ shrink: true }}
                                     variant="outlined"
                                   />
                                 </Grid>
                                 
                                 <Grid item xs={12}>
                                   <Divider sx={{ my: 2 }} />
                                 </Grid>
                                 
                                 {/* Personal Information Section */}
                                 <Grid item xs={12}>
                                   <Typography variant="h6" gutterBottom>Personal Information</Typography>
                                   <Divider />
                                 </Grid>
                                 
                                 <Grid item xs={12} md={6}>
                                   <TextField
                                     fullWidth
                                     label="Aadhaar No."
                                     name="ssn"
                                     value={values.ssn}
                                     onChange={handleChange}
                                     error={touched.ssn && Boolean(errors.ssn)}
                                     helperText={touched.ssn && errors.ssn}
                                     variant="outlined"
                                   />
                                 </Grid>
                                 
                                 <Grid item xs={12} md={6}>
                                   <TextField
                                     fullWidth
                                     label="Card No."
                                     name="card_no"
                                     value={values.card_no}
                                     onChange={handleChange}
                                     error={touched.card_no && Boolean(errors.card_no)}
                                     helperText={touched.card_no && errors.card_no}
                                     variant="outlined"
                                   />
                                 </Grid>
                                 
                                 <Grid item xs={12} md={6}>
                                   <TextField
                                     fullWidth
                                     label="Mobile"
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
                                     label="Contact No."
                                     name="contact_tel"
                                     value={values.contact_tel}
                                     onChange={handleChange}
                                     error={touched.contact_tel && Boolean(errors.contact_tel)}
                                     helperText={touched.contact_tel && errors.contact_tel}
                                     variant="outlined"
                                   />
                                 </Grid>
                                 
                                 <Grid item xs={12} md={6}>
                                   <TextField
                                     fullWidth
                                     label="Office Tel"
                                     name="office_tel"
                                     value={values.office_tel}
                                     onChange={handleChange}
                                     error={touched.office_tel && Boolean(errors.office_tel)}
                                     helperText={touched.office_tel && errors.office_tel}
                                     variant="outlined"
                                   />
                                 </Grid>
                                 
                                 <Grid item xs={12} md={6}>
                                   <TextField
                                     fullWidth
                                     label="Email"
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
                                     label="Nationality"
                                     name="national"
                                     value={values.national}
                                     onChange={handleChange}
                                     error={touched.national && Boolean(errors.national)}
                                     helperText={touched.national && errors.national}
                                     variant="outlined"
                                   />
                                 </Grid>
                                 
                                 <Grid item xs={12} md={6}>
                                   <TextField
                                     fullWidth
                                     label="City"
                                     name="city"
                                     value={values.city}
                                     onChange={handleChange}
                                     error={touched.city && Boolean(errors.city)}
                                     helperText={touched.city && errors.city}
                                     variant="outlined"
                                   />
                                 </Grid>
                                 
                                 <Grid item xs={12} md={6}>
                                   <TextField
                                     fullWidth
                                     label="Address"
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
                                     label="Postcode"
                                     name="postcode"
                                     value={values.postcode}
                                     onChange={handleChange}
                                     error={touched.postcode && Boolean(errors.postcode)}
                                     helperText={touched.postcode && errors.postcode}
                                     variant="outlined"
                                   />
                                 </Grid>
                                 
                                 <Grid item xs={12} md={6}>
                                   <TextField
                                     fullWidth
                                     label="Religion"
                                     name="religion"
                                     value={values.religion}
                                     onChange={handleChange}
                                     error={touched.religion && Boolean(errors.religion)}
                                     helperText={touched.religion && errors.religion}
                                     variant="outlined"
                                   />
                                 </Grid>
                                 
                                 <Grid item xs={12} md={6}>
                                   <TextField
                                     fullWidth
                                     label="Enroll SN"
                                     name="enroll_sn"
                                     value={values.enroll_sn}
                                     onChange={handleChange}
                                     error={touched.enroll_sn && Boolean(errors.enroll_sn)}
                                     helperText={touched.enroll_sn && errors.enroll_sn}
                                     variant="outlined"
                                   />
                                 </Grid>
                                 
                                 <Grid item xs={12}>
                                   <Divider sx={{ my: 2 }} />
                                 </Grid>
                                 
                                 {/* Device Settings Section */}
                               
                                 
                                 
                                    <Grid item xs={12}>
                                                     <Typography variant="h6" gutterBottom>Device Settings</Typography>
                                                     <Divider />
                                                   </Grid>
                                                   
                                                   <Grid item xs={12} md={6}>
                                                     <TextField
                                                       fullWidth
                                                       select
                                                       label="Verification Mode"
                                                       name="verify_mode"
                                                       value={values.verify_mode}
                                                       onChange={handleChange}
                                                       error={touched.verify_mode && Boolean(errors.verify_mode)}
                                                       helperText={touched.verify_mode && errors.verify_mode}
                                                       variant="outlined"
                                                     >
                                                       {verificationModes.map((mode) => (
                                                         <MenuItem key={mode.value} value={mode.value}>
                                                           {mode.label}
                                                         </MenuItem>
                                                       ))}
                                                     </TextField>
                                                   </Grid>
                                 <Grid item xs={12} md={6}>
                                   <TextField
                                     fullWidth
                                     label="Device Password"
                                     name="device_password"
                                     value={values.device_password}
                                     onChange={handleChange}
                                     error={touched.device_password && Boolean(errors.device_password)}
                                     helperText={touched.device_password && errors.device_password}
                                     variant="outlined"
                                   />
                                 </Grid>
                                 
                                 <Grid item xs={12} md={6}>
                                   <TextField
                                     fullWidth
                                     label="Self Password"
                                     name="self_password"
                                     value={values.self_password}
                                     onChange={handleChange}
                                     error={touched.self_password && Boolean(errors.self_password)}
                                     helperText={touched.self_password && errors.self_password}
                                     variant="outlined"
                                   />
                                 </Grid>
                                 
                                 <Grid item xs={12} md={6}>
                                   <TextField
                                     fullWidth
                                     select
                                     label="Enable Attendance"
                                     name="enable_att"
                                     value={values.enable_att}
                                     onChange={handleChange}
                                     error={touched.enable_att && Boolean(errors.enable_att)}
                                     helperText={touched.enable_att && errors.enable_att}
                                     variant="outlined"
                                   >
                                     {enableOptions.map((option) => (
                                       <MenuItem key={option.value} value={option.value}>
                                         {option.label}
                                       </MenuItem>
                                     ))}
                                   </TextField>
                                 </Grid>
                                 
                                 <Grid item xs={12} md={6}>
                                   <TextField
                                     fullWidth
                                     select
                                     label="Enable Overtime"
                                     name="enable_overtime"
                                     value={values.enable_overtime}
                                     onChange={handleChange}
                                     error={touched.enable_overtime && Boolean(errors.enable_overtime)}
                                     helperText={touched.enable_overtime && errors.enable_overtime}
                                     variant="outlined"
                                   >
                                     {enableOptions.map((option) => (
                                       <MenuItem key={option.value} value={option.value}>
                                         {option.label}
                                       </MenuItem>
                                     ))}
                                   </TextField>
                                 </Grid>
                                 
                                 <Grid item xs={12} md={6}>
                                   <TextField
                                     fullWidth
                                     select
                                     label="Enable Holiday"
                                     name="enable_holiday"
                                     value={values.enable_holiday}
                                     onChange={handleChange}
                                     error={touched.enable_holiday && Boolean(errors.enable_holiday)}
                                     helperText={touched.enable_holiday && errors.enable_holiday}
                                     variant="outlined"
                                   >
                                     {enableOptions.map((option) => (
                                       <MenuItem key={option.value} value={option.value}>
                                         {option.label}
                                       </MenuItem>
                                     ))}
                                   </TextField>
                                 </Grid>
                                 
                                 <Grid item xs={12} md={6}>
                                   <TextField
                                     fullWidth
                                     select
                                     label="Device Privilege"
                                     name="dev_privilege"
                                     value={values.dev_privilege}
                                     onChange={handleChange}
                                     error={touched.dev_privilege && Boolean(errors.dev_privilege)}
                                     helperText={touched.dev_privilege && errors.dev_privilege}
                                     variant="outlined"
                                   >
                                     {devicePrivileges.map((privilege) => (
                                       <MenuItem key={privilege.value} value={privilege.value}>
                                         {privilege.label}
                                       </MenuItem>
                                     ))}
                                   </TextField>
                                 </Grid>
                                 
                                 <Grid item xs={12}>
                                   <Divider sx={{ my: 2 }} />
                                 </Grid>
                                 
                                 {/* App Settings Section */}
                                 <Grid item xs={12}>
                                   <Typography variant="h6" gutterBottom>App Settings</Typography>
                                   <Divider />
                                 </Grid>
                                 
                                 <Grid item xs={12} md={6}>
                                   <TextField
                                     fullWidth
                                     select
                                     label="App Status"
                                     name="app_status"
                                     value={values.app_status}
                                     onChange={handleChange}
                                     error={touched.app_status && Boolean(errors.app_status)}
                                     helperText={touched.app_status && errors.app_status}
                                     variant="outlined"
                                   >
                                     {appStatuses.map((status) => (
                                       <MenuItem key={status.value} value={status.value}>
                                         {status.label}
                                       </MenuItem>
                                     ))}
                                   </TextField>
                                 </Grid>
                                 
                                 <Grid item xs={12} md={6}>
                                   <TextField
                                     fullWidth
                                     select
                                     label="App Role"
                                     name="app_role"
                                     value={values.app_role}
                                     onChange={handleChange}
                                     error={touched.app_role && Boolean(errors.app_role)}
                                     helperText={touched.app_role && errors.app_role}
                                     variant="outlined"
                                   >
                                     {appRoles.map((role) => (
                                       <MenuItem key={role.value} value={role.value}>
                                         {role.label}
                                       </MenuItem>
                                     ))}
                                   </TextField>
                                 </Grid>
                 
                 {/* Submit Button */}
                 <Grid item xs={12}>
                   <Button 
                     fullWidth 
                     type="submit" 
                     variant="contained" 
                     color="primary"
                     size="large"
                     sx={{ mt: 3 }}
                   >
                     UPDATE
                   </Button>
                 </Grid>
               </Grid>
             </Form>
           )}
         </Formik>
       </Box>
       
     </Modal>
   )}
                        </>
{/* import employees modal */}
<ImportEmployeeModal 
  open={importModalOpen}
  onClose={() => setImportModalOpen(false)}
  onImport={handleImportEmployees}
/>
   <> 

   
   
   </>
                      
                        </Layout>    </> );
                        };
export default EmployeeListPage;