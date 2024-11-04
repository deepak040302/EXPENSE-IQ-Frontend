// TopNavBar.js
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import avatar from "../../img/avatar.png";

const TopNavBar = ({ companyName, userImage }) => {
    return (
        <TopNavBarStyled>
            <div className="company-name">{companyName}</div>
            <div className="user-image">
                <img src={avatar} alt="User" />
            </div>
        </TopNavBarStyled>
    );
};

TopNavBar.propTypes = {
    companyName: PropTypes.string.isRequired,
    userImage: PropTypes.string.isRequired,
};

export default TopNavBar;

// Styled Components
const TopNavBarStyled = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1rem;
    background-color: #111827;
    color: white;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    z-index: 1000; /* Ensure it is above other content */
    margin: 0rem 10rem 0rem 0rem;

    .company-name {
        font-size: 1.5rem;
        font-weight: bold;
    }

    .user-image {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
`;
