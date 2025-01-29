import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { MdOutlineRemoveCircleOutline } from "react-icons/md";
import { BsCart4 } from "react-icons/bs";

import { CircularProgress } from "@mui/material";

import Modal from "@inplan/common/Modal";
import { backend } from "@inplan/adapters/apiCalls";
import useToggle from "@inplan/common/useToogle";
import BatchFooter from "@inplan/common/Batch/BatchFooter";
import { useBatchContext } from "@inplan/common/Batch/BatchContext";

import { createBatchName } from "@inplan/adapters/functions";

export default function BatchModalEdit() {
  const {
    setModal,
    selectedBatch,
    updateBatch,
    fetchBatches,
    deleteBatch,
    unselectBatch,
  } = useBatchContext();
  const { t: translation } = useTranslation();
  const [init, setInit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [printVertically, setPrintVertically] = useToggle(
    selectedBatch?.angle === 90,
  );
  const [handPrinting, setHandPrinting] = useToggle(selectedBatch?.manual_cut);

  const batchName = createBatchName(selectedBatch, "models", translation);

  useEffect(() => {
    (async () => {
      if (init) {
        setLoading(true);
        const alignersIds = [];
        for (let i = 0; i < selectedBatch.aligners.length; i += 1) {
          alignersIds.push(selectedBatch.aligners[i].id);
        }
        if (printVertically === false) {
          await updateBatch(selectedBatch, {
            aligners: alignersIds,
            angle: 0,
          });
        } else {
          await updateBatch(selectedBatch, {
            aligners: alignersIds,
            angle: 90,
          });
        }
        await fetchBatches();
        setTimeout(() => {
          setLoading(false);
        }, 300);
      }
      setInit(true);
    })();
  }, [printVertically]);

  useEffect(() => {
    (async () => {
      if (init) {
        setLoading(true);
        const alignersIds = [];
        for (let i = 0; i < selectedBatch.aligners.length; i += 1) {
          alignersIds.push(selectedBatch.aligners[i].id);
        }
        if (handPrinting === false) {
          await updateBatch(selectedBatch, {
            aligners: alignersIds,
            manual_cut: false,
          });
        } else {
          await updateBatch(selectedBatch, {
            aligners: alignersIds,
            manual_cut: true,
          });
        }
        await fetchBatches();
        setTimeout(() => {
          setLoading(false);
        }, 300);
      }
      setInit(true);
    })();
  }, [handPrinting]);

  const handleDelete = async (removedAligner) => {
    setLoading(true);
    // Put back aligner to step 10: to be inserted in batch
    await backend.patch(`ordered_aligners/${removedAligner.id}`, {
      process_step: 10,
    });
    const remainingAligners = selectedBatch.aligners.filter(
      (aligner) => aligner.id !== removedAligner.id,
    );
    const aligners = [];
    if (remainingAligners.length === 0) {
      await deleteBatch(selectedBatch);
      await fetchBatches();
      const timer = setTimeout(() => {
        setModal("");
        unselectBatch();
        setLoading(false);
      }, 500);
      return () => clearInterval(timer);
    }
    for (let i = 0; i < remainingAligners.length; i += 1) {
      aligners.push(remainingAligners[i].id);
    }
    await updateBatch(selectedBatch, {
      aligners,
    });
    await fetchBatches();
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    return () => clearInterval(timer);
  };

  // FIXME To be shared
  const goToRelatedOrder = async (aligner) => {
    try {
      const response = await backend.get(
        `ordered_aligners/${aligner.id}/get_order_id`,
      );
      const { order_id } = response.data;
      window.location.href = `orderedit/${order_id}`;
    } catch (error) {
      console.error("Error getting order:", error);
    }
  };

  return (
    <Modal
      title={batchName}
      onClose={(page) => {
        setModal(page);
        unselectBatch();
      }}
    >
      <div className="grid">
        <h4 className="h4">
          {translation(
            "3d_printing.table_pending_printer_beds.batch_modal_edit.name",
          )}
        </h4>
        <div className="grid">
          <table className="table">
            <thead>
              <tr style={{ height: "59px" }}>
                <th>
                  {translation(
                    "3d_printing.table_pending_printer_beds.batch_modal_edit.table.titles.aligners",
                  )}
                </th>
                <th>
                  {translation(
                    "3d_printing.table_pending_printer_beds.batch_modal_edit.table.titles.remove",
                  )}
                </th>
                <th>
                  {translation(
                    "3d_printing.table_pending_printer_beds.batch_modal_edit.table.titles.order",
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="td__loading">
                    <CircularProgress />
                  </td>
                </tr>
              ) : selectedBatch ? (
                selectedBatch.aligners.map((aligner) => (
                  <tr key={aligner.id}>
                    <td>{aligner.short_code}</td>
                    <td className="td__actions td-alignItems">
                      <div
                        className="btn-rounded-danger"
                        onClick={() => handleDelete(aligner)}
                      >
                        <MdOutlineRemoveCircleOutline
                          name="delete"
                          className="icon icon-delete"
                          size={20}
                          style={{
                            fill: "currentColor",
                          }}
                        />
                      </div>
                    </td>
                    <td className="td__actions">
                      <div
                        onClick={() => goToRelatedOrder(aligner)}
                        className="btn-rounded-tertiary"
                      >
                        <BsCart4
                          name="related-order"
                          className="icon icon-delete"
                          size={20}
                          style={{
                            fill: "currentColor",
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : null}
            </tbody>
          </table>
        </div>

        {/* TODO REINTEGRATE PARAMETERS */}
        {/* <h4 className="h4">Printing parameters</h4>
        <div className="grid2">
          <div>
            <h4 className="modal-form__title">Print vertically</h4>
            <CheckBox
              checked={printVertically}
              setChecked={setPrintVertically}
            />
          </div>
          <div>
            <h4 className="modal-form__title">3d cutline</h4>
            <CheckBox checked={handPrinting} setChecked={setHandPrinting} />
          </div>
        </div> */}
        <hr />
      </div>
      <BatchFooter />
    </Modal>
  );
}
