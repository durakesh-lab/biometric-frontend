import React, { useState, useEffect, useMemo } from "react";
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
  Chip,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Layout from "../../components/Layout/Layout";
import axios from "axios";

export default function EnrollmentPage() {
  const [employees, setEmployees] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all"); // all | pending | linked
  const [snackbar, setSnackbar] = useState(null);

  // Link dialog state
  const [linkOpen, setLinkOpen] = useState(false);
  const [target, setTarget] = useState(null);
  const [empCode, setEmpCode] = useState("");
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [saving, setSaving] = useState(false);

  const token = () => (typeof window !== "undefined" ? localStorage.getItem("biometric_token") : null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/employees/list-all`,
        {},
        { headers: { Authorization: token() }, params: { page: 1, page_size: 1000 } }
      );
      setEmployees(res.data?.data || []);
    } catch (e) {
      console.error("Error loading employees:", e);
      setSnackbar({ status: false, message: "Could not load employees" });
    } finally {
      setLoading(false);
    }
  };

  const fetchDevices = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/devices/assignment-list`,
        {},
        { headers: { Authorization: token() } }
      );
      setDevices(res.data?.data || res.data || []);
    } catch (e) {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/devices/list`,
          {},
          { headers: { Authorization: token() } }
        );
        setDevices(res.data?.data || res.data || []);
      } catch (err) {
        console.error("Could not fetch devices:", err);
      }
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchDevices();
  }, []);

  const counts = useMemo(() => {
    const linked = employees.filter((e) => e.deviceUserId || (e.deviceLinks && e.deviceLinks.length > 0)).length;
    return { all: employees.length, linked, pending: employees.length - linked };
  }, [employees]);

  const rows = useMemo(() => {
    let list = employees;
    if (tab === "pending") list = list.filter((e) => !e.deviceUserId && (!e.deviceLinks || e.deviceLinks.length === 0));
    if (tab === "linked") list = list.filter((e) => e.deviceUserId || (e.deviceLinks && e.deviceLinks.length > 0));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((e) =>
        `${e.firstName || ""} ${e.lastName || ""} ${e.email || ""} ${e.deviceUserId || ""}`
          .toLowerCase()
          .includes(q)
      );
    }
    return list;
  }, [employees, tab, search]);

  const openLink = (emp) => {
    setTarget(emp);
    setEmpCode(emp.deviceUserId || "");
    const existingIds = (emp.deviceLinks || []).map((dl) => dl.deviceId);
    setSelectedDevices(existingIds);
    setLinkOpen(true);
  };

  const toggleDeviceSelect = (id) => {
    setSelectedDevices((prev) =>
      prev.includes(id) ? prev.filter((dId) => dId !== id) : [...prev, id]
    );
  };

  const saveLink = async () => {
    if (!empCode.trim()) {
      setSnackbar({ status: false, message: "Enter the Device User ID (emp_code)" });
      return;
    }

    const clash = employees.find(
      (e) => e._id !== target._id && String(e.deviceUserId) === String(empCode.trim())
    );
    if (clash) {
      setSnackbar({
        status: false,
        message: `Device User ID #${empCode} is already assigned to ${clash.firstName || ""} ${clash.lastName || ""}`.trim(),
      });
      return;
    }

    try {
      setSaving(true);
      const linkPayload = selectedDevices.map((id) => ({ deviceId: id }));
      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/employees/${target._id}/enroll`,
        { deviceUserId: empCode.trim(), deviceLinks: linkPayload },
        { headers: { Authorization: token() } }
      );
      setSnackbar({ status: true, message: `Successfully saved enrollment for ${target.firstName || "employee"}` });
      setLinkOpen(false);
      fetchEmployees();
    } catch (e) {
      console.error("Error linking device:", e);
      setSnackbar({ status: false, message: e.response?.data?.message || "Could not save enrollment" });
    } finally {
      setSaving(false);
    }
  };

  const TabChip = ({ id, label, count }) => (
    <Chip
      label={`${label} ${count}`}
      onClick={() => setTab(id)}
      variant={tab === id ? "filled" : "outlined"}
      sx={{
        fontWeight: 600,
        cursor: "pointer",
        ...(tab === id
          ? { backgroundColor: "#0E9F6E", color: "#fff", "&:hover": { backgroundColor: "#047857" } }
          : { borderColor: "#E5E7EB", color: "#4B5563" }),
      }}
    />
  );

  return (
    <Layout>
      <Box sx={{ my: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary" }}>
            Biometric Enrollment
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            Link each employee to their device ID (emp_code) and select the devices they are authorized to punch on.
          </Typography>
        </Box>

        <Paper elevation={0} sx={{ border: "1px solid #E5E7EB", borderRadius: "8px", overflow: "hidden" }}>
          {/* Toolbar: filter chips + search */}
          <Box
            sx={{
              p: 2,
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexWrap: "wrap",
              borderBottom: "1px solid #E5E7EB",
            }}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              <TabChip id="all" label="All" count={counts.all} />
              <TabChip id="pending" label="Not linked" count={counts.pending} />
              <TabChip id="linked" label="Linked" count={counts.linked} />
            </Box>
            <TextField
              size="small"
              placeholder="Search name / email / device ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ width: 320, ml: "auto", "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#9CA3AF" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Table */}
          <TableContainer sx={{ maxHeight: "65vh" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ "& th": { backgroundColor: "#F9FAFB", fontWeight: 600, color: "#4B5563" } }}>
                  <TableCell>SN.</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Branch</TableCell>
                  <TableCell align="center">Device User ID</TableCell>
                  <TableCell align="center">Linked Devices</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={36} />
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6, color: "text.secondary" }}>
                      No employees found
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((e, i) => {
                    const linkedDevicesList = e.linkedDevices || [];
                    return (
                      <TableRow key={e._id} hover>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>{`${e.firstName || ""} ${e.lastName || ""}`.trim() || "—"}</TableCell>
                        <TableCell>{e.email || "—"}</TableCell>
                        <TableCell>{e.branch_name || "—"}</TableCell>
                        <TableCell align="center">
                          {e.deviceUserId ? (
                            <Chip label={`#${e.deviceUserId}`} size="small"
                              sx={{ backgroundColor: "#DEF7EC", color: "#03543F", fontWeight: 600 }} />
                          ) : (
                            <Chip label="Not assigned" size="small"
                              sx={{ backgroundColor: "#FDE8E8", color: "#9B1C1C", fontWeight: 600 }} />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {linkedDevicesList.length > 0 ? (
                            <Stack direction="row" spacing={0.5} justifyContent="center" flexWrap="wrap" useFlexGap>
                              {linkedDevicesList.map((dev) => (
                                <Chip
                                  key={dev._id}
                                  label={dev.name || dev.serialNumber}
                                  size="small"
                                  variant="outlined"
                                  sx={{ borderColor: "#10B981", color: "#047857", fontWeight: 500 }}
                                />
                              ))}
                            </Stack>
                          ) : (
                            <Chip label="No devices" size="small" variant="outlined" sx={{ color: "#9CA3AF" }} />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            size="small"
                            variant={e.deviceUserId ? "outlined" : "contained"}
                            onClick={() => openLink(e)}
                            sx={{
                              textTransform: "none",
                              borderRadius: "8px",
                              ...(e.deviceUserId
                                ? { borderColor: "#0E9F6E", color: "#0E9F6E" }
                                : { backgroundColor: "#0E9F6E", "&:hover": { backgroundColor: "#047857" } }),
                            }}
                          >
                            {e.deviceUserId ? "Update Link" : "Link Devices"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* Link device ID dialog */}
      <Dialog open={linkOpen} onClose={() => setLinkOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Enrollment & Device Links — {target ? `${target.firstName || ""} ${target.lastName || ""}`.trim() : ""}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ bgcolor: "#FFF7ED", color: "#9A3412", p: 1.5, borderRadius: "8px", mb: 2.5, fontSize: 13 }}>
            ⚠️ The finger/face template is registered on the <b>biometric terminal</b>. Enter the person's
            <b> Device User ID (emp_code)</b> and select all hardware devices where this person is authorized.
          </Box>
          <TextField
            autoFocus
            fullWidth
            label="Device User ID (emp_code)"
            value={empCode}
            onChange={(e) => setEmpCode(e.target.value)}
            placeholder="e.g. 1006"
            sx={{ mb: 3 }}
          />

          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: "text.primary" }}>
            Authorize Hardware Devices:
          </Typography>
          {devices.length === 0 ? (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              No active devices found. Register devices under Device Management first.
            </Typography>
          ) : (
            <Paper variant="outlined" sx={{ p: 1, maxHeight: 200, overflowY: "auto", borderRadius: "8px" }}>
              <FormGroup>
                {devices.map((dev) => (
                  <FormControlLabel
                    key={dev._id}
                    control={
                      <Checkbox
                        checked={selectedDevices.includes(dev._id)}
                        onChange={() => toggleDeviceSelect(dev._id)}
                        sx={{ color: "#0E9F6E", "&.Mui-checked": { color: "#0E9F6E" } }}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {dev.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                          Serial: {dev.serialNumber || "—"} {dev.location ? `• Location: ${dev.location}` : ""}
                        </Typography>
                      </Box>
                    }
                    sx={{ mb: 0.5 }}
                  />
                ))}
              </FormGroup>
            </Paper>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setLinkOpen(false)} sx={{ textTransform: "none", color: "text.secondary" }}>
            Cancel
          </Button>
          <Button
            onClick={saveLink}
            disabled={saving}
            variant="contained"
            sx={{ textTransform: "none", backgroundColor: "#0E9F6E", "&:hover": { backgroundColor: "#047857" } }}
          >
            {saving ? "Saving…" : "Save Enrollment"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(snackbar)}
        autoHideDuration={5000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snackbar?.status ? "success" : "error"}
          variant="filled"
          onClose={() => setSnackbar(null)}
          sx={{ backgroundColor: snackbar?.status ? "#0e9f6e" : "#d32f2f", color: "#fff" }}
        >
          {snackbar?.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
}
