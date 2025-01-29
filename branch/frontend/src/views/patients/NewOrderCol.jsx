import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { backend } from "@inplan/adapters/apiCalls";
import CustomTranslation from "@inplan/common/translation/CustomTranslation";

function countInProgressOrders(patient) {
  // Check if order_details exists in the patient object
  if (!patient.order_details || !Array.isArray(patient.order_details)) {
    return -1; // Return -1 if order_details doesn't exist or is not an array
  }

  let nbOrdersInProgress = 0;
  let nbOrdersTerminated = 0;

  // Iterate over the order_details array
  patient.order_details.forEach((order) => {
    if (
      order.status < 3 ||
      order.status === 5 ||
      order.status === 6 ||
      order.status === 7 ||
      order.status === 8
    ) {
      nbOrdersInProgress += 1;
    } else if (order.status === 3) {
      nbOrdersTerminated += 1;
    }
  });

  return { nbOrdersInProgress, nbOrdersTerminated };
}

function UnrchiveConfirmationBox({ patient, setRefresh }) {
  const { t: translation } = useTranslation();
  const message = translation(
    "messages.patients.unarchive_patient_confirmation",
    {
      last_name: patient.last_name,
      first_name: patient.first_name,
    },
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
    <button className="btn-table-primary" type="button" onClick={handleConfirm}>
      {translation("patients.table.actions_options.restore_patient")}
    </button>
  );
}

export default function NewOrderCol({ rowData, setRefresh }) {
  // FIXME : START should be used
  const { patient } = rowData;
  const { nbOrdersInProgress, nbOrdersTerminated } =
    countInProgressOrders(patient);
  const nbOrdersTotal = nbOrdersInProgress + nbOrdersTerminated;
  const istreatmentStarted = nbOrdersTotal > 0;

  return (
    <div className="flex alignItems-center">
      {patient.archived ? (
        <UnrchiveConfirmationBox patient={patient} setRefresh={setRefresh}>
          <CustomTranslation text="patients.table.actions_options.restore_patient" />
        </UnrchiveConfirmationBox>
      ) : (
        <Link
          to={`dashboard/${patient.id}/orders`}
          // className="btn-table-primary text-center"
          type="button"
          data-test="start_processing"
        >
          {istreatmentStarted ? (
            <div className="btn-table-primary text-center">
              {/* <Translation>
                {(t, { i18n }) =>
                  `${t("patients.table.actions_options.new_order")}`
                }
              </Translation> */}
              <CustomTranslation text="patients.table.actions_options.new_order" />
            </div>
          ) : (
            <div className="btn-table-secondary text-center">
              {/* <Translation>
                  {(t, { i18n }) =>
                    `${t("patients.table.actions_options.start_treatment")}`
                  }
                </Translation> */}
              <CustomTranslation text="patients.table.actions_options.start_treatment" />
            </div>
          )}
          {/* Start treatment */}
          {/* {orderDescription} */}
        </Link>
      )}
    </div>
  );
}
