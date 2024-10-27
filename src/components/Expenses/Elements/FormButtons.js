import React from "react";
import styled from "styled-components";

export default function FormButtons() {
  return (
    <ButtonGroup>
      <Button type="submit">Save</Button>
    </ButtonGroup>
  );
}

const ButtonGroup = styled.div`
  grid-column: span 2;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const Button = styled.button`
  background: #4b5563;
  color: #14b8a6;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: bold;
  &:hover {
    background: #14b8a6;
    color: black;
    font-weight: bold;
  }
`;
