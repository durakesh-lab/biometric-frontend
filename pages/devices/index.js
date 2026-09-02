import React, { useState, useEffect, useCallback } from "react";
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
  CircularProgress,
  Chip,
  useMediaQuery,
  Tabs,
  Tab,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsRemoteIcon from "@mui/icons-material/SettingsRemote";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import DvrIcon from "@mui/icons-material/Dvr";
import ReactPaginate from "react-paginate";
import Layout, { theme } from "../../components/Layout/Layout";
import axios from "axios";

const EMPTY = {
  name: "",
  serialNumber: "",
  wdmsBaseUrl: "",
  wdmsToken: "",
};

export default function DevicesPage() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"), { noSsr: true });
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 10,
    total_pages: 1,
    count: 0,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);

  const [wdmsUser, setWdmsUser] = useState("");
  const [wdmsPass, setWdmsPass] = useState("");
  const [fetchingToken, setFetchingToken] = useState(false);

  // UI Design Mockup State for Remote Device Control Panel
  const [remoteModalOpen, setRemoteModalOpen] = useState(false);
  const [selectedDeviceForRemote, setSelectedDeviceForRemote] = useState(null);
  const [remoteTab, setRemoteTab] = useState(0);
  const [remoteActionNotice, setRemoteActionNotice] = useState(null);
  const [remoteEnrollId, setRemoteEnrollId] = useState("");
  const [remotePurgeId, setRemotePurgeId] = useState("");
  const [remoteDeviceIp, setRemoteDeviceIp] = useState("192.168.1.105");
  const [remoteDevicePort, setRemoteDevicePort] = useState("4370");

  const openRemoteControl = (device) => {
    setSelectedDeviceForRemote(device);
    setRemoteActionNotice(null);
    setRemoteDeviceIp(device.ipAddress || "192.168.1.105");
    setRemoteModalOpen(true);
  };

  const handleTriggerRemoteAction = (actionName, details) => {
    setRemoteActionNotice({
      title: actionName,
      message: details,
      time: new Date().toLocaleTimeString("en-US", { hour12: false }),
    });
    setSnackbar({
      status: true,
      message: `[UI Preview] Command '${actionName}' sent to ${selectedDeviceForRemote?.name || "Device"}`,
    });
  };

  const token = useCallback(() => (typeof window !== "undefined" ? localStorage.getItem("biometric_token") : null), []);
  const auth = useCallback(() => ({ headers: { Authorization: token() } }), [token]);

  const fetchDevices = useCallback(async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const safePageSize = Math.max(Number(pageSize) || 10, 1);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/devices/list`, {}, {
        ...auth(),
        params: { page, page_size: safePageSize },
      });
      const nextDevices = res.data?.data || [];
      const totalCount = Number(res.data?.count || 0);
      const totalPages = Math.max(Number(res.data?.total_pages) || Math.ceil(totalCount / safePageSize) || 1, 1);

      setDevices(nextDevices);
      setPagination((prev) => ({
        ...prev,
        page,
        page_size: safePageSize,
        total_pages: totalPages,
        count: totalCount,
      }));
    } catch (e) {
      console.error("Error loading devices:", e);
      setSnackbar({ status: false, message: "Could not load devices" });
    } finally {
      setLoading(false);
    }
  }, [auth]);

  useEffect(() => {
    fetchDevices(1, 10);
  }, [fetchDevices]);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY);
    setTestResult(null);
    setWdmsUser("");
    setWdmsPass("");
    setModalOpen(true);
  };

  const openEdit = (d) => {
    setEditingId(d._id);
    setForm({
      name: d.name || "",
      serialNumber: d.serialNumber || "",
      wdmsBaseUrl: d.wdmsBaseUrl || "",
      wdmsToken: d.wdmsToken || "",
    });
    setTestResult(null);
    setWdmsUser("");
    setWdmsPass("");
    setModalOpen(true);
  };

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleTest = async () => {
    if (!form.wdmsBaseUrl) {
      setTestResult({ ok: false, message: "Enter the EasyWDMS URL first" });
      return;
    }
    try {
      setTesting(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/devices/test`,
        { wdmsBaseUrl: form.wdmsBaseUrl, wdmsToken: form.wdmsToken, serialNumber: form.serialNumber },
        auth()
      );
      setTestResult(res.data);
    } catch (e) {
      setTestResult({ ok: false, message: e.response?.data?.message || "Test failed" });
    } finally {
      setTesting(false);
    }
  };

  const handleFetchToken = async () => {
    if (!form.wdmsBaseUrl) {
      setSnackbar({ status: false, message: "Enter the EasyWDMS URL first" });
      return;
    }
    if (!wdmsUser || !wdmsPass) {
      setSnackbar({ status: false, message: "Enter both EasyWDMS username and password" });
      return;
    }
    try {
      setFetchingToken(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/devices/get-token`,
        { wdmsBaseUrl: form.wdmsBaseUrl, username: wdmsUser, password: wdmsPass },
        auth()
      );
      if (res.data.ok) {
        setField("wdmsToken", res.data.token);
        setSnackbar({ status: true, message: "Token fetched and applied automatically!" });
      } else {
        setSnackbar({ status: false, message: res.data.message || "Failed to fetch token" });
      }
    } catch (e) {
      setSnackbar({ status: false, message: e.response?.data?.message || "Failed to fetch token" });
    } finally {
      setFetchingToken(false);
    }
  };

  const handleSave = async () => {
    const isFormInvalid = editingId
      ? (!form.name || !form.serialNumber || !form.wdmsBaseUrl)
      : (!form.name || !form.serialNumber || !form.wdmsBaseUrl || !form.wdmsToken);

    if (isFormInvalid) {
      setSnackbar({
        status: false,
        message: editingId
          ? "Name, serial, and EasyWDMS URL are required"
          : "Name, serial, EasyWDMS URL and WDMS Token are required",
      });
      return;
    }
    try {
      setSaving(true);
      if (editingId) {
        await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/devices/${editingId}`, form, auth());
        setSnackbar({ status: true, message: "Device updated" });
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/devices`, form, auth());
        setSnackbar({ status: true, message: "Device registered" });
      }
      setModalOpen(false);
      fetchDevices(pagination.page, pagination.page_size);
    } catch (e) {
      setSnackbar({ status: false, message: e.response?.data?.message || "Could not save device" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/devices/${id}`, auth());
      setSnackbar({ status: true, message: "Device deleted" });
      fetchDevices(pagination.page, pagination.page_size);
    } catch (e) {
      setSnackbar({ status: false, message: "Could not delete device" });
    }
  };

  const testDeviceRow = async (id) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/devices/${id}/test`, {}, auth());
      setSnackbar({ status: res.data.ok, message: res.data.message });
      fetchDevices(pagination.page, pagination.page_size);
    } catch (e) {
      setSnackbar({ status: false, message: "Test failed" });
    }
  };

  const StatusDot = ({ status }) => (
    <Chip
      label={status}
      size="small"
      sx={{
        fontWeight: 600,
        backgroundColor: status === "Online" ? "#DEF7EC" : "#FDE8E8",
        color: status === "Online" ? "#03543F" : "#9B1C1C",
      }}
    />
  );

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    fetchDevices(newPage, pagination.page_size);
  };

  const handlePageSizeChange = (event) => {
    const pageSize = Number(event.target.value);
    setPagination((prev) => ({ ...prev, page: 1, page_size: pageSize }));
    fetchDevices(1, pageSize);
  };

  return (
    <Layout>
      <Box sx={{ my: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" rowGap={2}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>Biometric Devices</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              Register each ZKTeco F09/K45 and its EasyWDMS connection.
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={openAdd}
            sx={{
              textTransform: "none", backgroundColor: "#0E9F6E", fontWeight: 600, borderRadius: "8px",
              "&:hover": { backgroundColor: "#047857" }
            }}
          >
            + Register Device
          </Button>
        </Box>

        <Paper elevation={0} sx={{ border: "1px solid #E5E7EB", borderRadius: "8px", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: "65vh" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ "& th": { backgroundColor: "#F9FAFB", fontWeight: 600, color: "#4B5563" } }}>
                  <TableCell>Name</TableCell>
                  <TableCell>Serial</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Branch</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell>Last sync</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={7} align="center" sx={{ py: 6 }}><CircularProgress size={36} /></TableCell></TableRow>
                ) : devices.length === 0 ? (
                  <TableRow><TableCell colSpan={7} align="center" sx={{ py: 6, color: "text.secondary" }}>
                    {"No devices registered yet - click \"Register Device\"."}
                  </TableCell></TableRow>
                ) : (
                  devices.map((d) => (
                    <TableRow key={d._id} hover>
                      <TableCell>{d.name}</TableCell>
                      <TableCell>{d.serialNumber}</TableCell>
                      <TableCell>{d.company_name || "—"}</TableCell>
                      <TableCell>{d.branch_name || "—"}</TableCell>
                      <TableCell align="center"><StatusDot status={d.status || "Offline"} /></TableCell>
                      <TableCell>{d.lastSyncAt ? new Date(d.lastSyncAt).toLocaleString("en-US", { hour12: false }) : "—"}</TableCell>
                      <TableCell align="center">
                        {/* <Tooltip title="Remote Device Control Panel">
                          <IconButton size="small" onClick={() => openRemoteControl(d)} sx={{ color: "#3B82F6", p: 0.5 }}>
                            <SettingsRemoteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip> */}
                        <Tooltip title="Test connection">
                          <IconButton size="small" onClick={() => testDeviceRow(d._id)} sx={{ color: "#0E9F6E" }}>
                            <BoltIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => openEdit(d)} sx={{ color: "#9CA3AF" }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" onClick={() => handleDelete(d._id)} sx={{ color: "#EF4444" }}>
                            <DeleteIcon fontSize="small" />
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
            <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
              Page {pagination.page} of {pagination.total_pages}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Total {pagination.count} devices
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Register / Edit device modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>{editingId ? "Edit Device" : "Register Device"}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Name*" value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="Device Name" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Serial Number*" value={form.serialNumber} onChange={(e) => setField("serialNumber", e.target.value)} placeholder="ZK-F09-0012" />
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth label="EasyWDMS URL*" value={form.wdmsBaseUrl} onChange={(e) => setField("wdmsBaseUrl", e.target.value)} placeholder="http://192.168.0.104:8000" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="WDMS Token*" value={form.wdmsToken} onChange={(e) => setField("wdmsToken", e.target.value)} placeholder="from /api-token-auth/" />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ border: "1px dashed #E5E7EB", borderRadius: "8px", p: 2, bgcolor: "#F9FAFB" }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", mb: 1 }}>
                  🔑 Auto-fetch Token Helper
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 2 }}>
                  If you don&apos;t know your token, enter your EasyWDMS portal username & password to fetch it automatically.
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="WDMS Username"
                      value={wdmsUser}
                      onChange={(e) => setWdmsUser(e.target.value)}
                      placeholder="admin"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      size="small"
                      type="password"
                      label="WDMS Password"
                      value={wdmsPass}
                      onChange={(e) => setWdmsPass(e.target.value)}
                      placeholder="e.g. Admin$123"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={handleFetchToken}
                      disabled={fetchingToken}
                      sx={{ height: 40, textTransform: "none", borderColor: "#0E9F6E", color: "#0E9F6E", "&:hover": { borderColor: "#047857" } }}
                    >
                      {fetchingToken ? "Fetching…" : "Get Token"}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={2}>
                <Button variant="outlined" onClick={handleTest} disabled={testing}
                  sx={{ textTransform: "none", borderColor: "#0E9F6E", color: "#0E9F6E" }}>
                  {testing ? "Testing…" : "Test connection"}
                </Button>
                {testResult && (
                  <Typography variant="body2" sx={{ color: testResult.ok ? "#0E9F6E" : "#d32f2f", fontWeight: 500 }}>
                    {testResult.ok ? "✓ " : "✕ "}{testResult.message}
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setModalOpen(false)} sx={{ textTransform: "none", color: "text.secondary" }}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving} variant="contained"
            sx={{ textTransform: "none", backgroundColor: "#0E9F6E", "&:hover": { backgroundColor: "#047857" } }}>
            {saving ? "Saving…" : editingId ? "Update" : "Register"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Remote Device User Registration CRUD & Multi-Device Network Config UI Mockup ── */}
      <Dialog
        open={remoteModalOpen}
        onClose={() => setRemoteModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: "12px", overflow: "hidden" } }}
      >
        <DialogTitle sx={{ bg: "#1F2937", bgcolor: "#1F2937", color: "#F9FAFB", py: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={1.5}>
              <SettingsRemoteIcon sx={{ color: "#3B82F6" }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "16px", color: "#FFFFFF" }}>
                  Remote Hardware Operations — {selectedDeviceForRemote?.name || "Terminal"}
                </Typography>
                <Typography variant="caption" sx={{ color: "#9CA3AF" }}>
                  Serial Number: {selectedDeviceForRemote?.serialNumber || "ZK-F09-DEMO"} | Base URL: {selectedDeviceForRemote?.wdmsBaseUrl || "http://127.0.0.1:8000"}
                </Typography>
              </Box>
            </Box>
            <Chip
              label={selectedDeviceForRemote?.status || "Online"}
              size="small"
              sx={{
                bgcolor: selectedDeviceForRemote?.status === "Offline" ? "#FEE2E2" : "#DEF7EC",
                color: selectedDeviceForRemote?.status === "Offline" ? "#991B1B" : "#03543F",
                fontWeight: 700,
              }}
            />
          </Box>
        </DialogTitle>

        <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "#F9FAFB" }}>
          <Tabs
            value={remoteTab}
            onChange={(e, val) => setRemoteTab(val)}
            sx={{
              "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: "13px" },
              "& .Mui-selected": { color: "#0E9F6E" },
              "& .MuiTabs-indicator": { backgroundColor: "#0E9F6E" },
            }}
          >
            <Tab icon={<FingerprintIcon fontSize="small" />} iconPosition="start" label="1. Remote User Registration & Biometric CRUD" />
            <Tab icon={<DvrIcon fontSize="small" />} iconPosition="start" label="2. Terminal Network & IP Configuration" />
          </Tabs>
        </Box>

        <DialogContent sx={{ p: 3, bgcolor: "#FAFAFA" }}>
          {remoteActionNotice && (
            <Alert
              severity="success"
              sx={{ mb: 2.5, borderRadius: "8px" }}
              onClose={() => setRemoteActionNotice(null)}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {remoteActionNotice.title} Triggered Successfully!
              </Typography>
              <Typography variant="caption" sx={{ display: "block" }}>
                {remoteActionNotice.message} (Sent at {remoteActionNotice.time})
              </Typography>
            </Alert>
          )}

          {/* TAB 0: Remote User Registration & Biometric CRUD */}
          {remoteTab === 0 && (
            <Grid container spacing={2.5}>
              {/* 1. CREATE / REGISTER USER ON DEVICE */}
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: "10px", borderColor: "#D1D5DB" }}>
                  <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                    <Chip label="CREATE" size="small" sx={{ bgcolor: "#DEF7EC", color: "#03543F", fontWeight: 700 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Remote User Registration (Hardware Screen Pair)
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "12px", mb: 2 }}>
                    Registers User ID, LCD display name, and device privilege directly into {selectedDeviceForRemote?.name || "Device"} memory over the network.
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        size="small"
                        label="User ID"
                        placeholder="e.g. 4 or 30"
                        defaultValue="4"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Name (LCD Display)"
                        placeholder="e.g. Rahul Sharma"
                        defaultValue="Paromita OBI"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth size="small">
                        <Select defaultValue="normal">
                          <MenuItem value="normal">Normal User 👤</MenuItem>
                          <MenuItem value="admin">Super Admin 🔑</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <TextField
                        fullWidth
                        size="small"
                        disabled
                        label="Target Hardware Terminal"
                        value={`${selectedDeviceForRemote?.name || "Terminal"} (SN: ${selectedDeviceForRemote?.serialNumber || "ZK-F09-DEMO"})`}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => handleTriggerRemoteAction("Remote User Push", `Pushed User ID '4' (Paromita OBI) to ${selectedDeviceForRemote?.name || "Device"} memory.`)}
                        sx={{ textTransform: "none", bgcolor: "#0E9F6E", "&:hover": { bgcolor: "#047857" }, height: 40 }}
                      >
                        Push User to Device 💾
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* 2. READ / INSPECT ENROLLED USERS & TEMPLATE COUNTS */}
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: "10px", borderColor: "#D1D5DB" }}>
                  <Box display="flex" alignItems="center" justifyBetween="space-between" gap={1.5} mb={1.5}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Chip label="READ" size="small" sx={{ bgcolor: "#E0F2FE", color: "#0369A1", fontWeight: 700 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        Hardware User Directory, Template Counts &amp; Last Punching
                      </Typography>
                    </Box>
                  </Box>
                  <TableContainer sx={{ border: "1px solid #E5E7EB", borderRadius: "8px", maxHeight: 200 }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow sx={{ "& th": { bgcolor: "#F9FAFB", fontWeight: 600 } }}>
                          <TableCell>User ID</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>User Role</TableCell>
                          <TableCell align="center">Fingerprint Count</TableCell>
                          <TableCell align="center">Face Scan Count</TableCell>
                          <TableCell align="center">Last Punching Time</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow hover>
                          <TableCell sx={{ fontWeight: 700 }}>4</TableCell>
                          <TableCell>Paromita OBI</TableCell>
                          <TableCell><Chip label="Normal User" size="small" sx={{ bgcolor: "#F3F4F6", color: "#374151", height: 22, fontSize: 11 }} /></TableCell>
                          <TableCell align="center"><Chip label="Scanned 🟢 (Count: 1)" size="small" sx={{ bgcolor: "#DEF7EC", color: "#03543F", height: 22, fontSize: 11 }} /></TableCell>
                          <TableCell align="center"><Chip label="Scanned 🟢 (Count: 1)" size="small" sx={{ bgcolor: "#DEF7EC", color: "#03543F", height: 22, fontSize: 11 }} /></TableCell>
                          <TableCell align="center" sx={{ fontSize: 12, fontWeight: 500, color: "#1F2937" }}>17 Aug 2026, 09:15 AM</TableCell>
                        </TableRow>
                        <TableRow hover>
                          <TableCell sx={{ fontWeight: 700 }}>30</TableCell>
                          <TableCell>Rahul Sharma</TableCell>
                          <TableCell><Chip label="Normal User" size="small" sx={{ bgcolor: "#F3F4F6", color: "#374151", height: 22, fontSize: 11 }} /></TableCell>
                          <TableCell align="center"><Chip label="Scanned 🟢 (Count: 1)" size="small" sx={{ bgcolor: "#DEF7EC", color: "#03543F", height: 22, fontSize: 11 }} /></TableCell>
                          <TableCell align="center"><Chip label="Not Scanned ⚪ (Count: 0)" size="small" sx={{ bgcolor: "#F3F4F6", color: "#6B7280", height: 22, fontSize: 11 }} /></TableCell>
                          <TableCell align="center" sx={{ fontSize: 12, fontWeight: 500, color: "#1F2937" }}>17 Aug 2026, 08:50 AM</TableCell>
                        </TableRow>
                        <TableRow hover>
                          <TableCell sx={{ fontWeight: 700 }}>101</TableCell>
                          <TableCell>Super Admin</TableCell>
                          <TableCell><Chip label="Super Admin 🔑" size="small" sx={{ bgcolor: "#FEF3C7", color: "#92400E", height: 22, fontSize: 11, fontWeight: 700 }} /></TableCell>
                          <TableCell align="center"><Chip label="Scanned 🟢 (Count: 2)" size="small" sx={{ bgcolor: "#DEF7EC", color: "#03543F", height: 22, fontSize: 11 }} /></TableCell>
                          <TableCell align="center"><Chip label="Scanned 🟢 (Count: 1)" size="small" sx={{ bgcolor: "#DEF7EC", color: "#03543F", height: 22, fontSize: 11 }} /></TableCell>
                          <TableCell align="center" sx={{ fontSize: 12, color: "#6B7280" }}>No Punch Logged 🕒</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>

              {/* 3. UPDATE USER NAME & ROLE */}
              <Grid item xs={12} sm={6}>
                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: "10px", borderColor: "#D1D5DB", height: "100%" }}>
                  <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                    <Chip label="UPDATE" size="small" sx={{ bgcolor: "#FEF3C7", color: "#92400E", fontWeight: 700 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Update Name &amp; User Role
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "12px", mb: 2 }}>
                    Pushes updated LCD display name and user privilege role to {selectedDeviceForRemote?.name || "Device"}.
                  </Typography>
                  <Grid container spacing={1.5}>
                    <Grid item xs={12}>
                      <TextField fullWidth size="small" label="Target User ID" defaultValue="4 (Paromita OBI)" />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth size="small" label="Updated Name (LCD Display)" defaultValue="Paromita OBI" />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth size="small">
                        <Select defaultValue="normal">
                          <MenuItem value="normal">Normal User 👤</MenuItem>
                          <MenuItem value="admin">Super Admin 🔑</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => handleTriggerRemoteAction("Update Name & Role", `Updated User ID '4' details on ${selectedDeviceForRemote?.name || "Device"}.`)}
                        sx={{ textTransform: "none", bgcolor: "#3B82F6", "&:hover": { bgcolor: "#2563EB" } }}
                      >
                        Update User on Device 🔄
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* 4. DELETE / PURGE USER */}
              <Grid item xs={12} sm={6}>
                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: "10px", borderColor: "#D1D5DB", height: "100%" }}>
                  <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                    <Chip label="DELETE" size="small" sx={{ bgcolor: "#FEE2E2", color: "#991B1B", fontWeight: 700 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Delete Remote User
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "12px", mb: 2 }}>
                    Purges User ID &amp; templates from hardware memory on {selectedDeviceForRemote?.name || "Device"}.
                  </Typography>
                  <Grid container spacing={1.5}>
                    <Grid item xs={12}>
                      <TextField fullWidth size="small" label="Target User ID" defaultValue="4" />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size="small"
                        disabled
                        label="Target Hardware Terminal"
                        value={selectedDeviceForRemote?.name || "Selected Device"}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        onClick={() => handleTriggerRemoteAction("Delete User ID", `Sent DELETE /personnel/api/employees/4/ to ${selectedDeviceForRemote?.name || "Device"}.`)}
                        sx={{ textTransform: "none" }}
                      >
                        Delete User from Device 🗑️
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* TAB 1: Terminal Network & IP Configuration */}
          {remoteTab === 1 && (
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: "10px", borderColor: "#D1D5DB" }}>
                  <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                    <DvrIcon sx={{ color: "#3B82F6" }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Terminal Network &amp; IP Setup for {selectedDeviceForRemote?.name || "Device"}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "12px", mb: 2 }}>
                    Remotely reconfigure IP address, subnet mask, gateway, and server port settings for {selectedDeviceForRemote?.name || "this device"}.
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth size="small" label="Terminal IP Address" defaultValue="10.177.189.113" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth size="small" label="Push Communication Port" defaultValue="8000" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth size="small" label="Subnet Mask" defaultValue="255.255.255.0" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth size="small" label="Default Gateway" defaultValue="10.177.189.1" />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth size="small" label="EasyWDMS Push Server Base URL" defaultValue={selectedDeviceForRemote?.wdmsBaseUrl || "http://10.177.189.113:8000"} />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        onClick={() => handleTriggerRemoteAction("Update Device IP", `Sent POST /iclock/api/terminals/ip_port_update_to_device/ for ${selectedDeviceForRemote?.name || "Device"}.`)}
                        sx={{ textTransform: "none", bgcolor: "#0E9F6E", "&:hover": { bgcolor: "#047857" } }}
                      >
                        Push Network Config to Device 🌐
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, bgcolor: "#F9FAFB", borderTop: "1px solid #E5E7EB" }}>
          <Button onClick={() => setRemoteModalOpen(false)} sx={{ textTransform: "none", color: "text.secondary" }}>
            Close Operations Panel
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={Boolean(snackbar)} autoHideDuration={5000} onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert severity={snackbar?.status ? "success" : "error"} variant="filled" onClose={() => setSnackbar(null)}
          sx={{ backgroundColor: snackbar?.status ? "#0e9f6e" : "#d32f2f", color: "#fff" }}>
          {snackbar?.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
}
