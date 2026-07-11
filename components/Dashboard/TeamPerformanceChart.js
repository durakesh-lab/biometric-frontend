// components/Dashboard/TeamPerformanceChart.js
import React from "react";
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

export default function TeamPerformanceChart() {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    datasets: [
      {
        label: "Designer Team",
        data: [10, 20, 15, 25, 30, 20, 35, 40, 38],
        borderColor: "#66BB6A", 
        backgroundColor: "rgba(102, 187, 106, 0.1)",
        fill: true,
        tension: 0.3,
      },
      {
        label: "Developer Team",
        data: [5, 15, 10, 20, 25, 15, 30, 35, 33],
        borderColor: "#FFA726",
        backgroundColor: "rgba(255, 167, 38, 0.1)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow custom height
    aspectRatio: 2, // Adjust this to change the height
    plugins: {
      legend: { position: "bottom" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };
  

  return <div style={{ height: "170px" }}>
  <Line data={data} options={options} />
</div>

}
