import React from 'react'
import styled from "styled-components";
import PropTypes from 'prop-types';

function TaskItem({ icon, label, value }) {
    return (
      <TaskItemStyled>
        <div className="task-info">
          {icon}
          <span>{label}</span>
        </div>
        <span className="task-value">{value}</span>
      </TaskItemStyled>
    );
}

const TaskItemStyled = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  .task-info {
    display: flex;
    align-items: center;
  }
  .task-info span {
    margin-left: 0.75rem;
  }
  .task-value {
    font-weight: 600;
  }
`;

TaskItem.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired
};

export default TaskItem;