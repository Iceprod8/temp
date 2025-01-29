import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { LiaHandScissorsSolid } from "react-icons/lia";
import { FiEdit } from "react-icons/fi";

import BatchView from "@inplan/common/Batch/BatchView";
import BatchOrdersTable from "@inplan/common/Batch/BatchOrdersTable";
import { useAppContext } from "@inplan/AppContext";
import {
  BatchContextProvider,
  useBatchContext,
} from "@inplan/common/Batch/BatchContext";

import AlignersModalManager from "./ModalManager";

function Actions({ batch }) {
  const { setModal, fetchBatch } = useBatchContext();

  return (
    <>
      <div
        className="btn-rounded-tertiary"
        data-test="batch_modify"
        onClick={() => {
          setModal("modal-batch-view");
          fetchBatch(batch, "select");
        }}
      >
        <FiEdit name="edit" className="icon icon-edit" />
      </div>
      <div
        className="btn-rounded-tertiary"
        onClick={() => {
          setModal("modal-batch-validate");
          fetchBatch(batch, "select");
        }}
      >
        <LiaHandScissorsSolid name="hand-cut" className="icon icon-validate" />
      </div>
    </>
  );
}

export default function Aligners() {
  const { t: translation } = useTranslation();
  const { getUserRights } = useAppContext();
  useEffect(() => {
    getUserRights();
  }, []);
  return (
    // alignerStatus 14 : To cut (not in batch yet)
    <BatchContextProvider
      batchType="CUTTER"
      alignerStatus={14}
      maxBatchSize={100000}
    >
      <BatchView
        subject="aligners"
        pendingTitle={translation("cutting.table_pending_cutting_batches.name")}
        batchTitle={translation(
          "cutting.table_pending_cutting_batches.titles.cutting_batches",
        )}
        Main={
          <BatchOrdersTable
            subject="aligners"
            verb="Prepare tray of"
            maxBatch={100000}
            tableTitle={translation(
              "3d_printing.table_pending_models.aligners",
            )}
          />
        }
        Actions={Actions}
      >
        <AlignersModalManager />
      </BatchView>
    </BatchContextProvider>
  );
}
