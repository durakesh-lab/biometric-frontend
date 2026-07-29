import React, { useState, useEffect } from "react";
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
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  Chip,
  InputAdornment,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import Layout from "../../components/Layout/Layout";
import axios from "axios";

export default function DeviceAssignmentPage() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [snackbar, setSnackbar] = useState(null);

  // Edit dialog state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form selections
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [locationText, setLocationText] = useState("");
  const [defaultPunchType, setDefaultPunchType] = useState("auto");

  // Cascading dropdown options
  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [loadingBranches, setLoadingBranches] = useState(false);
  const [loadingDepts, setLoadingDepts] = useState(false);

  const token = () => (typeof window !== "undefined" ? localStorage.getItem("biometric_token") : null);
  const auth = () => ({ headers: { Authorization: token() } });

  // 1. Fetch sanitized device assignment list
  const fetchAssignmentList = async () => {
    try {
      setLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      let res;
      try {
        res = await axios.post(`${baseUrl}/devices/assignment-list`, {}, {
          ...auth(),
          params: { page: 1, page_size: 100 },
        });
      } catch (err) {
        if (err.response && err.response.status === 404) {
          res = await axios.post(`${baseUrl}/devices/list`, {}, {
            ...auth(),
            params: { page: 1, page_size: 100 },
          });
        } else {
          throw err;
        }
      }
      setDevices(res.data?.data || []);
    } catch (e) {
      console.error("Error loading assignment list:", e);
      setSnackbar({ status: false, message: "Could not load device assignment list" });
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch Companies dropdown
  const fetchCompanies = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      let res;
      try {
        res = await axios.get(`${baseUrl}/company/allcompany`, auth());
      } catch {
        res = await axios.get(`${baseUrl}/company`, auth());
      }
      const data = res.data?.data || res.data || [];
      setCompanies(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error fetching companies:", e);
    }
  };

  // 3. Fetch Branches for a company
  const fetchBranchesForCompany = async (companyId) => {
    if (!companyId) {
      setBranches([]);
      return;
    }
    try {
      setLoadingBranches(true);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const res = await axios.get(`${baseUrl}/company/${companyId}/branches`, auth());
      const data = res.data?.data || res.data || [];
      setBranches(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error fetching branches:", e);
      setBranches([]);
    } finally {
      setLoadingBranches(false);
    }
  };

  // 4. Fetch Departments for a branch
  const fetchDeptsForBranch = async (branchId) => {
    if (!branchId) {
      setDepartments([]);
      return;
    }
    try {
      setLoadingDepts(true);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const res = await axios.get(`${baseUrl}/department/${branchId}`, auth());
      const data = res.data?.data || res.data || [];
      setDepartments(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error fetching departments:", e);
      setDepartments([]);
    } finally {
      setLoadingDepts(false);
    }
  };

  useEffect(() => {
    fetchAssignmentList();
    fetchCompanies();
  }, []);

  // Open Edit dialog for assignment
  const handleOpenEdit = async (device) => {
    setEditingDevice(device);
    const compId = device.companyId || "";
    const brId = device.branchId || "";
    const dpId = device.deptId || "";

    setSelectedCompany(compId);
    setSelectedBranch(brId);
    setSelectedDept(dpId);
    setLocationText(device.location || "");
    setDefaultPunchType(device.defaultPunchType || "auto");

    setModalOpen(true);

    if (compId) {
      await fetchBranchesForCompany(compId);
    } else {
      setBranches([]);
    }

    if (brId) {
      await fetchDeptsForBranch(brId);
    } else {
      setDepartments([]);
    }
  };

  // Company selection change
  const handleCompanyChange = (e) => {
    const val = e.target.value;
    setSelectedCompany(val);
    setSelectedBranch("");
    setSelectedDept("");
    setDepartments([]);
    if (val) {
      fetchBranchesForCompany(val);
    } else {
      setBranches([]);
    }
  };

  // Branch selection change
  const handleBranchChange = (e) => {
    const val = e.target.value;
    setSelectedBranch(val);
    setSelectedDept("");
    if (val) {
      fetchDeptsForBranch(val);
    } else {
      setDepartments([]);
    }
  };

  // Save Assignment submit handler
  const handleSaveAssignment = async () => {
    if (!selectedCompany) {
      setSnackbar({ status: false, message: "Company selection is mandatory." });
      return;
    }

    try {
      setSaving(true);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const payload = {
        companyId: selectedCompany,
        branchId: selectedBranch || null,
        deptId: selectedDept || null,
        location: locationText || null,
        defaultPunchType: defaultPunchType,
      };

      // Local state update for immediate UI preview
      setDevices((prev) =>
        prev.map((d) => (d._id === editingDevice._id ? { ...d, ...payload, defaultPunchType: defaultPunchType } : d))
      );

      try {
        await axios.put(`${baseUrl}/devices/${editingDevice._id}/assign`, payload, auth());
      } catch (err) {
        if (err.response && err.response.status === 404) {
          await axios.put(`${baseUrl}/devices/${editingDevice._id}`, payload, auth());
        }
      }

      setSnackbar({ status: true, message: "Device assignment updated successfully." });
      setModalOpen(false);
    } catch (e) {
      console.error("Error saving assignment:", e);
      const msg = e.response?.data?.message || "Failed to update device assignment";
      setSnackbar({ status: false, message: Array.isArray(msg) ? msg.join(", ") : msg });
    } finally {
      setSaving(false);
    }
  };

  // Filtered devices list for search
  const filteredDevices = devices.filter((d) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      (d.name && d.name.toLowerCase().includes(term)) ||
      (d.company_name && d.company_name.toLowerCase().includes(term)) ||
      (d.branch_name && d.branch_name.toLowerCase().includes(term)) ||
      (d.dept_name && d.dept_name.toLowerCase().includes(term)) ||
      (d.location && d.location.toLowerCase().includes(term))
    );
  });

  return (
    <Layout title="Device Assignment">
      <Box sx={{ p: 3, maxWidth: 1400, margin: "0 auto" }}>
        {/* Header section */}
        <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#0F172A" }}>
              Device Assignment
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B", mt: 0.5 }}>
              Assign devices to organizational units, physical locations, and punch modes (Dedicated In/Out).
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              size="small"
              placeholder="Search assignment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#94A3B8", fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: 260,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  backgroundColor: "#FFFFFF",
                },
              }}
            />
          </Box>
        </Box>

        {/* Table container */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: "14px",
            border: "1px solid #E2E8F0",
            overflow: "hidden",
            boxShadow: "0px 4px 12px rgba(15, 23, 42, 0.03)",
          }}
        >
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: "#F8FAFC" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>Device Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>Punch Mode</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>Company</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>Branch</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>Department</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>Location</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={32} sx={{ color: "#0E9F6E" }} />
                      <Typography sx={{ color: "#64748B", mt: 1.5, fontSize: 14 }}>
                        Loading device assignments...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : filteredDevices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      <Typography sx={{ color: "#64748B", fontSize: 14 }}>
                        No device assignments found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDevices.map((d) => (
                    <TableRow key={d._id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      <TableCell sx={{ fontWeight: 600, color: "#0F172A" }}>
                        {d.name}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={d.status || "Offline"}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: 12,
                            backgroundColor: d.status === "Online" ? "rgba(14, 159, 110, 0.1)" : "#F1F5F9",
                            color: d.status === "Online" ? "#0E9F6E" : "#64748B",
                            border: d.status === "Online" ? "1px solid rgba(14, 159, 110, 0.2)" : "1px solid #E2E8F0",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            d.defaultPunchType === "in"
                              ? "Dedicated IN"
                              : d.defaultPunchType === "out"
                                ? "Dedicated OUT"
                                : "Auto (Dynamic)"
                          }
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: 11,
                            backgroundColor:
                              d.defaultPunchType === "in"
                                ? "#DEF7EC"
                                : d.defaultPunchType === "out"
                                  ? "#FDE8E8"
                                  : "#E0F2FE",
                            color:
                              d.defaultPunchType === "in"
                                ? "#03543F"
                                : d.defaultPunchType === "out"
                                  ? "#9B1C1C"
                                  : "#0369A1",
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: d.company_name ? "#0F172A" : "#94A3B8" }}>
                        {d.company_name || "Unassigned"}
                      </TableCell>
                      <TableCell sx={{ color: d.branch_name ? "#0F172A" : "#94A3B8" }}>
                        {d.branch_name || "Entire Company"}
                      </TableCell>
                      <TableCell sx={{ color: d.dept_name ? "#0F172A" : "#94A3B8" }}>
                        {d.dept_name || "Entire Branch"}
                      </TableCell>
                      <TableCell sx={{ color: d.location ? "#0F172A" : "#94A3B8" }}>
                        {d.location || "—"}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Edit Device Assignment & Punch Mode">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEdit(d)}
                            sx={{
                              color: "#0E9F6E",
                              backgroundColor: "rgba(14, 159, 110, 0.08)",
                              "&:hover": { backgroundColor: "rgba(14, 159, 110, 0.18)" },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Edit Assignment Modal */}
        <Dialog
          open={modalOpen}
          onClose={() => !saving && setModalOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: "16px", p: 1 },
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, fontSize: 18, color: "#0F172A", pb: 1 }}>
            Assign Device: {editingDevice?.name}
          </DialogTitle>
          <DialogContent dividers sx={{ borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0", py: 3 }}>
            <Grid container spacing={2.5}>
              {/* Device Punch Mode (IN / OUT / AUTO) */}
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel id="select-punch-mode-label">Device Punch Mode</InputLabel>
                  <Select
                    labelId="select-punch-mode-label"
                    value={defaultPunchType}
                    label="Device Punch Mode"
                    onChange={(e) => setDefaultPunchType(e.target.value)}
                    sx={{ borderRadius: "8px" }}
                  >
                    <MenuItem value="auto">
                      <b>Auto (Dynamic)</b> — 1st punch = IN, 2nd punch = OUT
                    </MenuItem>
                    <MenuItem value="in">
                      <b>Dedicated Check-In (IN)</b> — All punches from this device = IN
                    </MenuItem>
                    <MenuItem value="out">
                      <b>Dedicated Check-Out (OUT)</b> — All punches from this device = OUT
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Company Dropdown (Required) */}
              <Grid item xs={12}>
                <FormControl fullWidth size="small" required>
                  <InputLabel id="select-company-label">Company</InputLabel>
                  <Select
                    labelId="select-company-label"
                    value={selectedCompany}
                    label="Company *"
                    onChange={handleCompanyChange}
                    sx={{ borderRadius: "8px" }}
                  >
                    <MenuItem value="">
                      <em>Select Company</em>
                    </MenuItem>
                    {companies.map((c) => (
                      <MenuItem key={c._id} value={c._id}>
                        {c.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Branch Dropdown */}
              <Grid item xs={12}>
                <FormControl fullWidth size="small" disabled={!selectedCompany || loadingBranches}>
                  <InputLabel id="select-branch-label">Branch (Optional)</InputLabel>
                  <Select
                    labelId="select-branch-label"
                    value={selectedBranch}
                    label="Branch (Optional)"
                    onChange={handleBranchChange}
                    sx={{ borderRadius: "8px" }}
                  >
                    <MenuItem value="">
                      <em>None (Entire Company)</em>
                    </MenuItem>
                    {branches.map((b) => (
                      <MenuItem key={b._id} value={b._id}>
                        {b.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Department Dropdown */}
              <Grid item xs={12}>
                <FormControl fullWidth size="small" disabled={!selectedBranch || loadingDepts}>
                  <InputLabel id="select-dept-label">Department (Optional)</InputLabel>
                  <Select
                    labelId="select-dept-label"
                    value={selectedDept}
                    label="Department (Optional)"
                    onChange={(e) => setSelectedDept(e.target.value)}
                    sx={{ borderRadius: "8px" }}
                  >
                    <MenuItem value="">
                      <em>None (Entire Branch)</em>
                    </MenuItem>
                    {departments.map((dep) => (
                      <MenuItem key={dep._id} value={dep._id}>
                        {dep.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Location Text Input */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Location (Optional)"
                  placeholder="e.g. Front Gate, Server Room, Building B"
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button
              onClick={() => setModalOpen(false)}
              disabled={saving}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                color: "#64748B",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveAssignment}
              disabled={saving}
              variant="contained"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                backgroundColor: "#0E9F6E",
                borderRadius: "8px",
                px: 3,
                "&:hover": { backgroundColor: "#047857" },
              }}
            >
              {saving ? "Saving..." : "Save Assignment"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={Boolean(snackbar)}
          autoHideDuration={4000}
          onClose={() => setSnackbar(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            severity={snackbar?.status ? "success" : "error"}
            onClose={() => setSnackbar(null)}
            sx={{ borderRadius: "10px" }}
          >
            {snackbar?.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
}
