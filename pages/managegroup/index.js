import React, { useState } from 'react';
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
  Grid
} from '@mui/material';
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
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Layout from '../../components/Layout/Layout';

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
  const [currentGroup, setCurrentGroup] = useState(null);
  
  // Sample data with state for editable groups
  const [groups, setGroups] = useState([
    { id: 'all', name: 'All Users', icon: <GroupsIcon />, count: 6739, color: 'primary' },
    { id: 2, name: 'SQA', count: 50, color: 'pink', shiftTiming: '9am-5pm', description: 'Software Quality Assurance team' },
    { id: 1, name: 'Xcv', count: 3, color: 'dark', shiftTiming: 'Flexible', description: 'Experimental group' }
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

  // Formik for create group
  const createGroupForm = useFormik({
    initialValues: {
      name: '',
      color: '',
      shiftTiming: '',
      description: ''
    },
    validationSchema: yup.object({
      name: yup.string().required('Group name is required'),
      color: yup.string().required('Color is required'),
      shiftTiming: yup.string().required('Shift timing is required'),
      description: yup.string().required('Description is required')
    }),
    onSubmit: (values) => {
      // Generate a new ID for the group
      const newId = Math.max(...groups.filter(g => g.id !== 'all').map(g => g.id), 0) + 1;
      
      const newGroup = {
        id: newId,
        name: values.name,
        color: values.color,
        shiftTiming: values.shiftTiming,
        description: values.description,
        count: 0
      };
      
      setGroups([...groups, newGroup]);
      setOpenCreateGroup(false);
      createGroupForm.resetForm();
    }
  });

  // Formik for edit group
  const editGroupForm = useFormik({
    initialValues: {
      name: '',
      color: '',
      shiftTiming: '',
      description: ''
    },
    validationSchema: yup.object({
      name: yup.string().required('Group name is required'),
      color: yup.string().required('Color is required'),
      shiftTiming: yup.string().required('Shift timing is required'),
      description: yup.string().required('Description is required')
    }),
    onSubmit: (values) => {
      const updatedGroups = groups.map(group => 
        group.id === currentGroup.id ? { ...group, ...values } : group
      );
      setGroups(updatedGroups);
      setOpenEditGroup(false);
    }
  });

  // Initialize edit form when opening the modal
  const handleOpenEditGroup = (group) => {
    setCurrentGroup(group);
    editGroupForm.setValues({
      name: group.name,
      color: group.color,
      shiftTiming: group.shiftTiming || '',
      description: group.description || ''
    });
    setOpenEditGroup(true);
  };

  // Handle group assignment (single user)
  const handleAssignGroup = (groupId) => {
    if (currentUserId) {
      // In a real app, you would update the user's group in your state/API
      console.log(`Assigning user ${currentUserId} to group ${groupId}`);
    }
    setOpenAssignGroup(false);
    setCurrentUserId(null);
  };

  // Handle bulk group assignment
  const handleBulkAssignGroup = (groupId) => {
    // In a real app, you would update all selected users' groups in your state/API
    console.log(`Assigning users ${selectedUsers.join(',')} to group ${groupId}`);
    setOpenBulkAssignGroup(false);
    setSelectedUsers([]);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
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

  const handleOpenAssignGroup = (userId) => {
    setCurrentUserId(userId);
    setOpenAssignGroup(true);
  };

  const handleOpenBulkAssignGroup = () => {
    if (bulkAction === 'assignGroup') {
      setOpenBulkAssignGroup(true);
    }
  };

  const handleDeleteGroup = () => {
    if (currentGroup) {
      setGroups(groups.filter(group => group.id !== currentGroup.id));
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

  return (
    <Layout> 
      <Box >
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
              
              <TextField
                fullWidth
                margin="normal"
                id="shiftTiming"
                name="shiftTiming"
                label="Shift Timing"
                value={createGroupForm.values.shiftTiming}
                onChange={createGroupForm.handleChange}
                error={createGroupForm.touched.shiftTiming && Boolean(createGroupForm.errors.shiftTiming)}
                helperText={createGroupForm.touched.shiftTiming && createGroupForm.errors.shiftTiming}
              />
              
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
              
              <TextField
                fullWidth
                margin="normal"
                id="shiftTiming"
                name="shiftTiming"
                label="Shift Timing"
                value={editGroupForm.values.shiftTiming}
                onChange={editGroupForm.handleChange}
                error={editGroupForm.touched.shiftTiming && Boolean(editGroupForm.errors.shiftTiming)}
                helperText={editGroupForm.touched.shiftTiming && editGroupForm.errors.shiftTiming}
              />
              
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
                <Button type="submit" variant="contained">Save Changes</Button>
              </Box>
            </form>
          </Box>
        </Modal>

        {/* Assign Group Modal (Single User) */}
        <Dialog 
          open={openAssignGroup} 
          onClose={() => setOpenAssignGroup(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Assign Group</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Select a group to assign to this user (only one group can be selected):
            </Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {groups.filter(g => g.id !== 'all').map((group) => {
                const userGroup = getUserGroup(currentUserId);
                const isChecked = userGroup ? userGroup.id === group.id : false;
                
                return (
                  <Grid item xs={12} sm={6} md={4} key={group.id}>
                    <Paper 
                      sx={{ 
                        p: 1, 
                        display: 'flex', 
                        alignItems: 'center',
                        cursor: 'pointer',
                        border: isChecked ? `2px solid ${getColor(group.color)}` : '1px solid rgba(0, 0, 0, 0.12)',
                        '&:hover': {
                          borderColor: getColor(group.color)
                        }
                      }}
                      onClick={() => handleAssignGroup(group.id)}
                    >
                      <Checkbox
                        checked={isChecked}
                        onChange={() => handleAssignGroup(group.id)}
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
                );
              })}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAssignGroup(false)}>Cancel</Button>
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
                    onClick={() => handleBulkAssignGroup(group.id)}
                  >
                    <Checkbox
                      checked={false}
                      onChange={() => handleBulkAssignGroup(group.id)}
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
                {groups.map((group) => (
                  <ListItem 
                    key={group.id} 
                    button 
                    selected={group.id === 'all'}
                    sx={{ 
                      '&.Mui-selected': { backgroundColor: theme.palette.action.selected },
                      '&.Mui-selected:hover': { backgroundColor: theme.palette.action.selected }
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
                    <StyledBadge 
                      badgeContent={group.count} 
                      color={group.id === 'all' ? 'primary' : 'default'} 
                      sx={{ mr: 2 }}
                    />
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
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Subtle custom shadow
    },
  }}
>
  <MenuItem
    onClick={() => {
      handleMenuClose();
      handleOpenEditGroup(group);
    }}
  >
    <ListItemIcon>
      <EditIcon fontSize="small" />
    </ListItemIcon>
    Edit Group
  </MenuItem>
  <MenuItem
    onClick={() => {
      handleMenuClose();
      handleDeleteGroup();
    }}
  >
    <ListItemIcon>
      <DeleteIcon fontSize="small" />
    </ListItemIcon>
    Delete Group
  </MenuItem>
  <Divider />
  <MenuItem onClick={handleMenuClose}>
    <ListItemIcon>
      <MailIcon fontSize="small" />
    </ListItemIcon>
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
                <Paper sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <Checkbox
                      checked={selectedUsers.length === users.length}
                      indeterminate={selectedUsers.length > 0 && selectedUsers.length < users.length}
                      onChange={handleSelectAll}
                    />
                    <Typography variant="subtitle2" sx={{ flex: 1 }}>User</Typography>
                    <Typography variant="subtitle2" sx={{ width: 150, display: { xs: 'none', sm: 'block' } }}>Groups</Typography>
                    <Typography variant="subtitle2" sx={{ width: 100 }}>Status</Typography>
                    <Box sx={{ width: 50 }}></Box>
                  </Box>
                  
                  <List>
                    {users.map((user) => {
                      const userGroup = getUserGroup(user.id);
                      return (
                        <ListItem 
                          key={user.id} 
                          sx={{ 
                            '&:hover': { backgroundColor: theme.palette.action.hover },
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            py: 1
                          }}
                        >
                          <Checkbox
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleUserSelect(user.id)}
                          />
                          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                            <Avatar sx={{ 
                              bgcolor: getColor(user.color), 
                              width: 36, 
                              height: 36,
                              mr: 2
                            }}>
                              {user.initials}
                            </Avatar>
                            <Typography>{user.name}</Typography>
                          </Box>
                          <Box sx={{ width: 150, display: { xs: 'none', sm: 'block' } }}>
                            {userGroup && (
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ 
                                  width: 12, 
                                  height: 12, 
                                  backgroundColor: getColor(userGroup.color), 
                                  mr: 1,
                                  borderRadius: '50%'
                                }} />
                                <Typography variant="body2">{userGroup.name}</Typography>
                              </Box>
                            )}
                          </Box>
                          <Box sx={{ width: 100 }}>
            

 <Box 
                                  sx={{
                                    display: 'inline-block',
                                    padding: '2px 4px',
                                    fontSize:"0.625rem",
                                    borderRadius: '2px',
                                    backgroundColor: user.status === 'active' ? '#e6f7ee' : '#ffebee',
                                    color: user.status === 'active' ? '#00a65a' : '#f44336'
                                  }}
                                >
                                   {user.status === 'active' ? 'Active' : 'Inactive'}
                                </Box>


                          </Box>
                          <Box sx={{ width: 50, display: 'flex', justifyContent: 'flex-end' }}>
                            <IconButton size="small" sx={{ mr: 1, display: { xs: 'none', sm: 'flex' } }}>
                              <MailIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={handleMenuClick}>
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
<Menu
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={handleMenuClose}
  PaperProps={{
    sx: {
      boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.05)', // subtle shadow
    },
  }}
>
  {user.status === 'active' && (
    <MenuItem onClick={handleMenuClose}>
      <ListItemIcon>
        <PersonIcon fontSize="small" />
      </ListItemIcon>
      View Details
    </MenuItem>
  )}
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
      handleOpenAssignGroup(user.id);
    }}
  >
    <ListItemIcon>
      <LabelIcon fontSize="small" />
    </ListItemIcon>
    Assign Group
  </MenuItem>
</Menu>

                          </Box>
                        </ListItem>
                      );
                    })}
                  </List>
                </Paper>
                
                {/* Pagination */}
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <Pagination 
                    count={135} 
                    page={currentPage} 
                    onChange={handlePageChange} 
                    color="primary" 
                    showFirstButton 
                    showLastButton 
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>
    </Layout>
  );
};

export default GroupManagement;