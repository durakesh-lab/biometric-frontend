import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  FormControl,
  FormGroup,
  FormControlLabel,
  Select,
  MenuItem,
  Stack,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ReactPaginate from "react-paginate";
import Layout, { theme } from "../../components/Layout/Layout";
import axios from "axios";

export default function EnrollmentPage() {
  const [employees, setEmployees] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all"); // all | pending | linked
  const [snackbar, setSnackbar] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"), { noSsr: true });
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 5,
  });

  // Link dialog state
  const [linkOpen, setLinkOpen] = useState(false);
  const [target, setTarget] = useState(null);
  const [empCode, setEmpCode] = useState("");
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [saving, setSaving] = useState(false);

  const token = useCallback(() => (typeof window !== "undefined" ? localStorage.getItem("biometric_token") : null), []);

  const fetchEmployees = useCallback(async () => {
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
  }, [token]);

  const fetchDevices = useCallback(async () => {
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
  }, [token]);

  useEffect(() => {
    fetchEmployees();
    fetchDevices();
  }, [fetchEmployees, fetchDevices]);

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

  const totalPages = Math.max(Math.ceil(rows.length / pagination.page_size), 1);
  const pagedRows = useMemo(() => {
    const start = (pagination.page - 1) * pagination.page_size;
    return rows.slice(start, start + pagination.page_size);
  }, [rows, pagination.page, pagination.page_size]);

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
      onClick={() => {
        setTab(id);
        setPagination((prev) => ({ ...prev, page: 1 }));
      }}
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

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (event) => {
    const pageSize = Number(event.target.value);
    setPagination({ page: 1, page_size: pageSize });
  };

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
              onChange={handleSearchChange}
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
                ) : pagedRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6, color: "text.secondary" }}>
                      No employees found
                    </TableCell>
                  </TableRow>
                ) : (
                  pagedRows.map((e, i) => {
                    const linkedDevicesList = e.linkedDevices || [];
                    return (
                      <TableRow key={e._id} hover>
                        <TableCell>{(pagination.page - 1) * pagination.page_size + i + 1}</TableCell>
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

        <Box
          sx={{
            mt: 2,
            p: { xs: 1.5, sm: 2 },
            border: "1px solid #E5E7EB",
            borderRadius: "12px",
            backgroundColor: "#FFFFFF",
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "stretch", md: "center" },
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
          }}
        >
          <Box sx={{ width: { xs: "100%", md: "auto" } }}>
            <Typography variant="caption" sx={{ display: "block", mb: 0.75, color: "text.secondary" }}>
              Rows per page
            </Typography>
            <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 140 } }}>
              <Select
                value={pagination.page_size}
                onChange={handlePageSizeChange}
                sx={{
                  bgcolor: "#fff",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#D1D5DB",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0E9F6E",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0E9F6E",
                  },
                }}
              >
                {[5, 10, 25, 50, 100].map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: { xs: "100%", md: "auto" },
              "& .pagination": {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: 1,
                listStyle: "none",
                padding: 0,
                margin: 0,
              },
              "& .pagination li a": {
                minWidth: 38,
                height: 38,
                padding: "0 12px",
                borderRadius: "10px",
                border: "1px solid #D1D5DB",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: theme.palette.text.primary,
                backgroundColor: "#FFFFFF",
                textDecoration: "none",
                transition: "all 0.2s ease",
              },
              "& .pagination li a:hover": {
                borderColor: "#0E9F6E",
                color: "#0E9F6E",
              },
              "& .pagination li.selected a": {
                backgroundColor: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                boxShadow: "0 8px 18px rgba(14, 159, 110, 0.18)",
              },
              "& .pagination li.disabled a": {
                opacity: 0.45,
                cursor: "not-allowed",
                backgroundColor: "#F9FAFB",
              },
            }}
          >
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              breakLabel={"..."}
              breakClassName={"break-me"}
              pageCount={totalPages}
              marginPagesDisplayed={isMobile ? 1 : 2}
              pageRangeDisplayed={isMobile ? 1 : 3}
              onPageChange={({ selected }) => handlePageChange(selected + 1)}
              containerClassName={"pagination"}
              activeClassName={"selected"}
              previousClassName={"previous"}
              nextClassName={"next"}
              disabledClassName={"disabled"}
              forcePage={Math.max(Math.min(pagination.page - 1, totalPages - 1), 0)}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              previousLinkClassName={"page-link"}
              nextLinkClassName={"page-link"}
            />
          </Box>

          <Box
            sx={{
              minWidth: { xs: "100%", md: 160 },
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "flex-start", md: "flex-end" },
              justifyContent: "center",
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
              Page {pagination.page} of {totalPages}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Total {rows.length} employees
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Link device ID dialog */}
      <Dialog open={linkOpen} onClose={() => setLinkOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Enrollment & Device Links — {target ? `${target.firstName || ""} ${target.lastName || ""}`.trim() : ""}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ bgcolor: "#FFF7ED", color: "#9A3412", p: 1.5, borderRadius: "8px", mb: 2.5, fontSize: 13 }}>
            ⚠️ The finger/face template is registered on the <b>biometric terminal</b>. Enter the person&apos;s
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
