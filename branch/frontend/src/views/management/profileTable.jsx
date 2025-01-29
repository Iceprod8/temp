import React, { useEffect, useState } from "react";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { mainColor } from "@inplan/common/Form/styles";
import { useTranslation } from "react-i18next";
import { IoMdTrash } from "react-icons/io";
import { IoClose, IoEye } from "react-icons/io5";

import { useProfiles } from "../../common/collections";

const ProfileTabel = () => {
  const { t: translation } = useTranslation();
  const [selectedProfile, setSelectedProfile] = useState({});
  const {
    fetchItem: fetchProfile,
    items: profiles,
    fetchItems: fetchProfiles,
    deleteItem: deleteProfile,
  } = useProfiles();
  const [modal, setModal] = useState(false);

  // functions #######################################
  const handleModal = (row) => {
    fetchProfile(row.id).then(setSelectedProfile);
    setModal(true);
  };
  const handleOneDelete = async (row) => {
    const confirmedDelete = window.confirm(`wana delete ${row.name} ?`);
    if (confirmedDelete) {
      deleteProfile(row);
    }
  };
  const getActionsColumns = () => {
    const actionsColumn = [
      {
        field: "actions",
        headerName: translation("licenses.table.titles.actions").toUpperCase(),
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
            <IoEye size={15} />
          </div>,
          <div
            role="button"
            tabIndex="0"
            style={{
              cursor: "pointer",
              margin: 8,
              color: "Crimson",
            }}
            onClick={() => handleOneDelete(params.row)}
          >
            <IoMdTrash size={20} />
          </div>,
        ],
      },
    ];
    return actionsColumn;
  };

  // table set area ##################################
  const columns = [
    { field: "id", headerName: "ID", hide: true },
    { field: "name", headerName: "Name", width: 150 },
    { field: "role", headerName: "Role" },
    { field: "description", headerName: "Description", width: 600 },
    ...getActionsColumns(translation),
    // Add more fields as needed
  ];
  const rows = profiles.map((profile) => ({
    id: profile.id,
    name: profile.name,
    role: profile.role,
    description: profile.description,
    // Add more fields as needed
  }));

  // Fetching and update area ########################
  useEffect(() => {
    fetchProfiles();
  }, []);
  useEffect(() => {
    console.log(selectedProfile);
  }, [selectedProfile]);

  return (
    <div>
      <div className="profileTabelContainer">
        <div>
          <h1>Profile List</h1>
        </div>
        <div>
          <DataGridPro
            columns={columns}
            rows={rows}
            // checkboxSelection
            rowsPerPageOptions={[25, 50, 100, 200]}
            pagination
            paginationMode="client"
            pageSize={100}
            // onSelectionModelChange={(rowsIds) => {
            //   setSelectedProfile(rowsIds);
            // }}
            // selectionModel={selectedProfile}
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
            getRowClassName={() => "order-in-progress-allrows"}
            sx={{
              "& svg[data-value='true']": { fill: mainColor },
              width: "100%",
            }}
          />
        </div>
      </div>
      {modal ? (
        <div className="modalProfile">
          <div>
            <h1>{selectedProfile?.name}</h1>
            <h2>{selectedProfile?.role}</h2>
            <div>
              <p>{selectedProfile?.description}</p>
              <div className="profileAuth">
                {Object.keys(selectedProfile).map(
                  (key) =>
                    selectedProfile[key] === true &&
                    !["name", "id", "description", "role"].includes(key) && (
                      <div key={key}>{key}</div>
                    )
                )}
              </div>
            </div>
            <div className="closeBtn">
              <IoClose
                name="rounded-close"
                size={24}
                style={{
                  backgroundColor: "white",
                  borderRadius: "3em",
                  padding: "2px",
                }}
                className="icon icon-close"
                onClick={() => setModal(false)}
              />
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default ProfileTabel;
