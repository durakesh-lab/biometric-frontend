import React, { useState } from 'react';
import {
  Box,
  Typography,
  Divider,
  IconButton,
  Button,
  ButtonGroup,
  Tooltip,
  Popover,
  Menu,
  MenuItem,
  styled
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  CalendarToday,
  ViewList,
  CalendarViewMonth,
  MoreVert
} from '@mui/icons-material';
import LeaveCalendarView from './fullcalender';
import LeaveApplicationForm from './applyleave';

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`
}));

const LeftSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 8
});

const CenterSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
});

const YearNavigation = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 8
});

const RightSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 8
});

const ViewToggleButton = styled(IconButton)(({ active, theme }) => ({
  backgroundColor: active ? theme.palette.action.selected : 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}));

export default function LeaveHeader() {
  const [currentYear, setCurrentYear] = useState(2025);
  const [viewType, setViewType] = useState('list');
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handlePrevYear = () => setCurrentYear(prev => prev - 1);
  const handleNextYear = () => setCurrentYear(prev => prev + 1);
  
  const handleViewChange = (view) => setViewType(view);
  
  const handleMoreClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMoreClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const [calendarViewOpen, setCalendarViewOpen] = useState(false);

const [openForm, setOpenForm] = useState(false);

  return (
    <HeaderContainer>
      {/* Left Section */}
      <LeftSection>
        <Tooltip title="Excluding On Duty & Restricted Holidays" arrow placement="bottom">
          <Box display="flex" alignItems="center">
            <Typography variant="body2" component="em" color="text.secondary">
              Leave booked this year: 
            </Typography>
            <Typography variant="body2" component="b" sx={{ mx: 0.5, fontWeight: 600 }}>
              3
            </Typography>
            <Typography variant="body2">
              day(s)
            </Typography>
          </Box>
        </Tooltip>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 20 }} />
        
        <Box display="flex" alignItems="center">
          <Typography variant="body2" component="em" color="text.secondary">
            Absent: 
          </Typography>
          <Typography variant="body2" sx={{ ml: 0.5 }}>
            0
          </Typography>
        </Box>
      </LeftSection>

      {/* Center Section */}
      <CenterSection>
        <YearNavigation>
          <IconButton 
            size="small" 
            onClick={handlePrevYear}
            aria-label="Change to previous year"
          >
            <ArrowBack fontSize="small" color="primary" />
          </IconButton>
          
          <IconButton size="small" disabled>
            <CalendarToday fontSize="small" color="action" />
          </IconButton>
          
          <IconButton 
            size="small" 
            onClick={handleNextYear}
            aria-label="Change to next year"
          >
            <ArrowForward fontSize="small" color="primary" />
          </IconButton>
        </YearNavigation>
        
        <Tooltip title="Period selection pop-up" arrow>
          <Typography 
            variant="subtitle2" 
            component="b"
            sx={{ 
              cursor: 'pointer',
              fontWeight: 600,
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
            aria-label={`Currently selected date range: 01-Jan-${currentYear} - 31-Dec-${currentYear}`}
          >
            01-Jan-{currentYear} - 31-Dec-{currentYear}
          </Typography>
        </Tooltip>
      </CenterSection>

      {/* Right Section */}
      <RightSection>
        <ButtonGroup variant="text" size="small">
          <ViewToggleButton
            active={viewType === 'list'}
            onClick={() => handleViewChange('list')}
            title="List View"
            aria-label="List View"
          >
            <ViewList fontSize="small" />
          </ViewToggleButton>
          

<ViewToggleButton
  active={viewType === 'calendar'}
  onClick={() => setCalendarViewOpen(true)}
  title="Calendar View"
  aria-label="Calendar View"
>
  <CalendarViewMonth fontSize="small" />
</ViewToggleButton>

<LeaveCalendarView 
  open={calendarViewOpen} 
  onClose={() => setCalendarViewOpen(false)} 
/>
        </ButtonGroup>
        
        <Button 
          variant="contained" 
          size="medium"
          color="primary"
          aria-label="Apply Leave"
          sx={{ textTransform: 'none' }}
            onClick={() => setOpenForm(true)}
        >
          Apply Leave
        </Button>

              {/* The form modal */}
              <LeaveApplicationForm 
                open={openForm} 
                onClose={() => setOpenForm(false)} 
              />
         
        <IconButton
          onClick={handleMoreClick}
          aria-label="More options"
          title="More"
          size="small"
        >
          <MoreVert />
        </IconButton>
        
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMoreClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleMoreClose}>Export</MenuItem>
          <MenuItem onClick={handleMoreClose}>Settings</MenuItem>
          <MenuItem onClick={handleMoreClose}>Help</MenuItem>
        </Menu>
      </RightSection>
    </HeaderContainer>
  );
}