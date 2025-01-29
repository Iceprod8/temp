import React from "react";
import { useTranslation } from "react-i18next";
import { DataGridPro, GridToolbar } from "@mui/x-data-grid-pro";
import CustomNoRowsOverlay from "@inplan/common/CustomNoRowsOverlay";
import { mainColor } from "@inplan/common/Form/styles";

const DataGridProLicenses = ({
  columns,
  userLicenses,
  selectedRows,
  setSelectedRows,
}) => {
  const { t: translation } = useTranslation();
  return (
    <div className="dashboard-table-container">
      <DataGridPro
        columns={columns}
        rows={userLicenses}
        checkboxSelection
        components={{
          NoRowsOverlay: CustomNoRowsOverlay,
          Toolbar: GridToolbar,
        }}
        pagination
        paginationMode="client"
        onSelectionModelChange={(rowsIds) => {
          setSelectedRows(rowsIds);
        }}
        selectionModel={selectedRows}
        componentsProps={{
          row: { "data-test": "row-lab" },
          cell: { "data-test": "cell-lab" },
          pagination: {
            labelRowsPerPage: `${translation(
              "utilities.DataGridPro.pagination.labelRowsPerPage"
            )}:`,
            labelDisplayedRows: ({ from, to, count }) =>
              `${translation(
                "utilities.DataGridPro.pagination.labelDisplayedRows",
                {
                  from,
                  to,
                  count,
                }
              )}`,
          },
        }}
        autoHeight
        getRowClassName={(params) => {
          const className = "order-in-progress-allrows";
          return className;
        }}
        sx={{
          "& svg[data-value='true']": { fill: mainColor },
          width: "100%",
        }}
      />
    </div>
  );
};

export default DataGridProLicenses;
