import { React } from "react";
import styled from "styled-components";
import { NavItems } from "../../../utils/NavItems";
import NavItem from "../Elements/NavItem";
import avatar from "../../../img/avatar.png";
import { LogOut } from "lucide-react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useNavigate } from "react-router-dom";
import { TriangleAlert } from "lucide-react";

function Sidebar({ name = "User" }) {
  const naviagte = useNavigate();

  const accept = () => {
    naviagte("/logout");
  };

  const reject = () => {};

  const confirm1 = () => {
    confirmDialog({
      message: "Are you sure you want to Logout?",
      header: "Logout Confirmation",
      icon: <TriangleAlert />,
      defaultFocus: "accept",
      accept,
      reject,
    });
  };

  return (
    <SidebarStyled>
      <ConfirmDialog />
      <ProfileSection>
        <img src={avatar} alt="Profile" className="profile-pic" />
        <h2>{name}</h2>
        <hr />
      </ProfileSection>
      <nav>
        {NavItems.map((item) => {
          return (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.title}
              url={item.link}
            />
          );
        })}
      </nav>
      <LogoSection>
        <NavItem
          key={10}
          icon={<LogOut />}
          label={"LogOut"}
          url={"#"}
          handleClick={confirm1}
        />
      </LogoSection>
    </SidebarStyled>
  );
}

const SidebarStyled = styled.div`
  width: 16rem;
  background: #1f2937;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    display: none; // Hide sidebar on small screens
  }
`;

const ProfileSection = styled.div`
  align-items: center;
  img.profile-pic {
    border-radius: 50%;
    width: 8rem;
    height: 8rem;
    margin-right: 1rem;
  }
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
  }
`;

const LogoSection = styled.div`
  margin-top: auto;
  img.logo {
    width: 8rem;
  }
`;

export default Sidebar;
