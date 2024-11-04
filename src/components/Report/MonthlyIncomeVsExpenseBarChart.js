import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import styled from "styled-components";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Styled-components for the chart container
const ChartContainer = styled.div`
  width: 100%; /* Full width to make it responsive */
  max-width: 600px; /* Maximum width for larger screens */
  height: auto;
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

const IncomeExpenseChart = ({ incomeData, expenseData }) => {
  // Function to calculate monthly totals
  const calculateMonthlyTotals = (data) => {
    const monthlyTotals = {};
    const currentYear = new Date().getFullYear();

    data.forEach((item) => {
      const createdDate = new Date(item.createdDate);
      if (createdDate.getFullYear() === currentYear) {
        const month = createdDate.toLocaleString("default", { month: "long" });
        monthlyTotals[month] = (monthlyTotals[month] || 0) + item.total;
      }
    });

    // Sort the months in chronological order
    const sortedMonthlyTotals = {};
    const monthOrder = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    monthOrder.forEach((month) => {
      if (monthlyTotals[month]) {
        sortedMonthlyTotals[month] = monthlyTotals[month];
      }
    });

    return sortedMonthlyTotals;
  };

  const incomeTotals = calculateMonthlyTotals(incomeData);
  const expenseTotals = calculateMonthlyTotals(expenseData);

  // Prepare data for the chart
  const labels = Object.keys(incomeTotals).length
    ? Object.keys(incomeTotals)
    : [];

  const incomeAmounts = labels.map((label) => incomeTotals[label] || 0);
  const expenseAmounts = labels.map((label) => expenseTotals[label] || 0);

  const data = {
    labels,
    datasets: [
      {
        label: "Income",
        data: incomeAmounts,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Expenses",
        data: expenseAmounts,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Maintain aspect ratio when resizing
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: `Monthly Income vs Expenses (Year - ${new Date().getFullYear()})` },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Amount",
        },
      },
    },
  };

  return (
    <ChartContainer>
      <Bar data={data} options={options} />
    </ChartContainer>
  );
};

export default IncomeExpenseChart;
