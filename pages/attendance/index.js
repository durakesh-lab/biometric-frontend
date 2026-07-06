// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   Button,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Snackbar,
//   Alert,
//   CircularProgress,
// } from "@mui/material";
// import SyncIcon from "@mui/icons-material/Sync";
// import Layout from "../../components/Layout/Layout";
// import axios from "axios";

// const today = () => new Date().toISOString().split("T")[0];

// export default function AttendancePage() {
//   const [rows, setRows] = useState([]);
//   const [stats, setStats] = useState({ present: 0, absent: 0, records: 0, totalEmployees: 0 });
//   const [loading, setLoading] = useState(true);
//   const [branches, setBranches] = useState([]);
//   const [enrolled, setEnrolled] = useState([]); // enrolled employees (for the demo punch)
//   const [snackbar, setSnackbar] = useState(null);
//   const [syncing, setSyncing] = useState(false);

//   const [filters, setFilters] = useState({ from: today(), to: today(), branch: "", search: "" });

//   // Simulate-punch dialog
//   const [punchOpen, setPunchOpen] = useState(false);
//   const [punch, setPunch] = useState({ employeeId: "", type: "in" });

//   const token = () => (typeof window !== "undefined" ? localStorage.getItem("biometric_token") : null);
//   const auth = () => ({ headers: { Authorization: token() } });
//   const BASE = process.env.NEXT_PUBLIC_BASE_URL;

//   const fetchStats = async () => {
//     try {
//       const res = await axios.post(`${BASE}/attendance/stats`, { branchId: filters.branch }, { ...auth(), params: { date: filters.to } });
//       setStats(res.data || {});
//     } catch (e) { console.error("stats error", e); }
//   };

//   const fetchList = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.post(`${BASE}/attendance/list`, { branchId: filters.branch }, {
//         ...auth(),
//         params: { from: filters.from, to: filters.to, search: filters.search, page: 1, page_size: 200 },
//       });
//       setRows(res.data?.data || []);
//     } catch (e) {
//       console.error("list error", e);
//       setSnackbar({ status: false, message: "Could not load attendance" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchBranches = async () => {
//     try {
//       const res = await axios.get(`${BASE}/branch`, auth());
//       setBranches(res.data?.data || []);
//     } catch (e) { console.error("branches error", e); }
//   };

//   const fetchEnrolled = async () => {
//     try {
//       const res = await axios.post(`${BASE}/employees/list-all`, {}, { ...auth(), params: { page: 1, page_size: 1000 } });
//       setEnrolled((res.data?.data || []).filter((e) => e.deviceUserId));
//     } catch (e) { console.error("enrolled error", e); }
//   };

//   useEffect(() => {
//     fetchBranches();
//     fetchEnrolled();
//   }, []);

//   useEffect(() => {
//     fetchStats();
//     fetchList();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [filters]);

//   const setFilter = (k, v) => setFilters((f) => ({ ...f, [k]: v }));

//   const handleSync = async () => {
//     try {
//       setSyncing(true);
//       const res = await axios.post(`${BASE}/attendance/sync`, {}, auth());
//       setSnackbar({ status: true, message: `Synced ${res.data?.synced ?? 0} new punches` });
//       fetchStats();
//       fetchList();
//     } catch (e) {
//       setSnackbar({ status: false, message: "Sync failed" });
//     } finally {
//       setSyncing(false);
//     }
//   };

//   const savePunch = async () => {
//     if (!punch.employeeId) {
//       setSnackbar({ status: false, message: "Pick an enrolled employee" });
//       return;
//     }
//     try {
//       await axios.post(`${BASE}/attendance/test-punch`, punch, auth());
//       setSnackbar({ status: true, message: "Punch added" });
//       setPunchOpen(false);
//       setPunch({ employeeId: "", type: "in" });
//       fetchStats();
//       fetchList();
//     } catch (e) {
//       setSnackbar({ status: false, message: e.response?.data?.message || "Could not add punch" });
//     }
//   };

//   const StatCard = ({ label, value, color }) => (
//     <Paper elevation={0} sx={{ p: 2, border: "1px solid #E5E7EB", borderRadius: "10px", flex: 1, minWidth: 160 }}>
//       <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>{label}</Typography>
//       <Typography variant="h5" sx={{ fontWeight: 700, color, mt: 0.5 }}>{value}</Typography>
//     </Paper>
//   );

//   return (
//     <Layout>
//       <Box sx={{ my: 3 }}>
//         {/* Header */}
//         <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" rowGap={2}>
//           <Box>
//             <Typography variant="h5" sx={{ fontWeight: 700 }}>Attendance</Typography>
//             <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
//               Punches synced from the biometric device, matched to each employee.
//             </Typography>
//           </Box>
//           <Box display="flex" gap={1.5} flexWrap="wrap">
//             <Button variant="outlined" onClick={() => setPunchOpen(true)}
//               sx={{ textTransform: "none", borderColor: "#E5E7EB", color: "#4B5563" }}>
//               Simulate punch (demo)
//             </Button>
//             <Button variant="contained" startIcon={<SyncIcon />} onClick={handleSync} disabled={syncing}
//               sx={{ textTransform: "none", backgroundColor: "#0E9F6E", fontWeight: 600, "&:hover": { backgroundColor: "#047857" } }}>
//               {syncing ? "Syncing…" : "Sync now"}
//             </Button>
//           </Box>
//         </Box>

//         {/* Stat cards */}
//         <Box display="flex" gap={2} mb={2} flexWrap="wrap">
//           <StatCard label="Present (today)" value={stats.present ?? 0} color="#0E9F6E" />
//           <StatCard label="Absent (today)" value={stats.absent ?? 0} color="#d32f2f" />
//           <StatCard label="Records (in range)" value={stats.records ?? 0} color="#374151" />
//           <StatCard label="Total employees" value={stats.totalEmployees ?? 0} color="#374151" />
//         </Box>

//         <Paper elevation={0} sx={{ border: "1px solid #E5E7EB", borderRadius: "8px", overflow: "hidden" }}>
//           {/* Filters */}
//           <Box sx={{ p: 2, display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap", borderBottom: "1px solid #E5E7EB" }}>
//             <TextField size="small" type="date" label="From" InputLabelProps={{ shrink: true }}
//               value={filters.from} onChange={(e) => setFilter("from", e.target.value)} />
//             <TextField size="small" type="date" label="To" InputLabelProps={{ shrink: true }}
//               value={filters.to} onChange={(e) => setFilter("to", e.target.value)} />
//             <FormControl size="small" sx={{ minWidth: 160 }}>
//               <InputLabel>Branch</InputLabel>
//               <Select label="Branch" value={filters.branch} onChange={(e) => setFilter("branch", e.target.value)}>
//                 <MenuItem value="">All Branches</MenuItem>
//                 {branches.map((b) => <MenuItem key={b._id} value={b._id}>{b.name}</MenuItem>)}
//               </Select>
//             </FormControl>
//             <TextField size="small" placeholder="Search employee…" value={filters.search}
//               onChange={(e) => setFilter("search", e.target.value)} sx={{ ml: "auto", width: 260 }} />
//           </Box>

//           {/* Table */}
//           <TableContainer sx={{ maxHeight: "55vh" }}>
//             <Table stickyHeader>
//               <TableHead>
//                 <TableRow sx={{ "& th": { backgroundColor: "#F9FAFB", fontWeight: 600, color: "#4B5563" } }}>
//                   <TableCell>Employee</TableCell>
//                   <TableCell>Time</TableCell>
//                   <TableCell align="center">In/Out</TableCell>
//                   <TableCell>Device</TableCell>
//                   <TableCell>Branch</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {loading ? (
//                   <TableRow><TableCell colSpan={5} align="center" sx={{ py: 6 }}><CircularProgress size={36} /></TableCell></TableRow>
//                 ) : rows.length === 0 ? (
//                   <TableRow><TableCell colSpan={5} align="center" sx={{ py: 6, color: "text.secondary" }}>
//                     No attendance for this range. Use “Sync now” (real device) or “Simulate punch” (demo).
//                   </TableCell></TableRow>
//                 ) : (
//                   rows.map((r) => (
//                     <TableRow key={r._id} hover>
//                       <TableCell>{r.employeeName || "—"}</TableCell>
//                       <TableCell>{new Date(r.timestamp).toLocaleString()}</TableCell>
//                       <TableCell align="center">
//                         <Chip label={r.type === "out" ? "OUT" : "IN"} size="small"
//                           sx={{ fontWeight: 600, backgroundColor: r.type === "out" ? "#FDE8E8" : "#DEF7EC",
//                             color: r.type === "out" ? "#9B1C1C" : "#03543F" }} />
//                       </TableCell>
//                       <TableCell>{r.deviceName || "—"}</TableCell>
//                       <TableCell>{r.branch_name || "—"}</TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Paper>
//       </Box>

//       {/* Simulate punch dialog */}
//       <Dialog open={punchOpen} onClose={() => setPunchOpen(false)} maxWidth="xs" fullWidth>
//         <DialogTitle sx={{ fontWeight: 700 }}>Simulate a punch (demo)</DialogTitle>
//         <DialogContent>
//           <Box sx={{ bgcolor: "#F0F9FF", color: "#075985", p: 1.5, borderRadius: "8px", mb: 2, fontSize: 13 }}>
//             For testing without hardware — inserts a punch for an <b>enrolled</b> employee.
//           </Box>
//           <FormControl fullWidth sx={{ mb: 2 }}>
//             <InputLabel>Employee (enrolled)</InputLabel>
//             <Select label="Employee (enrolled)" value={punch.employeeId}
//               onChange={(e) => setPunch((p) => ({ ...p, employeeId: e.target.value }))}>
//               {enrolled.length === 0 && <MenuItem disabled>No enrolled employees — link a device ID first</MenuItem>}
//               {enrolled.map((e) => (
//                 <MenuItem key={e._id} value={e._id}>
//                   {`${e.firstName || ""} ${e.lastName || ""}`.trim()} (#{e.deviceUserId})
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//           <FormControl fullWidth>
//             <InputLabel>Type</InputLabel>
//             <Select label="Type" value={punch.type} onChange={(e) => setPunch((p) => ({ ...p, type: e.target.value }))}>
//               <MenuItem value="in">IN</MenuItem>
//               <MenuItem value="out">OUT</MenuItem>
//             </Select>
//           </FormControl>
//         </DialogContent>
//         <DialogActions sx={{ px: 3, pb: 2 }}>
//           <Button onClick={() => setPunchOpen(false)} sx={{ textTransform: "none", color: "text.secondary" }}>Cancel</Button>
//           <Button onClick={savePunch} variant="contained"
//             sx={{ textTransform: "none", backgroundColor: "#0E9F6E", "&:hover": { backgroundColor: "#047857" } }}>Add punch</Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar open={Boolean(snackbar)} autoHideDuration={5000} onClose={() => setSnackbar(null)}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}>
//         <Alert severity={snackbar?.status ? "success" : "error"} variant="filled" onClose={() => setSnackbar(null)}
//           sx={{ backgroundColor: snackbar?.status ? "#0e9f6e" : "#d32f2f", color: "#fff" }}>
//           {snackbar?.message}
//         </Alert>
//       </Snackbar>
//     </Layout>
//   );
// }




import React from "react";
import { Box, Typography } from "@mui/material";
import Layout from "../../components/Layout/Layout";

export default function AttendancePage() {
  return (
    <Layout>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Attendance
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Coming soon — this section is being built.
        </Typography>
      </Box>
    </Layout>
  );
}