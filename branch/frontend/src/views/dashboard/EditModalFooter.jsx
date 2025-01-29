import React from "react";
import CustomTranslation from "@inplan/common/translation/CustomTranslation";
import { useDashboardContext } from "./Context";

export default function EditModalFooter({ confirm }) {
  const { setModal } = useDashboardContext();

  return (
    <div className="grid2">
      <button
        className="btn-modal-muted"
        type="button"
        onClick={() => {
          setModal("");
        }}
      >
        <CustomTranslation text="dashboard.cutlines.form.buttons.cancel" />
      </button>
      <button
        className="btn-modal-secondary"
        type="button"
        onClick={() => {
          confirm();
          setModal("");
        }}
      >
        <CustomTranslation text="dashboard.cutlines.form.buttons.confirm" />
      </button>
    </div>
  );
}
