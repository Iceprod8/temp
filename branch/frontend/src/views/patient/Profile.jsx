import React, { useEffect, useState } from "react";
import DownloadLink from "react-download-link";
import { useParams, useNavigate } from "react-router-dom";
import { IoTrashOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import CustomTranslation from "@inplan/common/translation/CustomTranslation";
import { backend } from "@inplan/adapters/apiCalls";
import { useAppContext } from "@inplan/AppContext";
import NoteModal from "@inplan/common/NoteModal";
import { Button, Box } from "@mui/material";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";
import { useSnackbar } from "@inplan/contexts/SnackbarContext";
import PatientEditor from "./PatientEditor";
import useRowsAndColumns from "./useRowsAndColumns";

const fields = [
  "birth_date",
  "email",
  "first_name",
  "last_name",
  "gender",
  "phone_number",
  "treatment_start",
];

function CustomNoRowsOverlay() {
  const { t: translation } = useTranslation();
  return (
    <GridOverlay style={{ flexDirection: "column" }}>
      <svg
        width="120"
        height="100"
        viewBox="0 0 184 152"
        aria-hidden
        focusable="false"
      >
        <g fill="none" fillRule="evenodd">
          <g transform="translate(24 31.67)">
            <ellipse
              style={{ fill: "#f5f5f5", fillOpacity: "0.8" }}
              cx="67.797"
              cy="106.89"
              rx="67.797"
              ry="12.668"
            />
            <path
              style={{ fill: "#aeb8c2" }}
              d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
            />
            <path
              style={{ fill: "#f5f5f7" }}
              d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
            />
            <path
              style={{ fill: "#dce0e6" }}
              d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
            />
          </g>
          <path
            style={{ fill: "#dce0e6" }}
            d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
          />
          <g style={{ fill: "#fff" }} transform="translate(149.65 15.383)">
            <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
            <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
          </g>
        </g>
      </svg>
      <Box sx={{ mt: 1 }}>{translation("utilities.variables.no_rows")}</Box>
    </GridOverlay>
  );
}

function ArchiveConfirmationBox({
  patient,
  setRefresh,
  activePatient,
  setActivePatient,
}) {
  const { t: translation } = useTranslation();
  const navigate = useNavigate();
  const message = translation(
    "messages.patients.archive_patient_confirmation",
    {
      last_name: patient.last_name,
      first_name: patient.first_name,
    },
  );

  const handleArchive = async () => {
    await backend.post(`patients/${patient.id}/archive`);
    navigate("/patients");
  };

  const handleConfirm = () => {
    const confirmed = window.confirm(message);
    // const { activePatient, setActivePatient } = useAppContext();
    if (confirmed) {
      if (activePatient && activePatient.id === patient.id) {
        setActivePatient(null);
      }
      handleArchive();
    }
  };

  return (
    <>
      <button
        className="btn-table-tertiary"
        type="button"
        onClick={handleConfirm}
      >
        <CustomTranslation text="patient_profile.header.archive" />
      </button>
    </>
  );
}

export default function PatientProfile() {
  const [patient, setPatient] = useState(null);
  const { id } = useParams();
  const { updateModale, userData, getUserRights, userRights } = useAppContext();
  const { rows, getColumns /* refetchRowsAndColumns */ } =
    useRowsAndColumns(id);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const { t: translation } = useTranslation();
  const showSnackbar = useSnackbar();
  const columns = getColumns(translation);

  const refreshPage = async () => {
    const { data } = await backend.get(`patients/${id}`);
    setPatient(data);
    // refetchRowsAndColumns(id);
  };

  // Initialize
  useEffect(() => {
    if (!id) {
      return;
    }
    refreshPage();
  }, [id]);

  const deleteSelectedNotes = async (list) => {
    if (list.length === 0) {
      showSnackbar(translation("messages.patients.no_note_selected"), "error");
      return;
    }
    try {
      const deleteRequests = [];
      for (let i = 0; i < list.length; i += 1) {
        const result = backend({
          method: "delete",
          url: `/notes/${list[i]}`,
        });
        deleteRequests.push(result);
      }
      await Promise.all(deleteRequests);
      // refetchRowsAndColumns();
    } catch (err) {
      console.error(err);
      showSnackbar(err.message, "error");
    }
  };

  if (!patient) {
    return <></>;
  }

  const zipName = `${patient.last_name}_${patient.first_name}_export.zip`;

  return (
    <div className="page-light">
      <div
        className="page-profil"
        style={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        <div className="page-head__title">
          <h1 className="h1">
            <CustomTranslation text="patient_profile.title" />
          </h1>
        </div>
        <div style={{ display: "flex" }}>
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div className="page-head__title">
                <h1 className="h1">
                  {patient.first_name}
                  {"\u00A0\u00A0\u00A0\u00A0"}
                  {patient.last_name}
                  {"\u00A0\u00A0\u00A0\u00A0"}
                  {patient.identifier}
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: "20px", marginBottom: "20px" }}>
          <ArchiveConfirmationBox
            patient={patient}
            // setRefresh={refetchRowsAndColumns}
            activePatient={userData.activePatient}
            setActivePatient={updateModale}
          >
            ARCHIVE PATIENT
          </ArchiveConfirmationBox>
        </div>

        <PatientEditor patientId={patient.id} refreshPage={refreshPage} />

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "20px 0px",
            }}
          >
            <h2
              className="h2"
              style={{ minWidth: 100, textDecoration: "underline" }}
            >
              <CustomTranslation text="patient_profile.table_notes.name" />
            </h2>
            <div style={{ display: "flex", alignItems: "center" }}>
              <IoTrashOutline
                onClick={() => deleteSelectedNotes(selectedNotes)}
                style={{ fontSize: 28, margin: "0px 8px", cursor: "pointer" }}
              />
              <Button
                onClick={() => updateModale("note")}
                variant="contained"
                data-test="add_note"
              >
                <CustomTranslation text="patient_profile.table_notes.buttons.add" />
              </Button>
            </div>
          </div>

          <div style={{ width: "100%", height: 400 }}>
            <DataGrid
              checkboxSelection
              columns={columns}
              rows={rows}
              components={{
                NoRowsOverlay: CustomNoRowsOverlay,
              }}
              componentsProps={{
                row: {
                  "data-test": "new_note",
                },
              }}
              onSelectionModelChange={(notes) => setSelectedNotes(notes)}
              localeText={{
                footerTotalRows: `${translation(
                  "utilities.DataGridPro.pagination.footerTotalRows",
                )}${":"}`,
              }}
            />
          </div>

          {userRights?.inlase && (
            <DownloadLink
              className="btn-back"
              style={{ marginTop: "10px" }}
              filename={zipName}
              label={
                <CustomTranslation text="patient_profile.table_notes.buttons.download_models" />
              }
              exportFile={async () => {
                const updatedRights = await getUserRights();
                if (updatedRights?.patient_profile) {
                  const { data } = await backend.get(`patients/${id}/export`, {
                    responseType: "arraybuffer",
                  });
                  return data;
                }
                return null;
              }}
            >
              Download
            </DownloadLink>
          )}
        </div>
      </div>

      <NoteModal
        patientId={id}
        // refetchRowsAndColumns={refetchRowsAndColumns}
        rows={rows}
      />
    </div>
  );
}
