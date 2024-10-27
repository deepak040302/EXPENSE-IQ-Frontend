import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

export default function NavItem({ icon, label, url, handleClick }) {
  return (
    <NavItemStyled label={label} onClick={handleClick}>
      <NavLink
        to={url}
        className={({ isActive }) =>
          isActive ? "nav-link active" : "nav-link"
        }
      >
        {icon}
        <span>{label}</span>
      </NavLink>
    </NavItemStyled>
  );
}

const NavItemStyled = styled.div`
  .nav-link {
    display: flex;
    align-items: center;
    padding: 0.7rem;
    margin-bottom: 1rem;
    border-radius: 0.5rem;
    color: #fff;
    text-decoration: none;
    font-size: 1rem;

    &:hover {
      background-color: #14b8a6;
    }

    span {
      margin-left: 1rem;
    }
  }

  .active {
    background-color: #14b8a6; /* bg-teal-500 in Tailwind */
  }

  /* Additional styles for the LogOut label */
  ${({ label }) =>
    label === "LogOut" &&
    `
    .nav-link {
      background-color: #1f2937; /* Example color for LogOut */
      color: #fff; /* Ensure text color is white */
      font-weight: bold; /* Make text bold for emphasis */

      &:hover {
        background-color: #b22234; /* Darker shade on hover for LogOut */
      }
    }
  `}
`;
