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
} from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Layout from "../../components/Layout/Layout";
import axios from "axios";

const EMPTY = {
  name: "",
  serialNumber: "",
  companyId: "",
  branchId: "",
  wdmsBaseUrl: "",
  wdmsToken: "",
};

export default function DevicesPage() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);
  const [snackbar, setSnackbar] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);

  const [wdmsUser, setWdmsUser] = useState("");
  const [wdmsPass, setWdmsPass] = useState("");
  const [fetchingToken, setFetchingToken] = useState(false);

  const token = () => (typeof window !== "undefined" ? localStorage.getItem("biometric_token") : null);
  const auth = () => ({ headers: { Authorization: token() } });

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/devices/list`, {}, {
        ...auth(),
        params: { page: 1, page_size: 100 },
      });
      setDevices(res.data?.data || []);
    } catch (e) {
      console.error("Error loading devices:", e);
      setSnackbar({ status: false, message: "Could not load devices" });
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/company`, auth());
      setCompanies(res.data?.data || []);
    } catch (e) {
      console.error("Error loading companies:", e);
    }
  };

  const fetchBranches = async (companyId) => {
    if (!companyId) return setBranches([]);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/company/${companyId}/branches`, auth());
      setBranches(res.data?.data || []);
    } catch (e) {
      console.error("Error loading branches:", e);
    }
  };

  useEffect(() => {
    fetchDevices();
    fetchCompanies();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY);
    setBranches([]);
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
      companyId: d.companyId || "",
      branchId: d.branchId || "",
      wdmsBaseUrl: d.wdmsBaseUrl || "",
      wdmsToken: d.wdmsToken || "",
    });
    if (d.companyId) fetchBranches(d.companyId);
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
    if (
      !form.name ||
      !form.serialNumber ||
      !form.companyId ||
      !form.branchId ||
      !form.wdmsBaseUrl ||
      !form.wdmsToken
    ) {
      setSnackbar({
        status: false,
        message: "Name, serial, company, branch, EasyWDMS URL and WDMS Token are required",
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
      fetchDevices();
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
      fetchDevices();
    } catch (e) {
      setSnackbar({ status: false, message: "Could not delete device" });
    }
  };

  const testDeviceRow = async (id) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/devices/${id}/test`, {}, auth());
      setSnackbar({ status: res.data.ok, message: res.data.message });
      fetchDevices();
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
            sx={{ textTransform: "none", backgroundColor: "#0E9F6E", fontWeight: 600, borderRadius: "8px",
              "&:hover": { backgroundColor: "#047857" } }}
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
                  <TableCell>Branch</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell>Last sync</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}><CircularProgress size={36} /></TableCell></TableRow>
                ) : devices.length === 0 ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6, color: "text.secondary" }}>
                    No devices registered yet — click “Register Device”.
                  </TableCell></TableRow>
                ) : (
                  devices.map((d) => (
                    <TableRow key={d._id} hover>
                      <TableCell>{d.name}</TableCell>
                      <TableCell>{d.serialNumber}</TableCell>
                      <TableCell>{d.branch_name || "—"}</TableCell>
                      <TableCell align="center"><StatusDot status={d.status || "Offline"} /></TableCell>
                      <TableCell>{d.lastSyncAt ? new Date(d.lastSyncAt).toLocaleString() : "—"}</TableCell>
                      <TableCell align="center">
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
      </Box>

      {/* Register / Edit device modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>{editingId ? "Edit Device" : "Register Device"}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Name*" value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="Front Door" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Serial Number*" value={form.serialNumber} onChange={(e) => setField("serialNumber", e.target.value)} placeholder="ZK-F09-0012" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Company*</InputLabel>
                <Select
                  label="Company*"
                  value={form.companyId}
                  onChange={(e) => { setField("companyId", e.target.value); setField("branchId", ""); fetchBranches(e.target.value); }}
                >
                  {companies.map((c) => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={!form.companyId}>
                <InputLabel>Branch*</InputLabel>
                <Select label="Branch*" value={form.branchId} onChange={(e) => setField("branchId", e.target.value)}>
                  {branches.map((b) => <MenuItem key={b._id} value={b._id}>{b.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="EasyWDMS URL*" value={form.wdmsBaseUrl} onChange={(e) => setField("wdmsBaseUrl", e.target.value)} placeholder="http://192.168.0.104:8081" />
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
                  If you don't know your token, enter your EasyWDMS portal username & password to fetch it automatically.
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
