import React from "react";
import { useTranslation } from "react-i18next";
import { CgTrash } from "react-icons/cg";

import { useBatchContext } from "./BatchContext";

export default function BatchFooter() {
  const { setModal, selectedBatch, deleteBatch, unselectBatch } =
    useBatchContext();
  const { t: translation } = useTranslation();
  return (
    <div className="grid">
      <div className="grid">
        <div
          className="modal-batch__delete"
          onClick={async () => {
            await deleteBatch(selectedBatch);
            setModal("");
            unselectBatch();
          }}
        >
          {translation(
            "3d_printing.table_pending_printer_beds.batch_modal_edit.buttons.delete",
          )}
          <CgTrash
            name="delete"
            className="icon icon-delete"
            size={20}
            style={{
              width: "25px",
              height: "25px",
              fill: "currentColor",
            }}
          />
        </div>
      </div>
      <div className="grid2">
        <div />
        <button
          className="btn-modal-muted"
          type="button"
          onClick={() => {
            setModal("");
          }}
        >
          {translation(
            "3d_printing.table_pending_printer_beds.batch_modal_edit.buttons.close",
          )}
        </button>
      </div>
    </div>
  );
}
