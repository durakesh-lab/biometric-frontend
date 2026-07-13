import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Snackbar,
  Alert,
  IconButton,
  CircularProgress,
  Stack,
} from "@mui/material";
import Layout from "../../components/Layout/Layout";
import DashboardHeader from "../../components/Dashboard/DashboardHeader";
import DonutChart from "../../components/Dashboard/DonutChart";
import TeamPerformanceChart from "../../components/Dashboard/TeamPerformanceChart";
import EmployeeStatusTable from "../../components/Dashboard/EmployeeStatusTable";
import EventsAndMeetings from "../../components/Dashboard/EventsAndMeetings";
import Birthdays from "../../components/Dashboard/Birthdays";
import { useRouter } from "next/router";
import { usePathname, useSearchParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { api } from "@/api";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import BeachAccessOutlinedIcon from "@mui/icons-material/BeachAccessOutlined";

const DEFAULT_SUMMARY = {
  counts: {
    present: 0,
    absent: 0,
    onLeave: 0,
    totalEmployees: 0,
  },
  attendanceTrend: [],
  companyIndustryBreakdown: [],
};

const INDUSTRY_COLORS = [
  "#0E9F6E",
  "#34D399",
  "#10B981",
  "#6EE7B7",
  "#A7F3D0",
  "#60A5FA",
  "#F59E0B",
  "#F97316",
  "#8B5CF6",
  "#EC4899",
];

function normalizeListPayload(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  return [];
}

function buildIndustryBreakdown(companies) {
  const counts = new Map();

  companies.forEach((company) => {
    const industry = company?.industry?.trim() || "Unknown";
    counts.set(industry, (counts.get(industry) || 0) + 1);
  });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([label, value], index) => ({
      label,
      value,
      color: INDUSTRY_COLORS[index % INDUSTRY_COLORS.length],
    }));
}

function toDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function isActiveLeaveToday(leave, startOfDay, endOfDay) {
  if (String(leave?.leave_status || "").toLowerCase() !== "accepted") {
    return false;
  }

  const leaveStart = new Date(leave?.startdate);
  const leaveEnd = new Date(leave?.enddate);

  if (Number.isNaN(leaveStart.getTime()) || Number.isNaN(leaveEnd.getTime())) {
    return false;
  }

  return leaveStart <= endOfDay && leaveEnd >= startOfDay;
}

const STAT_TONES = {
  present: {
    background:
      "linear-gradient(135deg, rgba(14, 159, 110, 0.14) 0%, rgba(14, 159, 110, 0.05) 100%)",
    border: "rgba(14, 159, 110, 0.18)",
    iconBg: "rgba(14, 159, 110, 0.14)",
    iconColor: "#0E9F6E",
    valueColor: "#0F172A",
  },
  absent: {
    background:
      "linear-gradient(135deg, rgba(245, 158, 11, 0.14) 0%, rgba(245, 158, 11, 0.05) 100%)",
    border: "rgba(245, 158, 11, 0.18)",
    iconBg: "rgba(245, 158, 11, 0.14)",
    iconColor: "#F59E0B",
    valueColor: "#0F172A",
  },
  leave: {
    background:
      "linear-gradient(135deg, rgba(96, 165, 250, 0.14) 0%, rgba(96, 165, 250, 0.05) 100%)",
    border: "rgba(96, 165, 250, 0.18)",
    iconBg: "rgba(96, 165, 250, 0.14)",
    iconColor: "#2563EB",
    valueColor: "#0F172A",
  },
};

function StatCard({ label, value, helper, icon: Icon, tone }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        minHeight: 112,
        borderRadius: 3,
        border: `1px solid ${tone.border}`,
        background: tone.background,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "none",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 800,
            color: "#0F172A",
            letterSpacing: "0.02em",
          }}
        >
          {label}
        </Typography>
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: 2.25,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: tone.iconBg,
            color: tone.iconColor,
            flexShrink: 0,
          }}
        >
          <Icon sx={{ fontSize: 22 }} />
        </Box>
      </Box>

      <Box sx={{ mt: 1 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            lineHeight: 1,
            color: tone.valueColor,
            letterSpacing: "-0.04em",
          }}
        >
          {String(value ?? 0).padStart(2, "0")}
        </Typography>
        {helper && (
          <Typography variant="body2" sx={{ mt: 0.75, color: "text.secondary", lineHeight: 1.5 }}>
            {helper}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}

function resolveScope(decodedToken) {
  const fallback = {
    companyId: decodedToken?.companyId || "",
    branchId: decodedToken?.branchId || "",
    companyName: decodedToken?.companyName || "",
    branchName: decodedToken?.branchName || "",
  };

  try {
    const storedSelection = Cookies.get("usercompanyandbranch");
    if (!storedSelection) {
      return fallback;
    }

    const parsed = JSON.parse(storedSelection);
    return {
      companyId: parsed?.company?._id || parsed?.companyId || fallback.companyId,
      branchId: parsed?.branch?._id || parsed?.branchId || fallback.branchId,
      companyName: parsed?.company?.name || fallback.companyName,
      branchName: parsed?.branch?.name || fallback.branchName,
    };
  } catch (error) {
    return fallback;
  }
}

export default function Dashboard() {
  const searchParams = useSearchParams();
  const showSuccess = searchParams.get("from") === "login";
  const pathname = usePathname();
  const router = useRouter();
  const [userdata, setuserdata] = useState({});
  const [scope, setScope] = useState({});
  const [summary, setSummary] = useState(DEFAULT_SUMMARY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const safeRequest = async (request) => {
      try {
        return await request;
      } catch (error) {
        console.error("Dashboard request failed:", error);
        return null;
      }
    };

    const loadDashboard = async () => {
      const token = localStorage.getItem("biometric_token");
      if (!token) {
        if (isMounted) {
          setLoading(false);
        }
        router.push("/login");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const resolvedScope = resolveScope(decoded);

        if (!isMounted) {
          return;
        }

        setuserdata(decoded);
        setScope(resolvedScope);

        const requestBody = {
          companyId: resolvedScope.companyId || undefined,
          branchId: resolvedScope.branchId || undefined,
        };
        const today = new Date();
        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        const trendDays = Array.from({ length: 7 }, (_, index) => {
          const day = new Date(today);
          day.setDate(today.getDate() - (6 - index));
          return day;
        });

        const [todayStatsResponse, companiesResponse, leavesResponse, trendResponses] = await Promise.all([
          safeRequest(api.post("/attendance/stats", requestBody, { params: { date: toDateKey(today) } })),
          safeRequest(api.get("/company/allcompany")),
          safeRequest(
            api.post("/leaves/getAllLeaves", requestBody, {
              params: { leave_status: "Accepted", page: 1, limit: 1000 },
            })
          ),
          Promise.all(
            trendDays.map(async (day) => {
              const response = await safeRequest(
                api.post("/attendance/stats", requestBody, { params: { date: toDateKey(day) } })
              );
              return {
                label: day.toLocaleDateString("en-US", { weekday: "short" }),
                date: toDateKey(day),
                present: response?.data?.present ?? 0,
                absent: response?.data?.absent ?? 0,
              };
            })
          ),
        ]);

        if (!isMounted) {
          return;
        }

        const todayStats = todayStatsResponse?.data || {};
        const companies = normalizeListPayload(companiesResponse?.data);
        const leaves = normalizeListPayload(leavesResponse?.data);

        setSummary({
          counts: {
            present: todayStats.present ?? 0,
            absent: todayStats.absent ?? 0,
            onLeave: leaves.filter((leave) => isActiveLeaveToday(leave, startOfDay, endOfDay)).length,
            totalEmployees: todayStats.totalEmployees ?? 0,
          },
          attendanceTrend: trendResponses,
          companyIndustryBreakdown: buildIndustryBreakdown(companies),
          updatedAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Dashboard load failed:", error);
        if (error?.name === "InvalidTokenError" || error?.message?.includes("Invalid token")) {
          localStorage.removeItem("biometric_token");
          router.push("/login");
          return;
        }
        if (isMounted) {
          setSummary(DEFAULT_SUMMARY);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    router.replace(pathname);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          mt: 1,
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            Dashboard
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Default / Home
          </Typography>
        </Box>

        <Box
          sx={{
            mb: 3,
            p: { xs: 1.5, sm: 2 },
            borderRadius: 4,
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.82) 0%, rgba(247, 250, 248, 0.92) 100%)",
            border: "1px solid rgba(14, 159, 110, 0.08)",
          }}
        >
          <Grid container spacing={2} alignItems="stretch">
            <Grid item xs={12} md={3} sx={{ display: "flex" }}>
              <DashboardHeader userdata={userdata} summary={summary} scope={scope} />
            </Grid>

            <Grid item xs={12} md={6} sx={{ display: "flex" }}>
              <Stack spacing={2} sx={{ width: "100%" }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <StatCard
                      label="Total Present"
                      value={summary?.counts?.present ?? 0}
                      helper={`Active employees: ${summary?.counts?.totalEmployees ?? 0}`}
                      icon={Groups2OutlinedIcon}
                      tone={STAT_TONES.present}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <StatCard
                      label="Total Absent"
                      value={summary?.counts?.absent ?? 0}
                      helper="Based on today's active attendance"
                      icon={PersonOffOutlinedIcon}
                      tone={STAT_TONES.absent}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <StatCard
                      label="Total On Leave"
                      value={summary?.counts?.onLeave ?? 0}
                      helper="Approved leave requests"
                      icon={BeachAccessOutlinedIcon}
                      tone={STAT_TONES.leave}
                    />
                  </Grid>
                </Grid>

                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    minHeight: 280,
                    height: "100%",
                    border: "1px solid rgba(15, 23, 42, 0.06)",
                    boxShadow: "none",
                  }}
                >
                  <TeamPerformanceChart trend={summary?.attendanceTrend || []} loading={loading} />
                </Paper>
              </Stack>
            </Grid>

            <Grid item xs={12} md={3} sx={{ display: "flex" }}>
              <DonutChart items={summary?.companyIndustryBreakdown || []} loading={loading} />
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={2} sx={{ mt: 2 }} alignItems="stretch">
          <Grid item xs={12} md={6} sx={{ display: "flex" }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <EmployeeStatusTable />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6} sx={{ display: "flex" }}>
            <Grid container spacing={2} alignItems="stretch" sx={{ width: "100%" }}>
              <Grid item xs={12} md={6} sx={{ display: "flex" }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <EventsAndMeetings />
                </Paper>
              </Grid>

              <Grid item xs={12} md={6} sx={{ display: "flex" }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Birthdays />
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={Boolean(showSuccess)}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          icon={<CheckCircleIcon fontSize="inherit" />}
          onClose={handleCloseSnackbar}
          severity="success"
          variant="filled"
          sx={{
            width: "100%",
            backgroundColor: "#0e9f6e",
            color: "white",
            "& .MuiAlert-icon": {
              color: "white",
              alignItems: "center",
            },
          }}
          action={
            <IconButton size="small" onClick={handleCloseSnackbar} style={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          }
        >
          {"Login Successfully"}
        </Alert>
      </Snackbar>
    </Layout>
  );
}
