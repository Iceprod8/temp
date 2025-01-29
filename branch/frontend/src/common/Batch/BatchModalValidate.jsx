import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import Modal from "@inplan/common/Modal";
import { useBatchContext } from "./BatchContext";
import ModelTable from "./ModelTable";

// This module manage the list of aligners when a batch has been treated
// It is to select / unselect aligners depending the success of the process
// For example, unslect failed 3D print and select succeed 3D prints

export default function BatchModalValidate({ handle, name }) {
  const { t: translation } = useTranslation();
  const { setModal, selectedBatch, unselectBatch } = useBatchContext();

  const [validatedAligners, setValidatedAligners] = useState(
    selectedBatch && selectedBatch.aligners ? selectedBatch.aligners : [],
  );

  const batchName =
    selectedBatch && selectedBatch.name ? selectedBatch.name : "Batch";

  return (
    <Modal
      title={batchName}
      onClose={(page) => {
        setModal(page);
      }}
    >
      <div className="grid">
        <h4 className="h4">
          {translation(
            "3d_printing.table_pending_printer_beds.batch_modal_validate.name",
          )}
        </h4>
        {translation(
          "3d_printing.table_pending_printer_beds.batch_modal_validate.message",
        )}
        <div className="grid">
          <table className="table">
            <thead>
              <tr style={{ height: "59px" }}>
                <th>
                  {translation(
                    "3d_printing.table_pending_printer_beds.batch_modal_validate.table.titles.aligners",
                  )}
                </th>
                <th>
                  {translation(
                    "3d_printing.table_pending_printer_beds.batch_modal_validate.table.titles.actions",
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedBatch
                ? selectedBatch.aligners.map((aligner) => (
                    <ModelTable
                      key={aligner.id}
                      model={aligner}
                      modelsToPrint={validatedAligners}
                      setModelsToPrint={setValidatedAligners}
                    />
                  ))
                : null}
            </tbody>
          </table>
        </div>
        <div className="grid2">
          <button
            className="btn-modal-muted"
            type="button"
            onClick={() => {
              setModal("");
            }}
          >
            {translation(
              "3d_printing.table_pending_printer_beds.batch_modal_validate.buttons.cancel",
            )}
          </button>
          <button
            className="btn-modal-secondary"
            type="button"
            onClick={async () => {
              await handle(validatedAligners);
            }}
          >
            {translation(
              "3d_printing.table_pending_printer_beds.batch_modal_validate.buttons.confirm",
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
