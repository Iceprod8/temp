import React from "react";

import { Link } from "react-router-dom";

export default function IdentifierCol({ patient }) {
  return (
    <>
      {patient.archived === false ? (
        <Link
          to={`/dashboard/${patient.id}`}
          data-test="link_patient_dashboard"
        >
          {patient.identifier}
        </Link>
      ) : (
        <span>{patient.identifier}</span>
      )}
    </>
  );
}
