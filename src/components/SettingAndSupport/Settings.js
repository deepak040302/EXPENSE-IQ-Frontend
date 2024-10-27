import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormHeader from "../Expenses/Elements/FormHeader";
import SettingsFeilds from "./SettingFeilds";

const Settings = () => {
  const [userData, setUserData] = useState({
    fullName: "deepak",
    username: "chiku",
    email: "abc@gmail.com",
    country: "India",
    currencySymbol: "₹",
  });

  const [countries, setCountries] = useState([]);

  const fetchUserData = async () => {
    try {
      // const response = await fetch('/api/user/settings'); // Replace with your API endpoint
      // const data = await response.json();
      // setUserData({
      //   fullName: "deepak",
      //   username: "chiku",
      //   email: "abc@gmail.com",
      //   currency: "$$",
      //   country: "IN",
      // });

      console.log(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await fetch("https://restcountries.com/v3.1/all");
      const data = await response.json();
      setCountries(data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchCountries();
  }, []);

  return (
    <FormContainer>
      <ToastContainer theme="dark" position="top-right" autoClose={1500} />

      <FormHeader title="Settings" />
      <hr />
      <Form style={{ paddingTop: "5%" }}>
        <FormColumn>
          <SettingsFeilds
            userData={userData}
            setUserData={setUserData}
            countries={countries}
          />
        </FormColumn>
      </Form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  background: #111827;
  color: white;
  padding: 4%;
  max-width: 100%;
  margin: auto;
  border: 2px solid #4b5563; /* Border color */
  border-radius: 12px; /* Rounded corners */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5); /* Shadow for card effect */
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

export default Settings;
