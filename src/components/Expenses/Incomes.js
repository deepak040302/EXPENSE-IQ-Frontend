import React, { useState, useEffect } from "react";
import styled from "styled-components";
import FormHeader from "./Elements/FormHeader";
import { useNavigate } from "react-router-dom";
import { currency } from "../../utils/Currency";
import { handleDownload } from "../../utils/DocumentDownload";
import axios from "axios"; // Import axios
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../Security/AuthProvider";
import { Trash2, FileOutput } from "lucide-react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { TriangleAlert } from "lucide-react";

export default function Incomes() {
  const { logout } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [incomes, setIncomes] = useState([
    {
      id: 35,
      subject: "deepak",
      merchant: "fad",
      category: "Groceries",
      createdDate: "2024-10-10",
      total: 32,
      description: "sf",
      document: null,
    },
  ]); // Initialize state for incomes

  const rowsPerPage = 6;

  const fetchIncomes = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.warn("You are not authenticated!");
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:8081/api/get-incomes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const incomesData = response.data.sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      );
      setIncomes(incomesData);
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
    try {
      fetchIncomes();
    } catch (error) {
      console.log(error);
    }
  }, []);

  // Calculate total number of pages
  const totalPages = Math.ceil(incomes.length / rowsPerPage);

  // Get current rows to display
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = incomes.slice(startIndex, startIndex + rowsPerPage);

  const navigate = useNavigate();

  const handleNewExpenseClick = () => {
    navigate("/new-income");
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

  const handleIncomeDelete = async (incomeId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warn("You are not authenticated!");
      logout();
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8081/api/delete-income/${incomeId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Income Deleted Successfully!!");
        console.log("Income Deleted Successfully!!");
        fetchIncomes();
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
        toast.error("Some Error Occured During Deleting Income");
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
    handleIncomeDelete(incomeId);
  };

  const reject = () => {};

  return (
    <TableContainer>
      <ToastContainer theme="dark" position="top-right" autoClose={1500} />
      <Header>
        <FormHeader title="Incomes" />
        <NewExpenseButton onClick={handleNewExpenseClick}>
          + New Income
        </NewExpenseButton>
      </Header>

      <hr />

      <Table>
        <thead>
          <tr className="text-gray-400 text-sm uppercase">
            <Th>Sr. No.</Th>
            <Th>Income Title</Th>
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
          {currentRows.map((income, index) => (
            <TableRow key={index + 1} index={index}>
              <td className="py-4 px-4">{startIndex + index + 1}</td>
              <td className="py-4 px-4">{income.subject}</td>
              <td className="py-4 px-4">{income.merchant}</td>
              <td className="py-4 px-4">
                {currency.currencySymbol} {income.total}
              </td>
              <td className="py-4 px-4">{income.createdDate}</td>
              <td className="py-4 px-4">{income.category}</td>
              <td className="py-4 px-4">{income.description}</td>
              <ClickableTd
                className="py-4 px-4"
                onClick={() =>
                  handleDocumentDownload(income.id, "Income", income.subject)
                }
              >
                <FileOutput />
              </ClickableTd>
              <DeleteTd
                className="py-4 px-4"
                onClick={() => confirm(income.id)}
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

// Styled Components
const TableContainer = styled.div`
  background: #111827;
  color: white;
  padding: 4%;
  max-width: 100%;
  margin: auto;
  border: 2px solid #4b5563; /* Border color */
  border-radius: 12px; /* Rounded corners */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5); /* Shadow for card effect */
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0px;
`;

const NewExpenseButton = styled.button`
  background-color: #14b8a6; /* Blue-500 */
  color: white;
  border: none;
  border-radius: 8px; /* Rounded corners */
  padding: 10px 20px; /* Padding */
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: bold; /* Make the text bold */
  font-size: 0.8rem;
  transition: color 0.5s ease, transform 0.3s ease;

  &:hover {
    background-color: #14b8a6; /* Blue-600 on hover */
    transform: scale(1.1); /* Slight zoom on hover */
  }

  &:focus {
    outline: none; /* Remove outline */
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); /* Focus ring */
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse; /* Ensures that borders don't double */
`;

const TableRow = styled.tr`
  background: ${({ index }) =>
    index % 2 === 0 ? "#374151" : "#4b5563"}; // gray-800 and gray-850

  td {
    padding: 16px; /* Set row height */
    border: 1px solid #4b5563; /* Border between columns */
  }

  /* Apply single line separator between rows */
  &:not(:last-child) {
    border-bottom: 1px solid #4b5563;
  }
`;

const Th = styled.th`
  padding: 16px; /* Set header cell height */
  border: 1px solid #4b5563; /* Border between columns */
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;

  button {
    background-color: #14b8a6; /* Blue-500 */
    color: white;
    border: none;
    border-radius: 8px; /* Rounded corners */
    padding: 8px 16px; /* Padding */
    cursor: pointer;
    transition: background-color 0.3s;
    margin: 0 10px;

    &:hover {
      background-color: #0f766e; /* Darker blue on hover */
    }

    &:disabled {
      background-color: #4b5563; /* Disabled state color */
      cursor: not-allowed; /* Change cursor for disabled button */
    }
  }

  span {
    color: white; /* Page number text color */
    margin: 0 10px;
  }
`;

const ClickableTd = styled.td`
  color: #14b8a6; /* Blue color to indicate it's clickable */
  cursor: pointer; /* Pointer cursor */
  transition: color 0.5s ease, transform 0.3s ease;
  text-decoration: none; /* No underline by default */

  &:hover {
    color: #0284c7; /* Darker blue on hover */
    text-decoration: underline; /* Underline on hover */
    transform: scale(1.4); /* Slight zoom on hover */
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
