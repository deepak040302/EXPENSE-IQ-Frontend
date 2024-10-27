import styled from "styled-components";
import PropTypes from "prop-types";
import Sidebar from "../Dashboard/Elements/Sidebar";
import { Outlet } from "react-router-dom";

// Layout component with Sidebar and main content
const DashboardLayout = ({ name }) => (
  <DashboardStyled>
    <Sidebar name={name} />
    <MainContentStyled>
      <Outlet />
    </MainContentStyled>
  </DashboardStyled>
);

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
  padding: 2rem;
  overflow-y: auto;
`;

DashboardLayout.propTypes = {
  name: PropTypes.string.isRequired,
};
