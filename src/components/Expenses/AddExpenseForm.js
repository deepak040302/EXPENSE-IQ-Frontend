import React, { useState } from "react";
import styled from "styled-components";
import FormHeader from "./Elements/FormHeader";
import FormInputGroup from "./Elements/FormInputGroup";
import FileUpload from "./Elements/FileUpload";
import FormButtons from "./Elements/FormButtons";
import { ExpenseCategory } from "../../utils/ExpenseCategory";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../Security/AuthProvider";

export default function AddExpenseForm() {
  const { logout } = useAuth();
  const API_URL = `${process.env.REACT_APP_API_URL}`;

  const initialFormData = {
    subject: "",
    merchant: "",
    createdDate: "",
    total: "",
    category: "",
    description: "",
    document: null, // Set to null for file uploads
  };

  const [formData, setFormData] = useState(initialFormData);
  const [resetFile, setResetFile] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.warn("You are not authenticated!");
      return;
    }

    const formPayload = {
      subject: formData.subject || "", // Ensure these values are strings
      merchant: formData.merchant || "",
      createdDate: formData.createdDate || "",
      total: formData.total || "",
      category: formData.category || "",
      description: formData.description || "",
    };

    // Convert document to Base64 if it exists
    if (formData.document) {
      const base64Document = await convertToBase64(formData.document);
      formPayload.document = base64Document;
    }

    try {
      const response = await fetch(`${API_URL}/api/add-expense`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formPayload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Form submitted successfully:", result);
        toast.success("Expense Added Successfully!");

        // Reset the form after successful submission
        setFormData(initialFormData);
        setResetFile(true);
      } else {
        const errorResponse = await response.text();
        console.error("Error submitting the form", response.statusText);
        console.error("Error submitting the form", errorResponse);
        toast.error("Error submitting the form");
      }
    } catch (error) {
      console.error("Network error:", error);
      if (error.response && error.response.status === 401) {
        toast.error("Unauthorized - Please Login or SignUp to access.");
        logout();
      } else {
        console.log("An error occurred:", error);
        toast.error("Some Error Occured");
      }
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <FormContainer>
      <ToastContainer theme="dark" position="top-right" autoClose={1500} />

      <FormHeader title="New Expense" />
      <hr />
      <Form onSubmit={handleSubmit} style={{ paddingTop: "5%" }}>
        <FormColumn>
          <FormInputGroup
            formData={formData}
            handleInputChange={handleInputChange}
            categoryFeilds={ExpenseCategory}
          />
        </FormColumn>
        <FileUpload
          formData={formData}
          setFormData={setFormData}
          resetFile={resetFile}
        />
        <FormButtons />
      </Form>
    </FormContainer>
  );
}

const FormContainer = styled.div`
  background: #111827;
  color: white;
  padding: 4%;
  max-width: 100%;
  margin: auto;
  border: 2px solid #4b5563;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
`;

const FormColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;
