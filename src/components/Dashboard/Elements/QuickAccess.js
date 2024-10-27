import React from "react";
import QuickAccessButton from "../Elements/QuickAccessButton";
import styled from "styled-components";
import { CreditCard, PieChart, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function QuickAccess() {
  const navigate = useNavigate();

  const handleNewExpenseClick = () => {
    navigate("/new-expense");
  };

  const handleNewIncomeClick = () => {
    navigate("/new-income");
  };

  const handleReportGenerateClick = () => {
    navigate("/generate-report");
  };

  const handleCreateNewTripClick = () => {
    navigate("/trip");
  };

  return (
    <>
      <h3>Quick Access Buttons</h3>
      <QuickAccessGrid>
        <QuickAccessButton
          icon={<CreditCard />}
          label="Add New Expense"
          color="#6b7280"
          onClick={handleNewExpenseClick}
        />
        <QuickAccessButton
          icon={<CreditCard />}
          label="Add New Income"
          color="#3b82f6"
          onClick={handleNewIncomeClick}
        />
        <QuickAccessButton
          icon={<PieChart />}
          label="Generate Report"
          color="#14b8a6"
          onClick={handleReportGenerateClick}
        />
        <QuickAccessButton
          icon={<Users />}
          label="Create New Trip"
          color="#f43f5e"
          onClick={handleCreateNewTripClick}
        />
      </QuickAccessGrid>
    </>
  );
}

const QuickAccessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
`;
