// TopNavBar.js
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const TopNavBar = ({ companyName = "EXPENSE-IQ" }) => {
  return (
    <TopNavBarStyled>
      <div className="company-name">{companyName}</div>
    </TopNavBarStyled>
  );
};

TopNavBar.propTypes = {
  companyName: PropTypes.string.isRequired,
};

export default TopNavBar;

// Styled Components
const TopNavBarStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: -webkit-linear-gradient(left, #F5E3E6 , #D9E4F5);

  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;

  .company-name {
    font-size: 1.5rem;
    font-weight: bold;
    color: #0059b3;

    cursor: pointer;
    transition: color 0.5s ease, transform 0.5s ease;

    &:hover {
      transform: scale(1.1);
      color: #3b82f6;
    }
  }

  .menu-icon {
    position: relative;
    cursor: pointer;
  }

  .menu-bar {
    transition: color 0.5s ease, transform 0.5s ease;
    color: #14b8a6;
    &:hover {
      transform: scale(1.5);
      color: #3b82f6;
    }
  }
`;
