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
  width: 92%;
  height: auto;
  margin: 0 auto;
  background-color: #f0f0f0; /* Light grey background */
  padding: 20px; /* Add padding for spacing */
  border-radius: 10px; /* Smooth edges */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Soft shadow */

  canvas {
    background-color: #fff; /* White background for the chart */
    border-radius: 8px;
  }
`;

const WeeklyExpenseIncomeBarChart = ({ incomeData, expenseData }) => {
  // Function to calculate weekly totals for the current month
  const calculateWeeklyTotals = (data) => {
    const weeklyTotals = {};
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    data.forEach((item) => {
      const createdDate = new Date(item.createdDate);
      if (
        createdDate.getMonth() === currentMonth &&
        createdDate.getFullYear() === currentYear
      ) {
        // Get week number of the month
        const week = Math.ceil(createdDate.getDate() / 7);
        const key = `Week ${week}`;
        weeklyTotals[key] = (weeklyTotals[key] || 0) + item.total;
      }
    });

    return weeklyTotals;
  };

  const incomeTotals = calculateWeeklyTotals(incomeData);
  const expenseTotals = calculateWeeklyTotals(expenseData);

  // Prepare data for the chart
  const labels = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"]; // Max 5 weeks in a month
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
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: `Weekly Income vs Expenses (Current Month - ${new Date().toLocaleString('default', { month: 'long' })})`},
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

export default WeeklyExpenseIncomeBarChart;
