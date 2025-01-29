import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DataGrid } from "@mui/x-data-grid";
import { IoMdTrash } from "react-icons/io";
import { Button } from "@mui/material";

import CustomNoRowsOverlay from "@inplan/common/CustomNoRowsOverlay";
import SectionHeader from "@inplan/common/SectionHeader";
import { dateColumn } from "@inplan/common/datagridUtils";

import { useDashboardContext } from "./Context";

const setupsColumns = (handleDelete, deleteSetup, translation) => [
  {
    field: "name",
    headerName: translation("dashboard.setups.table.titles.name"),
    flex: 1,
    editable: true,
  },
  {
    field: "rank",
    headerName: translation("dashboard.setups.table.titles.number"),
  },
  dateColumn("creation", {
    headerName: translation("dashboard.setups.table.titles.creation_date"),
    flex: 0.3,
  }),
  {
    field: "aligners",
    headerName: translation("dashboard.setups.table.titles.aligners"),
    flex: 0.3,
    valueGetter: ({ row: { models: m } }) =>
      m.total - m.originals - m.templates,
  },
  {
    field: "ready",
    headerName: translation("dashboard.setups.table.titles.ready"),
    flex: 0.3,
    valueGetter: ({ row: { models: m } }) => m.based,
  },
  {
    field: "actions",
    type: "actions",
    flex: 1,
    getActions: (params) => [
      <Button
        style={{
          cursor: "pointer",
          padding: 8,
          color: "white",
          borderRadius: "500px",
        }}
        onClick={() => handleDelete(params.row, deleteSetup, translation)}
      >
        <IoMdTrash size={30} />
      </Button>,
    ],
  },
];

// Used for handle delete, to add a confirmation
const deleteConfirmationBox = (row, deleteSetup, translation) => {
  const message = translation("messages.setup.delete_setup_confirmation");
  const confirmedDelete = window.confirm(message);

  if (confirmedDelete) {
    deleteSetup(row);
  }
};

function SetupsTable() {
  const {
    setups,
    models,
    updateSetup,
    fetchPatientSetups,
    loading,
    deleteSetup,
  } = useDashboardContext();

  useEffect(() => {
    fetchPatientSetups();
  }, [models]);
  const { t: translation } = useTranslation();
  return (
    <div className="dashboard-table-container">
      <SectionHeader type="setups" />
      <DataGrid
        columns={setupsColumns(deleteConfirmationBox, deleteSetup, translation)}
        rows={setups.filter((s) => !s.is_archived)}
        rowCount={setups.length}
        components={{
          NoRowsOverlay: CustomNoRowsOverlay,
        }}
        loading={loading}
        rowsPerPageOptions={[10, 25, 50]}
        getRowId={(row) => row.id}
        getRowClassName={() => "order-in-progress-allrows"}
        onCellEditCommit={async (params) => {
          const { field, value } = params;
          updateSetup(params.id, { [field]: value });
        }}
        sx={{
          "& svg[data-value='true']": { fill: "#f6f6f6" },
          width: "100%",
          height: "100%",
        }}
        autoHeight
        localeText={{
          footerTotalRows: `${translation(
            "utilities.DataGridPro.pagination.footerTotalRows",
          )}${":"}`,
        }}
      />
    </div>
  );
}

export default SetupsTable;
