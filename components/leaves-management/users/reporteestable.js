import {
  Avatar,
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

export const ZohoStyledTable = ({ employees }) => {
  return (
    <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
      <Table sx={{ borderCollapse: 'separate', borderSpacing: 0 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f8f9fb' }}>
            <TableCell sx={{ fontWeight: 'bold' }}>Employee</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Leave booked this year</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Shift</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((employee) => (
            <TableRow
              key={employee.id}
              hover
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#f1f4f8',
                },
              }}
            >
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar src={employee.avatar} sx={{ width: 40, height: 40 }} />
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {employee.code} - {employee.name}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>

              <TableCell>
                <Typography
                  variant="body2"
                  color={
                    employee.status === 'Casual Leave'
                      ? 'primary'
                      : employee.status === 'Yet to check-in'
                      ? 'error'
                      : 'textSecondary'
                  }
                  sx={{ fontWeight: 500 }}
                >
                  {employee.status}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant="body2">
                  {employee.daysBooked ? `${employee.daysBooked} day(s)` : '-'}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant="body2" fontWeight={500}>
                  {employee.shift}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
