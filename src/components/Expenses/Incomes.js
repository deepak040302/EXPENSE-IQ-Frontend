import React, { useState, useEffect } from "react";
import styled from "styled-components";
import FormHeader from "./Elements/FormHeader";
import { useNavigate } from "react-router-dom";
import { currency } from "../../utils/Currency";
import { handleDownload } from "../../utils/DocumentDownload";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../Security/AuthProvider";
import { Trash2, FileOutput } from "lucide-react";
import { confirmDialog } from "primereact/confirmdialog";
import { TriangleAlert } from "lucide-react";
import CustomDataTable from "./CustomDataTable";

export default function Incomes() {
  const { logout } = useAuth();
  const [incomes, setIncomes] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(true);
  const API_URL = `${process.env.REACT_APP_API_URL}`;

  const fetchIncomes = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warn("You are not authenticated!");
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/api/get-incomes`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const incomesData = response.data.sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      );
      setIncomes(incomesData);
      setIsDataLoaded(false);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Unauthorized - Please Login or SignUp to access.");
        logout();
      } else {
        toast.error("Network error: Backend server not reachable");
      }
      console.error("Error fetching transactions:", error);
    }
  };

  // eslint-disable-next-line
  useEffect(() => {fetchIncomes();}, []);

  const navigate = useNavigate();
  const handleNewExpenseClick = () => navigate("/new-income");

  const handleDocumentDownload = (id, transactionType, fileName) => {
    handleDownload(id, transactionType, fileName)
      .then((result) =>
        result
          ? toast.success("Download successful")
          : toast.warning("No Document Uploaded")
      )
      .catch(() =>
        toast.error("An error occurred while downloading document.")
      );
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
        `${API_URL}/api/delete-income/${incomeId}`,
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

  const confirmDelete = (incomeId) => {
    console.log("err " + incomeId);

    confirmDialog({
      message: "Are you sure you want to delete?",
      header: "Delete Confirmation",
      icon: <TriangleAlert />,
      accept: () => handleIncomeDelete(incomeId),
    });
  };

  const renderDeleteButton = (rowData) => (
    <DeleteTd onClick={() => confirmDelete(rowData.id)}>
      <Trash2 />
    </DeleteTd>
  );

  const renderDownloadButton = (rowData) => (
    <ClickableTd
      onClick={() =>
        handleDocumentDownload(rowData.id, "Income", rowData.subject)
      }
    >
      <FileOutput />
    </ClickableTd>
  );

  return (
    <TableContainer>
      <ToastContainer theme="dark" position="top-right" autoClose={1500} />
      <Header>
        <FormHeader title="Incomes" />
        <NewIncomeButton onClick={handleNewExpenseClick}>
          + New Income
        </NewIncomeButton>
      </Header>

      <hr />

      <CustomDataTable
        value={incomes}
        isDataLoaded={isDataLoaded}
        emptyMessage="No Income Data Available !!"
        renderDownloadButton={renderDownloadButton}
        renderDeleteButton={renderDeleteButton}
        currency={currency.currencySymbol}
      />
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
  border: 2px solid #4b5563;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    padding: 2%;
    border: 1px solid #4b5563;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const NewIncomeButton = styled.button`
  background-color: #14b8a6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.8rem;
  transition: color 0.5s ease, transform 0.3s ease;

  &:hover {
    background-color: #14b8a6;
    transform: scale(1.03);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }

  @media (max-width: 768px) {
    width: 100%;
    margin-top: 10px;
    padding: 8px;
    font-size: 1rem;
    height: 3rem;
  }
`;

const ClickableTd = styled.div`
  color: #14b8a6;
  cursor: pointer;
  transition: color 0.5s ease, transform 0.3s ease;

  &:hover {
    color: #0284c7;
    transform: scale(1.4);
  }
`;

const DeleteTd = styled.div`
  color: #ff5733;
  cursor: pointer;
  transition: color 0.5s ease, transform 0.3s ease;

  &:hover {
    color: #dc143c;
    transform: scale(1.4);
  }
`;
