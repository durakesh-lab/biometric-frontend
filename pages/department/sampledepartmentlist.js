// import React, { useState, useEffect, useRef, useMemo } from 'react';
// import { 
//   Table, 
//   TableBody, 
//   TableCell, 
//   TableContainer, 
//   TableHead, 
//   TableRow, 
//   Paper, 
//   TextField,
//   Grid,
//   InputAdornment,
//   Chip,
//   Checkbox,
//   IconButton,
//   Button,
//   Menu,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Box,
//   Typography,
//   Tooltip,
//   Divider,
//   Modal,
//   Backdrop,
//   CircularProgress,
//   Skeleton
// } from '@mui/material';
// import { 
//   Search as SearchIcon,
//   FilterList as FilterIcon,
//   ArrowDownward as ArrowDownIcon,
//   ArrowUpward as ArrowUpIcon,
//   Delete as DeleteIcon,
//   Visibility as ViewIcon,
//   MoreVert as MoreVertIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import { useDispatch, useSelector } from 'react-redux';
// import { confirnDeleteAction, editDepartmentAction, editEmployeeAction, getDepartmentList } from '@/store/authSlice';
// import Layout from '../../components/Layout/Layout';
// import SuccessSnackbar from '../../components/successpopup/successpopup';
// import MyComponent from '../../components/deletepopup';
// import ViewEmployeeModal from '../../components/Dashboard/viewEmployee';
// import { Formik, Form } from "formik";
// import * as Yup from "yup";
// import ViewDepartmentModal from '../../components/Dashboard/viewDepartment';

// const DepartmentListPage = () => {
//   // State for table data and UI
//   const [employees, setEmployees] = useState([]);
//   let [loading, setLoading] = useState(true);
//   const [selected, setSelected] = useState([]);
//   const [showDelete, setShowDelete] = useState(false);
//   const [open, setOpen] = useState(false);
//   const dispatch = useDispatch();
//   const deletepopup = useSelector((state) => state.auth);
//   const {getDepartmentListData:getPositionListData } = useSelector(state => state.auth);

//   // Pagination state
//   const [pagination, setPagination] = useState({
//     page: 1,
//     page_size: 10,
//     total_pages: 1,
//     count: 0
//   });

//   // Sorting state
//   const [sorting, setSorting] = useState({
//     field: 'id',
//     direction: 'desc'
//   });

//   // Search state
//   const [search, setSearch] = useState('');

//   // Filter modal state
//   const [filterOpen, setFilterOpen] = useState(false);
//   const [filters, setFilters] = useState({
//     dept_code: '',
//     dept_name: '',
//     parent_dept: '',
//     dept_name_icontains: '',
//     parent_dept_icontains: '',
//     ordering: ""
//   });

//   // Dropdown options
//   const [dropdownOptions, setDropdownOptions] = useState({
//     departments: [{name: "Department", id: 1}],
//     positions: [{name: "Position", id: 1}],
//     areas: [{name: "Area", id: 1}],
//     app_role: [{name: "employee", id: 1}, {name: "administrator", id: 2}],
//     app_status: [{name: "Enable", id: 1}, {name: "Disable", id: 0}],
//     ordering: [
//       { id: 'dept_code', label: 'Department code', sortable: true },
//       { id: 'dept_name', label: 'department Name', sortable: true },
//       { id: 'parent_dept', label: 'parent department', sortable: true },
//       { id: 'department', label: 'Department', sortable: true },
//       { id: 'position', label: 'Position', sortable: true },
//       { id: 'mobile', label: 'Mobile', sortable: true },
//       { id: 'email', label: 'Email', sortable: true },
//       { id: 'parent_dept_name', label: 'Parent Department Name', sortable: true },
//       { id: 'dev_privilege', label: 'Privilege', sortable: true },
//       { id: 'enable_att', label: 'Attendance', sortable: true },
//       { id: 'app_status', label: 'App Status', sortable: true },
//       { id: '1', label: 'area', sortable: true },
//       { id: 'app_role', label: 'app role', sortable: true },
//     ]
//   });

//   // Menu state for actions
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const openMenu = Boolean(anchorEl);

//   // Edit modal state
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [currentEmployee, setCurrentEmployee] = useState({});

//   // View modal state
//   const [viewModalOpen, setViewModalOpen] = useState(false);
//   const [selectedEmployeeView, setSelectedEmployeeView] = useState({});

//   // Columns configuration
//   const columns = [
//     { id: 'checkbox', label: '', sortable: false },
//     { id: 'srNo', label: 'SN.', sortable: false },
//     { id: 'dept_code', label: 'Department Code', sortable: true },
//     { id: 'dept_name', label: 'Department Name', sortable: true },
//     { id: 'parent_dept', label: 'parent department code', sortable: true },

//     { id: 'parent_dept_name', label: 'Parent Department Name', sortable: true },
//     { id: 'view', label: 'View', sortable: false },
//     { id: 'actions', label: 'Actions', sortable: false }
//   ];

//   // Fetch employees data
//   const fetchEmployees = async () => {
//     try {
//       setLoading(true);
      
//       // Construct query params
//       const params = {
//         page: pagination.page,
//         page_size: pagination.page_size,
//         search: search,
//         ordering: sorting.direction === 'desc' ? `-${sorting.field}` : sorting.field,
//         ...filters
//       };

//       // Remove empty filters
//       Object.keys(params).forEach(key => {
//         if (params[key] === '' || params[key] === null) {
//           delete params[key];
//         }
//       });

//       let token = localStorage.getItem("token");
//       console.log(params,{params})
//       const response = await axios.get(
//         `http://localhost:7000/department/getdepartmentList`, {
//           headers: { Authorization: token },
//           params
//         }
//       );
//       setEmployees(response.data.data);
//       setPagination({
//         ...pagination,
//         total_pages: Math.ceil(response.data.count / pagination.page_size),
//         count: response.data.count
//       });
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching employees:', error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEmployees();
//   }, [pagination.page, pagination.page_size, sorting, search, filters,deletepopup.editDepartmentData]);

//   // Handle select all
//   const handleSelectAll = (event) => {
//     if (event.target.checked) {
//       setSelected(employees.map(emp => emp.id));
//       setShowDelete(true);
//     } else {
//       setSelected([]);
//       setShowDelete(false);
//     }
//   };

//   // Handle single select
//   const handleSelect = (event, id) => {
//     const selectedIndex = selected.indexOf(id);
//     let newSelected = [];

//     if (selectedIndex === -1) {
//       newSelected = newSelected.concat(selected, id);
//     } else if (selectedIndex === 0) {
//       newSelected = newSelected.concat(selected.slice(1));
//     } else if (selectedIndex === selected.length - 1) {
//       newSelected = newSelected.concat(selected.slice(0, -1));
//     } else if (selectedIndex > 0) {
//       newSelected = newSelected.concat(
//         selected.slice(0, selectedIndex),
//         selected.slice(selectedIndex + 1),
//       );
//     }

//     setSelected(newSelected);
//     setShowDelete(newSelected.length > 0);
//   };

//   // Handle sort
//   const handleSort = (field) => {
//     const isAsc = sorting.field === field && sorting.direction === 'asc';
//     setSorting({
//       field: field,
//       direction: isAsc ? 'desc' : 'asc'
//     });
//   };

//   // Handle page change
//   const handlePageChange = (newPage) => {
//     setPagination({ ...pagination, page: newPage });
//   };

//   // Handle page size change
//   const handlePageSizeChange = (event) => {
//     setPagination({ ...pagination, page_size: event.target.value, page: 1 });
//   };

//   // Handle filter change
//   const handleFilterChange = (name, value) => {
//     setFilters({
//       ...filters,
//       [name]: value
//     });
//   };

//   // Apply filters
//   const applyFilters = () => {
//     setFilterOpen(false);
//     setPagination({ ...pagination, page: 1 });
//     fetchEmployees();
//   };

//   // Reset filters
//   const resetFilters = () => {
//     setFilters({
//         dept_code: '',
//       dept_name: '',
//       parent_dept: '',
//       department: '',
//       app_status: '',
//       emp_code_icontains: '',
//       departments: '',
//       dept_name_icontains: '',
//       parent_dept_icontains: '',
//       areas: '',
//       positions: '',
//       search: "",
//       ordering: ""
//     });
//   };

//   // Handle menu click
//   const handleMenuClick = (event, employee) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedEmployee({...employee,parent_dept:employee.parent_dept.id});
//   };

//   // Handle menu close
//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   // Handle delete confirmation
//   const handleConfirmDelete = (id) => {
//     dispatch(confirnDeleteAction("sure"));
//     sessionStorage.setItem("deleteIds", JSON.stringify(id));
//   };

//   // Handle delete
//   const handleDelete = async (id) => {
//     id = JSON.parse(sessionStorage.getItem("deleteIds"));
//     try {
//       let token = localStorage.getItem("token");

//       let data = { object_ids: Array.isArray(id) ? id : [id], action_type: "delete" };
//       await axios.post(`http://localhost:7000/department/actiondepartment`, {id}, {
//         headers: { Authorization: token }
//       });
//       setSelected([]);
//       setShowDelete(false);
//       dispatch(confirnDeleteAction(false));
//       setOpen("deletedepartment");
//       fetchEmployees();
//     } catch (error) {
//       console.error('Error deleting employees:', error);
//     }
//     handleMenuClose();
//   };

//   useEffect(() => {
//     if (deletepopup?.confirnDelete === true) {
//       handleDelete();
//     }
//   }, [deletepopup?.confirnDelete]);

//   // Format boolean values
//   const formatBoolean = (value) => {
//     return value ? "Yes" : "No";
//   };

//   // Format privilege levels
//   const formatPrivilege = (value) => {
//     const privileges = {
//       0: "Employee",
//       2: "Register",
//       6: "System Admin",
//       14: "Super Admin"
//     };
//     return privileges[value] || value;
//   };

//   // Format app status
//   const formatAppStatus = (value) => {
//     return value === 1 ? "Enabled" : "Disabled";
//   };

//   // Get serial number
//   const getSerialNumber = (index) => {
//     return (pagination.page - 1) * pagination.page_size + index + 1;
//   };

//   // Edit section
//   const departments = [
//     { label: "HR", value: 1 },
//     { label: "Sales", value: 2 },
//     { label: "Engineering", value: 3 }
//   ];

//   let positions = [
//     // { label: "Manager", value: 1 },
//     // { label: "Developer", value: 2 },
//     // { label: "Analyst", value: 3 }
//   ];

//   const genders = [ { label: "Male", value: "M" }, { label: "Female", value: "F" }];

//   const verificationModes = [
//     { label: "Any", value: 0 },
//     { label: "Fingerprint", value: 1 },
//     { label: "Card", value: 2 },
//     { label: "PIN", value: 3 }
//   ];

//   const employmentTypes = [
//     { label: "Permanent", value: 1 },
//     { label: "Temporary", value: 2 }
//   ];

//   const devicePrivileges = [
//     { label: "Employee", value: 0 },
//     { label: "Register", value: 2 },
//     { label: "System Administrator", value: 6 },
//     { label: "Super Administrator", value: 14 }
//   ];

//   const enableOptions = [
//     { label: "No", value: "False" },
//     { label: "Yes", value: "True" }
//   ];

//   const appRoles = [
//     { label: "Employee", value: 1 },
//     { label: "Administrator", value: 2 }
//   ];

//   const appStatuses = [
//     { label: "Enable", value: 1 },
//     { label: "Disable", value: 0 }
//   ];

//   const { editEmployeeData } = useSelector(state => state.auth);

//   useEffect(() => {
//     if (editEmployeeData) {
//       setOpen("editdepartment");
//     }
//   }, [editEmployeeData]);

//   const handleEdit = () => {
//     if (selectedEmployee) {
//       setCurrentEmployee(selectedEmployee);
//       setEditModalOpen(true);
//     }
//     handleMenuClose();
//   };

//   const handleEditSubmit = async (values) => {
//     try {
//       dispatch(editDepartmentAction(values));
//       setEditModalOpen(false);
//     } catch (error) {
//       console.error('Error updating employee:', error);
//     }
//   };

//   const initialValues = {
//     ...currentEmployee,
//     department: currentEmployee?.department?.id,
//     position: currentEmployee?.position?.id,
//     enable_att: currentEmployee.enable_att == true ? "True" : "False",
//     enable_overtime: currentEmployee.enable_overtime == true ? "True" : "False",
//     enable_holiday: currentEmployee.enable_holiday == true ? "True" : "False",
//     area: currentEmployee.area?.length && currentEmployee?.area[0].id,
//   };

//   const validationSchema = Yup.object({
//     dept_code: Yup.string().required("Required"),
//     dept_name: Yup.string().required("Required"),
//     // department: Yup.string().required("Required"),
//     parent_dept_name: Yup.string().required("Required"),
//   });

//   // Handle view click
//   const handleViewClick = (employee) => {
//     setSelectedEmployeeView(employee);
//     setViewModalOpen(true);
//   };

//   const handleClose = (event, reason) => {
//     if (reason === 'clickaway') return;
//     setOpen(false);
//   };
// useEffect(()=>{
//   setLoading(true)
// setTimeout(() => {
//   setLoading(false)
// }, 3000);
// },[])
//   positions = useMemo(() => {
//     if (getPositionListData?.length) {
//       return getPositionListData.map((e) => {
//         return { label: e.dept_name, value: e.id }
//       })
//     }
//     else {
//       return []
//     }
//   }, [getPositionListData?.length])
//      useEffect(()=>{
//       dispatch(getDepartmentList());
//       },[])
//   return (
//     <>
//     <Layout>
//       <Grid container spacing={3}>
//         {/* Header Section */}
//         <Grid item  xs={12}>
//           <Box display="flex" justifyContent="space-between" alignItems="center" mb={0} sx={{ flexWrap: 'wrap', rowGap: 2 }}>
//             <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 600 }}>
//               Department List
//             </Typography>
            
//             <Box display="flex" alignItems="center" gap={1}>
//               {showDelete && (
//                 <Tooltip title={`Delete selected (${selected.length})`}>
//                   <IconButton
//                     color="error"
//                     onClick={() => {handleConfirmDelete(selected)}}
//                   >
//                     <DeleteIcon />
//                     <Typography variant="caption" sx={{ ml: 0.5 }}>
//                       ({selected.length})
//                     </Typography>
//                   </IconButton>
//                 </Tooltip>
//               )}
              
//               <Button
//                 startIcon={<FilterIcon sx={{ color: 'text.secondary' }} />}
//                 onClick={() => setFilterOpen(true)}
//                 sx={{ 
//                   backgroundColor: '#f5f5f5',
//                   color: 'text.secondary',
//                   '&:hover': {
//                     backgroundColor: '#e0e0e0'
//                   }
//                 }}
//               >
//                 <Typography variant="body2">Sort & Filter</Typography>
//               </Button>
              
//               <TextField
//                 variant="outlined"
//                 size="small"
//                 placeholder="Search..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <SearchIcon sx={{ color: 'text.secondary' }} />
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={{ width: 200 }}
//               />
//             </Box>
//           </Box>
//         </Grid>

//         {/* Employee Table */}
//         <Grid item xs={12}>
//           <TableContainer elevation={0} component={Paper} sx={{height: "350px"}}>
//             <Table>
//               <TableHead>
//                 <TableRow sx={{ backgroundColor: '#F3F4F6' }}>
//                   {columns.map((column) => (
//                     <TableCell 
//                       key={column.id}
//                       sx={{ 
//                         position: 'sticky',
//                         top: 0, // Keeps the header row at the top of the scrolling area
//                         backgroundColor: '#F3F4F6', // Matches the header background
//                         zIndex: 1, // Ensures the header stays above the table rows
//                         whiteSpace: 'nowrap',
//                         textAlign: column.id === 'checkbox' ? 'left' : 'center',
//                         verticalAlign: 'middle',
//                         padding: column.id === 'checkbox' ? '0 0 0 16px' : '16px',
//                       }}
//                     >
//                       {column.sortable ? (
//                         <Box 
//                           display="flex" 
//                           alignItems="center" 
//                           justifyContent="center"
//                           sx={{ cursor: 'pointer', color: 'text.secondary' }}
//                           onClick={() => handleSort(column.id)}
//                         >
//                           <Typography variant="body2" sx={{ fontWeight: 600 }}>
//                             {column.label}
//                           </Typography>
//                           {sorting.field === column.id ? (
//                             sorting.direction === 'asc' ? (
//                               <ArrowUpIcon fontSize="small" sx={{ ml: 0.5 }} />
//                             ) : (
//                               <ArrowDownIcon fontSize="small" sx={{ ml: 0.5 }} />
//                             )
//                           ) : (
//                             <ArrowDownIcon fontSize="small" sx={{ ml: 0.5, opacity: 0.4 }} />
//                           )}
//                         </Box>
//                       ) : column.id === 'checkbox' ? (
//                         <Checkbox
//                           indeterminate={selected.length > 0 && selected.length < employees.length}
//                           checked={employees.length > 0 && selected.length === employees.length}
//                           onChange={handleSelectAll}
//                           sx={{ 
//                             padding: '8px',
//                             marginLeft: '-4px'
//                           }}
//                         />
//                       ) : (
//                         <Typography variant="body2" sx={{ fontWeight: 600 }}>
//                           {column.label}
//                         </Typography>
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               </TableHead>
              
//               <TableBody>
//                 {loading ? (
//                   <TableRow>
//                     <TableCell colSpan={columns.length} align="center">
//                     <>
//                     <CircularProgress 
//           size={60} 
//           thickness={4}
//           sx={{ 
//             color: (theme) => theme.palette.primary.main,
//             position: 'absolute',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)'
//           }}
//         />
//   </>
//                     </TableCell>
//                   </TableRow>
//                 ) : employees.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={columns.length} align="center">
//                       No Department found
//                     </TableCell>
//                   </TableRow>
//                 ) : ( employees.length &&
//                   employees.map((employee, index) => {
//                     const isSelected = selected.indexOf(employee.id) !== -1;
//                     return (
//                       <>  
//                       <TableRow
//                         key={employee.id}
//                         hover
//                         selected={isSelected}
//                         sx={{
//                           '& > td': {
//                             padding: '8px 16px',
//                             height: '40px'
//                           }
//                         }}
//                       >
//                         <TableCell padding="checkbox" sx={{ paddingLeft: '16px' }}>
//                           <Checkbox
//                             checked={isSelected}
//                             onChange={(event) => handleSelect(event, employee.id)}
//                             sx={{ padding: '4px' }}
//                           />
//                         </TableCell>
                        
//                         <TableCell>{getSerialNumber(index)}</TableCell>
//                         <TableCell>{employee?.dept_code}</TableCell>
//                         <TableCell>{employee?.dept_name}</TableCell>
//                         <TableCell>{employee?.parent_dept?.dept_code}</TableCell>
                   
//                         <TableCell>
//                           {employee?.parent_dept_name ? employee.parent_dept_name : '-'}
//                         </TableCell>
//                          <TableCell>
//                                                   <IconButton 
//                                                     sx={{ color: 'text.secondary' }}
//                                                     onClick={() => handleViewClick(employee)}
//                                                   >
//                                                     <ViewIcon />
//                                                   </IconButton>
//                                                 </TableCell>
//                              <TableCell>
//                                               <IconButton
//                                                 aria-label="more"
//                                                 aria-controls="long-menu"
//                                                 aria-haspopup="true"
//                                                 onClick={(e) => handleMenuClick(e, employee)}
//                                                 sx={{ color: 'text.secondary' }}
//                                               >
//                                                 <MoreVertIcon />
//                                               </IconButton>
//                                               <Menu
//                                                 id="long-menu"
//                                                 anchorEl={anchorEl}
//                                                 keepMounted
//                                                 open={openMenu}
//                                                 onClose={handleMenuClose}
//                                                 PaperProps={{
//                                                   style: {
//                                                     width: '20ch',
//                                                     boxShadow: 'none',
//                                                   },
//                                                   elevation: 0,
//                                                 }}
//                                               >
//                                                 <MenuItem onClick={handleEdit}>Edit</MenuItem>
//                                                 <MenuItem onClick={() => handleConfirmDelete(selectedEmployee?.id)}>Delete</MenuItem>
//                                               </Menu>
//                                             </TableCell>
//                       </TableRow>
//                       </>
//                     );
//                   })
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Grid>

//         {/* Pagination */}
//         <Grid item xs={12}>
//   <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
//     {/* Rows per page dropdown aligned to the left */}
//     <Box display="flex" justifyContent="flex-start" alignItems="center">
//       <FormControl size="small" sx={{ minWidth: 120 }}>
//         <InputLabel>Rows per page</InputLabel>
//         <Select
//           value={pagination.page_size}
//           label="Rows per page"
//           onChange={handlePageSizeChange}
//           sx={{ color: 'text.secondary' }}
//         >
//           {[5, 10, 25, 50, 100].map((size) => (
//             <MenuItem key={size} value={size}>
//               {size}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>
//     </Box>

//     {/* Pagination controls explicitly centered */}
//     <Box display="flex" justifyContent="center" alignItems="center" sx={{ flex: 1 }}>
//       <Button
//         disabled={pagination.page === 1}
//         onClick={() => handlePageChange(1)} // Navigate to the first page
//         sx={{ color: 'text.secondary', mr: 2 }}
//       >
//         First Page
//       </Button>

//       <Button
//         disabled={pagination.page === 1}
//         onClick={() => handlePageChange(pagination.page - 1)}
//         sx={{ color: 'text.secondary', mr: 2 }}
//       >
//         Previous
//       </Button>

//       <Typography variant="body2" sx={{ color: 'text.secondary', mx: 2 }}>
//         Page {pagination.page} of {pagination.total_pages}
//       </Typography>

//       <Button
//         disabled={pagination.page === pagination.total_pages}
//         onClick={() => handlePageChange(pagination.page + 1)}
//         sx={{ color: 'text.secondary', mr: 2 }}
//       >
//         Next
//       </Button>

//       <Button
//         disabled={pagination.page === pagination.total_pages}
//         onClick={() => handlePageChange(pagination.total_pages)} // Navigate to the last page
//         sx={{ color: 'text.secondary' }}
//       >
//         Last Page
//       </Button>
//     </Box>
//   </Box>
// </Grid>




//       </Grid>

//       {/* Filter Modal */}
//       <Dialog open={filterOpen} onClose={() => setFilterOpen(false)} maxWidth="md" fullWidth>
//         <DialogTitle>Sort & Filter</DialogTitle>
        
//         <DialogContent dividers>
//           <Grid container spacing={3}>
//             <Grid item xs={12} sm={6} md={4}>
//               <TextField
//                 fullWidth
//                 label="department Code"
//                 value={filters.dept_code}
//                 onChange={(e) => handleFilterChange('dept_code', e.target.value)}
//               />
//             </Grid>
            
//             <Grid item xs={12} sm={6} md={4}>
//               <TextField
//                 fullWidth
//                 label="Department Name"
//                 value={filters.dept_name}
//                 onChange={(e) => handleFilterChange('dept_name', e.target.value)}
//               />
//             </Grid>

            
//             <Grid item xs={12} md={6}>
//                       <TextField
//                         fullWidth
//                         select
//                         label="Select Parent Dept*"
//                         name="parent_dept"
//                         value={filters.parent_dept.id}
//                         variant="outlined"
//                       >
//                         {positions.map((position) => (
//                           <MenuItem key={position.value} value={position.value.id}>
//                             {position.label}
//                           </MenuItem>
//                         ))}
//                       </TextField>
//                     </Grid>
          
            
        
        
        
//             <Grid item xs={12} sm={6} md={4}>
//               <FormControl fullWidth>
//                 <InputLabel>Ordering</InputLabel>
//                 <Select
//                   value={filters.ordering}
//                   label="Ordering"
//                   onChange={(e) => handleFilterChange('ordering', e.target.value)}
//                 >
//                   {dropdownOptions.ordering.map((dept) => {
//                     return(
//                     <MenuItem key={dept.id} value={dept.id}>
//                       {dept.label}
//                     </MenuItem>
//                   )}
//                   )}
//                 </Select>
//               </FormControl>
//             </Grid>
//           </Grid>
//         </DialogContent>
        
//         <DialogActions>
//           <Button onClick={resetFilters} sx={{ color: 'text.secondary' }}>Reset</Button>
//           <Button onClick={() => setFilterOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
//           <Button onClick={applyFilters} variant="contained" sx={{ backgroundColor: '#616161', '&:hover': { backgroundColor: '#424242' } }}>Apply</Button>
//         </DialogActions>
//       </Dialog>

//       {/* View Employee Modal */}
//       <ViewDepartmentModal 
//         employee={selectedEmployeeView}
//         open={viewModalOpen}
//         onClose={() => setViewModalOpen(false)}
//       />

//       {/* Success Snackbar */}
//       <SuccessSnackbar open={open} handleClose={handleClose} />
      
//       {/* Delete Confirmation Popup */}
//       <MyComponent />

//       {/* Edit Employee Modal */}


//       <> 
//       {editModalOpen && (
//   <Modal
//     open={editModalOpen}
//     onClose={() => setEditModalOpen(false)}
//     aria-labelledby="edit-department-modal"
//     aria-describedby="edit-department-form"
//   >
//     <Box sx={{
//       position: 'absolute',
//       top: '50%',
//       left: '50%',
//       transform: 'translate(-50%, -50%)',
//       width: '80%',
//       maxWidth: 600,
//       bgcolor: 'background.paper',
//       p: 4,
//       maxHeight: '90vh',
//       overflowY: 'auto',
//       borderRadius: 2
//     }}>
//       <Typography variant="h5" gutterBottom>Edit Department</Typography>
//       <Divider sx={{ mb: 3 }} />
//       <Formik
//         initialValues={selectedEmployee}
//         validationSchema={validationSchema}
//         onSubmit={handleEditSubmit}
//         enableReinitialize
//       >
//         {({ values, errors, touched, handleChange, setFieldValue }) => (
//           <Form>
//             <Grid container spacing={3}>
//               {/* Department Information Section */}
//               <Grid item xs={12}>
//                 <Typography variant="h6" gutterBottom>Department Information</Typography>
//                 <Divider />
//               </Grid>
              
//               {/* <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   label="Department Code*"
//                   name="dept_code"
//                   value={values.dept_code}
//                   onChange={handleChange}
//                   error={touched.dept_code && Boolean(errors.dept_code)}
//                   helperText={touched.dept_code && errors.dept_code}
//                   variant="outlined"
//                 />
//               </Grid> */}
              
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   label="Department Name*"
//                   name="dept_name"
//                   value={values.dept_name}
//                   onChange={handleChange}
//                   error={touched.dept_name && Boolean(errors.dept_name)}
//                   helperText={touched.dept_name && errors.dept_name}
//                   variant="outlined"
//                 />
//               </Grid>
              

//        <Grid item xs={12} md={6}>
//                       <TextField
//                         fullWidth
//                         select
//                         label="Select Parent Dept*"
//                         name="parent_dept"
//                         value={values.parent_dept}
//                         onChange={handleChange}
//                         error={touched.parent_dept && Boolean(errors.parent_dept)}
//                         helperText={touched.parent_dept && errors.parent_dept}
//                         variant="outlined"
//                       >
//                         {positions.map((position) => {
//                           console.log(position,"989877777777777")
//                           return(
//                           <MenuItem key={position.value} value={position.value}>
//                             {position.label}
//                           </MenuItem>
//                         )})}
//                       </TextField>
//                     </Grid>

//               {/* <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   label="Parent Department Code"
//                   name="parent_dept"
//                   value={values.parent_dept?.dept_code || ''}
//                   onChange={handleChange}
//                   error={touched.parent_dept && Boolean(errors.parent_dept)}
//                   helperText={touched.parent_dept && errors.parent_dept}
//                   variant="outlined"
//                 />
//               </Grid>
              
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   label="Parent Department Name"
//                   name="parent_dept_name"
//                   value={values.parent_dept?.dept_name || ''}
//                   onChange={handleChange}
//                   variant="outlined"
//                   disabled
//                 />
//               </Grid> */}

//               {/* Submit Button */}
//               <Grid item xs={12}>
//                 <Button 
//                   fullWidth 
//                   type="submit" 
//                   variant="contained" 
//                   color="primary"
//                   size="large"
//                   sx={{ mt: 3 }}
//                 >
//                   UPDATE DEPARTMENT
//                 </Button>
//               </Grid>
//             </Grid>
//           </Form>
//         )}
//       </Formik>
//     </Box>
//   </Modal>
// )}
      
//       </>
                      
//                         </Layout>    </> );
//                         };
// export default DepartmentListPage;