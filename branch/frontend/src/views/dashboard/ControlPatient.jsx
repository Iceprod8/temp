import React, { useEffect, useState } from "react";
// FIXME: Unused import. This is unnecessary because Form is not being utilized in this component.
// import Form from "@inplan/common/Form";
// FIXME: Unused import. TextFieldBasic is not used in the component.
// import TextFieldBasic from "@inplan/common/TextFieldBasic";
import { backend } from "@inplan/adapters/apiCalls";
import CustomTranslation from "@inplan/common/translation/CustomTranslation";
// FIXME: Unused import. Button from Material UI is not used in the component.
// import { Button, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
// FIXME: Unused imports. DataGridPro and GridOverlay are not used in this component.
// import { DataGridPro, GridOverlay } from "@mui/x-data-grid-pro";
import { useAppContext } from "@inplan/AppContext";
import { NotificationManager } from "react-notifications";
import { IoTrashOutline } from "react-icons/io5";
import DownloadLink from "react-download-link";
// FIXME: NoteModal is not used in this component.
// import NoteModal from "@inplan/common/NoteModal";
// FIXME: Unused import. Context is not used in this component.
// import { useDashboardContext } from "./Context";
import useRowsAndColumns from "../patient/useRowsAndColumns";
import PatientEditor from "../patient/PatientEditor";
import "@inplan/assets/scss/pages/dashboard_patient.scss";

// FIXME: Unused constant, remove if no fields logic is needed
// const fields = ["birth_date", "email", "first_name", "last_name", "gender", "phone_number", "treatment_start"];

// FIXME: The function `CustomNoRowsOverlay` is not being used in the current code.
// This was likely intended for displaying a custom overlay for a data grid when there are no rows.
// If the functionality is required in the future, it can be used as a component in a DataGrid's `components` prop.
// Otherwise, consider removing it to reduce unused code clutter.

/* function CustomNoRowsOverlay() {
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
} */

function ArchiveConfirmationBox({
  patient,
  // setRefresh,
  activePatient,
  setActivePatient,
}) {
  const { t: translation } = useTranslation();
  const history = useHistory();
  const message = translation(
    "messages.patients.archive_patient_confirmation",
    {
      last_name: patient.last_name,
      first_name: patient.first_name,
    }
  );

  const handleArchive = async () => {
    await backend.post(`patients/${patient.id}/archive`);
    history.push("/patients");
  };

  const handleConfirm = () => {
    const confirmed = window.confirm(message);
    if (confirmed) {
      if (activePatient && activePatient.id === patient.id) {
        setActivePatient(null);
      }
      handleArchive();
    }
  };

  return (
    <>
      <button type="button" className="archive-button" onClick={handleConfirm}>
        <CustomTranslation text="patient_profile.header.archive" />
      </button>
    </>
  );
}

export default function DashboardControlPatient() {
  const [patient, setPatient] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const { idPatient } = useParams();
  const {
    updateModale,
    userData,
    activePatient,
    setActivePatient,
    getUserRights,
    userRights,
  } = useAppContext();
  const { rows, getColumns /* refetchRowsAndColumns */ } =
    useRowsAndColumns(idPatient);
  const [selectedNotes, setSelectedNotes] = useState([]);

  const { t: translation } = useTranslation();
  const columns = getColumns(translation);

  const refreshPage = async () => {
    const { data } = await backend.get(`patients/${idPatient}`);
    setPatient(data);
    setNotes(data.patient_notes || []);
    // refetchRowsAndColumns(idPatient);
  };

  // Initialize
  useEffect(async () => {
    if (!idPatient) {
      return;
    }

    await refreshPage();
  }, [idPatient]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    const newNoteData = {
      patient: idPatient,
      content: newNote,
    };

    try {
      const { data } = await backend.post("/patient_notes", newNoteData);
      setNotes([data, ...notes]);
      setNewNote("");
    } catch (err) {
      console.error(err);
      NotificationManager.error(err.message);
    }
  };

  const handleSelectNote = (noteId) => {
    setSelectedNotes((prev) =>
      prev.includes(noteId)
        ? prev.filter((id) => id !== noteId)
        : [...prev, noteId]
    );
  };

  const handleDeleteSelectedNotes = async () => {
    try {
      if (selectedNotes.length === 0) {
        console.warn("No notes selected for deletion.");
        return;
      }
      console.log("Selected notes to delete:", selectedNotes);
      await backend.delete(`/patient_notes/delete`, {
        data: { note_ids: selectedNotes },
      });
      setNotes((prev) =>
        prev.filter((note) => !selectedNotes.includes(note.id))
      );
      setSelectedNotes([]);
    } catch (err) {
      console.error("Error deleting notes:", err);
    }
  };

  if (!patient) {
    return <></>;
  }

  const zipName = `${patient.last_name}_${patient.first_name}_export.zip`;

  return (
    <div className="dashboard-control__body-patient">
      {/* Header Section */}
      <div className="page-head__title">
        <h1>
          {patient.first_name} {patient.last_name}
        </h1>
        <div className="patient-identifier">{patient.identifier}</div>
      </div>

      {/* Archive Button */}
      <div className="order-container-archive">
        <ArchiveConfirmationBox
          patient={patient}
          // setRefresh={refetchRowsAndColumns}
          activePatient={activePatient}
          setActivePatient={setActivePatient}
        />
      </div>

      {/* Patient Editor */}
      <PatientEditor patientId={patient.id} refreshPage={refreshPage} />

      {/* Notes Section */}
      <div className="notes-section">
        <h2>
          <CustomTranslation text="patient_profile.table_notes.name" />
        </h2>
        <div className="notes-actions">
          <button
            type="button"
            className="add-note-button"
            onClick={handleAddNote}
          >
            <CustomTranslation text="patient_profile.table_notes.buttons.add" />
          </button>
          <IoTrashOutline
            className="delete-icon"
            onClick={handleDeleteSelectedNotes}
            disabled={selectedNotes.length === 0}
          />
          <textarea
            rows="4"
            placeholder={translation(
              "patient_profile.table_notes.buttons.text"
            )}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
        </div>

        {/* List of Notes */}
        {notes.length > 0 && (
          <div className="notes-list">
            {notes.map((note) => (
              <label
                key={note.id}
                className={`note-item ${
                  selectedNotes.includes(note.id) ? "selected" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSelectNote(note.id);
                }}
              >
                <div className="note-header">
                  <span className="note-author">
                    {note.author_name || "Anonyme"}
                  </span>
                  <div>
                    <span className="note-date">
                      {new Date(note.created_at).toLocaleDateString()}{" "}
                      {new Date(note.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <input
                      type="checkbox"
                      checked={selectedNotes.includes(note.id)}
                      onChange={() => {}}
                      className="hidden-checkbox"
                    />
                  </div>
                </div>
                <div className="note-content">{note.content}</div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Download Models Button */}
      <div className="order-container-model">
        {userRights?.inlase && (
          <DownloadLink
            label={
              <CustomTranslation text="patient_profile.table_notes.buttons.download_models" />
            }
            className={`download-model-button ${
              patient.models.total === 0 ? "disabled" : ""
            }`}
            filename={zipName}
            exportFile={async () => {
              if (patient.models.total === 0) {
                console.warn("No models available for download.");
                return null;
              }
              const updatedRights = await getUserRights();
              if (updatedRights?.patient_profile) {
                const { data } = await backend.get(
                  `patients/${idPatient}/export`,
                  {
                    responseType: "arraybuffer",
                  }
                );
                return data;
              }
              return null;
            }}
            onClick={(e) => {
              if (patient.models.total === 0) {
                e.preventDefault();
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
