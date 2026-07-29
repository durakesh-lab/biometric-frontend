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
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  Chip,
  InputAdornment,
  useMediaQuery,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import ReactPaginate from "react-paginate";
import Layout, { theme } from "../../components/Layout/Layout";
import axios from "axios";

export default function DeviceAssignmentPage() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [snackbar, setSnackbar] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"), { noSsr: true });
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 10,
    total_pages: 1,
    count: 0,
  });

  // Edit dialog state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form selections
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [locationText, setLocationText] = useState("");

  // Cascading dropdown options
  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [loadingBranches, setLoadingBranches] = useState(false);
  const [loadingDepts, setLoadingDepts] = useState(false);

  const token = useCallback(() => (typeof window !== "undefined" ? localStorage.getItem("biometric_token") : null), []);
  const auth = useCallback(() => ({ headers: { Authorization: token() } }), [token]);

  // 1. Fetch sanitized device assignment list
  const fetchAssignmentList = useCallback(async (page = 1, pageSize = 10, searchTerm = "") => {
    try {
      setLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const safePageSize = Math.max(Number(pageSize) || 10, 1);
      const requestParams = {
        page,
        page_size: safePageSize,
      };

      if (searchTerm) {
        requestParams.search = searchTerm;
      }

      let res;
      try {
        res = await axios.post(`${baseUrl}/devices/assignment-list`, {}, {
          ...auth(),
          params: requestParams,
        });
      } catch (err) {
        // Fallback to standard list if assignment-list endpoint is not ready yet on backend
        if (err.response && err.response.status === 404) {
          res = await axios.post(`${baseUrl}/devices/list`, {}, {
            ...auth(),
            params: requestParams,
          });
        } else {
          throw err;
        }
      }
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
      console.error("Error loading assignment list:", e);
      setSnackbar({ status: false, message: "Could not load device assignment list" });
    } finally {
      setLoading(false);
    }
  }, [auth]);

  const fetchCompanies = useCallback(async () => {
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
  }, [auth]);

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
    fetchAssignmentList(1, 10, "");
    fetchCompanies();
  }, [fetchAssignmentList, fetchCompanies]);

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

  // Company selection change -> reset branch & dept, fetch new branches
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

  // Branch selection change -> reset dept, fetch new departments
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
      };

      try {
        await axios.put(`${baseUrl}/devices/${editingDevice._id}/assign`, payload, auth());
      } catch (err) {
        // Fallback endpoint call if assign endpoint not yet added on backend
        if (err.response && err.response.status === 404) {
          await axios.put(`${baseUrl}/devices/${editingDevice._id}`, payload, auth());
        } else {
          throw err;
        }
      }

      setSnackbar({ status: true, message: "Device assignment updated successfully." });
      setModalOpen(false);
      fetchAssignmentList(pagination.page, pagination.page_size, search);
    } catch (e) {
      console.error("Error saving assignment:", e);
      const msg = e.response?.data?.message || "Failed to update device assignment";
      setSnackbar({ status: false, message: Array.isArray(msg) ? msg.join(", ") : msg });
    } finally {
      setSaving(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    fetchAssignmentList(newPage, pagination.page_size, search);
  };

  const handlePageSizeChange = (event) => {
    const pageSize = Number(event.target.value);
    setPagination((prev) => ({ ...prev, page: 1, page_size: pageSize }));
    fetchAssignmentList(1, pageSize, search);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearch(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchAssignmentList(1, pagination.page_size, value);
  };

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
              Assign devices to organizational units and physical locations.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              size="small"
              placeholder="Search assignment..."
              value={search}
              onChange={handleSearchChange}
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

            {/* 
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchAssignmentList}
              sx={{
                borderRadius: "10px",
                borderColor: "#CBD5E1",
                color: "#475569",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { borderColor: "#94A3B8", backgroundColor: "#F8FAFC" },
              }}
            >
              Refresh
            </Button> 
            */}
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
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={32} sx={{ color: "#0E9F6E" }} />
                      <Typography sx={{ color: "#64748B", mt: 1.5, fontSize: 14 }}>
                        Loading device assignments...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : devices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <Typography sx={{ color: "#64748B", fontSize: 14 }}>
                        No device assignments found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  devices.map((d) => (
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
                      <TableCell sx={{ color: d.company_name ? "#0F172A" : "#94A3B8" }}>
                        {d.company_name || "Unassigned"}
                      </TableCell>
                      <TableCell sx={{ color: d.branch_name ? "#0F172A" : "#94A3B8" }}>
                        {d.branch_name || "Unassigned"}
                      </TableCell>
                      <TableCell sx={{ color: d.dept_name ? "#0F172A" : "#94A3B8" }}>
                        {d.dept_name || "Unassigned"}
                      </TableCell>
                      <TableCell sx={{ color: d.location ? "#0F172A" : "#94A3B8" }}>
                        {d.location || "-"}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Edit Device Assignment">
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

        <Box
          sx={{
            mt: 2,
            p: { xs: 1.5, sm: 2 },
            border: "1px solid #E2E8F0",
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
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#0F172A" }}>
              Page {pagination.page} of {pagination.total_pages}
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748B" }}>
              Total {pagination.count} assignments
            </Typography>
          </Box>
        </Box>

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

              {/* Branch Dropdown (Optional, Cascades from Company) */}
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

              {/* Department Dropdown (Optional, Cascades from Branch) */}
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
                  placeholder="e.g. Main Entrance Gate 2, Reception Floor 1"
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5, pt: 2 }}>
            <Button
              onClick={() => setModalOpen(false)}
              disabled={saving}
              sx={{ color: "#64748B", textTransform: "none", fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveAssignment}
              disabled={saving || !selectedCompany}
              sx={{
                backgroundColor: "#0E9F6E",
                "&:hover": { backgroundColor: "#0b7d57" },
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                px: 3,
              }}
            >
              {saving ? <CircularProgress size={20} sx={{ color: "#FFFFFF" }} /> : "Save Assignment"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar Notification */}
        <Snackbar
          open={!!snackbar}
          autoHideDuration={4000}
          onClose={() => setSnackbar(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          {snackbar && (
            <Alert
              onClose={() => setSnackbar(null)}
              severity={snackbar.status ? "success" : "error"}
              sx={{ width: "100%", borderRadius: "10px" }}
            >
              {snackbar.message}
            </Alert>
          )}
        </Snackbar>
      </Box>
    </Layout>
  );
}
