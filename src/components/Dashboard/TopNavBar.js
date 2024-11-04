// TopNavBar.js
import React, { useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import avatar from "../../img/avatar.png";
import { Avatar } from "primereact/avatar";
import { Menu } from "lucide-react";
import { TieredMenu } from "primereact/tieredmenu";
import { LogOut } from "lucide-react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useNavigate } from "react-router-dom";
import { TriangleAlert, Settings, Users } from "lucide-react";

const TopNavBar = ({ companyName, userImage, userName }) => {
  const naviagte = useNavigate();

  const accept = () => {
    naviagte("/logout");
  };

  const reject = () => {};

  const confirm = () => {
    console.log("hertyhhbkk");

    confirmDialog({
      message: "Are you sure you want to Logout?",
      header: "Logout Confirmation",
      icon: <TriangleAlert />,
      defaultFocus: "accept",
      accept,
      reject,
    });
  };

  const menu = useRef(null);

  const menuItems = [
    {
      template: () => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar image={userImage || avatar} size="large" shape="circle" />
          <span style={{ marginLeft: "0.5rem", fontWeight: "bold" }}>
            {userName}
          </span>
        </div>
      ),
    },
    {
      separator: true,
    },
    {
      template: () => (
        <div
          style={{ display: "flex", height: "3rem", alignItems: "center" }}
          onClick={() => naviagte("/settings")}
        >
          <Settings style={{ marginLeft: "1rem" }} />
          <span style={{ marginLeft: "1rem", fontWeight: "bold" }}>
            Settings
          </span>
        </div>
      ),
    },
    {
      separator: true,
    },
    {
      template: () => (
        <div
          style={{ display: "flex", height: "3rem", alignItems: "center" }}
          onClick={() => naviagte("/support")}
        >
          <Users style={{ marginLeft: "1rem" }} />
          <span style={{ marginLeft: "1rem", fontWeight: "bold" }}>
            Support
          </span>
        </div>
      ),
    },
    {
      separator: true,
    },
    {
      template: () => (
        <div
          style={{ display: "flex", height: "3rem", alignItems: "center" }}
          onClick={confirm}
        >
          <LogOut style={{ marginLeft: "1rem" }} />
          <span style={{ marginLeft: "1rem", fontWeight: "bold" }}>LogOut</span>
        </div>
      ),
    },
  ];

  return (
    <TopNavBarStyled>
      <ConfirmDialog />
      <div className="company-name">{companyName}</div>
      <div className="menu-icon" onClick={(e) => menu.current.toggle(e)}>
        <Menu className="menu-bar" />
      </div>
      <TieredMenuStyled model={menuItems} popup ref={menu} />
    </TopNavBarStyled>
  );
};

TopNavBar.propTypes = {
  companyName: PropTypes.string.isRequired,
  userImage: PropTypes.string,
  userName: PropTypes.string.isRequired,
};

export default TopNavBar;

// Styled Components
const TopNavBarStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #1f2937;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 1000;

  .company-name {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .menu-icon {
    position: relative;
    cursor: pointer;
  }

  .menu-bar {
    transition: color 0.5s ease, transform 0.5s ease;
    &:hover {
      transform: scale(1.5);
    }
  }
`;

const TieredMenuStyled = styled(TieredMenu)`
  margin-left: 0rem; /* Adjust this value to position the menu to the left */
  margin-top: 0.5rem;
  z-index: 1010;
`;
