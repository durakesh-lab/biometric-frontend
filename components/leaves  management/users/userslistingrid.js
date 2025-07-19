import React from 'react';
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Grid,
  IconButton,
  Box
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import { MoreVert } from '@mui/icons-material';

const employees = [
  {
    id: 'S2',
    name: 'Lilly Williams',
    status: 'Casual Leave',
    daysBooked: '6 day(s)',
    shift: '9:00 AM - 6:00 PM',
    image: 'https://randomuser.me/api/portraits/women/1.jpg'
  },
  {
    id: 'S3',
    name: 'Clarkson Walter',
    status: 'Yet to check-in',
    daysBooked: '3 day(s)',
    shift: '9:00 AM - 6:00 PM',
    image: 'https://randomuser.me/api/portraits/men/2.jpg'
  },
  {
    id: 'S4',
    name: 'Ethen Anderson',
    status: 'Yet to check-in',
    daysBooked: '-',
    shift: '9:00 AM - 6:00 PM',
    image: 'https://randomuser.me/api/portraits/men/3.jpg'
  },
  {
    id: 'S5',
    name: 'Andrew Turner',
    status: 'Yet to check-in',
    daysBooked: '-',
    shift: '9:00 AM - 6:00 PM',
    image: 'https://randomuser.me/api/portraits/men/4.jpg'
  },
  {
    id: 'S6',
    name: 'Ember Johnson',
    status: 'Yet to check-in',
    daysBooked: '-',
    shift: '9:00 AM - 6:00 PM',
    image: 'https://randomuser.me/api/portraits/women/5.jpg'
  },
  {
    id: 'S7',
    name: 'Hazel Carter',
    status: 'Yet to check-in',
    daysBooked: '-',
    shift: '9:00 AM - 6:00 PM',
    image: 'https://randomuser.me/api/portraits/women/6.jpg'
  },
  {
    id: 'S8',
    name: 'Asher Miller',
    status: 'Yet to check-in',
    daysBooked: '-',
    shift: '9:00 AM - 6:00 PM',
    image: 'https://randomuser.me/api/portraits/men/7.jpg'
  },
  {
    id: 'S9',
    name: 'Caspian Jones',
    status: 'Yet to check-in',
    daysBooked: '-',
    shift: '9:00 AM - 6:00 PM',
    image: 'https://randomuser.me/api/portraits/men/8.jpg'
  },
  {
    id: 'S10',
    name: 'Lindon Smith',
    status: 'Yet to check-in',
    daysBooked: '-',
    shift: '9:00 AM - 6:00 PM',
    image: 'https://randomuser.me/api/portraits/men/9.jpg'
  }
];

const EmployeeCard = ({ emp }) => {
  const isOnLeave = emp.status === 'Casual Leave';
  return (
    <Card sx={{ display: 'flex', p: 2, gap: 2, alignItems: 'center', borderRadius: 2, boxShadow: 2 }}>
      <Avatar src={emp.image} sx={{ width: 56, height: 56 }} />
      <Box flexGrow={1}>
        <Typography fontWeight="bold">
          {emp.id} - {emp.name}
        </Typography>
        <Typography color={isOnLeave ? 'orange' : 'error'}>
          {emp.status}
        </Typography>
        {emp.daysBooked !== '-' && (
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            <strong>{emp.daysBooked}</strong> Leave booked this year
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary">
          General - <strong>{emp.shift}</strong>
        </Typography>
      </Box>
      <IconButton size="small">
                          <MoreVert fontSize="small" />
                        </IconButton>
    </Card>
  );
};

export default function EmployeeGrid() {
  return (
    <Grid container spacing={2}>
      {employees.map((emp) => (
        <Grid item xs={12} sm={6} md={4} key={emp.id}>
          <EmployeeCard emp={emp} />
        </Grid>
      ))}
    </Grid>
  );
}
