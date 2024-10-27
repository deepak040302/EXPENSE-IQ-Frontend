import React from "react";
import styled from "styled-components";
import FormButtons from "./FormButtons";

export function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  as = "input",
  rows = 1,
  readOnly,
}) {
  return (
    <InputWrapper>
      <Label htmlFor={name}>
        {label}
        {required}
      </Label>

      <StyledInput
        as={as}
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        readOnly={readOnly}
      />
    </InputWrapper>
  );
}

export function SelectField({ label, name, value, categoryFeilds, onChange }) {
  return (
    <SelectWrapper>
      <label>{label}</label>
      <select name={name} value={value} onChange={onChange}>
        <option value="" disabled>
          Select Category
        </option>
        {categoryFeilds.map((items) => (
          <option key={items.id} value={items.title}>
            {items.title}
          </option>
        ))}
      </select>
    </SelectWrapper>
  );
}

export function SelectFieldCountry({
  label,
  name,
  value,
  countries,
  onChange,
}) {
  return (
    <SelectWrapper>
      <label>{label}</label>
      <select name={name} value={value} onChange={onChange}>
        <option value="" disabled>
          Select Category
        </option>
        {countries.map((country) => (
          <option key={country.cca3} value={country.name.common}>
            {country.name.common}
          </option>
        ))}
      </select>
    </SelectWrapper>
  );
}

export function SettingInputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  as = "input",
  rows = 1,
  readOnly,
  isDropdown = false,
  handleChangeButton,
  countries = [],
}) {
  return (
    <InputWrapper>
      <Label htmlFor={name}>
        {label}
        {required}
      </Label>

      {!isDropdown ? (
        <StyledInput
          as={as}
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          rows={rows}
          readOnly={readOnly}
          className={readOnly ? "" : "editable"} // Add class for editable fields
        />
      ) : (
        <StyledSelect id={name} name={name} value={value} onChange={onChange} className="editable">
          {countries.map((country) => (
            <option key={country.cca3} value={country.name.common}>
              {country.name.common}
            </option>
          ))}
        </StyledSelect>
      )}

      <ChangeButton onClick={handleChangeButton}>Change</ChangeButton>
    </InputWrapper>
  );
}

const StyledSelect = styled.select`
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 0.375rem;
  padding: 0.5rem;
  color: white;
  flex: 1; /* Allow the input to take up the remaining space */

  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;

  &:focus {
    border-color: black;
    background-color: #1f2937;
  }

  &.editable {
    // background-color: ; /* Light blue background to indicate editability */
    border-color: #14b8a6; /* Blue border color when editable */
  }
`;

const StyledInput = styled.input`
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 0.375rem;
  padding: 0.5rem;
  color: white;
  flex: 1; /* Allow the input to take up the remaining space */

  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;

  &.editable {
    // background-color: ; /* Light blue background to indicate editability */
    border-color: #14b8a6; /* Blue border color when editable */
  }
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center; /* Align items vertically centered */
  label {
    color: #9ca3af;
    margin-bottom: 0; /* Remove bottom margin for label */
    width: 30%; /* Adjust width of label to align with input */
    color: white;
  }
  position: relative;
`;

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

const Label = styled.label`
  width: 30%; /* Adjust label width to keep consistent alignment */
`;

const SelectWrapper = styled.div`
  display: flex;
  align-items: center; /* Align items vertically centered */
  label {
    color: #9ca3af;
    margin-bottom: 0; /* Remove bottom margin for label */
    width: 30%; /* Adjust width of label to align with input */
    color: white;
  }

  select {
    appearance: none;
    background: #1f2937;
    border: 1px solid #374151;
    border-radius: 0.375rem;
    padding: 0.5rem;
    color: white;
  }
`;
