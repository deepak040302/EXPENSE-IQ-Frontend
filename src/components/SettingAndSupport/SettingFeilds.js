import { SettingInputField } from "../Expenses/Elements/InputComponents";
import React, { useState } from "react";
import styled from "styled-components";

export default function SettingsFeilds({ userData, setUserData, countries }) {
  const [editableField, setEditableField] = useState(null);

  const handleChange = (fieldName) => {
    setEditableField(fieldName);
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;

    const countryData = countries.find(
      (country) => country.name.common === selectedCountry
    );

    if (countryData) {
      const currencySymbol = countryData.currencies
        ? Object.keys(countryData.currencies)[0]
        : userData.currencySymbol; // Fallback in case no currency data

      setUserData({
        ...userData,
        country: selectedCountry,
        currencySymbol: currencySymbol,
      });
    }
  };

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSettingFormSubmit = (e) => {
    e.preventDefault();

    const payload = {
      fullName: userData.fullName,
      email: userData.email,
      username: userData.username,
      country: userData.country,
      currencySymbol: userData.currencySymbol,
    };

    console.log(payload);
    

    console.log("final" + userData.fullName);
  };

  return (
    <FormContainer>
      <SettingInputField
        label="Full Name"
        name="fullName"
        value={userData.fullName}
        onChange={handleInputChange}
        readOnly={editableField !== "fullName"}
        handleChangeButton={() => handleChange("fullName")}
        required
      />

      <SettingInputField
        label="Username"
        name="username"
        value={userData.username}
        onChange={handleInputChange}
        readOnly={editableField !== "username"}
        handleChangeButton={() => handleChange("username")}
        required
      />

      <SettingInputField
        label="Email"
        name="email"
        value={userData.email}
        onChange={handleInputChange}
        readOnly={editableField !== "email"}
        handleChangeButton={() => handleChange("email")}
        required
      />

      <SettingInputField
        label="Country"
        name="country"
        value={userData.country}
        onChange={handleCountryChange}
        readOnly={editableField !== "country"}
        isDropdown={editableField === "country"}
        handleChangeButton={() => handleChange("country")}
        countries={countries}
        required
      />

      <SettingInputField
        label="Currency Symbol"
        name="currencySymbol"
        value={userData.currencySymbol}
        onChange={handleInputChange}
        readOnly={editableField !== "currencySymbol"}
        handleChangeButton={() => handleChange("currencySymbol")}
        required
      />

      <ChangeButton onClick={handleSettingFormSubmit}>Change</ChangeButton>
    </FormContainer>
  );
}

const ChangeButton = styled.div`
  background: #4b5563;
  color: #14b8a6;
  padding: 0.5rem 1rem;
  margin-left: 10px;
  border-radius: 0.375rem;
  font-weight: bold;
  &:hover {
    background: #14b8a6;
    color: black;
    font-weight: bold;
  }
  cursor: pointer;

  &:hover {
    background-color: #14b8a6;
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Space between input fields */
`;
