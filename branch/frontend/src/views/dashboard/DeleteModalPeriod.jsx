import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import Modal from "@inplan/common/Modal";
import { useSnackbar } from "@inplan/contexts/SnackbarContext";
import { useDashboardContext } from "./Context";

export default function DeleteModalPeriod() {
  const {
    setModal,
    currentPeriod,
    setCurrentPeriod,
    deletePeriod,
    fetchPatientPeriods,
  } = useDashboardContext();
  const ref = useRef();
  const { t: translation } = useTranslation();
  const showSnackbar = useSnackbar();
  const handleDelete = async () => {
    setModal("");
    setCurrentPeriod(null);
    await deletePeriod(currentPeriod);
    await fetchPatientPeriods();
    showSnackbar(
      translation("messages.period_information.period_deleted"),
      "success",
    );
  };

  return (
    <Modal
      onClose={setModal}
      title={translation("dashboard.period_information.delete_form.title", {
        period: `${currentPeriod ? currentPeriod.name : null}`,
      })}
    >
      <div className="grid">
        <div className="grid2">
          <button
            className="btn-modal-muted"
            type="button"
            onClick={() => setModal("")}
          >
            {translation(
              "dashboard.period_information.delete_form.buttons.cancel",
            )}
          </button>
          <button
            className="btn-modal-secondary"
            type="button"
            onClick={handleDelete}
          >
            {translation(
              "dashboard.period_information.delete_form.buttons.confirm",
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
