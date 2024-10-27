import { InputField, SelectField } from "./InputComponents";
import React from "react";
import styled from "styled-components";

export default function FormInputGroup({
  formData,
  handleInputChange,
  categoryFeilds,
}) {
  return (
    <FormContainer>
      <InputField
        label="Subject"
        name="subject"
        value={formData.subject}
        onChange={handleInputChange}
        required
      />
      <InputField
        label="Merchant"
        name="merchant"
        value={formData.merchant}
        onChange={handleInputChange}
        required
      />
      <InputField
        label="Date"
        name="createdDate"
        type="date"
        value={formData.createdDate}
        onChange={handleInputChange}
        required
      />
      <InputField
        label="Total"
        name="total"
        type="number"
        value={formData.total}
        onChange={handleInputChange}
        required
      />

      <SelectField
        label="Category"
        name="category"
        value={formData.category}
        categoryFeilds={categoryFeilds}
        onChange={handleInputChange}
      />
      <InputField
        label="Description"
        name="description"
        as="textarea"
        rows={3}
        value={formData.description}
        onChange={handleInputChange}
      />
    </FormContainer>
  );
}

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Space between input fields */
`;
