import React from "react";
import { useTranslation } from "react-i18next";
import { backend } from "@inplan/adapters/apiCalls";
import BatchModalValidate from "@inplan/common/Batch/BatchModalValidate";
import { useBatchContext } from "@inplan/common/Batch/BatchContext";
import { useSnackbar } from "@inplan/contexts/SnackbarContext";
import BatchModalEdit from "./BatchModalEdit";

export default function ModelsModalManager() {
  const { setModal, fetchBatches, selectedBatch, unselectBatch } =
    useBatchContext();
  const { t: translation } = useTranslation();
  const showSnackbar = useSnackbar();
  const handleArchived = async (validatedAligners) => {
    await backend.post(`printer_batches/${selectedBatch.id}/validate`, {
      aligners: validatedAligners.map((a) => a.id),
    });
    showSnackbar(translation("messages.3d_printing.batch_printed"), "success");
    await fetchBatches();
    setModal("");
    unselectBatch();
  };

  return (
    <>
      <BatchModalEdit />
      <BatchModalValidate handle={handleArchived} name="models" />
    </>
  );
}
