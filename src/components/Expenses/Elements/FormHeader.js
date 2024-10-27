import React from "react";
import styled from "styled-components";

export default function FormHeader({ title }) {
  return (
    <FormHeaderContainer>
      <h1>{title}</h1>
    </FormHeaderContainer>
  );
}

const FormHeaderContainer = styled.div`
  margin-top: 0rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;