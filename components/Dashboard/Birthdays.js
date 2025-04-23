import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  Avatar,
  Box,
  Button,
  Menu,
  MenuItem
} from "@mui/material";
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { format, isThisWeek, isAfter, isBefore, addYears } from "date-fns";
import axios from "axios";

export default function Birthdays() {
  const [employeesPosition, setEmployeesPosition] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOption, setSelectedOption] = useState("This Week");
  const [filter, setFilter] = useState("this_week");

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const params = {
        page: 1,
        page_size: 100000,
      };

      const token = localStorage.getItem("token");
      const responseForPosition = await axios.get(
        `http://localhost:7000/employee/wer`, {
          headers: { Authorization: token },
          params
        }
      );
      setEmployeesPosition(responseForPosition.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const getFilteredBirthdays = () => {
    const today = new Date();
    const currentYear = today.getFullYear();

    return employeesPosition.filter((person) => {
      if (!person.birthday) return false;
      
      const birthDate = new Date(person.birthday);
      const birthMonth = birthDate.getMonth();
      const birthDay = birthDate.getDate();
      
      // Create date for this year's birthday
      const birthdayThisYear = new Date(currentYear, birthMonth, birthDay);
      // Create date for next year's birthday (for week wrapping)
      const birthdayNextYear = new Date(currentYear + 1, birthMonth, birthDay);

      if (filter === "this_week") {
        return isThisWeek(birthdayThisYear, { weekStartsOn: 1 }) || 
               isThisWeek(birthdayNextYear, { weekStartsOn: 1 });
      } 
      else if (filter === "this_month") {
        return birthMonth === today.getMonth();
      } 
      else if (filter === "this_year") {
        return true; // Show all birthdays for "this year" filter
      }
      
      return true;
    });
  };

  const sortBirthdays = (birthdays) => {
    const today = new Date();
    const currentYear = today.getFullYear();

    return [...birthdays].sort((a, b) => {
      const dateA = new Date(a.birthday);
      const dateB = new Date(b.birthday);
      
      // Create dates for this year
      const aThisYear = new Date(currentYear, dateA.getMonth(), dateA.getDate());
      const bThisYear = new Date(currentYear, dateB.getMonth(), dateB.getDate());
      
      // If one is in the future and one is in the past, future comes first
      if (aThisYear < today && bThisYear >= today) return 1;
      if (aThisYear >= today && bThisYear < today) return -1;
      
      // Otherwise sort by date
      return aThisYear - bThisYear;
    });
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (option) => {
    if (option) {
      setSelectedOption(option);
      const value = option.toLowerCase().replace(" ", "_");
      setFilter(value);
    }
    setAnchorEl(null);
  };

  const filteredBirthdays = sortBirthdays(getFilteredBirthdays());

  return (
    <Box sx={{ height: "300px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Birthdays
        </Typography>
        <>
          <Button
            startIcon={<CalendarTodayOutlinedIcon sx={{ color: "text.secondary" }} />}
            endIcon={<KeyboardArrowDownOutlinedIcon sx={{ color: "text.secondary" }} />}
            onClick={handleClick}
            sx={{
              backgroundColor: "#f5f5f5",
              color: "text.secondary",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#e0e0e0",
              },
            }}
          >
            <Typography variant="body2">{selectedOption}</Typography>
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => handleClose(null)}
          >
            {["This Week", "This Month", "This Year"].map((option) => (
              <MenuItem
                key={option}
                onClick={() => handleClose(option)}
                selected={option === selectedOption}
              >
                {option}
              </MenuItem>
            ))}
          </Menu>
        </>
      </Box>

      <Box sx={{ overflowY: "auto", height: "calc(100% - 60px)" }}>
        <List disablePadding>
          {loading ? (
            <Typography variant="body2" color="text.secondary">
              Loading...
            </Typography>
          ) : filteredBirthdays.length > 0 ? (
            filteredBirthdays.map((person, idx) => (
              <React.Fragment key={person.id}>
                <ListItem disablePadding sx={{ py: 1.5 }}>
                  <Avatar sx={{ mr: 2, bgcolor: "#ECFDF5", color: "#10B981" }}>
                    {person.first_name?.charAt(0) || '?'}
                  </Avatar>
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {person.first_name || 'Unknown'}
                      </Typography>
                    }
                    secondary={
                      `${person.position?.position_name || 'No position'} - ${format(
                        new Date(person.birthday),
                        "dd/MM/yyyy"
                      )}`
                    }
                  />
                </ListItem>
                {idx < filteredBirthdays.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No birthdays found for {selectedOption.toLowerCase()}.
            </Typography>
          )}
        </List>
      </Box>
    </Box>
  );
}