import React from "react";
import { DataGridPro } from "@mui/x-data-grid-pro";

export default function Test() {
  // Données fictives
  const rows = [
    { id: 1, col1: "Hello", col2: "World", col3: "2023" },
    { id: 2, col1: "DataGridPro", col2: "is", col3: "Awesome" },
    { id: 3, col1: "React", col2: "with", col3: "MUI" },
  ];

  // Colonnes fictives
  const columns = [
    { field: "col1", headerName: "Column 1", width: 150 },
    { field: "col2", headerName: "Column 2", width: 150 },
    { field: "col3", headerName: "Column 3", width: 150 },
  ];

  return (
    <div style={{ height: 400, width: "100%" }} className="test">
      <DataGridPro
        rows={rows}
        columns={columns}
        pagination
        pageSizeOptions={[5, 10]}
        initialState={{
          pagination: { paginationModel: { pageSize: 5, page: 0 } },
        }}
      />
    </div>
  );
}
