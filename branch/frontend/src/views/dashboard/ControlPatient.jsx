import React, { useEffect, useState } from "react";
import { backend } from "@inplan/adapters/apiCalls";
import CustomTranslation from "@inplan/common/translation/CustomTranslation";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "@inplan/AppContext";
import { IoTrashOutline } from "react-icons/io5";
import DownloadLink from "react-download-link";
import "@inplan/assets/scss/pages/dashboard_patient.scss";
import { useSnackbar } from "@inplan/contexts/SnackbarContext";
import PatientEditor from "../patient/PatientEditor";

function ArchiveConfirmationBox({ patient, activePatient, setActivePatient }) {
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
    if (confirmed) {
      if (activePatient && activePatient.id === patient.id) {
        setActivePatient(null);
      }
      handleArchive();
    }
  };

  return (
    <button type="button" className="archive-button" onClick={handleConfirm}>
      <CustomTranslation text="patient_profile.header.archive" />
    </button>
  );
}

export default function DashboardControlPatient() {
  const [patient, setPatient] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const { idPatient } = useParams();
  const { activePatient, setActivePatient, getUserRights, userRights } =
    useAppContext();
  const [selectedNotes, setSelectedNotes] = useState([]);
  const showSnackbar = useSnackbar();
  const { t: translation } = useTranslation();

  const refreshPage = async () => {
    const { data } = await backend.get(`patients/${idPatient}`);
    setPatient(data);
    setNotes(data.patient_notes || []);
  };

  // Initialize
  useEffect(() => {
    if (!idPatient) {
      return;
    }
    refreshPage();
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
      showSnackbar(err.message, "error");
    }
  };

  const handleSelectNote = (noteId) => {
    setSelectedNotes((prev) =>
      prev.includes(noteId)
        ? prev.filter((id) => id !== noteId)
        : [...prev, noteId],
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
        prev.filter((note) => !selectedNotes.includes(note.id)),
      );
      setSelectedNotes([]);
    } catch (err) {
      console.error("Error deleting notes:", err);
    }
  };

  if (!patient) {
    return null;
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
              "patient_profile.table_notes.buttons.text",
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
                  },
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
