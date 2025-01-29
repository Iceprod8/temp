import React from "react";
import { Link } from "react-router-dom";
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

// fixme change treatments_start
export default function ExistingOrdersCol({ patient, treatment_start: start }) {
  // FIXME : START should be used
  const { nbOrdersInProgress, nbOrdersTerminated } =
    countInProgressOrders(patient);
  const nbOrdersTotal = nbOrdersInProgress + nbOrdersTerminated;
  const orderDescription = `${nbOrdersTerminated} / ${nbOrdersTotal} `;
  const archivedDescription = `${nbOrdersTerminated} / ${nbOrdersTotal} `;

  const istreatmentStarted = nbOrdersTotal > 0;

  return (
    <>
      {patient.archived ? (
        <div className="flex alignItems-center">
          <div style={{ marginRight: "5px" }}>{archivedDescription}</div>
          <CustomTranslation text="patients.table.existing_orders_options.orders_terminated" />
        </div>
      ) : (
        <Link
          to={`dashboard/${patient.id}/orders`}
          type="button"
          data-test="start_processing"
        >
          {istreatmentStarted ? (
            <>
              <div className="flex alignItems-center">
                <div style={{ marginRight: "5px" }}>{orderDescription}</div>
                <CustomTranslation text="patients.table.existing_orders_options.orders_terminated" />
              </div>
            </>
          ) : (
            <>
              <CustomTranslation text="patients.table.existing_orders_options.not_order_yet" />
            </>
          )}
        </Link>
      )}
    </>
  );
}
