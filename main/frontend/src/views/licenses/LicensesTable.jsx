import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { NotificationManager } from "react-notifications";
import { BsFillPenFill } from "react-icons/bs";
import { TiDocumentAdd, TiDocumentDelete } from "react-icons/ti";
import { useAppContext } from "@inplan/AppContext";
import CustomTranslation from "@inplan/common/translation/CustomTranslation";
import Fade from "@inplan/common/Fade";
import { Button } from "@mui/material";
import { IoMdTrash } from "react-icons/io";
import LicenseModal from "./LicenseModal";
import DataGridProLicenses from "./DataGridProLicenses";
import getLicenseColumns from "./licenseColumns";

const LicensesTable = () => {
  const { t: translation } = useTranslation();
  const {
    userLicenses,
    deleteUserLicense,
    getUserRights,
    fetchUserLicenses,
    licenseTypes,
    users,
  } = useAppContext();

  const [selectedRows, setSelectedRows] = useState([]);
  const [modal, setModal] = useState("");
  const [selectedUser, setSelectedUser] = useState({ id: "" });
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [seletedLicenseType, setSeletedLicenseType] = useState({ id: "" });

  // Update seletedLicenseType after changing option in select component
  useEffect(() => {
    if (licenseTypes && licenseTypes.length > 0) {
      setSeletedLicenseType(licenseTypes[0]);
    }
  }, [licenseTypes]);

  useEffect(() => {
    if (users && users.length > 0) {
      setSelectedUser(users[0]);
    }
  }, [users]);

  // Used for handle delete, to add a confirmation
  const handleOneDelete = async (row) => {
    const message = translation("messages.licenses.delete_confirmation", {
      license_name: row?.license_type?.name,
      username: row?.user?.username,
    });
    const confirmedDelete = window.confirm(message);
    if (confirmedDelete) {
      const updatedRights = await getUserRights();
      if (updatedRights?.to_delete) {
        deleteUserLicense(row);
      } else {
        NotificationManager.error(
          translation(
            "messages.common.you_do_not_have_permission_to_execute_this_action"
          )
        );
      }
    }
  };

  const handleModal = (row) => {
    setSelectedLicense(row);
    setModal("modal-license");
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
            <BsFillPenFill size={15} />
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

  const columns = [
    ...getLicenseColumns(translation),
    ...getActionsColumns(translation),
  ];

  const handleDeleteLicenses = async () => {
    try {
      if (selectedRows?.length === 0) {
        NotificationManager.error(
          translation("messages.licenses.no_license_selected")
        );
        return;
      }
      const message = translation("messages.licenses.delete_selected_licenses");
      const confirmed = window.confirm(message);
      if (confirmed) {
        const updatedRights = await getUserRights();
        if (updatedRights?.to_delete) {
          const rowToDelete = userLicenses.filter((license) =>
            selectedRows.includes(license.id)
          );
          const futurs = rowToDelete.map((row) => deleteUserLicense(row));
          await Promise.all(futurs);
          await fetchUserLicenses();
          if (selectedRows?.length > 0) {
            NotificationManager.success(
              translation("messages.licenses.licenses_have_been_deleted")
            );
          }
        } else {
          NotificationManager.error(
            translation(
              "messages.common.you_do_not_have_permission_to_execute_this_action"
            )
          );
        }
      }
    } catch (error) {
      console.error("Error handleDeleteLicenses:", error);
    }
  };
  return (
    <div>
      <Fade
        visible={modal === "modal-license"}
        duration={300}
        zIndex={1000}
        from={{ opacity: 0 }}
      >
        <LicenseModal
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          selectedLicense={selectedLicense}
          setSelectedLicense={setSelectedLicense}
          seletedLicenseType={seletedLicenseType}
          setSeletedLicenseType={setSeletedLicenseType}
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
              <h1 className="h1">{translation("licenses.title")}</h1>
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
                    setSelectedLicense(null);
                    if (users && users.length > 0) {
                      setSelectedUser(users[0]);
                    }
                    if (licenseTypes && licenseTypes.length > 0) {
                      setSeletedLicenseType(licenseTypes[0]);
                    }
                    setModal("modal-license");
                  }}
                >
                  <TiDocumentAdd
                    style={{ fontSize: "130%", marginRight: "10px" }}
                  />
                  {translation("licenses.buttons.create")}
                </Button>
              </div>
              <div>
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
                  onClick={() => handleDeleteLicenses()}
                >
                  <TiDocumentDelete
                    style={{ fontSize: "130%", marginRight: "10px" }}
                  />
                  <CustomTranslation text="licenses.buttons.delete" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <DataGridProLicenses
          columns={columns}
          userLicenses={userLicenses}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
        />
      </div>
    </div>
  );
};

export default LicensesTable;
