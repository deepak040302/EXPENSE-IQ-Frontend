import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Sidebar from "../Dashboard/Elements/Sidebar";
import BottomNavBar from "./BottomNavBar";
import TopNavBar from "./TopNavBar";
import { Outlet } from "react-router-dom";

const DashboardLayout = ({ name, userImage }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <DashboardStyled>
      {isMobile && (
        <TopNavBar
          companyName="EXPENSE-IQ"
          userImage={userImage}
          userName={name}
        />
      )}
      {isMobile ? <BottomNavBar /> : <Sidebar name={name} />}
      <MainContentStyled>
        <Outlet />
      </MainContentStyled>
    </DashboardStyled>
  );
};

export default DashboardLayout;

// Styled Components
const DashboardStyled = styled.div`
  display: flex;
  height: 100vh;
  background: #111827;
  color: white;
`;

const MainContentStyled = styled.div`
  flex: 1;
  margin-top: 3rem;
  padding: 0rem 2rem 2rem 2rem;
  overflow-y: auto;

  @media (max-width: 768px) {
    /* Adjust the breakpoint as needed */
    padding: 2.5rem; /* Change padding for smaller screens */
  }
`;

DashboardLayout.propTypes = {
  name: PropTypes.string.isRequired,
  userImage: PropTypes.string.isRequired,
};
