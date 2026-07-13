import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DEFAULT_TREND = [
  { label: "Mon", present: 18, absent: 4 },
  { label: "Tue", present: 22, absent: 3 },
  { label: "Wed", present: 20, absent: 5 },
  { label: "Thu", present: 25, absent: 2 },
  { label: "Fri", present: 28, absent: 2 },
  { label: "Sat", present: 17, absent: 6 },
  { label: "Sun", present: 12, absent: 8 },
];

export default function TeamPerformanceChart({
  trend,
  loading = false,
  title = "Attendance Trend",
}) {
  const usingFallbackTrend = trend === undefined;
  const sourceTrend = usingFallbackTrend ? DEFAULT_TREND : trend;
  const labels = sourceTrend.map((item) => item.label);
  const presentData = sourceTrend.map((item) => item.present);
  const absentData = sourceTrend.map((item) => item.absent);

  const data = {
    labels,
    datasets: [
      {
        label: "Present",
        data: presentData,
        borderColor: "#0E9F6E",
        backgroundColor: "rgba(14, 159, 110, 0.10)",
        fill: true,
        tension: 0.35,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: "#FFFFFF",
        pointBorderColor: "#0E9F6E",
        pointBorderWidth: 2,
      },
      {
        label: "Absent",
        data: absentData,
        borderColor: "#F59E0B",
        backgroundColor: "rgba(245, 158, 11, 0.08)",
        fill: true,
        tension: 0.35,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: "#FFFFFF",
        pointBorderColor: "#F59E0B",
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          color: "#475569",
          font: {
            family: "Roboto",
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "#0F172A",
        titleColor: "#FFFFFF",
        bodyColor: "#FFFFFF",
        padding: 12,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#64748B",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#64748B",
        },
        grid: {
          color: "rgba(148, 163, 184, 0.16)",
        },
      },
    },
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: 260,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2, mb: 2 }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0F172A" }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Active staff presence for the selected scope
          </Typography>
        </Box>
        <Chip
          label={loading ? "Loading" : "Live"}
          size="small"
          sx={{
            borderRadius: 999,
            fontWeight: 700,
            color: "#0E9F6E",
            backgroundColor: "rgba(14, 159, 110, 0.10)",
          }}
        />
      </Box>

      <Box sx={{ flex: 1, minHeight: 220 }}>
        {sourceTrend.length ? (
          <Line data={data} options={options} />
        ) : (
          <Box
            sx={{
              height: "100%",
              minHeight: 220,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {loading ? "Loading data..." : "No attendance data available"}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
