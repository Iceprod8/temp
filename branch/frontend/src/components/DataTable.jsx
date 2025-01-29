import React from "react";
import PropTypes from "prop-types";
import { DataGridPro } from "@mui/x-data-grid-pro";

/**
 * Composant DataTable générique sans styles en ligne
 * @param {Array} columns - Liste des colonnes pour la grille.
 * @param {Array} rows - Liste des données à afficher dans la grille.
 * @param {Function} onRowClick - (Optionnel) Fonction appelée lors du clic sur une ligne.
 * @param {Object} gridProps - (Optionnel) Props supplémentaires pour la DataGrid.
 */
export default function DataTable({ columns, rows, onRowClick, gridProps }) {
  // Validation des colonnes pour s'assurer que les configurations sont correctes
  const validatedColumns = columns.map((col) => ({
    ...col,
    renderCell: (params) => {
      if (!params.row) return "N/A";
      if (typeof col.renderCell === "function") {
        const cellContent = col.renderCell(params);
        return React.isValidElement(cellContent)
          ? cellContent
          : String(cellContent || "");
      }
      return params.value || "";
    },
    valueGetter: (params) => {
      if (!params.row) return null;
      return typeof col.valueGetter === "function"
        ? col.valueGetter(params)
        : params.row[col.field];
    },
    valueFormatter: (params) => {
      if (!params.value) return "";
      return typeof col.valueFormatter === "function"
        ? col.valueFormatter(params)
        : String(params.value || "");
    },
  }));

  return (
    <div className="data-table-container">
      <DataGridPro
        columns={validatedColumns}
        rows={rows}
        onRowClick={onRowClick}
        disableColumnMenu
        disableSelectionOnClick
        autoHeight
        {...gridProps}
        sx={{
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f5f5f5",
            fontWeight: "bold",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#f9f9f9",
          },
        }}
      />
    </div>
  );
}

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      headerName: PropTypes.string.isRequired,
      flex: PropTypes.number,
      renderCell: PropTypes.func,
      valueGetter: PropTypes.func,
      valueFormatter: PropTypes.func,
    }),
  ).isRequired,
  rows: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onRowClick: PropTypes.func,
  gridProps: PropTypes.shape({}),
};

DataTable.defaultProps = {
  onRowClick: null,
  gridProps: {},
};
