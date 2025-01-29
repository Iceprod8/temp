import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { BsFillPenFill } from "react-icons/bs";
import { TiUserAdd } from "react-icons/ti";
import { useAppContext } from "@inplan/AppContext";
import UserModal from "@inplan/views/users/UserModal";
import CustomNoRowsOverlay from "@inplan/common/CustomNoRowsOverlay";
import { mainColor } from "@inplan/common/Form/styles";
import { Button } from "@mui/material";

function UsersTable() {
  const { t: translation } = useTranslation();
  const { users, offices } = useAppContext();
  const [selectedRows, setSelectedRows] = useState([]);
  const [modal, setModal] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [seletedOffice, setSeletedOffice] = useState({ id: "" });

  useEffect(() => {
    if (offices && offices.length > 0) {
      setSeletedOffice(offices[0]);
    }
  }, [offices]);

  const handleModal = (row) => {
    setSelectedUser(row);
    setModal("modal-user");
  };

  const columns = [
    {
      field: "id",
      headerName: translation("users.table.titles.id").toUpperCase(),
      flex: 0.5,
      hide: true,
      valueGetter: (params) => params?.row?.id,
    },
    {
      field: "office.name",
      headerName: translation("users.table.titles.office").toUpperCase(),
      flex: 0.5,
      valueGetter: (params) => params?.row?.office?.name,
    },
    {
      field: "username",
      headerName: translation("users.table.titles.username").toUpperCase(),
      flex: 0.5,
      valueGetter: (params) => params?.row?.username,
    },
    {
      field: "first_name",
      headerName: translation("users.table.titles.first_name").toUpperCase(),
      flex: 0.7,
      valueGetter: (params) => params?.row?.first_name,
    },
    {
      field: "last_name",
      headerName: translation("users.table.titles.last_name").toUpperCase(),
      flex: 1,
      valueGetter: (params) => params?.row?.last_name,
    },
    {
      field: "email",
      headerName: translation("users.table.titles.email").toUpperCase(),
      flex: 1,
      valueGetter: (params) => params?.row?.email,
    },
    {
      field: "actions",
      headerName: translation("users.table.titles.actions").toUpperCase(),
      type: "actions",
      flex: 0.4,
      getActions: (params) => [
        <div
          role="button"
          tabIndex="0"
          style={{
            cursor: "pointer",
            margin: 8,
            color: "rebeccaPurple",
          }}
          onClick={() => handleModal(params.row)}
        >
          <BsFillPenFill size={15} />
        </div>,
      ],
    },
  ];

  return (
    <div>
      <UserModal
        seletedOffice={seletedOffice}
        setSeletedOffice={setSeletedOffice}
        setSelectedUser={setSelectedUser}
        selectedUser={selectedUser}
        setModal={setModal}
        labelColor="#4b525f"
      />
      <div style={{ padding: "30px" }}>
        <div className="page">
          <div
            className="flex alignItems-center"
            style={{
              justifyContent: "space-between",
            }}
          >
            <div className="page-head__title">
              <h1 className="h1">{translation("users.title")}</h1>
            </div>
            <div className="flex alignItems-center">
              <div className="">
                <Button
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    fontWeight: 600,
                    fontFamily: "Source Sans Pro",
                  }}
                  variant="contained"
                  onClick={() => {
                    setSelectedUser(null);
                    if (offices && offices.length > 0) {
                      setSeletedOffice(offices[0]);
                    }
                    setModal("modal-user");
                  }}
                >
                  <TiUserAdd
                    style={{ fontSize: "130%", marginRight: "10px" }}
                  />
                  {translation("users.buttons.create")}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="dashboard-table-container"
          style={{
            alignItems: "end",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <DataGrid
            columns={columns}
            rows={users}
            components={{
              NoRowsOverlay: CustomNoRowsOverlay,
              Toolbar: GridToolbar,
            }}
            rowsPerPageOptions={[25, 50, 100, 200]}
            pagination
            paginationMode="client"
            pageSize={100}
            onSelectionModelChange={(rowsIds) => {
              setSelectedRows(rowsIds);
            }}
            selectionModel={selectedRows}
            componentsProps={{
              row: { "data-test": "row-lab" },
              cell: { "data-test": "cell-lab" },
              pagination: {
                labelRowsPerPage: `${translation(
                  "utilities.DataGridPro.pagination.labelRowsPerPage",
                )}:`,
                labelDisplayedRows: ({ from, to, count }) =>
                  `${translation(
                    "utilities.DataGridPro.pagination.labelDisplayedRows",
                    {
                      from,
                      to,
                      count,
                    },
                  )}`,
              },
            }}
            autoHeight
            getRowClassName={() => {
              const className = "order-in-progress-allrows";
              return className;
            }}
            sx={{
              "& svg[data-value='true']": { fill: mainColor },
              width: "100%",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default UsersTable;
