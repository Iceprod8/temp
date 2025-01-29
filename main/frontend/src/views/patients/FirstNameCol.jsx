import React from "react";

import { Link } from "react-router-dom";

export default function FirstNameCol({ patient, first_name: firstName }) {
  return (
    <>
      {patient.archived === false ? (
        <Link
          to={`/dashboard/${patient.id}`}
          data-test="link_patient_dashboard"
        >
          {firstName}
        </Link>
      ) : (
        <span>{firstName}</span>
      )}
    </>
  );
}
