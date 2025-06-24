
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

export default function DonutChart() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [graphData, setGraphData] = useState({ labels: [], data: [] });

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      let token = localStorage.getItem("biometric_token");
      const response = await axios.get(
        `http://localhost:3001/company/allcompany`,
        {
          headers: { Authorization: token },
        }
      );
      setCompanies(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching companies:", error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (companies.length) {
      // Count companies by industry
      const industryCount = {};
      companies.forEach(company => {
        const industry = company.industry || "Unknown";
        industryCount[industry] = (industryCount[industry] || 0) + 1;
      });
      
      const labels = Object.keys(industryCount);
      const dataValues = Object.values(industryCount);

      setGraphData({
        labels: labels,
        data: dataValues
      });
    }
  }, [companies]);

  const data = {
    labels: graphData.labels,
    datasets: [
      {
        label: "Companies",
        data: graphData.data,
        backgroundColor: [
          "#10B981", // Dark green
          "#34D399", // Medium green
          "#6EE7B7", // Lighter green
          "#A7F3D0",
          "#D1FAE5",
          "#A78BFA", // Purple for additional industries
          "#FBBF24", // Amber
          "#F87171", // Red
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%", // Donut hole size
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Build custom legend items
  const legendItems = data.labels.map((label, i) => ({
    label,
    value: data.datasets[0].data[i],
    color: data.datasets[0].backgroundColor[i],
  }));

  return (
    <Box
      sx={{
        borderRadius: 1,
        backgroundColor: "#fff",
        p: 2,
        width: "100%",
        maxWidth: { xs: '100%', sm: 250 },
        display: "flex",
        flexDirection: "column",
        height: { xs: 'auto', sm: "320px" }
      }}
    >
      {/* Top Title */}
      <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#374151" }}>
        Companies by Industry
      </Typography>

      {/* Donut Chart (centered) */}
      <Box
        sx={{
          mt: 2,
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: { xs: 150, sm: 130 }
        }}
      >
        <Box sx={{ width: { xs: '100%', sm: 200 }, height: '100%' }}>
          {graphData?.data?.length ? <Doughnut data={data} options={options} /> : 
            <Typography variant="body2" sx={{ textAlign: 'center', color: '#6B7280' }}>
              {loading ? 'Loading data...' : 'No data available'}
            </Typography>
          }
        </Box>
      </Box>

      {/* Legend at the bottom */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {legendItems.map((item) => (
          <Box
            key={item.label}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Color bullet + label */}
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

            {/* Value */}
            <Typography variant="body2" sx={{ color: "#374151" }}>
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
