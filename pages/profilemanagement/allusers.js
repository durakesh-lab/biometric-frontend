import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  FormHelperText,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Tooltip,
  Divider,
  Collapse,
  Modal,
  CircularProgress,
  Snackbar,
  Alert,
  Fab,
  DialogContentText,
  Chip,
  useMediaQuery
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
  LockOpen as LockOpenIcon,
  TableView as TableViewIcon
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

const genders = [{ label: "Male", value: "M" }, { label: "Female", value: "F" }];

const emailValidationCache = {};
const deviceValidationCache = {};
const employeeCodeValidationCache = {};

// General debouncer creator for promise-based Yup tests
const makeDebouncedUniqueCheck = (checkFn, delay = 1000) => {
  let timeoutId;
  let currentResolve;
  
  return (value, id) => {
    // If the value is empty, resolve immediately as valid
    if (!value) return Promise.resolve(true);

    // Clear previous pending timeout
    if (timeoutId) clearTimeout(timeoutId);
    
    // Resolve the previous pending validation check as true (valid)
    // so Formik doesn't hang waiting for obsolete typing keystrokes.
    if (currentResolve) {
      currentResolve(true);
    }
    
    return new Promise((resolve) => {
      currentResolve = resolve;
      timeoutId = setTimeout(async () => {
        try {
          const result = await checkFn(value, id);
          resolve(result);
        } catch (err) {
          resolve(true);
        } finally {
          currentResolve = null;
        }
      }, delay);
    });
  };
};

const fetchEmailUnique = async (email, id) => {
  const cacheKey = `${email}-${id || ''}`;
  if (emailValidationCache[cacheKey] !== undefined) {
    return emailValidationCache[cacheKey];
  }
  try {
    let token = localStorage.getItem("biometric_token");
    const payload = { field: "email", email };
    if (id) payload.id = id;
    const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/employees/checkandverifyfields`, payload, {
      headers: { Authorization: token }
    });
    const isValid = !res.data.message;
    emailValidationCache[cacheKey] = isValid;
    return isValid;
  } catch (err) {
    return true;
  }
};

const fetchDeviceUserIdUnique = async (deviceUserId, id) => {
  const cacheKey = `${deviceUserId}-${id || ''}`;
  if (deviceValidationCache[cacheKey] !== undefined) {
    return deviceValidationCache[cacheKey];
  }
  try {
    let token = localStorage.getItem("biometric_token");
    const payload = { field: "deviceUserId", deviceUserId };
    if (id) payload.id = id;
    const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/employees/checkandverifyfields`, payload, {
      headers: { Authorization: token }
    });
    const isValid = !res.data.message;
    deviceValidationCache[cacheKey] = isValid;
    return isValid;
  } catch (err) {
    return true;
  }
};

const fetchEmployeeCodeUnique = async (employeeCode, id) => {
  const cacheKey = `${employeeCode}-${id || ''}`;
  if (employeeCodeValidationCache[cacheKey] !== undefined) {
    return employeeCodeValidationCache[cacheKey];
  }
  try {
    let token = localStorage.getItem("biometric_token");
    const payload = { field: "employeeCode", employeeCode };
    if (id) payload.id = id;
    const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/employees/checkandverifyfields`, payload, {
      headers: { Authorization: token }
    });
    const isValid = !res.data.message;
    employeeCodeValidationCache[cacheKey] = isValid;
    return isValid;
  } catch (err) {
    return true;
  }
};

// Debounced wrappers exposed to the Yup validation schema
const checkEmailUnique = makeDebouncedUniqueCheck(fetchEmailUnique, 1000);
const checkDeviceUserIdUnique = makeDebouncedUniqueCheck(fetchDeviceUserIdUnique, 1000);
const checkEmployeeCodeUnique = makeDebouncedUniqueCheck(fetchEmployeeCodeUnique, 1000);

const StaffListPage = () => {
  // State for companies
  let router = useRouter()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true });
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
  const [filterBranches, setFilterBranches] = useState([]);
  const [loadingFilterBranches, setLoadingFilterBranches] = useState(false);
  const [filterDepartments, setFilterDepartments] = useState([]);
  const [loadingFilterDepartments, setLoadingFilterDepartments] = useState(false);

  // State for table data and UI
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const dispatch = useDispatch();
  const deletepopup = useSelector((state) => { return state.users });
  const checkdelete = useSelector((state) => { return state.auth });

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
    field: 'firstName',
    direction: 'asc'
  });

  // Search state
  const [search, setSearch] = useState('');

  // Filter modal state
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    company: '',
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    department: '',
    active_status: '',
    branch: '',
    ordering: ""
  });

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
  const addFormSubmittedRef = useRef(false);
  const editFormSubmittedRef = useRef(false);

  // View modal state
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedStaffView, setSelectedStaffView] = useState({});

  const [exportModalOpen, setExportModalOpen] = useState(false);


  useEffect(() => {
    let usersdata = Cookies.get("usercompanyandbranch")
    if (usersdata) {
      let data = JSON.parse(usersdata)
      setSelectedBranch(data.branch._id)
      setSelectedCompany(data.company._id)
    }

  }, [router.query.id])

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
    { id: 'linkedDevices', label: 'Linked Devices', sortable: false },
    { id: 'active_status', label: 'Status', sortable: true },
    { id: 'company_name', label: 'Company', sortable: true },
    { id: 'branch_name', label: 'Branch', sortable: true },
    { id: 'dept_name', label: 'Department', sortable: true },
    { id: 'actions', label: 'Actions', sortable: false }
  ];

  const sortOptions = [
    { label: 'First Name', value: 'firstName' },
    { label: 'Last Name', value: 'lastName' },
    { label: 'Email', value: 'email' },
    { label: 'Status', value: 'active_status' },
    { label: 'Company', value: 'company_name' },
    { label: 'Branch', value: 'branch_name' },
    { label: 'Department', value: 'dept_name' },
  ];

  const treeData = [];
  const isTreeNodeExpanded = () => true;
  const toggleTreeNode = () => {};

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

  const fetchFilterBranches = async (companyId = '') => {
    if (!companyId) {
      setFilterBranches([]);
      return [];
    }

    try {
      setLoadingFilterBranches(true);
      let token = localStorage.getItem("biometric_token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/company/${companyId}/branches`,
        {
          headers: { Authorization: token },
          params: { page: 1, page_size: 1000 }
        }
      );

      return Array.isArray(response.data) ? response.data : response.data?.data || [];
    } catch (error) {
      console.error('Error fetching filter branches:', error);
      return [];
    } finally {
      setLoadingFilterBranches(false);
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

      setBranches(Array.isArray(response.data) ? response.data : response.data?.data || []);
      setLoadingBranches(false);
    } catch (error) {
      console.error('Error fetching branches:', error);
      setLoadingBranches(false);
    }
  };

  // Fetch departments data
  const fetchDepartments = async (branchId) => {
    if (!branchId) {
      setDepartments([]);
      return;
    }

    try {
      setLoadingDepartments(true);
      let token = localStorage.getItem("biometric_token");

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/department/${branchId}`, {
        headers: { Authorization: token }
      }
      );

      setDepartments(Array.isArray(response.data) ? response.data : response.data?.data || []);
      setLoadingDepartments(false);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setLoadingDepartments(false);
    }
  };

  const fetchFilterDepartments = async (branchId = '') => {
    if (!branchId) {
      setFilterDepartments([]);
      return [];
    }

    try {
      setLoadingFilterDepartments(true);
      let token = localStorage.getItem("biometric_token");
      const endpoint = branchId
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/department/${branchId}`
        : `${process.env.NEXT_PUBLIC_BASE_URL}/department`;

      const response = await axios.get(endpoint, {
        headers: { Authorization: token },
        params: { page: 1, page_size: 1000 }
      });

      return Array.isArray(response.data) ? response.data : response.data?.data || [];
    } catch (error) {
      console.error('Error fetching filter departments:', error);
      return [];
    } finally {
      setLoadingFilterDepartments(false);
    }
  };

  // Fetch staff data
  // Fetch staff data
  const fetchStaff = useCallback(async () => {
    // Employee Directory shows EVERY employee — no branch selection required.
    try {
      setLoading(true);
      // Construct query params - use current pagination state
      const params = {
        page: pagination.page,
        page_size: pagination.page_size,
        search: search,
        firstName: filters.firstName || undefined,
        lastName: filters.lastName || undefined,
        email: filters.email || undefined,
        branch: filters.branch || undefined,
        department: filters.department || undefined,
        active_status: filters.active_status || undefined,
        ordering: sorting.direction === 'desc' ? `-${sorting.field}` : sorting.field
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] == null || params[key] === '') {
          delete params[key];
        }
      });

      let token = localStorage.getItem("biometric_token");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/employees/list-all`,
        { companyId: filters.company || undefined },
        {
          headers: { Authorization: token },
          params
        }
      );

      setStaff(response.data?.data || []);
      setPagination((prev) => ({
        ...prev,
        total_pages: Math.ceil((response.data?.count || 0) / prev.page_size),
        count: response.data?.count || 0
      }));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching staff:', error);
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.page_size, search, sorting]);

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
    const loadFilterBranches = async () => {
      if (!filters.company) {
        setFilterBranches([]);
        setFilterDepartments([]);
        return;
      }

      const branchesList = await fetchFilterBranches(filters.company);
      setFilterBranches(branchesList || []);
    };

    loadFilterBranches();
  }, [filters.company]);

  useEffect(() => {
    const loadFilterDepartments = async () => {
      const departmentsList = await fetchFilterDepartments(filters.branch || '');
      if (departmentsList) {
        setFilterDepartments(departmentsList);
      }
    };

    loadFilterDepartments();
  }, [filters.branch]);

  // Load the full directory on mount + whenever paging / filters / search change.
  useEffect(() => {
    fetchStaff();
  }, [fetchStaff, deletepopup?.edituserdata]);

  // Keep the department list + add-form branch in sync when a branch is picked in the Add modal.
  useEffect(() => {
    if (selectedBranch) {
      fetchDepartments(selectedBranch);
      setNewStaff(prev => ({ ...prev, branchId: selectedBranch }));
    } else {
      setDepartments([]);
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
    setPagination(prev => ({
      ...prev,
      page: 1
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
    setFilters(prev => ({
      ...prev,
      ...(name === 'company' ? { branch: '', department: '' } : {}),
      [name]: value,
      ...(name === 'branch' ? { department: '' } : {})
    }));
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
  };

  // Apply filters
  const applyFilters = () => {
    fetchStaff();
    setFilterOpen(false);
  };
  // Reset filters
  const resetFilters = () => {
    setFilters({
      company: '',
      firstName: '',
      lastName: '',
      email: '',
      role: '',
      department: '',
      active_status: '',
      branch: '',
      ordering: ""
    });
    setFilterBranches([]);
    setFilterDepartments([]);
    setSearch('');
    setSorting({
      field: 'firstName',
      direction: 'asc'
    });
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
  };

  let [editcheckfield, seteditcheckfield] = useState({})
  // Handle menu click
  const handleMenuClick = (event, staff) => {
    setAnchorEl(event.currentTarget);
    setSelectedStaff(staff);
    seteditcheckfield({ username: staff.username, email: staff.email, deviceUserId: staff.deviceUserId, employeeCode: staff.employeeCode });
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
  const handleDelete = useCallback(async (id) => {
    id = JSON.parse(sessionStorage.getItem("deleteIds"));
    try {
      let token = localStorage.getItem("biometric_token");
      if (Array.isArray(id)) {

        var data = { ids: id };
        var response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/employees/delete-bulk`, data, {
          headers: { Authorization: token }
        });
      }
      else {
        var response = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/employees/${id}`, {
          headers: { Authorization: token }
        });
      }
      //   const response = await axios.get(`http://localhost:3001/users/deleteUser/${id}`, {
      //     headers: { Authorization: token }
      //   });

      if (response?.data.detail) {
        setOpenSnackbar(response?.data.detail);
      } else {
        setOpenSnackbar({ status: true, message: 'Staff deleted successfully' });
        setSelected([]);
        setShowDelete(false);
        dispatch(confirnDeleteAction(false));
        fetchStaff();
      }
    } catch (error) {
      console.error('Error deleting staff:', error);
      setOpenSnackbar(error.response?.data?.detail || 'Error deleting staff');
    }
    setAnchorEl(null);
  }, [dispatch, fetchStaff]);

  useEffect(() => {
    if (checkdelete?.confirnDelete === true) {
      handleDelete();
    }
  }, [checkdelete?.confirnDelete, handleDelete]);

  // Get serial number
  const getSerialNumber = (index) => {
    return (pagination.page - 1) * pagination.page_size + index + 1;
  };

  // Handle edit
  const handleEdit = () => {
    if (selectedStaff) {
      setCurrentStaff(selectedStaff);
      seteditcheckfield({ email: selectedStaff.email, deviceUserId: selectedStaff.deviceUserId, employeeCode: selectedStaff.employeeCode });
      editFormSubmittedRef.current = false;
      setEditModalOpen(true);
    }
    handleMenuClose();
  };

  // Open the Edit modal with the same fields as Add. Pre-load the employee's
  // company/branch so the Company → Branch → Department dropdowns are populated.
  const openEditEmployee = (staffMember) => {
    setSelectedCompany(staffMember.companyId || null);
    setSelectedBranch(staffMember.branchId || null);
    if (staffMember.companyId) fetchBranches(staffMember.companyId);
    if (staffMember.branchId) fetchDepartments(staffMember.branchId);
    seteditcheckfield({ email: staffMember.email, deviceUserId: staffMember.deviceUserId, employeeCode: staffMember.employeeCode });
    setCurrentStaff({
      ...staffMember,
      department: staffMember.dept_id || staffMember.deptId || '',
    });
    editFormSubmittedRef.current = false;
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (values, { setErrors }) => {
    try {
      let token = localStorage.getItem("biometric_token");

      // Validate email
      if (values.email && editcheckfield.email !== values.email) {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/employees/checkandverifyfields`, { field: "email", email: values.email, id: values._id }, {
          headers: { Authorization: token }
        });
        if (res.data.message) {
          setErrors({ email: "Email already exists" });
          return;
        }
      }

      // Validate employeeCode
      if (values.employeeCode && editcheckfield.employeeCode !== values.employeeCode) {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/employees/checkandverifyfields`, { field: "employeeCode", employeeCode: values.employeeCode, id: values._id }, {
          headers: { Authorization: token }
        });
        if (res.data.message) {
          setErrors({ employeeCode: "Employee code already exists" });
          return;
        }
      }

      // Validate deviceUserId
      if (values.deviceUserId && editcheckfield.deviceUserId !== values.deviceUserId) {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/employees/checkandverifyfields`, { field: "deviceUserId", deviceUserId: values.deviceUserId, id: values._id }, {
          headers: { Authorization: token }
        });
        if (res.data.message) {
          setErrors({ deviceUserId: "Device ID already exists" });
          return;
        }
      }

      await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/employees/${values._id}`, values, {
        headers: { Authorization: token }
      });
      setOpenSnackbar({ status: true, message: 'Employee updated successfully' });
      editFormSubmittedRef.current = false;
      setEditModalOpen(false);
      fetchStaff();
    } catch (error) {
      console.error('Error updating employee:', error);
      setOpenSnackbar(error.response?.data?.message || 'Error updating employee');
    }
  };

  // const handleAllowEditToggle = async (staffMember) => {
  //   let token = localStorage.getItem("biometric_token");
  //   let Staffdata = { ...staffMember, id: staffMember._id, editstatus: staffMember?.editstatus ? false : true };
  //   const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/edituser/` + Staffdata.id, {
  //     method: 'POST',
  //     headers: {
  //       Authorization: token,
  //       'Content-Type': "application/json"
  //     },
  //     body: JSON.stringify(Staffdata),
  //   });
  //   if (response.ok) {
  //     setOpenSnackbar({ status: true, message: staffMember?.editstatus ? "edit disabled for user" : "edit enabled for user" });
  //     fetchStaff();
  //   }
  // };

  // Handle add staff
  const handleAddStaff = async (values, { setErrors }) => {
    try {
      let token = localStorage.getItem("biometric_token");

      // Validate email
      if (values.email) {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/employees/checkandverifyfields`, { field: "email", email: values.email }, {
          headers: { Authorization: token }
        });
        if (res.data.message) {
          setErrors({ email: "Email already exists" });
          return;
        }
      }

      // Validate employeeCode
      if (values.employeeCode) {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/employees/checkandverifyfields`, { field: "employeeCode", employeeCode: values.employeeCode }, {
          headers: { Authorization: token }
        });
        if (res.data.message) {
          setErrors({ employeeCode: "Employee code already exists" });
          return;
        }
      }

      // Validate deviceUserId
      if (values.deviceUserId) {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/employees/checkandverifyfields`, { field: "deviceUserId", deviceUserId: values.deviceUserId }, {
          headers: { Authorization: token }
        });
        if (res.data.message) {
          setErrors({ deviceUserId: "Device ID already exists" });
          return;
        }
      }

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

      setOpenSnackbar({ status: true, message: 'Employee added successfully' });
      addFormSubmittedRef.current = false;
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


  const handleManageEmployees = (id) => {
    router.push({
      pathname: '/company/branches/staff',
      query: { id: id, companyId: router.query.id }
    });
  }

  const handleManagegroups = (id) => {
    router.push({
      pathname: '/managegroup',
      query: { branchId: selectedBranch, companyId: selectedCompany }
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
      .test('email-unique', 'Email already exists', async function (value) {
        if (!value) return true;
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) return true;
        const id = this.parent?._id || this.parent?.id;
        const isSubmitted = id ? editFormSubmittedRef.current : addFormSubmittedRef.current;
        if (!isSubmitted) return true;
        return checkEmailUnique(value, id);
      }),
    employeeCode: Yup.string()
      .notRequired()
      .test('employeeCode-unique', 'Employee code already exists', async function (value) {
        if (!value) return true;
        const id = this.parent?._id || this.parent?.id;
        const isSubmitted = id ? editFormSubmittedRef.current : addFormSubmittedRef.current;
        if (!isSubmitted) return true;
        return checkEmployeeCodeUnique(value, id);
      }),
    deviceUserId: Yup.string()
      .notRequired()
      .test('deviceUserId-unique', 'Device ID already exists', async function (value) {
        if (!value) return true;
        const id = this.parent?._id || this.parent?.id;
        const isSubmitted = id ? editFormSubmittedRef.current : addFormSubmittedRef.current;
        if (!isSubmitted) return true;
        return checkDeviceUserIdUnique(value, id);
      }),
    companyId: Yup.string().required("Required"),
    branchId: Yup.string().required("Required"),
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
        "username", "First Name", "Last Name", "email", "Date of Joining", "Date OF Birth",
        "Mobile", "Gender", 'active_status', "Department Code",
        "Department Name", "Company Id", "branch Code",

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
          employee.dept_name || '',
          employee.company_Id || '',
          employee.branchCode || '',

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

      setOpenSnackbar({ status: "success", message: "Record exported successfully" });
      setExportModalOpen(false);
    } catch (error) {
      console.error('Error exporting employees:', error);
    }
  };







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
      console.log(response, "response", { response })
      setOpenSnackbar({ status: true, message: response?.data?.count + " " + 'Staff imported successfully' });
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
              <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Employee Directory
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

              <Button
                startIcon={<FilterIcon />}
                onClick={() => setFilterOpen(true)}
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
                Sort & Filter
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
                onClick={() => {
                  addFormSubmittedRef.current = false;
                  setNewStaff({
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
                    companyId: selectedCompany || '',
                    branchId: selectedBranch || '',
                    department: ''
                  });
                  setAddModalOpen(true);
                }}
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
                  placeholder="Search name / email / code..."
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

                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <Select
                    value={filters.company || ''}
                    displayEmpty
                    onChange={(e) => {
                      handleFilterChange('company', e.target.value);
                      setPagination(prev => ({ ...prev, page: 1 }));
                    }}
                    sx={{
                      borderRadius: '8px',
                      color: '#4B5563',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E5E7EB' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#D1D5DB' },
                    }}
                  >
                    <MenuItem value="">Select Company</MenuItem>
                    {companies.map((company) => (
                      <MenuItem key={company._id} value={company._id}>
                        {company.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

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
                    disabled={!filters.company || loadingFilterBranches}
                  >
                    <MenuItem value="">{filters.company ? 'All Branches' : 'Select Company First'}</MenuItem>
                    {filterBranches.map((b) => (
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
                    disabled={!filters.branch || loadingFilterDepartments}
                  >
                    <MenuItem value="">{filters.branch ? 'All Departments' : 'Select Branch First'}</MenuItem>
                    {filterDepartments.map((dept) => (
                      <MenuItem key={dept._id} value={dept._id}>{dept.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ display: 'block' }}>
                <Box sx={{ overflowX: 'auto' }}>
                  <TableContainer
                    elevation={0}
                    sx={{
                      height: { xs: 600, sm: 300, md: 350 },
                      maxHeight: '80vh',
                      overflowY: 'auto',
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
                                    padding: '8px 16px',
                                    height: '40px',
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
                                  {staffMember.linkedDevices && staffMember.linkedDevices.length > 0 ? (
                                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center' }}>
                                      {staffMember.linkedDevices.map((dev) => (
                                        <Chip
                                          key={dev._id}
                                          label={dev.name || dev.serialNumber}
                                          size="small"
                                          variant="outlined"
                                          sx={{ borderColor: '#10B981', color: '#047857', fontSize: '11px', height: '22px' }}
                                        />
                                      ))}
                                    </Box>
                                  ) : (
                                    <Typography variant="caption" sx={{ color: '#9CA3AF' }}>
                                      None
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
                                <TableCell align="center">{staffMember.company_name || '-'}</TableCell>
                                <TableCell align="center">{staffMember.branch_name || '-'}</TableCell>
                                <TableCell align="center">{staffMember.dept_name || '-'}</TableCell>

                                <TableCell align="center">
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
                                    open={openMenu && selectedStaff?._id === staffMember._id}
                                    onClose={handleMenuClose}
                                    PaperProps={{
                                      style: {
                                        width: '20ch',
                                        boxShadow: 'none',
                                      },
                                      elevation: 0,
                                    }}
                                  >
                                    <MenuItem onClick={() => { handleMenuClose(); handleViewClick(staffMember); }}>
                                      View Details
                                    </MenuItem>
                                    <MenuItem onClick={() => { handleMenuClose(); openEditEmployee(staffMember); }}>
                                      Edit Profile
                                    </MenuItem>
                                    <MenuItem onClick={() => { handleMenuClose(); handleConfirmDelete(staffMember._id); }}>
                                      Delete
                                    </MenuItem>
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

                {/* Pagination */}
                <Box
                  sx={{
                    mt: 2,
                    px: 2,
                    pb: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: { xs: 'stretch', md: 'center' },
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 2,
                    borderTop: '1px solid #E5E7EB',
                    paddingTop: '16px',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
                    <Typography variant="caption" sx={{ display: 'block', mb: 0.75, color: 'text.secondary' }}>
                      Rows per page
                    </Typography>
                    <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 140 } }}>
                      <Select
                        value={pagination.page_size}
                        onChange={handlePageSizeChange}
                        sx={{
                          bgcolor: '#fff',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#D1D5DB',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#0E9F6E',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#0E9F6E',
                          },
                        }}
                      >
                        {[5, 10, 25, 50, 100].map((size) => (
                          <MenuItem key={size} value={size}>
                            {size}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      width: { xs: '100%', md: 'auto' },
                      '& .pagination': {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        gap: 1,
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                      },
                      '& .pagination li a': {
                        minWidth: 38,
                        height: 38,
                        padding: '0 12px',
                        borderRadius: '10px',
                        border: '1px solid #D1D5DB',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: theme.palette.text.primary,
                        backgroundColor: '#FFFFFF',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                      },
                      '& .pagination li a:hover': {
                        borderColor: '#0E9F6E',
                        color: '#0E9F6E',
                      },
                      '& .pagination li.selected a': {
                        backgroundColor: theme.palette.primary.main,
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        boxShadow: '0 8px 18px rgba(14, 159, 110, 0.18)',
                      },
                      '& .pagination li.disabled a': {
                        opacity: 0.45,
                        cursor: 'not-allowed',
                        backgroundColor: '#F9FAFB',
                      },
                    }}
                  >
                    <ReactPaginate
                      previousLabel={'Previous'}
                      nextLabel={'Next'}
                      breakLabel={'...'}
                      breakClassName={'break-me'}
                      pageCount={Math.max(pagination.total_pages, 1)}
                      marginPagesDisplayed={isMobile ? 1 : 2}
                      pageRangeDisplayed={isMobile ? 1 : 3}
                      onPageChange={({ selected }) => handlePageChange(selected + 1)}
                      containerClassName={'pagination'}
                      activeClassName={'selected'}
                      previousClassName={'previous'}
                      nextClassName={'next'}
                      disabledClassName={'disabled'}
                      forcePage={Math.max(Math.min(pagination.page - 1, pagination.total_pages - 1), 0)}
                      pageClassName={'page-item'}
                      pageLinkClassName={'page-link'}
                      previousLinkClassName={'page-link'}
                      nextLinkClassName={'page-link'}
                    />
                  </Box>

                  <Box
                    sx={{
                      minWidth: { xs: '100%', md: 160 },
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: { xs: 'flex-start', md: 'flex-end' },
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      Page {pagination.page} of {pagination.total_pages}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Total {pagination.count} employees
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {false && (
                <Box sx={{ p: 2, backgroundColor: '#FFFFFF' }}>
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                      <CircularProgress size={40} />
                    </Box>
                  ) : treeData.length === 0 ? (
                    <Box sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
                      No employees found
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '70vh', overflowY: 'auto', pr: 1 }}>
                      {treeData.map((company) => {
                        const companyNodeKey = `company-${company.key}`;
                        const companyOpen = isTreeNodeExpanded(companyNodeKey);

                        return (
                          <Paper
                            key={companyNodeKey}
                            variant="outlined"
                            sx={{
                              borderColor: '#E5E7EB',
                              borderRadius: '12px',
                              overflow: 'hidden',
                              boxShadow: '0 1px 2px rgba(16, 24, 40, 0.04)',
                            }}
                          >
                            <Box
                              onClick={() => toggleTreeNode(companyNodeKey)}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 2,
                                p: 2,
                                cursor: 'pointer',
                                background: 'linear-gradient(90deg, #F0FDF4 0%, #FFFFFF 70%)',
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                                <Box
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '12px',
                                    bgcolor: '#D1FAE5',
                                    color: '#047857',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                  }}
                                >
                                  <BusinessIcon fontSize="small" />
                                </Box>
                                <Box sx={{ minWidth: 0 }}>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#111827' }} noWrap>
                                    {company.name}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: '#6B7280' }}>
                                    {company.count} employees
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
                              <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {company.branches.map((branch) => {
                                  const branchNodeKey = `branch-${company.key}-${branch.key}`;
                                  const branchOpen = isTreeNodeExpanded(branchNodeKey);

                                  return (
                                    <Paper
                                      key={branchNodeKey}
                                      variant="outlined"
                                      sx={{
                                        borderColor: '#E5E7EB',
                                        borderRadius: '10px',
                                        overflow: 'hidden',
                                        backgroundColor: '#FFFFFF',
                                      }}
                                    >
                                      <Box
                                        onClick={() => toggleTreeNode(branchNodeKey)}
                                        sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'space-between',
                                          gap: 2,
                                          px: 2,
                                          py: 1.5,
                                          cursor: 'pointer',
                                          backgroundColor: '#F8FAFC',
                                        }}
                                      >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
                                          <Box
                                            sx={{
                                              width: 36,
                                              height: 36,
                                              borderRadius: '10px',
                                              bgcolor: '#DBEAFE',
                                              color: '#1D4ED8',
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
                                              {branch.count} employees
                                            </Typography>
                                          </Box>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <Chip
                                            size="small"
                                            label={`${branch.departments.length} departments`}
                                            sx={{
                                              bgcolor: '#EFF6FF',
                                              color: '#1D4ED8',
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
                                        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                          {branch.departments.map((dept) => {
                                            const deptNodeKey = `dept-${company.key}-${branch.key}-${dept.key}`;
                                            const deptOpen = isTreeNodeExpanded(deptNodeKey);

                                            return (
                                              <Box
                                                key={deptNodeKey}
                                                sx={{
                                                  borderLeft: '3px solid #E5E7EB',
                                                  borderRadius: '8px',
                                                  backgroundColor: '#F9FAFB',
                                                  overflow: 'hidden',
                                                }}
                                              >
                                                <Box
                                                  onClick={() => toggleTreeNode(deptNodeKey)}
                                                  sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    gap: 2,
                                                    px: 2,
                                                    py: 1.25,
                                                    cursor: 'pointer',
                                                  }}
                                                >
                                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
                                                    <Box
                                                      sx={{
                                                        width: 34,
                                                        height: 34,
                                                        borderRadius: '10px',
                                                        bgcolor: '#FCE7F3',
                                                        color: '#BE185D',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexShrink: 0,
                                                      }}
                                                    >
                                                      <DepartmentIcon fontSize="small" />
                                                    </Box>
                                                    <Box sx={{ minWidth: 0 }}>
                                                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#111827' }} noWrap>
                                                        {dept.name}
                                                      </Typography>
                                                      <Typography variant="caption" sx={{ color: '#6B7280' }}>
                                                        {dept.count} employees
                                                      </Typography>
                                                    </Box>
                                                  </Box>

                                                  <ChevronRightIcon
                                                    sx={{
                                                      color: '#6B7280',
                                                      transform: deptOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                                                      transition: 'transform 0.2s ease',
                                                    }}
                                                  />
                                                </Box>

                                                <Collapse in={deptOpen} timeout="auto" unmountOnExit>
                                                  <Box sx={{ p: 2, pt: 0, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                                                    {dept.employees.map((employee) => (
                                                      <Paper
                                                        key={employee._id}
                                                        variant="outlined"
                                                        sx={{
                                                          p: 1.5,
                                                          borderRadius: '10px',
                                                          borderColor: '#E5E7EB',
                                                          display: 'flex',
                                                          alignItems: 'center',
                                                          justifyContent: 'space-between',
                                                          gap: 2,
                                                        }}
                                                      >
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                                                          <Box
                                                            sx={{
                                                              width: 40,
                                                              height: 40,
                                                              borderRadius: '999px',
                                                              bgcolor: '#DBEAFE',
                                                              color: '#1D4ED8',
                                                              display: 'flex',
                                                              alignItems: 'center',
                                                              justifyContent: 'center',
                                                              flexShrink: 0,
                                                            }}
                                                          >
                                                            <PersonIcon fontSize="small" />
                                                          </Box>

                                                          <Box sx={{ minWidth: 0 }}>
                                                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#111827' }} noWrap>
                                                              {employee.firstName} {employee.lastName}
                                                            </Typography>
                                                            <Typography variant="caption" sx={{ color: '#6B7280' }} noWrap>
                                                              {employee.email}
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', gap: 1, mt: 0.75, flexWrap: 'wrap' }}>
                                                              <Chip
                                                                size="small"
                                                                label={employee.dept_name || dept.name}
                                                                sx={{
                                                                  bgcolor: '#EFF6FF',
                                                                  color: '#1D4ED8',
                                                                  fontWeight: 600,
                                                                }}
                                                              />
                                                              <Chip
                                                                size="small"
                                                                label={employee.deviceUserId ? `Device #${employee.deviceUserId}` : 'Not linked'}
                                                                sx={{
                                                                  bgcolor: employee.deviceUserId ? '#DEF7EC' : '#F3F4F6',
                                                                  color: employee.deviceUserId ? '#03543F' : '#6B7280',
                                                                  fontWeight: 600,
                                                                }}
                                                              />
                                                              <Chip
                                                                size="small"
                                                                label={employee.active_status || 'Inactive'}
                                                                sx={{
                                                                  bgcolor: employee.active_status === 'Active' ? '#DEF7EC' : '#FDE8E8',
                                                                  color: employee.active_status === 'Active' ? '#03543F' : '#9B1C1C',
                                                                  fontWeight: 600,
                                                                }}
                                                              />
                                                            </Box>
                                                          </Box>
                                                        </Box>

                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                          <Tooltip title="View Details">
                                                            <IconButton
                                                              size="small"
                                                              sx={{ color: '#9CA3AF', '&:hover': { color: '#4B5563' } }}
                                                              onClick={() => handleViewClick(employee)}
                                                            >
                                                              <ViewIcon fontSize="small" />
                                                            </IconButton>
                                                          </Tooltip>

                                                          <Tooltip title="Edit Profile">
                                                            <IconButton
                                                              size="small"
                                                              sx={{ color: '#9CA3AF', '&:hover': { color: '#4B5563' } }}
                                                              onClick={() => openEditEmployee(employee)}
                                                            >
                                                              <EditIcon fontSize="small" />
                                                            </IconButton>
                                                          </Tooltip>

                                                          <Tooltip title="Delete">
                                                            <IconButton
                                                              size="small"
                                                              sx={{ color: '#EF4444', '&:hover': { color: '#DC2626' } }}
                                                              onClick={() => handleConfirmDelete(employee._id)}
                                                            >
                                                              <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                          </Tooltip>
                                                        </Box>
                                                      </Paper>
                                                    ))}
                                                  </Box>
                                                </Collapse>
                                              </Box>
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
                </Box>
              )}
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
                  <InputLabel>Company</InputLabel>
                  <Select
                    value={filters.company}
                    label="Company"
                    onChange={(e) => handleFilterChange('company', e.target.value)}
                  >
                    <MenuItem value="">Select Company</MenuItem>
                    {companies.map((company) => (
                      <MenuItem key={company._id} value={company._id}>
                        {company.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Branch</InputLabel>
                  <Select
                    value={filters.branch}
                    label="Branch"
                    onChange={(e) => handleFilterChange('branch', e.target.value)}
                    disabled={!filters.company || loadingFilterBranches}
                  >
                    <MenuItem value="">{filters.company ? 'All Branches' : 'Select Company First'}</MenuItem>
                    {filterBranches.map((branch) => (
                      <MenuItem key={branch._id} value={branch._id}>
                        {branch.name}
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
                    disabled={!filters.branch || loadingFilterDepartments}
                  >
                    <MenuItem value="">{filters.branch ? 'All Departments' : 'Select Branch First'}</MenuItem>
                    {filterDepartments.map((dept) => (
                      <MenuItem key={dept._id} value={dept._id}>
                        {dept.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Sort Field</InputLabel>
                  <Select
                    value={sorting.field}
                    label="Sort Field"
                    onChange={(e) => {
                      setSorting(prev => ({
                        ...prev,
                        field: e.target.value
                      }));
                      setPagination(prev => ({
                        ...prev,
                        page: 1
                      }));
                    }}
                  >
                    {sortOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Sort Direction</InputLabel>
                  <Select
                    value={sorting.direction}
                    label="Sort Direction"
                    onChange={(e) => {
                      setSorting(prev => ({
                        ...prev,
                        direction: e.target.value
                      }));
                      setPagination(prev => ({
                        ...prev,
                        page: 1
                      }));
                    }}
                  >
                    <MenuItem value="asc">Ascending</MenuItem>
                    <MenuItem value="desc">Descending</MenuItem>
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
          onClose={() => { editFormSubmittedRef.current = false; setEditModalOpen(false); }}
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
              // validateOnChange={false}
              // validateOnBlur={false}
            >
              {({ values, errors, touched, handleChange, setFieldValue, setValues }) => (
                <Form>
                  {/* Same "Attendance Profile Only" banner as Add, for consistency */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: '#E6F6F0', color: '#03543F', p: 2, borderRadius: '8px', mb: 3 }}>
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
                        onChange={handleChange}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
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
                        error={touched.employeeCode && Boolean(errors.employeeCode)}
                        helperText={touched.employeeCode && errors.employeeCode}
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
                      <FormControl fullWidth error={touched.companyId && Boolean(errors.companyId)}>
                        <InputLabel>Company*</InputLabel>
                        <Select
                          name="companyId"
                          value={values.companyId || ''}
                          label="Company*"
                          onChange={(e) => {
                            const v = e.target.value;
                            setValues({
                              ...values,
                              companyId: v,
                              branchId: '',
                              department: ''
                            });
                            setSelectedCompany(v);
                          }}
                          sx={{ borderRadius: '8px' }}
                        >
                          {companies.map((c) => (
                            <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                          ))}
                        </Select>
                        {touched.companyId && errors.companyId && (
                          <FormHelperText>{errors.companyId}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={touched.branchId && Boolean(errors.branchId)}>
                        <InputLabel>Branch*</InputLabel>
                        <Select
                          name="branchId"
                          value={values.branchId || ''}
                          label="Branch*"
                          onChange={(e) => {
                            const v = e.target.value;
                            setValues({
                              ...values,
                              branchId: v,
                              department: ''
                            });
                            setSelectedBranch(v);
                          }}
                          disabled={loadingBranches || !(values.companyId || selectedCompany)}
                          sx={{ borderRadius: '8px' }}
                        >
                          {branches.map((b) => (
                            <MenuItem key={b._id} value={b._id}>{b.name}</MenuItem>
                          ))}
                        </Select>
                        {touched.branchId && errors.branchId && (
                          <FormHelperText>{errors.branchId}</FormHelperText>
                        )}
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
                        error={touched.deviceUserId && Boolean(errors.deviceUserId)}
                        helperText={touched.deviceUserId && errors.deviceUserId}
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
                        onClick={() => { editFormSubmittedRef.current = true; }}
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
          onClose={() => { addFormSubmittedRef.current = false; setAddModalOpen(false); }}
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
                onClick={() => { addFormSubmittedRef.current = false; setAddModalOpen(false); }}
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
              // validateOnChange={false}
              // validateOnBlur={false}
            >
              {({ values, errors, touched, handleChange, setFieldValue, setValues }) => (
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
                        onChange={handleChange}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
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
                      <FormControl fullWidth error={touched.companyId && Boolean(errors.companyId)}>
                        <InputLabel>Company*</InputLabel>
                        <Select
                          name="companyId"
                          value={values.companyId || ''}
                          label="Company*"
                          onChange={(e) => {
                            const v = e.target.value;
                            setValues({
                              ...values,
                              companyId: v,
                              branchId: '',
                              department: ''
                            });
                            setSelectedCompany(v);
                          }}
                          sx={{ borderRadius: '8px' }}
                        >
                          {companies.map((c) => (
                            <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                          ))}
                        </Select>
                        {touched.companyId && errors.companyId && (
                          <FormHelperText>{errors.companyId}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={touched.branchId && Boolean(errors.branchId)}>
                        <InputLabel>Branch*</InputLabel>
                        <Select
                          name="branchId"
                          value={values.branchId || ''}
                          label="Branch*"
                          onChange={(e) => {
                            const v = e.target.value;
                            setValues({
                              ...values,
                              branchId: v,
                              department: ''
                            });
                            setSelectedBranch(v);
                          }}
                          disabled={loadingBranches || !(values.companyId || selectedCompany)}
                          sx={{ borderRadius: '8px' }}
                        >
                          {branches.map((b) => (
                            <MenuItem key={b._id} value={b._id}>{b.name}</MenuItem>
                          ))}
                        </Select>
                        {touched.branchId && errors.branchId && (
                          <FormHelperText>{errors.branchId}</FormHelperText>
                        )}
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
                        error={touched.employeeCode && Boolean(errors.employeeCode)}
                        helperText={touched.employeeCode && errors.employeeCode}
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
                        error={touched.deviceUserId && Boolean(errors.deviceUserId)}
                        helperText={touched.deviceUserId && errors.deviceUserId}
                        placeholder="leave blank — map in Enrollment"
                        variant="outlined"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        type="submit"
                        onClick={() => { addFormSubmittedRef.current = true; }}
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
