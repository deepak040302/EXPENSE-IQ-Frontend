import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { currency } from '../../utils/Currency';

const CountryCurrencySelector = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [currencySymbol, setCurrencySymbol] = useState('');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  // Handle country selection
  const handleCountryChange = (e) => {
    const country = countries.find((c) => c.name.common === e.target.value);
    setSelectedCountry(country.name.common);
    setCurrencySymbol(country.currencies ? Object.values(country.currencies)[0].symbol : 'N/A');
  };

  // Save symbol (simulating saving to a config file)
  const handleSaveSymbol = () => {
    const configData = {
      country: selectedCountry,
      currencySymbol: currencySymbol,
    };

    // Simulate saving to a file (replace this with actual file saving logic)
    console.log('Saving config data:', JSON.stringify(configData));
    alert(`Saved symbol for ${selectedCountry}: ${currencySymbol}`);

    currency.countryName  = configData.country;
    currency.currencySymbol = configData.currencySymbol;

    console.log("hbad " , currency)
  };

  return (
    <Container>
      <h1>Select a Country</h1>
      <Select onChange={handleCountryChange}>
        <option value="">-- Select Country --</option>
        {countries.map((country) => (
          <option key={country.cca3} value={country.name.common}>
            {country.name.common}
          </option>
        ))}
      </Select>

      {currencySymbol && (
        <SymbolContainer>
          <p>Currency Symbol: {currencySymbol}</p>
          <button onClick={handleSaveSymbol}>Save Symbol</button>
        </SymbolContainer>
      )}
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: auto;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ced4da;
  border-radius: 4px;
`;

const SymbolContainer = styled.div`
  margin-top: 20px;

  button {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 10px 15px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #0056b3;
    }
  }
`;

export default CountryCurrencySelector;
