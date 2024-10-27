import React from "react";
import styled from "styled-components";

function QuickAccessButton({ icon, label, color , onClick }) {
  return (
    <QuickAccessButtonStyled color={color} onClick={onClick}>
      {icon}
      <span>{label}</span>
    </QuickAccessButtonStyled>
  );
}

const QuickAccessButtonStyled = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border-radius: 0.75rem;
  background: ${(props) => props.color};
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
  span {
    margin-left: 0.5rem;
  }
`;

export default QuickAccessButton;
