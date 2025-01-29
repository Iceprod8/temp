import React, { useEffect, useState } from "react";
import DownloadLink from "react-download-link";
import { useTranslation } from "react-i18next";
import {
  BatchContextProvider,
  useBatchContext,
} from "@inplan/common/Batch/BatchContext";
import { HiCheck } from "react-icons/hi";
import { AiOutlineDownload } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { backend } from "@inplan/adapters/apiCalls";
import BatchView from "@inplan/common/Batch/BatchView";
import BatchOrdersTable from "@inplan/common/Batch/BatchOrdersTable";
import { useAppContext } from "@inplan/AppContext";
import { useSnackbar } from "@inplan/contexts/SnackbarContext";
import ModelsModalManager from "./ModalManager";

function Actions({ batch, batchName }) {
  const { setModal, fetchBatch, setLoading } = useBatchContext();
  const { userData, getUserRights, userRights } = useAppContext();
  const { t: translation } = useTranslation();
  const showSnackbar = useSnackbar();

  const notifyOnlyInLase = () => {
    showSnackbar(
      translation(
        "messages.3d_printing.downloading_models_only_available_using_inlase",
      ),
      "info",
    );
  };

  const [wasDownloaded, setwasDownloaded] = useState(false);

  // Fixme make it a common function
  //  hasInlaseViewAccess
  const hasInlase = userRights?.inlase && userData?.office?.has_inlase > 0;

  useEffect(() => {
    // Batch status 1 means in production, or download
    const downloadedStatus = batch.status && batch.status === 1;
    setwasDownloaded(downloadedStatus);
  }, [batch]);

  return (
    <>
      <div
        className="btn-rounded-tertiary"
        data-test="batch_modify"
        onClick={() => {
          setModal("modal-batch-edit");
          fetchBatch(batch, "select");
        }}
      >
        <FiEdit name="edit" className="icon icon-edit" />
      </div>

      {hasInlase ? (
        <DownloadLink
          className={
            wasDownloaded ? "btn-rounded-secondary" : "btn-rounded-tertiary"
          }
          style={{}}
          tagName="a"
          label={
            <AiOutlineDownload
              name="download"
              className="icon icon-download"
              size={40}
            />
          }
          filename={`${batchName}.zip`}
          exportFile={async () => {
            const updatedRights = await getUserRights();
            if (updatedRights?.printing) {
              setLoading(true);
              try {
                const { data } = await backend.get(
                  `printer_batches/${batch.id}/export`,
                  {
                    responseType: "arraybuffer",
                  },
                );
                fetchBatch(batch, "select");
                setwasDownloaded(true);
                setLoading(false);
                return data;
              } catch (error) {
                setLoading(false);
                showSnackbar(
                  translation("messages.3d_printing.error_downloading_models"),
                  "error",
                );
                throw error;
              }
            }
            return null;
          }}
        />
      ) : (
        <div className="btn-rounded-tertiary" style={{ color: "grey" }}>
          <AiOutlineDownload
            name="download"
            className="icon icon-download"
            size={40}
            onClick={notifyOnlyInLase}
          />
        </div>
      )}

      <div
        className="btn-rounded-secondary"
        onClick={() => {
          setModal("modal-batch-validate");
          fetchBatch(batch, "select");
        }}
      >
        <HiCheck name="arrow-validate" className="icon icon-validate" />
      </div>
    </>
  );
}

export default function Models() {
  const { t: translation } = useTranslation();
  const { getUserRights } = useAppContext();
  useEffect(() => {
    getUserRights();
  }, []);
  return (
    // alignerStatus 10 : To print (not in batch yet)
    <BatchContextProvider
      batchType="PRINTER"
      alignerStatus={10}
      maxBatchSize={100000}
    >
      <BatchView
        subject="models"
        verb="Print"
        pendingTitle={translation(
          "3d_printing.table_pending_printer_beds.name",
        )}
        batchTitle={translation(
          "3d_printing.table_pending_printer_beds.titles.printer_beds",
        )}
        Main={
          <BatchOrdersTable
            subject="models"
            verb="Print"
            tableTitle={translation("3d_printing.table_pending_models.models")}
          />
        }
        Actions={Actions}
      >
        <ModelsModalManager />
      </BatchView>
    </BatchContextProvider>
  );
}
