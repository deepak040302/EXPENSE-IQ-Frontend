import React, { useState, useEffect } from "react";
import styled from "styled-components";
import FormHeader from "../Expenses/Elements/FormHeader";
import { currency } from "../../utils/Currency";
import { handleDownload } from "../../utils/DocumentDownload";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FileOutput } from "lucide-react";
import { useAuth } from "../Security/AuthProvider";
import TransactionDataTable from "./TransactionDataTable";

export default function ViewTransactions() {
  const { logout, loogedInUsername } = useAuth();
  const [isDataLoaded, setIsDataLoaded] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.warn("You are not authenticated!");
        return;
      }

      try {
        const incomeResponse = await axios.get(
          "http://localhost:8081/api/get-incomes",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const expenseResponse = await axios.get(
          "http://localhost:8081/api/get-expenses",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const updatedIncomeResponse = incomeResponse.data.map((income) => {
          return { ...income, transactionType: "Income" };
        });

        const updatedExpenseResponse = expenseResponse.data.map((expense) => {
          return { ...expense, transactionType: "Expense" };
        });

        const allLatestTransactions = updatedIncomeResponse
          .concat(updatedExpenseResponse)
          .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

        setTransactions(allLatestTransactions);
        setFilteredTransactions(allLatestTransactions); // Set initial filtered transactions
        setIsDataLoaded(false);

        console.log("  ddd " + loogedInUsername);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          toast.error("Unauthorized - Please Login or SignUp to access.");
          logout();
        } else {
          console.log("An error occurred:", error);
          toast.error("Network error: Backend server not reachable");
        }
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [logout, loogedInUsername]); // Remove searchTerm from dependency array

  useEffect(() => {
    // Filter transactions based on search term whenever it changes
    const filtered = transactions.filter(
      (transaction) =>
        transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.total
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.transactionType
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
    setFilteredTransactions(filtered);
  }, [searchTerm, transactions]); // Filter transactions when searchTerm or transactions change

  const handleDocumentDownload = (id, transactionType, fileName) => {
    handleDownload(id, transactionType, fileName)
      .then((result) => {
        if (result) {
          toast.success("Download successful");
        } else {
          toast.warning("No Document Uploaded");
        }
      })
      .catch((error) => {
        toast.error("An error occurred while downloading document.");
        console.log("An error occurred", error);
      });
  };

  const renderDownloadButton = (rowData) => (
    <ClickableTd
      onClick={() =>
        handleDocumentDownload(
          rowData.id,
          rowData.transactionType,
          rowData.subject
        )
      }
    >
      <FileOutput />
    </ClickableTd>
  );

  return (
    <TableContainer>
      <ToastContainer theme="dark" position="top-right" autoClose={1500} />
      <Header>
        <FormHeader title="All Latest Transactions" />
        <SearchBar
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Header>
      <hr />
      <TransactionDataTable
        value={filteredTransactions} // Pass filtered transactions to the table
        isDataLoaded={isDataLoaded}
        emptyMessage="No Transaction Data Available !!"
        renderDownloadButton={renderDownloadButton}
        currency={currency.currencySymbol}
      />
    </TableContainer>
  );
}

// Styled Components (responsive styles added)
const TableContainer = styled.div`
  background: #111827;
  color: white;
  padding: 4%;
  max-width: 100%;
  margin: auto;
  border: 2px solid #4b5563;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  overflow-x: auto; /* Allow horizontal scrolling on small screens */
  
  @media (max-width: 600px) {
    padding: 2%; /* Reduce padding on smaller screens */
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column; /* Change to column for better layout on small screens */
  justify-content: space-between;
  align-items: flex-start; /* Align items to the start */
  margin-bottom: 0px;

  @media (min-width: 601px) {
    flex-direction: row; /* Use row layout on larger screens */
    justify-content: space-between;
    width: 100%; /* Ensure full width on larger screens */
  }
`;

const ClickableTd = styled.td`
  color: #14b8a6;
  cursor: pointer;
  transition: color 0.5s ease, transform 0.3s ease;
  text-decoration: none;

  &:hover {
    color: #0284c7;
    text-decoration: underline;
    transform: scale(1.4);
  }
`;

// New SearchBar component with responsive styles
const SearchBar = styled.input`
  width: 100%; /* Full width on smaller screens */
  padding: 1%;
  margin-bottom: 1%;
  border-radius: 8px;
  border: 2px solid #4b5563;
  background-color: #374151;
  color: white;
  font-size: 1rem;
  height: 3rem;
  padding: 1rem;

  @media (min-width: 601px) {
    width: 20%; /* Fixed width on larger screens */
    height: 3rem;
    padding: 1%;
  }
`;
