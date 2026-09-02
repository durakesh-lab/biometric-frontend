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
  Chip,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  ClickAwayListener,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SyncIcon from "@mui/icons-material/Sync";
import EditIcon from "@mui/icons-material/Edit";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ReactPaginate from "react-paginate";
import Layout from "../../components/Layout/Layout";
import axios from "axios";

const today = () => new Date().toISOString().split("T")[0];

const format24h = (dateInput) => {
  if (!dateInput) return "—";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "—";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export default function AttendancePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState({ present: 0, absent: 0, records: 0, totalEmployees: 0 });
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [snackbar, setSnackbar] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [activeTooltipId, setActiveTooltipId] = useState(null);
  const [hoveredTooltipId, setHoveredTooltipId] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 10,
    total: 0,
    total_pages: 1,
  });

  const [filters, setFilters] = useState({ from: today(), to: today(), company: "", branch: "", search: "" });

  // HR Edit Punch Dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({ type: "in", timestamp: "", editNote: "" });

  const token = () => (typeof window !== "undefined" ? localStorage.getItem("biometric_token") : null);
  const auth = () => ({ headers: { Authorization: token() } });
  const BASE = process.env.NEXT_PUBLIC_BASE_URL;

  const fetchStats = async () => {
    try {
      const res = await axios.post(`${BASE}/attendance/stats`, { branchId: filters.branch, companyId: filters.company }, { ...auth(), params: { date: filters.to } });
      setStats(res.data || {});
    } catch (e) { console.error("stats error", e); }
  };

  const fetchList = async (page = pagination.page, pageSize = pagination.page_size) => {
    try {
      setLoading(true);
      const res = await axios.post(`${BASE}/attendance/list`, { branchId: filters.branch, companyId: filters.company }, {
        ...auth(),
        params: {
          from: filters.from,
          to: filters.to,
          search: filters.search,
          page,
          page_size: pageSize,
        },
      });
      setRows(res.data?.data || []);
      setPagination({
        page: res.data?.page || page,
        page_size: res.data?.page_size || pageSize,
        total: res.data?.count || 0,
        total_pages: res.data?.total_pages || 1,
      });
    } catch (e) {
      console.error("list error", e);
      setSnackbar({ status: false, message: "Could not load attendance" });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    fetchList(newPage, pagination.page_size);
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    fetchList(1, newSize);
  };

  const fetchCompanies = async () => {
    try {
      const res = await axios.get(`${BASE}/company`, auth());
      setCompanies(res.data?.data || []);
    } catch (e) { console.error("companies error", e); }
  };

  const fetchBranches = async (companyId) => {
    if (!companyId) {
      setBranches([]);
      return;
    }
    try {
      const res = await axios.get(`${BASE}/company/${companyId}/branches`, auth());
      setBranches(res.data?.data || res.data || []);
    } catch (e) { console.error("branches error", e); }
  };

  const syncMountedRef = React.useRef(false);

  // 1. Initial page load (runs ONCE on mount) — fetch companies & sync live hardware punches with toast notification
  useEffect(() => {
    fetchCompanies();
    if (!syncMountedRef.current) {
      syncMountedRef.current = true;
      handleSync();
    }
  }, []);

  useEffect(() => {
    fetchBranches(filters.company);
  }, [filters.company]);

  // 2. Filter changes (date, company, branch, search) — query MongoDB instantly on page 1
  useEffect(() => {
    fetchStats();
    fetchList(1, pagination.page_size);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleCompanyChange = (companyId) => {
    setFilters((f) => ({ ...f, company: companyId, branch: "" }));
  };

  const setFilter = (k, v) => setFilters((f) => ({ ...f, [k]: v }));

  const handleSync = async () => {
    try {
      setSyncing(true);
      const res = await axios.post(`${BASE}/attendance/sync`, {}, auth());
      setSnackbar({ status: true, message: `Synced ${res.data?.synced ?? 0} new punches` });
      fetchStats();
      fetchList();
    } catch (e) {
      console.error("Sync error:", e);
      setSnackbar({ status: false, message: "Sync failed" });
    } finally {
      setSyncing(false);
    }
  };

  const openEdit = (row) => {
    setEditTarget(row);
    const tsStr = row.timestamp ? new Date(row.timestamp).toISOString().slice(0, 16) : "";
    setEditForm({
      type: row.type || "in",
      timestamp: tsStr,
      editNote: row.editNote || "",
    });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!editTarget) return;
    if (!editForm.editNote || !editForm.editNote.trim()) {
      setSnackbar({ status: false, message: "Edit Reason / Note is required for manual correction" });
      return;
    }
    try {
      await axios.put(`${BASE}/attendance/${editTarget._id}`, editForm, auth());
      setSnackbar({ status: true, message: `Updated attendance record for ${editTarget.employeeName || "employee"}` });
      setEditOpen(false);
      fetchStats();
      fetchList();
    } catch (e) {
      console.error("Attendance edit error:", e);
      const msg = e.response?.data?.message || "Could not update attendance record";
      setSnackbar({ status: false, message: Array.isArray(msg) ? msg.join(", ") : msg });
    }
  };

  const StatCard = ({ label, value, color }) => (
    <Paper elevation={0} sx={{ p: 2, border: "1px solid #E5E7EB", borderRadius: "10px", flex: 1, minWidth: 160 }}>
      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>{label}</Typography>
      <Typography variant="h5" sx={{ fontWeight: 700, color, mt: 0.5 }}>{value}</Typography>
    </Paper>
  );

  return (
    <Layout>
      <Box sx={{ my: 3 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" rowGap={2}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>Attendance Logs</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              Punches synced from biometric terminals, matched to employees.
            </Typography>
          </Box>
          <Box display="flex" gap={1.5} flexWrap="wrap">
            <Button variant="contained" startIcon={<SyncIcon />} onClick={() => handleSync()} disabled={syncing}
              sx={{ textTransform: "none", backgroundColor: "#0E9F6E", fontWeight: 600, "&:hover": { backgroundColor: "#047857" } }}>
              {syncing ? "Syncing…" : "Sync now"}
            </Button>
          </Box>
        </Box>

        {/* Stat cards */}
        <Box display="flex" gap={2} mb={2} flexWrap="wrap">
          <StatCard label="Present (today)" value={stats.present ?? 0} color="#0E9F6E" />
          <StatCard label="Absent (today)" value={stats.absent ?? 0} color="#d32f2f" />
          <StatCard label="Records (in range)" value={stats.records ?? 0} color="#374151" />
          <StatCard label="Total employees" value={stats.totalEmployees ?? 0} color="#374151" />
        </Box>

        <Paper elevation={0} sx={{ border: "1px solid #E5E7EB", borderRadius: "8px", overflow: "hidden" }}>
          {/* Filters */}
          <Box sx={{ p: 2, display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap", borderBottom: "1px solid #E5E7EB" }}>
            <TextField size="small" type="date" label="From" InputLabelProps={{ shrink: true }}
              value={filters.from} onChange={(e) => setFilter("from", e.target.value)} />
            <TextField size="small" type="date" label="To" InputLabelProps={{ shrink: true }}
              value={filters.to} onChange={(e) => setFilter("to", e.target.value)} />
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Company</InputLabel>
              <Select label="Company" value={filters.company} onChange={(e) => handleCompanyChange(e.target.value)}>
                <MenuItem value="">All Companies</MenuItem>
                {companies.map((c) => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Branch</InputLabel>
              <Select label="Branch" value={filters.branch} onChange={(e) => setFilter("branch", e.target.value)} disabled={!filters.company}>
                <MenuItem value="">{filters.company ? 'All Branches' : 'Select Company First'}</MenuItem>
                {branches.map((b) => <MenuItem key={b._id} value={b._id}>{b.name}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 165 }}>
              <InputLabel>Shift</InputLabel>
              <Select label="Shift" value={filters.shift || ""} onChange={(e) => setFilter("shift", e.target.value)}>
                <MenuItem value="">All Shifts</MenuItem>
                <MenuItem value="morning">Morning Shift (8 AM - 4 PM)</MenuItem>
                <MenuItem value="afternoon">Afternoon Shift (1 PM - 9 PM)</MenuItem>
                <MenuItem value="night">Night Shift (9 PM - 5 AM)</MenuItem>
              </Select>
            </FormControl>
            <TextField size="small" placeholder="Search employee…" value={filters.search}
              onChange={(e) => setFilter("search", e.target.value)} sx={{ ml: "auto", width: 220 }} />
          </Box>

          {/* Table */}
          <TableContainer sx={{ maxHeight: "55vh" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ "& th": { backgroundColor: "#F9FAFB", fontWeight: 600, color: "#4B5563" } }}>
                  <TableCell>Employee</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell align="center">In/Out</TableCell>
                  <TableCell>Device</TableCell>
                  <TableCell>Branch</TableCell>
                  <TableCell align="center">Action</TableCell>
                  <TableCell align="center">Info</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={7} align="center" sx={{ py: 6 }}><CircularProgress size={36} /></TableCell></TableRow>
                ) : rows.length === 0 ? (
                  <TableRow><TableCell colSpan={7} align="center" sx={{ py: 6, color: "text.secondary" }}>
                    No attendance for this range. Use “Sync now” (real device).
                  </TableCell></TableRow>
                ) : (
                  rows.map((r) => (
                    <TableRow key={r._id} hover>
                      <TableCell>{r.employeeName || "—"}</TableCell>
                      <TableCell>
                        <Typography variant="body2">{format24h(r.timestamp)}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={r.type === "out" ? "OUT" : "IN"}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            backgroundColor: (r.isManualEdit || r.editNote)
                              ? "#FEF08A"
                              : r.type === "out"
                              ? "#FDE8E8"
                              : "#DEF7EC",
                            color: (r.isManualEdit || r.editNote)
                              ? "#78350F"
                              : r.type === "out"
                              ? "#9B1C1C"
                              : "#03543F",
                            border: (r.isManualEdit || r.editNote)
                              ? "1px solid #F59E0B"
                              : "none",
                          }}
                        />
                      </TableCell>
                      <TableCell>{r.deviceName || "—"}</TableCell>
                      <TableCell>{r.branch_name || "—"}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Edit punch direction (IN/OUT)">
                          <IconButton size="small" onClick={() => openEdit(r)} sx={{ color: "#0E9F6E" }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        {r.isManualEdit || r.editNote ? (
                          <ClickAwayListener onClickAway={() => { setActiveTooltipId(null); setHoveredTooltipId(null); }}>
                            <span>
                              <Tooltip
                                arrow
                                placement="top"
                                open={activeTooltipId === r._id || hoveredTooltipId === r._id}
                                onClose={() => { setActiveTooltipId(null); setHoveredTooltipId(null); }}
                                disableFocusListener
                                enterTouchDelay={0}
                                leaveTouchDelay={5000}
                                componentsProps={{
                                  tooltip: {
                                    sx: {
                                      bgcolor: "#1F2937",
                                      color: "#F9FAFB",
                                      p: 1.5,
                                      borderRadius: "8px",
                                      boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                                      fontSize: "12px",
                                      maxWidth: 280,
                                      zIndex: 9999,
                                    },
                                  },
                                  arrow: {
                                    sx: {
                                      color: "#1F2937",
                                    },
                                  },
                                }}
                                title={
                                  <Box sx={{ fontSize: "12px", lineHeight: 1.6, textAlign: "left", wordBreak: "break-all", overflowWrap: "anywhere" }}>
                                    <Typography variant="caption" sx={{ fontWeight: 700, display: "block", wordBreak: "break-all" }}>
                                      Edited By: <span style={{ fontWeight: 400 }}>{r.editedBy || "Super Admin"}</span>
                                    </Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 700, display: "block", wordBreak: "break-all" }}>
                                      Timestamp: <span style={{ fontWeight: 400 }}>{format24h(r.editedAt || r.updatedAt)}</span>
                                    </Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 700, display: "block", wordBreak: "break-all" }}>
                                      Action: <span style={{ fontWeight: 400 }}>UPDATE</span>
                                    </Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 700, display: "block", wordBreak: "break-all" }}>
                                      Details: <span style={{ fontWeight: 400 }}>Manual Punch Correction ({r.type ? r.type.toUpperCase() : "IN"})</span>
                                    </Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 700, display: "block", wordBreak: "break-all" }}>
                                      Reason: <span style={{ fontStyle: "italic", fontWeight: 400 }}>"{r.editNote}"</span>
                                    </Typography>
                                  </Box>
                                }
                              >
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveTooltipId((prev) => (prev === r._id ? null : r._id));
                                  }}
                                  onMouseEnter={() => setHoveredTooltipId(r._id)}
                                  onMouseLeave={() => setHoveredTooltipId(null)}
                                  sx={{ color: "#3B82F6", p: 0.25 }}
                                >
                                  <InfoOutlinedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </span>
                          </ClickAwayListener>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Pagination Section matching Device Assignment / Devices module */}
        <Box
          sx={{
            mt: 2,
            p: { xs: 1.5, sm: 2 },
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            backgroundColor: "#FFFFFF",
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "stretch", md: "center" },
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
          }}
        >
          <Box sx={{ width: { xs: "100%", md: "auto" } }}>
            <Typography variant="caption" sx={{ display: "block", mb: 0.75, color: "#64748B" }}>
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
                {[5, 10, 20, 50, 100].map((size) => (
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
                backgroundColor: "#0E9F6E",
                borderColor: "#0E9F6E",
                color: "#FFFFFF",
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
              pageCount={Math.max(pagination.total_pages, 1)}
              marginPagesDisplayed={isMobile ? 1 : 2}
              pageRangeDisplayed={isMobile ? 1 : 3}
              onPageChange={({ selected }) => handlePageChange(selected + 1)}
              containerClassName={"pagination"}
              activeClassName={"selected"}
              previousClassName={"previous"}
              nextClassName={"next"}
              disabledClassName={"disabled"}
              forcePage={Math.max(Math.min(pagination.page - 1, pagination.total_pages - 1), 0)}
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
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#1F2937" }}>
              Page {pagination.page} of {Math.max(pagination.total_pages, 1)}
            </Typography>
            <Typography variant="caption" sx={{ color: "#6B7280" }}>
              Total {pagination.total} records
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* HR Edit Punch Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Edit Punch — {editTarget?.employeeName || "Employee"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ bgcolor: "#EFF6FF", color: "#1E40AF", p: 1.5, borderRadius: "8px", mb: 2, fontSize: 13 }}>
            💡 <b>Manual Attendance Correction:</b> Use this form to adjust punch direction (IN/OUT) for emergency check-outs and exceptions.
          </Box>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Punch Direction (In/Out)</InputLabel>
            <Select
              label="Punch Direction (In/Out)"
              value={editForm.type}
              onChange={(e) => setEditForm((f) => ({ ...f, type: e.target.value }))}
            >
              <MenuItem value="in">Check-In (IN)</MenuItem>
              <MenuItem value="out">Check-Out (OUT)</MenuItem>
            </Select>
          </FormControl>

          <TextField
            required
            fullWidth
            multiline
            rows={2}
            label="Edit Reason / Note *"
            placeholder="e.g. Approved emergency early leave at 10:30 AM"
            value={editForm.editNote}
            onChange={(e) => setEditForm((f) => ({ ...f, editNote: e.target.value }))}
            error={!editForm.editNote?.trim()}
            helperText={!editForm.editNote?.trim() ? "Reason is required for manual correction" : ""}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditOpen(false)} sx={{ textTransform: "none", color: "text.secondary" }}>
            Cancel
          </Button>
          <Button
            onClick={saveEdit}
            variant="contained"
            sx={{ textTransform: "none", backgroundColor: "#0E9F6E", "&:hover": { backgroundColor: "#047857" } }}
          >
            Save Edit
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
