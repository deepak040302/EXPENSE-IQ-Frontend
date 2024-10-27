import React, { useState, useEffect } from "react";
import styled from "styled-components";
import FormHeader from "./Elements/FormHeader";
import { useNavigate } from "react-router-dom";
import { currency } from "../../utils/Currency";
import { handleDownload } from "../../utils/DocumentDownload";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FileOutput, Trash2 } from "lucide-react";
import { useAuth } from "../Security/AuthProvider";
import { TriangleAlert } from "lucide-react";

export default function Expenses() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [expenses, setExpenses] = useState([
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

  const rowsPerPage = 6;

  const fetchExpenses = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warn("You are not authenticated!");
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:8081/api/get-expenses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const expensesData = response.data.sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      );

      setExpenses(expensesData);
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

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Calculate total number of pages
  const totalPages = Math.ceil(expenses.length / rowsPerPage);

  // Get current rows to display
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = expenses.slice(startIndex, startIndex + rowsPerPage);

  const handleNewExpenseClick = () => {
    navigate("/new-expense");
  };

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

  const handleExpenseDelete = async (expenseId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warn("You are not authenticated!");
      logout();
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8081/api/delete-expense/${expenseId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Expense Deleted Successfully!!");
        console.log("Expense Deleted Successfully!!");
        fetchExpenses();
      } else {
        toast.error("Cannot Delete - Some Problem Occured");
        console.log("Cannot Delete - Some Problem Occured");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Unauthorized - Please Login or SignUp to access.");
        logout();
      } else {
        console.log("An error occurred:", error);
        toast.error("Some Error Occured During Deleting Expenses");
      }
      console.error("Error Deleting Expense:", error);
    }
  };

    const confirm = (incomeId) => {
    confirmDialog({
      message: "Are you sure you want to delete?",
      header: "Delete Confirmation",
      icon: <TriangleAlert />,
      defaultFocus: "accept",
      accept: () => accept(incomeId),
      reject: () => reject(incomeId),
    });
  };

  const accept = (incomeId) => {
    handleExpenseDelete(incomeId);
  };

  const reject = () => {};

  return (
    <TableContainer>
      <ToastContainer theme="dark" position="top-right" autoClose={1500} />
      <Header>
        <FormHeader title="Expenses" />
        <NewExpenseButton onClick={handleNewExpenseClick}>
          + New Expense
        </NewExpenseButton>
      </Header>

      <hr />

      <Table>
        <thead>
          <tr className="text-gray-400 text-sm uppercase">
            <Th>Sr. No.</Th>
            <Th>Expense Title</Th>
            <Th>Merchant</Th>
            <Th>Amount</Th>
            <Th>Date</Th>
            <Th>Category</Th>
            <Th>Description</Th>
            <Th>Invoice</Th>
            <Th>Delete</Th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((expense, index) => (
            <TableRow key={index + 1} index={startIndex + index}>
              <td className="py-4 px-4">{startIndex + index + 1}</td>
              <td className="py-4 px-4">{expense.subject}</td>
              <td className="py-4 px-4">{expense.merchant}</td>
              <td className="py-4 px-4">
                {currency.currencySymbol} {expense.total}
              </td>
              <td className="py-4 px-4">{expense.createdDate}</td>
              <td className="py-4 px-4">{expense.category}</td>
              <td className="py-4 px-4">{expense.description}</td>
              <ClickableTd
                className="py-4 px-4"
                onClick={() =>
                  handleDocumentDownload(expense.id, "Expense", expense.subject)
                }
              >
                <FileOutput />
              </ClickableTd>
              <DeleteTd
                className="py-4 px-4"
                onClick={() => confirm(expense.id)}
              >
                <Trash2 />
              </DeleteTd>
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

const NewExpenseButton = styled.button`
  background-color: #14b8a6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: bold;
  font-size: 0.8rem;
  transition: color 0.5s ease, transform 0.3s ease;

  &:hover {
    background-color: #14b8a6;
    transform: scale(1.1);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
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

const DeleteTd = styled.td`
  color: #ff5733; /* Blue color to indicate it's clickable */
  cursor: pointer; /* Pointer cursor */
  transition: color 0.5s ease, transform 0.3s ease; /* Smooth transitions for color and zoom */
  text-decoration: none; /* No underline by default */

  &:hover {
    color: #dc143c; /* Darker blue on hover */
    text-decoration: underline; /* Underline on hover */
    transform: scale(1.4); /* Slight zoom on hover */
  }
`;
