import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  Paper,
  TextField,
  InputAdornment,
  Pagination,
  useMediaQuery,
  useTheme,
  styled,
  Modal,
  FormHelperText,
  FormGroup,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Snackbar,
  SnackbarContent, CircularProgress,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';

import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  MoreVert as MoreVertIcon,
  Mail as MailIcon,
  Label as LabelIcon,
  Person as PersonIcon,
  Groups as GroupsIcon,
  ArrowForward as ArrowForwardIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
   Business as BusinessIcon,  AccountTree as BranchIcon,
} from '@mui/icons-material';

import { useFormik } from 'formik';
import * as yup from 'yup';
import Layout from '../../components/Layout/Layout';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { createTheme, ThemeProvider } from '@mui/material/node/styles/index.js';
import axios from 'axios';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ReactPaginate from 'react-paginate';
import { useRouter } from 'next/router';
import ViewStaffModal from '../../components/Dashboard/viewstaff';
import ViewStaffModalwithgroup from '../../components/Dashboard/viewstaffwithgroup';
import Cookies from 'js-cookie';

// Styled components
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 1
};

const colorOptions = [
  { value: 'primary', label: 'Primary', color: '#1976d2' },
  { value: 'secondary', label: 'Secondary', color: '#9c27b0' },
  { value: 'success', label: 'Success', color: '#2e7d32' },
  { value: 'error', label: 'Error', color: '#d32f2f' },
  { value: 'warning', label: 'Warning', color: '#ed6c02' },
  { value: 'info', label: 'Info', color: '#0288d1' },
  { value: 'pink', label: 'Pink', color: '#ff69b4' },
  { value: 'orange', label: 'Orange', color: '#ffa500' },
  { value: 'teal', label: 'Teal', color: '#008080' },
  { value: 'purple', label: 'Purple', color: '#800080' },
  { value: 'dark', label: 'Dark', color: '#212529' }
];

const GroupManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElSetting, setAnchorElSetting] = useState(null);
  const [anchorElgroup, setanchorElgroup] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openCreateGroup, setOpenCreateGroup] = useState(false);
  const [openAssignGroup, setOpenAssignGroup] = useState(false);
  const [openBulkAssignGroup, setOpenBulkAssignGroup] = useState(false);
  const [openEditGroup, setOpenEditGroup] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

  const [currentGroup, setCurrentGroup] = useState(null);
  
    // View modal state
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedStaffView, setSelectedStaffView] = useState({});

  let router=useRouter()
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  // Sample data with state for editable groups
  const [groups, setGroups] = useState([
    // { id: 'all', name: 'All Users', icon: <GroupsIcon />, count: 6739, color: 'primary' },
    // { id: 2, name: 'SQA', count: 50, color: 'pink', shiftTiming: '9am-5pm', description: 'Software Quality Assurance team' },
    // { id: 1, name: 'Xcv', count: 3, color: 'dark', shiftTiming: 'Flexible', description: 'Experimental group' }
  ]);
  const users = [
    { id: 17102, name: 'ShawnDub', status: 'inactive', initials: 'SH', color: 'purple', groupId: 2 },
    { id: 17101, name: 'RobertMaymn', status: 'inactive', initials: 'RO', color: 'primary', groupId: 1 },
    { id: 17100, name: 'RaymondVep', status: 'inactive', initials: 'RA', color: 'orange', groupId: null },
    { id: 17099, name: 'Emoryfed', status: 'inactive', initials: 'EM', color: 'danger', groupId: null },
    { id: 17098, name: 'DavidAline', status: 'inactive', initials: 'DA', color: 'azure', groupId: null },
    { id: 17076, name: 'Oscar harry', status: 'active', initials: 'OS', color: 'success', groupId: null },
    { id: 17073, name: 'DEXI', status: 'active', initials: 'DE', color: 'gray', groupId: null },
    { id: 17064, name: 'akhtar ali shah', status: 'active', initials: 'AK', color: 'pink', groupId: null },
    { id: 17063, name: 'Ali Raza', status: 'active', initials: 'AL', color: 'gray', groupId: null },
    { id: 17060, name: 'kelly kunlex', status: 'active', initials: 'KE', color: 'pink', groupId: null },
    { id: 17053, name: 'John Doe', status: 'active', initials: 'JO', color: 'secondary', groupId: null }
  ];
 const fetchgroup=async ()=>{
   let token = localStorage.getItem("biometric_token");
                const response = await axios.get('http://localhost:3001/groups', {
                  headers: { Authorization: token }
                });
                if(response.data){
                 setGroups(response.data);

                }
 }
 const fetchusers=async ()=>{
   let token = localStorage.getItem("biometric_token");
                const response = await axios.post('http://localhost:3001/users/allusers', {
                  headers: { Authorization: token }
                });
                if(response.data){
                //  setGroups(response.data);

                }
 }
 useEffect(()=>{
  fetchgroup()
 },[])
  // Formik for create group
  const createGroupForm = useFormik({
 initialValues: {
  name: '',
  color: '',
  startTime: null, // Changed to null for TimePicker
  endTime: null,   // Changed to null for TimePicker
  description: ''
},
validationSchema: yup.object({
  // ... other validations ...
startTime: yup
  .date()
  .typeError("Start time is required")
  .required("Start time is required"),

endTime: yup
  .date()
  .typeError("End time is required")
  .required("End time is required")
  .when('startTime', (startTime, schema) =>
    schema.test({
      name: 'is-after-start',
      message: 'End time must be after start time',
      test: function (endTime) {
        if (!(startTime instanceof Date) || !(endTime instanceof Date)) {
          return true; // Skip validation if either is invalid
        }

        const refDate = new Date(2000, 0, 1);

        const start = new Date(refDate);
        start.setHours(startTime.getHours(), startTime.getMinutes());

        const end = new Date(refDate);
        end.setHours(endTime.getHours(), endTime.getMinutes());

        return end > start;
      },
    })
  )


,


      name: yup.string().required('Group name is required'),
      color: yup.string().required('Color is required'),
      description: yup.string().required('Description is required')
    }),
    onSubmit:async (values) => {
      // Generate a new ID for the group
      const newId = Math.max(...groups.filter(g => g.id !== 'all').map(g => g.id), 0) + 1;
      
      const newGroup = {
        id: newId,
        name: values.name,
        color: values.color,
        startTime: values.startTime,
         endTime: values.endTime,
        description: values.description,
        count: 0
      };
      try {
             let token = localStorage.getItem("biometric_token");
                const response = await axios.post('http://localhost:3001/groups', newGroup, {
                  headers: { Authorization: token }
                });

                if(response.data){
          setOpenSnackbar({status:true,message:"Group Created Successfully"})
      setOpenCreateGroup(false);
      createGroupForm.resetForm();
                }
      } catch (error) {
        console.log(error,"error")
      }
       
    
    }
  });

  // Formik for edit group
  const editGroupForm = useFormik({
  initialValues: {
    _id:"",
  name: '',
  color: '',
  startTime: null, // Changed to null for TimePicker
  endTime: null,   // Changed to null for TimePicker
  description: ''
},
validationSchema: yup.object({
  startTime: yup
    .mixed()
    .required('Start time is required')
    .test('is-time', 'Invalid time format', (value) => {
      return value === null || value instanceof Date;
    }),
  endTime: yup
    .mixed()
    .required('End time is required')
    .test('is-time', 'Invalid time format', (value) => {
      return value === null || value instanceof Date;
    }),
      name: yup.string().required('Group name is required'),
      color: yup.string().required('Color is required'),
      description: yup.string().required('Description is required')
    }),
    onSubmit: async(values) => {
      // const updatedGroups = groups.map(group => 
      //   group.id === currentGroup.id ? { ...group, ...values } : group
      // );
      // setGroups(updatedGroups);
         try {
             let token = localStorage.getItem("biometric_token");
                const response = await axios.post('http://localhost:3001/groups/edit', values, {
                  headers: { Authorization: token }
                });
              if(Object.keys(response.data)?.length){
                          setOpenSnackbar({status:true,message:"Group edited Successfully"})
       setOpenEditGroup(false);
      editGroupForm.resetForm();
                fetchgroup()
                
              }
  
      } catch (error) {
        console.log(error,"error")
      }
     
    }
  });
  // Initialize edit form when opening the modal
  const handleOpenEditGroup = (group) => {
    setCurrentGroup(group);
    editGroupForm.setValues({
      _id:group._id,
      name: group.name,
      color: group.color,
      startTime:new Date(group.startTime)  || '',
        endTime: new Date(group.endTime) || '',
      description: group.description || ''
    });
    setOpenEditGroup(true);
  };

  // Handle group assignment (single user)
  const handleAssignGroupSubmit = async(groupId) => {
       // Use the selected group if one was chosen, otherwise keep the current group
  const groupIdToAssign = selectedGroupId !== null ? selectedGroupId : currentUser?.groupId;
  
  if (groupIdToAssign && currentUser) {


            try {
             let token = localStorage.getItem("biometric_token");
                const response = await axios.post('http://localhost:3001/users/edituser_assigngroup/'+currentUser._id, {groupId:groupIdToAssign}, {
                  headers: { Authorization: token }
                });
              if(Object.keys(response.data)?.length){
                          setOpenSnackbar({status:true,message:"Group assigned Successfully"})
                 fetchgroupcount()
                // fetchgroup()
                fetchStaff()
                
              }
  
      } catch (error) {
        console.log(error,"error")
      }
    // API call to update user's group
    setOpenAssignGroup(false);
    setSelectedGroupId(null);
  }
    setOpenAssignGroup(false);
    setCurrentUserId(null);
  };
  // Handle bulk group assignment
  const handleBulkAssignGroup = async(groupId) => {
    // In a real app, you would update all selected users' groups in your state/API
    console.log(`Assigning users ${selectedUsers.join(',')} to group ${groupId}`,selectedUsers,selectedGroupId);
      
  if (selectedGroupId && selectedUsers.length) {

            try {
             let token = localStorage.getItem("biometric_token");
                const response = await axios.post('http://localhost:3001/users/edituser_assigngroup_bulk', {groupId:selectedGroupId,userIds:selectedUsers}, {
                  headers: { Authorization: token }
                });
                fetchgroupcount()
              if(Object.keys(response.data)?.length){
              setOpenSnackbar({status:true,message:"Group assigned Successfully"})
    
                // fetchgroup()
                fetchStaff()
                
              }
  
      } catch (error) {
        console.log(error,"error")
      }
    // API call to update user's group
    setOpenAssignGroup(false);
    setSelectedGroupId(null);
  }
    setOpenBulkAssignGroup(false);
    setSelectedUsers([]);
  };

  const handleMenuClick = (event,user) => {
    setAnchorEl(event.currentTarget);
    setCurrentUser(user)
  };

  const handleMenuClickSetting = (event) => {
    setAnchorElSetting(event.currentTarget);
  };

  const handleMenuClickgroup = (event, group) => {
    setanchorElgroup(event.currentTarget);
    setCurrentGroup(group);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setAnchorElSetting(null);
    setanchorElgroup(null);
  };
  // Handle view click
  const handleViewClick = (staff) => {
    setSelectedStaffView(staff);
    setViewModalOpen(true);
  };
  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const handleUserSelect = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleOpenAssignGroup = (userId,user) => {
    setCurrentUserId(userId);
    setOpenAssignGroup(true);

  };

  const handleOpenBulkAssignGroup = () => {
    if (bulkAction === 'assignGroup') {
      setOpenBulkAssignGroup(true);
    }
  };

  const handleDeleteGroup =async (id) => {
    if (id) {
       let token = localStorage.getItem("biometric_token");
                const response = await axios.get('http://localhost:3001/groups/delete/'+id, {
                  headers: { Authorization: token }
                });
                fetchgroup()
                  // console.log(response,"??????@@@@@@@@@@")
                  fetchgroup()
      // setGroups(groups.filter(group => group.id !== currentGroup.id));
      setanchorElgroup(null);
    }
  };

  const getColor = (color) => {
    const colorMap = {
      primary: theme.palette.primary.main,
      secondary: theme.palette.secondary.main,
      success: theme.palette.success.main,
      danger: theme.palette.error.main,
      warning: theme.palette.warning.main,
      info: theme.palette.info.main,
      pink: '#ff69b4',
      orange: '#ffa500',
      teal: '#008080',
      azure: '#007fff',
      purple: '#800080',
      dark: '#212529',
      gray: '#6c757d'
    };
    return colorMap[color] || theme.palette.primary.main;
  };

  const getUserGroup = (userId) => {
    const user = users.find(u => u.id === userId);
    if (!user || !user.groupId) return null;
    return groups.find(g => g.id === user.groupId);
  };


  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 10,
    total_pages: 1,
    count: 0
  });
    const [staff, setStaff] = useState([]);
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
    const [loading, setLoading] = useState(true);
      // Search state
      const [search, setSearch] = useState('');
        const [sorting, setSorting] = useState({
          field: 'id',
          direction: 'desc'
        });
          const [filters, setFilters] = useState({
            firstName: '',
            lastName: '',
            email: '',
            role: '',
            department: '',
            active_status: '',
            ordering: ""
          });
    // State for companies
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [loadingCompanies, setLoadingCompanies] = useState(true);
  
    // State for branches
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [loadingBranches, setLoadingBranches] = useState(false);
    // Fetch companies data
    const fetchCompanies = async () => {
      try {
        setLoadingCompanies(true);
        let token = localStorage.getItem("biometric_token");
        
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
        let token = localStorage.getItem("biometric_token");
        
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

      const fetchgroupcount =async (id) => {
    if (true) {
       let token = localStorage.getItem("biometric_token");
                const response = await axios.post('http://localhost:3001/users/getAllgroupscount',{ branchId: selectedBranch, companyId: selectedCompany ,type:"group"}, {
                  headers: { Authorization: token }
                });
               let data=response.data
               let testgroups=groups.map((e,i)=>{
                 data.data.forEach((j)=>{
                 if( e._id==j.groupId){
                    e.userscount=j.userCount
                 }
                 })
                return e
               })
                  // console.log(testgroups,"??????@@@@@@@@@@")
                                 
                    //  console.log(testgroups,"===++++++++++")
                    //  alert("8888888")
                  setGroups(testgroups)
         
      // setGroups(groups.filter(group => group.id !== currentGroup.id));
    }
  };
     useEffect(() => {
      
        fetchCompanies();
      }, []);
    
      useEffect(() => {
        if (selectedCompany) {
          fetchBranches(selectedCompany);
          if(!router.query.branchId){
          setSelectedBranch(null); // Reset branch selection when company changes
          }
          // setNewStaff(prev => ({ ...prev, companyId: selectedCompany }));
        }
      }, [selectedCompany]);
    
      // Fetch staff data
      const fetchStaff = async (groupId) => {
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
            `http://localhost:3001/users/allusers`,
            { branchId: selectedBranch, companyId: selectedCompany ,type:"group",...(groupId ? {groupId}:{})},
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
          if (Cookies.get('usercompanyandbranch')) {
           
             let data= JSON.parse(Cookies.get('usercompanyandbranch'))
             console.log(data,"444444444@@@@@@@@@@@@@@@@@@@@@@@@@@")
           
              setSelectedCompany(data.company._id)
            setSelectedBranch(data.branch._id)
          }
        }, [Cookies.get('usercompanyandbranch')])
                  // console.log(router.query.branchId,"===========++++++++++++",selectedBranch)

        useEffect(() => {
          if (selectedBranch) {
            // fetchDepartments(selectedBranch);
            fetchStaff();
            fetchgroupcount()
            setNewStaff(prev => ({ ...prev, branchId: selectedBranch }));
          }
        }, [selectedBranch,])



        // State for tracking the newly selected group
const [selectedGroupId, setSelectedGroupId] = useState(null);

const handleAssignGroup = (groupId) => {
  // Toggle selection - if clicking the same group, deselect it
  setSelectedGroupId(selectedGroupId === groupId ? null : groupId);
};

// Determine if a group should be checked
const isChecked = (groupId) => {
  // If a new selection exists, use that
  if (selectedGroupId !== null) {
    return selectedGroupId === groupId;
  }
  // Otherwise use the user's current group
  return currentUser?.groupId === groupId;
};


const [selectedGroupId2, setSelectedGroupId2] = useState('all'); // default to 'all'

const handleGroupSelect = (id) => {
  setSelectedGroupId2(id);
};


const listHeight = 400;
  return (
    <Layout> 
      <Box >
    <Box>
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
    <Box>
      <Typography variant="h5" component="h3" gutterBottom>
        Manage Groups
      </Typography>
      <Typography variant="body2" color="text.secondary">
        List of groups that you can manage / edit.
      </Typography>
    </Box>
    
    <Button 
      variant="contained" 
      color="primary" 
      startIcon={<AddIcon />}
      sx={{ display: { xs: 'none', sm: 'flex' } }}
      onClick={() => setOpenCreateGroup(true)}
    >
      New Group
    </Button>
    <IconButton 
      color="primary" 
      sx={{ display: { xs: 'flex', sm: 'none' } }}
      onClick={() => setOpenCreateGroup(true)}
    >
      <AddIcon />
    </IconButton>
  </Box>

  {/* Dropdowns container */}
  {/* <Box sx={{ 
    display: 'flex', 
    gap: 2, 
    mb: 3,
    flexDirection: { xs: 'column', sm: 'row' } // Stack vertically on mobile, horizontal on desktop
  }}> */}
    {/* <FormControl fullWidth sx={{ minWidth: 200 }}>
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
    </FormControl> */}

    {/* Branch Selection - Only show if company is selected */}
    {/* {selectedCompany && (
      <FormControl fullWidth sx={{ minWidth: 200 }}>
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
    )}
  </Box> */}
</Box>

        {/* Create Group Modal */}
        <Modal
          open={openCreateGroup}
          onClose={() => setOpenCreateGroup(false)}
          aria-labelledby="create-group-modal"
          aria-describedby="create-group-modal-description"
        >
          <Box sx={style}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography id="create-group-modal" variant="h6" component="h2">
                Create New Group
              </Typography>
              <IconButton onClick={() => setOpenCreateGroup(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <form onSubmit={createGroupForm.handleSubmit}>
              <TextField
                fullWidth
                margin="normal"
                id="name"
                name="name"
                label="Group Name"
                value={createGroupForm.values.name}
                onChange={createGroupForm.handleChange}
                error={createGroupForm.touched.name && Boolean(createGroupForm.errors.name)}
                helperText={createGroupForm.touched.name && createGroupForm.errors.name}
              />
              
              <FormControl fullWidth margin="normal" error={createGroupForm.touched.color && Boolean(createGroupForm.errors.color)}>
                <InputLabel id="color-label">Color</InputLabel>
                <Select
                  labelId="color-label"
                  id="color"
                  name="color"
                  value={createGroupForm.values.color}
                  label="Color"
                  onChange={createGroupForm.handleChange}
                >
                  {colorOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ 
                          width: 20, 
                          height: 20, 
                          backgroundColor: option.color, 
                          mr: 1,
                          borderRadius: '50%'
                        }} />
                        {option.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {createGroupForm.touched.color && createGroupForm.errors.color && (
                  <FormHelperText>{createGroupForm.errors.color}</FormHelperText>
                )}
              </FormControl>
<LocalizationProvider dateAdapter={AdapterDateFns}>
  <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
    Shift Timing
  </Typography>
  
  <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <TimePicker
        label="Start Time"
        value={createGroupForm.values.startTime}
        onChange={(newValue) => createGroupForm.setFieldValue('startTime', newValue)}
        onBlur={() => createGroupForm.setFieldTouched('startTime', true)}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            error={createGroupForm.touched.startTime && Boolean(createGroupForm.errors.startTime)}
          />
        )}
      />
      {createGroupForm.touched.startTime && createGroupForm.errors.startTime && (
        <FormHelperText error sx={{ ml: 1.5 }}>
          {createGroupForm.errors.startTime}
        </FormHelperText>
      )}
    </Box>

    <Box sx={{ flex: 1, minWidth: 0 }}>
      <TimePicker
        label="End Time"
        value={createGroupForm.values.endTime}
        onChange={(newValue) => createGroupForm.setFieldValue('endTime', newValue)}
        onBlur={() => createGroupForm.setFieldTouched('endTime', true)}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            error={createGroupForm.touched.endTime && Boolean(createGroupForm.errors.endTime)}
          />
        )}
      />
      {createGroupForm.touched.endTime && createGroupForm.errors.endTime && (
        <FormHelperText error sx={{ ml: 1.5 }}>
          {createGroupForm.errors.endTime}
        </FormHelperText>
      )}
    </Box>
  </Box>
</LocalizationProvider>




              <TextField
                fullWidth
                margin="normal"
                id="description"
                name="description"
                label="Description"
                multiline
                rows={4}
                value={createGroupForm.values.description}
                onChange={createGroupForm.handleChange}
                error={createGroupForm.touched.description && Boolean(createGroupForm.errors.description)}
                helperText={createGroupForm.touched.description && createGroupForm.errors.description}
              />
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button onClick={() => setOpenCreateGroup(false)}>Cancel</Button>
                <Button type="submit" variant="contained">Create</Button>
              </Box>
            </form>
          </Box>
        </Modal>



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

        {/* Edit Group Modal */}
        <Modal
          open={openEditGroup}
          onClose={() => setOpenEditGroup(false)}
          aria-labelledby="edit-group-modal"
          aria-describedby="edit-group-modal-description"
        >
          <Box sx={style}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography id="edit-group-modal" variant="h6" component="h2">
                Edit Group
              </Typography>
              <IconButton onClick={() => setOpenEditGroup(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <form onSubmit={editGroupForm.handleSubmit}>
              <TextField
                fullWidth
                margin="normal"
                id="name"
                name="name"
                label="Group Name"
                value={editGroupForm.values.name}
                onChange={editGroupForm.handleChange}
                error={editGroupForm.touched.name && Boolean(editGroupForm.errors.name)}
                helperText={editGroupForm.touched.name && editGroupForm.errors.name}
              />
              
              <FormControl fullWidth margin="normal" error={editGroupForm.touched.color && Boolean(editGroupForm.errors.color)}>
                <InputLabel id="edit-color-label">Color</InputLabel>
                <Select
                  labelId="edit-color-label"
                  id="color"
                  name="color"
                  value={editGroupForm.values.color}
                  label="Color"
                  onChange={editGroupForm.handleChange}
                >
                  {colorOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ 
                          width: 20, 
                          height: 20, 
                          backgroundColor: option.color, 
                          mr: 1,
                          borderRadius: '50%'
                        }} />
                        {option.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {editGroupForm.touched.color && editGroupForm.errors.color && (
                  <FormHelperText>{editGroupForm.errors.color}</FormHelperText>
                )}
              </FormControl>
<LocalizationProvider dateAdapter={AdapterDateFns}>
  <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
    Shift Timing
  </Typography>
  
  <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
    {/* Start Time */}
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <TimePicker
        label="Start Time"
        value={editGroupForm.values.startTime ? new Date(editGroupForm.values.startTime) : null}
        onChange={(newValue) => {
          editGroupForm.setFieldValue('startTime', newValue);
        }}
        onBlur={() => editGroupForm.setFieldTouched('startTime', true)}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            error={editGroupForm.touched.startTime && Boolean(editGroupForm.errors.startTime)}
          />
        )}
      />
      {editGroupForm.touched.startTime && editGroupForm.errors.startTime && (
        <FormHelperText error sx={{ ml: 1.5 }}>
          {editGroupForm.errors.startTime}
        </FormHelperText>
      )}
    </Box>

    {/* End Time */}
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <TimePicker
        label="End Time"
        value={editGroupForm.values.endTime ? new Date(editGroupForm.values.endTime) : null}
        onChange={(newValue) => {
          editGroupForm.setFieldValue('endTime', newValue);
        }}
        onBlur={() => editGroupForm.setFieldTouched('endTime', true)}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            error={editGroupForm.touched.endTime && Boolean(editGroupForm.errors.endTime)}
          />
        )}
      />
      {editGroupForm.touched.endTime && editGroupForm.errors.endTime && (
        <FormHelperText error sx={{ ml: 1.5 }}>
          {editGroupForm.errors.endTime}
        </FormHelperText>
      )}
    </Box>
  </Box>
</LocalizationProvider>

              
              <TextField
                fullWidth
                margin="normal"
                id="description"
                name="description"
                label="Description"
                multiline
                rows={4}
                value={editGroupForm.values.description}
                onChange={editGroupForm.handleChange}
                error={editGroupForm.touched.description && Boolean(editGroupForm.errors.description)}
                helperText={editGroupForm.touched.description && editGroupForm.errors.description}
              />
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button onClick={() => setOpenEditGroup(false)}>Cancel</Button>
                <Button onClick={editGroupForm.handleSubmit} variant="contained">Save Changes</Button>
              </Box>
            </form>
          </Box>
        </Modal>

        {/* Assign Group Modal (Single User) */}
<Dialog 
  open={openAssignGroup} 
  onClose={() => {
    setOpenAssignGroup(false);
    setSelectedGroupId(null); // Reset selection when closing
  }}
  maxWidth="md"
  fullWidth
>
  <DialogTitle>Assign Groups</DialogTitle>
  <DialogContent>
    <Typography variant="body1" gutterBottom>
      Select a group to assign to this user (only one group can be selected):
    </Typography>
    <Grid container spacing={2} sx={{ mt: 2 }}>
      {groups.filter(g => g.id !== 'all').map((group) => (
        <Grid item xs={12} sm={6} md={4} key={group._id}>
          <Paper 
            sx={{ 
              p: 1, 
              display: 'flex', 
              alignItems: 'center',
              cursor: 'pointer',
              border: isChecked(group._id) ? `2px solid ${getColor(group.color)}` : '1px solid rgba(0, 0, 0, 0.12)',
              '&:hover': {
                borderColor: getColor(group.color)
              }
            }}
            onClick={() => handleAssignGroup(group._id)}
          >
            <Checkbox
              checked={isChecked(group._id)}
              onChange={() => handleAssignGroup(group._id)}
              sx={{ mr: 1 }}
            />
            <Box sx={{ 
              width: 10, 
              height: 10, 
              backgroundColor: getColor(group.color), 
              mr: 1,
              borderRadius: '50%'
            }} />
            <Typography>{group.name}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => {
      setOpenAssignGroup(false);
      setSelectedGroupId(null);
    }}>
      Cancel
    </Button>
    <Button 
      onClick={handleAssignGroupSubmit} 
      variant="contained"
      disabled={selectedGroupId === null && currentUser?.groupId === null}
    >
      Assign
    </Button>
  </DialogActions>
</Dialog>

        {/* Bulk Assign Group Modal */} 
        <Dialog 
          open={openBulkAssignGroup} 
          onClose={() => setOpenBulkAssignGroup(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Assign Group to Selected Users</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Select a group to assign to {selectedUsers.length} users (only one group can be selected):
            </Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {groups.filter(g => g.id !== 'all').map((group) => (
                <Grid item xs={12} sm={6} md={4} key={group.id}>
                  <Paper 
                    sx={{ 
                      p: 1, 
                      display: 'flex', 
                      alignItems: 'center',
                      cursor: 'pointer',
                      border: '1px solid rgba(0, 0, 0, 0.12)',
                      '&:hover': {
                        borderColor: getColor(group.color)
                      }
                    }}
                  
                  >
                    <Checkbox
                      defaultChecked={false}
              onChange={() => handleAssignGroup(group._id)}
                      sx={{ mr: 1 }}
                    />
                    <Box sx={{ 
                      width: 10, 
                      height: 10, 
                      backgroundColor: getColor(group.color), 
                      mr: 1,
                      borderRadius: '50%'
                    }} />
                    <Typography>{group.name}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenBulkAssignGroup(false)}>Cancel</Button>
          <Button  onClick={() => handleBulkAssignGroup()}>Assign</Button>
             
          </DialogActions>
        </Dialog>

        <Card>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' } }}>
            {/* Sidebar */}
            <Box 
              sx={{ 
                width: { lg: 300 }, 
                borderRight: { lg: `1px solid ${theme.palette.divider}` },
                display: { xs: mobileSidebarOpen ? 'block' : 'none', lg: 'block' },
                position: { xs: 'absolute', lg: 'relative' },
                zIndex: { xs: 1000, lg: 'auto' },
                backgroundColor: { xs: theme.palette.background.paper, lg: 'transparent' },
                height: { xs: '100%', lg: 'auto' },
                left: { xs: 0, lg: 'auto' },
                top: { xs: 0, lg: 'auto' }
              }}
            >
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1">Manage Group</Typography>
                <Button 
                  startIcon={<AddIcon />} 
                  size="small" 
                  sx={{ display: { xs: 'none', sm: 'flex' } }}
                  onClick={() => setOpenCreateGroup(true)}
                >
                  Add
                </Button>
                <IconButton 
                  size="small" 
                  sx={{ display: { xs: 'flex', sm: 'none' } }}
                  onClick={() => setOpenCreateGroup(true)}
                >
                  <AddIcon />
                </IconButton>
              </Box>
          <List>
<ListItem
  button
 selected={selectedGroupId2 === 'all'}
    onClick={() =>{fetchStaff();handleGroupSelect('all')} }
sx={{
  backgroundColor: selectedGroupId2 === 'all' ? '#ecfdf5' : 'transparent',
  color: selectedGroupId2 === 'all' ? '#0f172a' : 'inherit',
  '&:hover': {
    backgroundColor: selectedGroupId2 === 'all' ? '#dbeafe' : '#f5f5f5',
  },
  display: 'flex',
  alignItems: 'center',
}}

>
  <ListItemIcon>
    <PeopleIcon /> {/* You can use: import PeopleIcon from '@mui/icons-material/People'; */}
  </ListItemIcon>

  <ListItemText primary="All Users" />

  {/* <Box sx={{ mx: 2, alignSelf: 'center' }}>
    <Badge
      badgeContent={6865} // Or dynamically: totalUsersCount
      sx={{
        '& .MuiBadge-badge': {
          backgroundColor: '#007bff', // Match the blue badge from your image
          color: '#fff',
          minWidth: 24,
          height: 20,
          fontSize: '0.75rem',
          borderRadius: '12px',
          padding: '0 6px',
        },
      }}
    />
  </Box> */}
</ListItem>

  {groups.map((group) => (
    <ListItem 
      key={group.id} 
      button 
      selected={selectedGroupId2 === group._id}
       onClick={() =>{fetchStaff(group._id); handleGroupSelect(group._id)} }

      sx={{ 
        // '&.Mui-selected': { backgroundColor: theme.palette.action.selected },
        // '&.Mui-selected:hover': { backgroundColor: theme.palette.action.selected },
          backgroundColor: selectedGroupId2 === group._id ? '#ecfdf5' : 'transparent',
  color: selectedGroupId2 === group._id ?  '#0f172a' : 'inherit',
  '&:hover': {
    backgroundColor: selectedGroupId2 === 'all' ? '#dbeafe' : '#f5f5f5',
  },
        display: 'flex', 
        alignItems: 'center'
      }}
    >
      <ListItemIcon>
        {group.icon ? (
          group.icon
        ) : (
          <Avatar sx={{ 
            bgcolor: getColor(group.color), 
            width: 24, 
            height: 24,
            fontSize: '0.75rem'
          }}>
            {group.name.substring(0, 2)}
          </Avatar>
        )}
      </ListItemIcon>

      <ListItemText primary={group.name} />

      {/* Badge aligned properly using Box */}
      <Box sx={{ mx: 2, alignSelf: 'center' }}>
        <Badge 
          badgeContent={group.userscount} 
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: '#ecfdf5',
              color: '#000',
              minWidth: 18,
              height: 18,
              fontSize: '0.7rem',
            }
          }} 
        />
      </Box>

      {group.id !== 'all' && (
        <>
          <IconButton size="small" onClick={(e) => handleMenuClickgroup(e, group)}>
            <MoreVertIcon fontSize="small" />
          </IconButton>

          <Menu
            anchorEl={anchorElgroup}
            open={Boolean(anchorElgroup)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            <MenuItem onClick={() => { handleMenuClose(); handleOpenEditGroup(group); }}>
              <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
              Edit Group
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); handleDeleteGroup(group._id); }}>
              <ListItemIcon><DeleteIcon fontSize="small" /></ListItemIcon>
              Delete Group
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon><MailIcon fontSize="small" /></ListItemIcon>
              Send Email to All
            </MenuItem>
          </Menu>
        </>
      )}
    </ListItem>
  ))}
</List>
            </Box>

            {/* Main Content */}
            <Box sx={{ flex: 1 }}>
              {/* Toolbar */}
              <Box sx={{ 
                p: 2, 
                borderBottom: `1px solid ${theme.palette.divider}`,
                position: 'relative'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {isMobile && (
                    <IconButton onClick={toggleMobileSidebar} sx={{ mr: 1 }}>
                      <ArrowBackIcon />
                    </IconButton>
                  )}
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Bulk Action</InputLabel>
                        <Select
                          value={bulkAction}
                          onChange={(e) => setBulkAction(e.target.value)}
                          label="Bulk Action"
                        >
                          <MenuItem value="">
                            <em>Bulk Action</em>
                          </MenuItem>
                          <MenuItem value="assignGroup">Assign to Group</MenuItem>
                          <MenuItem value="sendEmail">Send Email</MenuItem>
                        </Select>
                      </FormControl>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        disabled={selectedUsers.length === 0 || !bulkAction}
                        sx={{ display: { xs: 'none', sm: 'flex' } }}
                        onClick={handleOpenBulkAssignGroup}
                      >
                        Apply
                      </Button>
                      <IconButton 
                        size="small" 
                        disabled={selectedUsers.length === 0 || !bulkAction}
                        sx={{ display: { xs: 'flex', sm: 'none' } }}
                        onClick={handleOpenBulkAssignGroup}
                      >
                        <ArrowForwardIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton onClick={toggleSearch}>
                      <SearchIcon />
                    </IconButton>
                    <IconButton onClick={handleMenuClickSetting}>
                      <SettingsIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorElSetting}
                      open={Boolean(anchorElSetting)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem>
                        <Typography variant="subtitle2">Show</Typography>
                      </MenuItem>
                      <MenuItem>10</MenuItem>
                      <MenuItem selected>20</MenuItem>
                      <MenuItem>50</MenuItem>
                      <Divider />
                      <MenuItem>
                        <Typography variant="subtitle2">Order</Typography>
                      </MenuItem>
                      <MenuItem>ASC</MenuItem>
                      <MenuItem selected>DESC</MenuItem>
                      <Divider />
                      <MenuItem>
                        <Typography variant="subtitle2">Density</Typography>
                      </MenuItem>
                      <MenuItem>Regular</MenuItem>
                      <MenuItem selected>Compact</MenuItem>
                    </Menu>
                  </Box>
                </Box>
                
                {/* Search */}
                {searchOpen && (
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    backgroundColor: theme.palette.background.paper,
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    zIndex: 1
                  }}>
                    <IconButton onClick={toggleSearch} sx={{ mr: 1 }}>
                      <ArrowBackIcon />
                    </IconButton>
                    <TextField
                      fullWidth
                      placeholder="Search by user or email"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                )}
              </Box>
              
              {/* User List */}
            <Box>
      <Paper sx={{ mb: 2, minHeight: listHeight + 100 }}> {/* Additional space for header */}
        {/* List Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          p: 2, 
          borderBottom: `1px solid ${theme.palette.divider}` 
        }}>
          <Checkbox
            checked={selectedUsers.length === users.length}
            indeterminate={selectedUsers.length > 0 && selectedUsers.length < users.length}
            onChange={handleSelectAll}
          />
          <Typography variant="subtitle2" sx={{ flex: 1 }}>User</Typography>
          <Typography variant="subtitle2" sx={{ width: 150, display: { xs: 'none', sm: 'block' } }}>
            Groups
          </Typography>
          <Typography variant="subtitle2" sx={{ width: 100 }}>Status</Typography>
          <Box sx={{ width: 50 }}></Box>
        </Box>
        
        {/* List Content */}
        <List sx={{ minHeight: listHeight }}>
                  {console.log(staff,"selectedStaffView##########")}

          {staff?.length > 0 ? (
            staff.map((user, i) => {
              const userGroup = getUserGroup(user._id);
              return (
                <ListItem 
                  key={i} 
                  sx={{ 
                    '&:hover': { backgroundColor: theme.palette.action.hover },
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    py: 1
                  }}
                >
                  <Checkbox
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => handleUserSelect(user._id)}
                  />
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <Avatar sx={{ 
                      bgcolor: getColor(user.color), 
                      width: 36, 
                      height: 36,
                      mr: 2
                    }}>
                      {user.firstName.slice(0,2)}
                    </Avatar>
                    <Typography>{user.firstName + " " + user.lastName}</Typography>
                  </Box>
                  
                  <Box sx={{ width: 150, display: { xs: 'none', sm: 'block' } }}>
                    {user?.groupName && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ 
                          width: 12, 
                          height: 12, 
                          backgroundColor: getColor(user?.groupColor), 
                          mr: 1,
                          borderRadius: '50%'
                        }} />
                        <Typography variant="body2">{user?.groupName}</Typography>
                      </Box>
                    )}
                  </Box>
                  
                  <Box sx={{ width: 100 }}>
                    <Box 
                      sx={{
                        display: 'inline-block',
                        padding: '2px 4px',
                        fontSize: "0.625rem",
                        borderRadius: '2px',
                        backgroundColor: user.status === 'active' ? '#e6f7ee' : '#ffebee',
                        color: user.status === 'active' ? '#00a65a' : '#f44336'
                      }}
                    >
                      {user.active_status === 'Active' ? 'Active' : 'Inactive'}
                    </Box>
                  </Box>
                  
                  <Box sx={{ width: 50, display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton size="small" sx={{ mr: 1, display: { xs: 'none', sm: 'flex' } }}>
                      <MailIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={(e) => handleMenuClick(e, user)}>
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                    
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                      PaperProps={{
                        sx: {
                          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.05)',
                        },
                      }}
                    >
                      {/* {user.status === 'Active' && ( */}
                        <MenuItem  onClick={() =>{ handleViewClick(user);handleMenuClose()}}>
                          <ListItemIcon>
                            <PersonIcon fontSize="small" />
                          </ListItemIcon>
                          View Details
                        </MenuItem>
                      {/* )} */}
                      <MenuItem onClick={handleMenuClose}>
                        <ListItemIcon>
                          <MailIcon fontSize="small" />
                        </ListItemIcon>
                        Send an Email
                      </MenuItem>
                      <Divider />
                      <MenuItem
                        onClick={() => {
                          handleMenuClose();
                          handleOpenAssignGroup(user._id, user);
                        }}
                      >
                        <ListItemIcon>
                          <LabelIcon fontSize="small" />
                        </ListItemIcon>
                       {currentUser?.groupName ? "Update Group" : "Assign Group"}
                      </MenuItem>
                    </Menu>
                  </Box>
                </ListItem>
              );
            })
          ) : (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: listHeight, 
              color: theme.palette.text.secondary
            }}>
              <Typography variant="body1">No users found</Typography>
            </Box>
          )}
        </List>
      </Paper>
      

        {/* View Staff Modal */}
        <ViewStaffModalwithgroup
          staff={currentUser}
          open={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
        />

      {/* Pagination */}
{staff?.length > 0 && (
  <Box 
    sx={{
      '& .pagination': {
        display: 'flex',
        justifyContent: 'center',
        listStyle: 'none',
        padding: 0,
        '& li': {
          margin: '0 4px',
          '& a': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '32px',
            height: '32px',
            padding: '0 8px',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '4px',
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            color: theme.palette.text.primary,
            fontSize: theme.typography.body2.fontSize,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            }
          },
          '&.selected a': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            borderColor: theme.palette.primary.main,
            fontWeight: 500,
            fontSize: theme.typography.fontSize,
          },
          '&.disabled a': {
            opacity: 0.5,
            cursor: 'not-allowed',
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: 'transparent',
            }
          },
          '&.previous a, &.next a': {
            padding: '0 12px',
            minWidth: '80px',
          },
          '&.break a': {
            cursor: 'default',
            '&:hover': {
              backgroundColor: 'transparent',
            }
          }
        }
      }
    }}
  >
    <ReactPaginate
      previousLabel={'Previous'}
      nextLabel={'Next'}
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
      breakClassName={'break'}
      previousDisabledClassName={'disabled'}
      nextDisabledClassName={'disabled'}
      pageClassName={'page-item'}
      pageLinkClassName={'page-link'}
      previousLinkClassName={'page-link'}
      nextLinkClassName={'page-link'}
    />
  </Box>
)}
    </Box>
            </Box>
          </Box>
        </Card>
      </Box>
    </Layout>
  );
};

export default GroupManagement;