
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

  const [employees, setEmployees] = useState([]);
  const [employeesPosition, setemployeesPosition] = useState([]);
  const [loading, setLoading] = useState(true);
  const [graphdata, setgraphdata] = useState({labels:[],data:[]});

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      // Construct query params
      const params = {
        page: 1,
        page_size: 100000,
      };

      let token = localStorage.getItem("token");
      const responseForPosition = await axios.get(
        `http://localhost:7000/employee/wer`, {
          headers: { Authorization: token },
          params
        }
      );
      setemployeesPosition(responseForPosition.data.data)
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);
useEffect(()=>{
  if(employeesPosition.length){
    const positionCount = {};
    employeesPosition.forEach(emp => {
      const pos = emp.position?.position_name || "Unknown";
      positionCount[pos] = (positionCount[pos] || 0) + 1;
    });
    
    const labels = Object.keys(positionCount);
    const dataValues = Object.values(positionCount);

    graphdata.labels=labels
    graphdata.data=dataValues
    setgraphdata({
      labels: labels,
      data: dataValues
    })

  }
},[employeesPosition.length])
  const data = {
    // labels: [
    //   "Software Engineer",
    //   "UI/UX Designer",
    //   "Data Analyst",
    //   "Mobile Development",
    //   "Project Manager",
    // ],
    labels:graphdata.labels   ,
    datasets: [
      {
        label: "Employees",
        // data: [50, 28, 25, 10, 7],
        data: graphdata.data,

        backgroundColor: [
          "#10B981", // Dark green
          "#34D399", // Medium green
          "#6EE7B7", // Lighter green
          "#A7F3D0",
          "#D1FAE5",
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
      // Hide the default legend (we're doing a custom legend below)
      legend: { display: false },
      title: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.parsed || 0;
            return `${label}: ${value}`;
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
        maxWidth: { xs: '100%', sm: 250 }, // Full width on mobile, 250px on desktop
        display: "flex",
        flexDirection: "column",
        height: { xs: 'auto', sm: "320px" } // Auto height on mobile
      }}
    >
      {/* Top Title */}
      <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#374151" }}>
        Total Employee
      </Typography>

      {/* Donut Chart (centered) */}
      <Box
        sx={{
          mt: 2,
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: { xs: 150, sm: 130 } // Adjust height for mobile
        }}
      >
        <Box sx={{ width: { xs: '100%', sm: 200 }, height: '100%' }}>
          {graphdata?.data?.length ? <Doughnut data={data} options={options} /> : null}
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

