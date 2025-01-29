import React from "react";

import { useAppContext } from "@inplan/AppContext";
import { backend } from "@inplan/adapters/apiCalls";
import { useTranslation } from "react-i18next";

function ArchiveConfirmationBox({
  patient,
  setRefresh,
  activePatient,
  setActivePatient,
}) {
  const { t: translation } = useTranslation();
  const message = translation(
    "messages.patients.archive_patient_confirmation",
    {
      last_name: patient.last_name,
      first_name: patient.first_name,
    }
  );

  const handleArchive = async () => {
    await backend.post(`patients/${patient.id}/archive`);
    setRefresh(true);
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
        className="btn-table-primary"
        type="button"
        onClick={handleConfirm}
      >
        {/* Archive patient */}
        {translation("patient_profile.header.archive")}
      </button>
    </>
  );
}

function UnrchiveConfirmationBox({ patient, setRefresh }) {
  const { t: translation } = useTranslation();
  const message = translation(
    "messages.patients.unarchive_patient_confirmation",
    {
      last_name: patient.last_name,
      first_name: patient.first_name,
    }
  );

  const handleUnarchive = async () => {
    await backend.post(`patients/${patient.id}/activate`);
    setRefresh(true);
  };

  const handleConfirm = () => {
    const confirmed = window.confirm(message);
    if (confirmed) {
      handleUnarchive();
    }
  };

  return (
    <>
      <button
        className="btn-table-primary"
        type="button"
        onClick={handleConfirm}
      >
        {translation("patients.table.actions_options.restore_patient")}
      </button>
    </>
  );
}

export default function archiveCol({ rowData, setRefresh }) {
  const { activePatient, setActivePatient } = useAppContext();
  return (
    <>
      {!rowData.patient.archived && (
        <ArchiveConfirmationBox
          patient={rowData.patient}
          setRefresh={setRefresh}
          activePatient={activePatient}
          setActivePatient={setActivePatient}
        >
          Archive patient
        </ArchiveConfirmationBox>
      )}
      {rowData.patient.archived && (
        <UnrchiveConfirmationBox
          patient={rowData.patient}
          setRefresh={setRefresh}
        >
          Unarchive patient
        </UnrchiveConfirmationBox>
      )}
    </>
  );
}
