import React, { useState } from "react";
import Modal from "@inplan/common/Modal";
import { useSnackbar } from "@inplan/contexts/SnackbarContext";
import { useDashboardContext } from "./Context";

export default function AlignersModal() {
  const {
    setPage,
    setModal,
    currentPeriod,
    fetchPatientModels,
    sheets,
    updatePeriod,
  } = useDashboardContext();
  const showSnackbar = useSnackbar();
  const [fields, setFields] = useState({
    default_sheet: currentPeriod?.default_sheet?.id || "",
  });

  // Right now, no more settings in aligners modal
  const handleChange = (e) => {
    const { value } = e.target;
    setFields({ ...fields, [e.target.name]: value });
  };

  const handleSubmit = async () => {
    try {
      // patch period
      if (currentPeriod) {
        await updatePeriod(currentPeriod.id, fields);
      }

      setPage("");

      // Refresh models of period
      fetchPatientModels();

      showSnackbar("The changes have been recorded.", "success");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal title="Parameters of the aligners" onClose={setModal}>
      <div className="grid">
        <div className="grid2">
          <div>
            <h4 className="modal-form__title">Choice of the sheet</h4>
            <select
              className="select"
              name="default_sheet"
              onChange={handleChange}
            >
              {currentPeriod?.default_sheet ? (
                <option value={currentPeriod.default_sheet.id}>
                  Current: {currentPeriod.default_sheet.provider} -{" "}
                  {currentPeriod.default_sheet.thickness} mm
                </option>
              ) : (
                <option>Choose a sheet</option>
              )}
              {sheets?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.provider} - {s.thickness} mm
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid2">
          <button
            className="btn-modal-muted"
            type="button"
            onClick={() => {
              setModal("");
            }}
          >
            Cancel
          </button>
          <button
            className="btn-modal-secondary"
            type="button"
            onClick={async () => {
              await handleSubmit();
              setModal("");
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
}
