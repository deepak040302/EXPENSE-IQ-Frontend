import React, { useState, useEffect } from "react";
import styled from "styled-components";
import FormHeader from "./Elements/FormHeader";
import { useNavigate } from "react-router-dom";
import { currency } from "../../utils/Currency";
import { handleDownload } from "../../utils/DocumentDownload";
import { confirmDialog } from "primereact/confirmdialog";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FileOutput, Trash2 } from "lucide-react";
import { useAuth } from "../Security/AuthProvider";
import { TriangleAlert } from "lucide-react";
import CustomDataTable from "./CustomDataTable";

export default function Expenses() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isDataLoaded, setIsDataLoaded] = useState(true);
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
      setIsDataLoaded(false);
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

  const handleNewExpenseClick = () => navigate("/new-expense");

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

  const confirmDelete = (incomeId) => {
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

  const renderDeleteButton = (rowData) => (
    <DeleteTd onClick={() => confirmDelete(rowData.id)}>
      <Trash2 />
    </DeleteTd>
  );

  const renderDownloadButton = (rowData) => (
    <ClickableTd
      onClick={() =>
        handleDocumentDownload(rowData.id, "Expense", rowData.subject)
      }
    >
      <FileOutput />
    </ClickableTd>
  );

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

      <CustomDataTable
        value={expenses}
        isDataLoaded={isDataLoaded}
        emptyMessage="No Expense Data Available !!"
        renderDownloadButton={renderDownloadButton}
        renderDeleteButton={renderDeleteButton}
        currency={currency.currencySymbol}
      />
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
