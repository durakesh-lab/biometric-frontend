import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  Chip,
  Avatar,
  useTheme
} from '@mui/material';
import {
  Event,
  Sick,
  BeachAccess,
  WorkOff,
  FamilyRestroom,
  FreeBreakfast
} from '@mui/icons-material';
import Layout from '../../../components/Layout/Layout';
import LeaveManagementTabs from '../../../components/leaves-management/leavessection';
import LeaveApplicationForm from '../../../components/leaves-management/applyleave';

const LeaveBalanceCard = ({
  title,
  available,
  booked,
  icon,
  color,
  onApplyLeave
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const showApplyButton = available > 0;
  const [openForm, setOpenForm] = useState(false);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        px: 2,
        py: 2,
        mb: 2,
        backgroundColor: '#fff',
        position: 'relative',
        '&:hover': {
          boxShadow: 1,
          borderColor: theme.palette.primary.light
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left side - Icon and title */}
      <Box display="flex" alignItems="center" sx={{ width: '80%' }}>
        <Avatar
          sx={{
            bgcolor: theme.palette[color].light,
            color: theme.palette[color].dark,
            mr: 2,
            width: 48,
            height: 48
          }}
        >
          {icon}
        </Avatar>
        <Typography variant="subtitle1" fontWeight={600}>
          {title}
        </Typography>
      </Box>

      {/* Middle - Available and Booked */}
      <Box 
        display="flex" 
        flexDirection="column" 
        sx={{ 
          width: '40%',
          alignItems: 'flex-start'
        }}
      >
        <Box display="flex" alignItems="center" gap={2} mb={1}>
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: '80px' }}>
            Available:
          </Typography>
          <Typography variant="body2" sx={{ 
            color: available > 0 ? theme.palette.success.main : 'text.primary',
            fontWeight: 600
          }}>
            {available} {available === 1 ? 'day' : 'days'}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: '80px' }}>
            Booked:
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {booked} {booked === 1 ? 'day' : 'days'}
          </Typography>
        </Box>
      </Box>

      {/* Right side - Button (only visible on hover) */}
      {showApplyButton && (
        <Box 
          sx={{ 
            width: '30%',
            display: 'flex',
            justifyContent: 'flex-end',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.2s ease-in-out'
          }}
        >
          <Button
            variant="outlined"
            size="small"
            color="primary"
            sx={{ 
              minWidth: '120px', 
              fontSize: '0.85rem',
              visibility: isHovered ? 'visible' : 'hidden'
            }}
          onClick={() => setOpenForm(true)}
        >
          Apply Leave
        </Button>

              {/* The form modal */}
              <LeaveApplicationForm
                open={openForm} 
                onClose={() => setOpenForm(false)} 
              />
        </Box>
      )}
    </Box>
  );
};

const LeaveBalance = ({ onApplyLeave }) => {
  
  const leaveTypes = [
    {
      id: 'casual',
      title: 'Casual Leave',
      available: 9,
      booked: 3,
      icon: <BeachAccess />,
      color: 'primary'
    },
    {
      id: 'earned',
      title: 'Earned Leave',
      available: 12,
      booked: 0,
      icon: <Event />,
      color: 'secondary'
    },
    {
      id: 'sick',
      title: 'Sick Leave',
      available: 12,
      booked: 0,
      icon: <Sick />,
      color: 'warning'
    },
    {
      id: 'withoutpay',
      title: 'Leave Without Pay',
      available: 12,
      booked: 0,
      icon: <WorkOff />,
      color: 'error'
    },
    {
      id: 'paternity',
      title: 'Paternity Leave',
      available: 12,
      booked: 0,
      icon: <FamilyRestroom />,
      color: 'info'
    },
    {
      id: 'sabbatical',
      title: 'Sabbatical Leave',
      available: 12,
      booked: 0,
      icon: <FreeBreakfast />,
      color: 'success'
    }
  ];

  return (
    <Layout>
      <LeaveManagementTabs />
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
          Leave Balance
        </Typography>

        {leaveTypes.map((leave) => (
          <LeaveBalanceCard
            key={leave.id}
            title={leave.title}
            available={leave.available}
            booked={leave.booked}
            icon={leave.icon}
            color={leave.color}
            onApplyLeave={() => onApplyLeave(leave.id)}
          />
        ))}
      </Box>
    </Layout>
  );
};

export default LeaveBalance;