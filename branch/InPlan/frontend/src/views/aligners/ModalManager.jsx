import React from "react";
import { NotificationManager } from "react-notifications";
import { useTranslation } from "react-i18next";

import Fade from "@inplan/common/Fade";
import { backend } from "@inplan/adapters/apiCalls";

import BatchModalValidate from "@inplan/common/Batch/BatchModalValidate";
import { useBatchContext } from "@inplan/common/Batch/BatchContext";

import BatchModalView from "./BatchModalView";

export default function AlignersModalManager() {
  const { modal, setModal, fetchBatches, selectedBatch, unselectBatch } =
    useBatchContext();
  const { t: translation } = useTranslation();
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
      }
    );

    if (
      responseData.validated_aligners > 0 &&
      responseData.not_validated_aligners === 0
    ) {
      NotificationManager.success(translation("messages.inlase.batch_cut"));
    } else if (responseData.validated_aligners > 0) {
      NotificationManager.warning(
        translation("messages.inlase.batch_partially_cut")
      );
    } else {
      NotificationManager.warning(
        translation("messages.inlase.no_actual_cut_succeed")
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
      <Fade
        visible={modal === "modal-batch-view"}
        duration={300}
        zIndex={10000}
        from={{ opacity: 0 }}
      >
        <BatchModalView />
      </Fade>
      <Fade
        visible={modal === "modal-batch-validate"}
        duration={300}
        zIndex={10000}
        from={{ opacity: 0 }}
      >
        <BatchModalValidate handle={handleArchived} name="aligners" />
      </Fade>
    </>
  );
}
