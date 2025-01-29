import React from "react";
import { useTranslation } from "react-i18next";
import { NotificationManager } from "react-notifications";

import Modal from "@inplan/common/Modal";

import { useDashboardContext } from "./Context";
import Period from "./Period";

export default function CreateModalPeriod() {
  const { t: translation } = useTranslation();

  const { setModal, patient, createPeriod } = useDashboardContext();

  const handleSubmit = async (data) => {
    try {
      const response = await createPeriod(patient.id, data);

      if (response.status === 201) {
        NotificationManager.success(
          translation("messages.period_information.period_created")
        );
      }
      setModal("");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Modal
      onClose={setModal}
      title={translation("dashboard.period_information.create_form.title")}
    >
      <Period
        handleSubmit={handleSubmit}
        submitName={translation(
          "dashboard.period_information.create_form.buttons.create"
        )}
        handleCancel={() => setModal("")}
        cancelName={translation(
          "dashboard.period_information.create_form.buttons.cancel"
        )}
        labelColor="#4b525f"
      />
    </Modal>
  );
}
