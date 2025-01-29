import React from "react";

import { Link } from "react-router-dom";

export default function BirthdateCol({ patient }) {
  const registredBirthDate = new Date(patient.birth_date);
  const registredBirthDateTime = registredBirthDate.getTime();
  const defaultdate1 = new Date("1970-01-01");
  const defaultdate1Time = defaultdate1.getTime();
  const defaultDateMessage = "Unprecised";

  return (
    <>
      {patient.archived === false ? (
        <Link
          to={`/dashboard/${patient.id}`}
          data-test="link_patient_dashboard"
        >
          {registredBirthDateTime === defaultdate1Time
            ? defaultDateMessage
            : patient.birth_date}
        </Link>
      ) : (
        <span>
          {" "}
          {registredBirthDateTime === defaultdate1Time
            ? defaultDateMessage
            : patient.birth_date}
        </span>
      )}
    </>
  );
}
