import React from "react";

import { Link } from "react-router-dom";

export default function PatientCol({ patient }) {
  return (
    <>
      {patient.archived === false ? (
        <Link
          to={`/dashboard/${patient?.id}/orders`}
          data-test="link_patient_dashboard"
        >
          <div>
            <span style={{ fontSize: "1.3em" }}>{patient.last_name}</span>
            <span>, </span>
            <span style={{ fontSize: "1.1em" }}>{patient.first_name}</span>
          </div>
          <div>{patient.identifier}</div>
        </Link>
      ) : (
        <>
          <div>
            <span style={{ fontSize: "1.3em" }}>{patient.last_name}</span>
            <span>, </span>
            <span style={{ fontSize: "1.1em" }}>{patient.first_name}</span>
          </div>
          <div>{patient.identifier}</div>
        </>
      )}
    </>
  );
}
