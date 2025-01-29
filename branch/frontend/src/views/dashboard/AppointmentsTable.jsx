import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IoMdTrash } from "react-icons/io";
import { useTranslation } from "react-i18next";

import CustomNoRowsOverlay from "@inplan/common/CustomNoRowsOverlay";
import SectionHeader from "@inplan/common/SectionHeader";

import {
  singleSelectColumn,
  dateTimeColumn,
} from "@inplan/common/datagridUtils";
import { useDashboardContext } from "./Context";

const columns = () => {
  const { deleteAppointment } = useDashboardContext();
  const { t: translation } = useTranslation();

  return [
    singleSelectColumn(
      "type",
      [
        translation("utilities.placeAppointmentOptions.other"),
        translation("utilities.placeAppointmentOptions.sit"),
        translation("utilities.placeAppointmentOptions.reception"),
      ],
      {
        editable: true,
        headerName: translation("dashboard.appointments.table.titles.type"),
      },
    ),
    singleSelectColumn(
      "task",
      [
        translation("utilities.taskTypeOptions.scan"),
        translation("utilities.taskTypeOptions.treatment_plan"),
        translation("utilities.taskTypeOptions.aligner"),
        translation("utilities.taskTypeOptions.retainer"),
      ],
      {
        editable: true,
        headerName: translation("dashboard.appointments.table.titles.task"),
      },
    ),
    dateTimeColumn("date", {
      headerName: translation(
        "dashboard.appointments.table.titles.appointment_date",
      ),
      editable: true,
    }),
    { field: "id", flex: 1, hide: true },
    {
      field: "actions",
      type: "actions",
      width: 200,
      getActions: (params) => [
        <IoMdTrash
          style={{ cursor: "pointer", fontSize: 40, padding: 8 }}
          onClick={() => deleteAppointment(params)}
        />,
      ],
    },
  ];
};

function AppointmentTable() {
  const { updateAppointment, appointments, loading, fetchPatientOrders } =
    useDashboardContext();
  const { t: translation } = useTranslation();

  return (
    <div className="dashboard-table-container">
      <SectionHeader type="appointments" />
      <DataGrid
        columns={columns()}
        rows={appointments}
        rowCount={appointments.length}
        components={{
          NoRowsOverlay: CustomNoRowsOverlay,
        }}
        loading={loading}
        rowsPerPageOptions={[10, 25, 50]}
        getRowId={(row) => row.id}
        getCellClassName={(params) =>
          !params.row.is_downloaded &&
          ["date", "type"].includes(params.field) &&
          "order-in-progress-editable-cell"
        }
        getRowClassName={() => "order-in-progress-allrows"}
        onCellEditCommit={async ({ id, field, value }) => {
          await updateAppointment(id, { [field]: value });
          fetchPatientOrders();
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

export default AppointmentTable;
