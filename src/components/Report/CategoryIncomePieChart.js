import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import styled from "styled-components";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Styled-components for the chart container
const ChartContainer = styled.div`
  width: 100%; /* Full width for responsiveness */
  max-width: 400px; /* Maximum width for larger screens */
  height: auto; /* Allow height to adjust automatically */
  margin: 0 auto; /* Center the chart container */
  background-color: #f0f0f0; /* Light grey background */
  padding: 20px; /* Add padding for spacing */
  border-radius: 10px; /* Smooth edges */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Soft shadow */

  canvas {
    background-color: #fff; /* White background for the chart */
    border-radius: 8px;
    width: 100% !important; /* Make canvas width responsive */
    height: auto !important; /* Maintain aspect ratio */
  }
`;

const CategoryWiseIncomePieChart = ({ incomeData }) => {
  // Function to calculate category-wise totals
  const calculateCategoryWiseTotals = (data) => {
    const categoryWiseTotals = {};

    data.forEach((item) => {
      const category = item.category;
      categoryWiseTotals[category] =
        (categoryWiseTotals[category] || 0) + item.total;
    });

    return categoryWiseTotals;
  };

  const incomeTotals = calculateCategoryWiseTotals(incomeData);

  // Prepare data for the chart
  const labels = Object.keys(incomeTotals);

  const data = {
    labels,
    datasets: [
      {
        label: "Income Categories",
        data: Object.values(incomeTotals),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Income Category Wise" },
    },
  };

  return (
    <ChartContainer>
      <Pie data={data} options={options} />
    </ChartContainer>
  );
};

export default CategoryWiseIncomePieChart;
