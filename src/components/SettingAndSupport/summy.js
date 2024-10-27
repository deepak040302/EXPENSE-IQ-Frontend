import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const SettingsContainer = styled.div`
  padding: 20px;
  background-color: ${({ theme }) => theme.backgroundColor};
  color: ${({ theme }) => theme.textColor};
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.primaryColor};
  margin-bottom: 20px;
  text-align: center;
`;

const Section = styled.div`
  margin-bottom: 30px;
  padding: 15px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 8px;
`;

const SectionTitle = styled.h3`
  margin-bottom: 15px;
  font-size: 18px;
`;

const FieldContainer = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;

  &:focus {
    border-color: ${({ theme }) => theme.primaryColor};
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 4px;
  font-size: 14px;
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: ${({ theme }) => theme.buttonColor};
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.buttonHoverColor};
  }

  &:not(:last-child) {
    margin-right: 10px;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SettingsPage = () => {
  const [userData, setUserData] = useState(null);
  const [countries, setCountries] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('');

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/settings'); // Replace with your API endpoint
      const data = await response.json();
      setUserData(data);
      setSelectedCurrency(data.currency);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all');
      const data = await response.json();
      setCountries(data);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchCountries();
  }, []);

  const handleSaveChanges = () => {
    // Logic to save changes (e.g., update user settings)
    console.log('Save changes:', { userData, selectedCurrency });
  };

  const handleDeleteAccount = () => {
    // Logic to delete user account
    console.log('Account deleted');
  };

  if (!userData) {
    return <p>Loading...</p>; // Or a loader component
  }

  return (
    <SettingsContainer>
      <Title>Settings</Title>

      <Section>
        <SectionTitle>Account Settings</SectionTitle>
        <FieldContainer>
          <Label htmlFor="fullName">Full Name:</Label>
          <Input
            id="fullName"
            type="text"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            placeholder="Enter full name"
          />
        </FieldContainer>

        <FieldContainer>
          <Label htmlFor="username">Username:</Label>
          <Input
            id="username"
            type="text"
            value={userData.username}
            onChange={(e) => setUserData({ ...userData, username: e.target.value })}
            placeholder="Enter username"
          />
        </FieldContainer>

        <FieldContainer>
          <Label htmlFor="email">Email:</Label>
          <Input
            id="email"
            type="email"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            placeholder="Enter email"
          />
        </FieldContainer>

        <ActionsContainer>
          <Button onClick={() => console.log('Change Password')}>Change Password</Button>
          <Button onClick={handleDeleteAccount}>Delete Account</Button>
        </ActionsContainer>
      </Section>

      <Section>
        <SectionTitle>Currency Settings</SectionTitle>
        <FieldContainer>
          <Label htmlFor="currentSymbol">Current Symbol:</Label>
          <div id="currentSymbol">{selectedCurrency}</div>
        </FieldContainer>

        <FieldContainer>
          <Label htmlFor="currency">Select Currency:</Label>
          <Select
            id="currency"
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
          >
            <option value="">Select a currency</option>
            {countries.map((country) => (
              <option key={country.cca3} value={country.currencies[0].code}>
                {country.name.common} - {country.currencies[0].name}
              </option>
            ))}
          </Select>
        </FieldContainer>
      </Section>

      <ActionsContainer>
        <Button onClick={handleSaveChanges}>Save Changes</Button>
        <Button onClick={() => console.log('Cancel')}>Cancel</Button>
      </ActionsContainer>
    </SettingsContainer>
  );
};

export default SettingsPage;
