import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Box, Typography } from "@mui/material";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const DEFAULT_COLORS = [
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

export default function DonutChart({ items, loading = false, title = "Companies by Industry" }) {
  const [companies, setCompanies] = useState([]);
  const [isFetching, setIsFetching] = useState(!Array.isArray(items));
  const useExternalItems = Array.isArray(items);

  useEffect(() => {
    if (useExternalItems) {
      setIsFetching(false);
      return;
    }

    const fetchCompanies = async () => {
      try {
        setIsFetching(true);
        const token = localStorage.getItem("biometric_token");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/company/allcompany`,
          {
            headers: { Authorization: token },
          }
        );
        setCompanies(response.data || []);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchCompanies();
  }, [useExternalItems]);

  const sourceItems = useExternalItems
    ? items
    : companies.reduce((acc, company) => {
        const industry = company.industry || "Unknown";
        const existing = acc.find((entry) => entry.label === industry);
        if (existing) {
          existing.value += 1;
        } else {
          acc.push({
            label: industry,
            value: 1,
            color: DEFAULT_COLORS[acc.length % DEFAULT_COLORS.length],
          });
        }
        return acc;
      }, []);

  const chartLabels = sourceItems.map((item) => item.label);
  const chartValues = sourceItems.map((item) => item.value);
  const chartColors = sourceItems.map(
    (item, index) => item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]
  );

  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: "Companies",
        data: chartValues,
        backgroundColor: chartColors,
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%",
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  const legendItems = data.labels.map((label, i) => ({
    label,
    value: data.datasets[0].data[i],
    color: data.datasets[0].backgroundColor[i],
  }));

  const isLoading = useExternalItems ? loading : isFetching;

  return (
    <Box
      sx={{
        borderRadius: 4,
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(247, 250, 248, 0.98) 100%)",
        border: "1px solid rgba(14, 159, 110, 0.08)",
        p: 2.5,
        width: "100%",
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 320,
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at top right, rgba(14, 159, 110, 0.10) 0, transparent 26%)",
        }}
      />

      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 800, color: "#0F172A", position: "relative", zIndex: 1 }}
      >
        {title}
      </Typography>

      <Box
        sx={{
          mt: 2,
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: { xs: 160, sm: 170 },
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box sx={{ width: { xs: "100%", sm: 210 }, height: "100%" }}>
          {data?.datasets?.[0]?.data?.length ? (
            <Doughnut data={data} options={options} />
          ) : (
            <Typography variant="body2" sx={{ textAlign: "center", color: "#6B7280" }}>
              {isLoading ? "Loading data..." : "No data available"}
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, position: "relative", zIndex: 1 }}>
        {legendItems.map((item) => (
          <Box
            key={item.label}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: 1,
                  backgroundColor: item.color,
                  flexShrink: 0,
                }}
              />
              <Typography variant="body2" sx={{ color: "#374151" }}>
                {item.label}
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ color: "#374151" }}>
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
