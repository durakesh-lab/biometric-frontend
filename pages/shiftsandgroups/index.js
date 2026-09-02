import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Grid,
  Snackbar,
  Alert,
  Chip,
  Tabs,
  Tab,
  Card,
  CardContent,
  Divider,
  Avatar,
  AvatarGroup,
  InputLabel,
  Checkbox,
  InputAdornment,
  TablePagination,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupsIcon from "@mui/icons-material/Groups";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import BusinessIcon from "@mui/icons-material/Business";
import FilterListIcon from "@mui/icons-material/FilterList";
import DvrIcon from "@mui/icons-material/Dvr";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import BoltIcon from "@mui/icons-material/Bolt";
import Layout from "../../components/Layout/Layout";

export default function ShiftsAndGroupsPage() {
  const [currentTab, setCurrentTab] = useState(0);
  const [snackbar, setSnackbar] = useState(null);

  // Top Company Selector Context State
  const [selectedCompanyId, setSelectedCompanyId] = useState("comp-1");

  // Mock Companies
  const mockCompanies = [
    { id: "comp-1", name: "TechCorp Solutions Pvt Ltd" },
    { id: "comp-2", name: "Global Enterprise Ltd" },
  ];

  // Registered Hardware Devices (Exact Device Names & Locations matching Device Assignment & Enrollment)
  const mockDevices = [
    { id: "dev-1", name: "Zk-F09", serialNumber: "ZK-F09-DEMO-001", location: "Main Gate" },
    { id: "dev-2", name: "ZKTeco F09 Terminal 1", serialNumber: "ZK-F09-DEMO-002", location: "Floor 1 - Main Entrance" },
    { id: "dev-3", name: "ZKTeco F09 Terminal 2", serialNumber: "ZK-F09-DEMO-003", location: "Floor 2 - Server Room" },
    { id: "dev-4", name: "ZKTeco K45 Terminal 3", serialNumber: "ZK-K45-DEMO-004", location: "Floor 3 - HR Block" },
    { id: "dev-5", name: "ZKTeco F09 Terminal 4", serialNumber: "ZK-F09-DEMO-005", location: "Floor 4 - Executive Gate" },
    { id: "dev-6", name: "ZKTeco F09 Terminal 5", serialNumber: "ZK-F09-DEMO-006", location: "Floor 5 - Cafeteria" },
  ];

  // Mock Branches (Used only in Manage Members filter table)
  const mockBranches = [
    { id: "all", name: "All Branches (Cross-Branch)" },
    { id: "branch-1", name: "Headquarters (HQ Branch)", companyId: "comp-1" },
    { id: "branch-2", name: "West Zone Branch", companyId: "comp-1" },
  ];

  // Mock Departments (Used only in Manage Members filter table)
  const mockDepartments = [
    { id: "all", name: "All Departments (Cross-Department)" },
    { id: "dept-1", name: "Engineering & IT", branchId: "branch-1" },
    { id: "dept-2", name: "Human Resources (HR)", branchId: "branch-1" },
    { id: "dept-3", name: "Operations & Field Services", branchId: "branch-2" },
  ];

  // Work Shifts State (24-Hour Format: 08:00 - 13:00, 17:00 - 21:00, etc.)
  const [shifts, setShifts] = useState([
    {
      id: "shift-1",
      code: "SHIFT-MORN-01",
      name: "Morning Shift (Main Gate)",
      companyId: "comp-1",
      startTime: "08:00",
      endTime: "13:00",
      durationHours: 5,
      workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      deviceIds: ["dev-1"],
      deviceNames: ["Zk-F09 (Location: Main Gate)"],
      status: "Active",
    },
    {
      id: "shift-2",
      code: "SHIFT-EVE-02",
      name: "Evening Shift (Floor 1 Entrance)",
      companyId: "comp-1",
      startTime: "17:00",
      endTime: "21:00",
      durationHours: 4,
      workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      deviceIds: ["dev-2"],
      deviceNames: ["ZKTeco F09 Terminal 1 (Location: Floor 1 - Main Entrance)"],
      status: "Active",
    },
  ]);

  // Shift Groups State (Clean & Flexible: Stores Group Name, Shift(s) & Enrolled Employees)
  const [groups, setGroups] = useState([
    {
      id: "group-1",
      code: "GRP-TECH-01",
      name: "Field Technicians Taskforce",
      companyId: "comp-1",
      assignedShiftIds: ["shift-1", "shift-2"],
      assignedShiftNames: [
        "Morning Shift (Main Gate) (08:00 - 13:00)",
        "Evening Shift (Floor 1 Entrance) (17:00 - 21:00)",
      ],
      members: [
        { name: "Paromita OBI", empCode: "4", branch: "HQ Branch", dept: "Engineering & IT", avatar: "P" },
        { name: "Rahul Sharma", empCode: "zktb12346", branch: "West Zone Branch", dept: "Operations & Field Services", avatar: "R" },
        { name: "John Smith", empCode: "30", branch: "HQ Branch", dept: "Engineering & IT", avatar: "J" },
        { name: "Amit Kumar", empCode: "106", branch: "West Zone Branch", dept: "Operations & Field Services", avatar: "A" },
      ],
      status: "Active",
    },
    {
      id: "group-2",
      code: "GRP-MGMT-02",
      name: "Executive Management Team",
      companyId: "comp-1",
      assignedShiftIds: ["shift-1"],
      assignedShiftNames: ["Morning Shift (Main Gate) (08:00 - 13:00)"],
      members: [
        { name: "Priya Verma", empCode: "105", branch: "HQ Branch", dept: "Human Resources (HR)", avatar: "P" },
        { name: "Amit Kumar", empCode: "106", branch: "West Zone Branch", dept: "Operations & Field Services", avatar: "A" },
      ],
      status: "Active",
    },
  ]);

  // Employee Pool for Rich Table Selection matching Employee Directory Schema (SN, First Name, Last Name, Email, Device ID, Linked Devices)
  const availableEmployeesPool = [
    {
      sn: 1,
      empCode: "4",
      firstName: "Paromita",
      lastName: "OBI",
      email: "paromita.obi@techcorp.com",
      branchId: "branch-1",
      branchName: "HQ Branch",
      departmentId: "dept-1",
      departmentName: "Engineering & IT",
      currentGroup: "Field Technicians Taskforce",
      linkedDevices: ["Zk-F09 (Main Gate)", "ZKTeco F09 Terminal 1"],
    },
    {
      sn: 2,
      empCode: "zktb12346",
      firstName: "Rahul",
      lastName: "Sharma",
      email: "rahul.sharma@techcorp.com",
      branchId: "branch-2",
      branchName: "West Zone Branch",
      departmentId: "dept-3",
      departmentName: "Operations & Field Services",
      currentGroup: "Field Technicians Taskforce",
      linkedDevices: ["Zk-F09 (Main Gate)", "ZKTeco F09 Terminal 1"],
    },
    {
      sn: 3,
      empCode: "30",
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@techcorp.com",
      branchId: "branch-1",
      branchName: "HQ Branch",
      departmentId: "dept-1",
      departmentName: "Engineering & IT",
      currentGroup: "Field Technicians Taskforce",
      linkedDevices: ["Zk-F09 (Main Gate)"],
    },
    {
      sn: 4,
      empCode: "105",
      firstName: "Priya",
      lastName: "Verma",
      email: "priya.verma@techcorp.com",
      branchId: "branch-1",
      branchName: "HQ Branch",
      departmentId: "dept-2",
      departmentName: "Human Resources (HR)",
      currentGroup: "Executive Management Team",
      linkedDevices: ["ZKTeco K45 Terminal 3 (HR Block)"],
    },
    {
      sn: 5,
      empCode: "106",
      firstName: "Amit",
      lastName: "Kumar",
      email: "amit.kumar@techcorp.com",
      branchId: "branch-2",
      branchName: "West Zone Branch",
      departmentId: "dept-3",
      departmentName: "Operations & Field Services",
      currentGroup: "Unassigned ⚪",
      linkedDevices: ["Unassigned ⚪"],
    },
    {
      sn: 6,
      empCode: "107",
      firstName: "Vikram",
      lastName: "Singh",
      email: "vikram.singh@techcorp.com",
      branchId: "branch-1",
      branchName: "HQ Branch",
      departmentId: "dept-1",
      departmentName: "Engineering & IT",
      currentGroup: "Unassigned ⚪",
      linkedDevices: ["Unassigned ⚪"],
    },
  ];

  // Modal States
  const [shiftModalOpen, setShiftModalOpen] = useState(false);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [membersModalOpen, setMembersModalOpen] = useState(false);

  const [editingShift, setEditingShift] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);

  // Manage Group Members Modal States
  const [selectedGroupForMembers, setSelectedGroupForMembers] = useState(null);
  const [selectedMemberCodes, setSelectedMemberCodes] = useState([]);
  const [tableSearchQuery, setTableSearchQuery] = useState("");
  const [tableBranchFilter, setTableBranchFilter] = useState("all");
  const [tableDeptFilter, setTableDeptFilter] = useState("all");

  // Shift Form (24-Hour Timings: 08:00, 16:00, with Location Devices Dropdown)
  const [shiftForm, setShiftForm] = useState({
    name: "Morning Shift",
    startTime: "08:00",
    endTime: "13:00",
    workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    deviceIds: ["dev-1"],
  });

  // Group Form (Ultra-Clean: Group Name + Primary & Secondary/Split Shift Selectors)
  const [groupForm, setGroupForm] = useState({
    name: "Field Technicians Taskforce",
    primaryShiftId: "shift-1",
    secondaryShiftId: "none",
  });

  const toggleWorkingDay = (day) => {
    setShiftForm((prev) => {
      const exists = prev.workingDays.includes(day);
      const updated = exists
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day];
      return { ...prev, workingDays: updated };
    });
  };

  const handleOpenAddShift = () => {
    setEditingShift(null);
    setShiftForm({
      name: "Evening Shift (Floor 1 Entrance)",
      startTime: "17:00",
      endTime: "21:00",
      workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      deviceIds: ["dev-2"],
    });
    setShiftModalOpen(true);
  };

  const handleOpenEditShift = (shift) => {
    setEditingShift(shift);
    setShiftForm({
      name: shift.name,
      startTime: shift.startTime,
      endTime: shift.endTime,
      workingDays: shift.workingDays || ["Mon", "Tue", "Wed", "Thu", "Fri"],
      deviceIds: shift.deviceIds || ["dev-1"],
    });
    setShiftModalOpen(true);
  };

  const handleSaveShift = () => {
    const selectedDevObjs = mockDevices.filter((d) => shiftForm.deviceIds.includes(d.id));
    const devNames = selectedDevObjs.map((d) => `${d.name} (Location: ${d.location})`);

    if (editingShift) {
      setShifts((prev) =>
        prev.map((s) =>
          s.id === editingShift.id
            ? {
                ...s,
                name: shiftForm.name,
                startTime: shiftForm.startTime,
                endTime: shiftForm.endTime,
                workingDays: shiftForm.workingDays,
                deviceIds: shiftForm.deviceIds,
                deviceNames: devNames,
              }
            : s
        )
      );
      setSnackbar({ status: true, message: "Work shift schedule updated (24h format)!" });
    } else {
      const newShift = {
        id: `shift-${Date.now()}`,
        code: `SHIFT-SEC-${shifts.length + 1}`,
        name: shiftForm.name,
        companyId: selectedCompanyId,
        startTime: shiftForm.startTime,
        endTime: shiftForm.endTime,
        durationHours: 5,
        workingDays: shiftForm.workingDays,
        deviceIds: shiftForm.deviceIds,
        deviceNames: devNames,
        status: "Active",
      };
      setShifts((prev) => [...prev, newShift]);
      setSnackbar({ status: true, message: "New 24h work shift created with device location restrictions!" });
    }
    setShiftModalOpen(false);
  };

  const handleOpenAddGroup = () => {
    setEditingGroup(null);
    setGroupForm({
      name: "New Taskforce Group",
      primaryShiftId: "shift-1",
      secondaryShiftId: "none",
    });
    setGroupModalOpen(true);
  };

  const handleOpenEditGroup = (group) => {
    setEditingGroup(group);
    setGroupForm({
      name: group.name,
      primaryShiftId: group.assignedShiftIds[0] || "shift-1",
      secondaryShiftId: group.assignedShiftIds[1] || "none",
    });
    setGroupModalOpen(true);
  };

  // Helper function to convert 24h HH:mm string to total minutes
  const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  // Helper function to check if two shifts overlap
  const isShiftOverlap = (shift1, shift2) => {
    if (!shift1 || !shift2) return false;
    const start1 = timeToMinutes(shift1.startTime);
    const end1 = timeToMinutes(shift1.endTime);
    const start2 = timeToMinutes(shift2.startTime);
    const end2 = timeToMinutes(shift2.endTime);

    return start1 < end2 && start2 < end1;
  };

  const handleSaveGroup = () => {
    const selectedShiftIds = [groupForm.primaryShiftId];
    if (groupForm.secondaryShiftId && groupForm.secondaryShiftId !== "none") {
      if (groupForm.primaryShiftId === groupForm.secondaryShiftId) {
        setSnackbar({
          status: true,
          severity: "error",
          message: "❌ Primary and Secondary shifts cannot be the exact same shift schedule!",
        });
        return;
      }

      const primaryShift = shifts.find((s) => s.id === groupForm.primaryShiftId);
      const secondaryShift = shifts.find((s) => s.id === groupForm.secondaryShiftId);

      if (isShiftOverlap(primaryShift, secondaryShift)) {
        setSnackbar({
          status: true,
          severity: "error",
          message: `❌ Shift Overlap Conflict: Primary shift (${primaryShift.startTime}-${primaryShift.endTime}) overlaps with Secondary shift (${secondaryShift.startTime}-${secondaryShift.endTime})! Please choose non-overlapping shift times.`,
        });
        return;
      }

      selectedShiftIds.push(groupForm.secondaryShiftId);
    }

    const assignedShifts = shifts.filter((s) => selectedShiftIds.includes(s.id));
    const assignedShiftNames = assignedShifts.map((s) => `${s.name} (${s.startTime} - ${s.endTime})`);

    if (editingGroup) {
      setGroups((prev) =>
        prev.map((g) =>
          g.id === editingGroup.id
            ? {
                ...g,
                name: groupForm.name,
                assignedShiftIds: selectedShiftIds,
                assignedShiftNames: assignedShiftNames,
              }
            : g
        )
      );
      setSnackbar({ status: true, severity: "success", message: "Shift group updated!" });
    } else {
      const newGroup = {
        id: `group-${Date.now()}`,
        code: `GRP-${groups.length + 1}`,
        name: groupForm.name,
        companyId: selectedCompanyId,
        assignedShiftIds: selectedShiftIds,
        assignedShiftNames: assignedShiftNames,
        members: [],
        status: "Active",
      };
      setGroups((prev) => [...prev, newGroup]);
      setSnackbar({ status: true, severity: "success", message: "New shift group created!" });
    }
    setGroupModalOpen(false);
  };

  // Manage Group Members Modal (Enforcing Strict Single Group Membership Rule)
  const handleOpenManageMembers = (group) => {
    setSelectedGroupForMembers(group);
    setSelectedMemberCodes(group.members.map((m) => m.empCode));
    setTableSearchQuery("");
    setTableBranchFilter("all");
    setTableDeptFilter("all");
    setMembersModalOpen(true);
  };

  const handleToggleMember = (empCode) => {
    setSelectedMemberCodes((prev) =>
      prev.includes(empCode)
        ? prev.filter((c) => c !== empCode)
        : [...prev, empCode]
    );
  };

  const handleSaveMembers = () => {
    const targetGroupId = selectedGroupForMembers.id;

    // Check for any selected employee who ALREADY belongs to another group (preventing auto-removal, requiring manual removal)
    const conflictingEmployee = availableEmployeesPool.find((emp) => {
      if (!selectedMemberCodes.includes(emp.empCode)) return false;
      return groups.some(
        (g) => g.id !== targetGroupId && g.members.some((m) => m.empCode === emp.empCode)
      );
    });

    if (conflictingEmployee) {
      const existingGroup = groups.find(
        (g) => g.id !== targetGroupId && g.members.some((m) => m.empCode === conflictingEmployee.empCode)
      );

      setSnackbar({
        status: true,
        severity: "error",
        message: `❌ Group Conflict Error: ${conflictingEmployee.firstName} ${conflictingEmployee.lastName} (ID: ${conflictingEmployee.empCode}) is already assigned to group "${existingGroup?.name}". Please manually remove them from "${existingGroup?.name}" first before adding them here.`,
      });
      return;
    }

    const updatedMembers = availableEmployeesPool
      .filter((emp) => selectedMemberCodes.includes(emp.empCode))
      .map((emp) => ({
        name: `${emp.firstName} ${emp.lastName}`,
        empCode: emp.empCode,
        branch: emp.branchName,
        dept: emp.departmentName,
        avatar: emp.firstName.charAt(0),
      }));

    setGroups((prevGroups) =>
      prevGroups.map((g) => (g.id === targetGroupId ? { ...g, members: updatedMembers } : g))
    );

    setSnackbar({
      status: true,
      severity: "success",
      message: `💡 Saved! Group members and location device permissions updated for ${updatedMembers.length} Employees in software.`,
    });
    setMembersModalOpen(false);
  };

  // Helper calculation functions for Work Shift Cards (DYNAMIC COUNTS)
  const getEmployeeGroupsAndDevices = (empCode) => {
    const assignedGroupNames = [];
    const assignedDeviceNames = new Set();

    groups.forEach((g) => {
      if (g.members.some((m) => m.empCode === empCode)) {
        assignedGroupNames.push(g.name);

        g.assignedShiftIds.forEach((shiftId) => {
          const shift = shifts.find((s) => s.id === shiftId);
          if (shift && shift.deviceNames) {
            shift.deviceNames.forEach((d) => assignedDeviceNames.add(d));
          }
        });
      }
    });

    return {
      groupsList: assignedGroupNames.length > 0 ? assignedGroupNames : ["Unassigned ⚪"],
      devicesList: assignedDeviceNames.size > 0 ? Array.from(assignedDeviceNames) : ["Unassigned ⚪"],
    };
  };

  const getAssignedGroupsForShift = (shiftId) => {
    return groups.filter((g) => g.assignedShiftIds.includes(shiftId));
  };

  const getAssignedGroupCountForShift = (shiftId) => {
    return getAssignedGroupsForShift(shiftId).length;
  };

  const getTotalEmployeeCountForShift = (shiftId) => {
    const assignedGroups = getAssignedGroupsForShift(shiftId);
    const empCodes = new Set();
    assignedGroups.forEach((g) => {
      g.members.forEach((m) => empCodes.add(m.empCode));
    });
    return empCodes.size;
  };

  const selectedCompanyObj = mockCompanies.find((c) => c.id === selectedCompanyId);
  const filteredShifts = shifts.filter((s) => s.companyId === selectedCompanyId);
  const filteredGroups = groups.filter((g) => g.companyId === selectedCompanyId);

  return (
    <Layout>
      <Box sx={{ my: 3 }}>
        {/* TOP COMPANY SELECTOR BAR */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: "12px",
            border: "1px solid #0E9F6E",
            bgcolor: "#F0FDF4",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box display="flex" alignItems="center" gap={1.5}>
            <BusinessIcon sx={{ color: "#0E9F6E", fontSize: 28 }} />
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#047857", textTransform: "uppercase", letterSpacing: 0.5 }}>
                Active Working Organization Context
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#1F2937", lineHeight: 1.2 }}>
                {selectedCompanyObj?.name}
              </Typography>
            </Box>
          </Box>

          <FormControl size="small" sx={{ minWidth: 280, bgcolor: "#FFFFFF", borderRadius: "8px" }}>
            <InputLabel sx={{ fontWeight: 600 }}>Select Company Context</InputLabel>
            <Select
              label="Select Company Context"
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              sx={{ borderRadius: "8px", fontWeight: 600 }}
            >
              {mockCompanies.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  🏢 {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>

        {/* Page Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          flexWrap="wrap"
          rowGap={2}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Shifts &amp; Groups Management
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              Configure 24-hour shift schedules, assign device location restrictions, and manage shift groups for {selectedCompanyObj?.name}.
            </Typography>
          </Box>

          <Box display="flex" gap={1.5}>
            <Button
              variant="outlined"
              onClick={handleOpenAddShift}
              startIcon={<AddIcon />}
              sx={{
                textTransform: "none",
                borderColor: "#0E9F6E",
                color: "#0E9F6E",
                fontWeight: 600,
                borderRadius: "8px",
                "&:hover": { borderColor: "#047857", bgcolor: "#E6F6F0" },
              }}
            >
              Add Shift Template (24h)
            </Button>
            <Button
              variant="contained"
              onClick={handleOpenAddGroup}
              startIcon={<AddIcon />}
              sx={{
                textTransform: "none",
                backgroundColor: "#0E9F6E",
                fontWeight: 600,
                borderRadius: "8px",
                "&:hover": { backgroundColor: "#047857" },
              }}
            >
              Add Shift Group
            </Button>
          </Box>
        </Box>

        {/* Tab Navigation */}
        <Paper elevation={0} sx={{ border: "1px solid #E5E7EB", borderRadius: "12px", mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={(e, val) => setCurrentTab(val)}
            sx={{
              px: 2,
              "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: "14px", py: 2 },
              "& .Mui-selected": { color: "#0E9F6E" },
              "& .MuiTabs-indicator": { backgroundColor: "#0E9F6E" },
            }}
          >
            <Tab
              icon={<AccessTimeIcon fontSize="small" />}
              iconPosition="start"
              label={`1. Work Shift Templates (${filteredShifts.length})`}
            />
            <Tab
              icon={<GroupsIcon fontSize="small" />}
              iconPosition="start"
              label={`2. Shift Groups & Assignments (${filteredGroups.length})`}
            />
          </Tabs>
        </Paper>

        {/* TAB 0: REUSABLE 24-HOUR WORK SHIFTS WITH DYNAMIC GROUP & EMPLOYEE COUNTS */}
        {currentTab === 0 && (
          <Grid container spacing={3}>
            {filteredShifts.map((shift) => {
              const assignedGroupCount = getAssignedGroupCountForShift(shift.id);
              const totalEmployeesCovered = getTotalEmployeeCountForShift(shift.id);

              return (
                <Grid item xs={12} md={6} lg={4} key={shift.id}>
                  <Card
                    variant="outlined"
                    sx={{
                      borderRadius: "12px",
                      borderColor: "#E5E7EB",
                      transition: "all 0.2s ease",
                      "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.06)", borderColor: "#0E9F6E" },
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                        <Box>
                          <Chip
                            label={shift.code}
                            size="small"
                            sx={{ bgcolor: "#E6F6F0", color: "#0E9F6E", fontWeight: 700, mb: 0.5, fontSize: 11 }}
                          />
                          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "16px" }}>
                            {shift.name}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 1.5 }} />

                      <Box display="flex" flexDirection="column" gap={1.2} mb={2}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "13px" }}>
                            ⏰ 24-Hour Timing:
                          </Typography>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1F2937" }}>
                            {shift.startTime} – {shift.endTime} ({shift.durationHours} Hours)
                          </Typography>
                        </Box>

                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "13px" }}>
                            📅 Working Days:
                          </Typography>
                          <Box display="flex" gap={0.5}>
                            {shift.workingDays.map((d) => (
                              <Chip key={d} label={d} size="small" sx={{ bgcolor: "#F3F4F6", height: 20, fontSize: 10, fontWeight: 600 }} />
                            ))}
                          </Box>
                        </Box>

                        {/* Device Location Restriction Display */}
                        <Box mt={0.5}>
                          <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "13px", mb: 0.5 }}>
                            📟 Allowed Attendance Devices:
                          </Typography>
                          <Box display="flex" flexWrap="wrap" gap={0.5}>
                            {shift.deviceNames && shift.deviceNames.length > 0 ? (
                              shift.deviceNames.map((dName, idx) => (
                                <Chip
                                  key={idx}
                                  icon={<DvrIcon style={{ fontSize: 13, color: "#0284C7" }} />}
                                  label={dName}
                                  size="small"
                                  sx={{ bgcolor: "#E0F2FE", color: "#0369A1", fontWeight: 600, height: 22, fontSize: 11 }}
                                />
                              ))
                            ) : (
                              <Chip label="All Company Devices" size="small" sx={{ bgcolor: "#F3F4F6", height: 20, fontSize: 10 }} />
                            )}
                          </Box>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 1.5 }} />

                      {/* DYNAMIC GROUP & EMPLOYEE COUNTER BADGES */}
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" gap={1} flexWrap="wrap">
                          <Tooltip title="Total Shift Groups assigned to this shift">
                            <Chip
                              icon={<GroupsIcon style={{ fontSize: 14, color: "#0E9F6E" }} />}
                              label={`${assignedGroupCount} Group${assignedGroupCount === 1 ? "" : "s"}`}
                              size="small"
                              sx={{ bgcolor: "#F0FDF4", color: "#047857", fontWeight: 700, fontSize: 11 }}
                            />
                          </Tooltip>

                          <Tooltip title="Total Employee Count covered across all assigned groups">
                            <Chip
                              icon={<PeopleIcon style={{ fontSize: 14, color: "#2563EB" }} />}
                              label={`${totalEmployeesCovered} Employee${totalEmployeesCovered === 1 ? "" : "s"}`}
                              size="small"
                              sx={{ bgcolor: "#EFF6FF", color: "#1D4ED8", fontWeight: 700, fontSize: 11 }}
                            />
                          </Tooltip>
                        </Box>

                        <Box>
                          <IconButton size="small" onClick={() => handleOpenEditShift(shift)} sx={{ color: "#3B82F6" }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" sx={{ color: "#EF4444" }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* TAB 1: SHIFT GROUPS */}
        {currentTab === 1 && (
          <Grid container spacing={3}>
            {filteredGroups.map((group) => (
              <Grid item xs={12} md={6} key={group.id}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: "12px",
                    borderColor: "#E5E7EB",
                    transition: "all 0.2s ease",
                    "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.06)", borderColor: "#0E9F6E" },
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                      <Box>
                        <Chip
                          label={group.code}
                          size="small"
                          sx={{ bgcolor: "#E0F2FE", color: "#0369A1", fontWeight: 700, mb: 0.5, fontSize: 11 }}
                        />
                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "17px" }}>
                          {group.name}
                        </Typography>
                      </Box>
                      <Box display="flex" gap={0.5} alignItems="center">
                        <Chip
                          label={group.assignedShiftIds.length === 1 ? "1 Shift (Single)" : `${group.assignedShiftIds.length} Shifts (Split Set)`}
                          size="small"
                          sx={{
                            bgcolor: group.assignedShiftIds.length === 1 ? "#E0F2FE" : "#F3E8FF",
                            color: group.assignedShiftIds.length === 1 ? "#0369A1" : "#6B21A8",
                            fontWeight: 700,
                            height: 22,
                            fontSize: 11,
                          }}
                        />
                      </Box>
                    </Box>

                    <Divider sx={{ my: 1.5 }} />

                    <Box display="flex" flexDirection="column" gap={1.2} mb={2}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "13px" }}>
                          🕒 Total Shift Set ({group.assignedShiftIds.length}):
                        </Typography>
                        <Box textAlign="right">
                          {group.assignedShiftNames.map((sName, idx) => (
                            <Chip
                              key={idx}
                              label={sName}
                              size="small"
                              sx={{
                                bgcolor: group.assignedShiftIds.length > 1 ? "#F3E8FF" : "#E6F6F0",
                                color: group.assignedShiftIds.length > 1 ? "#6B21A8" : "#0E9F6E",
                                fontWeight: 700,
                                height: 22,
                                fontSize: 11,
                                ml: 0.5,
                                mb: 0.5,
                              }}
                            />
                          ))}
                        </Box>
                      </Box>

                      <Box mt={1}>
                        <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "13px", mb: 1 }}>
                          👥 Enrolled Group Staff ({group.members.length} Members):
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                          <AvatarGroup max={4} sx={{ "& .MuiAvatar-root": { width: 32, height: 32, fontSize: 12, bgcolor: "#0E9F6E" } }}>
                            {group.members.map((m) => (
                              <Avatar key={m.empCode} alt={m.name}>
                                {m.avatar}
                              </Avatar>
                            ))}
                          </AvatarGroup>
                          <Box>
                            {group.members.map((m) => (
                              <Chip
                                key={m.empCode}
                                label={`${m.name} (${m.empCode})`}
                                size="small"
                                sx={{ bgcolor: "#F3F4F6", mr: 0.5, mb: 0.5, height: 22, fontSize: 11 }}
                              />
                            ))}
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 1.5 }} />

                    <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                      <Button
                        size="small"
                        onClick={() => handleOpenManageMembers(group)}
                        startIcon={<PersonAddIcon fontSize="small" />}
                        sx={{ textTransform: "none", color: "#0E9F6E", fontWeight: 600 }}
                      >
                        Manage Members Table
                      </Button>

                      <Box>
                        <IconButton size="small" onClick={() => handleOpenEditGroup(group)} sx={{ color: "#3B82F6" }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ color: "#EF4444" }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Modal: Add/Edit Work Shift (24-Hour Format & Device Location Selection) */}
        <Dialog open={shiftModalOpen} onClose={() => setShiftModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700 }}>
            {editingShift ? "Edit Work Shift (24h Format & Device Locations)" : "Create New Work Shift (24h Format & Device Locations)"}
          </DialogTitle>
          <DialogContent dividers sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Shift Name"
                  value={shiftForm.name}
                  onChange={(e) => setShiftForm({ ...shiftForm, name: e.target.value })}
                  placeholder="e.g. Morning Shift (Main Gate)"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Start Time (24h Format HH:mm)"
                  value={shiftForm.startTime}
                  onChange={(e) => setShiftForm({ ...shiftForm, startTime: e.target.value })}
                  placeholder="08:00"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="End Time (24h Format HH:mm)"
                  value={shiftForm.endTime}
                  onChange={(e) => setShiftForm({ ...shiftForm, endTime: e.target.value })}
                  placeholder="16:00"
                />
              </Grid>

              {/* Device Selection Dropdown for Location Restriction */}
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel>Allowed Attendance Biometric Devices (Location Restriction)</InputLabel>
                  <Select
                    multiple
                    label="Allowed Attendance Biometric Devices (Location Restriction)"
                    value={shiftForm.deviceIds}
                    onChange={(e) => setShiftForm({ ...shiftForm, deviceIds: e.target.value })}
                    renderValue={(selected) =>
                      selected
                        .map((id) => {
                          const d = mockDevices.find((x) => x.id === id);
                          return d ? `${d.name} (${d.location})` : id;
                        })
                        .join(", ")
                    }
                  >
                    {mockDevices.map((d) => (
                      <MenuItem key={d.id} value={d.id}>
                        <Checkbox checked={shiftForm.deviceIds.indexOf(d.id) > -1} />
                        📟 {d.name} ({d.location})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Typography variant="caption" sx={{ color: "text.secondary", mt: 0.5, display: "block" }}>
                  💡 Employees on this shift will only be permitted to log attendance on the selected hardware devices.
                </Typography>
              </Grid>

              {/* Working Days Selector */}
              <Grid item xs={12}>
                <Typography variant="caption" sx={{ fontWeight: 700, display: "block", mb: 1, color: "text.secondary" }}>
                  📅 Select Working Days:
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
                    const isSelected = shiftForm.workingDays.includes(day);
                    return (
                      <Chip
                        key={day}
                        label={day}
                        clickable
                        onClick={() => toggleWorkingDay(day)}
                        sx={{
                          bgcolor: isSelected ? "#0E9F6E" : "#F3F4F6",
                          color: isSelected ? "#FFFFFF" : "#374151",
                          fontWeight: 700,
                          borderRadius: "6px",
                          "&:hover": {
                            bgcolor: isSelected ? "#047857" : "#E5E7EB",
                          },
                        }}
                      />
                    );
                  })}
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setShiftModalOpen(false)} sx={{ textTransform: "none" }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveShift}
              sx={{ textTransform: "none", bgcolor: "#0E9F6E", "&:hover": { bgcolor: "#047857" } }}
            >
              Save 24h Shift Schedule
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal: Add/Edit Shift Group */}
        <Dialog open={groupModalOpen} onClose={() => setGroupModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700 }}>
            {editingGroup ? `Edit Shift Group — ${editingGroup.name}` : "Create New Shift Group"}
          </DialogTitle>
          <DialogContent dividers sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Group Name"
                  value={groupForm.name}
                  onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
                  placeholder="e.g. Field Technicians Taskforce / Car Sales Team"
                />
              </Grid>

              {/* Primary Working Shift Schedule */}
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel>Primary Working Shift Schedule (24h)</InputLabel>
                  <Select
                    label="Primary Working Shift Schedule (24h)"
                    value={groupForm.primaryShiftId}
                    onChange={(e) => setGroupForm({ ...groupForm, primaryShiftId: e.target.value })}
                  >
                    {filteredShifts.map((s) => (
                      <MenuItem key={s.id} value={s.id}>
                        ⏰ {s.name} ({s.startTime} - {s.endTime})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Secondary / Split Shift Schedule */}
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel>Secondary / Split Shift Schedule (Optional)</InputLabel>
                  <Select
                    label="Secondary / Split Shift Schedule (Optional)"
                    value={groupForm.secondaryShiftId}
                    onChange={(e) => setGroupForm({ ...groupForm, secondaryShiftId: e.target.value })}
                  >
                    <MenuItem value="none">
                      <em>None (Single Shift Only)</em>
                    </MenuItem>
                    {filteredShifts.map((s) => (
                      <MenuItem key={s.id} value={s.id}>
                        ⏰ {s.name} ({s.startTime} - {s.endTime})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Typography variant="caption" sx={{ color: "text.secondary", mt: 0.5, display: "block" }}>
                  💡 Supports split shifts (e.g., Morning Shift 08:00 - 13:00 + Evening Shift 17:00 - 21:00).
                </Typography>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setGroupModalOpen(false)} sx={{ textTransform: "none" }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveGroup}
              sx={{ textTransform: "none", bgcolor: "#0E9F6E", "&:hover": { bgcolor: "#047857" } }}
            >
              Save Shift Group
            </Button>
          </DialogActions>
        </Dialog>

        {/* Rich Employee Selection Data Table Modal (MATCHES EXACT REQUESTED COLUMNS: SN, First Name, Last Name, Email, Device ID, Linked Devices) */}
        <Dialog
          open={membersModalOpen}
          onClose={() => setMembersModalOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: "12px", overflow: "hidden" } }}
        >
          <DialogTitle sx={{ bgcolor: "#1F2937", color: "#FFFFFF", py: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={1.5}>
                <PersonAddIcon sx={{ color: "#10B981" }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "16px", color: "#FFFFFF" }}>
                    Manage Group Members — {selectedGroupForMembers?.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#9CA3AF" }}>
                    Select employees to assign to this group. Systems automatically generates IDs &amp; pushes to shift devices in background.
                  </Typography>
                </Box>
              </Box>
              <Chip
                label={`${selectedMemberCodes.length} Employees Selected`}
                size="small"
                sx={{ bgcolor: "#10B981", color: "#FFFFFF", fontWeight: 700 }}
              />
            </Box>
          </DialogTitle>

          <DialogContent sx={{ p: 2.5, bgcolor: "#FAFAFA" }}>
            {/* SOFTWARE-LEVEL AUTOMATED ACCESS CONTROL BANNER */}
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                mb: 2,
                borderRadius: "8px",
                border: "1px solid #10B981",
                bgcolor: "#F0FDF4",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <BoltIcon sx={{ color: "#059669" }} />
              <Typography variant="caption" sx={{ color: "#065F46", fontWeight: 600, lineHeight: 1.3 }}>
                💡 <strong>Software Access Control Active:</strong> Employee Device User IDs, Shifts, Groups, and Location Device Linkages are managed automatically in our software database. Remote hardware network sync is architecture-ready for future activation.
              </Typography>
            </Paper>

            {/* Search & Filter Controls Bar */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search employee name, email, or device ID..."
                  value={tableSearchQuery}
                  onChange={(e) => setTableSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" sx={{ color: "#9CA3AF" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ bgcolor: "#FFFFFF" }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small" sx={{ bgcolor: "#FFFFFF" }}>
                  <Select value={tableBranchFilter} onChange={(e) => setTableBranchFilter(e.target.value)}>
                    <MenuItem value="all">Filter: All Branches</MenuItem>
                    <MenuItem value="branch-1">HQ Branch</MenuItem>
                    <MenuItem value="branch-2">West Zone Branch</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small" sx={{ bgcolor: "#FFFFFF" }}>
                  <Select value={tableDeptFilter} onChange={(e) => setTableDeptFilter(e.target.value)}>
                    <MenuItem value="all">Filter: All Depts</MenuItem>
                    <MenuItem value="dept-1">Engineering &amp; IT</MenuItem>
                    <MenuItem value="dept-2">Human Resources</MenuItem>
                    <MenuItem value="dept-3">Operations</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Rich Detailed Data Table matching Employee Directory Schema (SN, First Name, Last Name, Email, Device ID, Linked Devices) */}
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: "8px", maxHeight: 340 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow sx={{ "& th": { bgcolor: "#F3F4F6", fontWeight: 700, fontSize: 12, color: "#374151" } }}>
                    <TableCell padding="checkbox">Select</TableCell>
                    <TableCell>SN.</TableCell>
                    <TableCell>First Name</TableCell>
                    <TableCell>Last Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Device ID</TableCell>
                    <TableCell>Current Group(s)</TableCell>
                    <TableCell>Linked Devices</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {availableEmployeesPool
                    .filter((emp) => {
                      const matchesSearch =
                        emp.firstName.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
                        emp.lastName.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
                        emp.email.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
                        emp.empCode.toLowerCase().includes(tableSearchQuery.toLowerCase());

                      const matchesBranch = tableBranchFilter === "all" || emp.branchId === tableBranchFilter;
                      const matchesDept = tableDeptFilter === "all" || emp.departmentId === tableDeptFilter;

                      return matchesSearch && matchesBranch && matchesDept;
                    })
                    .map((emp) => {
                      const isChecked = selectedMemberCodes.includes(emp.empCode);
                      const { groupsList, devicesList } = getEmployeeGroupsAndDevices(emp.empCode);

                      return (
                        <TableRow
                          key={emp.empCode}
                          hover
                          onClick={() => handleToggleMember(emp.empCode)}
                          sx={{ cursor: "pointer", bgcolor: isChecked ? "#E6F6F0" : "inherit" }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isChecked}
                              size="small"
                              sx={{ color: "#0E9F6E", "&.Mui-checked": { color: "#0E9F6E" } }}
                            />
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>{emp.sn}</TableCell>
                          <TableCell sx={{ fontWeight: isChecked ? 700 : 500 }}>{emp.firstName}</TableCell>
                          <TableCell sx={{ fontWeight: isChecked ? 700 : 500 }}>{emp.lastName}</TableCell>
                          <TableCell sx={{ fontSize: 12, color: "#374151" }}>{emp.email}</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: "#0E9F6E" }}>{emp.empCode}</TableCell>
                          <TableCell sx={{ fontSize: 12 }}>
                            {groupsList.map((grp, idx) => (
                              <Chip
                                key={idx}
                                label={grp}
                                size="small"
                                sx={{
                                  bgcolor: grp.includes("Unassigned") ? "#F3F4F6" : "#FEF3C7",
                                  color: grp.includes("Unassigned") ? "#6B7280" : "#92400E",
                                  mr: 0.5,
                                  mb: 0.5,
                                  height: 20,
                                  fontSize: 10,
                                  fontWeight: 600,
                                }}
                              />
                            ))}
                          </TableCell>
                          <TableCell sx={{ fontSize: 12 }}>
                            {devicesList.map((dev, idx) => (
                              <Chip
                                key={idx}
                                label={dev}
                                size="small"
                                sx={{
                                  bgcolor: dev.includes("Unassigned") ? "#F3F4F6" : "#E0F2FE",
                                  color: dev.includes("Unassigned") ? "#6B7280" : "#0369A1",
                                  mr: 0.5,
                                  mb: 0.5,
                                  height: 20,
                                  fontSize: 10,
                                  fontWeight: 600,
                                }}
                              />
                            ))}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2, bgcolor: "#F9FAFB", borderTop: "1px solid #E5E7EB" }}>
            <Button onClick={() => setMembersModalOpen(false)} sx={{ textTransform: "none", color: "text.secondary" }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveMembers}
              sx={{ textTransform: "none", bgcolor: "#0E9F6E", "&:hover": { bgcolor: "#047857" } }}
            >
              Save Group Members ({selectedMemberCodes.length}) 💾
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={Boolean(snackbar)}
          autoHideDuration={4000}
          onClose={() => setSnackbar(null)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            severity={snackbar?.severity || "success"}
            variant="filled"
            onClose={() => setSnackbar(null)}
            sx={{
              bgcolor: snackbar?.severity === "error" ? "#EF4444" : "#0E9F6E",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            {snackbar?.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
}
