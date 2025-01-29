import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { NotificationManager } from "react-notifications";
import { DataGridPro, GridToolbar } from "@mui/x-data-grid-pro";
import { BsFillPenFill } from "react-icons/bs";
import { TiUserAdd, TiUserDelete } from "react-icons/ti";

import { useAppContext } from "@inplan/AppContext";

import UserModal from "@inplan/views/users/UserModal";
import CustomNoRowsOverlay from "@inplan/common/CustomNoRowsOverlay";
import { mainColor } from "@inplan/common/Form/styles";
import { Button } from "@mui/material";
import { IoMdTrash } from "react-icons/io";
import CustomTranslation from "../../common/translation/CustomTranslation";
import Fade from "../../common/Fade";

const UsersTable = () => {
  const { t: translation } = useTranslation();
  const { getUserRights, users, fetchUsers, deleteUser, offices } =
    useAppContext();

  const [selectedRows, setSelectedRows] = useState([]);
  const [modal, setModal] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [seletedOffice, setSeletedOffice] = useState({ id: "" });

  // Update seletedOffice after changing option in select component
  useEffect(() => {
    if (offices && offices.length > 0) {
      setSeletedOffice(offices[0]);
    }
  }, [offices]);

  // Used for handle delete, to add a confirmation
  // DISABLED
  const handleOneDelete = async (row) => {
    const message = translation("messages.users.delete_confirmation", {
      username: row?.username,
    });
    const confirmedDelete = window.confirm(message);
    if (confirmedDelete) {
      const updatedRights = await getUserRights();
      if (updatedRights?.to_delete_user) {
        deleteUser(row);
      }
    }
  };

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
        // <div
        //   role="button"
        //   tabIndex="0"
        //   style={{
        //     cursor: "pointer",
        //     margin: 8,
        //     color: "Crimson",
        //   }}
        //   onClick={() => handleOneDelete(params.row)}
        // >
        //   <IoMdTrash size={20} />
        // </div>,
      ],
    },
  ];

  const handleDeleteUsers = async () => {
    try {
      if (selectedRows?.length === 0) {
        NotificationManager.error(
          translation("messages.users.no_user_selected")
        );
        return;
      }
      const message = translation("messages.users.delete_selected_users");
      const confirmed = window.confirm(message);
      if (confirmed) {
        const updatedRights = await getUserRights();
        if (updatedRights?.to_delete_user) {
          const rowToDelete = users.filter((user) =>
            selectedRows.includes(user.id)
          );
          const futurs = rowToDelete.map((row) => deleteUser(row));
          await Promise.all(futurs);
          await fetchUsers();
          if (selectedRows?.length > 0) {
            NotificationManager.success(
              translation("messages.users.users_have_been_deleted")
            );
          }
        }
      }
    } catch (error) {
      console.error("Error handleDeleteUsers:", error);
    }
  };
  return (
    <div>
      <Fade
        visible={modal === "modal-user"}
        duration={300}
        zIndex={1000}
        from={{ opacity: 0 }}
      >
        <UserModal
          seletedOffice={seletedOffice}
          setSeletedOffice={setSeletedOffice}
          setSelectedUser={setSelectedUser}
          selectedUser={selectedUser}
          setModal={setModal}
          labelColor="#4b525f"
        />
      </Fade>
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
              {/* <div>
                <Button
                  style={{
                    border: "2px solid #ef5350",
                    backgroundColor: "#ef5350",
                    color: "white",
                    fontFamily: "Source Sans Pro",
                    fontWeight: 600,
                    marginLeft: "10px",
                  }}
                  variant="outlined"
                  onClick={() => handleDeleteUsers()}
                >
                  <TiUserDelete
                    style={{ fontSize: "130%", marginRight: "10px" }}
                  />
                  <CustomTranslation text="users.buttons.delete" />
                </Button>
              </div> */}
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
          <DataGridPro
            columns={columns}
            rows={users}
            // checkboxSelection
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
      </div>
    </div>
  );
};

export default UsersTable;
