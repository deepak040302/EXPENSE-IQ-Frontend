// CustomDataTable.js
import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import styled from "styled-components";
import "./CustomDataTable.css";

const CustomDataTable = ({
  value,
  isDataLoaded,
  emptyMessage,
  renderDownloadButton,
  renderDeleteButton,
  currency,
}) => {
  return (
    <StyledDataTable
      value={value}
      paginator={true}
      rows={6}
      tableClassName="custom-table"
      showGridlines={true}
      loading={isDataLoaded}
      emptyMessage={emptyMessage}
      loadingIcon={<ProgressSpinner />}
      removableSort
      scrollable
    >
      <Column
        field="id"
        header="Sr. No."
        body={(rowData, { rowIndex }) => rowIndex + 1}
        headerStyle={headerStyle}
        sortable
        frozen
      />
      <Column
        field="subject"
        header="Income Title"
        headerStyle={headerStyle}
        sortable
      />
      <Column
        field="merchant"
        header="Merchant"
        headerStyle={headerStyle}
        sortable
      />
      <Column
        field="total"
        header="Amount"
        body={(rowData) => `${currency} ${rowData.total}`}
        headerStyle={headerStyle}
        sortable
      />
      <Column
        field="createdDate"
        header="Date"
        headerStyle={headerStyle}
        sortable
      />
      <Column
        field="category"
        header="Category"
        headerStyle={headerStyle}
        sortable
      />
      <Column
        field="description"
        header="Description"
        headerStyle={headerStyle}
      />
      <Column
        header="Invoice"
        body={renderDownloadButton}
        headerStyle={headerStyle}
      />
      <Column
        header="Delete"
        body={renderDeleteButton}
        headerStyle={headerStyle}
      />
    </StyledDataTable>
  );
};

// Styled Components
const StyledDataTable = styled(DataTable)`
  // Add any custom styling for your DataTable here
`;

const headerStyle = { backgroundColor: "#111827", color: "white" };

export default CustomDataTable;
