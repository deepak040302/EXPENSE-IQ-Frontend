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

export default function ViewTransactions() {
  const { logout, loogedInUsername } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [transactions, setTransactions] = useState([
    {
      category: "Groceries",
      createdDate: "2024-10-10",
      description: "sf",
      document: null,
      id: 35,
      merchant: "fad",
      subject: "deepak",
      total: 32,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState(""); // For managing search input
  const rowsPerPage = 6;

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


        console.log("  ddd "  + loogedInUsername);
        
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
  }, [logout]);

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(
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

  // Calculate total number of pages for filtered transactions
  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);

  // Get current rows to display
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredTransactions.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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

  return (
    <TableContainer>
      <ToastContainer theme="dark" />
      <Header>
        <FormHeader title="All Latest Transactions" />

        <SearchBar
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Header>

      {/* Search Input */}

      <hr />

      <Table>
        <thead>
          <tr className="text-gray-400 text-sm uppercase">
            <Th>Sr. No.</Th>
            <Th>Transaction Title</Th>
            <Th>Merchant</Th>
            <Th>Amount</Th>
            <Th>Date</Th>
            <Th>Category</Th>
            <Th>Transaction Type</Th>
            <Th>Invoice</Th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((transaction, index) => (
            <TableRow key={index + 1} index={startIndex + index}>
              <td className="py-4 px-4">{startIndex + index + 1}</td>
              <td className="py-4 px-4">{transaction.subject}</td>
              <td className="py-4 px-4">{transaction.merchant}</td>
              <td className="py-4 px-4">
                {currency.currencySymbol} {transaction.total}
              </td>
              <td className="py-4 px-4">{transaction.createdDate}</td>
              <td className="py-4 px-4">{transaction.category}</td>
              <td className="py-4 px-4">{transaction.transactionType}</td>
              <ClickableTd
                className="py-4 px-4"
                onClick={() =>
                  handleDocumentDownload(
                    transaction.id,
                    transaction.transactionType,
                    transaction.subject
                  )
                }
              >
                <FileOutput />
              </ClickableTd>
            </TableRow>
          ))}
        </tbody>
      </Table>

      <Pagination>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </Pagination>
    </TableContainer>
  );
}

// Styled Components (unchanged)
const TableContainer = styled.div`
  background: #111827;
  color: white;
  padding: 4%;
  max-width: 100%;
  margin: auto;
  border: 2px solid #4b5563;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableRow = styled.tr`
  background: ${({ index }) => (index % 2 === 0 ? "#374151" : "#4b5563")};

  td {
    padding: 16px;
    border: 1px solid #4b5563;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #4b5563;
  }
`;

const Th = styled.th`
  padding: 16px;
  border: 1px solid #4b5563;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;

  button {
    background-color: #14b8a6;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin: 0 10px;

    &:hover {
      background-color: #0f766e;
    }

    &:disabled {
      background-color: #4b5563;
      cursor: not-allowed;
    }
  }

  span {
    color: white;
    margin: 0 10px;
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

// New SearchBar component
const SearchBar = styled.input`
  width: 20%;
  padding: 1%;
  margin-bottom: 1%;
  border-radius: 8px;
  border: 2px solid #4b5563;
  background-color: #374151;
  color: white;
  font-size: 1rem;
`;
