import React, { useState } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Chip,
  Select,
  MenuItem,
  Tooltip,
  Popover,
  Button,
  Divider,
  Grid,
  styled,
  useTheme
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  InfoOutlined,
  ArrowRightAlt,
  Event,
  CalendarToday,
  AccessTime,
  HelpOutline
} from '@mui/icons-material';
import LeaveHeader from '../../components/leaves  management/leavestofilter';
import Layout from '../../components/Layout/Layout';
import LeaveManagementTabs from '../../components/leaves  management/leavessection';

// Styled Components
const LeaveCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  cursor: 'pointer',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4]
  }
}));

const LeaveTypeIcon = styled('span')(({ theme, color }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  borderRadius: '50%',
  backgroundColor: theme.palette[color]?.light || theme.palette.grey[300],
  color: theme.palette[color]?.dark || theme.palette.grey[700],
  marginRight: theme.spacing(1)
}));

const StatusBadge = styled('span')(({ theme, status }) => ({
  display: 'inline-block',
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: status === 'available' ? theme.palette.success.main : theme.palette.grey[500],
  marginRight: theme.spacing(1)
}));

// Main Component
export default function LeaveManagement() {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLeaveType, setSelectedLeaveType] = useState(null);
  const [viewType, setViewType] = useState('upcoming');
  const [viewSubType, setViewSubType] = useState('all');

  const leaveTypes = [
    {
      id: 'casual',
      name: 'Casual Leave',
      available: 9,
      booked: 3,
      used: 3,
      planned: 0,
      color: 'primary',
      icon: <CalendarToday fontSize="small" />
    },
    {
      id: 'earned',
      name: 'Earned Leave',
      available: 12,
      booked: 0,
      used: 0,
      planned: 0,
      color: 'secondary',
      icon: <Event fontSize="small" />
    },
    {
      id: 'sick',
      name: 'Sick Leave',
      available: 12,
      booked: 0,
      used: 0,
      planned: 0,
      color: 'warning',
      icon: <AccessTime fontSize="small" />
    },
    {
      id: 'paternity',
      name: 'Paternity Leave',
      available: 0,
      booked: 0,
      used: 0,
      planned: 0,
      color: 'info',
      icon: <HelpOutline fontSize="small" />
    },
    {
      id: 'sabbatical',
      name: 'Sabbatical Leave',
      available: 0,
      booked: 0,
      used: 0,
      planned: 0,
      color: 'success',
      icon: <HelpOutline fontSize="small" />
    },
    {
      id: 'withoutpay',
      name: 'Leave Without Pay',
      available: 0,
      booked: 0,
      used: 0,
      planned: 0,
      color: 'error',
      icon: <HelpOutline fontSize="small" />
    }
  ];

  const leaveHistory = [
    {
      id: 1,
      type: 'Casual Leave',
      startDate: '23-Jun-2025, Mon',
      endDate: '25-Jun-2025, Wed',
      duration: '3 days',
      reason: 'personal reason',
      status: 'approved',
      color: 'primary'
    },
    {
      id: 2,
      type: 'Special Holiday',
      date: '20-Jun-2025, Fri',
      reason: 'stay at home',
      status: 'holiday'
    },
    {
      id: 3,
      type: 'Special Holiday',
      date: '19-Jun-2025, Thu',
      reason: 'stay at home',
      status: 'holiday'
    },
    {
      id: 4,
      type: 'Special Holiday',
      date: '18-Jun-2025, Wed',
      reason: 'stay at home',
      status: 'holiday'
    }
  ];

  const handlePopoverOpen = (event, leaveType) => {
    setAnchorEl(event.currentTarget);
    setSelectedLeaveType(leaveType);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setSelectedLeaveType(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>  
    <Layout >     
   

<LeaveManagementTabs />

    <LeaveHeader />
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Leave Summary
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2">
            Leave booked this year: <b>3</b> day(s)
          </Typography>
          <Divider orientation="vertical" flexItem />
          <Typography variant="body2">
            Absent: <b>0</b>
          </Typography>
          <Button variant="contained" color="primary">
            Apply Leave
          </Button>
        </Box>
      </Box> */}

      {/* Leave Type Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {leaveTypes.map((leave) => (
          <Grid item xs={12} sm={6} md={4} key={leave.id}>
            <LeaveCard>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LeaveTypeIcon color={leave.color}>{leave.icon}</LeaveTypeIcon>
                    <Typography variant="subtitle1">{leave.name}</Typography>
                  </Box>
                  <Tooltip title="More info">
                    <IconButton
                      aria-label="info"
                      size="small"
                      onClick={(e) => handlePopoverOpen(e, leave)}
                    >
                      <InfoOutlined fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
              <CardContent sx={{ pt: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">
                    <StatusBadge status="available" />
                    Available <b style={{ color: theme.palette.success.main }}>{leave.available}</b>
                  </Typography>
                  <Typography variant="body2">
                    Booked <b>{leave.booked}</b>
                  </Typography>
                </Box>
              </CardContent>
            </LeaveCard>
          </Grid>
        ))}
      </Grid>

      {/* Leave Details Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        {selectedLeaveType && (
          <Box sx={{ p: 2, minWidth: 200 }}>
            <Typography variant="subtitle2" gutterBottom>
              {selectedLeaveType.name} Details
            </Typography>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell>Used</TableCell>
                  <TableCell>{selectedLeaveType.used}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Planned</TableCell>
                  <TableCell>{selectedLeaveType.planned}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        )}
      </Popover>

      {/* Leave History Section */}
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Select
                value={viewType}
                onChange={(e) => setViewType(e.target.value)}
                size="small"
                sx={{ mr: 2, minWidth: 200 }}
              >
                <MenuItem value="upcoming">Upcoming Leave & Holidays</MenuItem>
                <MenuItem value="past">Past Leave & Holidays</MenuItem>
              </Select>
              {viewType === 'upcoming' && (
                <Select
                  value={viewSubType}
                  onChange={(e) => setViewSubType(e.target.value)}
                  size="small"
                  sx={{ minWidth: 150 }}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="leave">Leave Only</MenuItem>
                  <MenuItem value="holidays">Holidays Only</MenuItem>
                </Select>
              )}
            </Box>
          }
        />
        <CardContent>
          <Table>
            <TableBody>
              {leaveHistory.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell sx={{ width: '300px' }}>
                    {item.startDate ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2">{item.startDate}</Typography>
                        <ArrowRightAlt sx={{ mx: 1 }} />
                        <Typography variant="body2">{item.endDate}</Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2">{item.date}</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {item.status !== 'holiday' && (
                        <Chip
                          label={item.type}
                          size="small"
                          sx={{
                            backgroundColor: theme.palette[item.color]?.light,
                            color: theme.palette[item.color]?.dark,
                            mr: 1
                          }}
                        />
                      )}
                      {item.status === 'holiday' && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                          <Event fontSize="small" sx={{ mr: 0.5 }} />
                          <Typography variant="body2">{item.type}</Typography>
                        </Box>
                      )}
                      {item.duration && (
                        <Typography variant="body2" color="textSecondary">
                          {item.duration}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{item.reason}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    {item.status === 'approved' && (
                      <Chip label="Approved" size="small" color="success" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Bradford Score Section (Hidden by default) */}
      <Card sx={{ mb: 3, display: 'none' }} id="zp_bradford_container">
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="subtitle1">Bradford Score</Typography>
              <Typography variant="body2" sx={{ ml: 1 }}>
                0
              </Typography>
            </Box>
          }
          action={
            <Button variant="outlined" color="primary" size="small">
              View Detailed Score
            </Button>
          }
        />
        <CardContent>
          <Table>
            <TableBody>
              {/* Bradford score details would go here */}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
      </Layout>
     </>
  );
}