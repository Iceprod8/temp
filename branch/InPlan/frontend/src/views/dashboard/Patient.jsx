import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { FaUserEdit } from "react-icons/fa";
import DownloadLink from "react-download-link";
import { backend } from "@inplan/adapters/apiCalls";

import { useAppContext } from "@inplan/AppContext";

import { useDashboardContext } from "./Context";

export default function DashboardPatient() {
  const { t: translation } = useTranslation();
  const { setActivePatient, userData } = useAppContext();
  const { patient } = useDashboardContext();

  if (!patient) {
    return null;
  }

  return (
    <div className="dashboard-patient">
      <div style={{ paddingBottom: "62px", paddingLeft: "32px" }}>
        <Link
          className="flex alignItems-center"
          style={{ cursor: "pointer" }}
          to={`/patients/${patient.id}`}
          data-test="patient_profile"
        >
          <FaUserEdit
            name="more"
            size={20}
            style={{ marginRight: "15px" }}
            className="icon icon-more"
          />
          {translation("dashboard.patient_profile")}
        </Link>
      </div>
    </div>
  );
}
