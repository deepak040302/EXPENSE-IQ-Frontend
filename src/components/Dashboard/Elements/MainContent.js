import React, { useState, useEffect } from "react";
import styled from "styled-components";
import QuickAccess from "./QuickAccess";
import axios from "axios";
import { currency } from "../../../utils/Currency";
import IncomeExpenseChart from "../../Report/MonthlyIncomeVsExpenseBarChart";
import CategoryWiseExpensePieChart from "../../Report/CategoryExpensePieChart";
import CategoryWiseIncomePieChart from "../../Report/CategoryIncomePieChart";
import WeeklyExpenseIncomeBarChart from "../../Report/WeeklyExpenseBarChart";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../Security/AuthProvider";

function MainContent() {
  const { logout } = useAuth();
  const API_URL = `${process.env.REACT_APP_API_URL}`;

  const [expenseList, setExpenseList] = useState([]);
  const [incomeList, setIncomeList] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.warn("You are not authenticated!");
        return;
      }

      try {
        const incomeResponse = await axios.get(
          `${API_URL}/api/get-incomes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const expenseResponse = await axios.get(
          `${API_URL}/api/get-expenses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const updatedIncomeResponse = incomeResponse.data.map((income) => ({
          ...income,
          transactionType: "Income",
        }));

        const updatedExpenseResponse = expenseResponse.data.map((expense) => ({
          ...expense,
          transactionType: "Expense",
        }));

        setIncomeList(updatedIncomeResponse);
        setExpenseList(updatedExpenseResponse);

        const totalIncomeAmount = updatedIncomeResponse.reduce(
          (acc, income) => acc + income.total,
          0
        );
        const totalExpensesAmount = updatedExpenseResponse.reduce(
          (acc, expense) => acc + expense.total,
          0
        );

        setTotalIncome(totalIncomeAmount.toFixed(2));
        setTotalExpense(totalExpensesAmount.toFixed(2));
        setTotalBalance((totalIncomeAmount - totalExpensesAmount).toFixed(2));
      } catch (error) {
        if (error.response && error.response.status === 401) {
          toast.error("Unauthorized - Please Login or SignUp to access.");
          logout();
        } else {
          console.log("An error occurred:", error);
          toast.error("Some Error Occurred");
        }
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions(); // Fetch data when component mounts
    
  // eslint-disable-next-line  
  }, [logout]);

  return (
    <>
      <ToastContainer />
      <CardStyled>
        <QuickAccess />
      </CardStyled>

      <ContentGridBalance>
        <TotalCard>
          <TotalCardHeader>Total Income</TotalCardHeader>
          <TotalCardAmount>
            {currency.currencySymbol} {totalIncome}
          </TotalCardAmount>
        </TotalCard>

        <TotalCard>
          <TotalCardHeader>Total Expenses</TotalCardHeader>
          <TotalCardAmount>
            {currency.currencySymbol} {totalExpense}
          </TotalCardAmount>
        </TotalCard>

        <TotalCard>
          <TotalCardHeader>Total Balance</TotalCardHeader>
          <TotalCardAmount>
            {currency.currencySymbol} {totalBalance}
          </TotalCardAmount>
        </TotalCard>
      </ContentGridBalance>

      <CardStyled>
        <ContentGrid>
          <div>
            <h4>Monthly Income Vs Expense</h4>
            <PlaceholderChart>
              <IncomeExpenseChart
                incomeData={incomeList}
                expenseData={expenseList}
              />
            </PlaceholderChart>
          </div>
          <div>
            <h4>Weekly Income Vs Expense</h4>
            <PlaceholderChart>
              <WeeklyExpenseIncomeBarChart
                incomeData={incomeList}
                expenseData={expenseList}
              />
            </PlaceholderChart>
          </div>
        </ContentGrid>

        <hr />

        <ContentGridPieChart>
          <div>
            <h4>Category Wise Expense</h4>
            <PlaceholderChart>
              <CategoryWiseExpensePieChart expenseData={expenseList} />
            </PlaceholderChart>
          </div>
          <div>
            <h4>Category Wise Income</h4>
            <PlaceholderChart>
              <CategoryWiseIncomePieChart incomeData={incomeList} />
            </PlaceholderChart>
          </div>
        </ContentGridPieChart>
      </CardStyled>
    </>
  );
}

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Adjusts for smaller screens */
  gap: 2rem;
  margin-bottom: 3%;
`;

const ContentGridPieChart = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Responsive layout */
  gap: 2rem;
`;

const ContentGridBalance = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Responsive layout */
  gap: 2rem;
`;

const CardStyled = styled.div`
  background: #1f2937;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const TotalCard = styled(CardStyled)`
  background: #2a374e; /* A different background for the total cards */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid #3b4c66; /* Slightly darker border */
`;

const TotalCardHeader = styled.h3`
  font-size: 1.5rem; /* Increased font size for emphasis */
  color: #ffffff; /* White text for better contrast */
  margin: 0; /* Reset margin for better spacing */
  padding-bottom: 0.5rem; /* Space below header */
  text-align: center; /* Center text */
`;

const TotalCardAmount = styled.h3`
  font-size: 2rem; /* Larger font for the amount */
  color: #76e4af; /* A distinct color for the amount */
  margin: 0; /* Reset margin for better spacing */
  font-weight: bold; /* Make the amount bold */
  text-align: center; /* Center text */
`;

const PlaceholderChart = styled.div`
  background: transparent;
  border-radius: 0.75rem;
  width: auto;
`;

export default MainContent;
