import React from "react";
import { useTranslation } from "react-i18next";
import { backend } from "@inplan/adapters/apiCalls";
import BatchModalValidate from "@inplan/common/Batch/BatchModalValidate";
import { useBatchContext } from "@inplan/common/Batch/BatchContext";
import { useSnackbar } from "@inplan/contexts/SnackbarContext";
import BatchModalView from "./BatchModalView";

export default function AlignersModalManager() {
  const { setModal, fetchBatches, selectedBatch } = useBatchContext();
  const { t: translation } = useTranslation();
  const showSnackbar = useSnackbar();
  const confirm_order_terminate = async (order_details) => {
    const message = translation("messages.inlase.order_fully_cut", {
      description: order_details.description,
      nb_aligners: order_details.nb_aligners,
    });
    const confirmedTerminate = window.confirm(message);
    if (confirmedTerminate) {
      await backend.post(`orders/${order_details.id}/terminate`);
    }
  };

  const handleArchived = async (validatedAligners) => {
    const { data: responseData } = await backend.post(
      `cutter_batches/${selectedBatch.id}/validate`,
      {
        aligners: validatedAligners.map((aligner) => aligner.id),
      },
    );

    if (
      responseData.validated_aligners > 0 &&
      responseData.not_validated_aligners === 0
    ) {
      showSnackbar(translation("messages.inlase.batch_cut"), "success");
    } else if (responseData.validated_aligners > 0) {
      showSnackbar(
        translation("messages.inlase.batch_partially_cut"),
        "warning",
      );
    } else {
      showSnackbar(
        translation("messages.inlase.no_actual_cut_succeed"),
        "warning",
      );
    }

    responseData.cutted_orders.forEach(async (order) => {
      await confirm_order_terminate(order);
    });

    await fetchBatches();
    setModal("");
  };

  return (
    <>
      <BatchModalView />
      <BatchModalValidate handle={handleArchived} name="aligners" />
    </>
  );
}
