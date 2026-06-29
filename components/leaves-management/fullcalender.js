import React, { useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Divider,
  Chip,
  useTheme
} from '@mui/material';
import {
  Close,
  AccessTime,
  LocationOn,
  Info,
  AttachMoney,
  People,
  CalendarToday
} from '@mui/icons-material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const LeaveCalendarView = ({ open, onClose }) => {
  const theme = useTheme();
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Sample leave data
  const leaveEvents = [
    {
      id: 'holiday-1',
      title: 'Public Holiday',
      start: '2025-06-28',
      allDay: true,
      backgroundColor: theme.palette.warning.light,
      borderColor: theme.palette.warning.main,
      textColor: theme.palette.warning.contrastText,
      extendedProps: {
        type: 'holiday',
        description: 'Company-wide public holiday'
      }
    },
    {
      id: 'holiday-2',
      title: 'Public Holiday',
      start: '2025-06-29',
      allDay: true,
      backgroundColor: theme.palette.warning.light,
      borderColor: theme.palette.warning.main,
      textColor: theme.palette.warning.contrastText,
      extendedProps: {
        type: 'holiday',
        description: 'Company-wide public holiday'
      }
    },
    {
      id: 'casual-leave-1',
      title: 'Casual Leave',
      start: '2025-06-30',
      allDay: true,
      backgroundColor: theme.palette.primary.light,
      borderColor: theme.palette.primary.main,
      textColor: theme.palette.primary.contrastText,
      extendedProps: {
        type: 'casual',
        description: 'Personal day off',
        status: 'approved'
      }
    }
  ];

  const handleEventClick = (clickInfo) => {
    setSelectedEvent({
      title: clickInfo.event.title,
      start: clickInfo.event.start,
      end: clickInfo.event.end,
      allDay: clickInfo.event.allDay,
      ...clickInfo.event.extendedProps
    });
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: {
          height: '80vh',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        Leave Calendar
        <IconButton 
          edge="end" 
          color="inherit" 
          onClick={onClose}
          aria-label="close"
        >
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers sx={{ flex: 1, p: 0 }}>
        <Box sx={{ height: '100%', p: 2 }}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={leaveEvents}
            eventClick={handleEventClick}
            eventContent={(eventInfo) => (
              <Box sx={{ 
                p: 0.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                <Typography variant="caption" component="div" noWrap>
                  {eventInfo.event.title}
                </Typography>
              </Box>
            )}
            height="100%"
            nowIndicator
            dayHeaderFormat={{ weekday: 'short' }}
            eventDisplay="block"
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }}
          />
        </Box>
      </DialogContent>

      {/* Event Details Modal */}
      <Dialog
        open={Boolean(selectedEvent)}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {selectedEvent?.title}
          <IconButton 
            edge="end" 
            color="inherit" 
            onClick={handleCloseModal}
            aria-label="close"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent dividers sx={{ py: 2 }}>
          {selectedEvent && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <AccessTime color="primary" />
                <Box>
                  <Typography variant="body1" fontWeight="medium">
                    {selectedEvent.allDay ? 'All Day' : 
                      `${selectedEvent.start?.toLocaleTimeString()} - ${selectedEvent.end?.toLocaleTimeString()}`
                    }
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedEvent.start?.toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Info color="primary" />
                <Box>
                  <Typography variant="body1" fontWeight="medium">
                    Description
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedEvent.description || 'No description provided'}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <CalendarToday color="primary" />
                <Box>
                  <Typography variant="body1" fontWeight="medium">
                    Leave Type
                  </Typography>
                  <Chip 
                    label={selectedEvent.type === 'holiday' ? 'Holiday' : 'Casual Leave'}
                    color={selectedEvent.type === 'holiday' ? 'warning' : 'primary'}
                    size="small"
                  />
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default LeaveCalendarView;