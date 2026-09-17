import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
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
  CircularProgress,
  FormHelperText,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupsIcon from "@mui/icons-material/Groups";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import BusinessIcon from "@mui/icons-material/Business";
import DvrIcon from "@mui/icons-material/Dvr";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CheckIcon from "@mui/icons-material/Check";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import Layout from "../../components/Layout/Layout";
import axios from "axios";

// 7 Standard Working Days
const ALL_WORKING_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Helper to validate strict 24-hour time HH:mm (00:00 to 23:59)
function isValid24HourTime(timeStr) {
  if (!timeStr || typeof timeStr !== "string") return false;
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(timeStr.trim());
}

// Helper to calculate 24h duration
function calculateDurationText(startTime, endTime) {
  if (!isValid24HourTime(startTime) || !isValid24HourTime(endTime)) return null;

  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);

  let startMinutes = sh * 60 + sm;
  let endMinutes = eh * 60 + em;

  if (endMinutes < startMinutes) {
    endMinutes += 24 * 60;
  }

  const diffMinutes = endMinutes - startMinutes;
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  if (minutes === 0) return `${hours} hrs`;
  return `${hours}h ${minutes}m`;
}

export default function ShiftsAndGroupsPage() {
  // Tab Switcher State: 0 = Work Shift Templates (24h), 1 = Shift Groups & Assignments
  const [currentTab, setCurrentTab] = useState(1);
  const [snackbar, setSnackbar] = useState(null);

  // Authentication Header Helper
  const getAuthHeaders = useCallback(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("biometric_token") : null;
    return {
      headers: {
        Authorization: token || "",
      },
    };
  }, []);

  // Top Company Selector State
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  // Registered Biometric Devices State
  const [devices, setDevices] = useState([]);
  const [loadingDevices, setLoadingDevices] = useState(false);

  // Live Work Shifts State (Loaded 100% via GET /shifts API)
  const [shifts, setShifts] = useState([]);
  const [loadingShifts, setLoadingShifts] = useState(false);

  // Live Shift Groups State (Loaded 100% via GET /groups API)
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [submittingGroup, setSubmittingGroup] = useState(false);

  // Modals State - Work Shifts
  const [shiftModalOpen, setShiftModalOpen] = useState(false);
  const [deleteShiftConfirmOpen, setDeleteShiftConfirmOpen] = useState(false);
  const [shiftToDelete, setShiftToDelete] = useState(null);
  const [editingShift, setEditingShift] = useState(null);
  const [submittingShift, setSubmittingShift] = useState(false);

  // Modals State - Shift Groups
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [deleteGroupConfirmOpen, setDeleteGroupConfirmOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);

  // Shift Form State
  const [shiftForm, setShiftForm] = useState({
    name: "",
    shiftCode: "",
    startTime: "",
    endTime: "",
    workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    deviceIds: [],
    description: "",
  });

  // Group Form State
  const [groupForm, setGroupForm] = useState({
    name: "",
    groupCode: "GRP-001",
    primaryShiftId: "",
    secondaryShiftId: "",
    description: "",
  });

  // Modals State - Manage Members Table
  const [manageMembersModalOpen, setManageMembersModalOpen] = useState(false);
  const [activeGroupForMembers, setActiveGroupForMembers] = useState(null);
  const [rosterEmployees, setRosterEmployees] = useState([]);
  const [loadingRoster, setLoadingRoster] = useState(false);
  const [savingMembers, setSavingMembers] = useState(false);
  const [selectedEmpCodes, setSelectedEmpCodes] = useState([]);
  const [initialEnrolledCodes, setInitialEnrolledCodes] = useState([]);
  const [rosterSearch, setRosterSearch] = useState("");
  const [rosterBranchFilter, setRosterBranchFilter] = useState("");
  const [rosterDeptFilter, setRosterDeptFilter] = useState("");
  const [rosterStatusFilter, setRosterStatusFilter] = useState("all");
  // const [rosterPage, setRosterPage] = useState(0);
  // const [rosterRowsPerPage, setRosterRowsPerPage] = useState(10);

  // --- API Integrations for Companies, Devices, and Shifts ---

  const fetchCompanies = useCallback(async () => {
    try {
      setLoadingCompanies(true);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/company`, getAuthHeaders());
      const compList = res.data?.data || res.data || [];
      setCompanies(compList);
      if (compList.length > 0) {
        setSelectedCompanyId((prev) => (prev ? prev : compList[0]._id || compList[0].id));
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      // Fallback demo company for preview
      const fallbackComps = [{ _id: "comp-1", company_name: "TechCorp Solutions Pvt Ltd" }];
      setCompanies(fallbackComps);
      setSelectedCompanyId("comp-1");
    } finally {
      setLoadingCompanies(false);
    }
  }, [getAuthHeaders]);

  const fetchDevices = useCallback(async () => {
    try {
      setLoadingDevices(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/devices/list`,
        {},
        {
          ...getAuthHeaders(),
          params: { page: 1, page_size: 100 },
        }
      );
      const devList = res.data?.data || res.data || [];
      setDevices(devList);
    } catch (error) {
      console.error("Error fetching devices:", error);
    } finally {
      setLoadingDevices(false);
    }
  }, [getAuthHeaders]);

  const fetchShifts = useCallback(
    async (compId) => {
      if (!compId) return;
      try {
        setLoadingShifts(true);
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/shifts`, {
          ...getAuthHeaders(),
          params: { companyId: compId },
        });
        const shiftList = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setShifts(shiftList);
      } catch (error) {
        console.error("Error fetching shifts:", error);
      } finally {
        setLoadingShifts(false);
      }
    },
    [getAuthHeaders]
  );

  const fetchGroups = useCallback(
    async (compId) => {
      if (!compId) return;
      try {
        setLoadingGroups(true);
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/groups`, {
          ...getAuthHeaders(),
          params: { companyId: compId },
        });
        const groupList = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setGroups(groupList);
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setLoadingGroups(false);
      }
    },
    [getAuthHeaders]
  );

  useEffect(() => {
    fetchCompanies();
    fetchDevices();
  }, [fetchCompanies, fetchDevices]);

  useEffect(() => {
    if (selectedCompanyId) {
      fetchShifts(selectedCompanyId);
      fetchGroups(selectedCompanyId);
    }
  }, [selectedCompanyId, fetchShifts, fetchGroups]);

  // Helper to fetch next shift code from backend
  const fetchNextShiftCode = async (compId) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/shifts/next-shift-code`,
        {
          ...getAuthHeaders(),
          params: { companyId: compId || selectedCompanyId },
        }
      );
      return res.data?.nextShiftCode || res.data || "SHIFT-001";
    } catch (error) {
      console.error("Error fetching next shift code:", error);
      return `SHIFT-00${shifts.length + 1}`;
    }
  };

  // Helper to fetch next group code from backend
  const fetchNextGroupCode = async (compId) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/groups/next-group-code`,
        {
          ...getAuthHeaders(),
          params: { companyId: compId || selectedCompanyId },
        }
      );
      return res.data?.nextGroupCode || res.data || "GRP-001";
    } catch (error) {
      console.error("Error fetching next group code:", error);
      return `GRP-00${groups.length + 1}`;
    }
  };

  // Helper to map device IDs to readable name/location
  const getDeviceLabel = (deviceId) => {
    const dev = devices.find((d) => (d._id || d.id) === deviceId || d.serialNumber === deviceId);
    if (!dev) return deviceId;
    const locationOrBranch = dev.location || dev.branch_name;
    const isUnassigned = !dev.companyId || !dev.company_name || dev.company_name === "—" || dev.company_name === "Unassigned";
    const tag = locationOrBranch || (isUnassigned ? "Shared Terminal" : "Location Unset");
    return `${dev.device_name || dev.name || "Device"} (${tag})`;
  };

  const selectedCompanyObj = companies.find((c) => (c._id || c.id) === selectedCompanyId) || companies[0];

  // Biometric Devices Scoped Filter:
  // 1. Devices specifically assigned to the active company context
  // 2. Unassigned / Shared terminals (company is empty, "—", "-", or "Unassigned")
  const availableDevices = useMemo(() => {
    if (!selectedCompanyId && !selectedCompanyObj) return devices;
    return devices.filter((d) => {
      const isUnassigned =
        !d.companyId ||
        d.companyId === "" ||
        !d.company_name ||
        d.company_name === "—" ||
        d.company_name === "-" ||
        d.company_name === "Unassigned";

      const isCompanyDevice =
        (d.companyId && String(d.companyId) === String(selectedCompanyId)) ||
        (selectedCompanyObj &&
          d.company_name &&
          (d.company_name === selectedCompanyObj.company_name || d.company_name === selectedCompanyObj.name));

      return isUnassigned || isCompanyDevice;
    });
  }, [devices, selectedCompanyId, selectedCompanyObj]);

  // --- SHIFT MODAL HANDLERS ---
  const handleOpenAddShift = async () => {
    setEditingShift(null);
    const nextCode = await fetchNextShiftCode(selectedCompanyId);
    setShiftForm({
      name: "",
      shiftCode: nextCode,
      startTime: "09:00",
      endTime: "18:00",
      workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      deviceIds: [],
      description: "",
    });
    setShiftModalOpen(true);
  };

  const handleOpenEditShift = (shift) => {
    setEditingShift(shift);
    setShiftForm({
      name: shift.name || "",
      shiftCode: shift.shiftCode || "",
      startTime: shift.startTime || "",
      endTime: shift.endTime || "",
      workingDays: shift.workingDays && shift.workingDays.length > 0 ? shift.workingDays : ["Mon", "Tue", "Wed", "Thu", "Fri"],
      deviceIds: shift.deviceIds || [],
      description: shift.description || "",
    });
    setShiftModalOpen(true);
  };

  const toggleWorkingDay = (day) => {
    setShiftForm((prev) => {
      const exists = prev.workingDays.includes(day);
      const updated = exists ? prev.workingDays.filter((d) => d !== day) : [...prev.workingDays, day];
      return { ...prev, workingDays: updated };
    });
  };

  const handleTimeInputChange = (field, rawValue) => {
    let clean = rawValue.replace(/[^0-9:]/g, "");
    if (clean.length === 2 && !clean.includes(":") && !(shiftForm[field] && shiftForm[field].includes(":"))) {
      clean = clean + ":";
    }
    if (clean.length > 5) clean = clean.slice(0, 5);
    setShiftForm((prev) => ({ ...prev, [field]: clean }));
  };

  const handleSaveShift = async () => {
    if (!shiftForm.name.trim()) {
      setSnackbar({ status: true, severity: "error", message: "Please enter a Shift Name." });
      return;
    }
    if (!isValid24HourTime(shiftForm.startTime)) {
      setSnackbar({
        status: true,
        severity: "error",
        message: "Invalid Start Time format. Please enter in 24h format HH:mm (e.g. 08:00, 17:00).",
      });
      return;
    }
    if (!isValid24HourTime(shiftForm.endTime)) {
      setSnackbar({
        status: true,
        severity: "error",
        message: "Invalid End Time format. Please enter in 24h format HH:mm (e.g. 13:00, 21:00).",
      });
      return;
    }

    // Check for duplicate shift code in the same company
    if (shiftForm.shiftCode && shiftForm.shiftCode.trim()) {
      const duplicateShift = shifts.find(
        (s) =>
          (s.shiftCode || "").trim().toLowerCase() === shiftForm.shiftCode.trim().toLowerCase() &&
          (editingShift ? (s._id || s.id) !== (editingShift._id || editingShift.id) : true)
      );

      if (duplicateShift) {
        setSnackbar({
          status: true,
          severity: "error",
          message: `❌ Shift Code "${shiftForm.shiftCode.trim()}" is already assigned to "${duplicateShift.name}". Please enter a unique code.`,
        });
        return;
      }
    }

    const payload = {
      name: shiftForm.name.trim(),
      shiftCode: shiftForm.shiftCode.trim(),
      companyId: selectedCompanyId,
      startTime: shiftForm.startTime.trim(),
      endTime: shiftForm.endTime.trim(),
      workingDays: shiftForm.workingDays,
      deviceIds: shiftForm.deviceIds,
      description: shiftForm.description ? shiftForm.description.trim() : "",
    };

    try {
      setSubmittingShift(true);
      if (editingShift) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/shifts/${editingShift._id || editingShift.id}`,
          payload,
          getAuthHeaders()
        );
        setSnackbar({ status: true, severity: "success", message: `Shift template "${payload.name}" updated successfully!` });
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/shifts`,
          payload,
          getAuthHeaders()
        );
        setSnackbar({ status: true, severity: "success", message: `24h Shift "${payload.name}" created successfully!` });
      }
      setShiftModalOpen(false);
      fetchShifts(selectedCompanyId);
    } catch (error) {
      console.error("Error saving shift:", error);
      const serverMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to save shift.";
      const displayMsg = Array.isArray(serverMsg) ? serverMsg.join(", ") : serverMsg;
      setSnackbar({
        status: true,
        severity: "error",
        message: `❌ ${displayMsg}`,
      });
    } finally {
      setSubmittingShift(false);
    }
  };

  const handleOpenDeleteShiftConfirm = (shift) => {
    setShiftToDelete(shift);
    setDeleteShiftConfirmOpen(true);
  };

  const handleConfirmDeleteShift = async () => {
    if (!shiftToDelete) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/shifts/${shiftToDelete._id || shiftToDelete.id}`,
        getAuthHeaders()
      );
      setSnackbar({ status: true, severity: "success", message: `Shift "${shiftToDelete.name}" deleted successfully!` });
      setDeleteShiftConfirmOpen(false);
      setShiftToDelete(null);
      fetchShifts(selectedCompanyId);
    } catch (error) {
      console.error("Error deleting shift:", error);
      setSnackbar({
        status: true,
        severity: "error",
        message: error.response?.data?.message || "Failed to delete shift.",
      });
    }
  };

  // --- GROUP MODAL HANDLERS (LIVE API INTEGRATION) ---
  const handleOpenAddGroup = async () => {
    setEditingGroup(null);
    const nextCode = await fetchNextGroupCode(selectedCompanyId);
    setGroupForm({
      name: "",
      groupCode: nextCode,
      primaryShiftId: shifts.length > 0 ? (shifts[0]._id || shifts[0].id) : "",
      secondaryShiftId: "",
      description: "",
    });
    setGroupModalOpen(true);
  };

  const handleOpenEditGroup = (group) => {
    setEditingGroup(group);
    const primaryId =
      (group.assignedShiftIds && group.assignedShiftIds[0]) ||
      (group.shifts && group.shifts[0]?._id) ||
      "";
    const secondaryId =
      (group.assignedShiftIds && group.assignedShiftIds[1]) ||
      (group.shifts && group.shifts[1]?._id) ||
      "";

    setGroupForm({
      name: group.name || "",
      groupCode: group.groupCode || "",
      primaryShiftId: primaryId,
      secondaryShiftId: secondaryId,
      description: group.description || "",
    });
    setGroupModalOpen(true);
  };

  const handleSaveGroup = async () => {
    if (!groupForm.name.trim()) {
      setSnackbar({ status: true, severity: "error", message: "Please enter a Group Name." });
      return;
    }
    if (!groupForm.primaryShiftId) {
      setSnackbar({ status: true, severity: "error", message: "Please select a Primary 24h Work Shift." });
      return;
    }
    if (groupForm.secondaryShiftId && groupForm.secondaryShiftId === groupForm.primaryShiftId) {
      setSnackbar({
        status: true,
        severity: "error",
        message: "Primary and Secondary shifts cannot be the exact same shift template. Please select a different secondary shift or choose 'None'.",
      });
      return;
    }

    // Duplicate group code check
    if (groupForm.groupCode && groupForm.groupCode.trim()) {
      const duplicateGroup = groups.find(
        (g) =>
          (g.groupCode || "").trim().toLowerCase() === groupForm.groupCode.trim().toLowerCase() &&
          (editingGroup ? (g._id || g.id) !== (editingGroup._id || editingGroup.id) : true)
      );

      if (duplicateGroup) {
        setSnackbar({
          status: true,
          severity: "error",
          message: `❌ Group Code "${groupForm.groupCode.trim()}" is already assigned to "${duplicateGroup.name}". Please enter a unique code.`,
        });
        return;
      }
    }

    // Shift overlap pre-check
    if (groupForm.primaryShiftId && groupForm.secondaryShiftId) {
      const s1 = shifts.find((s) => (s._id || s.id) === groupForm.primaryShiftId);
      const s2 = shifts.find((s) => (s._id || s.id) === groupForm.secondaryShiftId);

      if (s1 && s2 && s1.startTime && s1.endTime && s2.startTime && s2.endTime) {
        const toMinutes = (timeStr) => {
          const [h, m] = timeStr.split(":").map(Number);
          return (h || 0) * 60 + (m || 0);
        };

        let start1 = toMinutes(s1.startTime);
        let end1 = toMinutes(s1.endTime);
        let start2 = toMinutes(s2.startTime);
        let end2 = toMinutes(s2.endTime);

        if (end1 < start1) end1 += 24 * 60;
        if (end2 < start2) end2 += 24 * 60;

        const isOverlap = start1 < end2 && start2 < end1;
        if (isOverlap) {
          setSnackbar({
            status: true,
            severity: "error",
            message: `⚠️ Shift Overlap Conflict: Primary shift "${s1.name}" (${s1.startTime}–${s1.endTime}) overlaps with Secondary shift "${s2.name}" (${s2.startTime}–${s2.endTime})! Split shifts must have non-overlapping working hours.`,
          });
          return;
        }
      }
    }

    const assignedShiftIds = [groupForm.primaryShiftId];
    if (groupForm.secondaryShiftId) {
      assignedShiftIds.push(groupForm.secondaryShiftId);
    }

    const payload = {
      name: groupForm.name.trim(),
      groupCode: groupForm.groupCode.trim(),
      companyId: selectedCompanyId,
      assignedShiftIds,
      description: groupForm.description ? groupForm.description.trim() : "",
    };

    try {
      setSubmittingGroup(true);
      if (editingGroup) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/groups/${editingGroup._id || editingGroup.id}`,
          payload,
          getAuthHeaders()
        );
        setSnackbar({ status: true, severity: "success", message: `Shift Group "${groupForm.name}" updated successfully!` });
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/groups`,
          payload,
          getAuthHeaders()
        );
        setSnackbar({ status: true, severity: "success", message: `Shift Group "${groupForm.name}" created successfully!` });
      }
      setGroupModalOpen(false);
      fetchGroups(selectedCompanyId);
    } catch (error) {
      console.error("Error saving group:", error);
      const serverMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to save shift group.";
      const displayMsg = Array.isArray(serverMsg) ? serverMsg.join(", ") : serverMsg;
      setSnackbar({
        status: true,
        severity: "error",
        message: `❌ ${displayMsg}`,
      });
    } finally {
      setSubmittingGroup(false);
    }
  };

  const handleOpenDeleteGroupConfirm = (group) => {
    setGroupToDelete(group);
    setDeleteGroupConfirmOpen(true);
  };

  const handleConfirmDeleteGroup = async () => {
    if (!groupToDelete) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/groups/${groupToDelete._id || groupToDelete.id}`,
        getAuthHeaders()
      );
      setSnackbar({ status: true, severity: "success", message: `Shift Group "${groupToDelete.name}" deleted successfully!` });
      setDeleteGroupConfirmOpen(false);
      setGroupToDelete(null);
      fetchGroups(selectedCompanyId);
    } catch (error) {
      console.error("Error deleting group:", error);
      setSnackbar({
        status: true,
        severity: "error",
        message: error.response?.data?.message || "Failed to delete shift group.",
      });
    }
  };

  // --- MANAGE MEMBERS TABLE HANDLERS & LOGIC ---

  const fetchGroupMembersRoster = useCallback(
    async (groupId) => {
      if (!groupId) return;
      try {
        setLoadingRoster(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/groups/${groupId}/members-view`,
          getAuthHeaders()
        );
        const emps = res.data?.employees || [];
        setRosterEmployees(emps);

        // Derive initially enrolled employees in this group
        const enrolled = emps
          .filter((e) => e.isMember)
          .map((e) => e.empCode || e.deviceUserId || e._id);
        setSelectedEmpCodes(enrolled);
        setInitialEnrolledCodes(enrolled);
      } catch (error) {
        console.error("Error fetching group members roster:", error);
        setSnackbar({
          status: true,
          severity: "error",
          message: error.response?.data?.message || "Failed to load employee roster.",
        });
      } finally {
        setLoadingRoster(false);
      }
    },
    [getAuthHeaders]
  );

  const handleOpenManageMembers = (group) => {
    setActiveGroupForMembers(group);
    setRosterSearch("");
    setRosterBranchFilter("");
    setRosterDeptFilter("");
    setRosterStatusFilter("all");
    // setRosterPage(0);
    setManageMembersModalOpen(true);
    fetchGroupMembersRoster(group._id || group.id);
  };

  const handleToggleEmployee = (empIdentifier) => {
    setSelectedEmpCodes((prev) => {
      if (prev.includes(empIdentifier)) {
        return prev.filter((c) => c !== empIdentifier);
      } else {
        return [...prev, empIdentifier];
      }
    });
  };

  const handleSelectAllFiltered = (filteredList) => {
    const codesToAdd = filteredList.map((e) => e.empCode || e.deviceUserId || e._id);
    setSelectedEmpCodes((prev) => Array.from(new Set([...prev, ...codesToAdd])));
  };

  const handleDeselectAllFiltered = (filteredList) => {
    const codesToRemove = new Set(filteredList.map((e) => e.empCode || e.deviceUserId || e._id));
    setSelectedEmpCodes((prev) => prev.filter((c) => !codesToRemove.has(c)));
  };

  // NOT USED IN FRONTEND: Replaced by single-click row toggle and header master checkbox
  // const handleSelectOnlyAvailable = (filteredList) => {
  //   const availableCodes = filteredList
  //     .filter((e) => e.status === "Available" || e.isMember)
  //     .map((e) => e.empCode || e.deviceUserId || e._id);
  //   setSelectedEmpCodes((prev) => Array.from(new Set([...prev, ...availableCodes])));
  // };

  // NOT USED IN FRONTEND: Reset button removed from modal toolbar
  // const handleResetToInitial = () => {
  //   setSelectedEmpCodes(initialEnrolledCodes);
  // };

  const handleSaveMembers = async () => {
    if (!activeGroupForMembers) return;
    const groupId = activeGroupForMembers._id || activeGroupForMembers.id;
    try {
      setSavingMembers(true);
      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/groups/${groupId}/members`,
        { memberEmpCodes: selectedEmpCodes },
        getAuthHeaders()
      );
      setSnackbar({
        status: true,
        severity: "success",
        message: `🎉 Successfully updated members for "${activeGroupForMembers.name}" (${selectedEmpCodes.length} enrolled)!`,
      });
      setManageMembersModalOpen(false);
      fetchGroups(selectedCompanyId);
    } catch (error) {
      console.error("Error saving group members:", error);
      const serverMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to save group members.";
      const displayMsg = Array.isArray(serverMsg) ? serverMsg.join(", ") : serverMsg;
      setSnackbar({
        status: true,
        severity: "error",
        message: `❌ ${displayMsg}`,
      });
    } finally {
      setSavingMembers(false);
    }
  };


  // Filtered Roster for Modal Table
  const filteredRosterEmployees = useMemo(() => {
    return rosterEmployees.filter((emp) => {
      // 1. Search filter
      if (rosterSearch.trim()) {
        const q = rosterSearch.trim().toLowerCase();
        const matchName = (emp.name || "").toLowerCase().includes(q);
        const matchCode = (emp.empCode || "").toLowerCase().includes(q);
        const matchDev = (emp.deviceUserId || "").toLowerCase().includes(q);
        const matchEmpCode = (emp.employeeCode || "").toLowerCase().includes(q);
        const matchDept = (emp.departmentName || "").toLowerCase().includes(q);
        const matchBranch = (emp.branchName || "").toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchDev && !matchEmpCode && !matchDept && !matchBranch) {
          return false;
        }
      }
      // 2. Branch filter
      if (rosterBranchFilter && emp.branchId !== rosterBranchFilter) {
        return false;
      }
      // 3. Department filter
      if (rosterDeptFilter && emp.deptId !== rosterDeptFilter) {
        return false;
      }
      // 4. Status filter
      if (rosterStatusFilter === "in-group") {
        if (!emp.isMember) return false;
      } else if (rosterStatusFilter === "available") {
        if (emp.status !== "Available") return false;
      } else if (rosterStatusFilter === "other-group") {
        if (emp.status !== "Assigned to Other Group") return false;
      }
      return true;
    });
  }, [rosterEmployees, rosterSearch, rosterBranchFilter, rosterDeptFilter, rosterStatusFilter]);

  // Unique Branch options in roster
  const rosterBranches = useMemo(() => {
    const map = new Map();
    rosterEmployees.forEach((e) => {
      if (e.branchId && e.branchName && e.branchName !== "—") {
        map.set(e.branchId, e.branchName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [rosterEmployees]);

  // Unique Department options in roster
  const rosterDepartments = useMemo(() => {
    const map = new Map();
    rosterEmployees.forEach((e) => {
      if (e.deptId && e.departmentName && e.departmentName !== "—") {
        map.set(e.deptId, e.departmentName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [rosterEmployees]);

  // Count of selected employees who will be transferred from other groups
  const transferCount = useMemo(() => {
    const selectedSet = new Set(selectedEmpCodes);
    return rosterEmployees.filter(
      (e) =>
        (selectedSet.has(e.empCode) || selectedSet.has(e.deviceUserId) || selectedSet.has(String(e._id))) &&
        e.status === "Assigned to Other Group"
    ).length;
  }, [rosterEmployees, selectedEmpCodes]);

  return (
    <Layout>
      <Box sx={{ p: { xs: 2, md: 3.5 }, maxWidth: "1600px", margin: "0 auto" }}>
        {/* Top Company Context Header Banner */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 3.5,
            borderRadius: "14px",
            border: "1px solid #BBF7D0",
            bgcolor: "#F0FDF4",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box display="flex" alignItems="center" gap={1.5}>
            <BusinessIcon sx={{ color: "#0E9F6E", fontSize: 32 }} />
            <Box>
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, color: "#047857", textTransform: "uppercase", letterSpacing: 0.6 }}
              >
                Active Working Organization Context
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#1F2937", lineHeight: 1.2 }}>
                {selectedCompanyObj?.company_name || selectedCompanyObj?.name || (loadingCompanies ? "Loading organization..." : "No Company Selected")}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={1.5}>
            <FormControl size="small" sx={{ minWidth: 280, bgcolor: "#FFFFFF", borderRadius: "8px" }}>
              <InputLabel sx={{ fontWeight: 600 }}>Select Company Context</InputLabel>
              <Select
                label="Select Company Context"
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                sx={{ borderRadius: "8px", fontWeight: 600 }}
                disabled={loadingCompanies || companies.length === 0}
              >
                {companies.map((c) => {
                  const id = c._id || c.id;
                  const name = c.company_name || c.name || "Company";
                  return (
                    <MenuItem key={id} value={id}>
                      🏢 {name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {/* Page Title & Main Action Buttons */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" rowGap={2}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#111827", letterSpacing: -0.3 }}>
              Shifts & Groups Management
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              Configure 24-hour shift schedules, assign device location restrictions, and manage shift groups for {selectedCompanyObj?.company_name || selectedCompanyObj?.name || "your organization"}.
            </Typography>
          </Box>

          <Box display="flex" gap={1.5}>
            <Button
              variant="outlined"
              onClick={handleOpenAddShift}
              startIcon={<AddIcon />}
              sx={{
                textTransform: "none",
                color: "#0E9F6E",
                borderColor: "#0E9F6E",
                fontWeight: 600,
                borderRadius: "8px",
                "&:hover": { borderColor: "#047857", bgcolor: "#F0FDF4" },
              }}
            >
              + Add Shift Template (24h)
            </Button>
            <Button
              variant="contained"
              onClick={handleOpenAddGroup}
              startIcon={<AddIcon />}
              sx={{
                textTransform: "none",
                backgroundColor: "#0E9F6E",
                fontWeight: 700,
                borderRadius: "8px",
                boxShadow: "none",
                "&:hover": { backgroundColor: "#047857", boxShadow: "none" },
              }}
            >
              + Add Shift Group
            </Button>
          </Box>
        </Box>

        {/* Top Tab Switcher */}
        <Tabs
          value={currentTab}
          onChange={(e, val) => setCurrentTab(val)}
          sx={{
            mb: 3.5,
            borderBottom: "1px solid #E5E7EB",
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 700,
              fontSize: "15px",
              minHeight: "48px",
              color: "#6B7280",
            },
            "& .Mui-selected": { color: "#0E9F6E !important" },
            "& .MuiTabs-indicator": { backgroundColor: "#0E9F6E", height: 3, borderRadius: "3px 3px 0 0" },
          }}
        >
          <Tab
            icon={<AccessTimeIcon sx={{ fontSize: 20, mr: 1 }} />}
            iconPosition="start"
            label={`1. Work Shift Templates (${shifts.length})`}
          />
          <Tab
            icon={<GroupsIcon sx={{ fontSize: 22, mr: 1 }} />}
            iconPosition="start"
            label={`2. Shift Groups & Assignments (${groups.length})`}
          />
        </Tabs>

        {/* ========================================================================= */}
        {/* TAB 0: 24-HOUR WORK SHIFT TEMPLATES */}
        {/* ========================================================================= */}
        {currentTab === 0 && (
          <Box>
            {loadingShifts ? (
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={8}>
                <CircularProgress sx={{ color: "#0E9F6E", mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Loading work shifts from database...
                </Typography>
              </Box>
            ) : shifts.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: 5,
                  textAlign: "center",
                  borderRadius: "14px",
                  border: "2px dashed #D1D5DB",
                  bgcolor: "#FAFAFA",
                }}
              >
                <AccessTimeIcon sx={{ fontSize: 48, color: "#9CA3AF", mb: 1.5 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#374151" }}>
                  No Work Shift Templates Found
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", maxWidth: 450, mx: "auto", mt: 0.5, mb: 2.5 }}>
                  You haven&apos;t created any 24h work shift templates for this organization context yet. Click below to add your first template.
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleOpenAddShift}
                  startIcon={<AddIcon />}
                  sx={{
                    textTransform: "none",
                    bgcolor: "#0E9F6E",
                    fontWeight: 600,
                    borderRadius: "8px",
                    "&:hover": { bgcolor: "#047857" },
                  }}
                >
                  Create First 24h Shift
                </Button>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {shifts.map((shift) => {
                  const shiftId = shift._id || shift.id;
                  const durationText = calculateDurationText(shift.startTime, shift.endTime) || "—";

                  return (
                    <Grid item xs={12} md={6} lg={4} key={shiftId}>
                      <Card
                        variant="outlined"
                        sx={{
                          borderRadius: "14px",
                          borderColor: "#E5E7EB",
                          transition: "all 0.2s ease",
                          "&:hover": { boxShadow: "0 4px 16px rgba(0,0,0,0.08)", borderColor: "#0E9F6E" },
                        }}
                      >
                        <CardContent sx={{ p: 2.5 }}>
                          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                            <Box>
                              <Chip
                                label={shift.shiftCode || "SHIFT"}
                                size="small"
                                sx={{ bgcolor: "#E6F6F0", color: "#0E9F6E", fontWeight: 700, mb: 0.5, fontSize: 11 }}
                              />
                              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "16px", color: "#111827" }}>
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
                                {shift.startTime} – {shift.endTime} ({durationText})
                              </Typography>
                            </Box>

                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "13px" }}>
                                📅 Working Days:
                              </Typography>
                              <Box display="flex" gap={0.5} flexWrap="wrap" justifyContent="flex-end">
                                {(shift.workingDays || []).map((d) => (
                                  <Chip
                                    key={d}
                                    label={d}
                                    size="small"
                                    sx={{ bgcolor: "#F3F4F6", height: 20, fontSize: 10, fontWeight: 600 }}
                                  />
                                ))}
                              </Box>
                            </Box>

                            <Box mt={0.5}>
                              <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "13px", mb: 0.5 }}>
                                📟 Allowed Attendance Devices:
                              </Typography>
                              <Box display="flex" flexWrap="wrap" gap={0.5}>
                                {shift.deviceIds && shift.deviceIds.length > 0 ? (
                                  shift.deviceIds.map((devId, idx) => (
                                    <Chip
                                      key={idx}
                                      icon={<DvrIcon style={{ fontSize: 13, color: "#0284C7" }} />}
                                      label={getDeviceLabel(devId)}
                                      size="small"
                                      sx={{ bgcolor: "#E0F2FE", color: "#0369A1", fontWeight: 600, height: 22, fontSize: 11 }}
                                    />
                                  ))
                                ) : (
                                  <Chip
                                    label="All Company Devices"
                                    size="small"
                                    sx={{ bgcolor: "#F3F4F6", height: 20, fontSize: 10, color: "#6B7280" }}
                                  />
                                )}
                              </Box>
                            </Box>

                            {shift.description && shift.description.trim() && (
                              <Box mt={0.5}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "#4B5563",
                                    fontSize: "12px",
                                    bgcolor: "#F9FAFB",
                                    px: 1.5,
                                    py: 0.8,
                                    borderRadius: "6px",
                                    border: "1px solid #E5E7EB",
                                  }}
                                >
                                  💬 {shift.description}
                                </Typography>
                              </Box>
                            )}
                          </Box>

                          <Divider sx={{ my: 1.5 }} />

                          <Box display="flex" justifyContent="flex-end" alignItems="center" gap={1}>
                            <IconButton
                              size="small"
                              onClick={() => handleOpenEditShift(shift)}
                              sx={{ color: "#3B82F6", "&:hover": { bgcolor: "#EFF6FF" } }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDeleteShiftConfirm(shift)}
                              sx={{ color: "#EF4444", "&:hover": { bgcolor: "#FEF2F2" } }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Box>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: SHIFT GROUPS & ASSIGNMENTS (SCREENSHOT 1 MATCH) */}
        {/* ========================================================================= */}
        {currentTab === 1 && (
          <Box>
            {groups.length === 0 ? (
              <Box
                sx={{
                  p: 8,
                  textAlign: "center",
                  borderRadius: "14px",
                  border: "2px dashed #E5E7EB",
                  bgcolor: "#FAFAFA",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "340px",
                }}
              >
                <GroupsIcon sx={{ fontSize: 48, color: "#D1D5DB", mb: 1.5 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#4B5563", mb: 0.5 }}>
                  No Shift Groups Created Yet
                </Typography>
                <Typography variant="body2" sx={{ color: "#9CA3AF", maxWidth: 450, mb: 2.5 }}>
                  Click &quot;+ Add Shift Group&quot; above to configure your organization&apos;s shift groups.
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleOpenAddGroup}
                  startIcon={<AddIcon />}
                  sx={{
                    textTransform: "none",
                    bgcolor: "#0E9F6E",
                    fontWeight: 700,
                    borderRadius: "8px",
                    px: 2.5,
                    boxShadow: "none",
                    "&:hover": { bgcolor: "#047857", boxShadow: "none" },
                  }}
                >
                  + Add Shift Group
                </Button>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {groups.map((group) => {
                  const groupId = group._id || group.id;
                  const assignedShifts = group.shifts && group.shifts.length > 0
                    ? group.shifts
                    : (group.assignedShiftIds || []).map((id) => shifts.find((s) => (s._id || s.id) === id)).filter(Boolean);
                  const shiftCount = assignedShifts.length;
                  const isSplitSet = shiftCount > 1;

                  return (
                    <Grid item xs={12} lg={6} key={groupId}>
                      <Card
                        variant="outlined"
                        sx={{
                          borderRadius: "14px",
                          borderColor: "#E5E7EB",
                          bgcolor: "#FFFFFF",
                          transition: "all 0.2s ease",
                          "&:hover": { boxShadow: "0 6px 20px rgba(0,0,0,0.07)", borderColor: "#0E9F6E" },
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          {/* Card Top Row: Code Pill + Shift Count Pill */}
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.2}>
                            <Chip
                              label={group.groupCode || "GRP-001"}
                              size="small"
                              sx={{
                                bgcolor: "#E6F6F0",
                                color: "#0E9F6E",
                                fontWeight: 700,
                                fontSize: "11px",
                                borderRadius: "6px",
                              }}
                            />
                            <Chip
                              label={isSplitSet ? `${shiftCount} Shifts (Split Set)` : `${shiftCount} Shift (Single)`}
                              size="small"
                              sx={{
                                bgcolor: isSplitSet ? "#EDE9FE" : "#E0F2FE",
                                color: isSplitSet ? "#6D28D9" : "#0369A1",
                                fontWeight: 700,
                                fontSize: "11px",
                                borderRadius: "6px",
                              }}
                            />
                          </Box>

                          {/* Group Title */}
                          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: "18px", color: "#111827", mb: group.description ? 0.8 : 2.5 }}>
                            {group.name}
                          </Typography>

                          {/* Group Description Note */}
                          {group.description && group.description.trim() && (
                            <Box mb={2}>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "#4B5563",
                                  fontSize: "12px",
                                  bgcolor: "#F9FAFB",
                                  px: 1.5,
                                  py: 0.8,
                                  borderRadius: "6px",
                                  border: "1px solid #E5E7EB",
                                }}
                              >
                                💬 {group.description}
                              </Typography>
                            </Box>
                          )}

                          {/* ⏰ Total Shift Set Display */}
                          <Box mb={2.5}>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                              <AccessTimeIcon sx={{ fontSize: 16, color: "#6B7280" }} />
                              <Typography variant="body2" sx={{ fontWeight: 600, color: "#374151", fontSize: "13px" }}>
                                Total Shift Set ({shiftCount}):
                              </Typography>
                            </Box>

                            <Box display="flex" flexDirection="column" gap={0.8} pl={3}>
                              {assignedShifts.map((sh, idx) => (
                                <Box
                                  key={idx}
                                  sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    width: "fit-content",
                                    bgcolor: isSplitSet ? "#EDE9FE" : "#DEF7EC",
                                    color: isSplitSet ? "#6D28D9" : "#03543F",
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: "16px",
                                    fontSize: "12px",
                                    fontWeight: 700,
                                  }}
                                >
                                  {sh.name} ({sh.startTime} - {sh.endTime})
                                </Box>
                              ))}
                            </Box>
                          </Box>

                          {/* 👥 Enrolled Group Staff Display */}
                          <Box mb={2.5}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <GroupsIcon sx={{ fontSize: 18, color: "#6B7280" }} />
                              <Typography variant="body2" sx={{ fontWeight: 600, color: "#374151", fontSize: "13px" }}>
                                Enrolled Group Staff ({group.memberCount ?? (group.members || group.memberEmpCodes || []).length} Members)
                              </Typography>
                            </Box>
                          </Box>

                          <Divider sx={{ my: 2 }} />

                          {/* Card Footer Actions */}
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Button
                              startIcon={<PersonAddIcon sx={{ fontSize: 16 }} />}
                              onClick={() => handleOpenManageMembers(group)}
                              sx={{
                                textTransform: "none",
                                color: "#0E9F6E",
                                fontWeight: 700,
                                fontSize: "13px",
                                p: 0,
                                "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
                              }}
                            >
                              Manage Members Table
                            </Button>

                            <Box display="flex" gap={0.5}>
                              <IconButton
                                size="small"
                                onClick={() => handleOpenEditGroup(group)}
                                sx={{ color: "#3B82F6", "&:hover": { bgcolor: "#EFF6FF" } }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleOpenDeleteGroupConfirm(group)}
                                sx={{ color: "#EF4444", "&:hover": { bgcolor: "#FEF2F2" } }}
                              >
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
          </Box>
        )}

        {/* ========================================================================= */}
        {/* MODAL: CREATE / EDIT SHIFT GROUP */}
        {/* ========================================================================= */}
        <Dialog
          open={groupModalOpen}
          onClose={() => !submittingGroup && setGroupModalOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: "14px", p: 1 } }}
        >
          <DialogTitle sx={{ fontWeight: 800, fontSize: "18px", color: "#111827", pb: 1 }}>
            {editingGroup ? "Edit Shift Group" : "Create New Shift Group"}
          </DialogTitle>
          <DialogContent sx={{ p: 2.5 }}>
            <Grid container spacing={2.5}>
              {/* Group Code Field */}
              <Grid item xs={12} sm={6}>
                {(() => {
                  const isDuplicateCode = Boolean(
                    groupForm.groupCode &&
                    groupForm.groupCode.trim() &&
                    groups.some(
                      (g) =>
                        (g.groupCode || "").trim().toLowerCase() === groupForm.groupCode.trim().toLowerCase() &&
                        (editingGroup ? (g._id || g.id) !== (editingGroup._id || editingGroup.id) : true)
                    )
                  );

                  return (
                    <>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", mb: 0.5, display: "block" }}>
                        Group Code
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        value={groupForm.groupCode}
                        onChange={(e) => setGroupForm({ ...groupForm, groupCode: e.target.value })}
                        placeholder="e.g. GRP-001"
                        error={isDuplicateCode}
                        helperText={
                          isDuplicateCode
                            ? "⚠️ This Group Code is already in use by another group"
                            : "Auto-generated unique code, editable if required"
                        }
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                      />
                    </>
                  );
                })()}
              </Grid>

              {/* Group Name Field */}
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", mb: 0.5, display: "block" }}>
                  Group Name *
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={groupForm.name}
                  onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
                  placeholder="Group Name *"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />
              </Grid>

              {/* Primary 24h Work Shift Selector */}
              <Grid item xs={12}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", mb: 0.5, display: "block" }}>
                  Primary 24h Work Shift *
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={groupForm.primaryShiftId}
                    onChange={(e) => setGroupForm({ ...groupForm, primaryShiftId: e.target.value })}
                    displayEmpty
                    sx={{ borderRadius: "8px" }}
                  >
                    <MenuItem disabled value="">
                      <em>Select Primary Shift</em>
                    </MenuItem>
                    {shifts.map((s) => {
                      const sId = s._id || s.id;
                      const duration = calculateDurationText(s.startTime, s.endTime);
                      return (
                        <MenuItem key={sId} value={sId}>
                          🔵 {s.name} ({s.startTime} – {s.endTime}, {duration})
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <FormHelperText sx={{ mt: 0.5 }}>
                    Main working shift template assigned to this group.
                  </FormHelperText>
                </FormControl>
              </Grid>

              {/* Secondary / Split Shift (Optional) */}
              <Grid item xs={12}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", mb: 0.5, display: "block" }}>
                  Secondary / Split Shift (Optional)
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={groupForm.secondaryShiftId}
                    onChange={(e) => setGroupForm({ ...groupForm, secondaryShiftId: e.target.value })}
                    displayEmpty
                    sx={{ borderRadius: "8px" }}
                  >
                    <MenuItem value="">
                      <em>None (Single Shift Group)</em>
                    </MenuItem>
                    {shifts.map((s) => {
                      const sId = s._id || s.id;
                      const duration = calculateDurationText(s.startTime, s.endTime);
                      return (
                        <MenuItem key={sId} value={sId}>
                          🟣 {s.name} ({s.startTime} – {s.endTime}, {duration})
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <FormHelperText sx={{ mt: 0.5 }}>
                    Optional 2nd shift for Split Shift groups (e.g. Morning + Evening).
                  </FormHelperText>
                </FormControl>
              </Grid>

              {/* Description (Optional) */}
              <Grid item xs={12}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", mb: 0.5, display: "block" }}>
                  Description (Optional)
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={groupForm.description}
                  onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })}
                  placeholder="e.g. Core operations team handling morning and split rotations"
                  multiline
                  rows={2}
                  helperText="Optional notes or description for this shift group."
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5, pt: 1 }}>
            <Button
              onClick={() => setGroupModalOpen(false)}
              disabled={submittingGroup}
              sx={{ textTransform: "none", color: "#6B7280", fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveGroup}
              disabled={submittingGroup}
              startIcon={submittingGroup ? <CircularProgress size={16} color="inherit" /> : null}
              sx={{
                textTransform: "none",
                bgcolor: "#0E9F6E",
                fontWeight: 700,
                borderRadius: "8px",
                px: 2.5,
                boxShadow: "none",
                "&:hover": { bgcolor: "#047857", boxShadow: "none" },
              }}
            >
              {submittingGroup ? "Saving..." : editingGroup ? "Update Shift Group" : "Create Shift Group"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* ========================================================================= */}
        {/* MODAL: DELETE SHIFT GROUP CONFIRMATION */}
        {/* ========================================================================= */}
        <Dialog
          open={deleteGroupConfirmOpen}
          onClose={() => setDeleteGroupConfirmOpen(false)}
          maxWidth="xs"
          fullWidth
          PaperProps={{ sx: { borderRadius: "14px", p: 1 } }}
        >
          <DialogTitle sx={{ fontWeight: 700, color: "#DC2626" }}>
            Delete Shift Group?
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete the shift group <strong>{groupToDelete?.name}</strong> ({groupToDelete?.groupCode})? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDeleteGroupConfirmOpen(false)} sx={{ textTransform: "none", color: "#6B7280", fontWeight: 600 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmDeleteGroup}
              sx={{ textTransform: "none", bgcolor: "#DC2626", fontWeight: 600, borderRadius: "8px", px: 2, boxShadow: "none", "&:hover": { bgcolor: "#B91C1C", boxShadow: "none" } }}
            >
              Confirm Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* ========================================================================= */}
        {/* MODAL: MANAGE MEMBERS TABLE (ENROLL & TRANSFER ROSTER) */}
        {/* ========================================================================= */}
        <Dialog
          open={manageMembersModalOpen}
          onClose={() => !savingMembers && setManageMembersModalOpen(false)}
          maxWidth="lg"
          fullWidth
          PaperProps={{ sx: { borderRadius: "14px", p: 1, minHeight: "680px" } }}
        >
          <DialogTitle sx={{ fontWeight: 800, fontSize: "19px", color: "#111827", pb: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 1 }}>
            <Box>
              <Box display="flex" alignItems="center" gap={1.2}>
                <GroupsIcon sx={{ color: "#0E9F6E", fontSize: 26 }} />
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#111827", fontSize: "19px" }}>
                  Manage Members Table — {activeGroupForMembers?.name}
                </Typography>
                <Chip
                  label={activeGroupForMembers?.groupCode || "GRP"}
                  size="small"
                  sx={{ bgcolor: "#DEF7EC", color: "#03543F", fontWeight: 700, fontSize: "11px", borderRadius: "6px" }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: "#6B7280", fontSize: "13px", mt: 0.5 }}>
                Assign and transfer organization employees into this shift group. Single Group Membership is automatically enforced.
              </Typography>
            </Box>

            <IconButton
              size="small"
              onClick={() => !savingMembers && setManageMembersModalOpen(false)}
              sx={{ color: "#9CA3AF", "&:hover": { bgcolor: "#F3F4F6", color: "#111827" } }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ p: 2.5, pt: 1.5 }}>
            {/* Top Stats & Context Bar */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 2.5,
                borderRadius: "10px",
                bgcolor: "#F9FAFB",
                border: "1px solid #E5E7EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
                <Box>
                  <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 600, display: "block" }}>
                    ASSIGNED SHIFTS
                  </Typography>
                  <Box display="flex" gap={0.5} mt={0.3} flexWrap="wrap">
                    {(activeGroupForMembers?.assignedShiftNames || ["Day Shift"]).map((sn, idx) => (
                      <Chip
                        key={idx}
                        label={sn}
                        size="small"
                        sx={{ bgcolor: "#EDE9FE", color: "#6D28D9", fontWeight: 700, fontSize: "11px", height: "22px" }}
                      />
                    ))}
                  </Box>
                </Box>

                <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" } }} />

                <Box>
                  <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 600, display: "block" }}>
                    TOTAL COMPANY STAFF
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#111827", mt: 0.3 }}>
                    {rosterEmployees.length} Employees
                  </Typography>
                </Box>

                <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" } }} />

                <Box>
                  <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 600, display: "block" }}>
                    CURRENTLY SELECTED
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#0E9F6E", mt: 0.3 }}>
                    {selectedEmpCodes.length} Enrolled
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Transfer Warning Alert */}
            {transferCount > 0 && (
              <Alert
                severity="warning"
                icon={<SwapHorizIcon fontSize="inherit" />}
                sx={{
                  mb: 2.5,
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "13px",
                  bgcolor: "#FFFBEB",
                  color: "#92400E",
                  border: "1px solid #FDE68A",
                }}
              >
                ⚠️ <strong>{transferCount} selected employee(s)</strong> are currently assigned to other shift groups in this company. Saving will automatically transfer them into <strong>&quot;{activeGroupForMembers?.name}&quot;</strong> and remove them from their previous group.
              </Alert>
            )}

            {/* Filter Toolbar */}
            <Grid container spacing={1.5} alignItems="center" mb={2}>
              {/* Search Field */}
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search by name, code, or device ID..."
                  value={rosterSearch}
                  onChange={(e) => setRosterSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" sx={{ color: "#9CA3AF" }} />
                      </InputAdornment>
                    ),
                    endAdornment: rosterSearch ? (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setRosterSearch("")}>
                          <CloseIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </InputAdornment>
                    ) : null,
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", bgcolor: "#FFFFFF" } }}
                />
              </Grid>

              {/* Branch Filter */}
              <Grid item xs={6} sm={2.5}>
                <FormControl fullWidth size="small">
                  <Select
                    value={rosterBranchFilter}
                    onChange={(e) => setRosterBranchFilter(e.target.value)}
                    displayEmpty
                    sx={{ borderRadius: "8px", bgcolor: "#FFFFFF", fontSize: "13px" }}
                  >
                    <MenuItem value="">
                      <em>All Branches ({rosterBranches.length})</em>
                    </MenuItem>
                    {rosterBranches.map((b) => (
                      <MenuItem key={b.id} value={b.id} sx={{ fontSize: "13px" }}>
                        {b.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Department Filter */}
              <Grid item xs={6} sm={2.5}>
                <FormControl fullWidth size="small">
                  <Select
                    value={rosterDeptFilter}
                    onChange={(e) => setRosterDeptFilter(e.target.value)}
                    displayEmpty
                    sx={{ borderRadius: "8px", bgcolor: "#FFFFFF", fontSize: "13px" }}
                  >
                    <MenuItem value="">
                      <em>All Depts ({rosterDepartments.length})</em>
                    </MenuItem>
                    {rosterDepartments.map((d) => (
                      <MenuItem key={d.id} value={d.id} sx={{ fontSize: "13px" }}>
                        {d.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Status Filter Tabs / Chips */}
              <Grid item xs={12} sm={3}>
                <Box display="flex" gap={0.5} flexWrap="wrap" justifyContent={{ xs: "flex-start", sm: "flex-end" }}>
                  {[
                    { id: "all", label: `All (${rosterEmployees.length})` },
                    { id: "in-group", label: `In Group (${rosterEmployees.filter((e) => e.isMember).length})` },
                    { id: "available", label: `Available (${rosterEmployees.filter((e) => e.status === "Available").length})` },
                  ].map((tab) => {
                    const isSelected = rosterStatusFilter === tab.id;
                    return (
                      <Chip
                        key={tab.id}
                        label={tab.label}
                        size="small"
                        clickable
                        onClick={() => setRosterStatusFilter(tab.id)}
                        sx={{
                          bgcolor: isSelected ? "#0E9F6E" : "#F3F4F6",
                          color: isSelected ? "#FFFFFF" : "#4B5563",
                          fontWeight: 700,
                          fontSize: "11px",
                          borderRadius: "6px",
                          "&:hover": { bgcolor: isSelected ? "#047857" : "#E5E7EB" },
                        }}
                      />
                    );
                  })}
                </Box>
              </Grid>
            </Grid>

            {/* Roster Table */}
            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{
                borderRadius: "10px",
                borderColor: "#E5E7EB",
                maxHeight: "480px",
                overflow: "auto",
              }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#F9FAFB" }}>
                    <TableCell padding="checkbox" sx={{ bgcolor: "#F9FAFB", width: 48 }}>
                      <Checkbox
                        size="small"
                        indeterminate={
                          filteredRosterEmployees.length > 0 &&
                          filteredRosterEmployees.some((e) => selectedEmpCodes.includes(e.empCode || e.deviceUserId || e._id)) &&
                          !filteredRosterEmployees.every((e) => selectedEmpCodes.includes(e.empCode || e.deviceUserId || e._id))
                        }
                        checked={
                          filteredRosterEmployees.length > 0 &&
                          filteredRosterEmployees.every((e) => selectedEmpCodes.includes(e.empCode || e.deviceUserId || e._id))
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleSelectAllFiltered(filteredRosterEmployees);
                          } else {
                            handleDeselectAllFiltered(filteredRosterEmployees);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#374151", fontSize: "12px", bgcolor: "#F9FAFB" }}>
                      EMPLOYEE / STAFF
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#374151", fontSize: "12px", bgcolor: "#F9FAFB" }}>
                      EMPLOYEE ID
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#374151", fontSize: "12px", bgcolor: "#F9FAFB" }}>
                      DEVICE USER ID
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#374151", fontSize: "12px", bgcolor: "#F9FAFB" }}>
                      BRANCH & DEPARTMENT
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#374151", fontSize: "12px", bgcolor: "#F9FAFB" }}>
                      CURRENT SHIFT GROUP
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#374151", fontSize: "12px", bgcolor: "#F9FAFB" }} align="center">
                      ENROLLMENT ACTION
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {loadingRoster ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <CircularProgress size={32} sx={{ color: "#0E9F6E", mb: 1.5 }} />
                        <Typography variant="body2" sx={{ color: "#6B7280", fontWeight: 600 }}>
                          Loading company roster and assignment status...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : filteredRosterEmployees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#4B5563", mb: 0.5 }}>
                          No Employees Match Search or Filters
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
                          Try clearing the search query or adjusting your branch/department filters.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRosterEmployees.map((emp) => {
                      const empIdentifier = emp.empCode || emp.deviceUserId || String(emp._id);
                      const isSelected = selectedEmpCodes.includes(empIdentifier);
                      const isOtherGroup = emp.status === "Assigned to Other Group";
                      const isWillTransfer = isSelected && isOtherGroup;

                      return (
                        <TableRow
                          key={emp._id || empIdentifier}
                          hover
                          onClick={() => handleToggleEmployee(empIdentifier)}
                          sx={{
                            cursor: "pointer",
                            bgcolor: isSelected ? "#F0FDF4" : "inherit",
                            transition: "background-color 0.15s ease",
                          }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              size="small"
                              checked={isSelected}
                              onChange={() => handleToggleEmployee(empIdentifier)}
                              sx={{
                                color: isSelected ? "#0E9F6E" : "#D1D5DB",
                                "&.Mui-checked": { color: "#0E9F6E" },
                              }}
                            />
                          </TableCell>

                          {/* Employee Staff / Name */}
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1.5}>
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  fontSize: "13px",
                                  fontWeight: 700,
                                  bgcolor: isSelected ? "#0E9F6E" : "#E5E7EB",
                                  color: isSelected ? "#FFFFFF" : "#374151",
                                }}
                              >
                                {emp.name ? emp.name.charAt(0).toUpperCase() : "U"}
                              </Avatar>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>
                                {emp.name}
                              </Typography>
                            </Box>
                          </TableCell>

                          {/* Employee ID */}
                          <TableCell>
                            {emp.employeeCode ? (
                              <Typography variant="body2" sx={{ fontWeight: 600, color: "#374151", fontFamily: "monospace", fontSize: "12px" }}>
                                {emp.employeeCode}
                              </Typography>
                            ) : emp.empCode && emp.empCode !== emp.deviceUserId ? (
                              <Typography variant="body2" sx={{ fontWeight: 600, color: "#374151", fontFamily: "monospace", fontSize: "12px" }}>
                                {emp.empCode}
                              </Typography>
                            ) : (
                              <Typography variant="body2" sx={{ color: "#9CA3AF", fontSize: "12px" }}>
                                —
                              </Typography>
                            )}
                          </TableCell>

                          {/* Device User ID */}
                          <TableCell>
                            {emp.deviceUserId ? (
                              <Box
                                sx={{
                                  display: "inline-block",
                                  padding: "3px 8px",
                                  borderRadius: "6px",
                                  backgroundColor: "#DEF7EC",
                                  color: "#03543F",
                                  fontSize: "12px",
                                  fontWeight: 700,
                                  fontFamily: "monospace",
                                }}
                              >
                                {emp.deviceUserId}
                              </Box>
                            ) : (
                              <Typography variant="body2" sx={{ color: "#9CA3AF", fontSize: "12px" }}>
                                —
                              </Typography>
                            )}
                          </TableCell>

                          {/* Branch & Department */}
                          <TableCell>
                            <Box display="flex" flexDirection="column" gap={0.3}>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: "#374151", fontSize: "12px" }}>
                                {emp.branchName || "—"}
                              </Typography>
                              <Typography variant="caption" sx={{ color: "#6B7280", fontSize: "11px" }}>
                                {emp.departmentName || "—"}
                              </Typography>
                            </Box>
                          </TableCell>

                          {/* Current Shift Group */}
                          <TableCell>
                            {emp.isMember ? (
                              <Chip
                                label="🟢 Enrolled in this Group"
                                size="small"
                                sx={{ bgcolor: "#DEF7EC", color: "#03543F", fontWeight: 700, fontSize: "11px", height: "24px" }}
                              />
                            ) : emp.assignedGroup ? (
                              <Box display="flex" flexDirection="column" gap={0.3}>
                                <Chip
                                  label={`🟠 ${emp.assignedGroup.name} (${emp.assignedGroup.groupCode})`}
                                  size="small"
                                  sx={{ bgcolor: "#FEF3C7", color: "#92400E", fontWeight: 700, fontSize: "11px", height: "24px", width: "fit-content" }}
                                />
                                {isWillTransfer && (
                                  <Typography variant="caption" sx={{ color: "#D97706", fontWeight: 700, fontSize: "10px" }}>
                                    🔄 Will transfer to this group upon save
                                  </Typography>
                                )}
                              </Box>
                            ) : (
                              <Chip
                                label="⚪ Available (Unassigned)"
                                size="small"
                                sx={{ bgcolor: "#F3F4F6", color: "#4B5563", fontWeight: 600, fontSize: "11px", height: "24px" }}
                              />
                            )}
                          </TableCell>

                          {/* Enrollment Action */}
                          <TableCell align="center">
                            {isSelected ? (
                              <Chip
                                icon={<CheckCircleIcon style={{ fontSize: 14, color: "#0E9F6E" }} />}
                                label="Enrolled"
                                size="small"
                                sx={{ bgcolor: "#DEF7EC", color: "#03543F", fontWeight: 700, fontSize: "11px", height: "24px" }}
                              />
                            ) : (
                              <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 600 }}>
                                Click to Add
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>

          <DialogActions sx={{ p: 2.5, pt: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 600 }}>
                {selectedEmpCodes.length} of {rosterEmployees.length} staff selected
              </Typography>
              {transferCount > 0 && (
                <Chip
                  label={`${transferCount} Transfer(s)`}
                  size="small"
                  sx={{ bgcolor: "#FEF3C7", color: "#92400E", fontWeight: 700, fontSize: "11px", height: 20 }}
                />
              )}
            </Box>

            <Box display="flex" gap={1.5}>
              <Button
                onClick={() => !savingMembers && setManageMembersModalOpen(false)}
                disabled={savingMembers}
                sx={{ textTransform: "none", color: "#6B7280", fontWeight: 600 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveMembers}
                disabled={savingMembers || loadingRoster}
                startIcon={savingMembers ? <CircularProgress size={16} color="inherit" /> : <CheckIcon />}
                sx={{
                  textTransform: "none",
                  bgcolor: "#0E9F6E",
                  fontWeight: 700,
                  borderRadius: "8px",
                  px: 3,
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#047857", boxShadow: "none" },
                }}
              >
                {savingMembers
                  ? "Saving Enrolled Members..."
                  : `Save & Enroll Members (${selectedEmpCodes.length})`}
              </Button>
            </Box>
          </DialogActions>
        </Dialog>

        {/* ========================================================================= */}
        {/* MODAL: ADD / EDIT WORK SHIFT TEMPLATE */}
        {/* ========================================================================= */}
        <Dialog
          open={shiftModalOpen}
          onClose={() => !submittingShift && setShiftModalOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: "14px", p: 1 } }}
        >
          <DialogTitle sx={{ fontWeight: 800, fontSize: "18px", color: "#111827", pb: 1 }}>
            {editingShift ? "Edit Work Shift (24h Format & Device Locations)" : "Create New Work Shift (24h Format & Device Locations)"}
          </DialogTitle>
          <DialogContent sx={{ p: 2.5 }}>
            <Grid container spacing={2.5}>
              {/* Shift Code Field */}
              <Grid item xs={12} sm={6}>
                {(() => {
                  const isDuplicateCode = Boolean(
                    shiftForm.shiftCode &&
                    shiftForm.shiftCode.trim() &&
                    shifts.some(
                      (s) =>
                        (s.shiftCode || "").trim().toLowerCase() === shiftForm.shiftCode.trim().toLowerCase() &&
                        (editingShift ? (s._id || s.id) !== (editingShift._id || editingShift.id) : true)
                    )
                  );

                  return (
                    <>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", mb: 0.5, display: "block" }}>
                        Shift Code
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        value={shiftForm.shiftCode}
                        onChange={(e) => setShiftForm({ ...shiftForm, shiftCode: e.target.value })}
                        placeholder="e.g. SHIFT-001"
                        error={isDuplicateCode}
                        helperText={
                          isDuplicateCode
                            ? "⚠️ This Shift Code is already in use by another shift"
                            : "Auto-generated unique code, editable if required"
                        }
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                      />
                    </>
                  );
                })()}
              </Grid>

              {/* Shift Name Field */}
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", mb: 0.5, display: "block" }}>
                  Shift Name *
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={shiftForm.name}
                  onChange={(e) => setShiftForm({ ...shiftForm, name: e.target.value })}
                  placeholder="Shift Name *"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />
              </Grid>

              {/* Start Time Field */}
              <Grid item xs={12} sm={6}>
                {(() => {
                  const hasValue = Boolean(shiftForm.startTime);
                  const isComplete = shiftForm.startTime.length === 5;
                  const isInvalid = hasValue && (isComplete ? !isValid24HourTime(shiftForm.startTime) : false);

                  return (
                    <>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", mb: 0.5, display: "block" }}>
                        Start Time (24h Format HH:mm) *
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        value={shiftForm.startTime}
                        onChange={(e) => handleTimeInputChange("startTime", e.target.value)}
                        placeholder="09:00"
                        error={isInvalid}
                        inputProps={{ maxLength: 5 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccessTimeIcon fontSize="small" sx={{ color: isInvalid ? "#EF4444" : "#0E9F6E" }} />
                            </InputAdornment>
                          ),
                        }}
                        helperText={
                          isInvalid
                            ? "⚠️ Invalid time (Hours: 00–23, Minutes: 00–59)"
                            : "24-hour format: 00:00 to 23:59 (No AM/PM)"
                        }
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                      />
                    </>
                  );
                })()}
              </Grid>

              {/* End Time Field */}
              <Grid item xs={12} sm={6}>
                {(() => {
                  const hasValue = Boolean(shiftForm.endTime);
                  const isComplete = shiftForm.endTime.length === 5;
                  const isInvalid = hasValue && (isComplete ? !isValid24HourTime(shiftForm.endTime) : false);
                  const duration = calculateDurationText(shiftForm.startTime, shiftForm.endTime);

                  return (
                    <>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", mb: 0.5, display: "block" }}>
                        End Time (24h Format HH:mm) *
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        value={shiftForm.endTime}
                        onChange={(e) => handleTimeInputChange("endTime", e.target.value)}
                        placeholder="18:00"
                        error={isInvalid}
                        inputProps={{ maxLength: 5 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccessTimeIcon fontSize="small" sx={{ color: isInvalid ? "#EF4444" : "#0E9F6E" }} />
                            </InputAdornment>
                          ),
                        }}
                        helperText={
                          isInvalid
                            ? "⚠️ Invalid time (Hours: 00–23, Minutes: 00–59)"
                            : duration
                              ? `⏱️ Duration: ${duration}`
                              : "24-hour format: 00:00 to 23:59 (No AM/PM)"
                        }
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                      />
                    </>
                  );
                })()}
              </Grid>

              {/* Allowed Biometric Devices Field */}
              <Grid item xs={12}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", mb: 0.5, display: "block" }}>
                  Allowed Attendance Biometric Devices (Location Restriction)
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    multiple
                    value={shiftForm.deviceIds}
                    onChange={(e) => setShiftForm({ ...shiftForm, deviceIds: e.target.value })}
                    displayEmpty
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return <em style={{ color: "#9CA3AF" }}>All Company Devices (No restriction)</em>;
                      }
                      return selected.map((id) => getDeviceLabel(id)).join(", ");
                    }}
                    sx={{ borderRadius: "8px" }}
                  >
                    <MenuItem value="" disabled>
                      <em>Select Devices (Optional restriction)</em>
                    </MenuItem>
                    {availableDevices.length === 0 ? (
                      <MenuItem disabled value="">
                        <em>No biometric devices available for this company</em>
                      </MenuItem>
                    ) : (
                      availableDevices.map((d) => {
                        const devId = d._id || d.id;
                        const isSelected = shiftForm.deviceIds.includes(devId);
                        return (
                          <MenuItem key={devId} value={devId}>
                            <Checkbox checked={isSelected} size="small" />
                            📟 {getDeviceLabel(devId)}
                          </MenuItem>
                        );
                      })
                    )}
                  </Select>
                  <FormHelperText sx={{ mt: 0.5 }}>
                    💡 Staff assigned to this shift will only be permitted to clock attendance on selected biometric terminals.
                  </FormHelperText>
                </FormControl>
              </Grid>

              {/* Working Days Field */}
              <Grid item xs={12}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", mb: 1, display: "block" }}>
                  Select Working Days (Mon – Sun) *
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {ALL_WORKING_DAYS.map((day) => {
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

              {/* Description (Optional) */}
              <Grid item xs={12}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", mb: 0.5, display: "block" }}>
                  Description (Optional)
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={shiftForm.description}
                  onChange={(e) => setShiftForm({ ...shiftForm, description: e.target.value })}
                  placeholder="e.g. Standard morning shift for administrative and reception personnel."
                  multiline
                  rows={2}
                  helperText="Optional notes, instructions, or comments for this work shift schedule."
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5, pt: 1 }}>
            <Button
              onClick={() => setShiftModalOpen(false)}
              disabled={submittingShift}
              sx={{ textTransform: "none", color: "#6B7280", fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveShift}
              disabled={submittingShift}
              startIcon={submittingShift ? <CircularProgress size={16} color="inherit" /> : null}
              sx={{
                textTransform: "none",
                bgcolor: "#0E9F6E",
                fontWeight: 700,
                borderRadius: "8px",
                px: 2.5,
                boxShadow: "none",
                "&:hover": { bgcolor: "#047857", boxShadow: "none" },
              }}
            >
              {submittingShift ? "Saving..." : editingShift ? "Update Work Shift" : "Save 24h Shift Schedule"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal: Delete Shift Template Confirmation */}
        <Dialog
          open={deleteShiftConfirmOpen}
          onClose={() => setDeleteShiftConfirmOpen(false)}
          maxWidth="xs"
          fullWidth
          PaperProps={{ sx: { borderRadius: "14px", p: 1 } }}
        >
          <DialogTitle sx={{ fontWeight: 700, color: "#DC2626" }}>
            Delete Shift Template?
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete the shift template <strong>{shiftToDelete?.name}</strong> ({shiftToDelete?.shiftCode})? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDeleteShiftConfirmOpen(false)} sx={{ textTransform: "none", color: "#6B7280", fontWeight: 600 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmDeleteShift}
              sx={{ textTransform: "none", bgcolor: "#DC2626", fontWeight: 600, borderRadius: "8px", px: 2, boxShadow: "none", "&:hover": { bgcolor: "#B91C1C", boxShadow: "none" } }}
            >
              Confirm Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Global Feedback Snackbar */}
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
