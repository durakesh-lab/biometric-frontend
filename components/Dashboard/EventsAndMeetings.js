import React from "react";
import { List, ListItem, ListItemText, Divider, Typography } from "@mui/material";

export default function EventsAndMeetings() {
  const events = [
    { id: 1, title: "Marketing Meeting", time: "8:00 am 07/05/2024" },
    { id: 2, title: "Development meeting", time: "10:00 am 08/05/2024" },
    { id: 3, title: "Job interview", time: "11:30 am 10/05/2024" },
    { id: 4, title: "Meeting with Designer", time: "13:00 pm 11/05/2024" },
  ];

  return (
    <List disablePadding>
      {events.map((event, idx) => (
        <React.Fragment key={event.id}>
          <ListItem disablePadding sx={{ py: 1.5 }}>
            <ListItemText
              primary={
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {event.title}
                </Typography>
              }
              secondary={event.time}
            />
          </ListItem>
          {idx < events.length - 1 && <Divider component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
}