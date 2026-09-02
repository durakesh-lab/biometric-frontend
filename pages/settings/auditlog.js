// import React, { useState } from "react";
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
//   Avatar,
//   IconButton,
//   Tooltip,
//   useTheme,
//   useMediaQuery,
// } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import InfoIcon from "@mui/icons-material/Info";
// import HistoryIcon from "@mui/icons-material/History";
// import SecurityIcon from "@mui/icons-material/Security";
// import RefreshIcon from "@mui/icons-material/Refresh";
// import ReactPaginate from "react-paginate";
// import Layout from "../../components/Layout/Layout";

// const todayStr = new Date().toISOString().split("T")[0];

// // ── Complete Static Mock Audit Logs ─────────────────────────────────
// const MOCK_AUDIT_LOGS = [
//   {
//     id: "LOG-2001",
//     timestamp: "2026-08-06 12:45:00",
//     user: "Super Admin",
//     userRole: "Super Administrator",
//     module: "Attendance",
//     action: "UPDATE",
//     entity: "John Smith (Emp ID: 4)",
//     details: "Manually corrected punch direction from Check-In (IN) to Check-Out (OUT)",
//     reason: "Approved emergency early leave at 10:30 AM",
//   },
//   {
//     id: "LOG-2002",
//     timestamp: "2026-08-06 09:15:42",
//     user: "Super Admin",
//     userRole: "Super Administrator",
//     module: "Attendance",
//     action: "UPDATE",
//     entity: "Paromita OBI (Emp ID: 3)",
//     details: "Adjusted punch direction to Check-In (IN) for morning arrival",
//     reason: "Fingerprint reader sensor failed at Main Gate terminal",
//   },
//   {
//     id: "LOG-2003",
//     timestamp: "2026-08-06 11:20:15",
//     user: "Super Admin",
//     userRole: "Super Administrator",
//     module: "Employee Directory",
//     action: "UPDATE",
//     entity: "John Smith (Emp ID: 4)",
//     details: "Updated Device User ID to 4 and authorized hardware devices (Zk-F09, ZKTeco K45)",
//     reason: "Assigned access rights for Floor 2 server room door",
//   },
//   {
//     id: "LOG-2004",
//     timestamp: "2026-08-06 10:05:00",
//     user: "Super Admin",
//     userRole: "Super Administrator",
//     module: "Employee Directory",
//     action: "CREATE",
//     entity: "John Smith (Emp ID: 4)",
//     details: "Registered new employee record in Z Techno PVT LTD -> Branch A",
//     reason: "New employee onboarded in IT Department",
//   },
//   {
//     id: "LOG-2005",
//     timestamp: "2026-08-05 18:10:00",
//     user: "Super Admin",
//     userRole: "Super Administrator",
//     module: "Employee Directory",
//     action: "DELETE",
//     entity: "Old Test Employee (Emp ID: 99)",
//     details: "Removed terminated employee profile and biometric device links",
//     reason: "Employee resignation & security offboarding",
//   },
//   {
//     id: "LOG-2006",
//     timestamp: "2026-08-05 17:30:10",
//     user: "Super Admin",
//     userRole: "Super Administrator",
//     module: "Device Assignment",
//     action: "ASSIGN",
//     entity: "Zk-F09 Terminal (SN: NYU7255300197)",
//     details: "Assigned terminal to Z Techno PVT LTD -> Branch A (Main Gate)",
//     reason: "Hardware deployment for new branch entrance gate",
//   },
//   {
//     id: "LOG-2007",
//     timestamp: "2026-08-05 16:50:00",
//     user: "Super Admin",
//     userRole: "Super Administrator",
//     module: "Device Assignment",
//     action: "UNASSIGN",
//     entity: "Main Gate F09 Terminal (SN: ZK-F09-DEMO-001)",
//     details: "Unassigned terminal location link and set to Unassigned status",
//     reason: "Hardware terminal sent for annual maintenance",
//   },
//   {
//     id: "LOG-2008",
//     timestamp: "2026-08-05 15:40:00",
//     user: "Super Admin",
//     userRole: "Super Administrator",
//     module: "Devices",
//     action: "CREATE",
//     entity: "ZKTeco K45 Terminal 3 (SN: VIRT-F03-003)",
//     details: "Registered new biometric terminal with EasyWDMS URL http://10.229.49.113:8000",
//     reason: "Added new biometric terminal for Floor 3 HR Block",
//   },
//   {
//     id: "LOG-2009",
//     timestamp: "2026-08-05 15:10:25",
//     user: "Super Admin",
//     userRole: "Super Administrator",
//     module: "Devices",
//     action: "UPDATE",
//     entity: "Zk-F09 Terminal (SN: NYU7255300197)",
//     details: "Updated EasyWDMS API token credentials and status polling frequency",
//     reason: "Re-authenticated device communication token",
//   },
//   {
//     id: "LOG-2010",
//     timestamp: "2026-08-05 14:30:00",
//     user: "Super Admin",
//     userRole: "Super Administrator",
//     module: "Devices",
//     action: "DELETE",
//     entity: "Decommissioned Reader (SN: OLD-DEV-009)",
//     details: "Deleted offline biometric terminal hardware record",
//     reason: "Hardware terminal decommissioned and replaced",
//   },
//   {
//     id: "LOG-2011",
//     timestamp: "2026-08-05 14:10:00",
//     user: "Super Admin",
//     userRole: "Super Administrator",
//     module: "Departments",
//     action: "CREATE",
//     entity: "Depart A (Z Techno PVT LTD)",
//     details: "Created new department entity under Branch A",
//     reason: "Department creation for IT Engineering team",
//   },
//   {
//     id: "LOG-2014",
//     timestamp: "2026-08-04 15:20:18",
//     user: "Super Admin",
//     userRole: "Super Administrator",
//     module: "Branches",
//     action: "CREATE",
//     entity: "Branch A (Z Techno PVT LTD)",
//     details: "Created new branch office entity with location code BR-A",
//     reason: "Branch office expansion",
//   },
//   {
//     id: "LOG-2017",
//     timestamp: "2026-08-04 16:45:22",
//     user: "Super Admin",
//     userRole: "Super Administrator",
//     module: "All Company",
//     action: "CREATE",
//     entity: "Z Techno PVT LTD",
//     details: "Created main parent enterprise organization entity",
//     reason: "Initial multi-company system setup",
//   },
//   {
//     id: "LOG-2019",
//     timestamp: "2026-08-04 17:35:00",
//     user: "Super Admin",
//     userRole: "Super Administrator",
//     module: "Enrollment",
//     action: "UPDATE",
//     entity: "John Smith (Emp ID: 4)",
//     details: "Linked fingerprint biometric template ID 4 to terminal Zk-F09",
//     reason: "Biometric enrollment completed on terminal",
//   },
// ];

// // Helper colors for module chips
// const getModuleColor = (mod) => {
//   switch (mod) {
//     case "Attendance": return { bg: "#E0F2FE", color: "#0369A1" };
//     case "Employee Directory": return { bg: "#CCFBF1", color: "#0F766E" };
//     case "Devices":
//     case "Device Assignment": return { bg: "#F3E8FF", color: "#6B21A8" };
//     case "All Company": return { bg: "#FEF3C7", color: "#B45309" };
//     case "Branches": return { bg: "#ECFDF5", color: "#047857" };
//     case "Departments": return { bg: "#E0E7FF", color: "#3730A3" };
//     case "Enrollment": return { bg: "#FCE7F3", color: "#9D174D" };
//     default: return { bg: "#F3F4F6", color: "#374151" };
//   }
// };

// // Helper colors for action badges
// const getActionBadge = (act) => {
//   switch (act) {
//     case "CREATE": return { bg: "#DEF7EC", color: "#03543F", label: "CREATE" };
//     case "UPDATE": return { bg: "#FEF3C7", color: "#92400E", label: "UPDATE" };
//     case "DELETE": return { bg: "#FDE8E8", color: "#9B1C1C", label: "DELETE" };
//     case "ASSIGN": return { bg: "#F3E8FF", color: "#6B21A8", label: "ASSIGN" };
//     case "UNASSIGN": return { bg: "#FFF7ED", color: "#C2410C", label: "UNASSIGN" };
//     default: return { bg: "#E5E7EB", color: "#374151", label: act };
//   }
// };

// const StatCard = ({ label, value, icon, color }) => (
//   <Paper
//     elevation={0}
//     sx={{
//       flex: 1,
//       minWidth: 190,
//       p: 2,
//       border: "1px solid #E5E7EB",
//       borderRadius: "10px",
//       display: "flex",
//       alignItems: "center",
//       gap: 2,
//       bgcolor: "#FFFFFF",
//     }}
//   >
//     <Box
//       sx={{
//         width: 44,
//         height: 44,
//         borderRadius: "10px",
//         bgcolor: `${color}15`,
//         color: color,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         fontSize: 22,
//       }}
//     >
//       {icon}
//     </Box>
//     <Box>
//       <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 600 }}>
//         {label}
//       </Typography>
//       <Typography variant="h5" sx={{ fontWeight: 700, color: "#111827", mt: 0.2 }}>
//         {value}
//       </Typography>
//     </Box>
//   </Paper>
// );

// export default function AuditLogPage() {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   const [filters, setFilters] = useState({
//     from: todayStr,
//     to: todayStr,
//     module: "",
//     action: "",
//     search: "",
//   });

//   const [pageSize, setPageSize] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);

//   const resetFilters = () => {
//     setFilters({ from: todayStr, to: todayStr, module: "", action: "", search: "" });
//     setCurrentPage(1);
//   };

//   const filteredLogs = MOCK_AUDIT_LOGS.filter((log) => {
//     if (filters.module && log.module !== filters.module) return false;
//     if (filters.action && log.action !== filters.action) return false;
//     if (filters.search) {
//       const q = filters.search.toLowerCase();
//       const matchSearch =
//         log.user.toLowerCase().includes(q) ||
//         log.entity.toLowerCase().includes(q) ||
//         log.details.toLowerCase().includes(q) ||
//         log.reason.toLowerCase().includes(q);
//       if (!matchSearch) return false;
//     }
//     return true;
//   });

//   const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;
//   const paginatedLogs = filteredLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

//   return (
//     <Layout>
//       <Box sx={{ my: 3 }}>
//         {/* Header */}
//         <Box display="flex" justifyContent="space-between" alignItems="center" mb={3.5} flexWrap="wrap" rowGap={2}>
//           <Box display="flex" alignItems="center" gap={1.5}>
//             <Box
//               sx={{
//                 width: 46,
//                 height: 46,
//                 borderRadius: "12px",
//                 bgcolor: "#E6F6F0",
//                 color: "#0E9F6E",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <SecurityIcon />
//             </Box>
//             <Box>
//               <Typography variant="h5" sx={{ fontWeight: 700, color: "#111827" }}>
//                 Audit Logs & System Activity
//               </Typography>
//               <Typography variant="body2" sx={{ color: "#6B7280", mt: 0.3 }}>
//                 Track all administrative actions, manual attendance corrections, and system activity logs.
//               </Typography>
//             </Box>
//           </Box>
//         </Box>

//         {/* Top Summary Stat Cards */}
//         <Box display="flex" gap={2} mb={3} flexWrap="wrap">
//           <StatCard label="Total Audit Logs" value={MOCK_AUDIT_LOGS.length} icon={<HistoryIcon />} color="#3B82F6" />
//           <StatCard label="Attendance Logs" value={2} icon="🕒" color="#0E9F6E" />
//           <StatCard label="Employee Actions" value={3} icon="🪪" color="#0F766E" />
//           <StatCard label="Device Actions" value={5} icon="📟" color="#8B5CF6" />
//         </Box>

//         {/* Main Table Container Paper */}
//         <Paper elevation={0} sx={{ border: "1px solid #E5E7EB", borderRadius: "12px", overflow: "hidden" }}>
//           {/* Streamlined Single-Line Filters Bar */}
//           <Box
//             p={2}
//             display="flex"
//             gap={2}
//             flexWrap="wrap"
//             alignItems="center"
//             bgcolor="#FFFFFF"
//             borderBottom="1px solid #E5E7EB"
//           >
//             <TextField
//               size="small"
//               type="date"
//               label="From Date"
//               value={filters.from}
//               onChange={(e) => {
//                 setFilters((f) => ({ ...f, from: e.target.value }));
//                 setCurrentPage(1);
//               }}
//               InputLabelProps={{ shrink: true }}
//               sx={{ width: 145 }}
//             />
//             <TextField
//               size="small"
//               type="date"
//               label="To Date"
//               value={filters.to}
//               onChange={(e) => {
//                 setFilters((f) => ({ ...f, to: e.target.value }));
//                 setCurrentPage(1);
//               }}
//               InputLabelProps={{ shrink: true }}
//               sx={{ width: 145 }}
//             />

//             <FormControl size="small" sx={{ minWidth: 175 }}>
//               <InputLabel>Module</InputLabel>
//               <Select
//                 label="Module"
//                 value={filters.module}
//                 onChange={(e) => {
//                   setFilters((f) => ({ ...f, module: e.target.value }));
//                   setCurrentPage(1);
//                 }}
//               >
//                 <MenuItem value="">All Modules</MenuItem>
//                 <MenuItem value="Attendance">Attendance</MenuItem>
//                 <MenuItem value="Employee Directory">Employee Directory</MenuItem>
//                 <MenuItem value="Devices">Devices</MenuItem>
//                 <MenuItem value="Device Assignment">Device Assignment</MenuItem>
//                 <MenuItem value="All Company">All Company</MenuItem>
//                 <MenuItem value="Branches">Branches</MenuItem>
//                 <MenuItem value="Departments">Departments</MenuItem>
//                 <MenuItem value="Enrollment">Enrollment</MenuItem>
//               </Select>
//             </FormControl>

//             <FormControl size="small" sx={{ minWidth: 155 }}>
//               <InputLabel>Action Type</InputLabel>
//               <Select
//                 label="Action Type"
//                 value={filters.action}
//                 onChange={(e) => {
//                   setFilters((f) => ({ ...f, action: e.target.value }));
//                   setCurrentPage(1);
//                 }}
//               >
//                 <MenuItem value="">All Actions</MenuItem>
//                 <MenuItem value="CREATE">CREATE</MenuItem>
//                 <MenuItem value="UPDATE">UPDATE</MenuItem>
//                 <MenuItem value="DELETE">DELETE</MenuItem>
//                 <MenuItem value="ASSIGN">ASSIGN</MenuItem>
//                 <MenuItem value="UNASSIGN">UNASSIGN</MenuItem>
//               </Select>
//             </FormControl>

//             <Button
//               size="small"
//               variant="outlined"
//               onClick={resetFilters}
//               startIcon={<RefreshIcon />}
//               sx={{ textTransform: "none", color: "#6B7280", borderColor: "#D1D5DB" }}
//             >
//               Reset
//             </Button>

//             <TextField
//               size="small"
//               placeholder="Search by User, Entity, or Reason…"
//               value={filters.search}
//               onChange={(e) => {
//                 setFilters((f) => ({ ...f, search: e.target.value }));
//                 setCurrentPage(1);
//               }}
//               InputProps={{ startAdornment: <SearchIcon sx={{ color: "#9CA3AF", mr: 1 }} /> }}
//               sx={{ ml: "auto", width: 260 }}
//             />
//           </Box>

//           {/* Ultra-Clean Simplified Audit Logs Data Table */}
//           <TableContainer sx={{ maxHeight: "55vh" }}>
//             <Table stickyHeader>
//               <TableHead>
//                 <TableRow sx={{ "& th": { backgroundColor: "#F9FAFB", fontWeight: 600, color: "#4B5563" } }}>
//                   <TableCell>Role & Edited By</TableCell>
//                   <TableCell>Module</TableCell>
//                   <TableCell align="center">Action</TableCell>
//                   <TableCell>Target Entity</TableCell>
//                   <TableCell align="center">Info & Reason</TableCell>
//                   <TableCell align="right">Date & Time</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {paginatedLogs.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={6} align="center" sx={{ py: 6, color: "#6B7280" }}>
//                       No audit log records found matching the filter criteria.
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   paginatedLogs.map((r) => {
//                     const modColor = getModuleColor(r.module);
//                     const actBadge = getActionBadge(r.action);
//                     return (
//                       <TableRow key={r.id} hover sx={{ "&:hover": { backgroundColor: "#F9FAFB" } }}>
//                         <TableCell>
//                           <Box display="flex" alignItems="center" gap={1.2}>
//                             <Avatar sx={{ width: 30, height: 30, bgcolor: "#0E9F6E", fontSize: 12, fontWeight: 700 }}>
//                               {r.user.charAt(0)}
//                             </Avatar>
//                             <Box>
//                               <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 13, color: "#111827" }}>
//                                 {r.user}
//                               </Typography>
//                               <Typography variant="caption" sx={{ color: "#6B7280", fontSize: 11, display: "block" }}>
//                                 {r.userRole}
//                               </Typography>
//                             </Box>
//                           </Box>
//                         </TableCell>

//                         <TableCell>
//                           <Chip
//                             label={r.module}
//                             size="small"
//                             sx={{
//                               fontWeight: 600,
//                               fontSize: 12,
//                               backgroundColor: modColor.bg,
//                               color: modColor.color,
//                             }}
//                           />
//                         </TableCell>

//                         <TableCell align="center">
//                           <Chip
//                             label={actBadge.label}
//                             size="small"
//                             sx={{
//                               fontWeight: 700,
//                               fontSize: 11,
//                               backgroundColor: actBadge.bg,
//                               color: actBadge.color,
//                             }}
//                           />
//                         </TableCell>

//                         <TableCell>
//                           <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 13, color: "#1F2937" }}>
//                             {r.entity}
//                           </Typography>
//                         </TableCell>

//                         <TableCell align="center">
//                           <Tooltip
//                             title={
//                               <Box sx={{ p: 0.8, maxWidth: 300 }}>
//                                 <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#93C5FD", mb: 0.5 }}>
//                                   💡 Audit Action Details
//                                 </Typography>
//                                 <div><b>Edited By:</b> {r.user} ({r.userRole})</div>
//                                 <div><b>Timestamp:</b> {r.timestamp}</div>
//                                 <div><b>Action:</b> {r.action} ({r.module})</div>
//                                 <div><b>Details:</b> {r.details}</div>
//                                 <div style={{ marginTop: 4 }}><b>Reason:</b> <i>"{r.reason}"</i></div>
//                               </Box>
//                             }
//                             arrow
//                             placement="top"
//                           >
//                             <IconButton size="small" sx={{ color: "#3B82F6", bgcolor: "#EFF6FF", "&:hover": { bgcolor: "#DBEAFE" } }}>
//                               <InfoIcon fontSize="small" />
//                             </IconButton>
//                           </Tooltip>
//                         </TableCell>

//                         <TableCell align="right" sx={{ fontSize: 13, fontWeight: 500, color: "#4B5563", whiteSpace: "nowrap" }}>
//                           {r.timestamp}
//                         </TableCell>
//                       </TableRow>
//                     );
//                   })
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Paper>

//         {/* Pagination Bar matching Attendance / Device Assignment Module */}
//         <Box
//           sx={{
//             mt: 2,
//             p: { xs: 1.5, sm: 2 },
//             border: "1px solid #E5E7EB",
//             borderRadius: "8px",
//             backgroundColor: "#FFFFFF",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: { xs: "stretch", md: "center" },
//             flexDirection: { xs: "column", md: "row" },
//             gap: 2,
//           }}
//         >
//           <Box sx={{ width: { xs: "100%", md: "auto" } }}>
//             <Typography variant="caption" sx={{ display: "block", mb: 0.75, color: "#64748B" }}>
//               Rows per page
//             </Typography>
//             <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 140 } }}>
//               <Select
//                 value={pageSize}
//                 onChange={(e) => {
//                   setPageSize(Number(e.target.value));
//                   setCurrentPage(1);
//                 }}
//                 sx={{ bgcolor: "#fff" }}
//               >
//                 {[5, 10, 20, 50, 100].map((size) => (
//                   <MenuItem key={size} value={size}>
//                     {size}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Box>

//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "center",
//               width: { xs: "100%", md: "auto" },
//               "& .pagination": {
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 flexWrap: "wrap",
//                 gap: 1,
//                 listStyle: "none",
//                 padding: 0,
//                 margin: 0,
//               },
//               "& .pagination li a": {
//                 minWidth: 38,
//                 height: 38,
//                 padding: "0 12px",
//                 borderRadius: "10px",
//                 border: "1px solid #D1D5DB",
//                 display: "inline-flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 color: theme.palette.text.primary,
//                 backgroundColor: "#FFFFFF",
//                 textDecoration: "none",
//               },
//               "& .pagination li.selected a": {
//                 backgroundColor: "#0E9F6E",
//                 borderColor: "#0E9F6E",
//                 color: "#FFFFFF",
//               },
//             }}
//           >
//             <ReactPaginate
//               previousLabel={"Previous"}
//               nextLabel={"Next"}
//               breakLabel={"..."}
//               pageCount={totalPages}
//               onPageChange={({ selected }) => setCurrentPage(selected + 1)}
//               containerClassName={"pagination"}
//               activeClassName={"selected"}
//               forcePage={currentPage - 1}
//             />
//           </Box>

//           <Box
//             sx={{
//               minWidth: { xs: "100%", md: 160 },
//               display: "flex",
//               flexDirection: "column",
//               alignItems: { xs: "flex-start", md: "flex-end" },
//               justifyContent: "center",
//             }}
//           >
//             <Typography variant="body2" sx={{ fontWeight: 600, color: "#1F2937" }}>
//               Page {currentPage} of {totalPages}
//             </Typography>
//             <Typography variant="caption" sx={{ color: "#6B7280" }}>
//               Total {filteredLogs.length} records
//             </Typography>
//           </Box>
//         </Box>
//       </Box>
//     </Layout>
//   );
// }











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
  IconButton,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import ReactPaginate from "react-paginate";
import Layout from "../../components/Layout/Layout";
import axios from "axios";

const todayStr = () => new Date().toISOString().split("T")[0];

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

export default function AuditLogsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ totalLogs: 0, attendanceEdits: 0, uniqueEditors: 0 });
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 10,
    total: 0,
    total_pages: 1,
  });

  const [filters, setFilters] = useState({
    search: "",
    from: "",
    to: "",
    module: "",
    action: "",
  });

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const token = () => (typeof window !== "undefined" ? localStorage.getItem("biometric_token") : null);
  const auth = () => ({ headers: { Authorization: token() } });
  const BASE = process.env.NEXT_PUBLIC_BASE_URL;

  const fetchStats = async () => {
    try {
      const res = await axios.post(`${BASE}/auditlog/stats`, {}, auth());
      setStats(res.data || {});
    } catch (e) {
      console.error("auditlog stats error", e);
    }
  };

  const fetchLogs = async (page = pagination.page, pageSize = pagination.page_size) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${BASE}/auditlog/list`,
        {
          search: filters.search,
          from: filters.from,
          to: filters.to,
          module: filters.module,
          action: filters.action,
        },
        {
          ...auth(),
          params: { page, page_size: pageSize },
        }
      );
      setLogs(res.data?.data || []);
      setPagination({
        page: res.data?.page || page,
        page_size: res.data?.page_size || pageSize,
        total: res.data?.count || 0,
        total_pages: res.data?.total_pages || 1,
      });
    } catch (e) {
      console.error("auditlog fetch error", e);
      setSnackbar({ status: false, message: "Could not load Audit Logs" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchLogs(1, pagination.page_size);
  }, [filters]);

  const handlePageChange = (newPage) => {
    fetchLogs(newPage, pagination.page_size);
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    fetchLogs(1, newSize);
  };

  const setFilter = (key, val) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
  };

  const openDetailModal = (log) => {
    setSelectedLog(log);
    setDetailOpen(true);
  };

  const getActionColor = (action) => {
    switch (action?.toUpperCase()) {
      case "UPDATE":
        return { bg: "#FEF3C7", color: "#D97706" };
      case "CREATE":
        return { bg: "#DEF7EC", color: "#03543F" };
      case "DELETE":
        return { bg: "#FDE8E8", color: "#9B1C1C" };
      default:
        return { bg: "#E5E7EB", color: "#374151" };
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
            <Typography variant="h5" sx={{ fontWeight: 700 }}>System Audit Logs</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              Track manual attendance corrections and administrative actions.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => { fetchStats(); fetchLogs(1, pagination.page_size); }}
            sx={{ textTransform: "none", color: "#4B5563", borderColor: "#D1D5DB" }}
          >
            Refresh Logs
          </Button>
        </Box>

        {/* Stats */}
        <Box display="flex" gap={2} mb={2} flexWrap="wrap">
          <StatCard label="Total Audit Logs" value={stats.totalLogs ?? 0} color="#3B82F6" />
          <StatCard label="Attendance Edits" value={stats.attendanceEdits ?? 0} color="#F59E0B" />
          <StatCard label="Unique System Editors" value={stats.uniqueEditors ?? 0} color="#10B981" />
        </Box>

        <Paper elevation={0} sx={{ border: "1px solid #E5E7EB", borderRadius: "8px", overflow: "hidden" }}>
          {/* Filters */}
          <Box sx={{ p: 2, display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap", borderBottom: "1px solid #E5E7EB" }}>
            <TextField
              size="small"
              type="date"
              label="From"
              InputLabelProps={{ shrink: true }}
              value={filters.from}
              onChange={(e) => setFilter("from", e.target.value)}
            />
            <TextField
              size="small"
              type="date"
              label="To"
              InputLabelProps={{ shrink: true }}
              value={filters.to}
              onChange={(e) => setFilter("to", e.target.value)}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Module</InputLabel>
              <Select label="Module" value={filters.module} onChange={(e) => setFilter("module", e.target.value)}>
                <MenuItem value="">All Modules</MenuItem>
                <MenuItem value="Attendance">Attendance</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Action</InputLabel>
              <Select label="Action" value={filters.action} onChange={(e) => setFilter("action", e.target.value)}>
                <MenuItem value="">All Actions</MenuItem>
                <MenuItem value="UPDATE">UPDATE</MenuItem>
                <MenuItem value="CREATE">CREATE</MenuItem>
                <MenuItem value="DELETE">DELETE</MenuItem>
              </Select>
            </FormControl>
            <TextField
              size="small"
              placeholder="Search user, entity, reason…"
              value={filters.search}
              onChange={(e) => setFilter("search", e.target.value)}
              sx={{ ml: "auto", width: 240 }}
              InputProps={{
                endAdornment: <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />,
              }}
            />
          </Box>

          {/* Table */}
          <TableContainer sx={{ maxHeight: "55vh" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ "& th": { backgroundColor: "#F9FAFB", fontWeight: 600, color: "#4B5563" } }}>
                  <TableCell>Edited By (Role)</TableCell>
                  <TableCell>Module</TableCell>
                  <TableCell align="center">Action</TableCell>
                  <TableCell>Target Entity</TableCell>
                  <TableCell align="center">Info & Reason</TableCell>
                  <TableCell>Date & Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}><CircularProgress size={36} /></TableCell></TableRow>
                ) : logs.length === 0 ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6, color: "text.secondary" }}>
                    No audit log records found for this filter.
                  </TableCell></TableRow>
                ) : (
                  logs.map((log) => {
                    const actionStyle = getActionColor(log.action);
                    return (
                      <TableRow key={log._id} hover>
                        {/* Combined Edited By & Role Column */}
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: "#1F2937" }}>
                              {log.editedBy || "Super Admin"}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#6B7280", display: "block" }}>
                              {log.userRole || "Super Administrator"}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "#4B5563" }}>
                            {log.module || "Attendance"}
                          </Typography>
                        </TableCell>

                        <TableCell align="center">
                          <Chip
                            label={log.action || "UPDATE"}
                            size="small"
                            sx={{
                              fontWeight: 700,
                              backgroundColor: actionStyle.bg,
                              color: actionStyle.color,
                            }}
                          />
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2">{log.targetEntity || "—"}</Typography>
                        </TableCell>

                        {/* Info & Reason Column */}
                        <TableCell align="center">
                          <Tooltip
                            arrow
                            placement="top"
                            componentsProps={{
                              tooltip: {
                                sx: {
                                  bgcolor: "#1F2937",
                                  color: "#F9FAFB",
                                  p: 1.5,
                                  borderRadius: "8px",
                                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                  maxWidth: 280,
                                },
                              },
                            }}
                            title={
                              <Box sx={{ fontSize: "12px", lineHeight: 1.6, wordBreak: "break-all", overflowWrap: "anywhere" }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, display: "block", wordBreak: "break-all" }}>
                                  Details: <span style={{ fontWeight: 400 }}>{log.details}</span>
                                </Typography>
                                <Typography variant="caption" sx={{ fontWeight: 700, display: "block", wordBreak: "break-all" }}>
                                  Reason: <span style={{ fontStyle: "italic", fontWeight: 400 }}>"{log.reason}"</span>
                                </Typography>
                              </Box>
                            }
                          >
                            <IconButton size="small" onClick={() => openDetailModal(log)} sx={{ color: "#3B82F6", p: 0.25 }}>
                              <InfoOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2" sx={{ fontSize: "13px" }}>
                            {format24h(log.timestamp || log.createdAt)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Pagination Section */}
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
                {[10, 25, 50, 100].map((size) => (
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
                fontSize: "14px",
              },
              "& .pagination li a:hover": {
                borderColor: "#0E9F6E",
                color: "#0E9F6E",
              },
              "& .pagination li.selected a": {
                backgroundColor: "#0E9F6E",
                borderColor: "#0E9F6E",
                color: "#FFFFFF",
                fontWeight: 700,
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
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#0F172A" }}>
              Page {pagination.page} of {Math.max(pagination.total_pages, 1)}
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748B" }}>
              Total {pagination.total} logs
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Log Detail Dialog */}
      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Audit Log Details</DialogTitle>
        <DialogContent sx={{ overflowX: "hidden" }}>
          {selectedLog && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, pt: 1 }}>
              <Box>
                <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 600 }}>Performed By:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, wordBreak: "break-all", overflowWrap: "anywhere" }}>
                  {selectedLog.editedBy} ({selectedLog.userRole})
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 600 }}>Target Entity:</Typography>
                <Typography variant="body2" sx={{ wordBreak: "break-all", overflowWrap: "anywhere" }}>{selectedLog.targetEntity}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 600 }}>Action Details:</Typography>
                <Typography variant="body2" sx={{ bgcolor: "#F3F4F6", p: 1, borderRadius: "6px", fontSize: 13, wordBreak: "break-all", overflowWrap: "anywhere", whiteSpace: "pre-wrap" }}>
                  {selectedLog.details}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 600 }}>Correction Reason Note:</Typography>
                <Typography variant="body2" sx={{ bgcolor: "#FEF3C7", color: "#92400E", p: 1, borderRadius: "6px", fontSize: 13, fontStyle: "italic", wordBreak: "break-all", overflowWrap: "anywhere", whiteSpace: "pre-wrap" }}>
                  "{selectedLog.reason}"
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 600 }}>Timestamp:</Typography>
                <Typography variant="body2">{format24h(selectedLog.timestamp || selectedLog.createdAt)}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDetailOpen(false)} variant="contained" sx={{ textTransform: "none", backgroundColor: "#3B82F6" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={Boolean(snackbar)} autoHideDuration={5000} onClose={() => setSnackbar(null)}>
        <Alert severity={snackbar?.status ? "success" : "error"} variant="filled" onClose={() => setSnackbar(null)}>
          {snackbar?.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
}
