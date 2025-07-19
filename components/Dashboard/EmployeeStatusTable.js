import React, { useState, useEffect, useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
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
  Checkbox,
  Box,
  Grid,
  Typography,
  Chip,
  Tooltip,
  Modal,
  Divider,
  createTheme
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
import SuccessSnackbar from '../successpopup/successpopup';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from 'react-redux';
import { confirnDeleteAction, editCompanyAction } from '@/store/authSlice';
import MyComponent from '../deletepopup';
import ViewCompanyModal from './viewcompany';
import { useRouter } from 'next/router';

const CompanyListTable = () => {
  // State for table data and UI
    let router=useRouter()
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [open, setOpen] = useState(false);
  let dispatch = useDispatch();
  let deletepopup = useSelector((state) => { return (state.auth) });

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
    companyId: '',
    name: '',
    owner: '',
    email: '',
    phoneNumber: '',
    industry: '',
    ordering: ""
  });

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

  // Columns configuration
  const columns = [
    { id: 'srNo', label: 'SN.', sortable: false },
    { id: 'companyId', label: 'Company ID', sortable: true },
    { id: 'name', label: 'Company Name', sortable: true },
    { id: 'email', label: 'Email', sortable: true },
    { id: 'phoneNumber', label: 'Phone', sortable: true },
    { id: 'industry', label: 'Industry', sortable: true },
    { id: 'view', label: 'View', sortable: false },
        { id: 'managebranches', label: 'Manage', sortable: false },
    // { id: 'actions', label: 'Actions', sortable: false }
  ];

  const handleManageBranches=(id)=>{
router.push({
  pathname: '/company/branches',
  query: { id: id }
});
}
  // Fetch companies data
  const fetchCompanies = async () => {
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
       `${process.env.NEXT_PUBLIC_BASE_URL}/company`,
        {
          headers: { Authorization: token },
          params
        }
      );

      if (response?.data?.data && Array.isArray(response.data.data)) {
        setCompanies(response.data.data);
        setPagination(prev => ({
          ...prev,
          total_pages: Math.ceil((response.data.count || 0) / prev.page_size),
          count: response.data.count || 0
        }));
      } else {
        console.error('Unexpected API response structure:', response.data);
        setCompanies([]);
      }
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        console.error('Network error occurred. Please check your internet connection.');
      } else {
        console.error('Error fetching companies:', error);
      }
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [pagination.page, pagination.page_size, sorting, search]);

  // Handle select all
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(companies.map(company => company.id));
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
    fetchCompanies();
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      companyId: '',
      name: '',
      owner: '',
      email: '',
      phoneNumber: '',
      industry: '',
      ordering: ""
    });
  };

  // Handle menu click
  const handleMenuClick = (event, company) => {
    setAnchorEl(event.currentTarget);
    setSelectedCompany(company);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle delete
  const handleConfirmDelete = (id) => {
    dispatch(confirnDeleteAction("sure"));
    sessionStorage.setItem("deleteIds", JSON.stringify(id));
  };

  const handleDelete = async (id) => {
    id = JSON.parse(sessionStorage.getItem("deleteIds"));
    try {
      let token = localStorage.getItem("biometric_token");
      let data = { object_ids: Array.isArray(id) ? id : [id], action_type: "delete" };
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/company/actioncompany`, data, {
        headers: { Authorization: token }
      });
      setSelected([]);
      setShowDelete(false);
      dispatch(confirnDeleteAction(false));
      setOpen("deletecompany");
      fetchCompanies();
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

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState({});

  const handleEdit = () => {
    if (selectedCompany) {
      setCurrentCompany(selectedCompany);
      setEditModalOpen(true);
    }
    handleMenuClose();
  };

  const handleEditSubmit = async (values) => {
    try {
      dispatch(editCompanyAction(values));
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error updating company:', error);
    }
  };

  const initialValues = {
    ...currentCompany
  };

  const validationSchema = Yup.object({
    companyId: Yup.string().required("Required"),
    name: Yup.string().required("Required"),
    owner: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    phoneNumber: Yup.string().required("Required"),
    industry: Yup.string().required("Required")
  });

  // View modal state
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedCompanyView, setSelectedCompanyView] = useState({});

  const handleViewClick = (company) => {
    setSelectedCompanyView(company);
    setViewModalOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <>
      <div>
        {/* Header Section */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} sx={{ flexWrap: 'wrap', rowGap: 2 }}>
          <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 600 }}>
            Company Status
          </Typography>

          <Box display="flex" alignItems="center" gap={1}>
            {showDelete && (
              <Tooltip title={`Delete selected (${selected.length})`}>
                <IconButton
                  color="error"
                  onClick={() => { handleConfirmDelete(selected) }}
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

        {/* Table */}
        <TableContainer
          elevation={0}
          component={Paper}
          sx={{
            height: "270px",
            width: '100%',
            overflow: 'auto',
            position: 'relative',
            mt: 2,
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
          <Table sx={{
            minWidth: 800,
            width: '100%',
            tableLayout: 'fixed'
          }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F3F4F6' }}>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    sx={{
                      whiteSpace: 'nowrap',
                      textAlign: column.id === 'checkbox' ? 'left' : 'center',
                      verticalAlign: 'middle',
                      padding: column.id === 'checkbox' ? '0 0 0 16px' : '16px'
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
                    Loading...
                  </TableCell>
                </TableRow>
              ) : companies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    No companies found
                  </TableCell>
                </TableRow>
              ) : (
                companies.map((company, index) => {
                  const isSelected = selected.indexOf(company.id) !== -1;

                  return (
                    <TableRow
                      key={company.id}
                      hover
                      selected={isSelected}
                      sx={{
                        '& > td': {
                          padding: '8px 16px',
                          height: '40px'
                        }
                      }}
                    >
                      {/* <TableCell padding="checkbox" sx={{ paddingLeft: '16px' }}>
                        <Checkbox
                          checked={isSelected}
                          onChange={(event) => handleSelect(event, company.id)}
                          sx={{ padding: '4px' }}
                        />
                      </TableCell> */}

                      <TableCell>{getSerialNumber(index)}</TableCell>
                      <TableCell>{company.companyId}</TableCell>
                      <TableCell>{company.name}</TableCell>
                      {/* <TableCell>{company.owner}</TableCell> */}
                      <TableCell>{company.email}</TableCell>
                      <TableCell>{company.phoneNumber}</TableCell>
                      <TableCell>
                        <Chip
                          label={company.industry}
                          color="primary"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          sx={{ color: 'text.secondary' }}
                          onClick={() => handleViewClick(company)}
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
    onClick={() => handleManageBranches(company._id)}
  >
     Branches 
  </Button>
</TableCell>

                      {/* <TableCell>
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
                          <MenuItem onClick={() => handleConfirmDelete(selectedCompany?.id)}>Delete</MenuItem>
                        </Menu>
                      </TableCell> */}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <ViewCompanyModal
          company={selectedCompanyView}
          open={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
        />

        {/* Pagination */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
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

          <Box display="flex" alignItems="center">
            <Typography variant="body2" sx={{ mr: 2, color: 'text.secondary' }}>
              Page {pagination.page} of {pagination.total_pages}
            </Typography>

            <Button
              disabled={pagination.page === 1}
              onClick={() => handlePageChange(pagination.page - 1)}
              sx={{ color: 'text.secondary' }}
            >
              Previous
            </Button>

            <Button
              disabled={pagination.page === pagination.total_pages}
              onClick={() => handlePageChange(pagination.page + 1)}
              sx={{ color: 'text.secondary' }}
            >
              Next
            </Button>
          </Box>
        </Box>

        {/* Filter Modal */}
        <Dialog open={filterOpen} onClose={() => setFilterOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Sort & Filter</DialogTitle>

          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Company ID"
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

        {/* Edit Company Modal */}
        <Modal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          aria-labelledby="edit-company-modal"
          aria-describedby="edit-company-form"
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
          }}>
            <Typography variant="h5" gutterBottom>Edit Company</Typography>
            <Divider sx={{ mb: 3 }} />
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleEditSubmit}
            >
              {({ values, errors, touched, handleChange }) => (
                <Form>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Company ID*"
                        name="companyId"
                        value={values.companyId}
                        onChange={handleChange}
                        error={touched.companyId && Boolean(errors.companyId)}
                        helperText={touched.companyId && errors.companyId}
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
                      <FormControl fullWidth>
                        <InputLabel>Industry*</InputLabel>
                        <Select
                          name="industry"
                          value={values.industry}
                          onChange={handleChange}
                          error={touched.industry && Boolean(errors.industry)}
                          label="Industry*"
                        >
                          {dropdownOptions.industries.map((industry) => (
                            <MenuItem key={industry} value={industry}>
                              {industry}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        sx={{ mr: 3 }}
                      >
                        Update Company
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Box>
        </Modal>

        <SuccessSnackbar open={open} handleClose={handleClose} />
        <MyComponent />
      </div>
    </>
  );
};

export default CompanyListTable;