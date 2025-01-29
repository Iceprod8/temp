import React from "react";

import { Link } from "react-router-dom";

export default function SurnameCol({ patient, last_name: lastName }) {
  return (
    <>
      {patient.archived === false ? (
        <Link
          to={`/dashboard/${patient.id}`}
          data-test="link_patient_dashboard"
        >
          {lastName}
        </Link>
      ) : (
        <span>{lastName}</span>
      )}
    </>
  );
}
