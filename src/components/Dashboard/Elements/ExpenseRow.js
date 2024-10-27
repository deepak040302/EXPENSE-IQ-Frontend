import React from "react";
import styled from "styled-components";
import PropTypes from 'prop-types';


function ExpenseRow({ subject, employee, team, amount }) {
  return (
    <tr>
      <td>{subject}</td>
      <td>{employee}</td>
      <td>
        <TeamBadge color={getTeamColor(team)}>{team}</TeamBadge>
      </td>
      <td>{amount}</td>
    </tr>
  );
}

function getTeamColor(team) {
  const colors = {
    Marketing: "#9333ea",
    Sales: "#dc2626",
    Operations: "#db2777",
    Finance: "#059669",
  };
  return colors[team] || "#6b7280";
}

const TeamBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  background: ${(props) => props.color};
  font-size: 0.875rem;
  color: white;
`;


ExpenseRow.propTypes = {
  subject: PropTypes.string.isRequired,
  employee: PropTypes.string.isRequired,
  team: PropTypes.bool.isRequired,
  amount: PropTypes.bool.isRequired
};

export default ExpenseRow;
