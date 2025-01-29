import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { backend } from "@inplan/adapters/apiCalls";
import { useAppContext } from "@inplan/AppContext";
import { PrintAddressLabel } from "./PrintLabel";

function goPrint() {
  window.print();
}

export default function Labels() {
  const { idPatient } = useParams();
  const { t: translation } = useTranslation();
  const { getUserRights } = useAppContext();
  useEffect(() => {
    getUserRights();
  }, []);
  const [patient, setPatient] = useState(null);
  useEffect(async () => {
    if (!idPatient) return;
    const { data } = await backend.get(`patients/${idPatient}`);
    setPatient(data);
    goPrint();
  }, [idPatient]);

  return (
    <>
      <div className="label-print-action">
        <button
          className="btn-primary notinprint"
          type="button"
          onClick={() => {
            window.print();
          }}
        >
          {translation("laboratory.print.title")}
        </button>
      </div>
      <div>
        <div className="printer-labels">
          {patient && <PrintAddressLabel patient={patient} />}
        </div>
      </div>
    </>
  );
}
