import React from "react";
import { NotificationManager } from "react-notifications";
import { useTranslation } from "react-i18next";
import Fade from "@inplan/common/Fade";
import { backend } from "@inplan/adapters/apiCalls";
import BatchModalValidate from "@inplan/common/Batch/BatchModalValidate";

import { useBatchContext } from "@inplan/common/Batch/BatchContext";

import BatchModalEdit from "./BatchModalEdit";

export default function ModelsModalManager() {
  const { modal, setModal, fetchBatches, selectedBatch, unselectBatch } =
    useBatchContext();
  const { t: translation } = useTranslation();

  const handleArchived = async (validatedAligners) => {
    await backend.post(`printer_batches/${selectedBatch.id}/validate`, {
      aligners: validatedAligners.map((a) => a.id),
    });

    NotificationManager.success(
      translation("messages.3d_printing.batch_printed")
    );

    // batch auto delete so just refresh

    await fetchBatches();
    setModal("");
    unselectBatch();
  };

  return (
    <>
      <Fade
        visible={modal === "modal-batch-edit"}
        duration={300}
        zIndex={10000}
        from={{ opacity: 0 }}
      >
        <BatchModalEdit />
      </Fade>

      <Fade
        visible={modal === "modal-batch-validate"}
        duration={300}
        zIndex={10000}
        from={{ opacity: 0 }}
      >
        <BatchModalValidate handle={handleArchived} name="models" />
      </Fade>
    </>
  );
}
