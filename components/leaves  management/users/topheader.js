import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  TextField,
  InputAdornment,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';

export default function ZohoHeader({setViewMode} ) {
  const [view, setView] = React.useState('grid');
  const [reportType, setReportType] = React.useState('all');

  const handleViewChange = (_, newView) => {
    if (newView !== null) setView(newView);
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      bgcolor="#f5f7fa"
      p={2}
      borderRadius={1}
    >
      {/* Left: User Info */}
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar
          src="https://contacts.zoho.in/file?ID=60042400523&fs=thumb"
          alt="rajat gour"
        />
        <Typography variant="subtitle1">
          1 - <strong>rajat gour</strong>
        </Typography>
      </Box>

      {/* Center: Report Filters */}
      <Box display="flex" alignItems="center" gap={2}>
        <Button
          variant={reportType === 'direct' ? 'contained' : 'text'}
          onClick={() => setReportType('direct')}
        >
          Direct&nbsp;<span style={{ fontWeight: 600 }}>4</span>
        </Button>
        <Button
          variant={reportType === 'all' ? 'contained' : 'text'}
          onClick={() => setReportType('all')}
        >
          All&nbsp;<span style={{ fontWeight: 600 }}>19</span>
        </Button>

        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleViewChange}
          size="small"
          sx={{ ml: 2 }}
        >
          <ToggleButton value="grid" aria-label="grid view">
            <GridViewIcon onClick={()=>{setViewMode("grid")}} />
          </ToggleButton>
          <ToggleButton value="list" aria-label="list view">
            <ViewListIcon onClick={()=>{setViewMode("no")}} />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Right: Search */}
      <Box sx={{ width: '250px' }}>
        <TextField
          size="small"
          placeholder="Enter 3 or more characters to search"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Box>
  );
}
